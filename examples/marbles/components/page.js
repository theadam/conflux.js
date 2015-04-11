import React from 'react'
import Diagram from './diagram'
import Menu from './menu'

const menuWidth = 400;

export default React.createClass({

  style(){
    return {
      position: 'relative',
      height: '100%',
      backgroundColor: '#EEEEEE'
    };
  },

  menuStyle(){
    return {
      width: menuWidth,
      height: '100%',
      position: 'absolute',
      left: 0,
      top: 0,
      fontSize: '32px',
      overflowX: 'hidden',
      borderRight: '3px solid',
      backgroundColor: '#FEFEFE'
    };
  },

  diagramStyle(){
    return {
      marginLeft: menuWidth + 20,
      marginRight: 20
    };
  },

  render(){
    return (
      <div style={this.style()}>
        <Menu style={this.menuStyle()} />
        <Diagram style={this.diagramStyle()} />
      </div>
    );
  }
});
