import mysql.connector
import paho.mqtt.client as mqtt
from datetime import datetime

# --- MySQL Setup ---
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="password123",
    database="iotmonitoring"
)
cursor = db.cursor()

# --- MQTT Setup ---
MQTT_BROKER = "172.20.10.3"  # or IP if running elsewhere
MQTT_PORT = 1883
MQTT_TOPICS = [
    "sensor/DHT11/humidity",
    "sensor/DHT11/temperature",
    "sensor/Ultrasonic/distance",
    "sensor/Soil Moisture/moisture"
]

# --- MQTT Callbacks ---
def on_connect(client, userdata, flags, rc):
    print("Connected to MQTT broker with code:", rc)
    for topic in MQTT_TOPICS:
        client.subscribe(topic)

def on_message(client, userdata, msg):
    value = msg.payload.decode()
    print(f"Received on {msg.topic}: {value}")

    sql = "INSERT INTO readings (topic, value) VALUES (%s, %s)"
    cursor.execute(sql, (msg.topic, value))
    db.commit()

# --- Run MQTT Client ---
client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

client.connect(MQTT_BROKER, MQTT_PORT, 60)
client.loop_forever()