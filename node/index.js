import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import { mockedDogs } from './mock.js'
import { graphqlSchema } from './schema.js'

// Lista e filtra os cachorros por dono
function listDogs(ownerFilter) {
  return mockedDogs.filter((dog) => {
    if (ownerFilter) {
      return dog.owner == ownerFilter
    }
    return true
  })
}

// Inicializa o express
const app = express()

// Rota para buscar os cachorros com filtro via api
app.get('/dogs', (request, response) => {
  response.json(listDogs(request.query.owner))
  response.status(200)
})

// Classe que irá buscar os cachorros para o graphql
const resolvers = {
  // Função que irá buscar os dados
  Query: {
    // Até 4 parâmetros
    dogs: (_, args) => listDogs(args.filters.owner)
  }
}

// Instancia o ApolloServer que irá gerenciar os dados
// typeDefs: Adiciona o esquema para consulta
// resolvers: Adiciona a query que permitirá a busca
const graphqlServer = new ApolloServer({
  typeDefs: graphqlSchema,
  resolvers
})

// Inicializa o servidor de GraphQl do ApolloServer
await graphqlServer.start()
graphqlServer.applyMiddleware({ app })

/*
// Via API
http://127.0.0.1/dogs?owner=Zenanzin

// Via GraphQl
query {
  dogs(filters: {owner: "Zenanzin"}) {
    name
    breed
    weight
    owner
  }
}
*/

//  sistema operacional           programa
// /-------î---------|---------------î---------------\
// PROTOCOL://IP:PORT/path/to/url?name=popoto&type=dog
app.listen(80, () => {
  console.log('Who let the dogs out?')
})
