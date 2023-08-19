const axios = require('axios')

const BACKEND_URL_BASE = "https://localhost:4000/authentication"

// returns { email, jwt_token}
export const login = async (email, password) => {
    const response = await axios.post(`${BACKEND_URL_BASE}/login`, {
        email,
        password
    })
    return { data: response.data, status: response.status }
}

// returns { email, jwt_token}
export const register = async (email, password, openaikey) => {
    const response = await axios.post(`${BACKEND_URL_BASE}/register`, {
        email,
        password,
        openaikey
    })
    return { data: response.data, status: response.status }
}

// returns a success or error message
export const updateOpenAiKey = async (openaiKey, jwt) => {
    const response = await axios.patch(`${BACKEND_URL_BASE}/updateOpenAiKey`, {
        openaiKey: openaiKey
    }, { headers: get_auth_header(jwt) })

    return { data: response.data, status: response.status }
}

// returns info on the user currently logged in {email, createdAt}
export const fetchUser = async (jwt) => {
    auth_header = {'Authorization': `${jwt}`}
    const response = await axios.get(`${BACKEND_URL_BASE}/fetchUser`, { headers: get_auth_header(jwt) })
    return { data: response.data, status: response.status }
}

// returns success or error messaage
export const updatePassword = async (newPassword, jwt) => {
    auth_header = {'Authorization': `${jwt}`}
    const response = await axios.patch(`${BACKEND_URL_BASE}/updatePassword`, {
        newPassword: newPassword
    }, { headers: get_auth_header(jwt) })
    return { data: response.data, status: response.status }
}

// returns success or error message
export const updateEmail = async (newEmail, jwt) => {
    auth_header = {'Authorization': `${jwt}`}
    const response = await axios.patch(`${BACKEND_URL_BASE}/updateEmail`, {
        newEmail: newEmail
    }, { headers: get_auth_header(jwt) })
    return { data: response.data, status: response.status }
}

// returns success or error message
export const deleteUser = async (jwt) => {
    auth_header = {'Authorization': `${jwt}`}
    const response = await axios.delete(`${BACKEND_URL_BASE}/deleteUser`, { headers: get_auth_header(jwt) })
    return { data: response.data, status: response.status }
}

function get_auth_header(jwt) {
    return {'Authorization': `${jwt}`}
}