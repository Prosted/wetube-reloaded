//global Router
export const join = (req, res) => res.send("Join");
export const login = (req, res) => res.send("Login");

//user Router
export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Remove User");
export const logout = (req, res) => res.send("Logout");
export const see = (req, res) => res.send("see User's Profile");