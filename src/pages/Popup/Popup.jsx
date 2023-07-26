import React from 'react';
import './Popup.css';
import { Tab, Tabs } from 'react-bootstrap';
const Popup = () => {
  return (
    <div className="App">
      <header className="App-header">
        <p>YouTube Summarizer</p>
        <Tabs defaultActiveKey="summary" id="uncontrolled-tab-example" className="mb-3">
          <Tab eventKey="summary" title="Summary">
            <textarea placeholder="I need pretty CSS config bad. Logan is not good at design" />
          </Tab>
          <Tab eventKey="settings" title="Settings">
          </Tab>
        </Tabs>
      </header>
    </div>
  );
};

export default Popup;
