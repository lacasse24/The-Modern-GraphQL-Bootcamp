import { v4 as uuidv4 } from 'uuid';

const Mutation = {
    createUser(parent, args , { db }, info) {
        const emailTaken = db.users.some((user) => user.email === args.user.email)

        if(emailTaken) {
            throw new Error('Email already taken')
        }

        const user = {
            id: uuidv4(),
            ...args.user
        }

        db.users.push(user)

        return user
    },
    updateUser(parent, args, { db }, info) {
        const { id, userData } = args;
        const user = db.users.find((user) => user.id === id)

        if(!user) {
            throw new Error('User not found')
        }

        if(typeof userData.email === 'string') {
            const emailTaken = db.users.some((user) => user.email === userData.email)

            if(emailTaken) {
                throw new Error('Email already taken')
            }

            user.email = userData.email
        }

        if(typeof userData.name === 'string') {
            user.name = userData.name
        }

        if(typeof userData.age !== 'undefined') { 
            user.age = userData.age
        }

        return user
    },
    updatePost(parent, {id, postData}, {db, pubsub}, info) {
        const post = db.posts.find((post) => post.id === id)
        const originalPost = {...post}

        if(!post) {
            throw new Error('Post does not exist')
        }

        if(typeof postData.title === 'string') {
            post.title = postData.title
        }

        if(typeof postData.body === 'string') {
            post.body = postData.body
        }

        if(typeof postData.published === 'boolean') {
            post.published = postData.published

            if(!post.published && originalPost.published) {
                // On supprime le post, car on vient le ramener dans nos brouillons
                pubsub.publish('post', {
                    post: {
                        mutation: 'DELETED',
                        data: post
                    }
                })
            } else if(post.published && !originalPost.published) {
                // Le post passe de brouillon à actif, donc CREATE
                pubsub.publish('post', {
                    post: {
                        mutation: 'CREATED',
                        data: post
                    }
                })
            } else if (post.published) {
                pubsub.publish('post', {
                    post: {
                        mutation: 'UPDATED',
                        data: post
                    }
                })
            }
        } 

        return post;
    },
    updateComment(parent, {id, commentData}, {db, pubsub}, info) {
        const comment = db.comments.find((comment) => comment.id === id)

        if(!comment) {
            throw new Error('This commentary does not exist')
        }

        if(typeof commentData.text === 'string') {
            comment.text = commentData.text
        }

        pubsub.publish('comment', {
            comment: {
                mutation: 'UPDATED',
                data: comment
            }
        })

        return comment
    },
    deleteUser(parent, args, { db }, info) {
        const userIndex = db.users.findIndex((user) => user.id === args.id)

        if(userIndex === -1) {
            throw new Error("Invalid index")
        }

        const deletedUsers = db.users.splice(userIndex, 1)

        db.posts = posts.filter((post) => {
            const match = post.author === args.id

            if(match) {
                db.comments = comments.filter((comment) => comment.post !== post.id)
            }

            return !match
        })

        db.comments = db.comments.filter((comment) => comment.author!== args.id)

        return deletedUsers[0]
    },
    deleteComment(parent, args, { db, pubsub }, info) {
        const comment = db.comments.find((comment) => comment.id === args.id)
        db.comments = db.comments.filter((comment) => comment.id !== args.id)

        pubsub.publish('comment', {
            comment: {
                mutation: 'DELETED',
                data: comment
            }
        })

        return comment
    },
    deletePost(parent, args, { db, pubsub }, info) {
        const post = db.posts.find((post) => post.id == args.id)
        db.posts = db.posts.filter((post) => post.id !== args.id)

        if(post == "undefined") {
            throw new Error('Could not delete this post because it does not exist')
        }

        const payload = {
            post: {
                mutation: 'DELETED',
                data: post
            }
        }

        if(post.published) {
            pubsub.publish('post', payload)
        }

        db.comments = db.comments.filter((comment) => comment.post !== post.id)

        return post;
    },
    createPost(parent, args, {db, pubsub}, info) {
        const userExists = db.users.some((user) => user.id === args.post.author)

        if(!userExists) {
            throw new Error('User not found')
        }

        const post = {
            id: uuidv4(),
            ...args.post
        }

        db.posts.push(post)

        const payload = {
            post: {
                mutation: "CREATED",
                data: post
            }
        }

        if(args.post.published) {
            pubsub.publish('post', payload)
        }

        return post;
    },
    createComment(parent, args, { db, pubsub }, info) {
        const userExists = db.users.some((user) => user.id === args.comment.author)

        if(!userExists) {
            throw new Error('User not found')
        }

        const postExists = db.posts.some((post) => post.id === args.comment.post)

        if(!postExists) {
            throw new Error('Post not found')
        }

        const comment = {
            id: uuidv4(),
            ...args.comment
        }

        db.comments.push(comment)
        pubsub.publish('comment', {
            comment: {
                mutation: 'CREATED',
                data: comment
            }
        })

        return comment
    } 
}

export { Mutation as default }