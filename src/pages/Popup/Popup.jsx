import React, { useState } from 'react';
import './Popup.css';

const Popup = () => {
  const [isFormVisible, setFormVisible] = useState(false);

  const handleClick = () => {
    // For now, we're just toggling the form on button click
    // In a real-world application, perform some form submission logic here
    setFormVisible(false);
  }

  return (
    <div className="App">
      <div className="relative-container">
        <header className="App-header">
          <p className="title">YouTube Summarizer</p>

          <div className="buttons">
            <button class="button is-primary">
              Summary
            </button>
            <button class="button is-primary">
              Settings
            </button>
          </div>

          <div className="textarea-container">
            <textarea class="textarea" placeholder="e.g. Hello world" readOnly></textarea>
          </div>

          <div className="button-container">
            <button class="button is-primary" onClick={() => setFormVisible(true)}>
              Generate Summary
            </button>
          </div>

          {isFormVisible &&
            <form class="box popup-form">
              <div class="field">
                <label class="label">Email</label>
                <div class="control">
                  <input class="input" type="email" placeholder="e.g. alex@example.com" />
                </div>
              </div>

              <div class="field">
                <label class="label">Password</label>
                <div class="control">
                  <input class="input" type="password" placeholder="********" />
                </div>
              </div>

              <button class="button is-primary" onClick={handleClick}>Sign in</button>
            </form>
          }
        </header>
      </div>
    </div>
  );
};

export default Popup;

