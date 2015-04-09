import React from 'react'

export default React.createClass({
  style() {
    let height = 70;
    return {
      textAlign: 'center',
      fontSize: 32,
      height: height,
      lineHeight: `${height}px`,
      width: '100%',
      borderTop: '1px solid',
      borderBottom: '1px solid',
      marginBottom: 10
    };
  },

  render(){
    return <div style={this.style()}>{this.props.display}</div>;
  }
});
