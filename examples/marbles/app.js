import 'babelify/polyfill'
import React from 'react'
import Bacon from 'baconjs'
import Line from './components/line'
import Diagram from './components/diagram'
import Conflux from '../../'
import actions from './actions'
import stores from './stores'

var flux = Conflux.with(Bacon).create(actions, stores);

var promise = flux.stores.diagram.inputs.changes().take(1).toPromise();

flux.actions.evaluate.push('test');

promise.then(() => {
  React.withContext({flux}, () => {
    React.render(
      <Diagram />,
      document.getElementById('content'));
  });
});
