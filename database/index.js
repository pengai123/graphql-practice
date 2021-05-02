const mongoose = require('mongoose');
if (process.env.NODE_ENV === "development") {
	require("dotenv").config()
}

mongoose.connect(process.env.mongodbAtlasUrl, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
})
.then(() => console.log('MongoDB is connected!'))
.catch(err => console.log('MongoDB connection error:', err))


const Book = mongoose.model('books', {
	id: {
		type: Number,
		required: true,
		unique: true
	},
	name: {
		type: String,
		required: true,
	},
	authorId: {
		type: Number,
		required: true
	}
})

const Author = mongoose.model('authors', {
	id: {
		type: Number,
		required: true,
		unique: true
	},
	name: {
		type: String,
		required: true
	}
})


const Account = mongoose.model("users", {
	username: {
		type: String,
		unique: true
	},
	email: String,
	password: String,
	createdAt: String
})

module.exports = { Book, Author, Account };