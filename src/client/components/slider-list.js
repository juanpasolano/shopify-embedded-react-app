import React, { Component } from 'react';
import {
  Card,
  ResourceList,
} from '@shopify/polaris'
import axios from 'axios'


class SliderList extends Component {
  constructor(props){
    super(props);
    this.state = {
      sliders: null,
    }
  }
  componentDidMount(){
    console.log(window.shopSession)
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
  render() {
    const resourceList = (this.state.sliders || []).map((slider, index) => {
      return {
        attributeOne: slider.name,
        attributeTwo: slider.products.length + ' products',
        actions: [{content: 'Delete', onAction: e => {this.onDelete(e, slider, index)}}],
        persistActions: true,
      }
    })
    return (
      <Card title="Sliders you have created" sectioned >
        <ResourceList
          items={resourceList}
          renderItem={(item, index) => {
            return <ResourceList.Item key={index} {...item} />;
          }}
        />
      </Card>
    );
  }
}

export default SliderList;