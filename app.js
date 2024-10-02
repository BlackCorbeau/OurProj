import 'dotenv/config'
import express from 'express'
import morgan from 'morgan'
import methodOverride  from "method-override"

const app = express()

app.set("view engine", "ejs")

app.listen(3000, (err) => {
    err ? console.log(err) : console.log("Listenning port 3000, we are online.")
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))

app.use(express.static('styles'))

app.use(express.urlencoded({ extends: false }))

app.use(methodOverride('_method'))

app.get('/', (req, res) => {
    const title = "Home Page"
    res.send({authors: "Remizov Kirill, Kaur Aleksandr, Trofimov Nikita", text: "This is our project for Hacaton In Nijniy Novgorod 2024."})
})