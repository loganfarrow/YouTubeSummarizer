import React, { useState } from 'react';
import './Popup.css';
import { login, register, updateOpenAiKey, fetchUser, updatePassword, updateEmail, deleteUser } from '../../../utils/authenticationCalls'
import { generateSummary, deleteSummary, fetchSummaries, fetchSummary, findSummary } from '../../../utils/summaryCalls'
import SummarySelector from './SummarySelector';

const Popup = () => {
  const [activeView, setActiveView] = useState('summary'); // Current active view (summary, settings, or past-summaries)

  // handles the visibility of the login and register form popups
  const [isLoginFormVisible, setIsLoginFormVisible] = useState(false);
  const [isRegisterFormVisible, setIsRegisterFormVisible] = useState(false);

  // if this is empty, we are not logged in
  const [jwtToken, setJwtToken] = useState('');
  console.log('jwtToken: ', jwtToken)
  // state for the inputs in login / register forms
  const [emailInput, setEmail] = useState('');
  const [passwordInput, setPassword] = useState('');
  const [openAIKeyInput, setOpenAIKey] = useState('');

  const [summaryLength, setSummaryLength] = useState('medium');
  const [summaryTone, setSummaryTone] = useState('standard');
  const [summaryToneAge, setSummaryToneAge] = useState('unspecified');
  const [bulletPoints, setBulletPoints] = useState('false');
  const [bulletPointLimit, setBulletPointLimit] = useState(10);

  // holds representation of the current summary (in JSON format)
  const [currentSummary, setSummary] = useState({});

  // show error messages if login or register failed
  const [showLoginError, setShowLoginError] = useState(false);
  const [showRegisterError, setShowRegisterError] = useState(false);
  const [showGenerateSummaryError, setShowGenerateSummaryError] = useState(false);

  // check if generating summary is in progress
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  // on the first load, we want to check if there is a jwtToken in local storage and set it if so
  React.useEffect(() => {
    let jwt_token = localStorage.getItem('jwtToken')
    if (jwt_token !== null) {
      setJwtToken(jwt_token);
    }

    console.log(localStorage)
  }, []);

  console.log('showGenerateSummaryError: ', showGenerateSummaryError)

  // if we change the view, delete any error messages that were showing
  React.useEffect(() => {
    setShowLoginError(false);
    setShowRegisterError(false);
    setShowGenerateSummaryError(false);
  }, [activeView]);

  const handleBackClick = (e) => {
    e.preventDefault();
    setIsLoginFormVisible(false);
    setIsRegisterFormVisible(false);
  };

  const handleGoToRegisterFormClick = (e) => {
    e.preventDefault();
    setIsLoginFormVisible(false);
    setIsRegisterFormVisible(true);
  };

  const handleGoToLoginFormClick = (e) => {
    e.preventDefault();
    setIsRegisterFormVisible(false);
    setIsLoginFormVisible(true);
  }

  const handleSignIn = async (e) => {
    e.preventDefault();

    console.log('Email:', emailInput);
    console.log('Password:', passwordInput);

    let email = emailInput;
    let password = passwordInput;

    let response = await login(email, password);
    let responseData = response.data;
    let responseStatus = response.status;

    if (responseStatus !== 200) {
      // TODO this should show up in the UI as some sort of error
      // TODO reconfigure backend to return diff status codes for diff errors (e.g. 401 for bad password, 404 for no user, etc.)
      console.error('Error logging in: ' + responseData.e);
      setShowLoginError(true);
      return;
    }

    // if we've successfully logged in we definitely don't want to show the login error anymore
    setShowLoginError(false);

    setJwtToken(responseData.token);

    // save the token to the local storage
    localStorage.setItem('jwtToken', responseData.token);

    setIsLoginFormVisible(false);
  };

  const handleRegisterAccount = async (e) => {
    e.preventDefault();

    let email = emailInput;
    let password = passwordInput;
    let openAIKey = openAIKeyInput;

    let response = await register(email, password, openAIKey);
    let responseData = response.data;
    let responseStatus = response.status;

    if (responseStatus !== 200) {
      // TODO this should show up in the UI as some sort of error 
      // TODO reconfigure backend to return diff status codes for diff errors (e.g. 401 for bad password, 404 for no user, etc.)
      console.error('Error registering account: ' + responseData);
      setShowRegisterError(true);
      return;
    }

    setShowRegisterError(false);
    setJwtToken(responseData.token);

    // save the token to the local storage
    localStorage.setItem('jwtToken', responseData.token);

    setIsLoginFormVisible(false);
    setIsRegisterFormVisible(false);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    // remove the token from local storage (if it exists)
    let jwt_token = localStorage.getItem('jwtToken')
    if (jwt_token !== null) {
      localStorage.removeItem('jwtToken');
    }

    setJwtToken('');
  }

  const parseOptions = () => {
    let bulletPts = bulletPoints === 'true' ? true : false;

    return {
      length: summaryLength,
      tone: summaryTone,
      targetAge: summaryToneAge,
      bulletPoints: bulletPts,
      bulletPointLimit: parseInt(bulletPointLimit)
    }
  }

  const handleGenerateSummary = async (e) => {
    e.preventDefault();
    setIsGeneratingSummary(true);
    setSummary('');  // clear the current summary

    let url = ''
    try {
      url = await getCurrentUrl();
    } catch (err) {
      console.error('Error getting current url: ' + err);
      setShowGenerateSummaryError(true);
      return;
    }

    // check that the url is a youtube url (TODO is there a better / more comprehensive way to check this?)
    if (!url.includes('youtube.com')) {
      console.error('Error generating summary: not a youtube url');
      setIsGeneratingSummary(false);
      setShowGenerateSummaryError(true);
      return;
    }

    // TODO get the options from the settings page
    const options = parseOptions();  // note make sure options is passed in as a JSON object

    let response = await generateSummary(url, options, jwtToken);
    let responseData = response.data;
    let responseStatus = response.status;

    if (responseStatus !== 200) {
      // TODO this should show up in the UI as some sort of error 
      // TODO reconfigure backend to return diff status codes for diff errors (e.g. 401 for bad password, 404 for no user, etc.)
      console.error('Error generating summary: ' + responseData);
      setIsGeneratingSummary(false);
      setShowGenerateSummaryError(true);
      return;
    }

    setIsGeneratingSummary(false);
    setSummary(responseData.summary);
    setShowGenerateSummaryError(false);
    console.log('generated Summary successfully')
  };

  // TODO add a check that this is a Youtube video url
  const getCurrentUrl = async () => {
    return new Promise((resolve, reject) => {
      if (chrome && chrome.tabs) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const url = tabs[0].url;
          console.log('tabs: ', tabs)
          console.log('url: ', url)
          resolve(url);
        });
      } else {
        reject(new Error('getCurrentUrl function called outside of Chrome extension context'));
      }
    })
  };

  return (
    <div className="App">
      <div className="relative-container">
        <header className="App-header">
          <p className="title">YouTube Summarizer</p>
          <div className="buttons">
            {jwtToken === '' ? (
              <>
              </>
            ) : (
              <>
                <button className="button is-primary" onClick={() => setActiveView('summary')}>Summary</button>
                <button className="button is-primary" onClick={() => setActiveView('settings')}>Settings</button>
                <button className="button is-primary" onClick={handleLogout}>Logout</button>
              </>
            )}
          </div>
          {activeView === 'summary' && (
            <>
              <div className="textarea-container">
                {!isGeneratingSummary ? (
                  <>
                    <div className="control">
                      <textarea className="textarea custom-textarea"
                        placeholder={jwtToken === '' ? "Log in or Create Account to make Summaries" : "Naviagate to a YouTube video and click 'Generate Summary'"}
                        readOnly
                        value={isEmpty(currentSummary) ? '' : currentSummary.summary}>
                      </textarea>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="control is-loading">
                      <textarea className="textarea custom-textarea"
                        placeholder="Generating..."
                        readOnly
                        value={isEmpty(currentSummary) ? '' : currentSummary.summary}>
                      </textarea>
                    </div>
                  </>

                )}
              </div>
              {showGenerateSummaryError && (
                <>
                  <div className='generateSummaryError'>
                    <p className="generate-summary-error-message">Error generating summary. Please try again.</p>
                  </div>
                </>
              )}
              <div className="bottom-button-container">
                {jwtToken === '' ? (
                  <>
                    <button className="button is-primary" onClick={handleGoToLoginFormClick}>Log In</button>
                    <button className="button is-primary" onClick={handleGoToRegisterFormClick}>Register</button>
                  </>
                ) : (
                  <>
                    <button className="button is-primary" onClick={handleGenerateSummary}>Generate Summary</button>
                  </>
                )}
              </div>
            </>
          )}
          {activeView === 'settings' && (
            <div>
              <div className="columns control">
                {/* Summary Length */}
                <div className="columns">
                  <div className="column is-narrow">
                    <h4 className="title is-5">Summary Length</h4>
                  </div>
                  <div className="column">
                    <div className="field">
                      <p className="control has-icons-left">
                        <span className="select">
                          <select name="length" value={summaryLength} onChange={(e) => setSummaryLength(e.target.value)}>
                            <option value="tiny">Tiny</option>
                            <option value="short">Short</option>
                            <option value="medium" selected>Medium</option>
                            <option value="long">Long</option>
                            <option value="xlong">Extra Long</option>
                          </select>
                        </span>
                        <span className="icon is-small is-left">
                          <i className="fas fa-ruler"></i>
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Summary Tone */}
                <div className="columns">
                  <div className="column is-narrow">
                    <h4 className="title is-5">Summary Tone</h4>
                  </div>
                  <div className="column">
                    <div className="field">
                      <p className="control has-icons-left">
                        <span className="select">
                          <select name="tone" value={summaryTone} onChange={(e) => setSummaryTone(e.target.value)}>
                            <option value="standard" selected>Standard</option>
                            <option value="professional">Professional</option>
                            <option value="academic">Academic</option>
                            <option value="casual">Casual</option>
                            <option value="einstein">Einstein</option>
                            <option value="redneck">Redneck</option>
                            <option value="dog">Dog</option>
                          </select>
                        </span>
                        <span className="icon is-small is-left">
                          <i className="fas fa-voice"></i>
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Summary Tone Age */}
                <div className="columns">
                  <div className="column is-narrow">
                    <h4 className="title is-5">Summary Tone Age</h4>
                  </div>
                  <div className="column">
                    <div className="field">
                      <p className="control has-icons-left">
                        <span className="select">
                          <select name="targetAge" value={summaryToneAge} onChange={(e) => setSummaryToneAge(e.target.value)}>
                            <option value="unspecified" selected>Unspecified</option>
                            <option value="five year old">Five Year Old</option>
                            <option value="teenager">Teenager</option>
                            <option value="college student">College Student</option>
                            <option value="adult">Adult</option>
                          </select>
                        </span>
                        <span className="icon is-small is-left">
                          <i className="fas fa-child"></i>
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bullet Points */}
                <div className="columns">
                  <div className="column is-narrow">
                    <h4 className="title is-5">Bullet Points</h4>
                  </div>
                  <div className="column">
                    <div className="field">
                      <p className="control has-icons-left">
                        <span className="select">
                          <select name="bulletPoints" value={bulletPoints} onChange={(e) => setBulletPoints(e.target.value)}>
                            <option value="true">True</option>
                            <option value="false" selected>False</option>
                          </select>
                        </span>
                        <span className="icon is-small is-left">
                          <i className="fas fa-list-ul"></i>
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bullet Point Limit */}
                {bulletPoints === 'true' && (
                  <>
                    <div className="columns">
                      <div className="column is-narrow">
                        <h4 className="title is-5">Max Number of Bullet Points</h4>
                      </div>
                      <div className="column">
                        <input type="number" name="bulletPointLimit" min="1" max="15" value={bulletPointLimit} onChange={(e) => setBulletPointLimit(e.target.value)} />
                      </div>
                    </div>
                  </>
                )}

              </div>
            </div>
          )}
          {activeView === 'past-summaries' && (
            <div>
              <p>Past Summaries Content</p>
              <SummarySelector jwtToken={jwtToken} />
            </div>
          )}
          {isLoginFormVisible && (
            <div className="modal-container">
              <div className="modal-content">
                <form className="box popup-form">
                  <div className="field">
                    <label className="label">Email</label>
                    <div className="control">
                      <input className="input" type="email" placeholder="e.g. alex@example.com" value={emailInput} onChange={e => setEmail(e.target.value)} />
                    </div>
                  </div>

                  <div className="field">
                    <label className="label">Password</label>
                    <div className="control">
                      <input className="input" type="password" placeholder="********" value={passwordInput} onChange={e => setPassword(e.target.value)} />
                    </div>
                  </div>

                  {showLoginError && (
                    <>
                      <p className="login-error-message">Error logging in. Please try again.</p>
                    </>
                  )}

                  <button className="button is-primary" onClick={handleBackClick} style={{ marginRight: '10px' }}>Back</button>
                  <button className="button is-primary" onClick={handleSignIn} style={{ marginRight: '10px' }}>Sign in</button>
                  <button className="button is-primary" onClick={handleGoToRegisterFormClick}>Register</button>
                </form>
              </div>
            </div>
          )}
          {isRegisterFormVisible && (
            <div className="modal-container">
              <div className="modal-content">
                <form className="box popup-form">
                  <div className="field">
                    <label className="label">Email</label>
                    <div className="control">
                      <input className="input" type="email" placeholder="e.g. alex@example.com" value={emailInput} onChange={e => setEmail(e.target.value)} />
                    </div>
                  </div>

                  <div className="field">
                    <label className="label">Password</label>
                    <div className="control">
                      <input className="input" type="password" placeholder="********" value={passwordInput} onChange={e => setPassword(e.target.value)} />
                    </div>
                  </div>

                  <div className="field">
                    <label className="label">OpenAI Key</label>
                    <div className="control">
                      <input className="input" type="openAIKey" placeholder="" value={openAIKeyInput} onChange={e => setOpenAIKey(e.target.value)} />
                    </div>
                  </div>
                  <button className="button is-primary" onClick={handleBackClick} style={{ marginRight: '10px' }}>Back</button>

                  {showRegisterError && (
                    <>
                      <p className="register-error-message">Error registering account. Please try again.</p>
                    </>
                  )}

                  <button className="button is-primary" onClick={handleRegisterAccount}>Register</button>
                </form>
              </div>
            </div>
          )}
        </header>
      </div>
    </div>
  );
};

// Helper function to check if an object is empty
const isEmpty = (obj) => Object.keys(obj).length === 0;

export default Popup;

