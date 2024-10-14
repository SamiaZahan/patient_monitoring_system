# Improved oxygen_level_prediction.py

# Import necessary libraries
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout, Bidirectional
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau

# ----------------------------------
# Load the dataset
# ----------------------------------

df = pd.read_csv('dataSet.csv')
print(df.info())

# ----------------------------------
# Handle missing values (fill with mean)
# ----------------------------------

df.fillna(df.mean(), inplace=True)

# ----------------------------------
# Select the relevant column
# ----------------------------------

oxygen_data = df[['SP O2']]
print(oxygen_data.head())

# ----------------------------------
# Normalizing
# ----------------------------------

scaler = MinMaxScaler(feature_range=(0, 1))
scaled_data = scaler.fit_transform(oxygen_data)
print(scaled_data[:5])

# ----------------------------------
# Create Time Series
# ----------------------------------

def create_sequences(data, window_size):
    sequences = []
    targets = []
    for i in range(len(data) - window_size):
        sequences.append(data[i:i + window_size])
        targets.append(data[i + window_size])
    return np.array(sequences), np.array(targets)

# Increased window size to capture longer-term dependencies
window_size = 50
X, y = create_sequences(scaled_data, window_size)

print(X.shape, y.shape)

# ----------------------------------------------
# Split the Data into Training and Testing Sets
# ----------------------------------------------

split_ratio = 0.8
train_size = int(len(X) * split_ratio)

X_train, X_test = X[:train_size], X[train_size:]
y_train, y_test = y[:train_size], y[train_size:]
print(X_train.shape, X_test.shape)

# Reshape y for scaling back
y_train = y_train.reshape(-1, 1)
y_test = y_test.reshape(-1, 1)

# ----------------------------------------------
# Build the LSTM model with improvements
# ----------------------------------------------

model = Sequential()

# Added Bidirectional LSTM for better trend capturing
model.add(Bidirectional(LSTM(100, return_sequences=True, input_shape=(X_train.shape[1], 1))))
model.add(Dropout(0.3))

# Added another LSTM layer with increased neurons
model.add(LSTM(100, return_sequences=True))
model.add(Dropout(0.3))

# Added another LSTM layer without return sequences
model.add(LSTM(50))
model.add(Dropout(0.3))

# Output layer
model.add(Dense(1))

# Compile the model with MAE as loss
model.compile(optimizer='adam', loss='mean_absolute_error')

model.summary()

# ----------------------------------------------
# Train the model with callbacks
# ----------------------------------------------

early_stopping = EarlyStopping(monitor='val_loss', patience=15, restore_best_weights=True)
reduce_lr = ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=5, min_lr=1e-5)

history = model.fit(
    X_train, y_train,
    epochs=200,  # Increased epochs
    batch_size=16,  # Reduced batch size
    validation_data=(X_test, y_test),
    callbacks=[early_stopping, reduce_lr]
)

# ----------------------------------------------
# Plot the training and validation loss
# ----------------------------------------------

plt.plot(history.history['loss'], label='Training Loss')
plt.plot(history.history['val_loss'], label='Validation Loss')
plt.title('Model Loss Over Epochs')
plt.xlabel('Epochs')
plt.ylabel('Loss')
plt.legend()
plt.show()

# ----------------------------------------------
# Make , index=False)predictions on the test set
# ----------------------------------------------

predictions = model.predict(X_test)

# Inverse transform the predictions and actual values
predictions_rescaled = scaler.inverse_transform(predictions)
y_test_rescaled = scaler.inverse_transform(y_test)
# Save the test data to a CSV file so that it can be modified for further analysis
test_data = pd.DataFrame(y_test_rescaled, columns=['SP O2'])
test_data.to_csv('test_data.csv')

# Confirming the save operation
print("Test data saved as 'test_data.csv'.")

# Plot the results
plt.figure(figsize=(14, 5))
plt.plot(y_test_rescaled, label='True Oxygen Levels', color='blue')
plt.plot(predictions_rescaled, label='Predicted Oxygen Levels', color='red')
plt.title('True vs Predicted Oxygen Levels')
plt.xlabel('Time')
plt.ylabel('Oxygen Level')
plt.legend()
plt.show()

# Print real vs predicted values
print("\nReal vs Predicted Values:\n")
for real, predicted in zip(y_test_rescaled.flatten(), predictions_rescaled.flatten()):
    print(f"Real: {real:.2f}, Predicted: {predicted:.2f}")
