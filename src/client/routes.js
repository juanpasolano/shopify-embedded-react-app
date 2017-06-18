import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import {EmbeddedApp, ResourcePicker} from '@shopify/polaris/embedded'
import App from './app'

class Routes extends Component {
  render() {
    return (
      <BrowserRouter >
        <EmbeddedApp {...window.shopSession} forceRedirect={true}>
          <div>
            <Route exact path='/' component={App} />
          </div>
        </EmbeddedApp>
      </BrowserRouter>
    );
  }
}

export default Routes;