import React, { useRef, useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import {Link} from 'react-router-dom';
import { Container, Grid } from '@mui/material';
import './add_user.css';
import Webcam from "react-webcam";

function AddUser() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [capturedImages, setCapturedImages] = useState([]);
    const [showSaveButton, setShowSaveButton] = useState(false);
    const webcamRef = useRef(null);
    let updatedImages;

    const startWebcam = () => {
        navigator.mediaDevices.getUserMedia({ video: true    })
            .then((currentStream) => {
                webcamRef.current.srcObject = currentStream;
            }).catch((err) => {
            console.error(err)
        });
    }

    useEffect(() => {
        startWebcam();
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


    const handleSave  = async () => {
          const userFullName = `${firstName}_${lastName}`;

          const imagesList = capturedImages.map((image, index) => {
            const fileName = `${userFullName}image_${index}.jpg`;
            return {
              fileName,
              image,
            };
          });

          const dataToServer = {
            name: userFullName,
            listOfPictures: imagesList,
          };
          console.log(dataToServer)

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
                        <Webcam
                            audio={false}
                            screenshotFormat="image/jpeg"
                            ref={webcamRef}
                            videoConstraints={videoConstraints}
                        />
                        <Button variant="contained" onClick={captureImage} className="capture-btn" disabled={capturedImages.length === 6}>
                            <CameraAltIcon/>
                        </Button>
                        <div className="captured-images-container">
                            {capturedImages.map((image, index) => (
                                <div key={index} className="captured-image">
                                    <img src={image} alt={`captured image ${index}`} />
                                    <DeleteIcon onClick={() => deleteImage(index)} className="delete-btn" />
                                </div>
                            ))}
                        </div>
                    </div>
                </Grid>
                <Grid item sx={{ '& > *': { m: 2 } }}>
                    {showSaveButton && (
                    <Button variant="contained" onClick={handleSave} disabled={capturedImages.length < 6 || !firstName || !lastName}>
                        Save
                    </Button> )}
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
