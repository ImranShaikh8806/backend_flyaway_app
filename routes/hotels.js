const {Router} = require("express")
const {userMiddleware} = require("../middlewares/userMidd")
const {hotelModel, purchaseHotelModel} = require("../db")

const hotelRouter = Router()

hotelRouter.post("/book", userMiddleware, async function(req,res){
    const userId = req.userId
    const hotelId = req.body.hotelId

    await purchaseHotelModel.create({
        userId,
        hotelId
    })

    res.json({
        msg:"hotel booking done"
    })
})


hotelRouter.get("/preview", async function(req,res){
    const {city} = req.query
    const query ={}
    if(query) query.city = city

    const hotels = await hotelModel.find(query)

    res.json({
        hotels
    })
})



module.exports = {
    hotelRouter:hotelRouter
}