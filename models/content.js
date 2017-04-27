var mongoose=require('mongoose');
var contentSchema=require('../schemas/contents');
module.exports=mongoose.model('Content',contentSchema);//数据库blog ，字段category
