import base64
import datetime
import os


class AddUser:
    dataset_directory = "dataset"

    def __init__(self):
        pass

    @classmethod
    def create_or_get_main_directory(cls):
        if not os.path.exists(cls.dataset_directory):
            os.makedirs(cls.dataset_directory)
            print(f"Directory created: {cls.dataset_directory}")
        else:
            print(f"Directory already exists: {cls.dataset_directory}")

        return cls.dataset_directory

    def create_user_directory(self, user_full_name: str):
        dataset_directory = self.create_or_get_main_directory()
        directory_path = os.path.join(dataset_directory, user_full_name)

        if not os.path.exists(directory_path):
            os.makedirs(directory_path)
            print(f"Directory created: {directory_path}")
        else:
            print(f"Directory already exists: {directory_path}")

        return directory_path

    def save_image(self, user_full_name: str, images: list):
        user_directory = self.create_user_directory(user_full_name)
        for image in images:
            if image.startswith('data:image'):
                image = image.split(',')[1]
            # convert to bytes
            image = base64.b64decode(image)
            with open(os.path.join(user_directory, f"{datetime.datetime.now()}.jpg"), 'wb') as image_file:
                image_file.write(image)
            print("Saved an image")
