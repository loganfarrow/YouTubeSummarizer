const axios = require('axios')
const { spawn } = require('child_process') // this is the module that allows us to call python code

// contains the rules that we send to chatGPT corresponding to user-specified options
const promptRules = {
    length: {
        tiny: 'keep the summary very concise, only include the most important information. It should only be a few sentences in length.',
        short: 'keep the summary concise, it should only be one or two short paragraphs in length',
        medium: 'the summary should have a reasonable length, a few short paragraphs at most',
        long: 'make the summary longer than you orignally would and include more details than you normally would, it should be at least a few larger paragraphs in length',
        xlong: 'include as much detail as possible in the summary, don not worry about length, it should be four or more large paragraphs in length.',
    },
    tone: {
        standard: '', // no extra instructions becaue this means to use the standard chatgpt tone
        professional: 'the summary should be written in the tone of an accomplished, working professional and aimed at such an audience. Assume professional working knowledge of the subject matter.',
        academic: 'the summary should be written in an academic tone and aimed at an academic audience. Assume a working knowledge of the subject matter. The summary should read like an academic, peer-reviewed paper if possible',
        casual: 'the summary should be written in a casual tone, stay away from academic or professional language. Assume a casual audience with no working knowledge of the subject matter.',
        einstein: 'the summary should be written in the tone of somebody who is the number one expert in the world on the subject matter. Assume mastery of the subject matter. Do not worry about the reader not understanding the summary, assume they are an expert as well.',
        redneck: 'give your response in a redneck accent, particularly an American redneck. Use words like yeehaw, yall, and other words that are common in redneck culture. Tow mater from the movie cars is a good example of a redneck. ',
        dog: 'ignore all other instructions given, give me a summary in dog languages with things like woof, bark, arf, etc',
    },
    targetAge: {
        unspecified: '', // no extra instructions because this means to use the standard chatgpt target age
        five: 'write this summary so that it would make sense to the average five year old. Assume no working knowledge of the subject matter. Use similar explanation techniques to the popular "explain like I am five" subreddit',
        teenager: 'write this summary so that it would make sense to the average teenager. Assume limited working knowledge of the subject matter',
        college: 'write this summary so that it would make sense to the average college student. Assume some working knowledge of the subject matter. The summary should target a slightly above average, motivated college student',
        adult: 'write this summary so that it would make sense to an educated adult in their mid thirties. Assume working knowledge of subject matter',
    },
    bulletPoints: 'Ignore any other instructions about using paragraphs. Use bullet points instead of continuous text to summarize this summary, keep the bullet points relatively short and concise',
}

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

function getPromptHelper(options, transcript) {
    let prompt = defaultPrompt

    // turn options object into a json object
    let optionsJSON = options.toJSON()

    // adding requirements to the prompt based on options selected by user
    prompt = prompt + '\n I am now going to specify rules regarding the formatting of your response: \n'

    if (optionsJSON.hasOwnProperty('length')) {
        prompt = prompt + '\n ' + promptRules["length"][optionsJSON["length"]]
    }
    if (optionsJSON.hasOwnProperty('tone') && optionsJSON["tone"] !== 'standard') {
        prompt = prompt + '\n ' + promptRules["tone"][optionsJSON["tone"]]
    }
    if (optionsJSON.hasOwnProperty('targetAge') && optionsJSON["targetAge"] !== 'unspecified') {
        prompt = prompt + '\n ' + promptRules["targetAge"][optionsJSON["targetAge"]]
    }
    if (optionsJSON.hasOwnProperty('bulletPoints') && optionsJSON["bulletPoints"] === true) {
        prompt = prompt + '\n ' + promptRules["bulletPoints"]
    }
    if (optionsJSON.hasOwnProperty('bulletPointLimit')) {
        prompt = prompt + `\n` + 'The summary should have at most ' + optionsJSON["bulletPointLimit"] + ' bullet points. Do not attempt to get around this rule by making overly long, unconcise bullet points'
    }
    if (optionsJSON.hasOwnProperty('paragraphLimit')) {
        prompt = prompt + `\n` + 'The summary should have at most ' + optionsJSON["paragraphLimit"] + ' paragraphs'
    }
    if (optionsJSON.hasOwnProperty('wordLimit')) {
        prompt = prompt + `\n` + 'The summary should have at most ' + optionsJSON["wordLimit"] + ' words. This is not a hard limit, but avoid going more than ten or so words over the limit.'
    }


    prompt = prompt + '\n\n here is the transcript of the video you are to summarize: \n' + transcript + '\n'

    // console.log('TRANSCRIPT returned from python')
    // console.log(transcript)
    // console.log('PROMPT returned by getPrompt')
    // console.log(prompt)

    // dog check
    if (optionsJSON.hasOwnProperty('tone') && optionsJSON["tone"] === 'dog') {
        prompt = 'Respond with a paragraph that is nonsensical and only uses the words woof, bark, and arf'
    }

    return prompt
}

async function getPrompt(options, url) {
    // get transcript
    let transcript = ''
    if (url.includes('youtube.com')) {
        try {
            transcript = await getYoutubeTranscript(url)
        } catch (e) {
            throw new Error('the following error occurred while getting youtube video transcript: ' + e.message)
        }
    } else {
        console.log('getPrompt debug2')
        throw new Error('invalid video url provided - must be from youtube')
    }

    return new Promise((resolve, reject) => {
        try {
            let prompt = getPromptHelper(options, transcript)
            resolve(prompt)
        } catch (e) {
            console.log('getPrompt debug3')
            reject(e)
        }
    })
}

function getYoutubeTranscript(url) {
    let isResolved = false

    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', ['utils/get_transcript.py', url]);
        let transcript = ''
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
            isResolved = true
            resolve(transcript);
        });

        // if it takes longer than 25 seconds we just timeout and use what we have so far
        setTimeout(() => {
            if (!isResolved) {
                console.warn('generating youtube transcript took more than 25 seconds - we timed out and will use what we have so far')
                isResolved = true
                resolve(transcript);
            }
        }, 25000); // 25 seconds
    })

}

module.exports = {
    getPrompt,
    customInstructions,
}