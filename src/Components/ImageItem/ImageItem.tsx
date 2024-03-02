import React, { useState } from "react";
import Image from "../../models/Image";
import axios from "axios";
import Spinner from "../Spinner/Spinner";

interface ImageItemProps {
  image: Image;
}

const ImageItem: React.FC<ImageItemProps> = ({ image }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const downloadFile = async (url: string, filename: string) => {
    try {
      const response = await axios.get(url, {
        responseType: "blob",
        params: {
          client_id: process.env.REACT_APP_ACCESS_KEY,
        },
      });

      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
    <div className="h-full relative group hover:cursor-pointer transition-all duration-150 ease-in">
      <img
        src={image.url.displaySize}
        className="h-full top-0 left-0 object-cover z-2"
        alt={image.description}
        onClick={openModal}
      />
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg max-w-md overflow-y-auto max-h-4/5 relative hover:cursor-default">
            <img
              src={image.url.fullSize}
              alt="Full Size"
              className="w-full mb-4"
              onLoadStart={() => setIsLoading(true)}
              onLoad={() => setIsLoading(false)}
            />
            {isLoading && <Spinner />}
            <div className="p-4">
              <p className="text-lg">{image.description}</p>
              <p className="text-sm text-gray-500 mt-2">Likes: {image.likes}</p>
            </div>
            <button
              className="bg-main-purple text-white py-2 px-4 rounded-md hover:bg-main-purple-dark absolute bottom-4 right-4 hover:cursor-pointer"
              onClick={() => downloadFile(image.downloadUrl, image.description)}
            >
              გადმოწერა
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeModal();
              }}
              className="absolute top-2 right-4 p-2 m-4 text-4xl text-white hover:text-main-red"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageItem;
