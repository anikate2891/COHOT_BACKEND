import axios from 'axios';

// Create an Axios instance with the base URL for the API
const api = axios.create({
  baseURL: '/api/auth', // Update with your backend API URL
});

// Function to register a new user
export async function registerUser({email, password, contact, fullname, isseller}) {
    const response = await api.post('/register', {
        email,
        password,
        contact,
        fullname,
        isseller,
    });
    // console.log({ email, password, contact, fullname });
    return response.data;
}

export async function loginUser({ email, password }) {
    const response = await api.post('/login', {
        email,
        password,
    });
    return response.data;
}   