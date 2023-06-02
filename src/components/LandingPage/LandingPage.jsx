import { useState } from "react";
import "./LandingPage.css";
import data from "../../assets/data.json";

const LandingPage = () => {
  const [showDetails, setShowDetails] = useState(true);
  const [selectedElection, setSelectedElection] = useState(0);

  const events = data;

  const [selectedEvent, setSelectedEvent] = useState(events[0]);

  const showDateDetails = (date) => {
    setSelectedElection(0);
    setSelectedEvent(date);
    setShowDetails(true);
  };

  return (
    <>
      <h2>Projet ELYSSA</h2>
      <p className="introduction">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Possimus
        reiciendis aperiam consequatur fuga rem, voluptates expedita fugiat
        exercitationem! Dolore id culpa omnis quam harum adipisci tempora unde
        pariatur nam. Doloribus!
      </p>
      <div className="main-container">
        <div className="timeline-container">
          <div className="timeline-connector"></div>
          {events.map((event) => (
            <div
              key={event.date}
              className="timeline-event"
              onMouseEnter={() => showDateDetails(event)}
            >
              <div className="event-date">{event.date}</div>
            </div>
          ))}
        </div>
        {showDetails && (
          <div className="event-details">
            <div className="event-details-content">
              <div className="event-image">
                <img
                  src={selectedEvent.elections[selectedElection].image}
                  alt="Event"
                />
              </div>
              <div className="event-description">
                {selectedEvent.elections.map((election, index) => (
                  <button
                    className="event-description-election-selection-button"
                    key={election.type}
                    onClick={() => setSelectedElection(index)}
                  >
                    {election.type}
                  </button>
                ))}
                <p>{selectedEvent.elections[selectedElection].description}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default LandingPage;
