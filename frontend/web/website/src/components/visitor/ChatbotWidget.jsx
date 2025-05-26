// components/visitor/ChatbotWidget.jsx
import React, { useState, useRef, useEffect } from "react";
import { API_URL } from "../../config/apiConfig";

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      // Try to use API first
      try {
        const res = await fetch(`${API_URL}/api/chatbot`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: input }),
        });

        if (res.ok) {
          const data = await res.json();
          const botMessage = {
            role: "bot",
            content: data.answer || "No response",
          };
          setMessages((prev) => [...updatedMessages, botMessage]);
          setLoading(false);
          return;
        }
      } catch (apiErr) {
        console.error("Chatbot API error:", apiErr);
      }

      // If API fails, use hardcoded responses
      let botResponse =
        "I'm sorry, I can't connect to the server right now. Please try again later or contact the park office for assistance.";

      // Simple keyword response system as fallback
      const lowercaseInput = input.toLowerCase();
      if (lowercaseInput.includes("hello") || lowercaseInput.includes("hi")) {
        botResponse =
          "Hello! How can I help you with information about our park today?";
      } else if (
        lowercaseInput.includes("hours") ||
        lowercaseInput.includes("open")
      ) {
        botResponse = "Our park is open from 8:00 AM to 6:00 PM every day.";
      } else if (
        lowercaseInput.includes("training") ||
        lowercaseInput.includes("course")
      ) {
        botResponse =
          "We offer several training modules for park guides. You can browse them in the training section after logging in.";
      } else if (
        lowercaseInput.includes("contact") ||
        lowercaseInput.includes("support")
      ) {
        botResponse =
          "You can reach our support team at support@parkguide.com or visit our contact page.";
      }

      const botMessage = {
        role: "bot",
        content: botResponse,
      };
      setMessages((prev) => [...updatedMessages, botMessage]);
    } catch (err) {
      console.error("Chatbot system error:", err);
      setMessages((prev) => [
        ...updatedMessages,
        {
          role: "bot",
          content: "⚠️ Sorry, something went wrong with the chat system.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Toggle Button - Now with a cleaner icon style */}
      <button
        className={`w-14 h-14 rounded-full shadow-lg transition-all flex items-center justify-center ${
          isOpen
            ? "bg-green-600 hover:bg-green-700 text-white"
            : "bg-green-600 hover:bg-green-700 text-white"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
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
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="mt-3 w-80 h-[500px] bg-white border border-gray-200 rounded-xl shadow-xl flex flex-col animate-fade-in overflow-hidden">
          {/* Header: AI Customer Service Label */}
          <div className="px-4 py-2 bg-green-600 text-white font-semibold text-center rounded-t-xl select-none">
            AI Customer Service 24/7
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50">
            {messages.length === 0 && (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                Ask me anything!!
              </div>
            )}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-3 py-2 max-w-[80%] rounded-lg text-sm whitespace-pre-line flex items-start ${
                    msg.role === "user"
                      ? "bg-green-600 text-white rounded-br-none"
                      : "bg-gray-200 text-gray-800 rounded-bl-none"
                  }`}
                >
                  {msg.role === "bot" && (
                    <div className="mr-2 mt-0.5 flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                  <div>{msg.content}</div>
                  {msg.role === "user" && (
                    <div className="ml-2 mt-0.5 flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-green-200"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="px-3 py-2 bg-gray-200 rounded-lg text-sm text-gray-500 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 animate-spin mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t bg-white flex items-center gap-2">
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-400 outline-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your message here..."
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className={`text-white text-sm p-2 rounded-lg transition ${
                loading
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                style={{ transform: "rotate(45deg)" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotWidget;
