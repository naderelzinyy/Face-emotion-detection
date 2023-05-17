import './App.css';
import HomePage from "./Pages/home_page";
import AddUser from "./Pages/add_user"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';


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
          </Routes>
        </Router>
      </ThemeProvider>

  )
}
