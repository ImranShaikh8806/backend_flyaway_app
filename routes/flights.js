const {Router} = require("express")
const {userMiddleware} = require("../middlewares/userMidd")
const {flightModel, purchaseFlightModel} = require("../db")

const flightRouter = Router()

flightRouter.post("/book", userMiddleware, async function(req, res){
        const userId = req.userId
        const flightId = req.body.flightId

        await purchaseFlightModel.create({
            userId,
            flightId
        })

        res.json({
            msg:"you have succesffully booked this flight"
        })
})


flightRouter.get("/preview", async function(req, res){
        const {from,to} = req.query
        let query = {}
        if(from) query.from = from
        if(to) query.to = to
    console.log(query);
    
        const flights = await flightModel.find(query)   

        res.json({
            flights
        })
})


module.exports = {
    flightRouter: flightRouter
}