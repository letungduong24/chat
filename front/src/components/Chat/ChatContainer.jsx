import React, { useEffect, useRef, useState } from 'react'
import { IoIosArrowBack } from "react-icons/io";
import { IoMdSend } from "react-icons/io";
import { FaImage } from "react-icons/fa6";
import MiniLoading from '../Common/MiniLoading';
import { toast } from 'sonner';
import { useChatStore } from '../../store/useChatStore';
import { IoIosArrowUp } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { uploadImage } from '../../lib/uploadImage';
import { PhotoView } from 'react-photo-view';

const ChatContainer = ({setShowChatContainer}) => {
  const [page, setPage] = useState(1)
  const [imgToUpload, setImgToUpload] = useState(new FormData());
  const [tempImage, setTempImage] = useState('');
  const [text, setText] = useState('')
  const [load, setLoad] = useState(false)
  const {
    selectedUser, 
    setSelectedUser, 
    getMessages, 
    isMessageLoading, 
    messages, 
    sendMessage, 
    clearMessages, 
    isGetMessagesLoading,
    subscribeToMessage,
    unSubscribeFromMessage,
    getMoreMessages,
    isGetMoreMessagesLoading,
    hasMore
  } = useChatStore()


  const endOfMessagesRef = useRef(null);
  const chatContainerRef = useRef(null);
  const anchorMessageRef = useRef(null);
  const scrollPositionRef = useRef(null);
  const prevMessagesLengthRef = useRef(0);

  const handleGetMoreMessages = async () => {
    if (chatContainerRef.current && messages.length > 0) {
      const anchorMessage = messages[0];
      
      scrollPositionRef.current = {
        messageId: anchorMessage._id,
        scrollTop: chatContainerRef.current.scrollTop,
        scrollHeight: chatContainerRef.current.scrollHeight
      };
      
      prevMessagesLengthRef.current = messages.length;
      
      const newPage = page + 1;
      try {
        await getMoreMessages(selectedUser._id, newPage);
        setPage(newPage);
      } catch (error) {
        toast.error("Lỗi khi tải thêm tin nhắn");
      }
    }
  };
  
  


  useEffect(() => {
    if (endOfMessagesRef.current && prevMessagesLengthRef.current < messages.length &&
        (!scrollPositionRef.current || messages[0]._id !== scrollPositionRef.current.messageId)) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (scrollPositionRef.current && chatContainerRef.current && messages.length > prevMessagesLengthRef.current) {
      const newScrollPosition = chatContainerRef.current.scrollHeight - scrollPositionRef.current.scrollHeight + scrollPositionRef.current.scrollTop;
      chatContainerRef.current.scrollTop = newScrollPosition;
      scrollPositionRef.current = null;
    }
  }, [messages]);

  const handleSetCurrentUser = () => {
    setSelectedUser(null)
    clearMessages()
    setShowChatContainer(false)
  }

  const handleImageUpload = (e) => {
      const image = e.target.files[0];
      if (image) {
        if (image.type.startsWith("image/")) {
          const url = URL.createObjectURL(image);
          const formData = new FormData();
          formData.append("file", image);
          formData.append("upload_preset", "chatting_app");
          setImgToUpload(formData);
          setTempImage(url);
          console.log(url)
        } else {
          toast.error("Vui lòng chỉ tải ảnh (.png/.jpg/.jpeg) lên!");
        }
        e.target.value = "";
      } else {
        toast.error("Không tìm thấy file");
      }
    };

    const handleSubmitNewMessage = async (e) => {
      let res = null
      setLoad(true)
      e.preventDefault()
      if (!text.trim() && !tempImage) {
        setLoad(false)
        return;
      }
      try {
        if(tempImage && imgToUpload){
          res = await uploadImage(imgToUpload)
        }
        await sendMessage({
          id: selectedUser._id,
          message: {
            text: text.trim() || "", 
            image: res || null
          }
        })
        setText('')
        setTempImage('')
        setImgToUpload(new FormData())
      } catch (error) {
        toast.error('Không gửi được tin nhắn!')
      } finally{
        setLoad(false)
      }
    }
    
  useEffect(() => {
    if(selectedUser){
      getMessages(selectedUser._id)
      subscribeToMessage()
      setPage(1)
      scrollPositionRef.current = null
      prevMessagesLengthRef.current = 0
    }
    return () => unSubscribeFromMessage()
  }, [selectedUser, unSubscribeFromMessage, getMessages, subscribeToMessage])

  useEffect(() => {
    if (endOfMessagesRef.current && messages.length > 0 && !scrollPositionRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isGetMessagesLoading]);

  if (!selectedUser){
    return <div className="h-full w-full flex flex-col justify-center items-center text-center">
      <p className='text-3xl font-bold'>Chào mừng đến với Chatdee</p>
      <p className='font-semibold'>Ngày hôm nay của bạn thế nào? Nhắn ngay cho bạn bè nào!</p>
    </div>
  }

  if (isGetMessagesLoading){
    return <div className="h-full w-full flex flex-col justify-center items-center text-center">
      <MiniLoading />
    </div>
  }

  return (
    <>
      <div className="h-full w-full flex flex-col min-h-0">
        {/* info */}
        <div className="flex items-center gap-3 bg-gray-700 rounded-t-xl p-3">
          <img
            className="object-cover relative w-13 aspect-square rounded-full"
            src={selectedUser.profilePic}
            alt=""
          />
          <div className="flex-grow">
            <p 
              className='font-bold text-xl'>
              {selectedUser.fullName}
            </p>
            <p className=''>{selectedUser.status ? 'Online' : 'Offline'}</p>
          </div>
          <button onClick={handleSetCurrentUser} className='block md:hidden bg-gray-800 p-1.5 text-xl rounded-full hover:bg-gray-700 transtion-all duration-300'><IoIosArrowBack /></button>
        </div>
        
        {/* chat section */}
        <div ref={chatContainerRef} className="p-5 flex-grow flex flex-col overflow-y-auto min-h-0 w-full">
          <div className="w-full flex justify-center">
            {hasMore && (
              <button 
                onClick={handleGetMoreMessages} 
                className='cursor-pointer bg-gray-600 p-0.5 text-3xl font-bold rounded-full'
                disabled={isGetMoreMessagesLoading}
              >
                {isGetMoreMessagesLoading ? <MiniLoading size="small" /> : <IoIosArrowUp />}
              </button>
            )}
          </div>
            {messages && messages.length === 0 ? (
              <div className="w-full h-full flex justify-center items-center flex-col text-center">
                <p className='text-xl font-bold'>Bạn chưa nhắn tin cho {selectedUser.fullName} bao giờ!</p>
                <p className='font-semibold font-sm'>Gửi lời chào đến {selectedUser.fullName} nào!</p>
              </div>  
            ) : (
              messages && messages.map((message, index) => (
                <div 
                  key={message._id} 
                  ref={index === 0 ? anchorMessageRef : null}
                  className={`space-y-3 chat ${message.senderId === selectedUser._id ?  'chat-start' : 'chat-end'}`}
                >
                  <div className="chat-image avatar">
                  {message.senderId === selectedUser._id && (
                    <div className="w-10 rounded-full">
                       <img
                       alt={`${message.senderId} profile picture`}
                       src={selectedUser.profilePic} />
                    </div>
                  )}
                  </div>
                  {message.senderId === selectedUser._id && (
                    <div className="chat-header">
                    {selectedUser.fullName}
                    </div>
                  )}
                  {message.text ? (
                    <div className="chat-bubble rounded-xl">
                      {message.text}
                      {message.image && (
                        <PhotoView src={message.image}>
                          <img className='max-h-40 my-2' src={message.image} alt="" />
                        </PhotoView>
                      )}
                    </div>
                  ) : (
                    message.image && (
                      <PhotoView src={message.image}>
                        <img className='max-h-40 my-2 rounded-xl' src={message.image} alt="" />
                      </PhotoView>
                    )
                  )}
                </div>
              ))
            )}
            <div ref={endOfMessagesRef} className=""></div>
        </div>
        <div className="w-full">
          {tempImage && (
            <div className="relative w-fit">
              <button onClick={() => {setTempImage(''); setImgToUpload(new FormData())}} className='absolute right-2 -top-2 text-xl p-0.5 bg-gray-600 rounded-full cursor-pointer'><IoMdClose /></button>
              <img src={tempImage} className='bottom-15 max-h-25 rounded-lg mx-5' alt="" />
            </div>
          )}
          <form onSubmit={handleSubmitNewMessage} className='h-15 w-full px-5 py-2.5 flex gap-0.5 items-center' action="">
            <input onChange={(e) => handleImageUpload(e)} id='imageUpload' type="file" hidden/>
            <input value={text} placeholder='Gửi tin nhắn' name='text' onChange={(e) => setText(e.target.value)} className="h-full w-full bg-gray-600 rounded-2xl p-3"></input>
            {!load ? (
              <div className="h-full aspect-square flex justify-center items-center hover:bg-gray-600 rounded-full">
                <button type='submit' className='cursor-pointer text-2xl '><IoMdSend className=''/></button>
              </div>
            ) : (
              <MiniLoading />
            )}
            <div className="h-full aspect-square flex justify-center items-center hover:bg-gray-600 rounded-full">
              <label htmlFor='imageUpload' className='cursor-pointer text-2xl '><FaImage className=''/></label>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default ChatContainer