const express = require("express")
const app = express()
const cors = require("cors")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
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
const PORT = process.env.PORT || 4000
const { Book, Author, Account } = require("./database/index.js")

app.use(cors())
console.log('process.env.NODE_ENV:', process.env.NODE_ENV)

app.get("/hello", (req, res) => res.send("Hello from server!"))


// Account.create({
//   username: 'user333',
//   email: 'email111',
//   password: '$2a$12$Ezr.VG9efL2yfKI68Vta/uyPGqZ19z1zIfprSd36zv/M448td6mIu',
//   createdAt: '2021-05-02T08:34:44.996Z'
// })
// .then(result => console.log('result:', result))
// .catch(err => console.log('err:', err))

const UserType = new GraphQLObjectType({
	name: "User",
	description: 'This represents a user',
	fields: () => ({
		id: { type: GraphQLNonNull(GraphQLString) },
		username: { type: GraphQLNonNull(GraphQLString) },
		email: { type: GraphQLNonNull(GraphQLString) },
		createdAt: { type: GraphQLNonNull(GraphQLString) },
		token: { type: GraphQLNonNull(GraphQLString) }
	})
})

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
		},
		addUser: {
			type: UserType,
			description: 'Create an account',
			args: {
				username: { type: GraphQLNonNull(GraphQLString) },
				email: { type: GraphQLNonNull(GraphQLString) },
				password: { type: GraphQLNonNull(GraphQLString) }
			},
			resolve: async (parent, args) => {
				try {
					let currentTime = new Date().toISOString()
					let password = await bcrypt.hash(args.username, 12)
					let userObj = {
						username: args.username,
						email: args.email,
						password: password,
						createdAt: currentTime
					}
					console.log('userObj:', userObj)
					let { _id, username, email, createdAt } = await Account.create(userObj)
					let token = jwt.sign({id: _id, username, email, createdAt}, "aasgdyuasdjkansdahsdk")
					return {id: _id, username, email, createdAt, token}
				} catch (err) {
					throw new Error("duplicated username");
				}
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
