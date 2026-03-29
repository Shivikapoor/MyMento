import axios from "axios";
import { API_BASE_URL } from "../config/api";
import { getToken } from "../utils/auth";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const fetchWeeklyMood = async () => {
  const { data } = await api.get("/mood/weekly");
  return data;
};

export const saveMood = async (payload) => {
  const { data } = await api.post("/mood", payload);
  return data;
};

export const fetchTaskStats = async () => {
  const { data } = await api.get("/task/stats");
  return data;
};

export const fetchTasks = async (type) => {
  const { data } = await api.get("/task", {
    params: type ? { type } : undefined,
  });
  return data;
};

export const createTask = async (payload) => {
  const { data } = await api.post("/task", payload);
  return data;
};

export const updateTaskStatus = async (payload) => {
  const { data } = await api.put("/task/status", payload);
  return data;
};

export const fetchDreams = async () => {
  const { data } = await api.get("/dream");
  return data;
};

export const createDream = async (payload) => {
  const { data } = await api.post("/dream", payload);
  return data;
};

export const fetchDreamProgress = async () => {
  const { data } = await api.get("/dream/progress");
  return data;
};

export const fetchInsight = async () => {
  const { data } = await api.get("/insight");
  return data;
};
