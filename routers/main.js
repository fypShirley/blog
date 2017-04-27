var express=require('express');
var Category=require('../models/category');
var Content=require('../models/content');
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
router.get('/',function(req,res,next){
  //读取分类信息
  Category.find()/*.sort({_id:-1})*/.then(function(categoies){
    res.render('main/index',{
      userInfo:req.userInfo,
      categoies:categoies//传送id
    });
  });

});

router.get('/content/add',function(req,res,next){
  Category.find().then(function(categories){
    res.render('main/contentAdd',{
      userInfo:req.userInfo,
      categories:categories
    })
  })
});
router.post('/content/add',function(req,res,next){
  if(req.body.category.trim()==''){
    res.render('main/error',{
      userInfo:req.userInfo,
      message:'分类信息不存在',
      operation:{
        url:'javascript:window.history.back()',
        operation:'返回上一步'
      }
    });
    return Promise.reject();
  }
  if(req.body.title.trim()==''){
    res.render('main/error',{
      userInfo:req.userInfo,
      message:'标题不能为空！！',
      operation:{
        url:'javascript:window.history.back()',
        operation:'返回上一步'
      }
    });
    return Promise.reject();
  }

  if(req.body.description.trim()==''){
    res.render('main/error',{
      userInfo:req.userInfo,
      message:'摘要不能为空',
      operation:{
        url:'javascript:window.history.back()',
        operation:'返回上一步'
      }
    });
    return Promise.reject();
  }

  if(req.body.content.trim()==''){
    res.render('main/error',{
      userInfo:req.userInfo,
      message:'内容忘了填',
      operation:{
        url:'javascript:window.history.back()',
        operation:'返回上一步'
      }
    });
    return Promise.reject();
  }
  new Content({
    category:req.body.category,
    title:req.body.title,
    description:req.body.description,
    content:req.body.content,
    date:format.date(new Date()).full,
    user:req.userInfo._id
  }).save().then(function(){
      res.render('main/success',{
        userInfo:req.userInfo,
        message:'文章发布成功！！',
        operation:{
          url:'/',
          operation:'返回首页'
        }
      });
    })
});



router.get('/article',function(req,res,next){
  var data={
    category:req.query.category||'',//类型
    categories:[],//分类
    count:0,
    page:Number(req.query.page||1),
    limit:3,
    pages:0
  }

  var where={};
  if(data.category){
    where.category=data.category;
  }
  //读取分类信息
  Category.find().then(function(categories){
    data.categories=categories;
    return Content.where(where).count();
  }).then(function(count){
    data.count=count;
    data.pages=Math.ceil(data.count/data.limit);
    // 取值不超过pages
    data.page=Math.min(data.page,data.pages);
    data.page=Math.max(data.page,1);
    var skip=(data.page-1)*data.limit;
    return Content.where(where).count().find().limit(data.limit).skip(skip).populate(['category','user']);
  }).then(function(contents){
    data.contents=contents;

    res.render('main/article',{
      data:data,
      userInfo:req.userInfo
    });
  })
})

router.get('/view',function(req,res,next){
  var contentId=req.query.contentId||'';
  var data={
    category:'',
    categories:[],
    contents:[]
  };
  Category.find().then(function(categories){
    data.categories=categories;//所有类别
    return Content.findOne({_id:contentId}).populate(['user','category']);
  }).then(function(contents){
    data.contents=contents;
    data.category=data.contents.category._id;
    contents.views++;//保存阅读量
    contents.save();
    res.render('main/view',{
      data:data,
      userInfo:req.userInfo
    });
  })
})

module.exports=router;//把router的结果作为模板的输出返回出去