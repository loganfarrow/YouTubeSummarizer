const customInstructions = `
    TODO these will be the custom instructions that are universal to all prompts
`

const defaultPrompt = `
    TODO this will be the part of the prompt that is the same no matter what is in options dictionary
`

function getPrompt(options) {
    let prompt = defaultPrompt

    // if options is just an empty map instead of an options object, return the defaut prompt
    if (options instanceof Map && options.size === 0) {
        return prompt
    }

    // TODO add logic here to add to the prompt based on the different values in options dict (if they exist)

    return prompt
}

module.exports = {
    getPrompt,
    customInstructions,
}