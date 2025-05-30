const mqtt = require("mqtt");


const client = mqtt.connect("mqtt://172.20.10.4:1883", {
  username: "zasha",
  password: "mypassword",
});

// MQTT topics
const topics = {
  humidity: "sensor/DHT11/humidity",
  temperature: "sensor/DHT11/temperature",
  distance: "sensor/Ultrasonic/distance",
  moisture: "sensor/Soil Moisture/moisture",
};

const park_id = 1; // Replace with actual dynamic park ID if needed

client.on("connect", () => {
  console.log(" Connected to MQTT broker");

  Object.values(topics).forEach((topic) => {
    client.subscribe(topic, (err) => {
      if (!err) {
        console.log(`Subscribed to ${topic}`);
      } else {
        console.error(`Failed to subscribe to ${topic}:`, err.message);
      }
    });
  });
});

client.on("message", async (topic, message) => {
  const value = parseFloat(message.toString());

  if (isNaN(value)) {
    console.warn(`⚠️ Received non-numeric value on ${topic}: ${message}`);
    return;
  }

  let sensor_type = null;
  if (topic === topics.temperature) sensor_type = "temperature";
  else if (topic === topics.humidity) sensor_type = "humidity";
  else if (topic === topics.moisture) sensor_type = "soil moisture";
  else if (topic === topics.distance) sensor_type = "motion";
  else return; // Unrecognized topic

  try {
    const response = await fetch("http://localhost:3000/api/iot-monitoring", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        park_id,
        sensor_type,
        recorded_value: value.toString(),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Unknown error from API");
    }

    console.log(
      ` Sent ${sensor_type} = ${value} to API | Insert ID: ${data.id}`
    );
  } catch (err) {
    console.error("API POST Error:", err.message);
  }
});

