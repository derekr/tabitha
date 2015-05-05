var React = require('react')
var MagicMove = require('react-magic-move')

var SitesList = React.createClass({
  displayName: 'SitesList',

  propTypes: {
    scores: React.PropTypes.array
  },

  renderRow: function (row, i) {
    var offset = this.props.offset + i
    return (
      <div key={ row.text } className='ordered-list-item'>
        <span className='row-counter'>{ offset }</span>
        <span className='row-name'>
          { row.text }
        </span>
        <span className='row-count'>{ row.count }</span>
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

module.exports = SitesList
