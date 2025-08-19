'use client';

import { useSearchParams } from 'next/navigation';
import Chatbot from './Chatbot'; // Import your existing Chatbot component

function getPageContextFromUrl(url) {
    // This helper function does not change
    try {
      const path = new URL(url).pathname;
      if (path === '/') return 'homepage';
      const pathParts = path.split('/').filter(part => part);
      return pathParts[pathParts.length - 1] || 'default';
    } catch (error) {
      return 'default';
    }
  }

export default function ChatbotWrapper() {
  // This hook will now run safely inside a client component.
  const searchParams = useSearchParams();
  const parentUrl = searchParams.get('parentUrl');

  const pageContext = parentUrl ? getPageContextFromUrl(parentUrl) : 'default';

  // Pass the extracted URL down to the main Chatbot component as a prop.
  return <Chatbot parentUrl={pageContext} />;
}