const express = require("express")
const app = express()
const { graphqlHTTP } = require('express-graphql')
const {
	GraphQLSchema,
	GraphQLObjectType,
	GraphQLString,
	GraphQLList,
	GraphQLInt,
	GraphQLNonNull
} = require('graphql')
if (process.env.NODE_ENV === "development") {
	require("dotenv").config()
}
const PORT = process.env.PORT || 3000
const { Book, Author } = require("./database/index.js")


console.log('process.env.NODE_ENV:', process.env.NODE_ENV)

app.get("/hello", (req, res) => res.send("Hello from server!"))

const BookType = new GraphQLObjectType({
	name: 'Book',
	description: 'This represents a book written by an author',
	fields: () => ({
		id: { type: GraphQLNonNull(GraphQLInt) },
		name: { type: GraphQLNonNull(GraphQLString) },
		authorId: { type: GraphQLNonNull(GraphQLInt) },
		author: {
			type: AuthorType,
			resolve: (book, args) => {
				return Author.findOne({ id: book.authorId })
			}
		}
	})
})

const AuthorType = new GraphQLObjectType({
	name: 'Author',
	description: 'This represents a author of a book',
	fields: () => ({
		id: { type: GraphQLNonNull(GraphQLInt) },
		name: { type: GraphQLNonNull(GraphQLString) },
		books: {
			type: new GraphQLList(BookType),
			resolve: (author) => {
				return Book.find({ authorId: author.id })
			}
		}
	})
})

const RootQueryType = new GraphQLObjectType({
	name: 'Query',
	description: 'Root Query',
	fields: () => ({
		book: {
			type: BookType,
			description: 'A Single Book',
			args: {
				id: { type: GraphQLInt }
			},
			resolve: (parent, args) => Book.findOne({ id: args.id })
		},
		books: {
			type: new GraphQLList(BookType),
			description: 'List of All Books',
			resolve: () => Book.find()
		},
		authors: {
			type: new GraphQLList(AuthorType),
			description: 'List of All Authors',
			resolve: () => Author.find()
		},
		author: {
			type: AuthorType,
			description: 'A Single Author',
			args: {
				id: { type: GraphQLInt }
			},
			resolve: (parent, args) => Author.findOne({ id: args.id })
		}
	})
})

const RootMutationType = new GraphQLObjectType({
	name: 'Mutation',
	description: 'Root Mutation',
	fields: () => ({
		addBook: {
			type: BookType,
			description: 'Add a book',
			args: {
				name: { type: GraphQLNonNull(GraphQLString) },
				authorId: { type: GraphQLNonNull(GraphQLInt) }
			},
			resolve: async (parent, args) => {
				let books = await Book.find();
				return Book.create({ id: books.length + 1, name: args.name, authorId: args.authorId })
			}
		},
		addAuthor: {
			type: AuthorType,
			description: 'Add an author',
			args: {
				name: { type: GraphQLNonNull(GraphQLString) }
			},
			resolve: async (parent, args) => {
				let authors = await Author.find();
				return Author.create({ id: authors.length + 1, name: args.name })
			}
		}
	})
})

const schema = new GraphQLSchema({
	query: RootQueryType,
	mutation: RootMutationType
})

app.use('/graphql', graphqlHTTP({
	schema: schema,
	graphiql: true
}))

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`))
