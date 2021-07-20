import mongoose from "mongoose";

mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useFindAndModify : false,
    useCreateIndex : true,
});

const db = mongoose.connection;

const handleOpen = () => console.log("Connected to DB");
const handleError = (error) => console.log("DB Error", error);
db.on("error", handleError); //db 에러 이벤트
db.once("open",handleOpen);//db 오픈 이벤트