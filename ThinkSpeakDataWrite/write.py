# Python version to send data from multiple files to ThingSpeak channel for multiple patients simultaneously
import requests
import time
import os
import threading

# ThingSpeak API keys and channel settings for patients by their IDs
patient_channels = {
    "patient_1": "4N75ZT3GX5OE701I",
    "patient_2": "0018FQPIUDHKQNWC",
    "patient_3": "Z9OCD1CVT6FFP4B7",
}
url = "https://api.thingspeak.com/update"

def send_oxygen_level(patient_id, api_key):
    file_name = f"{patient_id}.txt"
    if not os.path.exists(file_name):
        print(f"Data file for {patient_id} not found: {file_name}")
        return

    with open(file_name, 'r') as file:
        lines = [line.strip() for line in file if line.strip().isdigit()]

    for oxygen_level in lines:
        try:
            response = requests.get(url, params={
                'api_key': api_key,
                'field1': int(oxygen_level)
            })

            if response.status_code == 200:
                print(f"Data sent successfully for {patient_id}: Oxygen Level = {oxygen_level}%")
            else:
                print(f"Failed to send data for {patient_id}")
        except Exception as error:
            print(f"Error sending data for {patient_id}: {error}")

        # Wait for 15 seconds before sending the next data point
        time.sleep(15)

threads = []
for patient_id, api_key in patient_channels.items():
    thread = threading.Thread(target=send_oxygen_level, args=(patient_id, api_key))
    threads.append(thread)
    thread.start()

for thread in threads:
    thread.join()