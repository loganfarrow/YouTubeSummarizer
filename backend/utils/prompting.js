const axios = require('axios')
const { spawn } = require('child_process') // this is the module that allows us to call python code

const customInstructions = `
    I am going to provide a transcript of a video that I would like you to summarize.
    Before you provide the summary, give a title of the summary that you provide in five or less words.
    It is very important that the title is five or less words.
    Make sure the title is five or less words.
    End this title with a period, then go to a new line and begin the summary.
    It is very important that you go to a new line before beginning the summary.
    Do not include anything in your answer except for the title and the summary
    Once you have given the title and summary, do not include anything else in your response.
    Make sure the title if five or less words.
`

const defaultPrompt = `
    I am going to provide a transcript of a video that I would like you to summarize.
    Before you provide the summary, give a title of the summary that you provide in five or less words.
    It is very important that the title is five or less words.
    Make sure the title is five or less words.
    End this title with a period, then go to a new line and begin the summary.
    It is very important that you go to a new line before beginning the summary.
    Do not include anything in your answer except for the title and the summary
    Once you have given the title and summary, do not include anything else in your response.
    Make sure the title is five or less words.
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
        try {
            transcript = await getYoutubeTranscript(url)
        } catch (e) {
            throw new Error('the following error occurred while getting youtube video transcript: ' + e.message)
        }
    } else {
        throw new Error('invalid video url provided - must be from youtube')
    }

    // TODO add logic here to add to the prompt based on the different values in options dict (if they exist)

    prompt = prompt + '\n here is the transcript of the video you are to summarize: \n' + transcript + '\n'

    // console.log('TRANSCRIPT returned from python')
    // console.log(transcript)
    // console.log('PROMPT')
    // console.log(prompt)

    return prompt
}

function getYoutubeTranscript(url) {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', ['utils/get_transcript.py', url]);
        transcript = ''
        // if (non-error) output is printed to the console, that means the transcript has been printed
        pythonProcess.stdout.on('data', (data) => {
            // console.log('data returned from python script: ' + data)
            transcript += data.toString()
        });
    
        // this handles if any exception is thrown from the python code
        pythonProcess.stderr.on('data', (data) => {
            // console.log('error returned from python script: ' + data)
            reject(new Error(`${data.toString()}`))
        });
    
        // if the output stream closes, we're done generating the transcript and can return
        pythonProcess.stdout.on('end', () => {
            resolve(transcript);
        });

        // if it takes longer than 25 seconds we just timeout and use what we have so far
        setTimeout(() => {
            console.warn('generating youtube transcript took more than 25 seconds - we timed out and will use what we have so far')
            resolve(transcript);
        }, 25000); // 25 seconds
    })
    
}

module.exports = {
    getPrompt,
    customInstructions,
}