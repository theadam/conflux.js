import React from 'react'

export default React.createClass({
  style() {
    let height = 80;
    return {
      textAlign: 'center',
      fontSize: 40,
      fontWeigth: 'bold',
      height: height,
      lineHeight: `${height}px`,
      width: '100%',
      borderTop: '1px solid',
      borderBottom: '1px solid',
      marginBottom: 40
    };
  },

  render(){
    return <div style={this.style()}>{this.props.display}</div>;
  }
});
