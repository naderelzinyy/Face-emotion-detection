import base64
from io import BytesIO

from PIL import Image


def convert_base64_to_image(base64_string):
    # remove header
    if base64_string.startswith('data:image'):
        base64_string = base64_string.split(',')[1]

    # convert to bytes
    image_bytes = base64.b64decode(base64_string)

    return Image.open(BytesIO(image_bytes))
