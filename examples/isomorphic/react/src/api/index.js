var request = require('superagent');
var config = require('./../config');
var Promise = require('es6-promise').Promise;

module.exports = {

  loadGameData: function(gameId){
    return new Promise(function(resolve){
      request.get(config.LOCAL_API_HOST + '/api/game/' + gameId)
        .end(function(err, res){
          if(res.body && res.body.results) {
            resolve(res.body.results);
          }
        });
    });
  },

  search: function(searchString){
    if(searchString === '') return Promise.resolve({searchString, searchResults: []});
    return new Promise(function(resolve){
      request
        .get(config.LOCAL_API_HOST + '/api/search/' + searchString)
        .end(function(err, res) {
          if(err){
            console.log(err);
          }
          if(res && res.body && res.body.results) {
            resolve({
              searchString: searchString,
              searchResults: res.body.results
            });
          }
          else {
            resolve({
              searchString: searchString,
              searchResults: []
            });
          }
        });
    });
  }

};
