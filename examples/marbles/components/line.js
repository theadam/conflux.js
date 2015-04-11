import React from 'react/addons'
import Marble from './marble'
import _ from 'lodash'
import Conflux from '../../../'
const PureRenderMixin = React.addons.PureRenderMixin;

const colors = ['#FF8B83', '#FAFF83', '#86FF83', '#83FFF0', '#83B5FF'];

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
      strokeWidth: 0.2
    };
  },

  style(){
    return {
      height: 45,
      width: '100%',
      position: 'relative',
      marginBottom: 40
    };
  },

  marbleStyle(x){
    return {
      position: 'absolute',
      height: '100%',
      left: `${x}%`,
      marginLeft: -16,
      width: '45',
      top: 0,
      zIndex: x
    };
  },

  getColor(x){
    var index = Math.abs(x) % colors.length;
    return colors[index];
  },

  render(){
    let marbles = this.props.data
      .toArray()
      .map((input, index) => {
        return (
          <div style={this.marbleStyle(input.get('time'))} key={index}>
            <Marble
              style={{fill: this.getColor(input.remove('time').hashCode())}}
              value={input.get('value')}
              onDrag={this.props.draggable ? (event) => this.handleDrag(index, event) : undefined} />
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
