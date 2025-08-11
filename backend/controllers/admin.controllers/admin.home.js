const userModel = require('../../models/user.model');
const adminModel = require('../../models/admin.model');

const adminHome = async (req, res) => {
    try{

        const pageNumber = Number(req.query.page) || 1;
        const limit = 20;
        const skip = (pageNumber - 1) * limit;

        const admin = await adminModel.findOne({_id: req.userId}).select('token');
        if(!admin || admin.token !== req.userToken){
            return res.status(404).json({
                success: false,
                message: 'Log In Required!'
            });
        }

        const users = await userModel.find()
            .select('name email profilepic')
            .skip(skip)
            .limit(limit)
            .lean();
        
        if(pageNumber === 1){
            const total = await userModel.countDocuments();
            
            return res.status(200).json({
                success: true,
                pageNumber,
                totalPages: Math.ceil(total / limit),
                totalUsers: total,
                users
            });

        } else{
            return res.status(200).json({
                success: true,
                pageNumber,
                users
            });
        }

    } catch(err){
        console.log("Admin Home Error : ", err.message);
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

module.exports = adminHome;