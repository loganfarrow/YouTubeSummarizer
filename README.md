# YoutubeSummarizer
An extension that leverages the power of OpenAI API to provide summaries for YouTube videos based on your personalized preferences. No more annoying tab opening and try to paste into ChatGPT, do it all with a simple click in the YouTubeSummarizer extension!

## Features:
- Custom Summaries: Get a summarized version of any YouTube video tailored to your preferences.
- User Preferences: Adjust summary based on tone, age and length.
- Non-Intrusive: The extension operates discreetly without altering the look and feel of web pages.
- Clean Dropdown Interface: Built with React and styled using Bulma for a sleek user experience.




# YouTubeSummarizer Backend

## Setup
Set up conda env (we need to use a little python to get youtube transcripts)

1. First install [conda](https://docs.conda.io/projects/conda/en/latest/user-guide/install/windows.html) or [miniconda](https://docs.conda.io/en/latest/miniconda.html) if you haven't already \
2. Create the conda environment: \
   `conda create --name YoutubeSummarizer`
3. Install needed packages (there's only one as of now): \
   `conda install -c conda-forge youtube-transcript-api`
4. The conda environment is now set up!
5. Now we install node.js dependencies: \
   `npm install` (make sure you're in backend directory)
6. Set up needed environment variables: \
   You will need to create a file called `.env` in the backend directory that will hold needed environment variables, the file should look like the following block of code 
    ```
    PORT=4000
    JWT_SECRET=(ask one of us to send it to you)
    ENCRYPTION_SECRET=(ask one of us to send it to you)
    MONG_URI=(this is the url used to connect to the MongoDB atlas database,
              you will need one of us to set up an account for you
              and to provide you with an access link)
    ```

## Running
1. `conda activate YoutubeSummarizer`
2. `npm start`

## Endpoint Documentation
### Endpoints Requiring Authentication
- The application uses JWT tokens to track if you are logged in or out, and can stay logged in everytime you open the browser
- All routes aside from the login and register routes require authentication


### Example Summary Endpoints
- Fetch all summaries from user
  - GET `localhost:PORT/api/summaries/fetchSummaries`
- Can find copies of all endpoints in the backend code



