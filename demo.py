import tensorflow as tf
import numpy as np
import pandas as pd
import nltk
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.layers import (
    Input,
    Embedding,
    LSTM,
    Dense,
    GlobalMaxPooling1D,
    Flatten,
)
from tensorflow.keras.models import Model
import matplotlib.pyplot as plt
import string
import json
import pickle
from tensorflow.keras.preprocessing.sequence import pad_sequences
from sklearn.preprocessing import LabelEncoder
import random
from flask import Flask, request

# Load the intents data from the JSON file
with open("content.json") as content:
    data = json.load(content)

# Get all the data into lists
tags = []
inputs = []
responses = {}
for intent in data["intents"]:
    responses[intent["tag"]] = intent["responses"]
    for line in intent["input"]:
        inputs.append(line)
        tags.append(intent["tag"])

# Convert to DataFrame
data_df = pd.DataFrame({"inputs": inputs, "tags": tags})

# Preprocessing
data_df["inputs"] = data_df["inputs"].apply(
    lambda wrd: [ltrs.lower() for ltrs in wrd if ltrs not in string.punctuation]
)
data_df["inputs"] = data_df["inputs"].apply(lambda wrd: "".join(wrd))

# Tokenization and Padding
tokenizer = Tokenizer(num_words=2000)
tokenizer.fit_on_texts(data_df["inputs"])
train = tokenizer.texts_to_sequences(data_df["inputs"])
x_train = pad_sequences(train)

# Encoding the outputs
le = LabelEncoder()
y_train = le.fit_transform(data_df["tags"])

input_shape = x_train.shape[1]
vocabulary = len(tokenizer.word_index)
output_length = le.classes_.shape[0]

# Creating the model
i = Input(shape=(input_shape,))
x = Embedding(vocabulary + 1, 10)(i)
x = LSTM(10, return_sequences=True)(x)
x = Flatten()(x)
x = Dense(output_length, activation="softmax")(x)
model = Model(i, x)

# Compiling the model
model.compile(
    loss="sparse_categorical_crossentropy", optimizer="adam", metrics=["accuracy"]
)

# Training the model
model.fit(x_train, y_train, epochs=200)

# Save the tokenizer and model
tokenizer_path = "tokenizer.pkl"
model_path = "model.h5"
tokenizer.save_pretrained(tokenizer_path)
model.save(model_path)

# Load the saved tokenizer and model
tokenizer = Tokenizer()
tokenizer = tokenizer.from_config(pickle.load(open(tokenizer_path, "rb")))
model = tf.keras.models.load_model(model_path)

# Flask App
app = Flask(__name__)


@app.route("/request", methods=["POST"])
def chatbot():
    data = request.get_json()["message"]
    texts_p = []
    texts_p.extend(data)

    # Preprocess the input text
    prediction_input = [
        letters.lower() for letters in texts_p if letters not in string.punctuation
    ]
    prediction_input = "".join(prediction_input)

    # Tokenize and pad the input
    prediction_input = tokenizer.texts_to_sequences([prediction_input])
    prediction_input = np.array(prediction_input).reshape(-1)
    prediction_input = pad_sequences([prediction_input], input_shape)

    # Get the predicted output
    output = model.predict(prediction_input)
    output = output.argmax()

    # Find the corresponding tag and select a random response
    response_tag = le.inverse_transform([output])[0]
    response = random.choice(responses[response_tag])

    return response


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
