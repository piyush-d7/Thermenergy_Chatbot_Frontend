export default function ChatIcon({ onOpen, onCloseTeaser, showTeaser, greeting }) {
  return (
    <div className="relative">
      {/* --- Pop-out Teaser Message --- */}
      {showTeaser && greeting && (
        <div className="group absolute bottom-0 right-20 w-64 bg-white p-4 rounded-lg shadow-xl transition-all duration-300 transform-gpu animate-fade-in-up">
          <p className="text-sm text-gray-800">{greeting}</p>
          {/* Close button appears on hover */}
          <button
            onClick={onCloseTeaser}
            className="absolute top-1 right-1 bg-gray-200 text-gray-600 w-5 h-5 rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Close greeting"
          >
            &times;
          </button>
        </div>
      )}

      {/* --- Main Chat Icon Button --- */}
      <button
        onClick={onOpen}
        className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-transform duration-200 hover:scale-110"
        aria-label="Open chat"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </button>
    </div>
  );
}