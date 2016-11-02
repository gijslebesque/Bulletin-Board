const express 		= require ('express')
const fs 			= require('fs')
const bodyParser 	= require('body-parser')
const app 			= express()
const pg 			= require('pg')

app.set('view engine', 'pug')
app.set('views', __dirname + '/views')
app.use(express.static('views'))

app.use(bodyParser.urlencoded({
	extended: true
}))

app.get('/', (req, res) => {
	res.render('index')
})

app.post('/', (req, res) => {
	
})



// make app listen to port 8000
app.listen(8000,() =>{
	console.log("Server running")
})