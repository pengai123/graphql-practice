const express = require("express")
const app = express()
const cors = require("cors")
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require("./graphql/typeDefs.js")
const resolvers = require("./graphql/resolvers.js")
if (process.env.NODE_ENV === "development") {
	require("dotenv").config()
}
const PORT = process.env.PORT || 4000

console.log('process.env.NODE_ENV:', process.env.NODE_ENV)


app.use(cors())
const apolloServer = new ApolloServer({
	typeDefs,
	resolvers,
	introspection: true,
	playground: true
});

apolloServer.applyMiddleware({ app });


app.listen({ port: PORT }, () => console.log(`Server is listening on port ${PORT}, Graphql path: ${apolloServer.graphqlPath}`))
