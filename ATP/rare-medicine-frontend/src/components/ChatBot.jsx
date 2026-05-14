import { useState } from "react";
import { Bot, Send, X } from "lucide-react";
import api from "../api/axiosInstance.js";

function ChatBot() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [chat, setChat] = useState([
    {
      from: "bot",
      text: "Hi, I am your RareMed assistant. Ask me about searching medicines, requests or pharmacy stock."
    }
  ]);

  const sendMessage = async (event) => {
    event.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) return;

    setChat((items) => [...items, { from: "user", text: trimmed }]);
    setMessage("");
    setLoading(true);

    try {
      const res = await api.post("/chat-api", { message: trimmed });
      setChat((items) => [...items, { from: "bot", text: res.data.payload.reply }]);
    } catch {
      setChat((items) => [
        ...items,
        { from: "bot", text: "I could not connect to the assistant right now. Please try again." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot">
      {open ? (
        <section className="chat-window">
          <div className="chat-header">
            <div>
              <Bot size={20} />
              <strong>RareMed Chat</strong>
            </div>
            <button className="icon-button" onClick={() => setOpen(false)} aria-label="Close chat">
              <X size={18} />
            </button>
          </div>
          <div className="chat-messages">
            {chat.map((item, index) => (
              <div className={`chat-bubble ${item.from}`} key={`${item.from}-${index}`}>
                {item.text}
              </div>
            ))}
            {loading ? <div className="chat-bubble bot">Typing...</div> : null}
          </div>
          <form className="chat-form" onSubmit={sendMessage}>
            <input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Ask about medicine..." />
            <button className="icon-button" aria-label="Send message">
              <Send size={18} />
            </button>
          </form>
        </section>
      ) : null}

      <button className="chat-toggle" onClick={() => setOpen((value) => !value)} aria-label="Open chat">
        <Bot size={24} />
      </button>
    </div>
  );
}

export default ChatBot;
