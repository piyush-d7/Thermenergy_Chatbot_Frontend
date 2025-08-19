
'use client';

import { useState, useEffect } from 'react';
// import { usePathname } from 'next/navigation';
import { useSearchParams } from 'next/navigation'; 
import ChatIcon from './ChatIcon';
import ChatWindow from './ChatWindow';

// The base URL for your FastAPI backend
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// function getPageContextFromUrl(url) {
//   try {
//     const path = new URL(url).pathname;
//     if (path === '/') return 'homepage';
//     const pathParts = path.split('/').filter(part => part);
//     return pathParts[pathParts.length - 1] || 'default';
//   } catch (error) {
//     // If the URL is invalid for some reason, fall back to default
//     return 'default';
//   }
// }
// function getPageContextFromPath(path) {
//   // If it's the homepage, return 'homepage'
//   if (path === '/') {
//   return 'homepage';
//   }
//   // Otherwise, take the last part of the URL, remove trailing slashes
//   const pathParts = path.split('/').filter(part => part); // filter(part => part) removes empty strings
//   return pathParts[pathParts.length - 1] || 'default'; // Return the last part or 'default' if empty
//   }

function postMessageToParent(message) {
  // The '*' means we allow sending to any parent, which is fine for this use case.
  // For higher security, you could replace '*' with the specific Divi site URL.
  window.parent.postMessage(message, '*');
}

export default function Chatbot({ pageContext }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [initialGreeting, setInitialGreeting] = useState('');
  const [showTeaser, setShowTeaser] = useState(false);

  useEffect(() => {
    if (isOpen) {
      postMessageToParent('chatbot-open');
    } else if (showTeaser) {
      postMessageToParent('chatbot-teaser-open');
    } else {
      postMessageToParent('chatbot-close');
    }
  }, [isOpen, showTeaser]);
  // // --- NEW: Get the current path from the router ---
  // const pathname = usePathname();
  // const pageContext = getPageContextFromPath(pathname);

  // const searchParams = useSearchParams();
  // const parentUrl = searchParams.get('parentUrl'); // Get the value of the 'parentUrl' parameter
  
  // Now, derive the pageContext from the parent's URL
  // const pageContext = parentUrl ? getPageContextFromUrl(parentUrl) : 'default';
  console.log("Page context:", pageContext);
  // --- Fetch the initial greeting when the chat opens ---
  useEffect(() => {
    const getGreeting = async () => {
      try {
        const response = await fetch(`${API_URL}/greeting?page_context=${pageContext}`);
        const data = await response.json();
        setInitialGreeting(data.greeting);
        // Show the teaser after a short delay
        setTimeout(() => setShowTeaser(true), 1500); 
      } catch (error) {
        console.error("Failed to fetch greeting:", error);
      }
    };
    getGreeting();
  }, [pageContext]); // Refetch if page changes // This effect runs whenever 'isOpen' changes

  const handleOpenChat = () => {
    // When opening the chat, populate the message list with the greeting
    if (messages.length === 0 && initialGreeting) {
      setMessages([{ role: 'model', content: initialGreeting }]);
    }
    setIsOpen(true);
    setShowTeaser(false); // Hide the teaser when the main window opens
  };
  
  // --- NEW: Handler to close only the teaser ---
  const handleCloseTeaser = () => {
    setShowTeaser(false);
  };


  // --- Send a message to the backend ---
  const handleSendMessage = async (userMessage) => {
    // Add user's message to the UI immediately
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: userMessage,
          session_id: sessionId,
          // On the first message, we send the initial greeting back to the backend
          initial_greeting: messages.length === 1 ? initialGreeting : null,
          page_context: "homepage" // TODO: Make this dynamic
        }),
      });

      const data = await response.json();

      // Check for the special command to show the lead form
      if (data.answer === "__SHOW_LEAD_FORM__") {
        setShowLeadForm(true);
      } else {
        // Otherwise, display the AI's message
        setMessages(prev => [...prev, { role: 'model', content: data.answer }]);
      }
      
      // Update the session ID for subsequent requests
      setSessionId(data.session_id);

    } catch (error) {
      console.error("Failed to send message:", error);
      setMessages(prev => [...prev, { role: 'model', content: "Sorry, something went wrong." }]);
    }
  };


  const handleSubmitLead = async (leadData) => {
    try {
      const response = await fetch(`${API_URL}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit lead.');
      }

      // Display a success message and close the chat
      setMessages(prev => [...prev, { role: 'model', content: "Thank you! Our team will contact you shortly."}]);
      setShowLeadForm(false); // Hide the form

    } catch (error) {
      console.error("Lead submission failed:", error);
      // Optionally, show an error message in the chat
      setMessages(prev => [...prev, { role: 'model', content: "Sorry, there was an error submitting your request. Please try again."}]);
    }
  };

  return (
    <div className="absolute bottom-5 right-5 z-50">
      {isOpen ? (
        <ChatWindow
          messages={messages}
          onSendMessage={handleSendMessage}
          showLeadForm={showLeadForm}
          onClose={() => setIsOpen(false)}
          onSubmitLead={handleSubmitLead}
        />
      ) : (
        <ChatIcon
          onOpen={handleOpenChat}
          onCloseTeaser={handleCloseTeaser}
          showTeaser={showTeaser}
          greeting={initialGreeting}
        />
      )}
    </div>
  );
}