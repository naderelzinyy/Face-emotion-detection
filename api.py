import threading

from fastapi import FastAPI

from services.face_recognition.Prediction import Predictor
from services.face_recognition.Training import Trainer

app = FastAPI()


@app.get("/train")
async def train() -> dict:
    try:
        training_thread = threading.Thread(target=Trainer().train, args=("dataset", "models/trained_knn_model.clf"))
        training_thread.start()
        return {"message": "training started"}

    except Exception:
        return {"message": "training failed"}


@app.post("/predict")
async def predict(request: dict) -> dict[str, str]:
    print(f"{request = }")
    predicted_name = Predictor().predict(request.get("frame"))
    return {"name": predicted_name[0]} if len(predicted_name) else {"message": "user not found"}
