import { useState } from 'react';
import MessageList from './MessageList';
import LeadForm from './LeadForm';

export default function ChatWindow({ messages, onSendMessage, showLeadForm, onClose, onSubmitLead }) {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="w-80 h-[500px] bg-white rounded-lg shadow-2xl flex flex-col">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 flex justify-between items-center rounded-t-lg">
        <h3 className="font-bold text-lg">Thermenergy Assistant</h3>
        <button onClick={onClose} className="hover:bg-blue-700 p-1 rounded-full">
          &times;
        </button>
      </div>

      {/* Message List */}
      <div className="flex-grow p-4 overflow-y-auto">
        <MessageList messages={messages} />
      </div>

      {/* Input Area or Lead Form */}
      <div className="p-4 border-t border-gray-200">
        {showLeadForm ? (
          <LeadForm onSubmitLead={onSubmitLead} />
        ) : (
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-grow border rounded-lg px-2 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSend}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700"
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
}