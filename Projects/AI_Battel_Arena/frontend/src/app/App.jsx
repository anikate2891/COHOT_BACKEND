import { useState } from 'react'
import ReactMarkdown from 'react-markdown'

const App = () => {
  const [problem, setProblem] = useState('')
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const sendMessage = async (event) => {
    event.preventDefault()

    const trimmedProblem = problem.trim()
    if (!trimmedProblem || isLoading) {
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ problem: trimmedProblem }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.message || 'Failed to fetch AI response.')
      }

      setMessages((previousMessages) => [...previousMessages, data])
      setProblem('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error occurred.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="arena-page">
      <div className="arena-shell">
        <header className="arena-header">
          <p className="eyebrow">AI Battle Arena</p>
          <h1>Two Solutions. One Judge.</h1>
          <p className="subhead">
            Ask any problem and get two independent solutions with scored judge feedback.
          </p>
        </header>

        <form className="prompt-form" onSubmit={sendMessage}>
          <label htmlFor="problem-input">Your Problem</label>
          <textarea
            id="problem-input"
            value={problem}
            onChange={(event) => setProblem(event.target.value)}
            placeholder="Explain the problem you want solved..."
            rows={4}
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading || !problem.trim()}>
            {isLoading ? 'Thinking...' : 'Send To Arena'}
          </button>
        </form>

        {error ? <p className="error-banner">{error}</p> : null}

        <section className="messages">
          {messages.length === 0 ? (
            <div className="empty-state">
              <p>No rounds yet. Send your first problem to start the battle.</p>
            </div>
          ) : (
            messages.map((message, index) => {
              const judge = message.judge || {}
              const winner =
                judge.solution_1_score === judge.solution_2_score
                  ? 'Tie'
                  : judge.solution_1_score > judge.solution_2_score
                    ? 'Solution 1'
                    : 'Solution 2'

              return (
                <article className="message-card" key={`${message.problem}-${index}`}>
                  <div className="problem-block">
                    <p className="card-label">Problem</p>
                    <p className="problem-text">{message.problem}</p>
                  </div>

                  <div className="solutions-grid">
                    <section className="solution-panel">
                      <div className="solution-head">
                        <p className="card-label">Solution 1</p>
                        <span className="score-chip">Score: {judge.solution_1_score ?? '-'}</span>
                      </div>
                      <div className="markdown-body">
                        <ReactMarkdown>{message.solution_1 || ''}</ReactMarkdown>
                      </div>
                      <p className="feedback">{judge.solution_1_feedback}</p>
                    </section>

                    <section className="solution-panel">
                      <div className="solution-head">
                        <p className="card-label">Solution 2</p>
                        <span className="score-chip">Score: {judge.solution_2_score ?? '-'}</span>
                      </div>
                      <div className="markdown-body">
                        <ReactMarkdown>{message.solution_2 || ''}</ReactMarkdown>
                      </div>
                      <p className="feedback">{judge.solution_2_feedback}</p>
                    </section>
                  </div>

                  <div className="judge-recommendation">
                    <p className="card-label">Judge Recommendation</p>
                    <p>
                      {winner === 'Tie'
                        ? 'Both solutions are equally strong according to the judge.'
                        : `${winner} is recommended based on the current scores.`}
                    </p>
                  </div>
                </article>
              )
            })
          )}
        </section>
      </div>
    </div>
  )
}

export default App
