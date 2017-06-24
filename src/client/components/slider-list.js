import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  ResourceList,
} from '@shopify/polaris'


class SliderList extends Component {
  render() {
    const resourceList = (this.props.sliders || []).map((slider, index) => {
      return {
        attributeOne: slider.name,
        attributeTwo: slider.products.length + ' products',
        actions: [{content: 'Delete', onAction: e => {this.props.onDelete(e, slider, index)}}],
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
SliderList.defaultProps = {
  sliders: [],
  onDelete: ()=>{},
};

SliderList.propTypes = {
  sliders: PropTypes.array,
  onDelete: PropTypes.func,
};

export default SliderList;