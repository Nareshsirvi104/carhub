import React, { useState } from "react";
import axios from "axios";

const ChatBox = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const sendMessage = async () => {
    if (!message) return;

    const userMsg = { sender: "user", text: message };
    setChat((prev) => [...prev, userMsg]);

    try {
      const res = await axios.post("http://localhost:5000/api/chat", {
        message,
      });

      const botMsg = { sender: "bot", text: res.data.reply };
      setChat((prev) => [...prev, botMsg]);
    } catch (error) {
      console.log(error);
    }

    setMessage("");
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          padding: "10px 15px",
          borderRadius: "50%",
          background: "#007bff",
          color: "white",
          border: "none",
          zIndex: 9999,
          cursor: "pointer",
        }}
      >
        💬
      </button>

      {/* Chat Window */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "80px",
            right: "20px",
            width: "300px",
            height: "400px",
            background: "white",
            border: "1px solid #ccc",
            borderRadius: "10px",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "#007bff",
              color: "white",
              padding: "10px",
              textAlign: "center",
            }}
          >
            Car Assistant 🚗
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              padding: "10px",
              overflowY: "auto",
            }}
          >
            {chat.map((msg, index) => (
              <div
                key={index}
                style={{
                  textAlign: msg.sender === "user" ? "right" : "left",
                  marginBottom: "8px",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    padding: "6px 10px",
                    borderRadius: "10px",
                    background:
                      msg.sender === "user" ? "#007bff" : "#eee",
                    color: msg.sender === "user" ? "white" : "black",
                  }}
                >
                  {msg.text}
                </span>
              </div>
            ))}
          </div>

          {/* Input */}
          <div style={{ display: "flex", padding: "5px" }}>
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask about cars..."
              style={{ flex: 1, padding: "5px" }}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBox;