import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';

import MailerLite from './containers/MailerLite/MailerLite';

class App extends Component {
  render () {
    return (
      <BrowserRouter>
        <div className="App">
          <MailerLite />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
