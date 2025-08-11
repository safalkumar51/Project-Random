const helpModel = require("../../models/help.model");
const userModel = require("../../models/user.model");

const userHelp = async (req,res) => {
    const {problem} = req.query;

    try{

        const user = await userModel.findOne({_id: req.userId}).select('token');
        if(!user || user.token!==req.userToken){
            return res.status(404).json({
                success: false,
                message: 'Log In Required!'
            });
        }

        if(problem.length === 0){
            return res.status(400).json({
                success: false,
                message: 'Invalid Request'
            });
        }

        const userProblem = await helpModel.create({
            user: user._id,
            problem: problem
        })

        return res.status(200).json({
            success: true,
            message: 'Problem Sent Successfully'
        })

    } catch(err){
        console.log("User Help Error:", err.message);
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

module.exports = userHelp;