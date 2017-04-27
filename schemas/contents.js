var mongoose=require('mongoose');
module.exports=new mongoose.Schema({
  category:{//类型
    type:mongoose.Schema.Types.ObjectId,
    ref:'Category'
    //引用，实际上是说，存储时根据关联进行索引出分类目录下的值。而不是存进去的值。
  },
  title:String,
  description:{
    type:String,
    default:''
  },
  content:{
    type:String,
    default :''
  },
  date:String,
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  },
  views:{
    type:Number,
    default:0
  }
});
