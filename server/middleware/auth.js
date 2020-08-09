const {User} = require("../models/User");

let auth = (req, res, next) => {

    //인증 처리 하는 곳

    //클라이언트 쿠키에서 토큰 가져 옴
    let token = req.cookies.x_auth;

    //가져온 토큰을 복호화(decoding)한 후 유저를 찾음
    User.findByToken(token, (err, user) =>{
        if(err) throw err;
        if(!user) return res.json({isAuth: false, error: true});

        req.token = token;
        req.user = user;
        next();
    });

    //유저 있으면 pass 아니면 no
}

module.exports = {auth};