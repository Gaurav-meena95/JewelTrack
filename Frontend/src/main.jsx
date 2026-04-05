import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './components/Context/ThemeContext.jsx'
import { BrowserRouter } from 'react-router-dom'
import axios from 'axios'

// Add a global response interceptor to seamlessly handle the new standardized backend response format
axios.interceptors.response.use(
  (response) => {
    // If the response follows the new standard format: { success, message, data }
    if (response.data && response.data.success !== undefined && response.data.data) {
      // Spread the nested 'data' fields into the main 'data' object.
      // This allows existing frontend code looking for res.data.order, res.data.user, etc., to still work!
      Object.assign(response.data, response.data.data);
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);
createRoot(document.getElementById('root')).render(
  <StrictMode>

    <BrowserRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
)
