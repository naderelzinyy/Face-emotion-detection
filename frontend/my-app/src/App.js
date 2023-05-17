import './App.css';
import HomePage from "./Pages/home_page";
import AddUser from "./Pages/add_user"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import FaceDetector from "./Pages/face_detecter_page";


export default function MyApp() {

  const theme = createTheme({
    typography: {
      allVariants: {
        fontFamily: 'Cairo',
        fontSize: 16,
        fontWeight: "bolder"
      },
    },
  });

  return (
      <ThemeProvider theme={theme}>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/add_user" element={<AddUser />} />
            <Route path="/face_detector" element={<FaceDetector />} />
          </Routes>
        </Router>
      </ThemeProvider>

  )
}
