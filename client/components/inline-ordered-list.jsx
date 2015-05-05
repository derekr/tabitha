var React = require('react')
var MagicMove = require('react-magic-move')

var InlineOrderedList = React.createClass({
  displayName: 'InlineOrderedList',

  propTypes: {
    scores: React.PropTypes.array
  },

  renderRow: function (row, i) {
    var offset = this.props.offset + i

    return (
      <div key={ row.user.username } className='inline-ordered-list-item'>
        <span className="row-counter">{ offset }</span>
        <span className='row-avatar'>
          <img src={ row.user.avatar } />
        </span>

        <span className='row-count inline-row-count'>{ row.tabs }</span>
        <span className='row-name'>
          <a href={ 'http://twitter.com/' + row.user.username }>
            @{ row.user.username }
          </a>
        </span>
      </div>
    )
  },

  render: function () {
    var scores = this.props.scores

    return (
      <div className="inline-ordered-list-container">
        { scores.map(this.renderRow) }
      </div>
    )
  }
})

module.exports = InlineOrderedList
