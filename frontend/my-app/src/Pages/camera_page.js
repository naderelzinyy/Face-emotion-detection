import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import './camera_page.css';

const TakePicture = () => {
    const [capturedImages, setCapturedImages] = useState([]);
    const [showSaveButton, setShowSaveButton] = useState(false);
    const webcamRef = useRef(null);
    const videoConstraints = {
        width: 400,
        height: 300,
        facingMode: 'user',
    };
    const navigate = useNavigate();

    useEffect(() => {
        if (capturedImages.length === 6) {
            setShowSaveButton(true);
        } else {
            setShowSaveButton(false);
        }
    }, [capturedImages]);

    const captureImage = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        setCapturedImages(prevImages => {
            const updatedImages = [...prevImages, imageSrc];
            if (updatedImages.length === 6) {
                setShowSaveButton(true);
            }
            return updatedImages;
        });
    };

    const deleteImage = (index) => {
        setCapturedImages(prevImages => prevImages.filter((_, i) => i !== index));
    };

    const saveImages = () => {
        capturedImages.forEach((image, index) => {
            const link = document.createElement('a');
            link.download = `image_${index}.jpg`;
            link.href = image;
            link.click();
        });
        navigate('/add_user');
    };

    return (
        <div className="webcam-container">
            <Webcam
                audio={false}
                screenshotFormat="image/jpeg"
                ref={webcamRef}
                videoConstraints={videoConstraints}
            />
            <Button variant="contained" onClick={captureImage} className="capture-btn" disabled={capturedImages.length === 6}>
                Capture
            </Button>
            <div className="captured-images-container">
                {capturedImages.map((image, index) => (
                    <div key={index} className="captured-image">
                        <img src={image} alt={`captured image ${index}`} />
                        <DeleteIcon onClick={() => deleteImage(index)} className="delete-btn" />
                    </div>
                ))}
            </div>
            {showSaveButton && (
                <Button
                    variant="contained"
                    onClick={saveImages}
                    disabled={capturedImages.length < 6}
                    className="save-btn"
                >
                    Save
                </Button>
            )}
        </div>
    );
};

export default TakePicture;
