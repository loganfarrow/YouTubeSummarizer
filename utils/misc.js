export const get_auth_header = (jwt) => {
    return {'Authorization': `${jwt}`}
}