// var base = [
//     {
//         user: {
//             username: 'drk',
//             avatar: '/images/drk.png'
//         },
//         tabs: 0
//     },
//     {
//         user: {
//             username: 'someone else',
//             avatar: '/images/drk-002.png'
//         },
//         tabs: 0
//     },
//     {
//         user: {
//             username: 'another person',
//             avatar: '/images/drk.png'
//         },
//         tabs: 0
//     }
// ]

// React.render(<InlineOrderedList scores={ base } />, another)
// React.render(<OrderedList scores={ base } />, container)
//
// setInterval(function () {
//     var scores = base.map(function (s) {
//         s.tabs = random(1,100)
//         return s
//     })
//
//     React.render(<InlineOrderedList scores={ sortby(scores, 'tabs').reverse() } />, another)
//     React.render(<OrderedList scores={ sortby(scores, 'tabs').reverse() } />, container)
// }, 2000)
