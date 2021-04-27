const express = require('express')
let router = express.Router()
const {Sales, Product, Transaction} = require('../models')

router.get('/insert', async (req, res) => {

    const sales = await Sales.create({
        id: 1,
        qty: 10,
        total: 20,
        ProductId: 6,
        TransactionId: 1
    }).catch(err => {
        res.send(err)
    })

    res.send(sales)
})

router.get('/list', (req, res) => {
    Sales.findAll({
        include: [
            {model: Product},
            {model: Transaction}
        ]
    }).then((supplier) => {
        res.send(supplier)
    }).catch((error) => {
        console.log(error);
    })
})


router.get('/delete', (req, res) => {
    sales.destroy({where: {id: 1}})
    res.send()
})


module.exports = router