export const get_auth_header = (jwt) => {
    return {'Authorization': `${jwt}`}
}

export const generic_error_handler = (e) => {
    if (e.response) {
        return { data: e.response.data, status: e.response.status }
    }
    else if (e.request) {
        console.error('No response received from request (gateway timeout)')
        return {e: e.message, status: 504}
    }
    else {
        console.error('Error occurred while setting up request')
        return { e: e.message, status: 500 }
    }
}