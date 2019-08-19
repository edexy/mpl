const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
    try{
        let token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, "secret");
        req.userData = decoded;
        next();
    }catch(error){
        //check for valid session
        if (req.session.key["adminId"]) {
             // jwt here
             const token = jwt.sign({
                email: req.session.key["adminEmail"],
                adminId: req.session.key["adminId"]
            }, "secret",
            {
                expiresIn: "3h"
            }
        );
        return res.status(200).json({
            message: "Token Refreshed",
            token: token
        });
        }else{
        return res.status(401).json({
            message: 'Auth failed.'
        });
    }
    }    
}