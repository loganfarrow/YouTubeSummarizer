const axios = require('axios')
const { get_auth_header, generic_error_handler } = require('./misc.js')

const BACKEND_URL_BASE = "http://localhost:4000/api/summaries"

// returns a success or error message, also returns created summary object (if successful)
export const generateSummary = async (video_url, options, jwt) => {
    return axios.post(`${BACKEND_URL_BASE}/generateSummary`, {
        url: video_url,
        options: options
    }, { headers: get_auth_header(jwt) })
    .then((response) => {
        return { data: response.data, status: response.status }
    })
    .catch((e) => generic_error_handler(e))
}

// returns success or error message
export const deleteSummary = async (summaryId, jwt) => {
    return axios.delete(`${BACKEND_URL_BASE}/deleteSummary`, {
        summaryId: summaryId
    }, { headers: get_auth_header(jwt) })
    .then((response) => {
        return { data: response.data, status: response.status }
    })
    .catch((e) => generic_error_handler(e))
}

// gets 7 summaries related to current user (in chronological order with option to reverse order if you do mostRecent = false)
export const fetchSummaries = async (jwt, mostRecent = true) => {
    const queryParams = {mostRecent: mostRecent} // TODO do I have to turn this into a string?

    return axios.get(`${BACKEND_URL_BASE}/fetchSummaries`, {
        params: queryParams
    }, { headers: get_auth_header(jwt) })
    .then((response) => {
        return { data: response.data, status: response.status }
    })
    .catch((e) => generic_error_handler(e))
}

// fetch specific summary using summary id
export const fetchSummary = async (summaryId, jwt) => {
    const queryParams = {summaryId: summaryId}

    return axios.get(`${BACKEND_URL_BASE}/fetchSummary`, {
        params: queryParams
    }, { headers: get_auth_header(jwt) })
    .then((response) => {
        return { data: response.data, status: response.status }
    })
    .catch((e) => generic_error_handler(e))
}

// if successful, returned data will contain a list of matching summaries that contin the search text (case-insensitive)
export const findSummary = async (searchText, jwt) => {
    const queryParams = {searchText: searchText}
    
    return axios.get(`${BACKEND_URL_BASE}/findSummary`, {
        params: queryParams
    }, { headers: get_auth_header(jwt) })
    .then((response) => {
        return { data: response.data, status: response.status }
    })
    .catch((e) => generic_error_handler(e))
}