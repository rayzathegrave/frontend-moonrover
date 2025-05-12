import React, { Component } from 'react';
import './Interface.css';
import AASA_logo from '../assets/AASA_logo.withoutBackground.png';
import ArduinoAPI from '../services/ArduinoAPI';
import WebSocketClient from '../services/WebSocketClient';

class Interface extends Component {
    state = {
        logs: [],
        currentTemperature: '...', // State to store the current temperature
        readings: [], // State to store readings from the endpoint
    };

componentDidMount() {
    // Fetch readings from the endpoint
    fetch('http://localhost:8080/api/temperature')
        .then((response) => response.json())
        .then((data) => {
            this.setState({ readings: data.slice(-5) }); // Keep only the last 5 readings
        })
        .catch((error) => {
            console.error('Failed to fetch readings:', error);
        });

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

            // Add new reading to the list and keep only the last 5
            const newReading = {
                temperature: `${parsedData.temperature_1}°C`,
                timestamp: new Date().toISOString(),
            };
            this.setState((prevState) => ({
                readings: [...prevState.readings, newReading].slice(-5),
            }));
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
                    {this.state.readings.slice(0, 5).map((reading, index) => (
                        <input
                            key={index}
                            type="text"
                            readOnly
                            value={`${reading.temperature} @ ${new Date(reading.timestamp).toLocaleString()}`}
                            className="inner-box-temperature"
                        />
                    ))}
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