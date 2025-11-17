/* Write functions to communicate with the backend API. Include functions for login, register, getting events, creating events, and joining events. Handle errors and authentication tokens properly. */
async function fetchAPI(endpoint, method = "GET", body = null, auth = false) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = localStorage.getItem("token");
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
      const text = await res.text();
      throw new Error(`API Error ${res.status}: ${text}`);
    }
    return await res.json();
  } catch (error) {
    console.error("API Error:", error.message);
    return null;
  }
}

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
// Events API
export const eventsAPI = {
  // Get all events with optional filters
  getEvents: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    });
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/events?${queryString}` : '/events';
    
    return await apiCall(endpoint);
  },

  // Get nearby events based on location
  getNearbyEvents: async (lat = 51.5072, lon = -0.1276, radius = 10) => {
    const params = {
      latitude: lat,
      longitude: lon,
      radius: radius,
      limit: 20
    };
    
    const queryParams = new URLSearchParams(params);
    return await apiCall(`/events/nearby?${queryParams}`);
  },
  
  // Get single event by ID
  getEvent: async (eventId) => {
    return await apiCall(`/events/${eventId}`);
  },
  
  // Create new event
  createEvent: async (eventData) => {
    return await apiCall('/events', {
      method: 'POST',
      body: JSON.stringify({
        title: eventData.title,
        description: eventData.description,
        startDate: eventData.startDate,
        endDate: eventData.endDate,
        location: eventData.location,
        maxAttendees: eventData.maxAttendees,
        category: eventData.category,
        tags: eventData.tags || [],
        isPublic: eventData.isPublic !== false,
        requiresApproval: eventData.requiresApproval || false,
        ...(eventData.price && { price: eventData.price }),
        ...(eventData.coordinates && { coordinates: eventData.coordinates })
      })
    });
  },
  
  // Update existing event
  updateEvent: async (eventId, eventData) => {
    return await apiCall(`/events/${eventId}`, {
      method: 'PUT',
      body: JSON.stringify(eventData)
    });
  },
  
  // Delete event
  deleteEvent: async (eventId) => {
    return await apiCall(`/events/${eventId}`, {
      method: 'DELETE'
    });
  },
  
  // Join an event
  joinEvent: async (eventId, joinData = {}) => {
    return await apiCall(`/events/${eventId}/join`, {
      method: 'POST',
      body: JSON.stringify(joinData)
    });
  },
  
  // Leave an event
  leaveEvent: async (eventId) => {
    return await apiCall(`/events/${eventId}/leave`, {
      method: 'POST'
    });
  },
  
  // Get event attendees
  getEventAttendees: async (eventId) => {
    return await apiCall(`/events/${eventId}/attendees`);
  },
  
  // Get user's events (created by user)
  getUserEvents: async (params = {}) => {
    const queryParams = new URLSearchParams(params);
    const endpoint = queryParams.toString() ? `/events/my-events?${queryParams}` : '/events/my-events';
    return await apiCall(endpoint);
  },
  
  // Get events user is attending
  getAttendingEvents: async (params = {}) => {
    const queryParams = new URLSearchParams(params);
    const endpoint = queryParams.toString() ? `/events/attending?${queryParams}` : '/events/attending';
    return await apiCall(endpoint);
  },
  
  // Search events
  searchEvents: async (searchQuery, filters = {}) => {
    const params = { q: searchQuery, ...filters };
    const queryParams = new URLSearchParams(params);
    return await apiCall(`/events/search?${queryParams}`);
  },
  
  // Get event categories
  getCategories: async () => {
    return await apiCall('/events/categories');
  },
  
  // Upload event image
  uploadEventImage: async (eventId, imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    return await apiCall(`/events/${eventId}/image`, {
      method: 'POST',
      body: formData,
      headers: {} // Remove Content-Type header to let browser set it for FormData
    });
  }
};

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


/* Get profile (requires auth) */
export async function getProfile() {
  return await fetchAPI("/auth/profile", "GET", null, true);
}

/* Logout user */
export function logoutUser() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
}
// Standalone exports for backward compatibility
export const getNearbyEvents = eventsAPI.getNearbyEvents;

export default api;




