import express from "express"; //express로부터 express를 불러옴
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import usersRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

const PORT = 4000;

const app = express(); //express함수로 익스프레스 앱을 만듬

const logger = morgan("combined");

app.set("views", process.cwd() + "/src/views");
app.set("view engine", "pug");

//app.use(logger);
app.use("/", globalRouter);
app.use("/users", usersRouter);
app.use("/videos", videoRouter);

const handleListening = () =>
  console.log(`Server listening on port http://localhost:${PORT}`); //listen의 콜백함수 구현

app.listen(PORT, handleListening); // 서버는 사용자가 보내는 request를 항상 listen하고 있어야한다.(상호작용하기위해)
