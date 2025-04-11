import React, { useState } from 'react';
import Calendar from './calendar';
import './App.css';

function App() {
    const [selectedBox, setSelectedBox] = useState(null);

    const boxInfo = {
        Events: "Details about events",
        School: "Details about school",
        Work: "Details about work",
        Recreation: "Details about recreation",
        Create: "Details about creating new items",
        Import: "Details about importing items"
    };

    const handleBoxClick = (box) => {
        setSelectedBox(box);
    };

    return (
        <div className="App">
            <div className="header">
                Social Sync
                <button className="sign-out-button">Sign Out</button>
            </div>
            <div className="personal-calendars">
                <h3>Personal calendars</h3>
                <div className="calendar-boxes">
                    {Object.keys(boxInfo).map(box => (
                        <div key={box} className="box" onClick={() => handleBoxClick(box)}>
                            <i className={`icon-${box.toLowerCase()}`}></i> {box}
                        </div>
                    ))}
                </div>
                {selectedBox && (
                    <div className="info-box">
                        <h4>{selectedBox}</h4>
                        <p>{boxInfo[selectedBox]}</p>
                    </div>
                )}
            </div>
            <Calendar />
        </div>
    );
}

export default App;
