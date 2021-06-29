import express from "express";

const usersRouter = express.Router();

const handleEditUser = (req, res) => res.send("Edit User");

usersRouter.get("/edit", handleEditUser);

export default usersRouter;