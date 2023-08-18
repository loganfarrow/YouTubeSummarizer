const customInstructions = `
    I am going to provide a transcript of a video that I would like you to summarize.
`

const defaultPrompt = `
    I am going to provide a transcript of a video that I would like you to summarize.
    Before you provide the summary, give a title of the summary that you provide in five or less words.
    End this title with a period, write TITLE FINISHED, then go to a new line and begin the summary.
    Do not include anything in your answer except for the title, the summary, and the item I told you to include after the title.
    Once you have given the title and summary, do not include anything else in your response other than TITLE FINISHED.
`

async function getPrompt(options, url) {
    let prompt = defaultPrompt

    // if options is just an empty map instead of an options object, return the defaut prompt
    if (options instanceof Map && options.size === 0) {
        return prompt
    }

    // get transcript
    let transcript = ''
    if (url.includes('youtube.com')) {
        transcript = await getYoutubeTranscript(url)
    } else if (url.includes('twitch.com')) {
        transcript = await getTwitchTranscript(url)
    } else {
        throw new Error('invalid video url provided - must be from youtube or twitch')
    }

    // TODO add logic here to add to the prompt based on the different values in options dict (if they exist)

    prompt = prompt + '\n here is the transcript of the video you are to summarize: \n' + transcript + '\n'

    return prompt
}

async function getYoutubeTranscript(url) {

}

async function getTwitchTranscript(url) {
    return 'TODO get twitch transcript'
}

module.exports = {
    getPrompt,
    customInstructions,
}