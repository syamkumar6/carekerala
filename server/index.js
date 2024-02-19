const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose');
require('dotenv').config()
const cookieParser = require('cookie-parser')
const multer = require('multer');
const upload = multer({limits: {fileSize: 10 * 1024 * 1024,}});
const bodyParser = require('body-parser');

const Hospitalrouter = require("./Routes/Hospitalrouter")
const Usersrouter = require("./Routes/Userrouter")
const HospitalDashboardrouter = require("./Routes/HospitalDashboardrouter")
const Appointmentsrouter = require("./Routes/Appointmentsrouter")
const HealthSheetrouter = require("./Routes/HealthSheetrouter")
const Doctorrouter = require("./Routes/Doctorrouter")
const Reviewsrouter = require("./Routes/ReviewsRouter")


const app = express()
const port = process.env.PORT || 3000

app.use(cookieParser())
app.use(cors({
  origin: "https://carekerala-kerala.vercel.app",
  methods: ["POST", "GET", "DELETE",],
  credentials: true
}))
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(upload.single('image'));


app.use("/hospitals", Hospitalrouter)
app.use("/users", Usersrouter)
app.use("/hospitals/dashboard", HospitalDashboardrouter)
app.use("/appointments", Appointmentsrouter)
app.use("/h-sheet", HealthSheetrouter)
app.use("/doctors", Doctorrouter)
app.use("/reviews", Reviewsrouter)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

main().then(()=> console.log("db connected")).catch(err => console.log(err));

async function main() {
    const db_url = process.env.DB_URL
    const urlWithPassword = db_url.replace("<password>", process.env.DB_PASSWORD)
    await mongoose.connect(urlWithPassword,);
}
