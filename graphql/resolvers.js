
const { Book, Author, Account } = require("../database/index.js")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

const resolvers = {
	Author: {
		books: async (author, args, context, info) => {
			try {
				return Book.find({ authorId: author.id })
			} catch (err) {
				throw new Error(err)
			}
		}
	},
	Book: {
		author: async (book, args, context, info) => {
			try {
				return Author.findOne({ id: book.authorId })
			} catch (err) {
				throw new Error(err)
			}
		}
	},
	Query: {
		books: async (_, args, { res }, info) => {
			try {
				return Book.find()
			} catch (err) {
				throw new Error(err)
			}
		},
		book: async (parent, { id }, context, info) => {
			try {
				return Book.findOne({ id: id })
			} catch (err) {
				throw new Error(err)
			}
		}
	},
	Mutation: {
		createAccount: async (parent, args, context, info) => {
			try {

				let currentTime = new Date().toISOString()
				let password = await bcrypt.hash(args.password, 12)
				let userObj = { username: args.username, email: args.email, password, createdAt: currentTime }
				console.log('userObj:', userObj)
				let { _id, username, email, createdAt } = await Account.create(userObj)
				let token = jwt.sign({ id: _id, username, email, createdAt }, "aasgdyuasdjkansdahsdk")
				return { id: _id, username, email, createdAt, token }
			} catch (err) {
				throw new Error(err);
			}
		},
		addBook: async (parent, { name, authorId }, context, info) => {
			try {
				let books = await Book.find();
				let id = books.length + 1;
				return Book.create({ id, name, authorId })
			} catch (err) {
				throw new Error(err)
			}
		}
	}
};

module.exports = resolvers