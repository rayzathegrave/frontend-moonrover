import React, { Component } from 'react';
import './Interface.css';
import AASA_logo from '../assets/AASA_logo.withoutBackground.png';
import ArduinoAPI, { sendReadingToBackend } from '../services/ArduinoAPI';
import WebSocketClient from '../services/WebSocketClient';
import ReadingList from './ReadingList';

class Interface extends Component {
    state = {
        logs: [],
        currentTemperature: '...',
        readings: [],
    };

componentDidMount() {
    // Load past readings from backend
    fetch('http://localhost:8080/api/temperature')
        .then((res) => res.json())
        .then((data) => {
            if (data.length === 0) {
                this.addLog('Fault: No temperature readings received from backend');
            } else {
                const lastFive = data.slice(-5);
                this.setState({
                    readings: lastFive,
                    currentTemperature: lastFive.length
                        ? `temperature = ${(parseFloat(lastFive.at(-1).temperature) + 273.15).toFixed(2)} K`
                        : '...',
                });
            }
        })
        .catch((err) => {
            console.error('Failed to fetch readings:', err);
            this.addLog('Fault: Unable to fetch temperature readings from backend');
        });

    // Try to open WebSocket (optional)
    this.webSocketClient = new WebSocketClient((reading) => {
        const kelvin = parseFloat(reading.temperature) + 273.15;
        this.setState((prev) => ({
            currentTemperature: `temperature = ${kelvin.toFixed(2)} K`,
            readings: [...prev.readings, reading].slice(-5),
        }));
        sendReadingToBackend(reading);
    });

    this.webSocketClient.connect();
}

    componentWillUnmount() {
        if (this.webSocketClient) {
            this.webSocketClient.disconnect();
        }
    }

handleStartScript = async () => {
    try {
        await ArduinoAPI.startScript();
        this.addLog('Script started successfully');

        // Set a timeout to display the fault message and then stop the script
        this.timeoutId = setTimeout(() => {
            this.addLog('Fault: no water detected', 5000); // Display for 5 seconds
            setTimeout(() => {
                this.handleStopScript();
            }, 5000); // Stop the script after the fault message duration
        }, 60000);
    } catch (err) {
        this.addLog(`Failed to start script: ${err.message}`);
    }
};

addLog = (msg, duration = null) => {
    this.setState({ logs: [msg] }); // Replace the logs array with the new message

    if (duration) {
        setTimeout(() => {
            this.setState({ logs: [] }); // Clear the message after the duration
        }, duration);
    }
};

handleStopScript = async () => {
    try {
        // Clear the timeout if stop script is pressed manually
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }

        await ArduinoAPI.stopScript();
        this.addLog('Script stopped successfully');
    } catch (err) {
        this.addLog(`Failed to stop script: ${err.message}`);
    }
};

    handleExportToCSV = () => {
        const { readings } = this.state;
        const csvContent = [
            ['Temperature (K)', 'Timestamp'], // Header row
            ...readings.map((r) => [
                (parseFloat(r.temperature) + 273.15).toFixed(2), // Convert to Kelvin
                r.timestamp,
            ]), // Data rows
        ]
            .map((row) => row.join(',')) // Join columns with commas
            .join('\n'); // Join rows with newlines

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'readings.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };



    render() {
        return (
            <div className="logo-box">
                <div className="flex justify-between w-full">
                    <img src={AASA_logo} alt="AASA Logo" className="logo-aad"/>
                    <img src={AASA_logo} alt="AASA Logo" className="logo-aad"/>
                </div>

                <div className="fault-codes-display">
                    {this.state.logs.map((log, i) => <div key={i}>{log}</div>)}
                </div>

                <input
                    type="text"
                    readOnly
                    value={this.state.currentTemperature}
                    className="current-box-temperature"
                />

                <ReadingList readings={this.state.readings}/>

                <button className="start-script-button" onClick={this.handleStartScript}>start script</button>
                <button className="start-script-button" onClick={this.handleStopScript}>stop script</button>
                <button className="start-script-button" onClick={this.handleExportToCSV}>Export to CSV</button>
            </div>
        );
    }
}

export default Interface;