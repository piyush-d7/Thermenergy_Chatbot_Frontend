import Chatbot from '@/components/Chatbot';
import { Suspense } from 'react';
import ChatbotWrapper from '@/components/ChatbotWrapper';
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {/* <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold">Thermenergy Website Content</h1>
      </div> */}

      {/* This adds the chatbot to your page */}
      <Suspense fallback={<div>Loading...</div>}>
        <ChatbotWrapper />
      </Suspense>
      {/* <Chatbot /> */}
    </main>
  );
}