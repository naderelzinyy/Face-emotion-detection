import React, { useEffect, useRef, useState } from 'react';
import './face_detector.css'
import * as face_api from "face-api.js";
import {Link} from "react-router-dom";
import Button from "@mui/material/Button";
import {useSpeechSynthesis} from "react-speech-kit";

const FaceDetector = () => {
    const cameraRef = useRef();
    const canvasRef = useRef();
    const [predictedName, setPredictedName] = useState('Name');
    const [predictedEmotion, setPredictedEmotion] = useState('Emotion');
    const [sentence, setSentence] = useState();
    const {speak, voices} = useSpeechSynthesis();

    function say(text){
        console.log("sayy", text);
        speak({text: text, voice: voices[145]});
    }
    useEffect( () => {
        if (sentence){
            say(sentence);
        }
    }, [sentence])

    const postImage = async (base64Image) => {
        try {
            await fetch('http://localhost:8000/predict', {
                method: 'POST',
                body: JSON.stringify({ image: base64Image }),
            }).then((response) => {
                return response.text();
            }).then(data => {
                data = JSON.parse(data);
                setSentence(data.utterance);
                setPredictedName(data.name);
                setPredictedEmotion(data.emotion);
            })
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const HandleCapture = async () => {
        const faceInterval = setInterval(async () => {
            const detectedFace = await face_api.detectSingleFace(cameraRef.current, new face_api.TinyFaceDetectorOptions());
            console.log(detectedFace);
            if (detectedFace){
                console.log("Face detected ");
                clearInterval(faceInterval);
                let width = 600;
                let height = 600;
                let canvas = document.createElement('canvas'); // Create a new canvas element
                canvas.height = height;
                canvas.width = width;
                let ctx = canvas.getContext('2d');
                ctx.drawImage(cameraRef.current, 0, 0, canvas.width, canvas.height);

                // Convert the canvas to base64 format
                const base64Image = canvas.toDataURL(); // data URL in base64 format
                console.log(base64Image);
                await postImage(base64Image);
            }
        }, 2000);
    }
    useEffect(() => {
        startWebcam();
        const loadModels = () =>{
            Promise.all(
                [
                    face_api.nets.tinyFaceDetector.loadFromUri('/models'),
                ]
            ).then(HandleCapture)
                .catch((e)=>console.log(e))
        }
        cameraRef && loadModels();
    }, []);
    const startWebcam = () => {
        navigator.mediaDevices.getUserMedia({ video: true    })
            .then((currentStream) => {
                cameraRef.current.srcObject = currentStream;
            }).catch((err) => {
            console.error(err)
        });
    }
      return (
        <div  className="face_detector">
            <div className='webcam'>
                <video  ref={cameraRef}   autoPlay >
                </video>
            </div>
            <h1>{predictedName ? predictedName : "unknown"}</h1>
            <h1>{predictedEmotion ? predictedEmotion : "unknown"}</h1>
            <Link to="/">
                <Button variant="contained">
                    Back
                </Button>
            </Link>
            {/*<canvas ref={canvasRef}  width="940" height="650"*/}
            {/*        className='canvas' />*/}
        </div>
    );
};
export default FaceDetector;