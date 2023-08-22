import React, { useState } from 'react';
import './Popup.css';
import { login, register, updateOpenAiKey, fetchUser, updatePassword, updateEmail, deleteUser } from '../../../utils/authenticationCalls'

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

  // holds representation of the current summary (in JSON format)
  const [currentSummary, setSummary] = useState({});

  // show error messages if login or register failed
  const [showLoginError, setShowLoginError] = useState(false);
  const [showRegisterError, setShowRegisterError] = useState(false);

  // on the first load, we want to check if there is a jwtToken in local storage and set it if so
  React.useEffect(() => {
    let jwt_token = localStorage.getItem('jwtToken')
    if (jwt_token !== null) {
      setJwtToken(jwt_token);
    }

    console.log(localStorage)
  }, []);

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
      console.error('Error registering account: ' + responseData.e);
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

  const handleGenerateSummary = (e) => {
    e.preventDefault();
  };

  // TODO add a check that this is a Youtube video url
  const getCurrentUrl = () => {
    if (chrome && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const url = tabs[0].url;
        return url;
      });
    } else {
      console.error('This function only works in a Chrome extension.');
    }
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
                <textarea className="textarea custom-textarea" placeholder={jwtToken == '' ? "Log in or Create Account to make Summaries" : "Naviagate to a YouTube video and click 'Generate Summary'"} readOnly>
                  {isEmpty(currentSummary) ? '' : currentSummary.summary}
                </textarea>
              </div>
              <div className="bottom-button-container">
                {jwtToken === '' ? (
                  <>
                    <button className="button is-primary" onClick={handleGoToLoginFormClick}>Log In</button>
                    <button className="button is-primary" onClick={handleGoToRegisterFormClick}>Register</button>
                  </>
                ) : (
                  <>
                    <button className="button is-primary" onClick={handleGenerateSummary}>Generate Summary</button>
                    <button className="button is-primary" onClick={() => setActiveView('past-summaries')}>Past Summaries</button>
                  </>
                )}
              </div>
            </>
          )}
          {activeView === 'settings' && (
            <div>
              {/* Your settings components */}
              <div className="control">
                {/* Length Options */}
                <label>Length:</label>
                <label className="radio"><input type="radio" name="length" value="tiny" /></label>
                <label className="radio"><input type="radio" name="length" value="short" /></label>
                <label className="radio"><input type="radio" name="length" value="medium" checked /></label>
                <label className="radio"><input type="radio" name="length" value="long" /></label>
                <label className="radio"><input type="radio" name="length" value="xlong" /></label>

                {/* Tone Options */}
                <label>Tone:</label>
                <label className="radio"><input type="radio" name="tone" value="standard" checked /></label>
                <label className="radio"><input type="radio" name="tone" value="professional" /></label>
                <label className="radio"><input type="radio" name="tone" value="academic" /></label>
                <label className="radio"><input type="radio" name="tone" value="casual" /></label>
                <label className="radio"><input type="radio" name="tone" value="einstein" /></label>
                <label className="radio"><input type="radio" name="tone" value="redneck" /></label>
                <label className="radio"><input type="radio" name="tone" value="dog" /></label>

                {/* Target Age Options */}
                <label>Target Age:</label>
                <label className="radio"><input type="radio" name="targetAge" value="unspecified" checked /></label>
                <label className="radio"><input type="radio" name="targetAge" value="five year old" /></label>
                <label className="radio"><input type="radio" name="targetAge" value="teenager" /></label>
                <label className="radio"><input type="radio" name="targetAge" value="college student" /></label>
                <label className="radio"><input type="radio" name="targetAge" value="adult" /></label>

                {/* Bullet Points Option */}
                <label>Bullet Points:</label>
                <label className="radio"><input type="radio" name="bulletPoints" value="true" /></label>
                <label className="radio"><input type="radio" name="bulletPoints" value="false" checked /></label>

                {/* Paragraph Limit */}
                <label>Paragraph Limit:</label>
                <input type="number" name="paragraphLimit" />

                {/* Word Limit */}
                <label>Word Limit:</label>
                <input type="number" name="wordLimit" />

                {/* Bullet Point Limit */}
                <label>Bullet Point Limit:</label>
                <input type="number" name="bulletPointLimit" />
              </div>
            </div>
          )}
          {activeView === 'past-summaries' && (
            <div>
              {/* Your past summaries components */}
              <p>Past Summaries Content</p>
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

