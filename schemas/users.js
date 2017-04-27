var mongoose=require('mongoose');

/*var db=mongoose.connect('mongodb://localhost:27017/mongo');
var Schema=mongoose.Schema;
var blogSchema=new Schema({
  title:String,
  author:String,
  body:String,
  comment:[{body:String,date:Date}],
  date:{type:Date,default :Date.now},
  hidden:Boolean,
  meta:{
    votes:Number,
    favs:Number
  }
});*/
module.exports=new mongoose.Schema({
  username:String,
  password:String,
  isAdmin:{
    type:Boolean,
    default:false
  }
});
