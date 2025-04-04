import React from "react";
import { MdModeEditOutline } from "react-icons/md";
import { MdEmail } from "react-icons/md";
import { FaClock } from "react-icons/fa";
import { useState } from "react";
import { IoMdSettings } from "react-icons/io";
import { Link } from "react-router-dom";
import { MdDone } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import MiniLoading from "../../Common/MiniLoading";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "sonner";
import Story from "./Story";
import Loading from "../../Common/Loading";
import {uploadImage} from '../../../lib/uploadImage.js'
import { useAuthStore } from "../../../store/useAuthStore.js";
const Profile = () => {
  const {user, isCheckingAuth, updateAvatar, updateProfile, isUpdatingProfile} = useAuthStore()

  const [userInfo, setUserInfo] = useState({
    fullName: user.fullName,
    biography: user.biography,
  });

  const [isShowForm, setIsShowForm] = useState(false);
  const [load, setLoad] = useState(false);
  const [updatable, setUpdatable] = useState(false);
  const [imageToUpdate, setImageToUpdate] = useState(new FormData());
  const [avatar, setAvatar] = useState(user.profilePic);

  const handleImageUpload = (e) => {
    const image = e.target.files[0];
    if (image) {
      if (image.type.startsWith("image/")) {
        const url = URL.createObjectURL(image);
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", "chatting_app");
        setImageToUpdate(formData);
        setAvatar(url);
        setUpdatable(true);
      } else {
        toast.error("Vui lòng chỉ tải ảnh (.png/.jpg/.jpeg) lên!");
      }
      e.target.value = "";
    } else {
      toast.error("Không tìm thấy file");
    }
  };

  const handleUpdateImage = async () => {
    setLoad(true)
    const response = await uploadImage(imageToUpdate)
    if (response) {
      await updateAvatar({ profilePic: response })
      toast.success("Upload ảnh thành công!");
    } else {
      toast.error("Upload thất bại!");
    }
    setUpdatable(false);
    setLoad(false)
  };

  const handleCancelUpdate = () => {
    console.log("cancl ok");
    setAvatar(user.profilePic);
    setUpdatable(false);
  };

  const handleFormChange = (e) => {
    setUserInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdateInfo = async (e) => {
    e.preventDefault()
        if (userInfo.fullName.length === 0) {
          toast.error("Họ tên là bắt buộc!");
          return;
        }
      
        try {
          console.log(userInfo)
          await updateProfile(userInfo)
          toast.success('Cập nhật thông tin thành công')
          setIsShowForm(false)
        } catch (error) {
          toast.error(error.message)
        }
  };

  if(isCheckingAuth){
    return <Loading />
  }

  return (
    <div className="px-6 pb-6 flex-grow flex justify-center text-gray-300">
      <div className="relative h-full w-full md:w-3/4 lg:w-2/3 xl:w-1/2 bg-base-200 rounded-2xl p-5 md:p-7 lg:p-10 flex flex-col">
        <Link
          to={"/setting"}
          className="absolute font-bold text-3xl bg-gray-600 p-1 rounded-full hover:bg-gray-700 transition-all duration-300 cursor-pointer"
        >
          <IoMdSettings />
        </Link>
        <h2 className="text-center mb-4 text-xl md:text-2xl font-bold ">
          Trang cá nhân
        </h2>
        <div className="relative mb-5 flex justify-center">
          <img
            className=" border-3 border-white  w-45 aspect-square rounded-full object-cover "
            src={avatar}
            alt=""
          />
          {!updatable ? (
            <label
              htmlFor="imageUploader"
              className="absolute -bottom-3 bg-gray-600 p-1.5 rounded-full right-1/2 translate-x-1/2 hover:bg-gray-700 transition-all duration-300 cursor-pointer"
            >
              <MdModeEditOutline className="text-lg" />
            </label>
          ) : (
            <div className="flex gap-2 absolute -bottom-3 right-1/2 translate-x-1/2">
              {load ? (
                <MiniLoading />
              ) : (
                <>
                  <button
                    onClick={handleUpdateImage}
                    className="bg-gray-600 p-1.5 rounded-full hover:bg-gray-700 transition-all duration-300 cursor-pointer"
                  >
                    <MdDone className="text-lg" />
                  </button>
                  <button
                    onClick={handleCancelUpdate}
                    className="bg-gray-600 p-1.5 rounded-full hover:bg-gray-700 transition-all duration-300 cursor-pointer"
                  >
                    <IoMdClose className="text-lg" />
                  </button>
                </>
              )}
            </div>
          )}
          <input
            onChange={(e) => handleImageUpload(e)}
            type="file"
            hidden
            id="imageUploader"
          />
        </div>
        {isShowForm ? (
          <div className="text-center mb-4 bg-gray-800 p-3 rounded-2xl relative">
            <form onSubmit={(e) => handleUpdateInfo(e)}>
              <label className="input w-full mb-4">
                <span className="label">Tên</span>
                <input
                  name="fullName"
                  value={userInfo.fullName}
                  onChange={(e) => handleFormChange(e)}
                  className=""
                  type="text"
                />
              </label>
              <label className="input w-full mb-4">
                <span className="label">Tiểu sử</span>
                <input
                  name="biography"
                  value={userInfo.biography}
                  onChange={(e) => handleFormChange(e)}
                  type="text"
                />
              </label>
              {isUpdatingProfile ? (<MiniLoading />) : (
                <div className="grid grid-cols-2 gap-2 w-full">
                  <button type="submit" className="bg-gray-700 border-none hover:bg-gray-600 btn">
                    Cập nhật
                  </button>
                  <button type="button" onClick={() => setIsShowForm(false)} className="btn">
                    Hủy
                  </button>
                </div>
              )}
            </form>
          </div>
        ) : (
          <div className="text-center mb-4 bg-gray-800 p-3 rounded-2xl relative">
            <p className="text-xl md:text-2xl font-bold  mb-2">
              {!user ? <Skeleton /> : user.fullName}
            </p>
            <p className=" text-sm">{!user ? <Skeleton /> : (user.biography ? user.biography : 'Chưa có tiểu sử')}</p>
            <button
              onClick={() => setIsShowForm(true)}
              className="absolute -top-3 right-0 text-sm px-2 py-1 bg-gray-600 rounded-xl font-semibold hover:bg-gray-700 transition-all duration-300 cursor-pointer"
            >
              Sửa
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="">
            <div className="flex justify-between items-center mb-2">
              <p className="font-semibold whitespace-nowrap">Thông tin</p>
            </div>
            <div className="mt-1 flex flex-col gap-0.5 bg-gray-800 p-3 rounded-2xl">
              <p className="text-sm flex gap-1 items-center">
                <MdEmail />
                {!user ? <Skeleton /> : user.email}
              </p>
              <p className="text-sm flex gap-1 items-center">
                <FaClock />
                {`Tham gia vào: ${
                  user?.createdAt 
                    ? new Date(user.createdAt).toLocaleDateString("vi-VI") 
                    : <Skeleton />
                }`}
              </p>
            </div>
          </div>

          <Story />

        </div>
      </div>
    </div>
  );
};

export default Profile;
