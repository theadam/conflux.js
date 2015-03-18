var React = require('react/addons');


var Search = React.createClass({

  getInitialState: function() {
    if(this.props.route.pathname === '/') {
      var defaultClass = 'search-home'
    } else {
      var defaultClass = 'search-blurred'
    }
    return {
      searchString: '',
      defaultClass: defaultClass
    }
  },

  componentDidMount: function() {
    this.refs.search.getDOMNode().focus();
  },

  handleSubmit: function(e) {
    e.preventDefault();
    if(this.state.searchString.trim().length) {
      this.props.onSearch(this.state.searchString);
    }
  },

  handleChange: function(e) {
    if(e.target.value.length) {
      this.setState({
        searchString: e.target.value,
        prevSearch: e.target.value
      });
    }
    else {
      this.setState({
        searchString: e.target.value,
      });
    }
  },

  handleClick: function(e) {
    if(this.state.defaultClass != 'search-home') {
      this.setState({
        defaultClass: 'search-focused',
      });
    }
  },

  handleBlur: function(e) {
    if(this.state.defaultClass != 'search-home') {
      if(!this.props.search.string.length) {
        this.setState({
          defaultClass: 'search-blurred'
        });
      }
      else {
        this.setState({
          defaultClass: 'search-blurred'
        });
      }
    }
  },

  onLoadingChange: function(val) {
    if(!val){
      this.setState({
        defaultClass: 'search-blurred'
      });
    }
  },

  render: function() {
    var searchContext;
    if(this.props.search.loading) {
      searchContext = <img className="search-loading" src="/images/si.gif" />
    } else {
      searchContext = <button className="search-submit" type="submit">search</button>
    }
    return (
      <div className={this.state.defaultClass}>
        <form method="get" action="/" className="search-form" onSubmit={this.handleSubmit}>
          <input placeholder="Super Mario Bros." type="text" ref="search" className="search-input" name="q" onChange={this.handleChange} onClick={this.handleClick} onBlur={this.handleBlur} value={this.state.searchString} />
          {searchContext}
        </form>
      </div>
    )
  }

})


module.exports = Search
