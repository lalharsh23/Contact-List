const express = require('express');
const path = require('path');
const port = 8000;

const db = require('./config/mongoose');
const Contact = require('./models/contact');
const { log } = require('console');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use (express.urlencoded());
app.use(express.static('assets'));

// middleware 1
// app.use(function (req, res, next){
//     req.myName="harsh";
//     // console.log('middleware 1 called');
//     next();
// });

// middleware 2
// app.use(function(req, res, next){
//     console.log('My name from MW2', req.myName);
//     // console.log('middleware 2 called');
//     next();
// });

var contactList = [
    {
        name: "Aman",
        phone: "7348343872"
    },
    {
        name: "Harsh",
        phone: "8737774819"
    },
    {
        name: "Rahul",
        phone: "9874983264"
    }
]


app.get('/', async function (req, res) {
    try {
        const contacts = await Contact.find({}).exec();

        return res.render('home', {
            title: "Contact list", 
            contact_list: contacts
        });
    } catch (err) {
        console.error('Error in fetching contacts from db:', err);
        return res.status(500).send('Error fetching contacts');
    }
});


app.get('/practice', function(req, res){
    return res.render('practice',{
        title: "Let us play with ejs"
    });
});


app.post('/create-contact', async function (req, res) {
    try {
        // Check if required fields are present in the request body
        if (!req.body.name || !req.body.phone) {
            return res.status(400).send('Both name and phone are required.');
        }

        // Create the contact
        const newContact = await Contact.create({
            name: req.body.name,
            phone: req.body.phone
        });

        console.log('******', newContact);
        return res.redirect('back');
    } catch (err) {
        console.error('Error in creating a contact:', err);
        return res.status(500).send('Error creating a contact');
    }
});


   
app.get('/delete-contact', async function (req, res) {
    try {
        // Get the query from the URL
        let id = req.query.id;

        // Find the contact in the database using the id and delete
        await Contact.findByIdAndDelete(id);

        return res.redirect('back');
    } catch (err) {
        console.error('Error in deleting an object from the database:', err);
        return res.status(500).send('Error deleting contact');
    }
});



app.listen(port, function(err){
    if(err){console.log('Error in running the server', err);}
    console.log('Yup! My server is runinng on port:', port );
});