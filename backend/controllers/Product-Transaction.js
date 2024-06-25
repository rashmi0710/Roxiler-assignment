const ProductTransactionSchema = require("../model/ProductTransaction")

exports.addtransaction = async (req, res) =>{
    const {id, title, price, description , category, image, sold, dateOfSale} = req.body

    const transaction = ProductTransactionSchema({
        id, title, description, price, category, image, sold, dateOfSale
    })
    try {
        //validations
        if(!id || !title || !price || !description || !category || !image || !sold || !dateOfSale){
            return res.status(400).json({message: 'All fields are required!'})
        }
        if(price <= 0 || !price === 'number'){
            return res.status(400).json({message: 'Amount must be a positive number!'})
        }
        await transaction.save()
        res.status(200).json({message: 'Trasaction Added'})
    } catch (error) {
        res.status(500).json({message: 'Server Error'})
    }

    console.log(transaction)
}

exports.deleteTransaction = async (req, res) => {
    const { id } = req.params;

    try {
        const transaction = await ProductTransactionSchema.findOneAndDelete({ id: id });

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.transactions = async (req, res) => {
    const { page = 1, perPage = 10, search = '' } = req.query;

    // Building the search query
    let searchQuery = {};

    if (search) {
        searchQuery = {
            $or: [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ]
        };

        // If search can be converted to a number, add a price query
        const searchNumber = Number(search);
        if (!isNaN(searchNumber)) {
            searchQuery.$or.push({ price: searchNumber });
        }
    }

    try {
        const transactions = await ProductTransactionSchema.find(searchQuery)
            .skip((page - 1) * perPage)
            .limit(Number(perPage));
        
        const total = await ProductTransactionSchema.countDocuments(searchQuery);
        
        res.json({ transactions, total, page, perPage });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


exports.statistics =  async (req, res) => {
    const map1 = new Map();
    map1.set("January", "01");
    map1.set("February", "02");
    map1.set("March", "03");
    map1.set("April", "04");
    map1.set("May", "05");
    map1.set("June", "06");
    map1.set("July", "07");
    map1.set("August", "08");
    map1.set("September", "09");
    map1.set("October", "10");
    map1.set("November", "11");
    map1.set("December", "12");
    
    const search = req.query.keyword;
    
    if (!search || !map1.has(search)) {
        return res.status(400).send('Invalid month keyword');
    }

    let sales = 0,
        soldItems = 0,
        totalItems = 0;
    
    const data = req.app.locals.data; // Access data from app.locals
    
    for (let i = 0; i < data.length; i++) {
        const originalString = data[i].dateOfSale;
        const sold = data[i].sold;
        
        const text = originalString.substring(5, 7);
        if (text === map1.get(search)) {
            sales += data[i].price;
            totalItems += 1;
            if (sold) {
                soldItems += 1;
            }
        }
    }

    res.send(`The Total Sale in this month: ${sales}, The Total Number of Sales in this month: ${soldItems}, Total number of not sold items of selected month: ${totalItems - soldItems}`);
};

exports.barchart = async (req, res) => {
    const { month } = req.query;

    try {
        const start = new Date(`${month}-01`);
        const end = new Date(start.getFullYear(), start.getMonth() + 1, 1);

        const barChartData = await ProductTransactionSchema.aggregate([
            {
                $addFields: {
                    dateOfSaleConverted: {
                        $dateFromString: {
                            dateString: "$dateOfSale",
                            format: "%Y-%m-%dT%H:%M:%S%z"
                        }
                    }
                }
            },
            {
                $match: {
                    dateOfSaleConverted: { $gte: start, $lt: end }
                }
            },
            {
                $bucket: {
                    groupBy: "$price",
                    boundaries: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, Infinity],
                    default: "901-above",
                    output: {
                        count: { $sum: 1 }
                    }
                }
            }
        ]);

        res.json(barChartData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.piechart= async (req, res) => {
    const { month } = req.query;

    try {
        const start = new Date(`${month}-01`);
        const end = new Date(start.getFullYear(), start.getMonth() + 1, 1);

        const pieChartData = await ProductTransactionSchema.aggregate([
            {
                $addFields: {
                    dateOfSaleConverted: {
                        $dateFromString: {
                            dateString: "$dateOfSale",
                            format: "%Y-%m-%dT%H:%M:%S%z"
                        }
                    }
                }
            },
            {
                $match: {
                    dateOfSaleConverted: { $gte: start, $lt: end }
                }
            },
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json(pieChartData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


