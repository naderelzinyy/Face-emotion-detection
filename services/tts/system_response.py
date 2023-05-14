tts_templates = {
    "natural": "Hello, {name} I am happy that you are in a good mode for today",
    "fear": "Hello, {name} you look like you have fear of something I hope you become better soon",
    "happy": "Hello, {name} I am very happy that you look happy today",
    "sad": "Hello, {name} I am very sorry you look not in the mood for today",
    "surprise": "Hello, {name} you look surprised",
    "angry": "Hello, {name} there is nothing worth being angry please calm down",
    "disgust": "Hello, {name} sometimes dealing with life might make you disgusted please calm down everything will be fine"

}


class TTSRequester:
    def __init__(self):
        pass

    @staticmethod
    def get_response(feeling: str, **names) -> str:
        """Get the system response from the tts dictionary.
        Args:
            feeling: template name
            eg "static_response.goodbye_message".
            names: keys that might be existed in the response.

        Returns: system response for the specified template
        """
        feeling = tts_templates[feeling]
        return feeling.format(**names) if names else feeling


if __name__ == '__main__':
    test = TTSRequester.get_response(feeling="sad", name="Maryam Alrubaye")
    print(f"{test = }")
