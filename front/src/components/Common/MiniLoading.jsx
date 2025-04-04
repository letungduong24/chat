import React from 'react'

const MiniLoading = () => {
  return (
    <div class="flex justify-center items-center">
      <div class="relative inline-flex">
          <div class="w-8 h-8 bg-gray-200 rounded-full"></div>
          <div class="w-8 h-8 bg-gray-200 rounded-full absolute top-0 left-0 animate-ping"></div>
          <div class="w-8 h-8 bg-gray-200 rounded-full absolute top-0 left-0 animate-pulse"></div>
      </div>
    </div>
  )
}

export default MiniLoading