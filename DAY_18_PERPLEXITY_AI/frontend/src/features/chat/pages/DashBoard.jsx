import React from 'react'
import { useSelector } from 'react-redux'
import { useChat } from '../../auth/hook/useChat'
import { useEffect } from 'react'

const DashBoard = () => {

  const chat = useChat()

  useEffect(() => {
    chat.initSocketConnection();
  }, [])

    const {user} = useSelector((state) => state.auth)
    console.log(user)

  return (
    <div>
      <h1>Welcome</h1>
    </div>
  )
}

export default DashBoard
