##  Relational data basics (links between types of your schema)
<h4> Comment est-ce que cette query est interprétée par GraphQL ? 
<h5> Premièrement, GraphQL va regarder s'il y a un resolver pour posts. Si oui, il va interpréter tous les types scalaires (Int, String, Bool ...). Puis, pour chaque relation entre deux types personnalisés il est nécessaire d'appeler un 'custom resolver'.

<h5> Donc, si un de nos types n'est pas un type de base, on doit nécessairement créer un 'custom resolver' pour celui-ci. Un 'custom resolver' ne doit pas être dans le même 'scope' qu'un resolver pour un type scalaire. Il doit être dans son propre scope. Ce 'custom resolver' va être appelée pour chacun des post dans posts. Dans le resolver, on peut savoir à quel post on a affaire (parmi les posts) en utilisant la variable parent.

<h5> Exemple de query dans Playground

```lang-json
query {
  posts {
    title,
    body,
    author {
      id,
      name,
      email
    }
  }
}
```

   
 <h5> Exemple de resolver

```javascript
 const resolvers = {
    Query: {
        posts(parent, args, ctx, info) {
            if(!args.query) {
                return posts
            }

        return posts.filter((post) => {
            const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase())
            const isBodyMatch =  post.body.toLowerCase().includes(args.query.toLowerCase())

            return isTitleMatch || isBodyMatch
        })
      }
    },
    Post: {
        //Resolver method likes the others
        author(parent, args, ctx, info) {
            return users.find((user) => {
                return user.id === parent.author
            })
        }
    }
  ```
