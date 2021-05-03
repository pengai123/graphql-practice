// const { gql } = require('apollo-server-express');   
const gql = require('graphql-tag');

const typeDefs = gql`
	type User {
		id: String!,
		username: String!,
		email: String!,
		createdAt: String!,
		token: String!
	}

	type Author{
		id: Int!,
		name: String!,
		books: [Book]
	}

	type Book{
		id: Int!,
		name: String!,
		authorId: Int!,
		author: Author
	}

	type Query{
		books: [Book]
		book(id: Int!): Book
		authors: [Author]
		author(id: Int!): Author
	}

	type Mutation{
		addAuthor(name: String!): Author
		addBook(name: String!, authorId: Int!): Book
		createAccount(username: String!, email: String!, password: String!): User
	}
`

module.exports = typeDefs