import axios from "axios";

const API_BASE_URL =
  process.env.API_URL || "https://event-planner-backend-d1lv.onrender.com/api";

// axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// attach token whenever possible
api.interceptors.request.use((config) => {
  if (typeof window != "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// auth api
export const authAPI = {
  register: (data) => api.post("/auth/register", data).then((res) => res.data),
  login: async (data) => {
    const res = await api.post("/auth/login", data);
    console.log("api response;", res);
    if (res.data.data.token) {
      localStorage.setItem("token", res.data.data.token);
    }
    return res.data;
  },
  logout: () => {
    localStorage.removeItem("token");
  },
  getProfile: () => api.get("/auth/profile").then((res) => res.data),
};

// event api
export const eventsAPI = {
  getAll: () => api.get("/events").then((res) => res.data),
  getById: (id) => api.get(`/events/${id}`).then((res) => res.data),
  getStats: (id) => api.get(`/events/${id}/stats`).then((res) => res.data),
  getByOrganiser: (organiserId) =>
    api.get(`/events/organiser/${organiserId}`).then((res) => res.data),
  getMyEvents: () => api.get("/events/my-events"),
  searchEvents: (params) =>
    api.get("/events/search", { params }).then((res) => res.data),
  create: (data) => api.post("/events", data).then((res) => res.data),
  createEvent: (eventData) => api.post("/events", eventData),
  update: (id, data) => api.put(`/events/${id}`, data).then((res) => res.data),
  delete: (id) => api.delete(`/events/${id}`).then((res) => res.data),
};

// user api
export const usersAPI = {
  getById: (id) => api.get(`/users/${id}`).then((res) => res.data),
  update: (id, data) => api.put(`/users/${id}`, data).then((res) => res.data),
  delete: (id) => api.delete(`/users/${id}`).then((res) => res.data),
};

// RSVP api
export const rsvpAPI = {
  rsvpEvent: (eventId, data) =>
    api.post(`/rsvp/${eventId}`, data).then((res) => res.data),
  getStatus: (eventId) =>
    api.get(`/rsvp/${eventId}/status`).then((res) => res.data),
  getAttendees: (eventId) =>
    api.get(`/rsvp/${eventId}/attendees`).then((res) => res.data),
  getUserRsvps: () => api.get("/rsvp/user").then((res) => res.data),
};

// upload api for images
export const uploadAPI = {
  uploadEventImage: (eventId, file) => {
    const formData = new FormData();
    formData.append("image", file);
    return api
      .post(`/upload/event/${eventId}`, formData)
      .then((res) => res.data);
  },
  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append("avatar", file);
    return api.post("/upload/avatar", formData).then((res) => res.data);
  },
};

// health api
export const healthAPI = {
  check: () => api.get("/health").then((res) => res.data),
};

export default api;
