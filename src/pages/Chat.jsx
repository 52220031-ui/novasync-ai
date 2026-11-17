import { useState } from "react";

function Chat() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("general");

  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hello! I am NovaSync AI. How can I help you today?"
    }
  ]);

  function generateReply(text) {
    const question = text.toLowerCase();

    if (question.includes("hello") || question === "hi") {
      return "Hello! How can I help you?";
    }

    if (question.includes("react")) {
      return "React is a JavaScript library for building user interfaces.";
    }

    if (question.includes("javascript")) {
      return "JavaScript is a programming language used in web development.";
    }

    if (question.includes("java")) {
      return "Java is an object-oriented programming language.";
    }

    if (question.includes("water")) {
      return "Remember to drink water regularly throughout the day.";
    }

    if (question.includes("study") || mode === "study") {
      return "Create a study schedule, take short breaks and review your lessons daily.";
    }

    if (question.includes("health") || mode === "health") {
      return "Eat balanced meals, exercise regularly and get enough sleep.";
    }

    return "I am a demo assistant. Try asking me about programming, studying or health.";
  }

  function sendMessage(e) {
    e.preventDefault();

    if (input.trim() === "") return;

    setMessages([
      ...messages,
      { role: "user", text: input },
      { role: "bot", text: generateReply(input) }
    ]);

    setInput("");
  }

  function clearChat() {
    setMessages([
      {
        role: "bot",
        text: "Hello! How can I help you today?"
      }
    ]);

    setInput("");
  }

  return (
    <div className="chat-page">

      <section className="chat-header">
        <h1>NovaSync AI Assistant</h1>
        <p>Your smart academic and wellness assistant.</p>
      </section>

      <div className="chat-container">

        <aside className="chat-sidebar">

          <h2>🤖 NovaSync AI</h2>

          <button onClick={clearChat}>
            + New Chat
          </button>

          <h3>Assistant Mode</h3>

          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
          >
            <option value="general">General</option>
            <option value="study">Study</option>
            <option value="health">Health</option>
          </select>

          <h3>Suggested Questions</h3>

          <button onClick={() => setInput("What is React?")}>
            What is React?
          </button>

          <button onClick={() => setInput("How can I study better?")}>
            How can I study better?
          </button>

          <button onClick={() => setInput("Give me health tips")}>
            Give me health tips
          </button>

        </aside>

        <div className="chat-main">

          <div className="chat-top">
            <h2>AI Assistant</h2>
            <span>● Demo Assistant</span>
          </div>

          <div className="chat-messages">

            {messages.map((message, index) => (
              <div
                key={index}
                className={"chat-message " + message.role}
              >
                <strong>
                  {message.role === "bot"
                    ? "🤖 NovaSync"
                    : "👤 You"}
                </strong>

                <p>{message.text}</p>

              </div>
            ))}

          </div>

          <form className="chat-input" onSubmit={sendMessage}>

            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />

            <button type="submit">
              Send ➤
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}

export default Chat;