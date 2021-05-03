const express = require("express")
const app = express()
const cors = require("cors")
const typeDefs = require("./graphql/typeDefs.js")
const resolvers = require("./graphql/resolvers.js")
const { graphqlHTTP } = require('express-graphql')
const { makeExecutableSchema } = require('graphql-tools');
if (process.env.NODE_ENV === "development") {
	require("dotenv").config()
}
const PORT = process.env.PORT || 4000


console.log('process.env.NODE_ENV:', process.env.NODE_ENV)
app.use(cors())
app.get("/hello", (req, res) => res.send("Hello from this specific server!"))


const executableSchema = makeExecutableSchema({ typeDefs, resolvers });

app.use('/graphql', graphqlHTTP({
	schema: executableSchema,
	graphiql: true
}))

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`))
