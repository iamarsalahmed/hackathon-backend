
import session from "../models/session.js"
import Admin from "../models/admin.js"
import User from "../models/user.js"
export  const verifyUser= async(token) => {
  const sessionUser = await session.findOne({ token });
  if(!sessionUser || !token ) {
    throw new Error('Unauthorized!')
    // return {status: false, message: 'Unauthorized'}
  }
    const user = await User.findOne({ _id: sessionUser.userId})
    return {status: true, data: user}
  
}

export const  verifAdmin = async(token) => {
  const sessionUser = await session.findOne({ token });
  console.log(sessionUser, "sessionUser")
  
  if(!sessionUser || !token ) {
    throw new Error('Unauthorized!')
  }
    const admin = await Admin.findOne({ _id: sessionUser.adminId})
   console.log(admin, "admin")
    return {status: true, data: admin }

}
