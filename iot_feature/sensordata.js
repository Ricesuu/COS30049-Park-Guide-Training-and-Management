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

const park_id = 1; // You can dynamically assign this if needed

client.on("connect", () => {
  console.log("Connected to MQTT broker");

  Object.values(topics).forEach((topic) => {
    client.subscribe(topic, (err) => {
      if (!err) console.log(`Subscribed to ${topic}`);
    });
  });
});

client.on("message", async (topic, message) => {
  const value = parseFloat(message.toString());
  const recorded_at = new Date();

  if (isNaN(value)) return;

  let sensor_type = null;

  if (topic === topics.temperature) sensor_type = "temperature";
  else if (topic === topics.humidity) sensor_type = "humidity";
  else if (topic === topics.moisture) sensor_type = "soil moisture";
  else if (topic === topics.distance) sensor_type = "motion";
  else return; // Not a recognized topic

  try {
    const conn = await mysql.createConnection(dbConfig);

    await conn.execute(
      `INSERT INTO iotmonitoring (park_id, sensor_type, recorded_value, recorded_at)
       VALUES (?, ?, ?, ?)`,
      [park_id, sensor_type, value, recorded_at]
    );

    await conn.end();
    console.log(`Inserted ${sensor_type} = ${value}`);
  } catch (err) {
    console.error("DB Insert Error:", err);
  }
});
