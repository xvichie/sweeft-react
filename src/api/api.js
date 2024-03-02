import axios from "axios";

export const BASE_URL = "https://api.unsplash.com";

export const ENDPOINTS = {
  photos: "photos", // Update to lowercase "photos"
  searchImage: "search/photos",
};

export const createAPIEndpoint = (endpoint, params = {}) => {
  let url = `${BASE_URL}/${endpoint}`; // Use template literals for better URL construction

  return {
    get: () =>
      axios.get(url, {
        headers: {
          Authorization: `Client-ID ${process.env.REACT_APP_ACCESS_KEY}`,
        },
        params: params,
      }),
    getById: (id) => {
      return axios.get(`${url}/${id}`, { params: params });
    },
  };
};
