var mongoose=require('mongoose');

module.exports=new mongoose.Schema({
  contentId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Content'
  },
  comments:{
    type:Array,
    default:[]
  }
});
