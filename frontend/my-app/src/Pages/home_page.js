import React from 'react';
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';
import './home_page.css';

export default function HomePage() {
    return (
        <div className="container">
            <Link to="/add_user">
            <Button variant="contained" disableElevation>
                Add New User
            </Button>
            </Link>
            <Link to="/face_detector">
            <Button variant="contained" disableElevation>
                Recognize Me :)
            </Button>
            </Link>
        </div>
    );
}