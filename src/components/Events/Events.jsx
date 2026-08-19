import { useState } from "react";
import "./Events.css";


/* =========================================
   EVENT DATA
========================================= */

const topEvents = [
    {
        title: "EVENT 01",
        image: "/events/event-test.jpg",
        details:
            "This is the description for Event 01. More information about the event will be available here.",
    },
    {
        title: "EVENT 02",
        image: "/events/event-test.jpg",
        details:
            "This is the description for Event 02. More information about the event will be available here.",
    },
    {
        title: "EVENT 03",
        image: "/events/event-test.jpg",
        details:
            "This is the description for Event 03. More information about the event will be available here.",
    },
    {
        title: "EVENT 04",
        image: "/events/event-test.jpg",
        details:
            "This is the description for Event 04. More information about the event will be available here.",
    },
    {
        title: "EVENT 05",
        image: "/events/event-test.jpg",
        details:
            "This is the description for Event 05. More information about the event will be available here.",
    },
    {
        title: "EVENT 06",
        image: "/events/event-test.jpg",
        details:
            "This is the description for Event 06. More information about the event will be available here.",
    },
    {
        title: "EVENT 07",
        image: "/events/event-test.jpg",
        details:
            "This is the description for Event 07. More information about the event will be available here.",
    },
];

const bottomEvents = [
    {
        title: "EVENT 08",
        image: "/events/event-test.jpg",
        details:
            "This is the description for Event 08. More information about the event will be available here.",
    },
    {
        title: "EVENT 09",
        image: "/events/event-test.jpg",
        details:
            "This is the description for Event 09. More information about the event will be available here.",
    },
    {
        title: "EVENT 10",
        image: "/events/event-test.jpg",
        details:
            "This is the description for Event 10. More information about the event will be available here.",
    },
    {
        title: "EVENT 11",
        image: "/events/event-test.jpg",
        details:
            "This is the description for Event 11. More information about the event will be available here.",
    },
    {
        title: "EVENT 12",
        image: "/events/event-test.jpg",
        details:
            "This is the description for Event 12. More information about the event will be available here.",
    },
    {
        title: "EVENT 13",
        image: "/events/event-test.jpg",
        details:
            "This is the description for Event 13. More information about the event will be available here.",
    },
    {
        title: "EVENT 14",
        image: "/events/event-test.jpg",
        details:
            "This is the description for Event 14. More information about the event will be available here.",
    },
];


/* =========================================
   INDIVIDUAL EVENT CARD
========================================= */

function EventCard({ event }) {

    const [flipped, setFlipped] = useState(false);

    const handleMouseLeave = () => {
        setFlipped(false);
    };

    const handleClick = () => {
        setFlipped(true);
    };

    return (
        <div
            className={`film-frame ${flipped ? "is-flipped" : ""}`}
            onMouseLeave={handleMouseLeave}
        >

            <div
                className="event-card"
                onClick={handleClick}
            >

                {/* =================================
                    FRONT
                ================================= */}

                <div className="event-face event-front">

                    <img
                        src={event.image}
                        alt={event.title}
                        className="event-poster"
                    />

                </div>


                {/* =================================
                    BACK
                ================================= */}

                <div className="event-face event-back">

                    <div className="event-back-content">

                        <p>
                            {event.details}
                        </p>

                        <button
                            className="event-more"
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                        >
                            MORE
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}


/* =========================================
   FILM FRAMES
========================================= */

function FilmFrames({ events }) {

    return (
        <>
            {events.map((event, index) => (

                <EventCard
                    key={`${event.title}-${index}`}
                    event={event}
                />

            ))}
        </>
    );
}


/* =========================================
   EVENTS SECTION
========================================= */

export default function Events() {

    return (

        <section className="events">

            {/* =================================
                TOP FILM STRIP
            ================================= */}

            <div className="film-strip film-strip-top">

                <div className="film-track">

                    <FilmFrames events={topEvents} />
                    <FilmFrames events={topEvents} />
                    <FilmFrames events={topEvents} />
                    <FilmFrames events={topEvents} />

                </div>

            </div>


            {/* =================================
                EVENTS TITLE
            ================================= */}

            <div className="events-title">

                <h2>
                    EVENTS
                </h2>

            </div>


            {/* =================================
                BOTTOM FILM STRIP
            ================================= */}

            <div className="film-strip film-strip-bottom">

                <div className="film-track">

                    <FilmFrames events={bottomEvents} />
                    <FilmFrames events={bottomEvents} />
                    <FilmFrames events={bottomEvents} />
                    <FilmFrames events={bottomEvents} />

                </div>

            </div>

        </section>

    );
}