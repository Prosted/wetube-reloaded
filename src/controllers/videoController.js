//global Router
export const trending = (req, res) => res.send("Home Page Videos");
export const search = (req, res) => res.send("Search Video");

//video Router
export const see = (req, res) => res.send("See Video");
export const edit = (req, res) => res.send("Edit Video");
export const deleteVideo = (req, res) =>res.send("Delete Video");
export const upload = (req, res) => res.send("Upload Video");

