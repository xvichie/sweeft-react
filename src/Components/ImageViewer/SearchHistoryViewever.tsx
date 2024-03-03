import React, { useCallback, useEffect, useState } from "react";
import Image from "../../models/Image";
import { ENDPOINTS, createAPIEndpoint } from "../../api/api";
import deserializeImage from "../../services/deserializeImage";
import ImageItem from "../ImageItem/ImageItem";
import Spinner from "../Spinner/Spinner";

const { v4: uuidv4 } = require("uuid");

interface ImageViewerProps {
  searchString: string;
}

function SearchHistoryViewer({ searchString }: ImageViewerProps) {
  const [images, setImages] = useState<Image[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [index, setIndex] = useState(1);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  useEffect(() => {
    setImages([]);
    const storedSearches = localStorage.getItem("searchCache");
    if (storedSearches) {
      // Get the list of recent searches from the searchCache object
      const searchCache = JSON.parse(storedSearches);
      const lastSearches = Object.keys(searchCache).reverse().slice(0, 20);
      (setImages as (images: Image[]) => void)(searchCache[searchString]);
    }
  }, [searchString]);

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

    if (searchString === "") {
      fetchImages();
    }
  }, [index]);

  const fetchData = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      if (searchString === "") {
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
      } else {
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
          setIndex((prevIndex) => prevIndex + 1); // Update index
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [index, isLoading, searchString]);

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


  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-col">

        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {images.map((image) => {
            return <ImageItem key={uuidv4()} image={image} />;
          })}
        </div>
        
        
        {images.length === 0 && !isLoading && (
          <h1 className="text-2xl font-bold text-main-red">
            ასეთი ვერაფერი მოიძებნა!
          </h1>
        )}
        {isLoading && <Spinner />}
      </div>
    </div>
  );
}

export default SearchHistoryViewer;
