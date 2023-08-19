import React, { useState } from 'react';
import './Popup.css';

const Popup = () => {
  const [isFormVisible, setFormVisible] = useState(false);

  const handleClick = (e) => {
    e.preventDefault(); // Prevent form submission
    setFormVisible(false);
  }

  return (
    <div className="App">
      <div className="relative-container">
        <header className="App-header">
          <p className="title">YouTube Summarizer</p>

          <div className="buttons">
            <button className="button is-primary">
              Summary
            </button>
            <button className="button is-primary">
              Settings
            </button>
          </div>

          <div className="textarea-container">
            <textarea className="textarea custom-textarea" placeholder="e.g. Hello world" readOnly></textarea>
          </div>

          <div className="button-container">
            <button className="button is-primary" onClick={() => setFormVisible(true)}>
              Generate Summary
            </button>
          </div>

          {isFormVisible && (
            <div className="modal-container">
              <div className="modal-content">
                <form className="box popup-form">
                  <div className="field">
                    <label className="label">Email</label>
                    <div className="control">
                      <input className="input" type="email" placeholder="e.g. alex@example.com" />
                    </div>
                  </div>

                  <div className="field">
                    <label className="label">Password</label>
                    <div className="control">
                      <input className="input" type="password" placeholder="********" />
                    </div>
                  </div>

                  <button className="button is-primary" onClick={handleClick}>Sign in</button>
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

