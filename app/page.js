"use client";

import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!message.trim() || loading) return;

    setLoading(true);
    setReply("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const text = await res.text();
console.log("API RESPONSE:", text);
const data = text ? JSON.parse(text) : {};
      if (!res.ok) throw new Error(data.error);

      setReply(data.reply);
      setMessage("");
    } catch (error) {
      setReply("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{
      minHeight: "100vh",
      background: "#080611",
      color: "white",
      padding: "30px",
      fontFamily: "Arial"
    }}>
      <h1 style={{ color: "#a855f7" }}>🤖 RoboDegen</h1>
      <p>AI Crypto Agent Intelligence</p>

      <div style={{ maxWidth: "650px", margin: "50px auto" }}>
        <h2>AI Crypto Chat</h2>
        <p>Ask RoboDegen anything about crypto.</p>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask RoboDegen..."
          style={{
            width: "100%",
            height: "120px",
            padding: "15px",
            background: "#171226",
            color: "white",
            border: "1px solid #7e22ce",
            borderRadius: "12px"
          }}
        />

        <button
          onClick={sendMessage}
          disabled={loading}
          style={{
            marginTop: "15px",
            padding: "12px 25px",
            background: "#9333ea",
            color: "white",
            border: "none",
            borderRadius: "8px"
          }}
        >
          {loading ? "Thinking..." : "Send Message"}
        </button>

        {reply && (
          <div style={{
            marginTop: "25px",
            padding: "20px",
            background: "#171226",
            borderRadius: "12px",
            whiteSpace: "pre-wrap"
          }}>
            <h3>RoboDegen AI</h3>
            {reply}
          </div>
        )}
      </div>
    </main>
  );
}