const express = require('express');
const app = express();
const port = 5000;

const bodyParser = require('body-parser');//바디파서는 클라이언트 정보를 서버에서 분석해서 쓸 수 있게 하는 애
const cookieParser = require('cookie-parser');

const config = require('./config/key');

const {auth}  = require("./middleware/auth");
const {User}  = require("./models/User");//만들어 놓은 데이터 모델

app.use(bodyParser.urlencoded({extended: true}));//기본 form 데이터

app.use(bodyParser.json());//json
app.use(cookieParser());

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));


app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.get('/api/hello', (req,res)=>{
  res.send("안녕하세요!@#");
});

//express routor 쓸 때 /api 형식으로 정리 할 예정이라 미리 경로 설정
app.post('/api/users/register', (req, res) => {
  //회원 가입 할 때 필요한 정보들을 client에서 가져오면
  //그 것들을 DB에 넣어 준다.
    const user = User(req.body);

    user.save((err, doc) => {
        if(err) return res.json({success: false, err});
        return res.status(200).json({
          success: true
        });
    });
});

//로그인 기능
app.post('/api/users/login', (req, res) => {
  //요청 된 이메일을 데이터베이스에서 찾는 기능
  User.findOne({email: req.body.email}, (err, user) =>{
    if(!user) {
      return res.json({
        loginSuccess : false,
        message : "요청한 이메일에 해당하는 유저가 없습니다."
      });
    }
      //이메일이 있으면 비밀번호가 일치 하는 지 확인하는 기능
    user.comparePassword(req.body.password , (err, isMatch) =>{
      if(!isMatch){
        return res.json({loginSuccess: false, message: "비밀번호가 틀렸습니다."});
      }
      //비밀번호가 일치한다면 token 생성하는 기능
      user.generateToken((err, user) =>{
        if(err) return res.status(400).send(err);
        //토큰을 저장한다. ; 쿠키, localStorage, session등 ; 이 수업은 쿠키에 저장
        //쿠키에 저장하기 위하여 라이브러리 필요; cookie-parser
        res.cookie("x_auth", user.token)
        .status(200)
        .json({loginSuccess: true, userId: user._id});
      });
    });
  });  
});

//auth 미들웨어 추가해서 auth 기능 만듬
app.get('/api/users/auth', auth, (req, res) =>{
  //여기까지 미들웨어 통과했다는 것은 Auth가 true라는 말
   res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
   });  
});

//로그아웃 기능(토큰 해제)
app.get('/api/users/logout', auth, (req, res) =>{
  User.findOneAndUpdate(
    {_id: req.user._id},
    {token: ""},
    (err, user) =>{
      if(err) return res.json({success: false, err});
      return res.status(200).send({
        success: true
      })
    })
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});