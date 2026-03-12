// Api layer of 4 layer architecture

import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true,
})

export function register({email,password,username}) {
    const res = api.post('api/auth/register', {email,password,username})
    return res.data;
}

export function login({email,password}) {
    const res = api.post('api/auth/login', {email,password})
    return res.data;
}

export function getMe() {
    const res = api.get('api/auth/getme')
    return res.data;
}

export function logout() {
    const res = api.post('api/auth/logout')
    return res.data;
}

export default api