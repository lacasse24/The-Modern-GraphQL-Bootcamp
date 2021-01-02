const Subscription = {
    count: {
        subscribe(parent, args, {pubsub} , info) {
            let count = 0

            setInterval( () => {
                count++
                pubsub.publish('count', {
                    count
                })
            },1000)

            return pubsub.asyncIterator('count')
        }
    },
    comment: {
        subscribe(parent, args , {db, pubsub}, info) {
            return pubsub.asyncIterator(`comment`)
        }
    },
    post: {
        subscribe(parent, args, {pubsub}, info) {
            return pubsub.asyncIterator(`post`)
        }
    }
}

export {Subscription as default}