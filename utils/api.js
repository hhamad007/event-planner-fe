// utils/api.js

const API_BASE_URL = "https://event-planner-backend-d1lv.onrender.com/api";

/*  Helper: Get token from localStorage */
function getAuthToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
}

/*  Core Fetch Function (handles auth + errors) */
export async function fetchAPI(endpoint, method = "GET", body = null, auth = false) {
  const headers = { "Content-Type": "application/json" };

  if (auth) {
    const token = getAuthToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
    ...(body && { body: JSON.stringify(body) }),
  };

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, options);

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`API Error ${res.status}: ${errorText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("❌ API Error:", error.message);
    return null;
  }
}

//
// ======== 🧠 EVENT ROUTES ========
//

/* 📦 Get all events */
export async function getAllEvents() {
  return await fetchAPI("/events", "GET");
}

/* 👤 Get user's events (requires auth) */
export async function getMyEvents() {
  return await fetchAPI("/events/my/events", "GET", null, true);
}

/* 🔍 Search events with query parameters */
export async function searchEvents(queryParams = {}) {
  const queryString = new URLSearchParams(queryParams).toString();
  const endpoint = `/events/search${queryString ? `?${queryString}` : ""}`;
  return await fetchAPI(endpoint, "GET");
}

/* ➕ Create event */
export async function createEvent(eventData) {
  return await fetchAPI("/events", "POST", eventData, true);
}

/* ✏️ Update event */
export async function updateEvent(id, eventData) {
  return await fetchAPI(`/events/${id}`, "PUT", eventData, true);
}

/* ❌ Delete event */
export async function deleteEvent(id) {
  return await fetchAPI(`/events/${id}`, "DELETE", null, true);
}

/* 📄 Get event by ID */
export async function getEventById(id) {
  return await fetchAPI(`/events/${id}`, "GET");
}

//
// ======== 👤 AUTH ROUTES ========
//

/* 🪪 Register user */
export async function registerUser(data) {
  return await fetchAPI("/auth/register", "POST", data);
}

// ===== AUTH =====
export async function loginUser(data) {
  const res = await fetchAPI("/auth/login", "POST", data);
  if (res?.token && typeof window !== "undefined") {
    localStorage.setItem("token", res.token);
    console.log(" Token saved:", res.token);
  } else {
    console.warn(" No token returned from login.");
  }
  return res;
}


/* 🧾 Get profile (requires auth) */
export async function getProfile() {
  return await fetchAPI("/auth/profile", "GET", null, true);
}

/* 🚪 Logout user */
export function logoutUser() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
}
