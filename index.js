const express = require("express")
const db = require('./models')
const cors = require('cors')
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload')
const app = express()
const verify = require('./utils/jwt')

// setting up cors
// app.use(cors(
//     {
//         methods: ['GET', 'POST', 'PATCH', 'DELETE'],
//         origin: 'http://localhost:3000',
//     }
// ))
var allowedOrigins = ['https://jars-cellular.netlify.app','localhost/'];
app.use(cors(
    {
        methods: ['GET', 'POST', 'PATCH', 'DELETE'],
        origin: function(origin, callback){
            // allow requests with no origin 
            // (like mobile apps or curl requests)
            if(!origin) return callback(null, true);
            if(allowedOrigins.indexOf(origin) === -1){
              var msg = 'The CORS policy for this site does not ' +
                        'allow access from the specified Origin.';
              return callback(new Error(msg), false);
            }
            return callback(null, true);}
       
    }
));

app.use(bodyParser.json());
app.use(fileUpload());

// Routes For Server
const ProductRoute = require("./routes/ProductRoute")
const CustomerRoute = require("./routes/CustomerRoute")
const SalesRoute = require("./routes/SalesRoute")
const StoreRoute = require("./routes/StoreRoute")
const SupplierRoute = require("./routes/SupplierRoute")
const TransactionRoute = require("./routes/TransactionRoute")
const UserRoute = require("./routes/UserRoute")
const AuditTrailRoute = require('./routes/AuditTrail')
const DashBoardRoute = require('./routes/DashBoardRoute')
const Auth = require('./routes/Authentication')

// route implementation
app.use('/product',verify, ProductRoute)
app.use('/user',verify, UserRoute)
app.use('/transaction',verify, TransactionRoute)
app.use('/supplier', verify,SupplierRoute)
app.use('/store', verify,StoreRoute)
app.use('/sales',verify, SalesRoute)
app.use('/customer',verify, CustomerRoute)
app.use('/audit',verify, AuditTrailRoute)
app.use('/dashboard',verify, DashBoardRoute)
app.use('/', Auth)

app.post('/upload', async (req, res) => {

    if (req.files === null) {
        return res.status(400).json({msg: 'No file Uploaded'})
    }

    const file = req.files.picture

    file.mv(`${__dirname}/uploads/image/${file.name}`, err => {
        if (err) {
            console.log(err)
            return res.status(500).send(err)
        }
    })


    res.send(`Hello World`)
})

db.sequelize.sync().then((req) => {
    app.listen(process.env.PORT || 3001, () => {
         console.log("Server running");
     })
 }) 