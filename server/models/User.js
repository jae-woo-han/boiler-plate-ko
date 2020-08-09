//DB모델 만들기
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const saltRounds = 10;//salt 글자 수
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        rim: true,
        unique: 1
    },
    password: {
        type: String,
        maxlength: 100
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {//Expire
        type: Number
    }
});

userSchema.pre('save', function(next){//유저 정보 저장하기 전에 콜백 함수 실행; 파라미터 next 쓰면 콜백 함수 끝나면 next함수로 넘어가게하는 거
    var user = this;//this는 userSchema를 가리킨다

    if(user.isModified('password')){//사이트 이용 할 때 보면 개인 정보 변경 필요; 암호화는 비밀번호 변경 때만 하면 된다.
        //비밀번호를 암호화 시킨다.
        bcrypt.genSalt(saltRounds, function(err, salt) {
           if(err) return next(err);
    
           bcrypt.hash(user.password, salt, function(err, hash){
            if(err) return next(err);
            user.password = hash;//password를 hash된 문자열로 바꿔준다.
            next();
           });
        });
    }else {
        next();
    }
});

userSchema.methods.comparePassword = function(plainPassword, cb){
    //plainPassword 암호화 된 비밀번호 간 비교 체크
    //plainPassword를 암호화 해서 체크 해야함
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return cb(err);
        cb(null, isMatch);
    });
}

userSchema.methods.generateToken = function(cb){
    
    var user = this;
    
    //jsonwebtoken을 이용해서 token을 생성
    var token = jwt.sign(user._id.toHexString(), 'secretToken');//sign에 들어간 인자 두개를 합쳐서 토큰 만들어 줌

    user.token = token;
    user.save(function(err, user) {
        if(err) return cb(err);
        cb(null, user);
    });
};

userSchema.statics.findByToken = function(token, cb){
    var user = this;

    //토큰을 decode 한다.
    jwt.verify(token, 'secretToken', function(err, decoded){
        //유저 아이디를 이용해서 유저를 찾은 다음
        //클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인
        user.findOne({"_id": decoded, "token": token}, function(err, user){
            if(err) return cb(err);
            cb(null, user);
        });
    });
}

const User = mongoose.model('User', userSchema);

module.exports = {User};