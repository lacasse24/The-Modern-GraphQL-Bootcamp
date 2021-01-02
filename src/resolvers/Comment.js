const Comment = {
    author(parent, args, {db}, info) {
        // Le parent est toujours de même type que le scope.
        return db.users.find((user) => {
            return user.id === parent.author
        })
    },
    post(parent, args, {db}, info)  {
        return db.posts.find((post) => {
            return post.id === parent.post
        })
    }
}

export { Comment as default } 