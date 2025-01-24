const {Router} = require("express")
const {adminModel, flightModel, hotelModel} = require("../db")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const JWT_ADMIN_PASSWORD = process.env.JWT_ADMIN_PASSWORD
const {adminMiddleware} = require("../middlewares/adminMidd")
const {z} = require("zod") 


const adminRouter = Router()


adminRouter.post("/signup", async function(req, res){
    try {
        const {email, password, firstName, lastName} = req.body

        const requiredAdmin = z.object({
            email: z.string(),
            password: z.string(),
            firstName: z.string(),
            lastName: z.string(),
        })
    
        requiredAdmin.parse({email,password,firstName,lastName})
    
        const hashedPass = await bcrypt.hash(password,5)
    
        const newAdmin = await adminModel.create({
            email: email,
            password: hashedPass,
            firstName: firstName, 
            lastName: lastName
        })

        const token = jwt.sign({
            id: newAdmin._id
        },JWT_ADMIN_PASSWORD)

        res.json({
            token:token,
             message: "Signup succeeded"
        })
      
    } catch (error) {
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


adminRouter.post("/signin", async function(req, res){
        const { email, password} = req.body;

        const admin = await adminModel.findOne({
        email: email,  
    });

    if (admin && await bcrypt.compare(password,admin.password)) {
        const token = jwt.sign({
            id: admin._id
        }, JWT_ADMIN_PASSWORD);

          res.json({
            token: token
        })
    } else {
        res.status(403).json({
            message: "Incorrect credentials"
        })}

})


adminRouter.post("/flights", adminMiddleware,async function(req,res){
        const adminId = req.userId
        const {from,to,date,passengers,price} = req.body

        const flight = await flightModel.create({
            from: from,
            to: to,
            date: date,
            passengers: passengers,
            price: price,
            creatorId: adminId
        })

        res.json({
            msg: "course created",
            flightId: flight._id ,
            adminId: adminId
        })
})


adminRouter.put("/flights",adminMiddleware, async function(req, res){
        const adminId = req.adminId

        const {from,to,date,passengers,price} = req.body
        
        const flights = await flightModel.updateOne({
            _id: flightId,
            creatorId: adminId
        }, {
            from: from,
            to: to,
            date: date,
            passengers: passengers,
            price: price,
        })

        res.json({
            msg: "flight created",
            flightId: flights._id
        })
})


adminRouter.get("/flights/bulk", adminMiddleware, async function(req, res){
        const adminId = req.userId

        const flights = await flightModel.find({
            creatorId: adminId
        })

        res.json({
            msg: "flights created by you",
            flights
        })
})


adminRouter.post("/hotels", adminMiddleware, async function(req,res) {
    const adminId = req.userId
    const {city, date, guests} = req.body

    const hotels = await hotelModel.create({
        city: city,
        date: date,
        guests: guests,
        creatorId: adminId
    })

    res.json({
        msg:"hotel is created",
        hotels,
        id:hotels.creatorId
    })

})


adminRouter.get("/hotels/bulk", adminMiddleware,async function(req, res){
    const adminId = req.userId
    const hotels = await hotelModel.find({
        creatorId: adminId
    })

    res.json({
        msg:"hotels created by you",
        hotels
    })
})


module.exports = {
    adminRouter: adminRouter
}