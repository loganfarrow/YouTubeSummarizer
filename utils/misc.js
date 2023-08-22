export const get_auth_header = (jwt) => {
    return {'Authorization': `${jwt}`}
}

export const generic_error_handler = (e) => {
    if (e.response) {
        return { data: JSON.stringify(e.response.data), status: e.response.status }
    }
    else if (e.request) {
        console.error('No response received from request (gateway timeout)')
        return {data: e.message, status: 504}
    }
    else {
        console.error('Error occurred while setting up request')
        return { data: e.message, status: 500 }
    }
}