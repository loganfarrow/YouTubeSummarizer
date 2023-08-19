import React, { useState } from 'react';
import './Popup.css';

const Popup = () => {
  const [activeView, setActiveView] = useState('summary'); // State to manage the active view
  const [isFormVisible, setFormVisible] = useState(false);
  const [isFormVisible2, setFormVisible2] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [jwtToken, setJwtToken] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [openAIKey, setOpenAIKey] = useState('');


  const handleClick = (e) => {
    e.preventDefault();
    setFormVisible(false);
    setFormVisible2(false);
  };

  const handleRegisterClick = (e) => {
    e.preventDefault();
    setFormVisible(false);
    setFormVisible2(true);
  };

  const handleSignInClick = (e) => {
    e.preventDefault();

    console.log('Email:', email);
    console.log('Password:', password);

    const token = 'jwt-token'; //replace with the logic for backend JWT token generation
    setJwtToken(token);

    setFormVisible(false);
  };

  const handleGenerateSummary = () => {
    if (!isLoggedIn) {
      setFormVisible(true);
    } else {
      getCurrentUrl((link) => {
        // Make a call to your backend endpoint with the link
        fetch(`/your-api-endpoint?link=${link}`, {
          method: 'GET',
          headers: {
            // Include any necessary headers
          },
        })
          .then((response) => response.json())
          .then((data) => {
            // Handle the response data
          })
          .catch((error) => {
            // Handle any errors
          });
      });
    }
  };

  const getCurrentUrl = (callback) => {
    if (chrome && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const url = tabs[0].url;
        callback(url);
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
            <button className="button is-primary" onClick={() => setActiveView('summary')}>Summary</button>
            <button className="button is-primary" onClick={() => setActiveView('past-summaries')}>Past Summaries</button>
            <button className="button is-primary" onClick={() => setActiveView('settings')}>Settings</button>
          </div>
          {activeView === 'summary' && (
            <>
              <div className="textarea-container">
                <textarea className="textarea custom-textarea" placeholder="e.g. Hello world" readOnly></textarea>
              </div>
              <div className="button-container">
                <button className="button is-primary" onClick={handleGenerateSummary}>
                  Generate Summary
                </button>
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
          {isFormVisible && (
            <div className="modal-container">
              <div className="modal-content">
                <form className="box popup-form">
                  <div className="field">
                    <label className="label">Email</label>
                    <div className="control">
                      <input className="input" type="email" placeholder="e.g. alex@example.com" value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                  </div>

                  <div className="field">
                    <label className="label">Password</label>
                    <div className="control">
                      <input className="input" type="password" placeholder="********" value={password} onChange={e => setPassword(e.target.value)} />
                    </div>
                  </div>

                  <button className="button is-primary" onClick={handleSignInClick} style={{ marginRight: '10px' }}>Sign in</button>
                  <button className="button is-primary" onClick={handleRegisterClick}>Register</button>
                </form>
              </div>
            </div>
          )}
          {isFormVisible2 && (
            <div className="modal-container">
              <div className="modal-content">
                <form className="box popup-form">
                  <div className="field">
                    <label className="label">Email</label>
                    <div className="control">
                      <input className="input" type="email" placeholder="e.g. alex@example.com" value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                  </div>

                  <div className="field">
                    <label className="label">Password</label>
                    <div className="control">
                      <input className="input" type="password" placeholder="********" value={password} onChange={e => setPassword(e.target.value)} />
                    </div>
                  </div>

                  <div className="field">
                    <label className="label">OpenAI Key</label>
                    <div className="control">
                      <input className="input" type="openAIKey" placeholder="" value={openAIKey} onChange={e => setOpenAIKey(e.target.value)} />
                    </div>
                  </div>

                  <button className="button is-primary" onClick={handleClick}>Register</button>
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

