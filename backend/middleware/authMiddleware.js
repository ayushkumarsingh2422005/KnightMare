import jwt from 'jsonwebtoken'
import User from '../models/User.js';

const authenticateUser = async (req, res, next) => {
    const { token } = req.headers;
    if (!token) {
        return res.json({ success: false, message: 'Not Authorized Login Again' })
    }
    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET)
        const user = User.findOne({token_decode})
        req.body.user = user
        next()
    } catch (error) {
        console.log("error",error)
        res.json({ success: false, message: error.message })
    }
}
export default authenticateUser;