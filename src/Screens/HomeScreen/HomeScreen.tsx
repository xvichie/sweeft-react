import React, { useCallback, useEffect, useState } from "react";
import { ENDPOINTS, createAPIEndpoint } from "../../api/api";
import ImageItem from "../../Components/ImageItem/ImageItem";
import Image from "../../models/Image";
import Spinner from "../../Components/Spinner/Spinner";
import deserializeImage from "../../services/deserializeImage";

import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { v4: uuidv4 } = require("uuid");

function HomeScreen() {
  const [searchString, setSearchString] = useState("");
  const [images, setImages] = useState<Image[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [index, setIndex] = useState(1);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  //Get Cache if it exists and also, populate images with the 20 most popular images
  useEffect(() => {
    const storedSearches = localStorage.getItem("searchCache");
    if (storedSearches) {
      const searchCache = JSON.parse(storedSearches);
      const lastSearches = Object.keys(searchCache).reverse().slice(0, 20);
    }

    const fetchImages = async () => {
      try {
        setIsLoading(true);
        const response = await createAPIEndpoint(ENDPOINTS.photos, {
          order_by: "popular",
          per_page: 20,
          page: index,
          client_id: process.env.REACT_APP_ACCESS_KEY,
        }).get();

        const deserializedImages = response.data.map((image: any) =>
          deserializeImage(image)
        );

        setImages((prevImages) => [...prevImages, ...deserializedImages]);
        setIndex((prevIndex) => prevIndex + 1);
      } catch (err) {
        if (err instanceof Error) {
          const errorMessage = err.message;
          toast.error(errorMessage);
          console.error(err);
        } else {
          const errorMessage = String(err);
          toast.error(errorMessage);
          console.error(errorMessage);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, []);

  //If the searchString is not "", then add 20 of more images with query to infinite scroll
  //else, just add 20 populars
  const fetchData = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      if (searchString === "") {
        if(images.length === 0){
          return;
        }
        const response = await createAPIEndpoint(ENDPOINTS.photos, {
          order_by: "popular",
          per_page: 20,
          page: index + 1,
          client_id: process.env.REACT_APP_ACCESS_KEY,
        }).get();
        if (response.status === 200) {
          const deserializedImages = response.data.map((image: any) =>
            deserializeImage(image)
          );
          setImages((prevImages) => [...prevImages, ...deserializedImages]);
          setIndex((prevIndex) => prevIndex + 1);
        }
      } else {
        if(images.length === 0){
          return;
        }
        const response = await createAPIEndpoint(ENDPOINTS.searchImage, {
          query: searchString,
          per_page: 20,
          page: index + 1,
          client_id: process.env.REACT_APP_ACCESS_KEY,
        }).get();

        if (response.status === 200) {
          const deserializedImages = response.data.results.map((image: any) =>
            deserializeImage(image)
          );
          setImages((prevImages) => [...prevImages, ...deserializedImages]);
          setIndex((prevIndex) => prevIndex + 1);
        }
      }
    } catch (err) {
      if (err instanceof Error) {
        const errorMessage = err.message;
        toast.error(errorMessage);
        console.error(err);
      } else {
        const errorMessage = String(err);
        toast.error(errorMessage);
        console.error(errorMessage);
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [index, isLoading]);

  //Detect when it's time to fetch more data for infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } =
        document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - 20) {
        fetchData();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [fetchData]);

  //Detect when the user has finished typing (there must be 500ms after the last keystroke)
  //and searchPhotos only then. this helps with not having sub words in history.
  //for example: if you want to search "Vashli", it woult search "V", "Va", "Vas", ... and so on.
  //so it would pollute the search history and would send more unneccesary api calls
  const handleSearchChange = (value: string) => {
    setSearchString(value);

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    const timeout = setTimeout(() => {
      searchPhotos(value);
    }, 500);

    setTypingTimeout(timeout);
  };

  //Check if you have the according images in cache, and if not, send a request
  const searchPhotos = async (query: string) => {
    if (query && query !== "") {
      setIsLoading(true);
      try {
        const searchCache = JSON.parse(
          localStorage.getItem("searchCache") || "{}"
        );
        const cachedResponse = searchCache[query];
        if (cachedResponse) {
          setImages(cachedResponse);
          setIsLoading(false);
          return;
        } else {
          const response = await createAPIEndpoint(ENDPOINTS.searchImage, {
            query: query,
            per_page: 20,
            page: 1,
            client_id: process.env.REACT_APP_ACCESS_KEY,
          }).get();

          if (response.status === 200) {
            const deserializedImages = response.data.results.map((image: any) =>
              deserializeImage(image)
            );

            searchCache[query] = deserializedImages;

            localStorage.setItem("searchCache", JSON.stringify(searchCache));
            setImages(deserializedImages);
          }
        }
      } catch (err) {
        if (err instanceof Error) {
          const errorMessage = err.message;
          toast.error(errorMessage);
          console.error(err);
        } else {
          const errorMessage = String(err);
          toast.error(errorMessage);
          console.error(errorMessage);
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <div className="flex justify-center items-center">
        <div className="wrapper">
          {/* Show the Search Bar */}
          <input
            type="text"
            placeholder="მოძებნეთ სურათები"
            value={searchString}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full lg:w-4/6 h-12 rounded-xl p-4 my-4 border-background-gray border-solid border-2 focus:border-main-purple"
          />

          {/* Map Out the images if they have been loaded */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {images.map((image) => {
              return <ImageItem key={uuidv4()} image={image} />;
            })}
          </div>

          {/* If Search result is empty show aseti veraferi moidzebna */}
          {images.length === 0 && !isLoading && (
            <h1 className="text-2xl font-bold text-main-red">
              ასეთი ვერაფერი მოიძებნა!
            </h1>
          )}

          {/* If loading, show loading component */}
          {isLoading && <Spinner />}
        </div>
      </div>

      {/* {"Placeholder for toast to show errors."} */}
      <ToastContainer />
    </>
  );
}

export default HomeScreen;
