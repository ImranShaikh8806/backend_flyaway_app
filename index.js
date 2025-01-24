const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()

const { userRouter} = require("./routes/user")
const {adminRouter} = require("./routes/admin")
const {flightRouter} = require('./routes/flights')
const {hotelRouter} = require("./routes/hotels")
const app = express()
app.use(express.json())
app.use(cors())

app.use("/user", userRouter);
app.use("/admin",adminRouter)
app.use("/flight",flightRouter)
app.use("/hotels",hotelRouter)

async function main(){
    await  mongoose.connect(process.env.MONGO_URL)

    const port = process.env.port || 3000

    app.listen(port,()=>{
        console.log(port,process.env.MONGO_URL);
    })
}

main()

