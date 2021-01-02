### Quelles sont les 4 opérations de base pour la persistance des données ?
-**C**reate
-**R**ead
-**U**pdate
-**D**elete

### Est-ce qu'on peut effectuer lesdites opérations avec GraphQL ?
- Certainement, le "R" est possible par le biais d'un query et les autres opérations par le biais de mutations.

### Qu'est-ce qu'une mutation ?
- C'est lorsqu'on modifie l'état des données dans notre base de données. Donc, lorsqu'on effectue une opération de type Create, Update ou Delete.

### Est-ce qu'il serait possible d'avoir un exemple de mutation ?
Yep ! Voici le schema de l'application ! Grosso modo, une mutation a la même structure qu'une "Query".
```javascript
const typeDefs = `
type Mutation {
	createUser(name: String!, email: String!, age: Int): User!
}

type User {
	id: ID!
	name: String!
	email: String!
	age: Int
}
`
```
```javascript
// Le resolver
const  resolvers = {
Mutation: {
 createUser(parent, args , ctx, info) {
     const emailTaken = users.some((user) => user.email === args.email)

     if(emailTaken) {
         throw new Error('Email already taken')
     }

     const user = {
         id: uuidv4(),
         name: args.name,
         email: args.email,
         age: args.age
     }

     users.push(user)

     return user
  }
 }
}
```
Et la requête que le client pourrait faire :
```javascript
mutation {
  createUser(name: "Andrea", email: "ag@gmail.com", age: 27) {
    id
    name
    email
  }
}
```

### À quoi sert le plugin babel-plugin-transform-object-rest-spread ?
- Ça permet d'utiliser l'Object spread operator. Qui celui-ci, permet d'étendre (spread) les propriétés d'un objet comme sur une toast ! 

### Quelle étape intermédiaire il est important de ne pas oublier ? 
- Il faut spécifier à babel dans notre fichier .babelrc qu'on utilise désormait le plugin.
```javascript
{
	"presets": [
		"env"
	],
	"plugins": [
		"transform-object-rest-spread"
	]
}
```

### Un exemple ! Un exemple !
Le code : 
```javascript
const  comment = {
	id:  uuidv4(),
	text: args.text,
	author: args.author,
	post: args.post
}
```
Devient le suivant :
```javascript
const  comment = {
	id:  uuidv4(),
	...args
}
```
- Ça marche car args contient seulement les propriétés text, author et post qui correspondent directement à celles qu'on veut ajouter à notre objet.

### Qu'est-ce qu'un input type ? 
- C'est un type personnalisé que l'on peut créer pour rendre plus lisible la liste de paramètres que prend en entrée une mutation 'x'.
- Un input type ne peut comprendre que des types scalaires, donc un input type ne peut pas comprendre un input type.

### As-tu un exemple ?
Cette mutation :
```javascript 
createUser(name: String!, email: String!, age: Int): User!
```
Peut devenir
```javascript 
createUser(user: CreateUserInput!): User!
```
Si l'on ajoute au schéma de notre application :
```javascript
input CreateUserInput {
	name: String!
	email: String!
	age: Int
}
```
- Il est à noter, qu'il ne faut pas oublier de modifier le "resolver" pour qu'il prenne en compte args.user.LaProps au lieu de args.LaProps

### Quel est le problème entre les fichiers .graphql et Nodemon ?
- Si on utilise Nodemon, celui-ci ne va pas observer les fichiers .graphql par défaut, donc on n'aura pas les dernières modifications dans ces fichiers.
- Il faut donc ajouter --ext js, graphql à notre script dans le package.json.


### Comment faire pour accéder aux données de la base de données peu importe le query/mutation ?
- Centraliser tes données dans un repository qui va être passé lors de la création du serveur GraphQL.
- Dans notre cas, nous avons mis notre "fake data" dans un fichier se nommant db.js. Et on passe notre db au contexte de l'application de cette manière :
```javascript 
const  server = new  GraphQLServer({
	typeDefs:  './src/schema.graphql',
	resolvers,
	context: {
	  db:  db
	}
```

Ainsi, dans chacun des "resolver" il faut maintenant modifier la manière d'accéder aux données :

```javascript 
users(parent, args, ctx , info) {
  if(!args.query) {
    return ctx.db.users;
  }
    
  return ctx.db.users.filter((user) => {
    return user.name.toLowerCase().includes(args.query.toLowerCase())
  })
}
```

Ou bien en déstructurant l'objet  ctx pour prendre directement son attribut db.
```javascript 
users(parent, args, { db } , info) {
  if(!args.query) {
    return db.users;
  }
    
  return db.users.filter((user) => {
    return user.name.toLowerCase().includes(args.query.toLowerCase())
  })
}
```