import React, { useEffect } from 'react'
import UserCard from './UserCard.jsx'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import Loading from '../Common/Loading.jsx';
import { useChatStore } from '../../store/useChatStore.js';

const ChatSidebar = ({setShowChatContainer}) => {
  const {users, getUsers, isUsersLoading, selectedUser, setSelectedUser, clearMessages} = useChatStore()

  const handleSetCurrentUser = (user) => {
    if(user._id !== selectedUser?._id){
      clearMessages()
      setSelectedUser(user)
      setShowChatContainer(true)
    }
  }


  useEffect(() => {
    if(users.length === 0){
      getUsers()
    }
  }, [users])

  if(isUsersLoading) {
    return <Loading />
  }

  
  return (
    <div className="flex flex-col h-full w-full">
      <p className="font-bold mb-4">Liên hệ</p>
      <div className="flex-grow flex flex-col gap-4 overflow-y-auto min-h-0 w-full">
        {isUsersLoading ? (          
          // Hiển thị Skeleton khi users chưa có dữ liệu
          [...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-2 rounded-2xl bg-gray-800">
              <Skeleton circle width={48} height={48} />
              <div className="w-full">
                <Skeleton width="60%" height={16} />
                <Skeleton width="80%" height={12} />
              </div>
            </div>
          ))
        ) : (
          // Hiển thị danh sách user khi có dữ liệu
          users.map((user) => (
            <UserCard
              key={user._id}
              id={user._id}
              name={user.fullName}
              avatar={user.profilePic}
              lastMessage={user.lastMessage}
              status={user.status}
              onClick={() => handleSetCurrentUser(user)}
            />
          ))
        )}
      </div>
    </div>
  );
};


export default ChatSidebar