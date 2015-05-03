module.exports = function (user) {
    return {
        id: user.objectId,
        username: user.username,
        avatars: {
            sml: user.avatar,
            lrg: user.avatar.replace(/_normal/, '_400x400')
        }
    }
}
