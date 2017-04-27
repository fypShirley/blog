var mongoose=require('mongoose');
var contentSchema=require('../schemas/comments');
module.exports=mongoose.model('Comments',contentSchema);//数据库blog ，字段category
