import React from 'react'
import { MdModeEditOutline } from "react-icons/md";
import { MdEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { FaBirthdayCake } from "react-icons/fa";
import { FaClock } from "react-icons/fa";
import {useState} from 'react'
import { IoMdSettings } from "react-icons/io";
import { Link } from 'react-router-dom';

const Settings = () => {
  const [story, setStory] = useState({})
  return (
    <div className='px-6 pb-6 flex-grow flex justify-center text-gray-300'>
      <div className="relative h-full w-full md:w-3/4 lg:w-2/3 xl:w-1/2 bg-base-200 rounded-2xl p-5 md:p-7 lg:p-10 flex flex-col">
        <Link to={'/profile'} className='absolute font-bold text-sm font-bold bg-gray-600 px-2 py-1 rounded-full hover:bg-gray-700 transition-all duration-300 cursor-pointer'>Quay lại</Link>
        <h2 className='text-center mb-4 text-xl md:text-2xl font-bold '>Cài đặt</h2>
        <div className="flex flex-col gap-3">
          <div className="bg-gray-800 p-3 rounded-2xl">
            <div className="flex justify-between">
              <p className='font-semibold'>Trạng thái hoạt động</p>
              <input type="checkbox" defaultChecked className="toggle" />
            </div>
            <p className='text-sm'>Trạng thái hoạt động của bạn sẽ luôn là "không hoạt động".</p>
          </div>
          <div className="bg-gray-800 p-3 rounded-2xl">
            <div className="flex justify-between">
              <p className='font-semibold'>Trạng thái "đã xem"</p>
              <input type="checkbox" defaultChecked className="toggle" />
            </div>
            <p className='text-sm'>Bạn bè của bạn sẽ không biết bạn đã xem tin nhắn.</p>
          </div>
          <div className="bg-gray-800 p-3 rounded-2xl">
            <div className="flex justify-between">
              <p className='font-semibold'>Tài khoản riêng tư</p>
              <input type="checkbox" defaultChecked className="toggle" />
            </div>
            <p className='text-sm'>Nếu bật chế độ tài khoản riêng tư, chỉ có bạn bè mới có thể xem tin của bạn, và email sẽ không được hiển thị công khai.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings