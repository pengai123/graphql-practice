const { Book, Author } = require("./index.js")

const findAuthor = (id, cb = () => { }) => {
	Author.findOne({ id })
		.then(result => cb(null, result))
		.catch(err => cb(err))
}


const findAllAuthors = (cb = () => { }) => {
	Author.find()
		.then(result => cb(null, result))
		.catch(err => cb(err))
}

const findBook = (id, cb = () => { }) => {
	Book.findOne({ id })
		.then(result => cb(null, result))
		.catch(err => cb(err))
}


const findAllBooks = (cb = () => { }) => {
	Book.find()
		.then(result => cb(null, result))
		.catch(err => cb(err))
}