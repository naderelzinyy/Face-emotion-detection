import json
import threading

from fastapi import FastAPI, Request
from starlette.responses import JSONResponse

from services.add_user.add_user import AddUser
from services.emotion_detection.emotion_detector import EmotionDetector
from services.face_recognition.Prediction import Predictor
from services.face_recognition.Training import Trainer
from fastapi.middleware.cors import CORSMiddleware

from services.tts.system_response import TTSRequester
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


@app.post("/predict")
async def predict(request: Request) -> JSONResponse:

    body = await request.body()
    body = json.loads(body.decode())
    image = body.get("image")
    emotion = emotion_detector.detect_emotion(image=image)
    print(f"{emotion = }")
    image = convert_base64_to_image(image)
    image.save('base_test.png')
    predicted_name = Predictor().predict(frame=image, model_path="models/trained_knn_model.clf")
    sentence = TTSRequester.get_response(feeling=emotion, name=predicted_name if predicted_name != "unknown" else "")
    payload = {"name": predicted_name if len(predicted_name) else "user not found",
               "emotion": emotion,
               "utterance": sentence}
    headers = {"Access-Control-Allow-Origin": "*"}
    response = JSONResponse(content=payload, headers=headers)
    print(f"{response.headers = } -- {response.body = } ")
    return response


@app.post("/saveImages")
async def save_images(request: Request) -> JSONResponse:
    body = await request.body()
    body = json.loads(body.decode())
    images = list(body.get("images"))
    name = body.get("name")
    AddUser().save_image(images=images, user_full_name=name)
    training_thread = threading.Thread(target=Trainer().train, args=("dataset", "models/trained_knn_model.clf"))
    training_thread.start()
    training_thread.join()
    payload = {"message": "Photos saved"}
    headers = {"Access-Control-Allow-Origin": "*"}
    return JSONResponse(content=payload, headers=headers)

