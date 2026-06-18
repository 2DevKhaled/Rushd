import axiosInstance from "./axiosInstance";
import { API_PATHS } from "./apiPaths";

const uploadImage = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await axiosInstance.post(
    API_PATHS.IMAGE.UPLOAD_IMAGE,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
};

export default uploadImage;
