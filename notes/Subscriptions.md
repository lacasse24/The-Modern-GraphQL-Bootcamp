### Qu'est-ce qu'une "subscription" (abonnement) ?
- Les "subscriptions" GraphQL utilisent socket.io sous le capot ce qui laisse un canal ouvert pour la communication entre le client et le serveur. Ce qui permet au serveur d'envoyer les dernières modifications au client en temps réel !
- Donc, si on ajoute un Comment à un Post, le serveur peut prendre ce comment et le push à tous les abonnés.
- Ce qui peut être super intéressant pour une application de chat, livraison, bourse ...

### Quel est le but d'une "subscription" ?
- Que le client puisse avoir la dernière version des données en tout temps. Ainsi, si on **CUD**, le client n'aura pas besoin de refaire une Query pour obtenir les modifications.

### Qu'est-ce que PubSub veut dire ?
- **Pub**lish
- **Sub**scribe

### Quelle est la librairie que GraphQL utilise pour le PubSub ?
`graphql-yoga`  is based on the following libraries & tools:

-   [`express`](https://github.com/expressjs/express)/[`apollo-server`](https://github.com/apollographql/apollo-server): Performant, extensible web server framework
-   [`graphql-subscriptions`](https://github.com/apollographql/graphql-subscriptions)/[`subscriptions-transport-ws`](https://github.com/apollographql/subscriptions-transport-ws): GraphQL subscriptions server
-   [`graphql.js`](https://github.com/graphql/graphql-js)/[`graphql-tools`](https://github.com/apollographql/graphql-tools): GraphQL engine & schema helpers
-   [`graphql-playground`](https://github.com/graphcool/graphql-playground): Interactive GraphQL IDE

### Puisque GraphQL est basé sur graphql-subscriptions, est-il possible d'importer directement PubSub ?
- Oui, il est possible d'utiliser la dépendance directement ! Donc, de faire :
```javascript 
import { GraphQLServer, PubSub } from  'graphql-yoga'

const  pubsub = new  PubSub()

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers: {
        Query,
        Mutation,
        Subscription,
        User,
        Post,
        Comment
    },
    context: {
        db,
        pubsub
    }
})
```
De plus, on veut pouvoir pub/sub dans tous  nos resolvers, donc on va passer l'instance de PubSub() au contexte de l'application.

### Est-il possible d'avoir un exemple de "subscription" ? 
Oui ! Notez bien que le premier paramètre de toutes les fonctions de la librairie graphql-subscribtions est la canal de transmission. On peut voir ça comme un canal Slack.
```javascript
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
    }
}

export {Subscription as default}
```

### Est-il possible d'avoir un exemple plus concret ?
La définition de l'abonnement et du type de payload dans schema.graphql  :
```javascript
type Subscription {
  comment: CommentSubscriptionPayload!
}

type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
}

type CommentSubscriptionPayload {
    mutation: String!
    data: Comment!
}
```
Puis, dans le fichier Subscription.js, ajouter une méthode permettant de s'abonner aux changements dans les données de type commentaire  :
```javascript
const Subscription = {
  comment: {
    	subscribe(parent, args , {db, pubsub}, info) {
        return pubsub.asyncIterator(`comment`)
      }
   }  
}
```
Finalement, il reste seulement à modifier les mutations touchant aux commentaires pour qu'elles publient les modifications aux abonnés. Par exemple :
```javascript 
deleteComment(parent, args, { db, pubsub }, info) {
	const  comment = db.comments.find((comment) =>  comment.id === args.id)
	db.comments = db.comments.filter((comment) =>  comment.id !== args.id)
	
	pubsub.publish('comment', {
		comment: {
			mutation:  'DELETED',
			data:  comment
		}
	})

	return  comment
}
```