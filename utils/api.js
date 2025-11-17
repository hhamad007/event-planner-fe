/* Write functions to communicate with the backend API. Include functions for login, register, getting events, creating events, and joining events. Handle errors and authentication tokens properly. */

import axios from "axios";

// API Configuration
//const API_BASE_URL = process.env.API_URL || "http://localhost:3000";
const API_BASE_URL =
  process.env.API_URL || "https://event-planner-backend-d1lv.onrender.com/api";

async function apiCall(endpoint, method, data) {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await axios({
    method,
    url,
    // headers: {
    //   authorization: this.tokenProvider()
    // },
    data,
  });
  console.log(response.data.data)
  return response.data.data;
}

// ======== 🧠 EVENT ROUTES ========

/* 📦 Get all events */
export async function getAllEvents() {
  return await apiCall("/events", "GET");
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

// // Token management utilities
// const TokenManager = {
//   getToken: () => {
//     if (typeof window !== "undefined") {
//       return (
//         localStorage.getItem("authToken") || sessionStorage.getItem("authToken")
//       );
//     }
//     return null;
//   },

//   setToken: (token, remember = false) => {
//     if (typeof window !== "undefined") {
//       if (remember) {
//         localStorage.setItem("authToken", token);
//         sessionStorage.removeItem("authToken");
//       } else {
//         sessionStorage.setItem("authToken", token);
//         localStorage.removeItem("authToken");
//       }
//     }
//   },

//   removeToken: () => {
//     if (typeof window !== "undefined") {
//       localStorage.removeItem("authToken");
//       sessionStorage.removeItem("authToken");
//     }
//   },
// };

// // Custom error classes
// export class APIError extends Error {
//   constructor(message, status = 500, code = null, details = null) {
//     super(message);
//     this.name = "APIError";
//     this.status = status;
//     this.code = code;
//     this.details = details;
//   }
// }

// export class AuthError extends APIError {
//   constructor(message, status = 401) {
//     super(message, status);
//     this.name = "AuthError";
//   }
// }

// export class ValidationError extends APIError {
//   constructor(message, details = null) {
//     super(message, 422, "VALIDATION_ERROR", details);
//     this.name = "ValidationError";
//   }
// }

// export class NetworkError extends APIError {
//   constructor(message = "Network connection failed") {
//     super(message, 0, "NETWORK_ERROR");
//     this.name = "NetworkError";
//   }
// }

// // Request/Response interceptors
// const requestInterceptor = (config) => {
//   // Add authentication token
//   const token = TokenManager.getToken();
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   // Add timestamp for cache busting
//   config.headers["X-Request-Time"] = new Date().toISOString();

//   // Add request ID for tracking
//   config.headers["X-Request-ID"] = `req_${Date.now()}_${Math.random()
//     .toString(36)
//     .substr(2, 9)}`;

//   return config;
// };

// // const responseInterceptor = {
// //   success: (response, data) => {
// //     // Log successful requests in development
// //     if (process.env.NODE_ENV === "development") {
// //       console.log(`✅ API Success: ${response.url}`, {
// //         status: response.status,
// //         data,
// //       });
// //     }
// //     return data;
// //   },

// //   error: async (response, endpoint) => {
// //     let errorData;
// //     try {
// //       errorData = await response.json();
// //     } catch {
// //       errorData = { message: "Unknown error occurred" };
// //     }

// //     // Handle different error types
// //     switch (response.status) {
// //       case 401:
// //         TokenManager.removeToken();
// //         if (typeof window !== "undefined") {
// //           window.dispatchEvent(new CustomEvent("auth:logout"));
// //         }
// //         throw new AuthError(errorData.message || "Authentication failed");

// //       case 403:
// //         throw new AuthError(errorData.message || "Access forbidden", 403);

// //       case 422:
// //         throw new ValidationError(
// //           errorData.message || "Validation failed",
// //           errorData.errors
// //         );

// //       case 429:
// //         throw new APIError(
// //           errorData.message || "Too many requests",
// //           429,
// //           "RATE_LIMIT"
// //         );

// //       case 500:
// //         throw new APIError(
// //           errorData.message || "Internal server error",
// //           500,
// //           "SERVER_ERROR"
// //         );

// //       default:
// //         console.log(response);
// //         throw new APIError(
// //           errorData.message || `Request failed with status ${response.status}`,
// //           response.status,
// //           errorData.code
// //         );
// //     }
// //   },
// // };

// // Base API call function with interceptors
// // const apiCall = async (endpoint, options = {}) => {
// //   const url = `${API_BASE_URL}${endpoint}`;

// //   // Default configuration
// //   let config = {
// //     method: "GET",
// //     headers: {
// //       "Content-Type": "application/json",
// //       Accept: "application/json",
// //     },
// //     timeout: API_TIMEOUT,
// //     ...options,
// //   };

// //   // Apply request interceptor
// //   config = requestInterceptor(config);

// //   try {
// //     // Create AbortController for timeout
// //     const controller = new AbortController();
// //     const timeoutId = setTimeout(() => controller.abort(), config.timeout);

// //     config.signal = controller.signal;

// //     const response = await fetch(url, config);
// //     console.log(response);

// //     clearTimeout(timeoutId);

// //     // Handle response
// //     if (response.ok) {
// //       const data = await response.json();
// //       return responseInterceptor.success(response, data);
// //     } else {
// //       await responseInterceptor.error(response, endpoint);
// //     }
// //   } catch (error) {
// //     if (error.name === "AbortError") {
// //       throw new NetworkError("Request timeout");
// //     }

// //     if (error instanceof APIError) {
// //       throw error;
// //     }

// //     // Network or other errors
// //     throw new NetworkError(error.message || "Network request failed");
// //   }
// // };

// const apiCall = async (endpoint, options = {}) => {
//   const url = `${API_BASE_URL}${endpoint}`;
//   const response = await axios.get(url, {
//     options,
//   });

//   console.log(response);
//   return response.data.data;
// };

// // Authentication API
// export const authAPI = {
//   // User registration
//   register: async (userData) => {
//     const response = await apiCall("/auth/register", {
//       method: "POST",
//       body: JSON.stringify({
//         firstName: userData.firstName,
//         lastName: userData.lastName,
//         email: userData.email,
//         password: userData.password,
//         confirmPassword: userData.confirmPassword,
//         ...(userData.phone && { phone: userData.phone }),
//         ...(userData.dateOfBirth && { dateOfBirth: userData.dateOfBirth }),
//       }),
//     });

//     if (response.token) {
//       TokenManager.setToken(response.token, userData.rememberMe);
//     }

//     return response;
//   },

//   // User login
//   login: async (credentials) => {
//     const response = await apiCall("/auth/login", {
//       method: "POST",
//       body: JSON.stringify({
//         email: credentials.email,
//         password: credentials.password,
//       }),
//     });

//     if (response.token) {
//       TokenManager.setToken(response.token, credentials.rememberMe);
//     }

//     return response;
//   },

//   // User logout
//   logout: async () => {
//     try {
//       await apiCall("/auth/logout", { method: "POST" });
//     } finally {
//       TokenManager.removeToken();
//     }
//   },

//   // Refresh token
//   refreshToken: async () => {
//     const response = await apiCall("/auth/refresh", { method: "POST" });

//     if (response.token) {
//       TokenManager.setToken(response.token, true);
//     }

//     return response;
//   },

//   // Get current user profile
//   getProfile: async () => {
//     return await apiCall("/auth/profile");
//   },

//   // Update user profile
//   updateProfile: async (profileData) => {
//     return await apiCall("/auth/profile", {
//       method: "PUT",
//       body: JSON.stringify(profileData),
//     });
//   },

//   // Change password
//   changePassword: async (passwordData) => {
//     return await apiCall("/auth/change-password", {
//       method: "POST",
//       body: JSON.stringify({
//         currentPassword: passwordData.currentPassword,
//         newPassword: passwordData.newPassword,
//         confirmPassword: passwordData.confirmPassword,
//       }),
//     });
//   },

//   // Request password reset
//   requestPasswordReset: async (email) => {
//     return await apiCall("/auth/reset-password/request", {
//       method: "POST",
//       body: JSON.stringify({ email }),
//     });
//   },

//   // Reset password with token
//   resetPassword: async (token, newPassword, confirmPassword) => {
//     return await apiCall("/auth/reset-password/confirm", {
//       method: "POST",
//       body: JSON.stringify({
//         token,
//         newPassword,
//         confirmPassword,
//       }),
//     });
//   },

//   // Verify email
//   verifyEmail: async (token) => {
//     return await apiCall("/auth/verify-email", {
//       method: "POST",
//       body: JSON.stringify({ token }),
//     });
//   },

//   // Resend verification email
//   resendVerification: async (email) => {
//     return await apiCall("/auth/resend-verification", {
//       method: "POST",
//       body: JSON.stringify({ email }),
//     });
//   },
// };

// //
// // ======== 👤 AUTH ROUTES ========
// //

// /* 🪪 Register user */
// export async function registerUser(data) {
//   return await fetchAPI("/auth/register", "POST", data);
// }
// // Events API
// export const eventsAPI = {
//   // Get all events with optional filters
//   getEvents: async (params = {}) => {
//     const queryParams = new URLSearchParams();

//     Object.entries(params).forEach(([key, value]) => {
//       if (value !== undefined && value !== null && value !== "") {
//         queryParams.append(key, value);
//       }
//     });

//     const queryString = queryParams.toString();
//     const endpoint = queryString ? `/events?${queryString}` : "/events";

//     return await apiCall(endpoint);
//   },

//   // Get nearby events based on location
//   getNearbyEvents: async (lat = 51.5072, lon = -0.1276, radius = 10) => {
//     const params = {
//       latitude: lat,
//       longitude: lon,
//       radius: radius,
//       limit: 20,
//     };

//     const queryParams = new URLSearchParams(params);
//     return await apiCall(`/events/nearby?${queryParams}`);
//   },

//   // Get single event by ID
//   getEvent: async (eventId) => {
//     return await apiCall(`/events/${eventId}`);
//   },

//   // Create new event
//   createEvent: async (eventData) => {
//     return await apiCall("/events", {
//       method: "POST",
//       body: JSON.stringify({
//         title: eventData.title,
//         description: eventData.description,
//         startDate: eventData.startDate,
//         endDate: eventData.endDate,
//         location: eventData.location,
//         maxAttendees: eventData.maxAttendees,
//         category: eventData.category,
//         tags: eventData.tags || [],
//         isPublic: eventData.isPublic !== false,
//         requiresApproval: eventData.requiresApproval || false,
//         ...(eventData.price && { price: eventData.price }),
//         ...(eventData.coordinates && { coordinates: eventData.coordinates }),
//       }),
//     });
//   },

//   // Update existing event
//   updateEvent: async (eventId, eventData) => {
//     return await apiCall(`/events/${eventId}`, {
//       method: "PUT",
//       body: JSON.stringify(eventData),
//     });
//   },

//   // Delete event
//   deleteEvent: async (eventId) => {
//     return await apiCall(`/events/${eventId}`, {
//       method: "DELETE",
//     });
//   },

//   // Join an event
//   joinEvent: async (eventId, joinData = {}) => {
//     return await apiCall(`/events/${eventId}/join`, {
//       method: "POST",
//       body: JSON.stringify(joinData),
//     });
//   },

//   // Leave an event
//   leaveEvent: async (eventId) => {
//     return await apiCall(`/events/${eventId}/leave`, {
//       method: "POST",
//     });
//   },

//   // Get event attendees
//   getEventAttendees: async (eventId) => {
//     return await apiCall(`/events/${eventId}/attendees`);
//   },

//   // Get user's events (created by user)
//   getUserEvents: async (params = {}) => {
//     const queryParams = new URLSearchParams(params);
//     const endpoint = queryParams.toString()
//       ? `/events/my-events?${queryParams}`
//       : "/events/my-events";
//     return await apiCall(endpoint);
//   },

//   // Get events user is attending
//   getAttendingEvents: async (params = {}) => {
//     const queryParams = new URLSearchParams(params);
//     const endpoint = queryParams.toString()
//       ? `/events/attending?${queryParams}`
//       : "/events/attending";
//     return await apiCall(endpoint);
//   },

//   // Search events
//   searchEvents: async (searchQuery, filters = {}) => {
//     const params = { q: searchQuery, ...filters };
//     const queryParams = new URLSearchParams(params);
//     return await apiCall(`/events/search?${queryParams}`);
//   },

//   // Get event categories
//   getCategories: async () => {
//     return await apiCall("/events/categories");
//   },

//   // Upload event image
//   uploadEventImage: async (eventId, imageFile) => {
//     const formData = new FormData();
//     formData.append("image", imageFile);

//     return await apiCall(`/events/${eventId}/image`, {
//       method: "POST",
//       body: formData,
//       headers: {}, // Remove Content-Type header to let browser set it for FormData
//     });
//   },
// };

// // ===== AUTH =====
// export async function loginUser(data) {
//   const res = await fetchAPI("/auth/login", "POST", data);
//   if (res?.token && typeof window !== "undefined") {
//     localStorage.setItem("token", res.token);
//     console.log(" Token saved:", res.token);
//   } else {
//     console.warn(" No token returned from login.");
//   }
//   return res;
// }

// /* Get profile (requires auth) */
// export async function getProfile() {
//   return await fetchAPI("/auth/profile", "GET", null, true);
// }

// /* Logout user */
// export function logoutUser() {
//   if (typeof window !== "undefined") {
//     localStorage.removeItem("token");
//   }
// }
// // Standalone exports for backward compatibility
// export const getNearbyEvents = eventsAPI.getNearbyEvents;

// export default api;
