var React = require('react')
var MagicMove = require('react-magic-move')

var OrderedList = React.createClass({
  displayName: 'OrderedList',

  propTypes: {
    scores: React.PropTypes.array
  },

  renderRow: function (row, i) {
    var offset = this.props.offset + i
    return (
      <div key={ row.user.username } className='ordered-list-item'>
        <span className='row-counter'>{ offset }</span>
        <span className='row-avatar'>
          <img src={ row.user.avatar } />
        </span>
        <span className='row-name'>
          <a href={ 'http://twitter.com/' + row.user.username }>
            @{ row.user.username }
          </a>
        </span>
        <span className='row-count'>{ row.tabs }</span>
      </div>
    )
  },

  render: function () {
    var scores = this.props.scores

    return (
      <div>
        { scores.map(this.renderRow) }
      </div>
    )
  }
})

module.exports = OrderedList
