import axios from "axios";

export const uploadImage = async (image) => {
    const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dfemfoftc/upload`,
        image,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (response.data.secure_url) {
        return response.data.secure_url
      } else {
        return null
      }
}