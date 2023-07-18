const provideEmailAndPasswordToRegister = 'Must provide email and password when registering'
const provideValidEmailToRegister = 'Must provide valid email when registering'
const provideStrongPasswordToRegister = 'Must provide strong password when registering'
const userAlreadyExists = 'Cannot signup with email that is already associated with an account'

const userDoesNotExistForEmail = 'No user is associated with the provided email'
const incorrectPassword = 'Incorrect password'

// for when there is no auth header
const authorizationRequired = 'You must be logged in to access this endpoint (authorization header not found, token is needed)'
// for when there is an auth header but the token is invalid
const unauthorizedToken = 'You must be logged in to access this endpoint (token in authorization header is invalid)'

module.exports = {
    provideEmailAndPasswordToRegister,
    provideValidEmailToRegister,
    provideStrongPasswordToRegister,
    userAlreadyExists,
    userDoesNotExistForEmail,
    incorrectPassword,
    authorizationRequired,
    unauthorizedToken,
}