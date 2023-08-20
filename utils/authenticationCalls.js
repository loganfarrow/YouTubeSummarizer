const axios = require('axios')
const { get_auth_header, generic_error_handler } = require('./misc.js')

const BACKEND_URL_BASE = "http://localhost:4000/api/authentication"

// returns { email, jwt_token}
export const login = async (email, password) => {
    return axios.post(`${BACKEND_URL_BASE}/login`, {
        email,
        password
    })
    .then((response) => {
        return { data: response.data, status: response.status }
    })
    .catch((e) => generic_error_handler(e))
}

// returns { email, jwt_token}
export const register = async (email, password, openaikey) => {
    return axios.post(`${BACKEND_URL_BASE}/register`, {
        email,
        password,
        openaikey
    })
    .then((response) => {
        return { data: response.data, status: response.status }
    })
    .catch((e) => generic_error_handler(e))
}

// returns a success or error message
export const updateOpenAiKey = async (openaiKey, jwt) => {
    return axios.patch(`${BACKEND_URL_BASE}/updateOpenAiKey`, {
        openaiKey: openaiKey
    }, { headers: get_auth_header(jwt) })
    .then((response) => {
        return { data: response.data, status: response.status }
    })
    .catch((e) => generic_error_handler(e))
}

// returns info on the user currently logged in {email, createdAt}
export const fetchUser = async (jwt) => {    
    return axios.get(`${BACKEND_URL_BASE}/fetchUser`, { headers: get_auth_header(jwt) })
    .then((response) => {
        return { data: response.data, status: response.status }
    })
    .catch((e) => generic_error_handler(e))
}

// returns success or error messaage
export const updatePassword = async (newPassword, jwt) => {
    return axios.patch(`${BACKEND_URL_BASE}/updatePassword`, {
        newPassword: newPassword
    }, { headers: get_auth_header(jwt) })
    .then((response) => {
        return { data: response.data, status: response.status }
    })
    .catch((e) => generic_error_handler(e))
}

// returns success or error message
export const updateEmail = async (newEmail, jwt) => {
    return axios.patch(`${BACKEND_URL_BASE}/updateEmail`, {
        newEmail: newEmail
    }, { headers: get_auth_header(jwt) })
    .then((response) => {
        return { data: response.data, status: response.status }
    })
    .catch((e) => generic_error_handler(e))
}

// returns success or error message
export const deleteUser = async (jwt) => {
    return axios.delete(`${BACKEND_URL_BASE}/deleteUser`, { headers: get_auth_header(jwt) })
    .then((response) => {
        return { data: response.data, status: response.status }
    })
    .catch((e) => generic_error_handler(e))
}

