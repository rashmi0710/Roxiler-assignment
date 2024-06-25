const { addtransaction, deleteTransaction, transactions, statistics,barchart,piechart } = require('../controllers/Product-Transaction');


const router = require('express').Router();


router.post('/add-transaction', addtransaction)
        .get('/transaction',transactions)
        .get('/statistics ',statistics)
        .get('/barchart ',barchart)
        .get('/piechart ',piechart)
        .delete('/delete-income/:id', deleteTransaction)


module.exports = router