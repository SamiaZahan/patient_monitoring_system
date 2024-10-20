# predict_oxygen.py

import sys
import numpy as np
from tensorflow.keras.models import load_model
from sklearn.preprocessing import MinMaxScaler
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'  # Suppress TensorFlow warnings and only show errors
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3' 

print("Python script started")

model_file = '/Users/macbook/Desktop/patient_monitoring_system/patient-monitoring-system-be/prediction_model/oxygen_model.h5'


model = load_model(model_file)

# Load recent data from command line arguments
recent_data = [float(x) for x in sys.argv[1:]]
recent_data = np.array(recent_data).reshape(-1, 1)

# Scaling the data (use the same scaler as in training)
scaler = MinMaxScaler(feature_range=(0, 1))
scaled_data = scaler.fit_transform(recent_data)

# Create sequence for prediction
window_size = 10
X_input = scaled_data[-window_size:].reshape(1, window_size, 1)

# Make predictions for the next 10 steps
future_predictions = []
for _ in range(10):
    next_prediction = model.predict(X_input)[0, 0]  # Get the predicted value
    future_predictions.append(next_prediction)

    # Update the sequence by appending the predicted value and removing the first value
    X_input = np.append(X_input[:, 1:, :], [[[next_prediction]]], axis=1)

# Rescale the predicted values back to the original scale
future_predictions_rescaled = scaler.inverse_transform(np.array(future_predictions).reshape(-1, 1))

# Print the future predictions (as space-separated values)
print(" ".join(map(str, future_predictions_rescaled.flatten())))
