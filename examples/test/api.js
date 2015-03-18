module.exports = {
  getPromise(val){
    console.log(val);
    return new Promise(function(resolve){
      setTimeout(function(){
        resolve(val);
      }, 400);
    });
  },

  getValue(val, cb){
    setTimeout(function(){
      cb(null, val);
    }, 400);
  }
};
