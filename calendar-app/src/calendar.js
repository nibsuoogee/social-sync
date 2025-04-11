import React, { useState } from 'react';
import moment from 'moment';
import './App.css';

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(moment());

    const startOfMonth = currentDate.clone().startOf('month').startOf('week');
    const endOfMonth = currentDate.clone().endOf('month').endOf('week');

    const days = [];
    let day = startOfMonth.clone();

    while (day.isBefore(endOfMonth)) {
        days.push(day.clone());
        day.add(1, 'day');
    }

    const renderHeader = () => (
        <div className="calendar-header">
            <button onClick={() => setCurrentDate(currentDate.clone().subtract(1, 'month'))}>Prev</button>
            <h2>{currentDate.format('MMMM YYYY')}</h2>
            <button onClick={() => setCurrentDate(currentDate.clone().add(1, 'month'))}>Next</button>
        </div>
    );

    const renderDays = () => (
        <div className="calendar-days">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day}>{day}</div>
            ))}
        </div>
    );

    const renderDates = () => (
        <div className="calendar-dates">
            {days.map(day => (
                <div key={day.format('DD-MM-YYYY')} className={day.isSame(moment(), 'day') ? 'today' : ''}>
                    {day.date()}
                </div>
            ))}
        </div>
    );

    return (
        <div className="calendar">
            {renderHeader()}
            {renderDays()}
            {renderDates()}
        </div>
    );
};

export default Calendar;