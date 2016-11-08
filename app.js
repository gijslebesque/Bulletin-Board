// Include neccesary libraries
const Sequelize 	= require ('sequelize')
const express 		= require ('express')
const fs 			= require('fs')
const bodyParser 	= require('body-parser')
const app 			= express()
const pg 			= require('pg')

	// declare variable that gives the location of postgres database
const db = new Sequelize ('postgres://' + process.env.POSTGRES_USER + ':' + process.env.POSTGRES_PASSWORD + '@localhost/bulletinboard')
// const connectionString = 'postgres://' + process.env.POSTGRES_USER + ':' + process.env.POSTGRES_PASSWORD + '@localhost/bulletinboard'

	//set body parser for reading user input
app.use(bodyParser.urlencoded({
	extended: true
}))

	// sequelize table creator
const Messages = db.define('messages', {
	title: 	Sequelize.STRING,
	body: 	Sequelize.STRING
} )

	
app.post('/', (req, res) => {
	//sync with db
	db.sync().then(()=>{ // with {force:true}, clear database
		console.log('Synced with db')
		Messages.create({
			title: req.body.title,
			body: req.body.body
		}).then(message => {
			console.log('saved message in database')
		}).then( ()=>{
			res.redirect('/messages')
		})
	})
	
})

	//set view engines and static
app.set('view engine', 'pug')
app.set('views', __dirname + '/views')
app.use(express.static('views'))


	//set main webpage
app.get('/', (req, res) => {
	res.render('index')
})

app.get('/messages', (req, res) =>{
	Messages.findAll().then(result =>{
		console.log(result[0].dataValues)
		res.render('messages', {users: result})
	})
})

// 	//how to deal with post request.
// app.post('/', (req, res) => {
// 	//connects to a database
// 	pg.connect(connectionString, (err, client, done) =>{
// 		if (err) throw err
// 		// makes a query insert request to postgres on earlier defined location (see const connectionString)
// 		client.query(`insert into messages 
// 			(title, body) 
// 			values 
// 			($1, $2)`, [req.body.title, req.body.body], function(err, result) {
// 	    		//insert into table, define colums (title and body) then give values: $1 and $2 refer to the array that comes after. Other notation possible: `values ('` + req.body.title + `')
// 	    		if (err) throw err
// 	    		//done closes client, pg.end closes connection with database
// 	   			 done()
// 	    		pg.end()
// 			})
// 	//redirect user to /messages
// 	res.redirect('/messages')
// 	})
// })

// //set page /messages
// app.get('/messages', (req, res) => {
// 	//connect to database
// 	pg.connect(connectionString, (err, client, done) =>{
// 		if (err) throw err
// 		//make query request to postgress that selects all data and give to callback (result)
// 		client.query(`select * from messages`, (err, result) => {
// 			if (err) throw err
// 			//render messages.pug and give along object of database. Why result.rows? result is all info from database (so a lot of extra shit), rows is the user data you need. 
// 			res.render('messages', {users: result.rows})
// 		})
// 	})
// })

// make app listen to port 8000
app.listen(8000,() =>{
	console.log("Server running")
})