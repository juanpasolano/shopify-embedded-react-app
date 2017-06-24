import React, { Component } from 'react';
import {
  ActionList, 
  Popover, 
  Button,
  FormLayout,
  TextField,
  TextStyle,
  ResourceList,
  Layout,
  Card,
  Thumbnail,
} from '@shopify/polaris'
import {ResourcePicker} from '@shopify/polaris/embedded'

import NewSliderForm from './components/new-slider-form'
import SliderList from './components/slider-list'

class App extends Component {
  render() {
    return (
      <div className="p-2">
        <Layout>
          <Layout.Section>
            <SliderList />
          </Layout.Section>
          <Layout.Section>
            <NewSliderForm />
          </Layout.Section>
        </Layout>
      </div>
    );
  }
}

export default App;