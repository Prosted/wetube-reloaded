import express from "express";
import { watch, getEdit, postEdit, upload, deleteVideo } from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.get("/:id(\\d+)", watch); //정규식 사용으로 id가 숫자만 허용되게 함.
videoRouter.get("/:id(\\d+)/edit", getEdit); //id옆에 정규식을 쓰는 이유는 controller에서 id이름을 쓰기 위함임.
videoRouter.post("/:id(\\d+)/edit", postEdit); //id옆에 정규식을 쓰는 이유는 controller에서 id이름을 쓰기 위함임.
videoRouter.get("/:id(\\d+)/delete", deleteVideo); //:id는 순전히 이름붙이기 용도고, :id삭제 후 정규식만 써도 숫자만 받아올 수 는 있음.
videoRouter.get("/upload", upload); //정규식 사용으로 upload가 맨 위가 아닌 맨 밑에 있어도 정상적으로 불어와짐.

export default videoRouter;