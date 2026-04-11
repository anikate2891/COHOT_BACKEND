import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";
import { deleteHistoryChat, sendChat } from "../api/chat.api.js";
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

  const handleDeleteChat = async (chatId) => {
    const isPersistedChatId = /^[a-f\d]{24}$/i.test(String(chatId));

    setHistory((previousHistory) => previousHistory.filter((chat) => chat.id !== chatId));
    setMessages((previousMessages) => previousMessages.filter((message) => message.id !== chatId));

    if (!isPersistedChatId) {
      return;
    }

    try {
      await deleteHistoryChat(chatId);
    } catch (err) {
      setError(err?.message || "Failed to delete chat from server");
    }
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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --sidebar-w: 260px;
          --radius: 12px;
          --radius-sm: 8px;
          --transition: 0.22s cubic-bezier(0.4,0,0.2,1);
        }

        .theme-light {
          --bg: #f5f5f0;
          --surface: #ffffff;
          --surface2: #f0efea;
          --border: #e5e4de;
          --sidebar-bg: #1a1a1a;
          --sidebar-text: #ececec;
          --sidebar-sub: #8a8a8a;
          --sidebar-hover: #2a2a2a;
          --sidebar-active: #2e2e2e;
          --sidebar-active-bar: #f97316;
          --text-primary: #111111;
          --text-secondary: #555555;
          --user-bubble: #111111;
          --user-bubble-text: #ffffff;
          --ai-bubble: #ffffff;
          --ai-border: #e5e4de;
          --input-bg: #ffffff;
          --input-border: #d5d4ce;
          --input-focus: #111111;
          --btn-primary: #111111;
          --btn-primary-text: #ffffff;
          --btn-hover: #2a2a2a;
          --score-bg: #f0efea;
          --score-text: #111111;
          --judge-bg: #fff8f0;
          --judge-border: #f97316;
          --sol1-accent: #3b82f6;
          --sol2-accent: #8b5cf6;
          --winner-color: #f97316;
          --error-bg: #fef2f2;
          --error-text: #dc2626;
          --empty-text: #999990;
          --history-item-hover: #2e2e2e;
        }

        .theme-dark {
          --bg: #0f0f0f;
          --surface: #1a1a1a;
          --surface2: #222222;
          --border: #2a2a2a;
          --sidebar-bg: #111111;
          --sidebar-text: #ececec;
          --sidebar-sub: #666666;
          --sidebar-hover: #1e1e1e;
          --sidebar-active: #232323;
          --sidebar-active-bar: #f97316;
          --text-primary: #ececec;
          --text-secondary: #888888;
          --user-bubble: #1e1e1e;
          --user-bubble-text: #ececec;
          --ai-bubble: #161616;
          --ai-border: #2a2a2a;
          --input-bg: #1a1a1a;
          --input-border: #2e2e2e;
          --input-focus: #f97316;
          --btn-primary: #f97316;
          --btn-primary-text: #ffffff;
          --btn-hover: #ea6b0c;
          --score-bg: #222222;
          --score-text: #ececec;
          --judge-bg: #1a1408;
          --judge-border: #f97316;
          --sol1-accent: #60a5fa;
          --sol2-accent: #a78bfa;
          --winner-color: #f97316;
          --error-bg: #1f0808;
          --error-text: #f87171;
          --empty-text: #444444;
          --history-item-hover: #1e1e1e;
        }

        /* ── Layout ── */
        .arena-page {
          display: flex;
          height: 100dvh;
          width: 100vw;
          overflow: hidden;
          font-family: 'Sora', sans-serif;
          background: var(--bg);
          color: var(--text-primary);
        }

        .arena-shell {
          display: flex;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        /* ── Sidebar ── */
        .menu-sidebar {
          display: flex;
          flex-direction: column;
          width: var(--sidebar-w);
          min-width: var(--sidebar-w);
          background: var(--sidebar-bg);
          color: var(--sidebar-text);
          height: 100%;
          overflow: hidden;
          transition: width var(--transition), min-width var(--transition), opacity var(--transition);
          border-right: 1px solid rgba(255,255,255,0.05);
        }

        .menu-sidebar.closed {
          width: 0;
          min-width: 0;
          opacity: 0;
          pointer-events: none;
        }

        .menu-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 16px 14px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          flex-shrink: 0;
        }

        .menu-title {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--sidebar-sub);
        }

        .menu-close-btn {
          background: none;
          border: none;
          color: var(--sidebar-sub);
          cursor: pointer;
          font-size: 13px;
          width: 26px;
          height: 26px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          transition: background var(--transition), color var(--transition);
        }

        .menu-close-btn:hover {
          background: rgba(255,255,255,0.08);
          color: var(--sidebar-text);
        }

        /* Nav */
        .menu-list {
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding: 10px 8px 0;
          flex-shrink: 0;
        }

        .menu-item {
          display: flex;
          align-items: center;
          gap: 10px;
          background: none;
          border: none;
          color: var(--sidebar-text);
          cursor: pointer;
          font-family: 'Sora', sans-serif;
          font-size: 13.5px;
          font-weight: 400;
          padding: 9px 12px;
          border-radius: var(--radius-sm);
          text-align: left;
          transition: background var(--transition), color var(--transition);
          width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          position: relative;
        }

        .menu-item:hover {
          background: var(--sidebar-hover);
          color: #ffffff;
        }

        .menu-item.active {
          background: var(--sidebar-active);
          color: #ffffff;
        }

        .menu-item.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 20%;
          height: 60%;
          width: 3px;
          background: var(--sidebar-active-bar);
          border-radius: 0 3px 3px 0;
        }

        /* History */
        .history-section {
          flex: 1;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .history-header {
          padding: 14px 20px 6px;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--sidebar-sub);
          flex-shrink: 0;
        }

        .history-list {
          display: flex;
          flex-direction: column;
          gap: 1px;
          padding: 4px 8px;
          overflow-y: auto;
          flex: 1;
          max-height: 0;
          opacity: 0;
          transition: max-height 0.38s cubic-bezier(0.4,0,0.2,1), opacity 0.28s ease;
        }

        .history-list.open {
          max-height: 500px;
          opacity: 1;
        }

        .history-list::-webkit-scrollbar { width: 4px; }
        .history-list::-webkit-scrollbar-track { background: transparent; }
        .history-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

        .history-list .menu-item {
          font-size: 12.5px;
          color: var(--sidebar-sub);
          padding: 8px 12px;
          animation: slideInHistory 0.3s ease forwards;
          animation-fill-mode: both;
        }

        .history-list .menu-item:nth-child(1)  { animation-delay: 0.03s; }
        .history-list .menu-item:nth-child(2)  { animation-delay: 0.06s; }
        .history-list .menu-item:nth-child(3)  { animation-delay: 0.09s; }
        .history-list .menu-item:nth-child(4)  { animation-delay: 0.12s; }
        .history-list .menu-item:nth-child(5)  { animation-delay: 0.15s; }
        .history-list .menu-item:nth-child(n+6){ animation-delay: 0.18s; }

        @keyframes slideInHistory {
          from { opacity: 0; transform: translateX(-10px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        .history-list .menu-item:hover { color: #ffffff; }

        /* History item dot */
        .history-list .menu-item::after {
          content: '';
          flex-shrink: 0;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--sidebar-sub);
          margin-left: auto;
          opacity: 0;
          transition: opacity var(--transition);
        }

        .history-list .menu-item:hover::after { opacity: 1; }

        .history-entry {
          display: flex;
          align-items: center;
          gap: 6px;
          animation: slideInHistory 0.3s ease forwards;
          animation-fill-mode: both;
        }

        .history-entry:nth-child(1)  { animation-delay: 0.03s; }
        .history-entry:nth-child(2)  { animation-delay: 0.06s; }
        .history-entry:nth-child(3)  { animation-delay: 0.09s; }
        .history-entry:nth-child(4)  { animation-delay: 0.12s; }
        .history-entry:nth-child(5)  { animation-delay: 0.15s; }
        .history-entry:nth-child(n+6){ animation-delay: 0.18s; }

        .history-chat-btn {
          flex: 1;
          min-width: 0;
        }

        .history-delete-btn {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.12);
          color: var(--sidebar-sub);
          cursor: pointer;
          width: 26px;
          height: 26px;
          border-radius: 6px;
          font-size: 13px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: background var(--transition), color var(--transition), border-color var(--transition);
        }

        .history-delete-btn:hover {
          color: #f87171;
          border-color: rgba(248,113,113,0.35);
          background: rgba(248,113,113,0.12);
        }

        /* Empty history */
        .history-empty {
          padding: 12px 20px;
          font-size: 12px;
          color: var(--sidebar-sub);
          font-style: italic;
          opacity: 0;
          animation: fadeIn 0.3s ease 0.1s forwards;
        }

        @keyframes fadeIn { to { opacity: 1; } }

        .menu-footer {
          padding: 12px 8px 16px;
          border-top: 1px solid rgba(255,255,255,0.06);
          flex-shrink: 0;
        }

        .menu-logout-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: none;
          border: 1px solid rgba(255,255,255,0.1);
          color: var(--sidebar-sub);
          cursor: pointer;
          font-family: 'Sora', sans-serif;
          font-size: 12.5px;
          padding: 9px 12px;
          border-radius: var(--radius-sm);
          width: 100%;
          transition: background var(--transition), color var(--transition), border-color var(--transition);
        }

        .menu-logout-btn:hover {
          background: rgba(239,68,68,0.1);
          color: #f87171;
          border-color: rgba(239,68,68,0.3);
        }

        /* ── Main ── */
        .chat-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          overflow: hidden;
          position: relative;
        }

        /* Top bar */
        .top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 6px 20px 4px;
          border-bottom: none;
          background: transparent;
          flex-shrink: 0;
          gap: 12px;
        }

        .top-bar-left { display: flex; align-items: center; gap: 10px; }

        .menu-toggle-btn {
          background: none;
          border: 1px solid var(--border);
          color: var(--text-secondary);
          cursor: pointer;
          font-family: 'Sora', sans-serif;
          font-size: 12px;
          padding: 6px 12px;
          border-radius: var(--radius-sm);
          transition: background var(--transition), color var(--transition);
          white-space: nowrap;
        }

        .menu-toggle-btn:hover {
          background: var(--surface2);
          color: var(--text-primary);
        }

        .theme-toggle-btn {
          background: none;
          border: 1px solid var(--border);
          color: var(--text-secondary);
          cursor: pointer;
          font-family: 'Sora', sans-serif;
          font-size: 12px;
          padding: 6px 14px;
          border-radius: 99px;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: background var(--transition), color var(--transition);
          white-space: nowrap;
        }

        .theme-toggle-btn:hover {
          background: var(--surface2);
          color: var(--text-primary);
        }

        /* Header */
        .arena-header {
          text-align: center;
          padding: 0 20px 8px;
          margin-top: -25px;
          flex-shrink: 0;
        }

        .eyebrow {
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--sidebar-active-bar);
          margin-bottom: 8px;
        }

        .arena-header h1 {
          font-size: clamp(20px, 2.5vw, 26px);
          font-weight: 600;
          letter-spacing: -0.03em;
          color: var(--text-primary);
          margin-bottom: 6px;
          line-height: 1.2;
        }

        .subhead {
          font-size: 13.5px;
          color: var(--text-secondary);
          max-width: 460px;
          margin: 0 auto 2px;
          line-height: 1.6;
        }

        /* Messages */
        .messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px 20px 8px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .messages::-webkit-scrollbar { width: 4px; }
        .messages::-webkit-scrollbar-track { background: transparent; }
        .messages::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

        .empty-state {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          padding: 40px;
          text-align: center;
          color: var(--empty-text);
        }

        .empty-state-icon {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          background: var(--surface2);
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          margin-bottom: 4px;
        }

        .empty-state p { font-size: 14px; line-height: 1.6; max-width: 340px; }

        /* Chat thread */
        .chat-thread {
          display: flex;
          flex-direction: column;
          gap: 12px;
          animation: threadIn 0.35s ease forwards;
        }

        @keyframes threadIn {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .chat-bubble {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .chat-bubble.user {
          align-items: flex-end;
          margin-left: auto;
          max-width: 72%;
        }

        .chat-label {
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-secondary);
          padding: 0 4px;
        }

        .problem-text {
          background: var(--user-bubble);
          color: var(--user-bubble-text);
          padding: 11px 16px;
          border-radius: 16px 16px 4px 16px;
          font-size: 14px;
          line-height: 1.55;
          max-width: 72%;
          word-break: break-word;
        }

        /* Typing indicator */
        .typing-indicator {
          display: flex;
          gap: 5px;
          padding: 14px 18px;
          background: var(--ai-bubble);
          border: 1px solid var(--ai-border);
          border-radius: 4px 16px 16px 16px;
          width: fit-content;
        }

        .typing-indicator span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--text-secondary);
          animation: bounce 1.3s infinite;
        }

        .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
        .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30%            { transform: translateY(-6px); opacity: 1; }
        }

        /* Message card */
        .message-card {
          display: flex;
          flex-direction: column;
          gap: 14px;
          max-width: 100%;
        }

        @keyframes reveal-in {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .reveal-in  { animation: reveal-in 0.35s ease forwards; }
        .reveal-up  { animation: reveal-in 0.4s ease forwards; }
        .delay-1    { animation-delay: 0.05s; }
        .delay-2    { animation-delay: 0.12s; }
        .delay-3    { animation-delay: 0.19s; }

        /* Judge */
        .judge-recommendation {
          background: var(--judge-bg);
          border: 1px solid var(--judge-border);
          border-radius: var(--radius);
          padding: 14px 18px;
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .judge-icon {
          font-size: 18px;
          flex-shrink: 0;
        }

        .judge-text { flex: 1; }

        .card-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--sidebar-active-bar);
          margin-bottom: 4px;
        }

        .judge-recommendation p:last-child {
          font-size: 13.5px;
          color: var(--text-primary);
          line-height: 1.5;
        }

        /* Solutions grid */
        .solutions-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        @media (max-width: 700px) {
          .solutions-grid { grid-template-columns: 1fr; }
          .problem-text { max-width: 92%; }
        }

        .solution-panel {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: box-shadow var(--transition);
        }

        .solution-panel:hover {
          box-shadow: 0 4px 20px rgba(0,0,0,0.07);
        }

        .solution-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          border-bottom: 1px solid var(--border);
          background: var(--surface2);
        }

        .sol1 .solution-head { border-top: 3px solid var(--sol1-accent); }
        .sol2 .solution-head { border-top: 3px solid var(--sol2-accent); }

        .score-chip {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          font-weight: 500;
          background: var(--score-bg);
          color: var(--score-text);
          border: 1px solid var(--border);
          padding: 3px 10px;
          border-radius: 99px;
        }

        .markdown-body {
          padding: 14px 16px;
          font-size: 13.5px;
          line-height: 1.65;
          color: var(--text-primary);
          flex: 1;
          overflow-x: auto;
        }

        .markdown-body code {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          background: var(--surface2);
          padding: 2px 6px;
          border-radius: 4px;
        }

        .markdown-body pre {
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          padding: 12px 14px;
          overflow-x: auto;
          margin: 8px 0;
        }

        .markdown-body pre code { background: none; padding: 0; }

        .feedback {
          padding: 10px 16px 14px;
          font-size: 12.5px;
          color: var(--text-secondary);
          line-height: 1.55;
          border-top: 1px solid var(--border);
          font-style: italic;
        }

        /* Error */
        .error-banner {
          margin: 0 20px 8px;
          background: var(--error-bg);
          color: var(--error-text);
          border: 1px solid rgba(220,38,38,0.2);
          border-radius: var(--radius-sm);
          padding: 10px 14px;
          font-size: 13px;
          flex-shrink: 0;
        }

        /* Prompt form */

        .prompt-form label {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-secondary);
        }

        .prompt-wrapper {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--input-bg);
          border: 1px solid var(--input-border);
          border-radius: 14px;
          padding: 7px 8px 7px 12px;
          transition: border-color var(--transition), box-shadow var(--transition);
        }

        .prompt-wrapper:focus-within {
          border-color: var(--input-focus);
          box-shadow: 0 0 0 2px rgba(249,115,22,0.1);
        }

        .prompt-form textarea {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          resize: none;
          font-family: 'Sora', sans-serif;
          font-size: 13px;
          color: var(--text-primary);
          line-height: 1.45;
          min-height: 15px;
          max-height: 100px;
        }

        .prompt-form textarea::placeholder { color: var(--text-secondary); opacity: 0.7; }
        .prompt-form textarea:disabled { opacity: 0.5; }

        .send-btn {
          background: var(--btn-primary);
          color: var(--btn-primary-text);
          border: none;
          cursor: pointer;
          font-family: 'Sora', sans-serif;
          font-size: 12px;
          font-weight: 500;
          padding: 7px 14px;
          border-radius: var(--radius-sm);
          transition: background var(--transition), opacity var(--transition), transform 0.12s ease;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .send-btn:hover:not(:disabled) {
          background: var(--btn-hover);
          transform: translateY(-1px);
        }

        .send-btn:active:not(:disabled) { transform: translateY(0); }
        .send-btn:disabled { opacity: 0.45; cursor: not-allowed; }
      `}</style>

      <div className={`arena-page theme-${theme}`}>
        <div className={`arena-shell ${isMenuOpen ? "menu-open" : "menu-closed"}`}>

          {/* ── Sidebar ── */}
          <aside className={`menu-sidebar ${isMenuOpen ? "open" : "closed"}`}>
            <div className="menu-head">
              <p className="menu-title">Arena</p>
              <button
                type="button"
                className="menu-close-btn"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close menu"
              >
                ✕
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
                  {item.id === "new-chat" ? "✦ " : "⏱ "}
                  {item.label}
                </button>
              ))}
            </nav>

            {/* History list with animation */}
            <div className="history-section">
              {activeMenu === "history" && history.length > 0 && (
                <p className="history-header">Recent</p>
              )}
              <div className={`history-list ${activeMenu === "history" ? "open" : ""}`}>
                {history.length === 0 ? (
                  <p className="history-empty">No history yet.</p>
                ) : (
                  history.map(chat => (
                    <div key={chat.id} className="history-entry">
                      <button
                        type="button"
                        className="menu-item history-chat-btn"
                        onClick={() => setMessages([chat])}
                      >
                        {chat.problem}
                      </button>
                      <button
                        type="button"
                        className="history-delete-btn"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleDeleteChat(chat.id);
                        }}
                        aria-label="Delete chat"
                        title="Delete chat"
                      >
                        ✕
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="menu-footer">
              <button
                type="button"
                className="menu-logout-btn"
                onClick={handleLogout}
              >
                ↩ Logout
              </button>
            </div>
          </aside>

          {/* ── Main ── */}
          <main className="chat-main">

            {/* Top bar */}
            <div className="top-bar">
              <div className="top-bar-left">
                {!isMenuOpen && (
                  <button
                    type="button"
                    className="menu-toggle-btn"
                    onClick={() => setIsMenuOpen(true)}
                    aria-label="Open menu"
                  >
                    ☰ Menu
                  </button>
                )}
              </div>
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
                {theme === "light" ? "🌙 Dark" : "☀️ Light"}
              </button>
            </div>

            {/* Header */}
            <header className="arena-header">
              <p className="eyebrow">AI Battle Arena</p>
              <h1>Two Solutions. One Judge.</h1>
              <p className="subhead">
                Ask any problem and get two independent AI solutions with scored judge feedback.
              </p>
            </header>

            {/* Messages */}
            <section className="messages">
              {messages.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">⚔️</div>
                  <p>No rounds yet. Send your first problem to start the battle.</p>
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
                          <div className="typing-indicator" aria-label="AI is typing">
                            <span /><span /><span />
                          </div>
                        ) : (
                          <div className="message-card reveal-in">
                            <div className="judge-recommendation reveal-up delay-1">
                              <div className="judge-icon">⚖️</div>
                              <div className="judge-text">
                                <p className="card-label">Judge Verdict</p>
                                <p>
                                  {winner === "Tie"
                                    ? "Both solutions are equally strong according to the judge."
                                    : `${winner} is recommended based on the current scores.`}
                                </p>
                              </div>
                            </div>

                            <div className="solutions-grid">
                              <section className="solution-panel sol1 reveal-up delay-2">
                                <div className="solution-head">
                                  <p className="card-label">Solution 1</p>
                                  <span className="score-chip">
                                    {judge.solution_1_score ?? "-"} pts
                                  </span>
                                </div>
                                <div className="markdown-body">
                                  <ReactMarkdown>{payload.solution_1 || ""}</ReactMarkdown>
                                </div>
                                <p className="feedback">{judge.solution_1_feedback}</p>
                              </section>

                              <section className="solution-panel sol2 reveal-up delay-3">
                                <div className="solution-head">
                                  <p className="card-label">Solution 2</p>
                                  <span className="score-chip">
                                    {judge.solution_2_score ?? "-"} pts
                                  </span>
                                </div>
                                <div className="markdown-body">
                                  <ReactMarkdown>{payload.solution_2 || ""}</ReactMarkdown>
                                </div>
                                <p className="feedback">{judge.solution_2_feedback}</p>
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

            {/* Input */}
            <form className="prompt-form" onSubmit={sendMessage}>
              <label htmlFor="problem-input">
                Your Problem — Reviewed by Two Specialists
              </label>
              <div className="prompt-wrapper">
                <textarea
                  id="problem-input"
                  value={problem}
                  onChange={(event) => setProblem(event.target.value)}
                  placeholder="Explain the problem you want solved..."
                  rows={1}
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  className="send-btn"
                  disabled={isLoading || !problem.trim()}
                >
                  {isLoading ? "Thinking…" : "Send ↑"}
                </button>
              </div>
            </form>

          </main>
        </div>
      </div>
    </>
  );
};

export default Hero;
