const axios = require('axios')
const { get_auth_header } = require('./misc.js')

const BACKEND_URL_BASE = "http://localhost:4000/api/summaries"

// returns a success or error message, also returns created summary object (if successful)
export const generateSummary = async (video_url, options) => {
    const response = await axios.post(`${BACKEND_URL_BASE}/generateSummary`, {
        url: video_url,
        options: options
    }, { headers: get_auth_header(jwt) })

    return { data: response.data, status: response.status }
}

// returns success or error message
export const deleteSummary = async (summaryId, jwt) => {
    const response = await axios.delete(`${BACKEND_URL_BASE}/deleteSummary`, {
        summaryId: summaryId
    }, { headers: get_auth_header(jwt) })

    return { data: response.data, status: response.status }
}

// gets all summaries related to current user (in chronological order with option to reverse order if you do mostRecent = false)
export const fetchSummaries = async (jwt, mostRecent = true) => {
    const queryParams = {mostRecent: mostRecent} // TODO do I have to turn this into a string?

    const response = await axios.get(`${BACKEND_URL_BASE}/fetchSummaries`, {
        params: queryParams
    }, { headers: get_auth_header(jwt) })

    return { data: response.data, status: response.status }
}

// fetch specific summary using summary id
export const fetchSummary = async (summaryId, jwt) => {
    const queryParams = {summaryId: summaryId}

    const response = await axios.get(`${BACKEND_URL_BASE}/fetchSummary`, {
        params: queryParams
    }, { headers: get_auth_header(jwt) })

    return { data: response.data, status: response.status }
}

// if successful, returned data will contain a list of matching summaries that contin the search text (case-insensitive)
export const findSummary = async (searchText, jwt) => {
    const queryParams = {searchText: searchText}
    
    const response = await axios.get(`${BACKEND_URL_BASE}/findSummary`, {
        params: queryParams
    }, { headers: get_auth_header(jwt) })

    return { data: response.data, status: response.status }
}