import React, { Component } from 'react';
import './Interface.css';
import AASA_logo from '../assets/AASA_logo.withoutBackground.png';
import ArduinoAPI from '../services/ArduinoAPI';
import WebSocketClient from '../services/WebSocketClient';

class Interface extends Component {
    state = {
        logs: [],
        currentTemperature: '...', // State to store the current temperature
    };


componentDidMount() {
    // Initialize WebSocketClient and connect
    this.webSocketClient = new WebSocketClient((data) => {
        try {
            const parsedData = JSON.parse(data); // Parse the JSON data
            if (parsedData.temperature_1 !== undefined) {
                const temperatureInKelvin = parsedData.temperature_1 + 273.15; // Convert to Kelvin
                this.setState({ currentTemperature: `temperature = ${temperatureInKelvin.toFixed(2)} K` });
            } else {
                this.setState({ currentTemperature: 'Invalid data received' });
            }
        } catch (err) {
            console.error('Failed to parse WebSocket data:', err);
            this.setState({ currentTemperature: 'Error parsing data' });
        }
    });
    this.webSocketClient.connect();
}

    componentWillUnmount() {
        // Disconnect WebSocket when the component unmounts
        if (this.webSocketClient) {
            this.webSocketClient.disconnect();
        }
    }

    handleStartScript = async () => {
        try {
            await ArduinoAPI.startScript();
            this.addLog('Script started successfully');
        } catch (error) {
            this.addLog(`Failed to start script: ${error.message}`);
        }
    };

    handleStopScript = async () => {
        try {
            await ArduinoAPI.stopScript();
            this.addLog('Script stopped successfully');
        } catch (error) {
            this.addLog(`Failed to stop script: ${error.message}`);
        }
    };

    addLog = (message) => {
        this.setState({
            logs: [message],
        });
    };

    render() {
        return (
            <div className="logo-box">
                <div className="flex justify-between w-full">
                    <img src={AASA_logo} alt="AASA Logo" className="logo-aad" />
                    <img src={AASA_logo} alt="AASA Logo" className="logo-aad" />
                </div>

                <div className="fault-codes-display">
                    {this.state.logs.map((log, index) => (
                        <div key={index}>{log}</div>
                    ))}
                </div>

                <input
                    type="text"
                    readOnly
                    value={this.state.currentTemperature}
                    className="current-box-temperature"
                />

                <div className="outer-box-temperature">
                    <input type="text" readOnly value="24.5°C @ 2025-05-08 10:00" className="inner-box-temperature" />
                    <input type="text" readOnly value="24.3°C @ 2025-05-08 09:50" className="inner-box-temperature" />
                    <input type="text" readOnly value="24.2°C @ 2025-05-08 09:40" className="inner-box-temperature" />
                    <input type="text" readOnly value="24.0°C @ 2025-05-08 09:30" className="inner-box-temperature" />
                    <input type="text" readOnly value="23.9°C @ 2025-05-08 09:20" className="inner-box-temperature" />
                </div>

                <button className="start-script-button" onClick={this.handleStartScript}>
                    start script
                </button>
                <button className="start-script-button" onClick={this.handleStopScript}>
                    stop script
                </button>
            </div>
        );
    }
}

export default Interface;