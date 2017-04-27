var mongoose=require('mongoose');
var categorySchema=require('../schemas/categories');
module.exports=mongoose.model('Category',categorySchema);//数据库blog ，字段category
