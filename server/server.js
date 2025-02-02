const express=require("express");
const db=require("./config/db");
const userRoute=require("./routes/userRoutes");
const reviewRoute=require("./routes/reviewRoutes");
const cors=require('cors');
const errorMiddleware = require("./middlewares/error-middleware");
const bookingRouter=require("./routes/bookingRoutes");
const reportRouter=require("./routes/reportRoutes");
const bookingController = require("./controller/bookingController");

require("dotenv").config();

const app=express();
// Enable CORS for localhost:8000
app.use(cors({
    origin: '*',
}));


db();

app.post(
    "/api/v1/booking/webhook",
    express.raw({ type: "application/json" }),
    bookingController.webhook
  );

app.use(express.json());

app.use("/api/v1/user",userRoute);
app.use("/api/v1/review",reviewRoute);
app.use("/api/v1/booking",bookingRouter);
app.use("/api/v1/report",reportRouter);

app.get("/",(req,res)=>{
    res.send("Working");
});
app.use(errorMiddleware);
app.listen(process.env.PORT,()=>{
    console.log(`App is listening at port ${process.env.PORT}`);
})