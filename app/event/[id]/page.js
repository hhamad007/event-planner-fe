/* 
Goal: Create a comprehensive event page where users can see all event details, view attendees, see location on map, and take actions like joining or editing the event.


What to Build:
Create the detailed view page for a single event. This page shows when users click on an event card to see full information and interact with the event.

Key Features to Include:

Event Header Section - Event title, date/time, location, and hero image
Event Description - Full details about what the event is about
Event Information Panel - Category, organizer info, capacity, price (if any)
Attendees Section - List of people attending with profile pictures
Interactive Map - Show exact event location with directions
Action Buttons - Join/Leave event, Edit/Delete (if owner), Share event
RSVP Status - Show if current user is attending or not

Technical Requirements:
Get event ID from URL using params.id (Next.js dynamic route)
Fetch specific event data from API using the event ID
Handle loading spinner while data loads
Show error message if event not found
Check if current user is event owner (show edit/delete options)
Check if user already joined event (show appropriate button)

Components to Use:
EventDetails - Main component for displaying event info
AttendeesList - Show list of attendees
MapComponent - Display location map
Use AuthContext to get current user info
Use api.js to fetch event data



*/