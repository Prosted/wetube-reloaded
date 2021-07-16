
import express from "express";
import session from "express-session";
import morgan from "morgan";
import { localsMiddleware } from "./middlewares";
import rootRouter from "./routers/rootRouter";
import usersRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";



const app = express(); //express함수로 익스프레스 앱을 만듬

const logger = morgan("combined");

app.set("views", process.cwd() + "/src/views");
app.set("view engine", "pug");

//app.use(logger);
app.use(express.urlencoded({extended:true}));
app.use(session({
    secret:"Hello!",
    resave : true,
    saveUninitialized : true,
}));

// app.use((req, res, next)=>{
//     req.sessionStore.all((error, sessions) => {
//         console.log(sessions);
//         next();
//     });
// });

app.use(localsMiddleware);

app.use("/", rootRouter);
app.use("/users", usersRouter);
app.use("/videos", videoRouter);

export default app;

