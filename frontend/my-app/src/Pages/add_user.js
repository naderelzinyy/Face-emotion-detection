import React, { useRef, useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom';
import { Container, Grid, Box, CircularProgress } from '@mui/material';
import './add_user.css';
import * as faceapi from "face-api.js";

function AddUser() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [capturedImages, setCapturedImages] = useState([]);
    const [showSaveButton, setShowSaveButton] = useState(false);
    const [isSavingImages, setIsSavingImages] = useState(false);
    const [isTrainingCompleted, setIsTrainingCompleted] = useState(false);
    const webcamRef = useRef(null);
    let updatedImages;

    const startWebcam = () => {
        navigator.mediaDevices
            .getUserMedia({ video: true })
            .then((currentStream) => {
                webcamRef.current.srcObject = currentStream;
            })
            .catch((err) => {
                console.error(err);
            });
    };

    useEffect(() => {
        startWebcam();
        if (capturedImages.length === 6) {
            setShowSaveButton(true);
        } else {
            setShowSaveButton(false);
        }
    }, [capturedImages]);

    const captureImage = () => {
        let canvas = document.createElement('canvas');
        canvas.height = 600;
        canvas.width = 600;
        let ctx = canvas.getContext('2d');
        ctx.drawImage(webcamRef.current, 0, 0, canvas.width, canvas.height);
        const imageSrc = canvas.toDataURL();

        detectFace(imageSrc)
            .then((detection) => {
                setCapturedImages((prevImages) => {
                    updatedImages = [
                        ...prevImages,
                        { src: imageSrc, detection: detection },
                    ];
                    if (updatedImages.length === 6) {
                        setShowSaveButton(true);
                    }
                    return updatedImages;
                });
            })
            .catch(() => {
                alert('No face detected');
            });
    };

    const detectFace = async (imageUrl) => {
        return new Promise((resolve, reject) => {
            let image = new Image();
            image.src = imageUrl;
            image.onload = async () => {
                try {
                    await faceapi.loadTinyFaceDetectorModel('/models');
                    await faceapi.loadFaceLandmarkModel('/models');
                    const options = new faceapi.TinyFaceDetectorOptions();
                    const detection = await faceapi
                        .detectSingleFace(image, options)
                        .withFaceLandmarks();

                    if (detection) {
                        resolve(detection);
                    } else {
                        reject(new Error('No face detected'));
                    }
                } catch (error) {
                    reject(error);
                }
            };
        });
    };

    const deleteImage = (index) => {
        setCapturedImages(prevImages => prevImages.filter((_, i) => i !== index));
    };

    const postTrainingImages = async () => {
        const userFullName = `${firstName} ${lastName}`;
        const imageUrls = capturedImages.map((image) => image.src);
        try {
            setIsSavingImages(true);
            await fetch('http://localhost:8000/saveImages', {
                method: 'POST',
                body: JSON.stringify({images: imageUrls, name:userFullName}),
            }).then((response) => {
                return response.text();
            }).then(data => {
                data = JSON.parse(data);
                setIsTrainingCompleted(true);
                console.log(data);
            })
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsSavingImages(false);
        }
    };

    return (
        <Container className="add-user-container" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Grid container spacing={2} direction="column" alignItems="center">
                <Grid item>
                    <TextField
                        label="First Name"
                        className="textfield"
                        focused
                        inputProps={{ style: { color: 'white' } }}
                        variant="outlined"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </Grid>
                <Grid item>
                    <TextField
                        label="Last Name"
                        className="textfield"
                        focused
                        inputProps={{ style: { color: 'white' } }}
                        variant="outlined"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </Grid>
                <Grid item>
                    <div className="webcam-container">
                        <div className='webcam'>
                            <video ref={webcamRef} autoPlay />
                        </div>
                        <Button variant="contained" onClick={captureImage} className="capture-btn" disabled={capturedImages.length === 6}>
                            <CameraAltIcon />
                        </Button>
                        <div className="captured-images-container">
                            {capturedImages.map((image, index) => (
                                <div key={index} className="captured-image">
                                    <img src={image.src} alt={`captured image ${index}`} />
                                    <DeleteIcon
                                        onClick={() => deleteImage(index)}
                                        className="delete-btn"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </Grid>
                <Grid item sx={{ '& > *': { m: 2 } }}>
                    {isSavingImages ? (
                        <Box display="flex" alignItems="center" flexDirection="column">
                            <CircularProgress color="primary" />
                            <p>Saving images...</p>
                        </Box>
                    ) : (
                        isTrainingCompleted ? (
                            <Link to="/face_detector">
                                <Button variant="contained" disableElevation>
                                    Recognize Me :)
                                </Button>
                            </Link>
                        ) : (
                            showSaveButton && (
                                <Button variant="contained" onClick={postTrainingImages} disabled={capturedImages.length < 6 || !firstName || !lastName}>
                                    Save
                                </Button>
                            )
                        )
                    )}
                    <Link to="/">
                        <Button variant="contained">
                            Back
                        </Button>
                    </Link>
                </Grid>
            </Grid>
        </Container>
    );
}

export default AddUser;
