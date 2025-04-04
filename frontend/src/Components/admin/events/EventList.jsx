import React, { useState, useEffect } from "react";
import "./EventsLists.css";

const EventsList = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]); // Store feedbacks
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false); // Control feedback visibility

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/events");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched events:", data);
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Function to fetch feedbacks for a specific event
  const fetchFeedbacks = async (eventId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/events/${eventId}/feedbacks`);

      if (!response.ok) {
        throw new Error(`Failed to fetch feedbacks! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      setFeedbacks(data);
      setShowFeedback(true);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      setFeedbacks([]);
      setShowFeedback(true);
    }
  };

  if (loading) return <div className="loading">Loading events...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  
  return (
    <div className="events-container">
      <h2 className="events-title">Event List</h2>
      <div className="events-grid">
        {events.map(event => (
          <div 
            key={event.id} 
            className="event-item"
            onClick={() => {
              setSelectedEvent(event);
              setShowFeedback(false); // Reset feedback visibility when a new event is selected
            }}
          >
            <h3 className="event-name">{event.name}</h3>
            <p className="event-date">{event.date}</p>
          </div>
        ))}
      </div>

      {selectedEvent && (
        <div className="event-card">
          <div className="event-card-content">
            <h2 className="event-card-title">{selectedEvent.name}</h2>
            <p className="event-card-date">{selectedEvent.date}</p>
            <p className="event-card-description">{selectedEvent.description}</p>
            
            {/* Image container with error handling */}
            {selectedEvent.imageBase64 ? (
              <div className="event-image-container">
                <img 
                  src={`data:image/jpeg;base64,${selectedEvent.imageBase64}`}  
                  alt={`Event: ${selectedEvent.name}`}
                  className="event-card-image"
                  onError={(e) => {
                    console.error("Image failed to load:", e);
                    e.target.onerror = null; // Prevent infinite loop
                    e.target.src = "/placeholder.jpg";
                  }}
                />
              </div>
            ) : (
              <div className="image-placeholder">No image available</div>
            )}

            <div className="parent-container">
              <button 
                className="event-card-close"
                onClick={() => {
                  setSelectedEvent(null);
                  setShowFeedback(false);
                }}
              >
                Close
              </button>
              <button 
                className="event-card-feedback"
                onClick={() => fetchFeedbacks(selectedEvent.id)}
              >
                View Feedback
              </button>
            </div>

            {/* Feedback Section */}
            {showFeedback && (
              <div className="feedbacks-section">
                <h3 className="feedbacks-title">Feedback</h3>
                {feedbacks.length > 0 ? (
                  <ul className="feedbacks-list">
                    {feedbacks.map((feedback, index) => (
                      <li key={index} className="feedbacks-item">
                        <span className="feedbacks-user">{feedback.username}:</span> 
                        <span className="feedbacks-comment"> {feedback.comment}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="no-feedbacks">No feedback available.</p>
                )}
                <button 
                  className="feedbacks-close"
                  onClick={() => setShowFeedback(false)}
                >
                  Close Feedback
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsList;
