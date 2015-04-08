import React from 'react'
import Marble from './marble'
import _ from 'lodash'
import Conflux from '../../../'


export default React.createClass({
  mixins: [Conflux.Mixin()],

  getDefaultProps(){
    return {
      keyed: true,
      draggable: true
    };
  },

  handleDrag(index, event){
    // Map page coordinates to "local" coordinates
    var rect = this.refs.line.getDOMNode().getBoundingClientRect();
    let finalLocation = (event.clientX + event.offset);
    let time = ((finalLocation - rect.left) / (rect.right - rect.left)) * 100;
    if(time >= 0 && time <= 100){
      let line = this.props.data;
      let marble = line.find(input => input.index === index);
      marble.time = Math.round(time);
      this.actions.changeInput.push([this.props.index, line]);
    }
  },

  svgStyle() {
    return {
      position: 'absolute',
      height: '100%',
      width: '100%',
      left: 0,
      top: 0
    };
  },

  lineStyle() {
    return {
      fill: '#ffffff',
      stroke: '#000000',
      strokeWidth: 0.03
    };
  },

  style(){
    return {
      height: 32,
      width: '100%',
      position: 'relative',
      marginBottom: 10
    };
  },

  marbleStyle(x){
    return {
      position: 'absolute',
      height: '100%',
      left: `${x}%`,
      marginLeft: -16,
      width: '32',
      top: 0
    };
  },

  render(){
    let marbles = this.props.data
      .map((input) => {
        return (
          <div style={this.marbleStyle(input.time)} key={input.id}>
            <Marble
              value={input.value}
              onDrag={this.props.draggable ? (event) => this.handleDrag(input.index, event) : undefined} />
          </div>
        );
      });

    return (<div style={this.style()}>
        <svg style={this.svgStyle()} viewBox="0 0 100 1" preserveAspectRatio="xMidYMid meet">
            <line ref="line" x1={0} y1={0.5} x2={100} y2={0.5} style={this.lineStyle()}/>
        </svg>
        {marbles}
      </div>
    );
  }
});
