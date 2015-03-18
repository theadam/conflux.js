var React = require('react');
var PropTypes = React.PropTypes;
var Conflux = require('../conflux');

var statics = {
  contextTypes: {
    flux: PropTypes.instanceOf(Conflux)
  },

  childContextTypes: {
    flux: PropTypes.instanceOf(Conflux)
  },

  propTypes: {
    listenTo: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.object
    ]),
    flux: PropTypes.instanceOf(Conflux)
  }
};

module.exports = statics;
