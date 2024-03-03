import Image from "../models/Image";


//function to deserialize big api response into our Image Type
function deserializeImage(image: any): Image {
  try {
    return {
      id: image["id"],
      description: image["description"] || "", 
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
