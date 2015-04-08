import React from 'react'
import Line from './line'

export default React.createClass({
  render(){
    let lines = this.props.inputs.map((input, index) => <Line key={index} data={input} index={index} />);
    return <div>{lines}</div>;
  }
});
