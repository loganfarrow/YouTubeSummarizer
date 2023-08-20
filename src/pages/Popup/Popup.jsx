import React, { useState } from 'react';
import './Popup.css';

const Popup = () => {
  const [activeView, setActiveView] = useState('summary'); // Current active view (summary, settings, or past-summaries)

  // handles the visibility of the login and register form popups
  const [isLoginFormVisible, setIsLoginFormVisible] = useState(false);
  const [isRegisterFormVisible, setIsRegisterFormVisible] = useState(false);

  // if this is empty, we are not logged in
  const [jwtToken, setJwtToken] = useState('test');
  
  // state for the inputs in login / register forms
  const [emailInput, setEmail] = useState('');
  const [passwordInput, setPassword] = useState('');
  const [openAIKeyInput, setOpenAIKey] = useState('');

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

  const handleSignIn = (e) => {
    e.preventDefault();

    console.log('Email:', emailInput);
    console.log('Password:', passwordInput);

    const token = 'jwt-token'; //replace with the logic for backend JWT token generation
    setJwtToken(token);

    setIsLoginFormVisible(false);
  };

  const handleRegisterAccount = (e) => {
    e.preventDefault();
    setIsLoginFormVisible(false);
    setIsRegisterFormVisible(false);
  };

  const handleLogout = (e) => {
    e.preventDefault();
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
                <textarea className="textarea custom-textarea" placeholder={jwtToken == '' ? "Log in or Create Account to make Summaries" : "Naviagate to a YouTube video and click 'Generate Summary'" } readOnly></textarea>
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
              <p>Settings Content</p>
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

export default Popup;

