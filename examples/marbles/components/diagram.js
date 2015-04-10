import React from 'react'
import Conflux from '../../../'
import Inputs from './inputs'
import Display from './display'
import Output from './output'

export default React.createClass({
  mixins: [Conflux.Mixin('diagram')],

  render(){
    return (
      <div style={this.props.style}>
        <Inputs inputs={this.state.diagram.inputs} />
        <Display display={this.state.diagram.display} />
        <Output output={this.state.diagram.output} />
      </div>
    );
  }
});
