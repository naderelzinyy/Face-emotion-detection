import threading

from fastapi import FastAPI

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


@app.get("/hello")
async def hello() -> dict[str, str]:
    return {"hello": "hello"}
