import User from "../models/User";
import Video from "../models/Video";
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
        req.flash("success", "we create your accout please login");
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
    req.flash("success", "login success");
    res.redirect("/");
};

export const logout = (req, res) => {
    console.log("logout");
    req.session.destroy();
    req.flash("info", "Bye Bye");
    return res.redirect("/");
};

//user Router
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
            req.flash("error", "github login fail.. something wrong");
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
        req.flash("success", "social login success");
        return res.redirect("/");
    }else{
        return res.redirect("/login");
    }
}
    
export const getEdit = (req, res) => {
    res.render("edit-profile", {pageTitle:"Edit Profile"});
};

export const postEdit = async (req, res) => {
    const {
        session:{
           user: {_id, userName : sessionUserName, email : sessionEmail, avatarUrl},
        },
        body:{name, userName, email, location},
        file,
    } = req;
    let search=[];
    if(sessionUserName!==userName){
        search.push({userName});
    }
    if(sessionEmail!==email){
        search.push({email});
    }
    if(search.length > 0){
        const existsUser = await User.findOne({$or:search});
        if(existsUser && existsUser._id.toString() !== _id){
            return res.status(400).render("edit-profile", {pageTitle:"Edit Profile", errorMessage:"This username/email is already taken."});
        }
    }
    const user = await User.findByIdAndUpdate(_id, {
        avatarUrl : file ? file.path : avatarUrl,
        name,
        userName, 
        email, 
        location,
    }, {new : true});
    req.session.user = user;
    req.flash("success", "Edit suceess");
    return res.redirect("/users/edit");
};

export const getChangePassword = (req, res) => {
    const {
        session :{
            user :{socialOnly},
        }
    } =req;
    if(socialOnly){
        req.flash("info", "You are a social login user. you have not a password");
        return res.redirect("/");
    }
    return res.render("change-password", {pageTitle:"Change Password"});
}

export const postChangePassword = async (req, res) => {
    const{
        session : {
            user:{_id},
        },
        body : {oldPassword, newPassword, newPasswordConfirm},
    } =req;
    const user = await User.findById(_id);
    const oldPasswordCheck = await bcrypt.compare(oldPassword, user.password);
    if(!oldPasswordCheck){
        return res.status(400).render("change-password", {pageTitle:"Change Password", errorMessage:"The Current Password is incorrect"});
    }
    if(newPassword !== newPasswordConfirm){
        return res.status(400).render("change-password", {pageTitle:"Change Password", errorMessage:"The password does not match the confirmation"});
    }
    user.password = newPassword;
    await user.save();
    alert("password changed successfully");
    return res.redirect("/logout");
}

export const see = async (req, res) => {
    const {id} = req.params;
    const user = await User.findById(id).populate({
        path: "videos",
        populate: {
          path: "owner",
          model: "User",
        },
      }).populate("comments");
    console.log(user);
    if(!user){
        return res.status(400).render("error", {pageTitle:"User Not Found"});
    }
    return res.render("profile", {pageTitle:`${user.userName}??? Profile`, user});
}

export const remove = (req, res) => res.send("Remove User");