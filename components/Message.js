export default function Message({ role, content }) {
  const isUser = role === 'user';
  const senderName = isUser ? 'You' : 'Matthew The HVAC Hero';

  // Define base styles and role-specific styles
  const containerClass = `flex flex-col ${isUser ? 'items-end' : 'items-start'}`;
  const bubbleClass = `max-w-xs lg:max-w-md px-4 py-2 rounded-2xl`;
  const userBubbleStyles = 'bg-blue-600 text-white rounded-br-lg';
  const modelBubbleStyles = 'bg-gray-200 text-gray-800 rounded-bl-lg';
  const nameClass = `text-xs text-gray-500 mb-1 px-1`;

  return (
    <div className={containerClass}>
      {/* Sender Name */}
      <span className={nameClass}>
        {senderName}
      </span>
      {/* Message Bubble */}
      <div className={`${bubbleClass} ${isUser ? userBubbleStyles : modelBubbleStyles}`}>
        {content}
      </div>
    </div>
  );
}