import './App.css';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from './styles/theme';
import HomePage from './pages/home';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HomePage />
    </ThemeProvider>
  );
}

export default App;
