var View = require('./components/view');
var React = require('react');
var Conflux = require('../../');

var flux = Conflux(require('./actions/actions'), require('./stores/stores'));

React.render(
  <Conflux.Component flux={flux} listenTo={['data', 'loading']}>
    <View />
  </Conflux.Component>,
  document.getElementById('content'));
