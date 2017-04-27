var express=require('express');
var User=require('../models/User');
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

 function AdminTable(obj,type,limit){
  router.get('/'+type+'/', function (req,res,next) {
    var page=req.query.page||1;

    var count=0;

    obj.count().then(function(_count){
      count=_count;
      var pages=Math.ceil(count/limit);

      page=Math.min(page,pages);
      page=Math.max(page,1);

      var skip=(page-1)*limit;

      obj.find().limit(limit).skip(skip).then(function(data){

        res.render('admin/'+type+'_index',{
          type:type,
          userInfo:req.userInfo,
          data:data,
          page:page,
          pages:pages,
          limit:limit,
          count:count
        });
      });
    });//获取总页数
  });
}

router.get('/',function(req,res,next){
  res.render('admin/index',{
    userInfo:req.userInfo
  });
});


//router.get('/user/',function(req,res,next){});
AdminTable(User,'user',3);
//博客分类管理
//router.get('/category/',function(req,res,next){});
AdminTable(Category,'category',3);


//添加分类
router.get('/category/add',function(req,res,next){
  res.render('admin/category_add',{
    userInfo:req.userInfo
  })
});
router.post('/category/add',function(req,res,next){
  var name=req.body.name||'';
  name= name.replace(/ /g, "");
  if(name==''){
    res.render('admin/error',{
      userInfo:req.userInfo,
      message:'提交的内容不得为空！',
      operation:{
        url:'javascript:window.history.back()',
        operation:'返回上一步'
      }
    })
  }else{
    Category.findOne({
      name:name
    }).then(function(rs){
      if(rs){//数据库已经有分类
        res.render('admin/error',{
          userInfo:req.userInfo,
          message:'数据库已经有该分类了哦！！！',
          operation:{
            url:'javascript:window.history.back()',
            operation:'返回上一步'
          }
        });
        return Promise.reject();
      }else{//数据库不存在该记录，可以保存
        return new Category({
          name:name
        }).save();
      }
    }).then(function(newCategory){
      res.render('admin/success',{
        userInfo:req.userInfo,
        message:'分类保存成功!!',
        operation:{
        url:'/admin/category',
          operation:'返回分类管理'
      }
      })
    });
  }


});
//修改分类
router.get('/category/edit',function(req,res,next){
  var id=req.query.id||'';
  //获得要修改的分类的信息

  Category.findOne({
    _id:id
  }).then(function(category){
    if(!category){
      res.render('admin/error',{
        userInfo:req.userInfo,
        message:'分类信息不存在！'
      });
      return Promise.reject();
    }else{
      res.render('admin/category_edit',{
        userInfo:req.userInfo,
        category:category
      });
    }
  });
});

router.post('/category/edit',function(req,res,next){
  var id=req.query.id||'';
  var name=req.body.name||name;
  name= name.replace(/ /g, "");

  Category.findOne({
    _id:id
  }).then(function(category){
    if(name==undefined){
      res.render('admin/error',{
        userInfo:req.body.userInfo,
        message:'未填写！！！',
        operation:{
          url:'javascript:window.history.back()',
          operation:'返回上一步'
        }
      });
      return Promise.reject();
    }else{//存在
      if(name==category.name){//用户不作修改
        res.render('admin/error',{
          userInfo:req.body.userInfo,
          message:'未修改！',
          operation:{
            url:'javascript:window.history.back()',
            operation:'返回上一步'
          }
        });
        return Promise.reject();
      }else{
        return Category.findOne({
          _id:{$ne:id},
          name:name
        })
      }
    }
  }).then(function(same){
    if(same){
      res.render('admin/error',{
        userInfo:req.body.userInfo,
        message:'已经存在同名数据！',
        operation:{
          url:'javascript:window.history.back()',
          operation:'返回上一步'
        }
      });
      return Promise.reject();
    }else{
      return Category.update({
        _id:id
      },{
        name:name
      })
    }
  }).then(function(resb){
    res.render('admin/success',{
      userInfo:req.body.userInfo,
      message:'修改成功',
      operation:{
        url:'/admin/category',
        operation:'返回分类管理'
      }
    });
  })
});
/*router.post('/category/edit/',function(req,res,next){
  var id=req.query.id||'';
  var name=req.body.name||name;
 name= name.replace(/ /g, "");
      if(name==undefined){
        res.render('admin/error',{
          userInfo:req.body.userInfo,
          message:'请填写修改内容！',
          operation:{
            url:'javascript:window.history.back()',
            operation:'返回上一步'
          }
        });
        return Promise.reject();
      }else{
        // id不变，名称是否相同
        Category.findOne({
          _id: id,
          name:name
        }).then(function(same){
          /!*if(name==same.name){//用户不作修改
            res.render('admin/error',{
              userInfo:req.body.userInfo,
              message:'未修改！',
              operation:{
                url:'javascript:window.history.back()',
                operation:'返回上一步'
              }
            });
            return Promise.reject();
          }else *!/if(same){
                res.render('admin/error',{
                  userInfo:req.body.userInfo,
                  message:'已经存在同名数据！',
                  operation:{
                    url:'javascript:window.history.back()',
                    operation:'返回上一步'
                  }
                });
                return Promise.reject();
          }else{
              Category.update({
                _id:id
              },{
                name:name
              }).then(function(){
                res.render('admin/success',{
                  userInfo:req.body.userInfo,
                  message:'修改成功！',
                  operation:{
                    url:'/admin/category',
                    operation:'返回分类管理'
                  }
                });
              });
          }
        });
      }


});*/
//删除分类
router.get('/category/delete',function(req,res,next){
  var id=req.query.id;

  Category.remove({
    _id:id
  }).then(function(){
    res.render('admin/success',{
      userInfo:req.body.userInfo,
      message:'删除成功！！',
      operation:{
        url:'/admin/category',
        operation:'返回分类管理'
      }
    })
  });

  /*Category.findOne({
    _id:id
  }).then(function(category){
    if(!category){
      res.render('/admin/error',{
        userInfo:req.body.userInfo,
        message:'该内容不存在于数据库中！',
        operation:{
          url:'javascript:window.history.back()',
          operation:'返回上一步'
        }
      });
      return Promise.reject();
    }else{
      return Category.remove({
        _id:id
      })
    }
  }).then(function(){
    res.render('admin/success',{
      userInfo:req.body.userInfo,
      message:'删除成功！！',
      operation:{
        url:'/admin/category',
        operation:'返回分类管理'
      }
    })
  });*/
});


router.get('/content/', function (req,res,next) {
  var page=req.query.page||1;
  var count=0;
  var limit=3;

  Content.count().then(function(_count){
    count=_count;
    var pages=Math.ceil(count/limit);

    page=Math.min(page,pages);
    page=Math.max(page,1);

    var skip=(page-1)*limit;

    Content.find().limit(limit).skip(skip).populate(['category','user']).then(function(data){
      res.render('admin/content_index',{
        userInfo:req.userInfo,
        contentData:data,
        type:'content',
        page:page,
        pages:pages,
        limit:limit,
        count:count
      });
    });
  });//获取总页数
});
//添加文章
router.get('/content/add',function(req,res,next){
  Category.find().then(function(categories){
    res.render('admin/content_add',{
      userInfo:req.userInfo,
      categories:categories
    })
  })
});
router.post('/content/add',function(req,res,next){
   if(req.body.category.trim()==''){
        res.render('admin/error',{
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
     res.render('admin/error',{
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
     res.render('admin/error',{
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
    res.render('admin/error',{
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
        res.render('admin/success',{
          userInfo:req.userInfo,
          message:'文章发布成功！！',
          operation:{
            url:'/admin/content',
            operation:'返回文章管理'
          }
        });
     })
});

router.get('/content/edit',function(req,res,next){
  var id=req.query.id||'';
  Content.findOne({
    _id:id
  }).populate('category').then(function(content){

    if(!content){
      res.render('admin/error',{
        userInfo:req.userInfo,
        message:'该文章不存在',
        operation:{
          url:'javascript:window.history.back()',
          operation:'返回上一步'
        }
      });
      return Promise.reject();
    }else{
      Category.find().then(function(categories){
        res.render('admin/content_edit',{
          userInfo:req.userInfo,
          categories:categories,
          content:content
        });
      })
    }
  })
});

router.post('/content/edit',function(req,res,next){
  var id=req.query.id||'';
  Content.findOne({
    _id:id
  }).then(function(content){
    if(!content){
      res.render('admin/error',{
        userInfo:req.userInfo,
        message:'该文章不存在',
        operation:{
          url:'javascript:window.history.back()',
          operation:'返回上一步'
        }
      });
      return Promise.reject();
    }else{

      if(req.body.title.trim()==''){
        res.render('admin/error',{
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
        res.render('admin/error',{
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
        res.render('admin/error',{
          userInfo:req.userInfo,
          message:'内容忘了填',
          operation:{
            url:'javascript:window.history.back()',
            operation:'返回上一步'
          }
        });
        return Promise.reject();
      }

      return Content.update({
      _id:id
      },{
        category:req.body.category,
        title:req.body.title,
        description:req.body.description,
        content:req.body.content
      })
    }
  }).then(function(){
    res.render('admin/success',{
      userInfo:req.body.userInfo,
      message:'修改成功！！',
      operation:{
        url:'/admin/content',
        operation:'返回文章管理'
      }
    })
  });
});
router.get('/content/delete',function(req,res,next){
  var id=req.query.id||'';
  Content.remove({
    _id:id
  }).then(function(){
    res.render('admin/success',{
      userInfo:req.userInfo,
      message:'删除成功！！',
      operation:{
        url:'/admin/content',
        operation:'返回文章管理'
      }
    })
  })
});
   /*
//评论管理
router.get('/comment',function(req,res,next){
  res.send('comment delete');
});*/

module.exports=router;//把router的结果作为模板的输出返回出去