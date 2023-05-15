import { useEffect, useRef } from 'react';
import './face_detector.css'
import * as face_api from "face-api.js";


const FaceDetector = () => {
    const cameraRef = useRef();
    const canvasRef = useRef();

    const handleCapture = async () => {
        const detectedFace = await face_api.detectSingleFace(cameraRef.current,new face_api.TinyFaceDetectorOptions()) .withFaceLandmarks()
            .withFaceExpressions();
        console.log(detectedFace);
    }
    useEffect(() => {
        startWebcam();
        const loadModels = () =>{
            Promise.all(
                [
                    face_api.nets.tinyFaceDetector.loadFromUri('/models'),
                    face_api.nets.faceLandmark68Net.loadFromUri('/models'),
                    face_api.nets.faceRecognitionNet.loadFromUri('/models'),
                    face_api.nets.faceExpressionNet.loadFromUri('/models'),
                ]
            ).then(handleCapture)
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
            <canvas ref={canvasRef}  width="940" height="650"
                    className='canvas' />
        </div>
    );
};
export default FaceDetector;