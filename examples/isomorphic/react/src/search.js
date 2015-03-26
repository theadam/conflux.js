var React = require('react/addons');


var Search = React.createClass({

  getInitialState: function() {
    var defaultClass = 'search-blurred';

    if(this.props.route.pathname === '/') {
      defaultClass = 'search-home';
    }

    return {
      searchString: '',
      defaultClass: defaultClass
    };
  },

  componentDidMount: function() {
    this.refs.search.getDOMNode().focus();
    var value = this.refs.search.getDOMNode().value;
    if(value){
      this.search(value);
      this.setState({defaultClass: 'search-focused'});
    }
  },

  handleSubmit: function(e) {
    e.preventDefault();
  },

  search: function(val){
    this.props.flux.actions.routeTo.push('/search/' + encodeURI(val));
    this.setState({
      defaultClass: 'search-focused'
    });
  },

  handleChange: function(e) {
    this.search(e.target.value);
  },

  handleClick: function() {
    if(this.state.defaultClass !== 'search-home') {
      this.setState({
        defaultClass: 'search-focused'
      });
    }
  },

  handleBlur: function() {
    if(this.state.defaultClass !== 'search-home') {
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
      searchContext = <img className="search-loading" src="/images/si.gif" />;
    }
    else {
      searchContext = <button className="search-submit" type="submit">search</button>;
    }
    return (
      <div className={this.state.defaultClass}>
        <form method="get" action="/" className="search-form" onSubmit={this.handleSubmit}>
          <input placeholder="Super Mario Bros." type="text" ref="search" className="search-input" name="q" onClick={this.handleClick} onBlur={this.handleBlur} onChange={this.handleChange} />
          {searchContext}
        </form>
      </div>
    );
  }

});


module.exports = Search;
