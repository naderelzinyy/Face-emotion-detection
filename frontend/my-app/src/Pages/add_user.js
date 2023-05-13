import React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import './add_user.css';
import { Link } from "react-router-dom";
import { Container, Grid } from '@mui/material';


function AddUser() {
    const handleSave = () => {
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
                    />
                </Grid>
                <Grid item>
                    <TextField
                        label="Last Name"
                        className="textfield"
                        focused
                        inputProps={{ style: { color: 'white' } }}
                        variant="outlined"
                    />
                </Grid>
                <Grid item>
                    <Link to="/camera">
                    <Button variant="contained">
                        <CameraAltIcon />
                    </Button>
                    </Link>
                </Grid>
                <Grid item sx={{ '& > *': { m: 2 } }}>
                    <Button variant="contained" onClick={handleSave}>
                        Save
                    </Button>
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
