
const { Book, Author, Account } = require("../database/index.js")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

const resolvers = {
	Author: {
		books: async (author, args, context) => {
			try {
				return Book.find({ authorId: author.id })
			} catch (err) {
				throw new Error(err)
			}
		}
	},
	Book: {
		author: async (book, args, context) => {
			try {
				return Author.findOne({ id: book.authorId })
			} catch (err) {
				throw new Error(err)
			}
		}
	},
	Query: {
		books: async (_, args, { res }) => {
			try {
				return Book.find()
			} catch (err) {
				throw new Error(err)
			}
		},
		book: async (_, { id }, context) => {
			try {
				return Book.findOne({ id: id })
			} catch (err) {
				throw new Error(err)
			}
		},
		authors: async (_, args, { req, res }) => {
			try {
				return Author.find()
			} catch (err) {
				throw new Error(err)
			}
		},
		author: async (_, { id }, context) => {
			try {
				return Author.findOne({ id: id })
			} catch (err) {
				throw new Error(err)
			}
		}
	},
	Mutation: {
		createAccount: async (_, args, { req, res }) => {
			try {
				let user = await Account.findOne({ username: args.username })
				if (user) { throw new Error("Username already exist!"); }
				let currentTime = new Date().toISOString()
				let password = await bcrypt.hash(args.password, 12)
				let newUser = { username: args.username, email: args.email, password, createdAt: currentTime }
				console.log('newUser:', newUser)
				let { _id, username, email, createdAt } = await Account.create(newUser)
				let token = jwt.sign({ id: _id, username, email, createdAt }, "aasgdyuasdjkansdahsdk")
				res.cookie("token", token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
				return { id: _id, username, email, createdAt, token }
			} catch (err) {
				throw new Error(err);
			}
		},
		logout: (_, args, { req, res }) => {
			res.clearCookie("token", { httpOnly: true })
			return { status: true }
		},
		login: async (_, args, { req, res }) => {
			try {
				let user = await Account.findOne({ username: args.username })
				if (!user) { throw new Error("Username doesn't exist!"); }
				let match = await bcrypt.compare(args.password, user.password)
				if (!match) { throw new Error("Invalid username/password combination!"); }
				console.log('user:', user)
				let token = jwt.sign({ id: user._id, username: user.username, email: user.email, createdAt: user.createdAt }, "aasgdyuasdjkansdahsdk")
				res.cookie("token", token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
				return ({ id: user._id, username: user.username, email: user.email, createdAt: user.createdAt, token })
			} catch (err) {
				throw new Error(err);
			}
		},
		addBook: async (_, { name, authorId }, context) => {
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