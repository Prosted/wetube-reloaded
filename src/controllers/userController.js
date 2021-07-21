import User from "../models/User";
import bcrypt from "bcrypt";
import fetch from "node-fetch";
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
    const user = await User.findOne({email, socialOnly:false});
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

export const logout = (req, res) => {
    req.session.destroy();
    return res.redirect("/");
};

//user Router
export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Remove User");
export const see = (req, res) => res.send("see User's Profile");

export const startGithubLogin = (req, res) => {
    const baseUrl = "https://github.com/login/oauth/authorize";
    const config = {
        client_id : process.env.GH_CLIENT,
        allow_signup : false,
        scope : "read:user user:email",
    }
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    return res.redirect(finalUrl);
};

export const finishGithubLogin = async(req, res) => {
    const baseUrl = "https://github.com/login/oauth/access_token";
    const config = {
        client_id : process.env.GH_CLIENT,
        client_secret : process.env.GH_SECRET,
        code : req.query.code,
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    const tokenRequest = await(await fetch(finalUrl, {
        method:"POST",
            headers:{
                Accept : "application/json",
            },
        })
    ).json();
    if("access_token" in tokenRequest){
        const {access_token} = tokenRequest;
        const apiUrl = "http://api.github.com"
        const userData = await(
            await fetch(`${apiUrl}/user`,{
                headers:{
                    Authorization : `token ${access_token}`,
                },
            })
        ).json();
        const emailData = await(await fetch(`${apiUrl}/user/emails`,{
            headers:{
                Authorization : `token ${access_token}`,
            },
        })
    ).json();
    const emailObj = emailData.find((email)=>email.primary === true && email.verified === true);
    if(!emailObj){
        return res.redirect("/login");
    }
    let user = await User.findOne({email : emailObj.email});
    if(!user){
        user = await User.create({
            name : userData.name,
            email : emailObj.email,
            avatarUrl : userData.avatar_url,
            userName : userData.name,
            password : "",
            location : userData.location,
            socialOnly:true,
        });
    }
    req.session.loggedIn = true;
    req.session.user=user;
    return res.redirect("/");
    }else{
        return res.redirect("/login");
    }

}