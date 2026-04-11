import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";
import { deleteHistoryChat, sendChat } from "../api/chat.api.js";
import { handleStream } from "../utils/stremHandeler.js";

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

  const mapChatFromApi = useCallback((chat) => ({
    id: chat._id,
    problem: chat.problem,
    status: "done",
    response: {
      solution_1: chat.solution_1,
      solution_2: chat.solution_2,
      judge: chat.judge,
    },
  }), []);

  const loadHistory = useCallback(async () => {
    const res = await fetch("/api/chats", { credentials: "include" });
    if (!res.ok) {
      throw new Error(`Failed to load history: ${res.status}`);
    }
    const data = await res.json();
    setHistory(data.map(mapChatFromApi));
  }, [mapChatFromApi]);

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
    loadHistory().catch(() => {
      setError("Failed to load history");
    });
  }, [loadHistory]);

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
    if (!isPersistedChatId) return;
    try {
      await deleteHistoryChat(chatId);
    } catch (err) {
      setError(err?.message || "Failed to delete chat from server");
    }
  };

  const sendMessage = async (event) => {
    event.preventDefault();
    const trimmedProblem = problem.trim();
    if (!trimmedProblem || isLoading) return;

    setIsLoading(true);
    setError("");

    const pendingId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const userMessage = {
      id: pendingId,
      problem: trimmedProblem,
      status: "pending",
      response: { solution_1: "", solution_2: "", judge: {} },
    };

    setMessages((previousMessages) => [...previousMessages, userMessage]);
    setProblem("");

    try {
      const reader = await sendChat(trimmedProblem);
      await handleStream(reader, pendingId, setMessages);
      await loadHistory();
    } catch (err) {
      setError(err?.message || "Streaming failed");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Theme helpers ──
  const isDark = theme === "dark";
  const bg          = isDark ? "bg-[#0f0f0f]"     : "bg-[#f5f5f0]";
  const surface     = isDark ? "bg-[#1a1a1a]"     : "bg-white";
  const surface2    = isDark ? "bg-[#222]"         : "bg-[#f0efea]";
  const border      = isDark ? "border-[#2a2a2a]"  : "border-[#e5e4de]";
  const textPri     = isDark ? "text-[#ececec]"    : "text-[#111]";
  const textSec     = isDark ? "text-[#888]"       : "text-[#555]";
  const inputBg     = isDark ? "bg-[#1a1a1a]"     : "bg-white";
  const inputBorder = isDark ? "border-[#2e2e2e]"  : "border-[#d5d4ce]";

  return (
    <div className={`flex h-dvh w-screen overflow-hidden font-sans ${bg} ${textPri}`}>
      <div className="flex w-full h-full overflow-hidden">

        {/* ── SIDEBAR ── */}
        <aside
          className={`flex flex-col bg-[#111] text-[#ececec] h-full border-r border-white/5
            transition-all duration-300 ease-in-out flex-shrink-0
            ${isMenuOpen ? "w-[260px] min-w-[260px] opacity-100" : "w-0 min-w-0 opacity-0 pointer-events-none overflow-hidden"}`}
        >
          {/* Head */}
          <div className="flex items-center justify-between px-4 py-5 border-b border-white/[0.06] flex-shrink-0">
            <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#666]">Arena</p>
            <button
              type="button"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close menu"
              className="text-[#666] hover:text-[#ececec] hover:bg-white/10 w-7 h-7 flex items-center justify-center rounded-md transition-all text-xs cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Nav */}
          <nav className="flex flex-col gap-0.5 px-2 pt-2.5 flex-shrink-0">
            {menuItems.map((item) => (
              <button
                type="button"
                key={item.id}
                className={`relative flex items-center gap-2.5 w-full text-left px-3 py-2.5 rounded-lg text-[13.5px] transition-all cursor-pointer
                  ${activeMenu === item.id
                    ? "bg-[#2e2e2e] text-white"
                    : "text-[#ececec] hover:bg-[#1e1e1e] hover:text-white"}`}
                onClick={() => {
                  if (item.id === "history") {
                    setActiveMenu((prev) => (prev === "history" ? "" : "history"));
                  } else {
                    setActiveMenu(item.id);
                    if (item.id === "new-chat") startNewChat();
                  }
                }}
              >
                {activeMenu === item.id && (
                  <span className="absolute left-0 top-[20%] h-[60%] w-[3px] bg-orange-500 rounded-r" />
                )}
                {item.id === "new-chat" ? "✦" : "⏱"} {item.label}
              </button>
            ))}
          </nav>

          {/* History */}
          <div className="flex flex-col flex-1 overflow-hidden">
            {activeMenu === "history" && history.length > 0 && (
              <p className="px-5 pt-3.5 pb-1.5 text-[10px] font-semibold tracking-[0.12em] uppercase text-[#666] flex-shrink-0">
                Recent
              </p>
            )}
            <div
              className={`flex flex-col gap-px px-2 overflow-y-auto transition-all duration-[380ms] ease-in-out
                ${activeMenu === "history" ? "max-h-[500px] opacity-100 py-1" : "max-h-0 opacity-0 pointer-events-none"}`}
              style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.1) transparent" }}
            >
              {history.length === 0 ? (
                <p
                  className="px-5 py-3 text-xs text-[#666] italic opacity-0"
                  style={{ animation: "fadeIn 0.3s ease 0.1s forwards" }}
                >
                  No history yet.
                </p>
              ) : (
                history.map((chat, i) => (
                  <div
                    key={chat.id}
                    className="flex items-center gap-1.5 group opacity-0"
                    style={{
                      animation: "slideInHistory 0.3s ease forwards",
                      animationDelay: `${Math.min(i * 0.03, 0.18)}s`,
                    }}
                  >
                    <button
                      type="button"
                      className="flex-1 min-w-0 text-left px-3 py-2 rounded-lg text-[12.5px] text-[#666]
                        hover:bg-[#1e1e1e] hover:text-white transition-all truncate cursor-pointer"
                      onClick={() => setMessages([chat])}
                    >
                      {chat.problem}
                    </button>
                    <button
                      type="button"
                      className="opacity-0 group-hover:opacity-100 flex-shrink-0 w-7 h-7 flex items-center justify-center
                        rounded-md border border-white/10 text-[#666] text-xs
                        hover:text-red-400 hover:border-red-400/30 hover:bg-red-400/10 transition-all cursor-pointer"
                      onClick={(e) => { e.stopPropagation(); handleDeleteChat(chat.id); }}
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

          {/* Footer */}
          <div className="px-2 pb-4 pt-3 border-t border-white/[0.06] flex-shrink-0">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border border-white/10
                text-[#666] text-[12.5px] hover:bg-red-500/10 hover:text-red-400 hover:border-red-400/30 transition-all cursor-pointer"
              onClick={handleLogout}
            >
              ↩ Logout
            </button>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">

          {/* Top bar */}
          <div className="flex items-center justify-between px-5 py-3 flex-shrink-0">
            <div className="flex items-center gap-2.5">
              {!isMenuOpen && (
                <button
                  type="button"
                  className={`text-xs px-3 py-1.5 rounded-lg border ${border} ${textSec} hover:opacity-80 transition-all cursor-pointer`}
                  onClick={() => setIsMenuOpen(true)}
                  aria-label="Open menu"
                >
                  ☰ Menu
                </button>
              )}
            </div>
            <button
              type="button"
              className={`text-xs px-4 py-1.5 rounded-full border ${border} ${textSec} flex items-center gap-1.5 hover:opacity-80 transition-all cursor-pointer`}
              onClick={() => setTheme((prev) => (prev === "light" ? "dark" : "light"))}
              aria-label="Toggle theme"
            >
              {isDark ? "☀️ Light" : "🌙 Dark"}
            </button>
          </div>

          {/* Header */}
          <header className="text-center px-5 pb-3 shrink-0">
            <p className="text-[10.5px] font-semibold tracking-[0.15em] uppercase text-orange-500 mb-2">
              AI Battle Arena
            </p>
            <h1 className={`text-[clamp(20px,2.5vw,26px)] font-semibold tracking-tight ${textPri} mb-1.5 leading-tight`}>
              Two Solutions. One Judge.
            </h1>
            <p className={`text-[13.5px] ${textSec} max-w-[460px] mx-auto leading-relaxed`}>
              Ask any problem and get two independent AI solutions with scored judge feedback.
            </p>
          </header>

          {/* Messages */}
          <section
            className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-5"
            style={{ scrollbarWidth: "thin" }}
          >
            {messages.length === 0 ? (
              <div className={`flex-1 flex flex-col items-center justify-center gap-4 text-center p-10 ${isDark ? "text-[#444]" : "text-[#999]"}`}>
                <div className={`w-14 h-14 rounded-2xl ${surface2} border ${border} flex items-center justify-center text-2xl mb-1`}>
                  ⚔️
                </div>
                <p className="text-sm leading-relaxed max-w-[340px]">
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
                  <article
                    key={message.id}
                    className="flex flex-col gap-3 opacity-0"
                    style={{ animation: "threadIn 0.35s ease forwards" }}
                  >
                    {/* User bubble */}
                    <div className="flex flex-col items-end gap-1.5 ml-auto max-w-[72%]">
                      <p className={`text-[10.5px] font-semibold tracking-widest uppercase ${textSec} px-1`}>You</p>
                      <p className={`${isDark ? "bg-[#1e1e1e] text-[#ececec]" : "bg-[#111] text-white"} px-4 py-2.5 rounded-2xl rounded-br-sm text-sm leading-relaxed break-words`}>
                        {message.problem}
                      </p>
                    </div>

                    {/* AI bubble */}
                    <div className="flex flex-col gap-1.5">
                      <p className={`text-[10.5px] font-semibold tracking-widest uppercase ${textSec} px-1`}>Arena AI</p>

                      {message.status === "pending" ? (
                        <div className={`flex gap-1.5 px-4 py-3.5 ${isDark ? "bg-[#161616] border-[#2a2a2a]" : "bg-white border-[#e5e4de]"} border rounded-2xl rounded-tl-sm w-fit`}>
                          {[0, 200, 400].map((delay) => (
                            <span
                              key={delay}
                              className={`w-2 h-2 rounded-full ${isDark ? "bg-[#888]" : "bg-[#555]"}`}
                              style={{ animation: `bounce 1.3s infinite`, animationDelay: `${delay}ms` }}
                            />
                          ))}
                        </div>
                      ) : (
                        <div
                          className="flex flex-col gap-3.5 opacity-0"
                          style={{ animation: "revealIn 0.35s ease forwards" }}
                        >
                          {/* Solutions */}
                          <div className="grid grid-cols-2 gap-3.5 max-[700px]:grid-cols-1">
                            {[
                              { label: "Solution 1", content: payload.solution_1, score: judge.solution_1_score, feedback: judge.solution_1_feedback, topBorder: "border-t-blue-500", delay: "0.12s" },
                              { label: "Solution 2", content: payload.solution_2, score: judge.solution_2_score, feedback: judge.solution_2_feedback, topBorder: "border-t-violet-500", delay: "0.19s" },
                            ].map((sol) => (
                              <section
                                key={sol.label}
                                className={`${surface} border ${border} rounded-xl overflow-hidden flex flex-col hover:shadow-lg transition-shadow opacity-0`}
                                style={{ animation: "revealIn 0.4s ease forwards", animationDelay: sol.delay }}
                              >
                                <div className={`flex items-center justify-between px-4 py-3 border-b ${border} ${surface2} border-t-[3px] ${sol.topBorder}`}>
                                  <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-orange-500">{sol.label}</p>
                                  <span className={`font-mono text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${border} ${isDark ? "bg-[#222] text-[#ececec]" : "bg-[#f0efea] text-[#111]"}`}>
                                    {sol.score ?? "-"} pts
                                  </span>
                                </div>
                                <div className={`p-4 text-[13.5px] leading-relaxed ${textPri} flex-1 overflow-x-auto prose prose-sm max-w-none`}>
                                  <ReactMarkdown>{sol.content || ""}</ReactMarkdown>
                                </div>
                                {sol.feedback && (
                                  <p className={`px-4 py-2.5 text-[12.5px] ${textSec} italic border-t ${border}`}>
                                    {sol.feedback}
                                  </p>
                                )}
                              </section>
                            ))}
                          </div>

                          {/* Judge verdict */}
                          <div
                            className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl border border-orange-500/40 opacity-0
                              ${isDark ? "bg-[#1a1408]" : "bg-orange-50"}`}
                            style={{ animation: "revealIn 0.4s ease 0.24s forwards" }}
                          >
                            <span className="text-lg shrink-0">⚖️</span>
                            <div className="flex-1">
                              <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-orange-500 mb-1">Judge Verdict</p>
                              <p className={`text-[13.5px] ${textPri} leading-relaxed`}>
                                {winner === "Tie"
                                  ? "Both solutions are equally strong according to the judge."
                                  : `${winner} is recommended based on the current scores.`}
                              </p>
                            </div>
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

          {/* Error */}
          {error && (
            <p className={`mx-5 mb-2 px-3.5 py-2.5 rounded-lg border text-sm flex-shrink-0
              ${isDark ? "bg-[#1f0808] text-red-400 border-red-900/40" : "bg-red-50 text-red-600 border-red-200"}`}>
              {error}
            </p>
          )}

          {/* ── INPUT — bottom center ── */}
          <div className="flex justify-center px-4 pb-5 pt-2 flex-shrink-0">
            <form
              onSubmit={sendMessage}
              className={`flex items-end gap-2 w-full max-w-2xl rounded-2xl border px-3 py-2.5 transition-all
                ${inputBg} ${inputBorder}
                focus-within:border-orange-500 focus-within:shadow-[0_0_0_3px_rgba(249,115,22,0.1)]`}
            >
              <textarea
                id="problem-input"
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage(e);
                  }
                }}
                placeholder="Ask anything… (Shift+Enter for new line)"
                rows={1}
                disabled={isLoading}
                className={`flex-1 bg-transparent border-none outline-none resize-none text-sm leading-relaxed
                  min-h-[22px] max-h-[120px] ${textPri} placeholder:opacity-50 disabled:opacity-50`}
              />
              <button
                type="submit"
                disabled={isLoading || !problem.trim()}
                className="shrink-0 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-sm font-semibold
                  w-8 h-8 rounded-xl flex items-center justify-center transition-all
                  disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? "·" : "↑"}
              </button>
            </form>
          </div>
        </main>
      </div>

      {/* Keyframes — sirf animations ke liye, no styling */}
      <style>{`
        @keyframes slideInHistory {
          from { opacity: 0; transform: translateX(-10px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes threadIn {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes revealIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30%            { transform: translateY(-6px); opacity: 1; }
        }
        @keyframes fadeIn { to { opacity: 1; } }
      `}</style>
    </div>
  );
};

export default Hero;
