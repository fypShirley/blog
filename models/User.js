var mongoose=require('mongoose');
var userSchema=require('../schemas/users');
/*var userSchema=new mongoose.Schema({
  username:String,
  password:String,
  isAdmin:{
    type:Boolean,
    default:false
  }
});*/
module.exports=mongoose.model('User',userSchema);//数据库blog ，字段user
