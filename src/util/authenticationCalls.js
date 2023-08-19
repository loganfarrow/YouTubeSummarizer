const axios = require('axios')

const BACKEND_URL_BASE = "https://localhost:4000/authentication"

// returns { email, jwt_token}
export const login = async (email, password) => {
    const response = await axios.post(`${BACKEND_URL_BASE}/login`, {
        email,
        password
    })
    return response.data
}

// returns { email, jwt_token}
export const register = async (email, password, openaikey) => {
    const response = await axios.post(`${BACKEND_URL_BASE}/register`, {
        email,
        password,
        openaikey
    })
    return response.data
}

// returns a success or error message
export const updateOpenAiKey = async (openaiKey, jwt) => {
    auth_header = {'Authorization': `${jwt}`}  // TODO do I need to add Bearer: to the front of the token?

    const repsonse = await axios.patch(`${BACKEND_URL_BASE}/updateOpenAiKey`, {
        openaiKey: openaiKey
    }, { headers: auth_header })

    return response.data
}

// returns info on the user currently logged in {email, createdAt}
export const fetchUser = async (jwt) => {
    auth_header = {'Authorization': `${jwt}`}
    const response = await axios.get(`${BACKEND_URL_BASE}/fetchUser`, { headers: auth_header })
    return response.data
}

// returns success or error messaage
export const updatePassword = async (newPassword, jwt) => {
    auth_header = {'Authorization': `${jwt}`}
    const response = await axios.patch(`${BACKEND_URL_BASE}/updatePassword`, {
        newPassword: newPassword
    }, { headers: auth_header })
    return response.data
}

// returns success or error message
export const updateEmail = async (newEmail, jwt) => {
    auth_header = {'Authorization': `${jwt}`}
    const response = await axios.patch(`${BACKEND_URL_BASE}/updateEmail`, {
        newEmail: newEmail
    }, { headers: auth_header })
    return response.data
}

// returns success or error message
export const deleteUser = async (jwt) => {
    auth_header = {'Authorization': `${jwt}`}
    const response = await axios.delete(`${BACKEND_URL_BASE}/deleteUser`, { headers: auth_header })
    return response.data
}