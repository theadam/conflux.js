import React from 'react'
import Line from './line'

export default React.createClass({
  render(){
    return <Line data={this.props.output} draggable={false} keyed={false} />;
  }
});
