import React from 'react'

var strokeSize = 1;

export default React.createClass({

  render() {
    return (
      <g x={this.props.x} y={this.props.y}>
        <circle
          cy={this.props.width / 2}
          cx={this.props.width / 2}
          fill="rgb(100,100,255)"
          stroke="black"
          r={this.props.width / 2 - strokeSize / 2}
          strokeWidth={strokeSize + 'px'} />
        <text width={this.props.width} height={this.props.width} color="black">{this.props.value}</text>
      </g>
    );
  }
});
