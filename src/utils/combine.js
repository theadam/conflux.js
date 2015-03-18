var Bacon = require('baconjs');
var wrapProperty = require('./wrapProperty');

module.exports = function combineStores(stores){
  return wrapProperty(Bacon.combineTemplate(stores));
};
