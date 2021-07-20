import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
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
    secret:process.env.COOKIE_SECRET,
    resave : false,
    saveUninitialized : false, /*saveUninitialized : true < 따로 값을 설정하지 않은 전달 받은 날 것의 세션을 즉시 Store에 저장 후 세션 주인에게 쿠키를 (답장하듯) 넘겨 준다.
    saveUninitialized : false < req.session 속 값을 수정하는 그 순간에 세션을 Store에 저장 후 그제야 쿠키를 전달한다.*/
    cookie : {
        maxAge : 20000,
    },
    store: MongoStore.create({mongoUrl : process.env.DB_URL}),
}));

app.use(localsMiddleware);

app.use("/", rootRouter);
app.use("/users", usersRouter);
app.use("/videos", videoRouter);

export default app;

