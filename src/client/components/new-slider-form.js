import React, { Component } from 'react';
import PropTypes from 'prop-types';
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

class NewSliderForm extends Component {
  constructor(props){
    super(props);
    this.state = {
      isProductPickerOpen: false,
      products: [],
      name: '',
    }
  }
  resetForm() {
    this.setState({
      name:'',
      products: [],
    })
  }
  onSubmit(e){
    e.preventDefault();
    if(this.props.onSubmit) {
      this.props.onSubmit({
        products: this.state.products,
        name: this.state.name
      }).then(res => {
        this.resetForm()
      })
    }
  }
  onProductDelete(e, product, index){
    this.setState({
      products: this.state.products.filter((v, i)=> i !== index)
    })
  }
  render() {

    const resourceList = this.state.products.map((product, index) => {
      return {
        url: '#',
        media: <Thumbnail source={product.image.src} alt={product.title} />,
        attributeOne: product.title,
        actions: [{content: 'Delete', onAction: e => {this.onProductDelete(e, product, index)}}],
        persistActions: true,
      }
    })

    return (
      <Card title="Create a new slider" sectioned >
        <FormLayout>
          <TextField 
            label="Name of slider *" 
            value={this.state.name} 
            onChange={name => {this.setState({name})} } 
          />


          { this.state.products.length > 0 && <p>Selected Products</p>}
          <ResourceList
            items={resourceList}
            renderItem={(item, index) => {
              return <ResourceList.Item key={index} {...item} />;
            }}
          />

          <Button onClick={()=> {this.setState({isProductPickerOpen:true})}}>Add products</Button>
          <ResourcePicker
            products
            allowMultiple
            open={this.state.isProductPickerOpen}
            onSelection={(resources) => {
              console.log('Selected products: ', resources.products);
              console.log('Selected collections: ', resources.collections);
              this.setState({isProductPickerOpen: false});
              this.setState({products: [...this.state.products, ...resources.products]});
            }}
            onCancel={() => this.setState({isProductPickerOpen: false})}
          />


          <Button primary size="large" type="submit" onClick={this.onSubmit.bind(this)}>Create Slider</Button>
        </FormLayout>
      </Card>
    );
  }
}

NewSliderForm.propTypes = {
  onSubmit: PropTypes.func,
};


export default NewSliderForm;