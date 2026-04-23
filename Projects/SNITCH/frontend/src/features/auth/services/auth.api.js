import axios from 'axios';

// Create an Axios instance with the base URL for the API
const api = axios.create({
  baseURL: '/api/auth',
  withCredentials: true // Update with your backend API URL
});

// Function to register a new user
export async function registerUser(data) {
  const { email, password, contact, fullname, isseller } = data;

  // 🔴 validation
  if (!email || !password || !contact || !fullname) {
    throw new Error("All required fields must be filled");
  }

  // optional: default value set
  const payload = {
    email,
    password,
    contact,
    fullname,
    isseller: isseller ?? false,
  };

  console.log("Sending:", payload); // debug

  const response = await api.post('/register', payload);
  return response.data;
}

export async function loginUser({ email, password }) {
    const response = await api.post('/login', {
        email,
        password,
    });
    return response.data;
}   

export async function getMe() {
    const response = await api.get('/me');
    return response.data;
}