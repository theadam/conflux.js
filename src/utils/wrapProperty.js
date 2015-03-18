
module.exports = function wrapProperty(property){
  property.onValue((val) => {
    property.value = val;
  });
  return property;
};
