import React, { useCallback, useEffect, useState } from "react";
import { ENDPOINTS, createAPIEndpoint } from "../../api/api";
import ImageItem from "../../Components/ImageItem/ImageItem";
import Image from "../../models/Image";
import Spinner from "../../Components/Spinner/Spinner";
import deserializeImage from "../../services/deserializeImage";

const { v4: uuidv4 } = require("uuid");

function HomeScreen() {
  const [searchString, setSearchString] = useState("");
  const [images, setImages] = useState<Image[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [index, setIndex] = useState(1);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  useEffect(() => {
    const storedSearches = localStorage.getItem("searchCache");
    if (storedSearches) {
      // Get the list of recent searches from the searchCache object
      const searchCache = JSON.parse(storedSearches);
      const lastSearches = Object.keys(searchCache).reverse().slice(0, 20);
      setImages(searchCache[lastSearches[0]]); // Set images to the latest search results
    }
  }, []);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setIsLoading(true);
        const response = await createAPIEndpoint(ENDPOINTS.photos, {
          order_by: "popular",
          per_page: 20,
          page: index, // Use current index
          client_id: process.env.REACT_APP_ACCESS_KEY,
        }).get();
        console.log(response.data);
        const deserializedImages = response.data.map((image: any) =>
          deserializeImage(image)
        );
        setImages((prevImages) => [...prevImages, ...deserializedImages]);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, [index]);

  const fetchData = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const response = await createAPIEndpoint(ENDPOINTS.photos, {
        order_by: "popular",
        per_page: 20,
        page: index + 1, // Increment index to fetch next page
        client_id: process.env.REACT_APP_ACCESS_KEY,
      }).get();
      if (response.status === 200) {
        const deserializedImages = response.data.map((image: any) =>
          deserializeImage(image)
        );
        setImages((prevImages) => [...prevImages, ...deserializedImages]);
        setIndex((prevIndex) => prevIndex + 1); // Update index
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [index, isLoading]);

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

  const searchPhotos = async (query: string) => {
    if (query && query!=="") {
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
        }

        const response = await createAPIEndpoint(ENDPOINTS.searchImage, {
          query: query,
          per_page: 20,
          page: 1,
          client_id: process.env.REACT_APP_ACCESS_KEY,
        }).get();

        if (response.status === 200) {
          console.log(response.data.results);
          const deserializedImages = response.data.results.map((image: any) =>
            deserializeImage(image)
          );
          console.log(deserializedImages); // Ensure deserialized images are correct
          searchCache[query] = deserializedImages; // Store deserialized images in searchCache
          localStorage.setItem("searchCache", JSON.stringify(searchCache));
          setImages(deserializedImages);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  console.log(images);

  return (
    <div className="flex justify-center items-center">
      <div className="wrapper">
        <input
          type="text"
          placeholder="Search Images"
          value={searchString}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full lg:w-4/6 h-12 rounded-xl p-4 my-4 border-background-gray border-solid border-2 focus:border-main-purple"
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {images.map((image) => {
            return <ImageItem key={uuidv4()} image={image} />;
          })}
        </div>
        {isLoading && <Spinner />}
      </div>
    </div>
  );
}

export default HomeScreen;
