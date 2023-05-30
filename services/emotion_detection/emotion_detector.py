from dataclasses import dataclass

from deepface import DeepFace
from deepface.detectors import FaceDetector


@dataclass
class DeepFaceAttributes:
    """A class to store the attributes required for deepface emotion recognition.
    """

    detector_backend: str = "mtcnn"


class EmotionDetector(DeepFaceAttributes):
    def __int__(self):
        self.activate()

    def activate(self) -> None:
        """Initialize the class and start the face recognition service."""
        try:
            FaceDetector.build_model(self.detector_backend)

        except Exception as exception:
            print(exception)

    def detect_emotion(self, image):
        emotion = DeepFace.analyze(img_path=image,
                                actions=['emotion'], detector_backend=self.detector_backend, enforce_detection=False
                                )
        return emotion[0]['dominant_emotion']



