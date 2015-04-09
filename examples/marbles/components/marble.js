import React from 'react/addons'
import _ from 'lodash'
import Conflux from '../../../'
import Bacon from 'baconjs'

import prefix from './utils/prefix'

const PureRenderMixin = React.addons.PureRenderMixin;

function getClientX(e) {
  var position = (e.touches && e.touches[0]) || e;
  return position.clientX;
}

export default React.createClass({
  mixins: [Conflux.Mixin(), PureRenderMixin],

  componentWillMount(){
    if(!this.props.onDrag) return this.setState({isGrabbed: false});
    let mouseDowns = this.eventStream('handleDown')
      .filter(e => e).doAction('.preventDefault');

    let mouseMoves = this.stores.mouseMoves.changes();
    let mouseUps = this.stores.mouseUps.changes();

    let elementCenter = mouseDowns
      .doAction('.persist')
      .map('.target.getBoundingClientRect')
      .map((rect) => Math.round((rect.left + rect.right) / 2))
      .toProperty();

    let clientX = mouseDowns.map(getClientX);

    let offset = elementCenter.combine(clientX, (center, click) => center - click).toProperty();

    let grabbed = Bacon.update(false,
          mouseDowns, () => true,
          mouseUps, () => false)
        .skipDuplicates();

    this.connectToState('isGrabbed', grabbed);

    let drags = mouseMoves.filter(grabbed);

    drags
      .combine(offset.sampledBy(drags), (e, offset) => {
        return {
          clientX: getClientX(e),
          offset
        };
      })
      .onValue(this.props.onDrag);
  },

  style(){
    return {
      textAlign: 'center',
      cursor: this.props.onDrag ? 'ew-resize' : undefined,
      width: '100%',
      height: '100%',
      position: 'relative',
      display: 'inline-block'
    };
  },

  svgStyle(){
    return {
      position: 'absolute',
      top: 0,
      left: 0
    };
  },

  circleStyle() {
    return {
      fill: '#ffffff',
      stroke: '#000000',
      strokeWidth: 0.01,
      [prefix('filter')]: 'drop-shadow(10px 10px 10px black)',
      filter: 'drop-shadow(10px 10px 10px black)'
    };
  },

  textStyle(){
    return {
      position: 'relative',
      display: 'inlineBlock',
      verticalAlign: 'middle',
      width: '300px',
      WebkitTouchCallout: 'none',
      [prefix('userSelect')]: 'none',
      userSelect: 'none'
    };
  },

  spacerStyle(){
    return {
      display: 'inline-block',
      height: '100%',
      verticalAlign: 'middle'
    };
  },

  render(){
    var handleDown = this.props.onDrag ? this.handleDown : undefined;
    return (
      <div style={this.style()} onMouseDown={handleDown} onTouchStart={handleDown}>
        <svg style={this.svgStyle()} viewBox="0 0 1 1">
          <circle style={_.merge(this.circleStyle(), this.props.style)} cx={0.5} cy={0.5} r={0.48} />
        </svg>
        <div style={this.spacerStyle()} />
        <span style={this.textStyle()}>{this.props.value}</span>
      </div>
    );
  }
});
