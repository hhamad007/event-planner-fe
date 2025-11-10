const API_KEY = process.env.NEXT_PUBLIC_TICKETMASTER_API_KEY;
const BASE_URL = "https://app.ticketmaster.com/discovery/v2";

/**
 * Fetch nearby events from Ticketmaster API
 * @param {number} lat - Latitude (default: London)
 * @param {number} lon - Longitude (default: London)
 */
export async function getNearbyEvents(lat = 51.5072, lon = -0.1276) {
  try {
    if (!API_KEY) {
      console.error("❌ Missing Ticketmaster API Key. Add it to .env.local");
      return [];
    }

    const url = `${BASE_URL}/events.json?apikey=${API_KEY}&latlong=${lat},${lon}&radius=50&size=20&sort=date,asc`;

    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Failed to fetch events: ${res.status}`);
    }

    const data = await res.json();
    const events = data._embedded?.events || [];

    console.log(`✅ Fetched ${events.length} events from Ticketmaster`);
    return events;
  } catch (error) {
    console.error("⚠️ Error fetching events:", error);
    return [];
  }
}

/**
 * Fetch specific event details by ID
 * @param {string} id - Ticketmaster event ID
 */
export async function getEventById(id) {
  try {
    if (!API_KEY) {
      console.error("❌ Missing Ticketmaster API Key. Add it to .env.local");
      return null;
    }

    const url = `${BASE_URL}/events/${id}.json?apikey=${API_KEY}`;
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Failed to fetch event with ID: ${id}`);
    }

    const event = await res.json();
    return event;
  } catch (error) {
    console.error("⚠️ Error fetching event by ID:", error);
    return null;
  }
}
