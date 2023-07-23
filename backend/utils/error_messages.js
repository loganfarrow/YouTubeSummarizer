const provideEmailAndPasswordToRegister = 'Must provide email and password when registering'
const provideValidEmailToRegister = 'Must provide valid email when registering'
const provideStrongPasswordToRegister = 'Must provide strong password when registering (min 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 symbol)'
const userAlreadyExists = 'Cannot signup with email that is already associated with an account'
const userDoesNotExistForId = 'No user is associated with the provided id'
const failedToDeleteUser = 'Failed to delete user'

const userDoesNotExistForEmail = 'No user is associated with the provided email'
const incorrectPassword = 'Incorrect password'
const newPasswordRequired = "Must provide new password when updating password"
const newPasswordMustBeDifferent = "new password must be different than the current password"
const newEmailMustBeDifferent = "new email must be different than the current email"
const attemptedToDeleteUserThatDoesntExist = "Attempted to delete user that doesn't exist"

const unableToParseOptions = "Unable to parse options dictionary to json"
const ensureValidOptions = "Ensure you are passing in a valid options dictionary"

const summaryNotFound = 'Summary not found'
const searchTextIncorrectlyFormatted = 'searchText parameter is not formatted properly'
const noUserForSummary = 'User associated with summary not gound (if you believe this is an error try logging out and back in)'
const noUpdateFields = 'No fields provided to update'
const failedToParseOptions = 'Failed to parse options argument, ensure request is properly formatted'

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
    newPasswordRequired,
    newPasswordMustBeDifferent,
    newEmailMustBeDifferent,
    attemptedToDeleteUserThatDoesntExist,
    unableToParseOptions,
    ensureValidOptions,
    summaryNotFound,
    searchTextIncorrectlyFormatted,
    noUserForSummary,
    noUpdateFields,
    failedToParseOptions,
}