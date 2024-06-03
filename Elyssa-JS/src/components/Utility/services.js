import axios from "axios";

const baseUrl = "adress";

export const init = async () => {
  const response = await axios.post(baseUrl);
  return response.data;
};

export const test = async () => {
  const response = await axios.get("http://localhost:3000/init");
  return response.data;
};

export const create = async (newObject) => {
  const response = await axios.post(baseUrl, newObject);
  return response.data;
};
