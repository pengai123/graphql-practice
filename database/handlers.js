const { Book, Author } = require("./index.js")

const findAuthor = (obj, cb = () => { }) => {
	Author.findOne(obj)
		.then(result => cb(null, result))
		.catch(err => cb(err))
}


const findAllAuthors = (cb = () => { }) => {
	Author.find()
		.then(result => cb(null, result))
		.catch(err => cb(err))
}

const findBook = (obj, cb = () => { }) => {
	Book.findOne(obj)
		.then(result => cb(null, result))
		.catch(err => cb(err))
}


const findAllBooks = (cb = () => { }) => {
	Book.find()
		.then(result => cb(null, result))
		.catch(err => cb(err))
}