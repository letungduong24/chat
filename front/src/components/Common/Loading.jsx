import React from 'react'

const Loading = () => {
  return (
    <div class='fixed inset-0 flex space-x-2 justify-center items-center bg-base-100 h-screen'>
        <div class='h-8 w-8 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]'></div>
        <div class='h-8 w-8 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]'></div>
        <div class='h-8 w-8 bg-gray-300 rounded-full animate-bounce'></div>
    </div>
  )
}

export default Loading