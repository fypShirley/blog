var express=require('express');
var User=require('../models/User');
var Content=require('../models/content');
var Comment=require('../models/comments');
var Category=require('../models/category');
var router=express.Router();


function numFormat(num) {
  return (Math.abs(num) < 10) ? "0" + parseInt(num) : num;
}
var format = {
  date: function (time) {
    var date = new Date();
    time && date.setTime(time);
    var d = date.getFullYear() + "-" + numFormat(date.getMonth() + 1) + "-" + numFormat(date.getDate());
    var t = numFormat(date.getHours()) + ":" + numFormat(date.getMinutes());
    var monthday = numFormat(date.getMonth() + 1) + '/' +  numFormat(date.getDate());
    return ({ date: d, time: t, full: d + " " + t ,monthday: monthday});
  }
};

// 统一返回格式
var responseData=null;
router.use(function(req,res,next){
  responseData={
    code:0,message:'',
    userInfo:''
  }
  next();
});

router.post('/user/register',function(req,res,next){
    var username=req.body.username;
    username= username.replace(/ /g, "");
    var password=req.body.password;
    var repassword=req.body.repassword;

    if(username==''){
      responseData.code=1;
      responseData.message='用户名不能为空！';
      res.json(responseData);
      return;
    }
    if(password==''){
      responseData.code=2;
      responseData.message='密码不能为空！';
      res.json(responseData);
      return;
    }
    if(password!=repassword){
      responseData.code=3;
      responseData.message='两次密码不一致！';
      res.json(responseData);
      return;
    }

    User.findOne({
      username:username
    }).then(function(userInfo){
      if(userInfo){
        responseData.code=4;
        responseData.message='该用户已被注册！';
        res.json(responseData);
        return;
      }else{//保存用户信息到数据库中
        var user=new User({
          username:username,
          password:password
        });
        return user.save();
      }

    }).then(function(newUserInfo){
      console.log('注册成功 '+newUserInfo);
      responseData.message='注册成功！';
      res.json(responseData);
    });

});

router.post('/user/login',function(req,res,next){
    var username=req.body.username;
    var password=req.body.password;
    if(username=='' || password==''){
      responseData.code=1;
      responseData.message='用户名和密码不得为空！';
      res.json(responseData);
      return;
    }

    //查询用户名和对应密码是否存在，如果存在则登录成功
    User.findOne({
      username:username,
      password:password
    }).then(function(userInfo){//mongdb存的信息
      if(!userInfo){
        responseData.code=2;
        responseData.message='用户名或密码错误!';
        res.json(responseData);
        return;
      }else{
        userInfo=userInfo.toObject();
        responseData.message='登录成功！';
        responseData.userInfo=userInfo.username;
        //每当用户访问站点，将保存用户信息。
        req.cookies.set('userMsg',JSON.stringify({
           _id:userInfo._id,
           username:userInfo.username,
           isAdmin:userInfo.isAdmin
          })
        );//把id和用户名作为一个对象存到一个名字为“userInfo”的对象里面。
        res.json(responseData);
        return;
      }
    });
});

router.get('/user/logout',function(req,res){
  req.cookies.set('userMsg',JSON.stringify({
    _id:null,
    username:null
  }));
  res.json(responseData);
  return;
});

/*router.post('/comment/post',function(req,res,next){
  var contentId=req.body.contentId||'';
  var postData={
    username:req.userInfo.username,
    postTime:format.date(new Date()).full,
      content:req.body.content
  };
  //查询当前内容信息
  Content.findOne({
    _id:contentId
  }).then(function(content){
    content.comments.unshift(postData);
    return content.save();
  }).then(function(newContent){//最新的内容在newContent
    responseData.message='评论成功！';
    responseData.data=newContent;//newContent 就是 content：[postData]
    res.json(responseData);
  });
});*/
/*router.get('/comment',function(req,res,next){
  var contentId=req.query.contentId||'';
  Content.findOne({//查文章
    _id:contentId
  }).then(function(content){
    responseData.data=content;
    res.json(responseData);
  })
})*/
router.post('/comment/post',function(req,res,next){
  var contentId=req.body.contentId||'';
  var postData={
    username:req.userInfo.username,
    postTime:format.date(new Date()).full,
    content:req.body.content//评论的内容
  };
  //查询当前内容信息

  Comment.findOne({
    contentId:contentId
  }).then(function(comment){
    if(comment){//已有记录
      comment.comments.unshift(postData);
      return comment.save();
    }else{
      new Comment({
        contentId:contentId,
        comments:postData
      }).save()
    }
  }).then(function(newContent){//最新的内容在newContent
    responseData.message='评论成功！';
    responseData.data=newContent;//newContent 就是 content：[postData]
    res.json(responseData);
  });
});
router.get('/comment',function(req,res,next){
  var contentId=req.query.contentId||'';
  Comment.findOne({//查文章
    contentId:contentId
  }).then(function(content){
    responseData.data=content||'';
    res.json(responseData);
    console.log('评论'+responseData);
  })
})




router.post('/keywords',function(req,res,next){
  var description=req.body.description//文章的简介
  var data={
    category:'',
    categories:[],
    contents:[]
  };

  Category.find().then(function(categories){
    data.categories=categories;//所有类别
    return Content.findOne({
      description:description
    }).populate(['user','category']);
  }).then(function(contents){
    console.log(contents);
    data.contents=contents;
    data.category=data.contents.category._id;
    contents.views++;//保存阅读量
    contents.save();
    responseData.data=data;
    res.json(responseData);
    /*res.render('main/view',{
      data:data,
      userInfo:req.userInfo
    });*/
  })
})
module.exports=router;//把router的结果作为模板的输出返回出去