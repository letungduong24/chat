import React, { useEffect, useState } from 'react'
import ChatSidebar from '../Chat/ChatSidebar'
import ChatContainer from '../Chat/ChatContainer'


const Home = () => {
  const [showChatContainer, setShowChatContainer] = useState(false)

  return (
    <div className="flex-grow grid grid-cols-5 grid-rows-1 px-6 pb-6 gap-4 h-full ">
      {/* ChatSidebar */}
      <div className={`${showChatContainer ? 'hidden' : 'flex'} md:flex flex-col col-span-5 md:col-span-2 xl:col-span-1 border-gray-700 border-1 rounded-2xl p-4`}>
        <ChatSidebar setShowChatContainer={setShowChatContainer} />
      </div>

      {/* ChatContainer */}
      <div className={`${showChatContainer ? 'flex' : 'hidden'} col-span-5 md:flex flex-col md:col-span-3 xl:col-span-4 border-gray-700 border-1 rounded-2xl`}>
        <ChatContainer setShowChatContainer={setShowChatContainer} />
      </div>
    </div>
  );
};


export default Home