const mqtt = require("mqtt");
const mysql = require("mysql2/promise");

const client = mqtt.connect("mqtt://172.20.10.4:1883", {
  username: "zasha",
  password: "mypassword",
});

// MySQL config
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "password123",
  database: "park_guide_management",
};

// MQTT topics
const topics = {
  humidity: "sensor/DHT11/humidity",
  temperature: "sensor/DHT11/temperature",
  distance: "sensor/Ultrasonic/distance", 
  moisture: "sensor/Soil Moisture/moisture",
};


let currentData = {
  sensor_id: "ESP32-1", 
  temperature: null,
  humidity: null,
  soil_moisture: null,
  timestamp: null,
};


let insertTimeout = null;


client.on("connect", () => {
  console.log("Connected to MQTT broker");

  Object.values(topics).forEach((topic) => {
    client.subscribe(topic, (err) => {
      if (!err) console.log(`Subscribed to ${topic}`);
    });
  });
});


client.on("message", (topic, message) => {
  const value = parseFloat(message.toString());

  if (isNaN(value)) return;

  if (topic === topics.temperature) currentData.temperature = value;
  else if (topic === topics.humidity) currentData.humidity = value;
  else if (topic === topics.moisture) currentData.soil_moisture = value;

  currentData.timestamp = new Date();

  
  if (insertTimeout) clearTimeout(insertTimeout);

  insertTimeout = setTimeout(async () => {
    
    if (
      currentData.temperature !== null &&
      currentData.humidity !== null &&
      currentData.soil_moisture !== null
    ) {
      try {
        const conn = await mysql.createConnection(dbConfig);
        await conn.execute(
          `INSERT INTO sensor_data (sensor_id, temperature, humidity, soil_moisture, timestamp)
           VALUES (?, ?, ?, ?, ?)`,
          [
            currentData.sensor_id,
            currentData.temperature,
            currentData.humidity,
            currentData.soil_moisture,
            currentData.timestamp,
          ]
        );
        await conn.end();

        console.log("Inserted row:", currentData);
      } catch (err) {
        console.error("DB Insert Error:", err);
      }

      
      currentData.temperature = null;
      currentData.humidity = null;
      currentData.soil_moisture = null;
      currentData.timestamp = null;
    }
  }, 2000); // Wait 2s before inserting
});