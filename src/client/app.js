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
import axios from 'axios'

import NewSliderForm from './components/new-slider-form'
import SliderList from './components/slider-list'

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      sliders: null,
    }
  }
  componentDidMount(){
    this.fetchSliders();
  }
  fetchSliders(){
    axios.get('/api/sliders')
    .then( response => {
      this.setState({
        sliders: response.data
      })
    })
    .catch(error => {
      console.log(error);
    });
  }
  onDelete(e, slider, index){
    axios.delete('/api/sliders/' + slider._id)
    .then( response => {
      this.setState({
        sliders: this.state.sliders.filter((v, i)=> i !== index)
      })
    })
    .catch(error => {
      console.log(error);
    });
  }
  onSubmit(data) {
    return axios.post('/api/sliders', data)
    .then((response) => {
      console.log(response);
      this.fetchSliders()
    })
  }
  render() {
    return (
      <div className="p-2">
        <Layout>
          <Layout.Section>
            <SliderList sliders={this.state.sliders} onDelete={this.onDelete.bind(this)} />
          </Layout.Section>
          <Layout.Section>
            <NewSliderForm onSubmit={this.onSubmit.bind(this)}/>
          </Layout.Section>
        </Layout>
      </div>
    );
  }
}

export default App;