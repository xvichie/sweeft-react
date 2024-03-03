import React, { useState } from "react";
import Image from "../../models/Image";
import axios from "axios";
import Spinner from "../Spinner/Spinner";

interface ImageItemProps {
  image: Image;
}

const ImageItem = ({ image }: ImageItemProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  //function which gets blob and extension, creates a downloadable link and clicks on it.
  const downloadFile = async (url: string, filename: string) => {
    try {
      const response = await axios.get(url, {
        responseType: "blob",
        params: {
          client_id: process.env.REACT_APP_ACCESS_KEY,
        },
      });

      const contentType = response.headers["content-type"];
      const fileExtension = contentType.split("/")[1];

      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = blobUrl;

      filename = `${filename}.${fileExtension}`;

      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
    <div className="h-full group hover:cursor-pointer transition-all duration-150 ease-in overflow-clip z-2">
      {/* just show the image */}
      <img
        src={image.url.displaySize}
        className="h-full w-fit top-0 left-0 object-cover z-[2]
        hover:scale-110
        ease-in duration-100 transition-all
        "
        alt={image.description}
        onClick={openModal}
      />
      {/* show modal if opened */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50 min-h-96">
          <div className="flex bg-white p-8 rounded-lg max-w-[80%] overflow-y-auto max-h-4/5 relative hover:cursor-default min-h-96 min-w-[95%] xl:min-w-[80%]">
            <img
              src={image.url.fullSize}
              alt="Full Size"
              className="object-contain h-96 w-auto"
              onLoadStart={() => setIsLoading(true)}
              onLoad={() => setIsLoading(false)}
            />

            {isLoading && <Spinner />}

            <div className="px-4 m-0">
              <p className="text-lg">
                {image.description === ""
                  ? "ამ სურათს აღწერა არ აქ!"
                  : image.description}
              </p>
              <p className="text-lg font-bold text-gray-500 mt-1 text-left">
                Likes: {image.likes}
              </p>
            </div>

            <button
              className="bg-main-purple hover:bg-main-red 
              transition-all duration-100 ease-in
              text-white my-4 p-3  rounded-md hover:bg-main-purple-dark absolute bottom-4 right-4 hover:cursor-pointer"
              onClick={() =>
                downloadFile(image.url.fullSize, image.description)
              }
            >
              გადმოწერა
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                closeModal();
              }}
              className="absolute top-[-15px] right-[-10px] p-2 m-4 text-4xl text-main-red hover:text-main-yellow
              transition-all duration-100 ease-in
              "
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
