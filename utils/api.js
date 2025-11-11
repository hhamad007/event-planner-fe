// utils/api.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001/api";

// Helper to get JWT token (used for protected routes)
function getAuthToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
}

//  General API fetcher
async function fetchAPI(endpoint, method = "GET", body = null, auth = false) {
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
    console.error(" API Error:", error.message);
    return null;
  }
}

// ===== EVENTS =====

// Get all events
export async function getAllEvents() {
  return await fetchAPI("/events", "GET");
}

// Get single event by ID
export async function getEventById(id) {
  return await fetchAPI(`/events/${id}`, "GET");
}

// Create event
export async function createEvent(eventData) {
  return await fetchAPI("/events", "POST", eventData, true);
}

// Update event
export async function updateEvent(id, eventData) {
  return await fetchAPI(`/events/${id}`, "PUT", eventData, true);
}

// Delete event
export async function deleteEvent(id) {
  return await fetchAPI(`/events/${id}`, "DELETE", null, true);
}

// ===== AUTH =====

// Register user
export async function registerUser(data) {
  return await fetchAPI("/auth/register", "POST", data);
}

// Login user
export async function loginUser(data) {
  const res = await fetchAPI("/auth/login", "POST", data);
  if (res?.token && typeof window !== "undefined") {
    localStorage.setItem("token", res.token);
  }
  return res;
}

// Get profile
export async function getProfile() {
  return await fetchAPI("/auth/profile", "GET", null, true);
}
