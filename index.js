const express = require('express');
const app = express();
const port = 5000;

const bodyParser = require('body-parser');//바디파서는 클라이언트 정보를 서버에서 분석해서 쓸 수 있게 하는 애

const config = require('./config/key');

const {User}  = require("./models/User");//만들어 놓은 데이터 모델

app.use(bodyParser.urlencoded({extended: true}));//기본 form 데이터

app.use(bodyParser.json());//json

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));


app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.post('/register', (req, res) => {
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



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});