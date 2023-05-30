tts_templates = {
    "neutral": "Hello {name}. I am happy to see you",
    "fear": "Hello {name}. u look frightened",
    "happy": "Hello {name}. you look happy",
    "sad": "Hello {name}. you don't look in the mood. I am sorry for you ",
    "surprise": "Hello {name}. you look surprised",
    "angry": "Hello {name}. you look angry",
    "disgust": "Hello {name}. sometimes dealing with life might make you disgusted please calm down everything will be fine"

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
