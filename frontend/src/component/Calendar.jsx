import React, { useState, useEffect } from "react";
import "./Calendar.css";

const Calendar = () => {
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [days, setDays] = useState([]);
    const [selectedDay, setSelectedDay] = useState(null);
    const [popup, setPopup] = useState({ show: false, message: "", position: {} });
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        eventType: "UserGeneralEvent",
        startDate: "",
        endDate: "",
        notes: "",
    });
    const [events, setEvents] = useState([]); // Placeholder for events


    useEffect(() => {
        renderCalendar();
    }, [currentMonth, currentYear]);

    const renderCalendar = () => {
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        const startDay = firstDay === 0 ? 6 : firstDay - 1;
        const daysArray = [];

        // Empty cells for offset
        for (let i = 0; i < startDay; i++) {
            daysArray.push({ day: null });
        }

        // Days in month
        for (let day = 1; day <= daysInMonth; day++) {
            daysArray.push({ day, highlight: day >= 4 && day <= 10 });
        }

        setDays(daysArray);
    };

    const changeMonth = (change) => {
        let newMonth = currentMonth + change;
        let newYear = currentYear;

        if (newMonth < 0) {
            newMonth = 11;
            newYear--;
        } else if (newMonth > 11) {
            newMonth = 0;
            newYear++;
        }

        setCurrentMonth(newMonth);
        setCurrentYear(newYear);
        setSelectedDay(null); // Reset selected day when the month changes
        setPopup({ show: false, message: "", position: {} }); // Close any open popups
    };

    const chooseDay = (day, event) => {
        if (!day) return;

        setSelectedDay(day);

        const message =
            day >= 4 && day <= 10
                ? `You are on day ${day - 3} of your period.`
                : "No events on this day.";

        const rect = event.target.getBoundingClientRect();

        // Set popup position relative to the clicked day
        const position = {
            top: rect.top + window.scrollY + rect.height + 10,
            left: rect.left + rect.width / 2,
        };

        setPopup({ show: true, message, position });

        // Automatically hide the popup after 3 seconds
        setTimeout(() => setPopup({ show: false, message: "", position: {} }), 3000);
    };

    const addEvent = () => {
        if (!formData.startDate) {
            alert("Please select a start date.");
            return;
        }

        const newEvent = {
            eventType: formData.eventType,
            startDate: formData.startDate,
            endDate: formData.endDate || formData.startDate,
            notes: formData.notes,
        };

        setEvents([...events, newEvent]);
        setFormData({
            eventType: "UserGeneralEvent",
            startDate: "",
            endDate: "",
            notes: "",
        });
        setShowForm(false);
    };

    return (
        <div className="calendar-container">
            <div className="calendar-header">
                <button onClick={() => changeMonth(-1)}>&#9665;</button>
                <span>{`${months[currentMonth]}, ${currentYear}`}</span>
                <button onClick={() => changeMonth(1)}>&#9655;</button>
            </div>
            <div className="weekdays">
                {["MO", "TU", "WE", "TH", "FR", "SA", "SU"].map((day, index) => (
                    <div key={index}>{day}</div>
                ))}
            </div>
            <div className="calendar-grid">
                {days.map((item, index) => (
                    <div
                        key={index}
                        className={`day ${item.highlight ? "highlight" : ""} ${
                            selectedDay === item.day ? "selected" : ""
                        }`}
                        onClick={(event) => chooseDay(item.day, event)}
                    >
                        {item.day || ""}
                    </div>
                ))}
            </div>
            {popup.show && (
                <div
                    className="popup"
                    style={{
                        top: popup.position.top,
                        left: popup.position.left,
                        transform: "translateX(-50%)",
                    }}
                >
                    {popup.message}
                </div>
            )}
            <button className="add-event-btn" onClick={() => setShowForm(true)}>+</button>

            {showForm && (
                <div className="event-form">
                    <h2>Add Event</h2>
                    <select
                        value={formData.eventType}
                        onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                    >
                        <option value="UserBooking">Booking</option>
                        <option value="UserPeriod">Period</option>
                        <option value="UserGeneralEvent">General Event</option>
                    </select>
                    <div>
                    <label htmlFor="startDate">Start Date</label>
                    <input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        required
                    />
                    </div>
                    <div>
                    <label htmlFor="endDate">End Date</label>
                    <input
                        id="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                    </div>
                    <textarea
                        placeholder="Notes"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    ></textarea>
                    <button onClick={addEvent}>Add Event</button>
                    <button onClick={() => setShowForm(false)}>Cancel</button>
                </div>
            )}
        </div>
    );
};

export default Calendar;
