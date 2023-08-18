Set up conda env (we need to use a little python to get youtube transcripts)


- first install conda or miniconda
- conda create --name YoutubeSummarizer
- conda install -c conda-forge youtube-transcript-api

before starting the backend, make sure to do conda activate YoutubeSummarizer or else python part won't work

start backend with: nopm start
