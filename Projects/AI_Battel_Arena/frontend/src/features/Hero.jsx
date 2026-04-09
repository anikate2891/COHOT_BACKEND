import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";
import {sendChat} from "../api/chat.api.js";
import {handleStream} from "../utils/stremHandeler.js";

const Hero = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState("light");
  const [activeMenu, setActiveMenu] = useState("new-chat");
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [problem, setProblem] = useState("");
  const [history, setHistory] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);
  const isInitialRender = useRef(true);

  const menuItems = useMemo(
    () => [
      { id: "new-chat", label: "New Chat" },
      { id: "history", label: "History" },
    ],
    [],
  );

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

  

    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

useEffect(() => {
  fetch("/api/chats", { credentials: "include" })
    .then(res => res.json())
    .then(data => {
      const formatted = data.map(chat => ({
        id: chat._id,
        problem: chat.problem,
        status: "done",
        response: {
          solution_1: chat.solution_1,
          solution_2: chat.solution_2,
          judge: chat.judge
        }
      }));
      setHistory(formatted);
    });
}, []);

  const startNewChat = () => {
    setMessages([]);
    setProblem("");
    setError("");
    setActiveMenu("new-chat");
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuth");
    navigate("/login");
  };

  const sendMessage = async (event) => {
    event.preventDefault();

    const trimmedProblem = problem.trim();
    if (!trimmedProblem || isLoading) {
      return;
    }

    setIsLoading(true);
    setError("");

    const pendingId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const userMessage = {
      id: pendingId,
      problem: trimmedProblem,
      status: "pending",
      response: {
        solution_1: "",
        solution_2: "",
        judge: {},
      },
    };

    setMessages((previousMessages) => [...previousMessages, userMessage]);
    setProblem("");

    try {
        const reader = await sendChat(trimmedProblem);
        await handleStream(reader, pendingId, setMessages);
    } catch (err) {
        setError(err?.message || "Streaming failed");
    } finally {
        setIsLoading(false);
    }
    setHistory(prev => [userMessage, ...prev]);
};

  return (
    <div className={`arena-page theme-${theme}`}>
      <div
        className={`arena-shell ${isMenuOpen ? "menu-open" : "menu-closed"}`}
      >
        <aside className={`menu-sidebar ${isMenuOpen ? "open" : "closed"}`}>
          <div className="menu-head">
            <p className="menu-title">Arena Menu</p>
            <button
              type="button"
              className="menu-close-btn"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close menu"
            >
              X
            </button>
          </div>
          <nav className="menu-list" aria-label="Sidebar menu">
          {menuItems.map((item) => (
            <button
              type="button"
              key={item.id}
              className={`menu-item ${activeMenu === item.id ? "active" : ""}`}
              onClick={() => {
                if (item.id === "history") {
                  setActiveMenu(prev => prev === "history" ? "" : "history");
                } else {
                  setActiveMenu(item.id);
                  if (item.id === "new-chat") startNewChat();
                }
              }}
            >
            {item.label}
          </button>
        ))}
                </nav>

{/* 👇 History list */}
            <div className={`history-list ${activeMenu === "history" ? "open" : ""}`}>
              {history.map(chat => (
                <button
                  key={chat.id}
                  className="menu-item"
                  onClick={() => setMessages([chat])}
                >
                  {chat.problem}
                </button>
              ))}
            </div>
          
          <div className="menu-footer">
            <button
              
              type="button"
              className="menu-logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </aside>

        <main className="chat-main">
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={() =>
              setTheme((previousTheme) =>
                previousTheme === "light" ? "dark" : "light",
              )
            }
            aria-label="Toggle theme"
          >
            {theme === "light" ? "Dark Theme" : "Light Theme"}
          </button>

          {!isMenuOpen ? (
            <button
              type="button"
              className="menu-toggle-btn"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open menu"
            >
              Open Menu
            </button>
          ) : null}

          <header className="arena-header">
            <p className="eyebrow">AI Battle Arena</p>
            <h1>Two Solutions. One Judge.</h1>
            <p className="subhead">
              Ask any problem and get two independent solutions with scored
              judge feedback.
            </p>
          </header>

          <section className="messages">
            {messages.length === 0 ? (
              <div className="empty-state">
                <p>
                  No rounds yet. Send your first problem to start the battle.
                </p>
              </div>
            ) : (
              messages.map((message) => {
                const payload = message.response || {};
                const judge = payload.judge || {};
                const winner =
                  judge.solution_1_score === judge.solution_2_score
                    ? "Tie"
                    : judge.solution_1_score > judge.solution_2_score
                      ? "Solution 1"
                      : "Solution 2";

                return (
                  <article className="chat-thread" key={message.id}>
                    <div className="chat-bubble user">
                      <p className="chat-label">You</p>
                      <p className="problem-text">{message.problem}</p>
                    </div>

                    <div className="chat-bubble assistant">
                      <p className="chat-label">Arena AI</p>

                      {message.status === "pending" ? (
                        <div
                          className="typing-indicator"
                          aria-label="AI is typing"
                        >
                          <span />
                          <span />
                          <span />
                        </div>
                      ) : (
                        <div className="message-card reveal-in">
                          <div className="judge-recommendation reveal-up delay-1">
                            <p className="card-label">Judge Recommendation</p>
                            <p>
                              {winner === "Tie"
                                ? "Both solutions are equally strong according to the judge."
                                : `${winner} is recommended based on the current scores.`}
                            </p>
                          </div>

                          <div className="solutions-grid">
                            <section className="solution-panel reveal-up delay-2">
                              <div className="solution-head">
                                <p className="card-label">Solution 1</p>
                                <span className="score-chip">
                                  Score: {judge.solution_1_score ?? "-"}
                                </span>
                              </div>
                              <div className="markdown-body">
                                <ReactMarkdown>
                                  {payload.solution_1 || ""}
                                </ReactMarkdown>
                              </div>
                              <p className="feedback">
                                {judge.solution_1_feedback}
                              </p>
                            </section>

                            <section className="solution-panel reveal-up delay-3">
                              <div className="solution-head">
                                <p className="card-label">Solution 2</p>
                                <span className="score-chip">
                                  Score: {judge.solution_2_score ?? "-"}
                                </span>
                              </div>
                              <div className="markdown-body">
                                <ReactMarkdown>
                                  {payload.solution_2 || ""}
                                </ReactMarkdown>
                              </div>
                              <p className="feedback">
                                {judge.solution_2_feedback}
                              </p>
                            </section>
                          </div>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </section>

          {error ? <p className="error-banner">{error}</p> : null}

          <form className="prompt-form" onSubmit={sendMessage}>
            <label htmlFor="problem-input">
              Your Problem Reviewed by Two Specialists
            </label>
            <textarea
              id="problem-input"
              value={problem}
              onChange={(event) => setProblem(event.target.value)}
              placeholder="Explain the problem you want solved..."
              rows={4}
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !problem.trim()}>
              {isLoading ? "Thinking..." : "Send To Arena"}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default Hero;
