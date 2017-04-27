var mongoose=require('mongoose');
module.exports=new mongoose.Schema({
  category:{//����
    type:mongoose.Schema.Types.ObjectId,
    ref:'Category'
    //���ã�ʵ������˵���洢ʱ���ݹ�����������������Ŀ¼�µ�ֵ�������Ǵ��ȥ��ֵ��
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
