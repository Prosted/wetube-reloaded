import User from "../models/User";

//root Router
export const getJoin = (req, res) => { 
    res.render("join", {pageTitle : "Join"});
}

export const postJoin = async (req, res) => {
    const {name, email, userName, password, location} = req.body; 
    await User.create({
        name,
        email,
        userName,
        password,
        location,
    })
    res.redirect("/login");
}

export const login = (req, res) => res.send("Login");

//user Router
export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Remove User");
export const logout = (req, res) => res.send("Logout");
export const see = (req, res) => res.send("see User's Profile");
