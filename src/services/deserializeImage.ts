import Image from "../models/Image";

function deserializeImage(image: any): Image {
  try {
    // console.log("Image object:", image); // Log the image object to inspect its structure
    return {
      id: image["id"],
      description: image["description"] || "", // Handle optional description property
      likes: image["likes"],
      downloadUrl: image["links"]["download_location"] || image.downloadUrl,
      url: {
        fullSize: image["urls"]["full"],
        displaySize: image["urls"]["regular"],
      },
    };
  } catch (error) {
    console.error("Error deserializing image:", error);
    return {
      id: "",
      description: "",
      likes: 0,
      downloadUrl: "",
      url: {
        fullSize: "",
        displaySize: "",
      },
    };
  }
}

export default deserializeImage;
