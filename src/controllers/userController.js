import User from "../models/User";
import bcrypt from "bcrypt";
//root Router
export const getJoin = (req, res) => { 
    res.render("join", {pageTitle : "Join"});
}

export const postJoin = async (req, res) => {
    const {name, email, userName, password, password2, location} = req.body;
    const exists = await User.exists({$or : [{email}, {userName}]});
    if(exists){
        return res.status(400).render("join", {pageTitle:"Join", errorMessage : "This username/email is already taken"});
    }
    if(password != password2){
        return res.status(400).render("join", {pageTitle:"Join", errorMessage : "Password confirmation does not match"});
    }
    try{
        await User.create({
            name,
            email,
            userName,
            password,
            location,
        })
        res.redirect("/login");
    }catch(error){
        res.status(400).render("error", {pageTitle : "Server Error", errorMessage : error._message});
    }
}

export const getLogin = (req, res) => {
    res.render("login", {pageTitle:"Login"});
};

export const postLogin = async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(!user){
        return res.status(400).render("login", {pageTitle : "Login", errorMessage : "An account with this email does not exists"});
    }
    const checkPassword = await bcrypt.compare(password, user.password);
    if(!checkPassword){
        return res.status(400).render("login", {pageTitle : "Login", errorMessage : "An account with this password does not exists"});
    }
    req.session.loggedIn = true;
    req.session.user=user;
    res.redirect("/");
};

export const logout = (req, res) => res.send("Logout");

//user Router
export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Remove User");
export const see = (req, res) => res.send("see User's Profile");
