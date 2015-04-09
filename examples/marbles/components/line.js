import React from 'react/addons'
import Marble from './marble'
import _ from 'lodash'
import Conflux from '../../../'
const PureRenderMixin = React.addons.PureRenderMixin;

const colors = ['#EE7777', '#7777FF', '#77EE77', '#DDDD77'];

export default React.createClass({
  mixins: [Conflux.Mixin(), PureRenderMixin],

  getDefaultProps(){
    return {
      keyed: true,
      draggable: true
    };
  },

  getEventTime(event){
    // Map page coordinates to "local" coordinates
    var rect = this.refs.line.getDOMNode().getBoundingClientRect();
    let finalLocation = (event.clientX + (event.offset || 0));
    return Math.round(((finalLocation - rect.left) / (rect.right - rect.left)) * 100);
  },

  handleDoubleClick(event){
    let time = this.getEventTime(event);
    console.log(time);
  },

  handleDrag(index, event){
    let time = this.getEventTime(event);
    if(time >= 0 && time <= 100){
      let line = this.props.data;
      let newLine = line.get(index);
      this.actions.changeInput.push([this.props.index, index, newLine.set('time', time)]);
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

  getColor(x){
    var index = Math.abs(x) % colors.length;
    return colors[index];
  },

  render(){
    let marbles = this.props.data
      .map((input, index) => {
        return (
          <div style={this.marbleStyle(input.get('time'))} key={index}>
            <Marble
              style={{fill: this.getColor(input.remove('time').set('index', index).hashCode())}}
              value={input.get('value')}
              onDrag={this.props.draggable ? (event) => this.handleDrag(index, event) : undefined} />
          </div>
        );
      });

    return (<div style={this.style()} onDoubleClick={this.handleDoubleClick}>
        <svg style={this.svgStyle()} viewBox="0 0 100 1" preserveAspectRatio="xMidYMid meet">
            <line ref="line" x1={0} y1={0.5} x2={100} y2={0.5} style={this.lineStyle()}/>
        </svg>
        {marbles.toArray()}
      </div>
    );
  }
});
