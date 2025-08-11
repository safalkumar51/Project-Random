const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const isLoggedIn = async (req, res, next) => {

    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({
            success: false,
            message: 'Log In Required!'
        });
    }

    const authToken = authHeader.replace('Bearer ', '');

    try{

        const decoded = jwt.verify(authToken, process.env.JWT_SECRET);

        req.userToken = authToken;
        req.userId = mongoose.Types.ObjectId.createFromHexString(decoded.id);

        next();

    } catch(err){
        console.log("AuthToken Error : ", err.message);
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

module.exports = isLoggedIn;