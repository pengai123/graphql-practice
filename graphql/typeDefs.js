const { gql } = require('apollo-server-express');

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
		getBooks: [Book]
		getBookById(id: Int!): Book
	}

	type Mutation{
		addAuthor(name: String!): Author
		addBook(name: String!, authorId: Int!): Book
		createAccount(username: String!, email: String!, password: String!): User
	}
`


module.exports = typeDefs