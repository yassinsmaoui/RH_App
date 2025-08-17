import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline, Box, Typography } from '@mui/material'
import { store } from './store'
import theme from './theme'

console.log('Starting React + Material-UI + Router + Redux test...');

function HomePage() {
    console.log('HomePage component rendering...');
    return (
        <Box 
            sx={{
                backgroundColor: 'warning.main',
                color: 'white',
                padding: 3,
                textAlign: 'center',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <Typography variant="h4">
                React + Material-UI + Router + Redux fonctionne!
            </Typography>
        </Box>
    );
}

function App() {
    console.log('App component rendering...');
    return (
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                    </Routes>
                </BrowserRouter>
            </ThemeProvider>
        </Provider>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root')!);
console.log('Root created, rendering App...');
root.render(<App />);
console.log('React render called');
