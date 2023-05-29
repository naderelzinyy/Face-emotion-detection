import pickle

import cv2
import face_recognition
import numpy as np


class Predictor:
    model_path = "../../models/trained_knn_model.clf"

    @staticmethod
    def predict(frame, model_path, knn_clf=None, threshold=0.6):  # accuracy = 1 - threshold
        if not (knn_clf or model_path):
            raise Exception("No model supplied")
        # Load the passed KNN model.
        if knn_clf is None:
            with open(model_path, 'rb') as f:
                knn_clf = pickle.load(f)
        # Get the face location of the passed image.
        frame = np.array(frame)
        frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        face_box = face_recognition.face_locations(frame)
        # return an empty list If no faces are detected in the picture.
        if len(face_box) == 0:
            return []
        # Get faces encodings.
        faces_encodings = face_recognition.face_encodings(frame, known_face_locations=face_box)
        # Get best matches for the existing faces.
        closest_distances = knn_clf.kneighbors(faces_encodings, n_neighbors=2)
        print(f"{closest_distances = }")
        matches = [closest_distances[0][i][0] <= threshold for i in range(len(face_box))]
        print(f"{matches = }")
        # predict classes and remove the matched points which are not with in the threshold.
        res = [(pred, loc) if rec else ("unknown", loc) for pred, loc, rec in
         zip(knn_clf.predict(faces_encodings), face_box, matches
             )]
        print(f"{res = }")
        return res[0][0]


if __name__ == '__main__':
    Predictor().predict()
