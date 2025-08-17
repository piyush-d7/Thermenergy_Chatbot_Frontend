
'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import ChatIcon from './ChatIcon';
import ChatWindow from './ChatWindow';

// The base URL for your FastAPI backend
const API_URL = "http://127.0.0.1:8000";

function getPageContextFromPath(path) {
  // If it's the homepage, return 'homepage'
  if (path === '/') {
  return 'homepage';
  }
  // Otherwise, take the last part of the URL, remove trailing slashes
  const pathParts = path.split('/').filter(part => part); // filter(part => part) removes empty strings
  return pathParts[pathParts.length - 1] || 'default'; // Return the last part or 'default' if empty
  }

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [initialGreeting, setInitialGreeting] = useState('');
  const [showTeaser, setShowTeaser] = useState(false);

  // --- NEW: Get the current path from the router ---
  const pathname = usePathname();
  const pageContext = getPageContextFromPath(pathname);

  // --- Fetch the initial greeting when the chat opens ---
  useEffect(() => {
    const getGreeting = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/greeting?page_context=${pageContext}`);
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
    <div className="fixed bottom-5 right-5 z-50">
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

