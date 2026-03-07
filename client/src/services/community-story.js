import axios from "../lib/axios";

const API_URL = "/api/v1/community-stories";

export const fetchStories = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const fetchStoryById = async (id) => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};

export const createStory = async (storyFormData) => {
  const res = await axios.post(API_URL, storyFormData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const updateStory = async (id, story) => {
  // If story is a FormData (contains file) we need multipart headers,
  // otherwise a plain object will be sent as JSON.
  const config = {};
  if (story instanceof FormData) {
    config.headers = { "Content-Type": "multipart/form-data" };
  }
  const res = await axios.put(`${API_URL}/${id}`, story, config);
  return res.data;
};

export const deleteStory = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};
