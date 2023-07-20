const provideEmailAndPasswordToRegister = 'Must provide email and password when registering'
const provideValidEmailToRegister = 'Must provide valid email when registering'
const provideStrongPasswordToRegister = 'Must provide strong password when registering (min 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 symbol)'
const userAlreadyExists = 'Cannot signup with email that is already associated with an account'
const userDoesNotExistForId = 'No user is associated with the provided id'
const failedToDeleteUser = 'Failed to delete user'

const userDoesNotExistForEmail = 'No user is associated with the provided email'
const incorrectPassword = 'Incorrect password'

// for when there is no auth header
const authorizationRequired = 'You must be logged in to access this endpoint (authorization header not found, token is needed)'
// for when there is an auth header but the token is invalid
const unauthorizedToken = 'You must be logged in to access this endpoint (token in authorization header is invalid). If you believe token is valid, it is possible the associated user was deleted.'

// for when no openai key is provided when needed
const noOpenaiKeyProvided = 'No openai key provided for endpoint that requires a valid openai key'
// for when openai key is provided, but it is invalid
const invalidOpenaiKeyProvided = 'Invalid openai key provided for endpoint that requires a valid openai key'

module.exports = {
    provideEmailAndPasswordToRegister,
    provideValidEmailToRegister,
    provideStrongPasswordToRegister,
    userAlreadyExists,
    userDoesNotExistForEmail,
    incorrectPassword,
    authorizationRequired,
    unauthorizedToken,
    noOpenaiKeyProvided,
    invalidOpenaiKeyProvided,
    userDoesNotExistForId,
    failedToDeleteUser,
}