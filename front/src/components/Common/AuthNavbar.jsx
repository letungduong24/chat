import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiMiniHome } from "react-icons/hi2";
import { CgProfile } from "react-icons/cg";
import { MdArticle } from "react-icons/md";
import { FaUserFriends } from "react-icons/fa";
import { toast } from "sonner";
import { useAuthStore } from "../../store/useAuthStore";
const AuthNavbar = () => {
  const {logout} = useAuthStore()
  const navigate = useNavigate()
  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Đăng xuất thành công')
      navigate('/login')
    } catch (error) {
      toast.error(error.message)
    }
  }
  return (
    <div>
      <div className="px-6 py-4 text-2xl items-center text-gray-300 font-semibold flex justify-between">
        <p className="font-bold text-2xl">Chatdee</p>
        <div className="flex items-center">
          <Link
            to={"/"}
            className="md:px-6 px-3 hover:bg-black rounded-2xl transition-all duration-300 py-2"
          >
            <HiMiniHome />
          </Link>
          <button
            className="md:px-6 px-3 hover:bg-black rounded-2xl transition-all duration-300 py-2 cursor-pointer"
            popoverTarget="popover-1"
            style={{ anchorName: "--anchor-1" } /* as React.CSSProperties */}
          >
            <CgProfile />
          </button>
          <ul
            className="dropdown menu w-52 rounded-box bg-base-100 shadow-sm"
            popover="auto"
            id="popover-1"
            style={
              { positionAnchor: "--anchor-1" } /* as React.CSSProperties */
            }
          >
            <li>
              <Link to={'/profile'}>Trang cá nhân</Link>
            </li>
            <li>
              <Link to={'/setting'}>Cài đặt</Link>
            </li>
            <li>
              <button type="button" onClick={handleLogout}>Đăng xuất</button>
            </li>
          </ul>{" "}
          <Link
            to={"/stories"}
            className="md:px-6 px-3 hover:bg-black rounded-2xl transition-all duration-300 py-2"
          >
            <MdArticle />
          </Link>
          <Link
            to={"/friends"}
            className="md:px-6 px-3 hover:bg-black rounded-2xl transition-all duration-300 py-2"
          >
            <FaUserFriends />
          </Link>
          
          
        </div>
      </div>
    </div>
  );
};

export default AuthNavbar;
