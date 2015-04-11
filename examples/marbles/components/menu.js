import React from 'react'
import Conflux from '../../../'

export default React.createClass({
  mixins: [Conflux.Mixin('descriptors')],

  ulStyle(){
    return {
      listStyleType: 'none',
      padding: 0,
      margin: 10
    };
  },

  groupStyle(){
    return {
      color: '#676767',
      fontWeight: 'bold'
    };
  },

  descriptorStyle(){
    return {
      cursor: 'pointer',
      color: '#333333'
    };
  },

  renderGroup([groupName, group]){
    return ([
      <li key={groupName} style={this.groupStyle()}>{groupName}</li>,
      <ul style={this.ulStyle()}>
        {group.entrySeq().map(this.renderDescriptor(groupName)).toJS()}
      </ul>
    ]);
  },

  renderDescriptor(groupName){
    return ([descriptorName, descriptor]) => {
      return <li key={descriptorName}
                style={this.descriptorStyle()}
                onClick={() => this.actions.showDiagram.push(`${groupName}.${descriptorName}`)}>
                  {descriptorName}
                </li>;
    };
  },

  render() {
    let items = this.state.descriptors.entrySeq().map(this.renderGroup);

    return (
      <div style={this.props.style}>
        <ul style={this.ulStyle()}>
          {items.toJS()}
        </ul>
      </div>
    );
  }
});
