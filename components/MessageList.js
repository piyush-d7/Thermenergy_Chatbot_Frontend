import Message from './Message';
import { useRef, useEffect } from 'react';

export default function MessageList({ messages }) {
  const endOfMessagesRef = useRef(null);

  // Automatically scroll to the bottom when new messages are added
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="space-y-4">
      {messages.map((msg, index) => (
        <Message key={index} role={msg.role} content={msg.content} isLoading={msg.isLoading} />
      ))}
      {/* This empty div is the target for our auto-scroll */}
      <div ref={endOfMessagesRef} />
    </div>
  );
}