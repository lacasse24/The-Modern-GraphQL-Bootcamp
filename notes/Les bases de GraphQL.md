### Qu'est-ce que GraphQL ?
- C'est une spécification et non une implémentation
- La spécification exprime comment créer une l'implémentation du "query language" selon l'idéologie GraphQL. D'où le QL de GraphQL.
- Il existe de multiples implémentations de GraphQL, il suffit d'aller sur le site officiel et cliquer sur votre langage de prédilection.

### Serait-il possible d'avoir un exemple d'implémentation en JS ?
- Certainement, en JavaScript, il existe Apollo Server, Express GraphQL, GrapQL Yoga, GraphQl Js ...
		- aha
- Nous allons utiliser GraphQL Yoga.

### Quelles sont la différences majeures avec une API REST ?
- Une API GraphQL va normalement exposer une seule route, donc un seul "endpoint". Tandis qu'une API REST expose généralement plusieurs routes.
- Avec GraphQL, **le client dicte au serveur ce qu'il veut comme données**. Tandis qu'avec une API REST, **c'est le serveur qui dicte ce qu'il va retourner** selon le endpoint.

### Pourquoi utiliser GraphQL ?
- C'est rapide ! Peu importe le scénario, on peut aller chercher tout le data qu'on a besoin en une seule requête ! Donc, on diminue notre nombre de requêtes HTTP. Bien entendu, ce n'est pas vrai dans tous les cas ! Si on avait seulement une requête HTTP à faire dans un service 'x', on ne peut pas diminuer le nombre de requêtes.
- C'est flexible ! Le client va spécifier exactement ce qu'il veut recevoir et n'en recevra pas davantage. Donc, on n'a pas à trainer de données inutiles.
- Toute API GraphQL est auto-documenté. Pas besoin de se casser la tête avec OpenAPI.

### J'aime bien l'idée ! Ça vient de où ?
- Comme bien des technologies émergeantes, GraphQL vient de chez Facebook. Bien entendu, seulement la spécification provient de Facebook, donc toute implémentation est indépendante de ladite compagnie.
- Un groupe d'ingénieur avait comme mandat d'optimiser la vitesse de l'application mobile. Ils se sont rendu compte que la version mobile ne nécessitait pas exactement le même data (pas exactement les mêmes besoins) que l'application web. Ainsi, le but ultime était que chacun des clients puissent obtenir exactement les données dont il a besoin, ni plus, ni moins.

### Comment est-ce que je devrais visualiser mes tables ?
- Personnellement, je visualise ça sous forme d'un diagramme de classes UML.

### Qu'est-ce qu'un serveur GraphQL nécessite ?
- Le schéma de l'application, donc la liste des requêtes possibles et leur définition (retour, entrée).
- La liste des "resolvers". Un "resolver" permet à GraphQL de servir correctement le data au client selon la requête.
- Donc, le schéma est un peu comme la définition des routes et le resolver c'est un peu comme un handler qui retourne un data 'x' selon un appel 'y'.

### Quelles sont les 5 types principaux avec GraphQL ?
- String
- Boolean
- Int
- Float
- ID

### Comment passer du data du client vers le serveur GraphQL ?
- Par le biais d'arguments qu'on va ajouter à notre schéma et en utilisant ceux-ci, s'ils sont définis, dans le "resolver" approprié.

### Est-ce qu'il serait possible d'avoir un exemple pour rendre ça plus concret ?

Voici la définition du schéma  :
```javascript
const  typeDefs = `
type Query {
	greeting(name: String!): String!
}`
```
Voici le resolver associé  : 
```javascript
const  resolvers = {
	Query: {
		greeting(parent, args, ctx, info) {
			return  `Hello ${args.name}`
		}
	}
}
```

### Est-ce qu'on doit définir chacun des paramètres de la fonction greeting pour chaque "resolver" ?
- C'est une bonne pratique. Par contre, ce n'est pas nécessaire. 
- Bien entendu, si on veut utiliser args, on doit aussi définir le paramètre parent. Par contre, il n'est pas nécessaire de définir ctx (contexte) et info.