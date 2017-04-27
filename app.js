// 加载express
var express=require('express');
var Cookies=require('cookies');
var User=require('./models/User');
//创建app应用，相当于=>Node.js Http.createServer();
var app=express();

//加载数据库模块
var mongoose=require('mongoose');

//加载body-parser，用以处理post提交过来的数据
var bodyParser=require('body-parser');

// 设置静态文件托管
app.use('/public',express.static(__dirname+'/public'));

// 定义模板引擎，使用swig.renderFile方法解析后缀为html的文件
var swig=require('swig');
app.engine('html',swig.renderFile);

//设置模板存放目录
app.set('views','./views');

//注册模板引擎
app.set('view engine','html');

//// 调试优化 开发过程中，为了减少麻烦，需要取消模板缓存
swig.setDefaults({ceche:false});

//bodyParser设置
app.use(bodyParser.urlencoded({extended:true}));



//设置cookie
app.use(function(req,res,next){
  req.cookies=new Cookies(req,res);
  // 解析cookie信息把它由字符串转化为对象
  if(req.cookies.get('userMsg')){
    try {
      req.userInfo=JSON.parse(req.cookies.get('userMsg'));
     /* User.findById(req.userInfo._id).then(function(userInfo){
        //userInfo=userInfo.toObject();
        //req.userInfo.isAdmin=Boolean(userInfo.isAdmin);
        console.log(1)
        console.log(userInfo);

        console.log(2)
        next();
      });*/
    }catch(e){
      //next();
    }
  }else{
    //next();
  }
  next();
});

//根据不同的内容划分路由器
app.use('/admin',require('./routers/admin'));
app.use('/api',require('./routers/api'));
app.use('/',require('./routers/main'));
//mongoose.connect();
mongoose.Promise=global.Promise;
mongoose.connect('mongodb://localhost:27017/blog',function(err){
  if(err){
    console.log('数据库连接错误！');
    console.log(err);
  }else{
    console.log('数据库连接成功！');
    app.listen(9000);
  }
});
