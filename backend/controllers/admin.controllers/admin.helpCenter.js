const helpModel = require("../../models/help.model");

const adminHelpCenter = async (req,res) => {
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
    
            const problems = await helpModel.find()
                .select('user problem createdAt')
                .skip(skip)
                .limit(limit)
                .populate({
                    path: 'user',
                    select: 'name profilepic'
                })
                .lean();
            
            if(pageNumber === 1){
                const total = await helpModel.countDocuments();
                
                return res.status(200).json({
                    success: true,
                    pageNumber,
                    totalPages: Math.ceil(total / limit),
                    totalProblems: total,
                    problems
                });
    
            } else{
                return res.status(200).json({
                    success: true,
                    pageNumber,
                    problems
                });
            }
    
        } catch(err){
            console.log("Admin Help Center Error : ", err.message);
            return res.status(500).json({
                success: false,
                error: err.message
            });
        }
}

module.exports = adminHelpCenter;