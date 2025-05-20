import React from 'react';

function ReadingList({ readings }) {
    return (
        <div className="outer-box-temperature">
            {readings.map((r, i) => {
                const temperatureInKelvin = (parseFloat(r.temperature) + 273.15).toFixed(2);
                return (
                    <input
                        key={i}
                        type="text"
                        readOnly
                        value={`${temperatureInKelvin} K @ ${new Date(r.timestamp).toLocaleString()}`}
                        className="inner-box-temperature"
                    />
                );
            })}
        </div>
    );
}

export default ReadingList;