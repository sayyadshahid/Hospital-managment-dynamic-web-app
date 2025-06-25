import axios from "axios";

 

const API = axios.create({timeout: 300000,
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

API.interceptors.request.use(
  function (config) {
    const storedUserData =JSON.parse(localStorage.getItem("user") || "{}").access_token;

    if (storedUserData){
      // console.log('insideeeeeeeeee API CONFIG')
      // console.log('storedUserDatastoredUserData', storedUserData)
      const token = (storedUserData);
      // console.log('tokennnnnnnnn',token);
      if (token) {
        if (config.headers) {
          config.headers["Authorization"] = `${storedUserData}`;
        }
      }
    }
    return config;
  },
  function (error) {
      return Promise.reject(error);
  }
);

export default API;
