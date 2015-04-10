import 'babelify/polyfill'
import React from 'react'
import Bacon from 'baconjs'
import Page from './components/page'
import Conflux from '../../'
import actions from './actions'
import stores, {defaultPath} from './stores'

var flux = Conflux.with(Bacon).create(actions, stores);

var promise = flux.stores.diagram.inputs.changes().take(1).toPromise();

flux.actions.showDiagram.push(defaultPath);

promise.then(() => {
  React.withContext({flux}, () => {
    React.render(
      <Page />,
      document.getElementById('content'));
  });
});
