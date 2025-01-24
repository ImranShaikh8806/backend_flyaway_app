const mongoose = require("mongoose")
const Schema = mongoose.Schema
const { ObjectId } = mongoose.Schema.Types;


const userSchema =new Schema({
    email:{type:String,unique:true},
    password:String,
    firstName:String,
    lastName:String
})

const adminSchema =new Schema({
    email:{type:String},
    password:String,
    firstName:String,
    lastName:String
})

const flightSchema = new Schema({
    from: String,
    to: String,
    date: Date,
    passengers: Number,
    price: Number,
    creatorId:ObjectId
})

const hotelSchema = new Schema({
    city: String,
    date: Date,
    guests: Number,
    creatorId: ObjectId
})

const exploreSchema = new Schema({
    country:String,
    city: String
})

const purchaseFlightSchema = new Schema({
    userId:ObjectId,
    flightId:ObjectId
})

const purchaseHotelSchema = new Schema({
    userId: ObjectId,
    hotelId: ObjectId
})

const userModel = mongoose.model("user", userSchema)
const adminModel = mongoose.model("admin", adminSchema)
const flightModel = mongoose.model("flight", flightSchema)
const exploreModel = mongoose.model("explore", exploreSchema)
const hotelModel = mongoose.model("hotel", hotelSchema)
const purchaseFlightModel = mongoose.model("purchaseFlight", purchaseFlightSchema)
const purchaseHotelModel = mongoose.model("purchaseHotel", purchaseHotelSchema)

module.exports = {
    userModel,
    adminModel,
    flightModel,
    exploreModel,
    hotelModel, 
    purchaseFlightModel,
    purchaseHotelModel
}