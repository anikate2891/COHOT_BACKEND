import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useChat } from '../../auth/hook/useChat'

const DashBoard = () => {
  const chat = useChat()
  const [message, setMessage] = useState('')

  useEffect(() => {
    chat.initSocketConnection()
  }, [chat])

  const { user } = useSelector((state) => state.auth)

  const handleSubmit = (event) => {
    event.preventDefault()
    const trimmed = message.trim()
    if (!trimmed) {
      return
    }

    // TODO: wire this to socket send or API call
    setMessage('')
  }

  return (
    <main className='h-screen w-full bg-slate-900 p-4 text-slate-100 md:p-6'>
      <section className='mx-auto flex h-full w-full max-w-6xl gap-4 rounded-3xl bg-slate-900/70 p-3 md:gap-6 md:p-5'>
        <aside className='hidden h-full w-72 shrink-0 rounded-2xl border border-slate-600/80 bg-slate-950/50 p-3 md:flex md:flex-col'>
          <h2 className='mb-3 rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold'>
            Perplexity
          </h2>

          <div className='space-y-2 overflow-y-auto'>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <button
                key={item}
                className='w-full rounded-lg bg-slate-900 px-3 py-2 text-left text-sm font-medium transition hover:bg-slate-800'
              >
                Chat title
              </button>
            ))}
          </div>
        </aside>

        <section className='flex h-full min-w-0 flex-1 flex-col gap-4'>
          <header className='flex items-center justify-between gap-3 px-2'>
            <span className='text-sm text-slate-400'> </span>
            <div className='max-w-56 truncate rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium'>
              {user?.fullname || user?.email || 'user message'}
            </div>
          </header>

          <article className='relative flex min-h-0 flex-1 items-center justify-center rounded-2xl bg-slate-900 p-6'>
            <span className='text-base font-semibold text-slate-200'></span>
          </article>

          <footer className='rounded-2xl bg-slate-900 p-3'>
            <form
              className='flex flex-col gap-3 sm:flex-row sm:items-end'
              onSubmit={handleSubmit}
            >
              <label className='flex w-full flex-col gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400'>
                Message
                <textarea
                  className='min-h-13 w-full resize-none rounded-lg border border-slate-600 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-slate-400'
                  placeholder='Type your message...'
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  rows={2}
                />
              </label>
              <button
                type='submit'
                className='h-12 rounded-lg border border-slate-500 bg-slate-800 px-6 text-sm font-semibold uppercase tracking-wide text-slate-100 transition hover:border-slate-300'
              >
                Send
              </button>
            </form>
          </footer>
        </section>
      </section>
    </main>
  )
}

export default DashBoard
