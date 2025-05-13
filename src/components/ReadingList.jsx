import React from 'react';

function ReadingList({ readings }) {
    return (
        <div className="outer-box-temperature">
            {readings.map((r, i) => (
                <input
                    key={i}
                    type="text"
                    readOnly
                    value={`${r.temperature} @ ${new Date(r.timestamp).toLocaleString()}`}
                    className="inner-box-temperature"
                />
            ))}
        </div>
    );
}

export default ReadingList;
