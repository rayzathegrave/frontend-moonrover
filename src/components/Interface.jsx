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
                const lastFive = data.slice(-5);
                this.setState({
                    readings: lastFive,
                    currentTemperature: lastFive.length
                        ? `temperature = ${(parseFloat(lastFive.at(-1).temperature) + 273.15).toFixed(2)} K`
                        : '...',
                });
            })
            .catch((err) => console.error('Failed to fetch readings:', err));

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
        } catch (err) {
            this.addLog(`Failed to start script: ${err.message}`);
        }
    };

    handleStopScript = async () => {
        try {
            await ArduinoAPI.stopScript();
            this.addLog('Script stopped successfully');
        } catch (err) {
            this.addLog(`Failed to stop script: ${err.message}`);
        }
    };

    addLog = (msg) => this.setState({ logs: [msg] });

    render() {
        return (
            <div className="logo-box">
                <div className="flex justify-between w-full">
                    <img src={AASA_logo} alt="AASA Logo" className="logo-aad" />
                    <img src={AASA_logo} alt="AASA Logo" className="logo-aad" />
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

                <ReadingList readings={this.state.readings} />

                <button className="start-script-button" onClick={this.handleStartScript}>start script</button>
                <button className="start-script-button" onClick={this.handleStopScript}>stop script</button>
            </div>
        );
    }
}

export default Interface;
