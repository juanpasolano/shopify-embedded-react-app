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

class NewSliderForm extends Component {
  constructor(props){
    super(props);
    this.state = {
      isProductPickerOpen: false,
      selectedProducts: [],
      name: ''
    }
  }
  onSubmit(e){
    e.preventDefault();

    axios.post('/api/sliders', {
      products: this.state.selectedProducts,
      name: this.state.name
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  onProductDelete(e, product, index){
    this.setState({
      selectedProducts: this.state.selectedProducts.filter((v, i)=> i !== index)
    })
  }
  render() {

    const resourceList = this.state.selectedProducts.map((product, index) => {
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
          <TextField label="Name of slider" value={this.state.name} onChange={e => {this.setState({name: e})} } />


          { this.state.selectedProducts.length > 0 && <p>Selected Products</p>}
          <ResourceList
            items={resourceList}
            renderItem={(item, index) => {
              return <ResourceList.Item key={index} {...item} />;
            }}
          />

          <Button onClick={()=> {this.setState({isProductPickerOpen:true})}}>Add product to the slider</Button>
          <ResourcePicker
            products
            allowMultiple
            open={this.state.isProductPickerOpen}
            onSelection={(resources) => {
              console.log('Selected products: ', resources.products);
              console.log('Selected collections: ', resources.collections);
              this.setState({isProductPickerOpen: false});
              this.setState({selectedProducts: [...this.state.selectedProducts, ...resources.products]});
            }}
            onCancel={() => this.setState({isProductPickerOpen: false})}
          />


          <Button primary size="large" type="submit" onClick={this.onSubmit.bind(this)}>Create Slider</Button>
        </FormLayout>
      </Card>
    );
  }
}

export default NewSliderForm;