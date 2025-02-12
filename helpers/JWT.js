const JWT = require('jsonwebtoken')
const creatError = require('http-errors')

module.exports = {



    signAccessToken: (UserId, userRole) => {
        return new Promise((resolve, reject) => {
          const payload = {UserId, role: userRole};
          const secret = process.env.ACCESSTOKENSECRET;
          console.log("Signing access token with secret:", secret); // Debug
          const options = {
            expiresIn: "15m",
            issuer: "Sharon",
            audience: String(UserId),
          };
          JWT.sign(payload, secret, options, (error, token) => {
            if (error) {
              console.error("Token signing error:", error);
              reject(error);
            }
            resolve(token);
          });
        });
      },
      


    verifyAccessToken: (req, res, next) => {
        if(!req.headers['authorization']) return next(creatError.Unauthorized())
            const authHeaders = req.headers['authorization']
            const bearerToken = authHeaders.split(' ')
            const token = bearerToken[1]
            JWT.verify(token, process.env.ACCESSTOKENSECRET, (err, payload)=>{
                if(err){
                    return next(creatError.Unauthorized())
                }
                req.payload = payload
                next()
            })
    },

    signRefreshToken: (UserId) => {
        return new Promise((resolve, reject)=>{
            const payload = {}
            const secret = process.env.REFRESHTOKENSECRET
            const options = {
                expiresIn: '1y',
                issuer: 'Sharon',
                audience: String(UserId)
            }
            JWT.sign(payload,secret,options, (err, token)=>{
                if(err){
                    console.log(err.message)
                    return reject(creatError.InternalServerError())
                }
                resolve(token)
            })
        })
    },

    verifyRefreshToken: (refreshToken) =>{
        return new Promise((resolve, reject)=>{
            JWT.verify(refreshToken, process.env.REFRESHTOKENSECRET, (err, payload)=>{
                if(err) return reject(creatError.Unauthorized())
                    const UserId = payload.aud
                    resolve(UserId)
            })
        })
    },



    restrict: (...allowedRoles) =>{
        return(req, res, next)=>{
            const userRole = req.payload.role

            if(!userRole || !allowedRoles.includes(userRole)){
                return next(creatError.Forbidden('Sorry! You do not have permission to perform this action'))
            }
            next()
        }
    }



}