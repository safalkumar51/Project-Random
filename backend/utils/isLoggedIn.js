const jwt = require('jsonwebtoken');

const isLoggedIn = async (req, res, next) => {

    const authToken = req.header('Authorization')?.replace('Bearer ', '');
    if (!authToken){
        return res.status(401).json({
            success: false,
            message: 'Log In Required!'
        });
    }

    try{

        const decoded = jwt.verify(authToken, process.env.JWT_SECRET);

        req.userId = decoded.id;

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