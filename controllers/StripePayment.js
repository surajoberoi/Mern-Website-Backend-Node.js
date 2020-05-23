require('dotenv').config()

const stripe = require("stripe")(process.env.SecretKey)
const uuid = require("uuid")


exports.makePayment = (req,res) => {
    const {products, token} = req.body
    console.log("PRODUCTS",products)
    console.log("TOKEN",token)

    let amount = 0;         //amount is given by products
    products.map(p=>{
        amount = amount + p.price;
    })


    const idempotencyKey = uuid.v4()
   // console.log("check")
    //create a customer
    return stripe.customers.create({
        
        email: token.email,     // retrieving customer email and source(id)
        source: token.id
    }).then(customer =>{        // if customer is created succesfully
        stripe.charges.create({
            amount:amount * 100,
            currency:"usd",
            customer:customer.id,
            receipt_email: token.email,
            description: `Purchase of product.name`,
            shipping: {
                name:token.card.name,
                address:{
                    line1:token.card.address_line1,
                    line2:token.card.address_line2,
                    city:token.card.address_city,
                    country:token.card.address_country,
                    postal_code:token.card.address_zip
                }
            }
        },{idempotencyKey})
    
        .then(result=>res.status(200).json(result))
         .catch(err=>console.log(err))
    })
}