import React, { Component } from 'react';
import {ActionList, Popover, Button} from '@shopify/polaris'

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      active: 0
    }
  }
  render() {
    return (
      <div>
        this is your embedded app
        <Popover
  active={this.state.active}
  preferredPosition="above"
  onClose={e=>{this.setState({active:e})}}
  activator={<Button onClick={e => this.setState({active:1})}>Sales channels</Button>}
>
  <Popover.Pane fixed>
    <Popover.Section>
      <p>Available sales channels</p>
    </Popover.Section>
  </Popover.Pane>
  <Popover.Pane>
    <ActionList
      items={[
        {content: 'Online store', onAction: e => {console.log(e)} },
        {content: 'Facebook', onAction: e => {console.log(e)} },
        {content: 'Shopify POS', onAction: e => {console.log(e)} },
      ]}
    />
  </Popover.Pane>
</Popover>
      </div>
    );
  }
}

export default App;