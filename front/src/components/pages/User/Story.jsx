import React, { useState } from "react";
import { toast } from "sonner";
import { MdError } from "react-icons/md";
import MiniLoading from "../../Common/MiniLoading";
import { FaClockRotateLeft } from "react-icons/fa6";
import { calculateStoryTime } from "../../../lib/services";
import { uploadImage } from "../../../lib/uploadImage.js";
import { useAuthStore } from "../../../store/useAuthStore.js";

const Story = () => {
  const {user, uploadStory, deleteStory} = useAuthStore()
  const [isUploading, setIsUploading] = useState(false)
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState("");
  const [imageToUpload, setImageToUpload] = useState(new FormData());

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true)
    if (caption.length === 0 && !image) {
      setError("Tin phải có ảnh hoặc trạng thái!");
      setIsUploading(false)
      return;
    }
    if (image) {
      const response = await uploadImage(imageToUpload)
      if (response) {
        uploadStory({ img: response, caption});
        toast.success("Đăng tin thành công!");
      } else {
        toast.error("Upload thất bại!");
      }
    }
    else {
      await uploadStory({ img: '', caption });
      toast.success("Đăng tin thành công!");
    }
    setIsUploading(false)
    console.log({ caption, image });
    document.getElementById("my_modal_2").close();
    setImage("");
    setCaption("");
    setError("");
    setImageToUpload(new FormData());
  };

  const handleDeleteStory = async (e) => {
    e.preventDefault();
    toast("Bạn có chắc muốn xóa tin này không?", {
      action: {
        label: "Xóa",
        onClick: async () => {
          try {
            deleteStory()
            toast.success('Xóa tin thành công!')
          } catch (error) {
            toast.success('Xóa tin thất bại!')
          }
        }
      },
      cancel: {
        label: "Hủy",
        onClick: () => console.log("Hủy xóa")
      }
    });
  
  };

  const handleImageUpload = (e) => {
    const image = e.target.files[0];
    if (image) {
      if (image.type.startsWith("image/")) {
        const url = URL.createObjectURL(image);
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", "chatting_app");
        setImageToUpload(formData);
        setImage(url);
      } else {
        toast.error("Vui lòng chỉ tải ảnh (.png/.jpg/.jpeg) lên!");
      }
      e.target.value = "";
    } else {
      toast.error("Không tìm thấy file");
    }
  };
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <p className="font-semibold whitespace-nowrap">Trạng thái</p>
        <div className="flex gap-1">
        <button
          onClick={() => document.getElementById("my_modal_2").showModal()}
          className="text-sm px-2 py-1 bg-gray-600 rounded-xl font-semibold hover:bg-gray-700 transition-all duration-300 cursor-pointer"
        >
          Thêm
        </button>
        {user?.story && (
          <button
          onClick={handleDeleteStory}
          className="text-sm px-2 py-1 bg-gray-600 rounded-xl font-semibold hover:bg-gray-700 transition-all duration-300 cursor-pointer"
          >
          Xóa tin
          </button>
        )}
        </div>
      </div>
      <div className="mt-1 bg-gray-800 rounded-2xl w-full aspect-square">
        {!user?.story ? (
          <div className="w-full h-full flex justify-center items-center">
            <p>Hiện không có tin</p>
          </div>
        ) : (
          <div className={`relative w-full h-full ${user?.story?.img ? '' : 'items-center'} flex justify-center`}>
            {user?.story?.img && (
              <img
                className="object-cover rounded-2xl w-full h-full"
                src={user?.story?.img}
                alt=""
              />
            )}
            {user?.story?.caption && (
              <p className={`${user?.story?.img ? 'absolute bottom-3' : ''} text-center bg-gray-700 px-2 py-1 rounded-xl font-semibold`}>
                {user?.story?.caption}
              </p>
            )}
            <p className={`flex gap-1 items-center absolute top-3 left-3 text-center bg-gray-700 px-2 py-1 rounded-xl font-semibold text-sm`}>
                <FaClockRotateLeft />
                {calculateStoryTime(user?.story?.createdAt)}
            </p>
          </div>
        )}
      </div>
      <dialog id="my_modal_2" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Thêm tin</h3>
          <form onSubmit={handleSubmit}>
            <div className="relative w-full aspect-square">
              {image ? (
                <img
                  className="object-cover rounded-2xl mt-4 w-full h-full"
                  src={image}
                  alt=""
                />
              ) : (
                <div className="bg-gray-800 rounded-2xl mt-4 w-full h-full font-bold flex justify-center items-center">
                  Chưa có ảnh
                </div>
              )}
              <input
                value={caption}
                onChange={(e) => {
                  if (e.target.value.length <= 30) {
                    setCaption(e.target.value);
                  }
                }}
                type="text"
                placeholder="Nhập trạng thái"
                className="focus:outline-none text-center input absolute bottom-2 left-1/2 -translate-x-1/2 rounded-2xl"
              />
              <input
                onChange={(e) => handleImageUpload(e)}
                type="file"
                hidden
                id="storyImgUploader"
              />
            </div>
            {error && (
              <div className="flex justify-center">
                <div className="w-fit text-center">
                  <p className="flex items-center gap-1 px-3 py-2 bg-gray-600 rounded-2xl mt-4">
                    <MdError />
                    {error}
                  </p>
                </div>
              </div>
            )}
            {isUploading ? (
              <div className="mt-4">
                <MiniLoading />
              </div>
            ) : (
              <div className="w-full grid grid-cols-2 gap-5 mt-4">
                <label htmlFor="storyImgUploader" className="btn rounded-xl">
                  Chọn ảnh
                </label>
                <button className="btn rounded-xl bg-gray-600 hover:bg-gray-700 transtion-all duration-300">
                  Đăng tải
                </button>
              </div>
            )}
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default Story;
