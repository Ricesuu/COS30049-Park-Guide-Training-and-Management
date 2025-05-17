import mqtt from "mqtt";
import mysql from "mysql2/promise";

// Connect to MQTT broker (e.g., Mosquitto running locally)
const mqttClient = mqtt.connect("mqtt://localhost:1883");

// Connect to MySQL
const db = await mysql.createConnection({
    host: "localhost",
    user: "your_user",
    password: "root",
    database: "password123"
});

// Subscribe to topic
mqttClient.on("connect", () => {
    console.log("Connected to MQTT broker");
    mqttClient.subscribe("iot/sensors/#"); // Listen to all sensors
});

// On message received
mqttClient.on("message", async (topic, message) => {
    const value = parseFloat(message.toString());
    const [_, __, sensorType] = topic.split("/"); // e.g., iot/sensors/temperature

    try {
        await db.execute(
            `INSERT INTO iotmonitoring (device_id, sensor_type, value) VALUES (?, ?, ?)`,
            ["esp32_1", sensorType, value]
        );
        console.log(`Stored ${sensorType} = ${value}`);
    } catch (error) {
        console.error("DB Insert Error:", error);
    }
});