const { sign, verify } = require("jsonwebtoken");


const createTokens = (id) => {
    const accessToken = sign( {id:id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
    return accessToken;
};

const validateToken = (req, res, next) =>{
    const accessToken = req.cookies["acess-token"];
    if (!accessToken) {
        return res.status(400).json({
            erro: "não tem token de acesso"
        })
    }   try {
        const validToken = verify(accessToken, process.env.JWT_SECRET);
        if (validToken) {
            req.authenticated = true;
            return next();
        }
    } catch(err) {
        return res.status(400).json({
            error: err
        })
    };
}

module.exports = {createTokens,validateToken};
