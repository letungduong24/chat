import React from 'react'
import { Link } from 'react-router-dom'
import { HiMiniHome } from "react-icons/hi2";
import { CgProfile } from "react-icons/cg";
import { MdArticle } from "react-icons/md";
import { FaUserFriends } from "react-icons/fa";

const GuestNavbar = () => {
  return (
    <div>
        <div className="px-6 py-4 items-center text-gray-300 font-semibold flex justify-between">
            <p className='font-bold text-2xl'>Chatdee</p>
            <div className="flex items-center">
              <Link to={'/'} className='md:px-6 px-3 hover:bg-black rounded-2xl transition-all duration-300 py-2'><HiMiniHome /></Link>
              <Link to={'/login'} className='md:px-3 px-3 hover:bg-black rounded-2xl transition-all duration-300 py-2'>Đăng nhập</Link>
              <Link to={'/signup'} className='md:px-3 px-3 hover:bg-black rounded-2xl transition-all duration-300 py-2'>Đăng ký</Link>
            </div>
        </div>
    </div>
  )
}

export default GuestNavbar