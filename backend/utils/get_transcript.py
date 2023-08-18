# for some reason this is installed for python 3.9 and not a newer version
# so switch vscode to use that version of python before running this file
from youtube_transcript_api import YouTubeTranscriptApi

from urllib.parse import urlparse, parse_qs
import sys

def getIdFromUrl(url):
    url_data = urlparse(url)
    queries = parse_qs(url_data.query)
    video_id = queries["v"][0]
    return video_id

def parse_transcript(raw_transcript):
    transcript = ""
    COMMA_WAIT_TIME = 1.5
    PERIOD_WAIT_TIME = 3.5

    # TODO I had the idea to add punctuation to the transcript
    # TODO but it's difficult since the start time of each line is actually BEFORE the end time of the previous phrase
    # TODO maybe we can find a constant where if the start time is close enough to the previous end a comma or period is needed?
    # TODO but do this later since its nonessential to getting it working

    # this will be set to start_time + duration of the previous line
    # if there is a pause between phrases we will add a comma
    # if there is a longer pause we will add a period
    # prev_phrase_end_time = 0 

    for line in raw_transcript:
        # print(prev_phrase_end_time, line["start"], line["start"] - prev_phrase_end_time)

        # if line["start"] > prev_phrase_end_time + COMMA_WAIT_TIME:
        #     # cut the last space and replace it with a comma, then a space
        #     transcript = transcript[:-1] + ", "
        # elif line["start"] > prev_phrase_end_time + PERIOD_WAIT_TIME:
        #     # cut the last space and replace it with a period, then a space
        #     transcript = transcript[:-1] + ". "

        transcript += line["text"] + " "
        # prev_phrase_end_time = line["start"] + line["duration"]
    return transcript

# if the transcript is over 3500 tokens, cut it down (gpt-3.5 can only handle 4096 tokens)
# one token is roughly 4 characters, so we limit to 14000 chars
def truncate_if_needed(text):
    MAX_TOKENS = 3500

    if len(text) <= MAX_TOKENS*4:
        return text
    else:
        text = text[:MAX_TOKENS*4 - 40]
        text += "...  (NOTE: this transcript was truncated because it was too long, do your best with what you have so far)"
        return text

def getTranscript(url):
    video_id = getIdFromUrl(url)

    # if subtitles are disabled, this will throw an error
    # javascript that calls this needs to have try-catch that handles this
    raw_transcript = YouTubeTranscriptApi.get_transcript(video_id)
    transcript = parse_transcript(raw_transcript)

    # if the transcript is over ~3500 tokens, cut it down
    transcript = truncate_if_needed(transcript)
    
    return transcript


# when called from out express backend, we print the transcript to standard output (and express reads it)
if __name__ == "__main__":
    url = sys.argv[1]
    print(getTranscript(url))


# print(getTranscript("https://www.youtube.com/watch?v=kDpAmsvRjcc"))
# Stuff for Testing---------------------------------------------

# print(getIdFromUrl("http://www.youtube.com/watch?v=z_AbfPXTKms&NR=1"))
# print(YouTubeTranscriptApi.get_transcript("_gQITRGs4y0"))

# video with captions disabled: "https://www.youtube.com/watch?v=mwm8H8ALQsM"
# LONG video with capions: "https://www.youtube.com/watch?v=4iluOmq1DYY"
# shorter video with captions: "https://www.youtube.com/watch?v=kDpAmsvRjcc"

# getTranscript("https://www.youtube.com/watch?v=kDpAmsvRjcc")