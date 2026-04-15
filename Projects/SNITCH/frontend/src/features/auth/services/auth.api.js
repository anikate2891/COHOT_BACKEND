import axios from 'axios';

// Create an Axios instance with the base URL for the API
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Update with your backend API URL
});

// Function to register a new user
export function registerUser({email, password, contact, fullname}) {
    const response = api.post('/auth/register', {
        email,
        password,
        contact,
        fullname,
    });
    return response.data;
}