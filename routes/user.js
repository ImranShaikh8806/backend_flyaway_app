const {Router} = require("express")
const {userModel, flightModel, exploreModel, purchaseFlightModel, purchaseHotelModel, hotelModel} = require("../db")
const jwt = require("jsonwebtoken")
const  JWT_USER_PASSWORD = process.env.JWT_USER_PASSWORD 
const bcrypt = require("bcrypt")
const {userMiddleware} = require("../middlewares/userMidd")
const {z} = require("zod")
const { flightRouter } = require("./flights")


const userRouter = Router()


userRouter.post("/signup", async function(req,res){
    try {
        const {email, password, firstName, lastName} = req.body

        const requiredUser = z.object({
            email: z.string(),
            password: z.string(),
            firstName: z.string(),
            lastName: z.string(),
        })

        requiredUser.parse({email,password,firstName,lastName})

        const hashedPassword = await bcrypt.hash(password,5)

        const newUser = await userModel.create({
            email,
            password:hashedPassword,
            firstName,
            lastName
        })

        const token = jwt.sign({
            id: newUser._id
        },JWT_USER_PASSWORD)

        res.json({
            token:token,
            msg:"signup succeded"
        })
    }catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                message: "Validation failed",
                errors: error.errors.map(err => ({
                    path: err.path,
                    message: err.message
                })),
            });
        }
     }
})


userRouter.post("/signin",async function(req, res) {
    const { email, password} = req.body;

    const user = await userModel.findOne({
        email: email
        
    }); 

    if (user && await bcrypt.compare(password, user.password)){
        const token = jwt.sign({
            id: user._id,
        }, JWT_USER_PASSWORD);
        res.json({
            token: token,
            userName:user.firstName
        })
    }else {
            res.status(403).json({
                message: "Incorrect credentials"
            })
          }
})


userRouter.get("/bookedFlights", userMiddleware, async function(req, res) {
        const userId = req.userId
        const books = await purchaseFlightModel.find({
            userId
        })

        let bookedFlights = []

        for (let i = 0; i < books.length; i++) {
            bookedFlights.push(books[i].flightId)
        }

        const flightData = await flightModel.find({
            _id : {$in: bookedFlights}
        })

        res.json({
            bookedFlights,
            flightData
        })
})


userRouter.get("/bookedHotels", userMiddleware, async function(req,res){
    const userId = req.userId
    const books = await purchaseHotelModel.find({
        userId
    })

    let bookedHotels = []

    for (let i = 0; i < books.length; i++) {
        bookedHotels.push(books[i].hotelId)
    }

    const hotelData = await hotelModel.find({
        _id : {$in: bookedHotels}
    })

    res.json({
        
        bookedHotels,
        hotelData
    })
})


userRouter.get("/profile",userMiddleware,async function(req,res){
    const userId = req.userId

    const userProfile =await userModel.findById(userId)


    res.json({ 
        userProfile
    })
})

module.exports = {
    userRouter:userRouter
}