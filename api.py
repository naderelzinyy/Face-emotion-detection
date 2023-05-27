import json
import threading

from fastapi import FastAPI, Request
from services.face_recognition.Prediction import Predictor
from services.face_recognition.Training import Trainer
from fastapi.middleware.cors import CORSMiddleware
from utils import convert_base64_to_image

emotion_detector = EmotionDetector()
app = FastAPI()
origins = ['http://localhost:3000/', 'http://localhost:8000/', 'http://127.0.0.1:3000/', 'http://0.0.0.0:3000/']
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/train")
async def train() -> dict:
    try:
        training_thread = threading.Thread(target=Trainer().train, args=("dataset", "models/trained_knn_model.clf"))
        training_thread.start()
        return {"message": "training started"}

    except Exception:
        return {"message": "training failed"}


@app.post("/predict")
async def predict(request: Request) -> dict[str, str]:
    body = await request.body()
    body = json.loads(body.decode())
    image = body.get("image")
    image = convert_base64_to_image(image)
    image.save('base_test.png')
    predicted_name = Predictor().predict(frame=image, model_path="models/trained_knn_model.clf")
    return {"name": predicted_name[0]} if len(predicted_name) else "user not found"


