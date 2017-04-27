function numFormat(num) {
  return (Math.abs(num) < 10) ? "0" + parseInt(num) : num;
}
var format = {
  size: function (size) {
    var unit = ["B", "KB", "MB", "GB"];
    for (var i = 0; i < unit.length; i++) {
      if (size < Math.pow(1024, i + 1)) {
        return parseInt(size / Math.pow(1024, i) * 10) / 10 + unit[i];
      }
    }
  },
  count:function(count){
    var unitNumber=["","万","亿"];
    for(var i=0;i<unitNumber.length;i++){
      if(count<Math.pow(10000,i+1)){
        return parseInt(count/ Math.pow(10000, i) * 10) / 10 + unitNumber[i];
      }
    }
  },
  elapsedTime: function (time) {
    if (time >= 30 * 86400) {
      if (time < 365 * 86400) {
        return parseInt(time / 86400 / 30) + "月前";
      }
      else {
        return parseInt(time / 86400 / 365) + "年前";
      }
    }
    else {
      if (time >= 86400) {
        return parseInt(time / 86400) + "天前";
      }
      else if (time >= 3600) {
        return parseInt(time / 3600) + "小时前";
      }
      else if (time >= 60) {
        return parseInt(time / 60) + "分钟前";
      }
      else {
        return "刚刚";
      }
    }
  },
  date: function (time) {
    var date = new Date();
    time && date.setTime(time);
    var d = date.getFullYear() + "-" + numFormat(date.getMonth() + 1) + "-" + numFormat(date.getDate());
    var t = numFormat(date.getHours()) + ":" + numFormat(date.getMinutes());
    var monthday = numFormat(date.getMonth() + 1) + '/' +  numFormat(date.getDate());
    return ({ date: d, time: t, full: d + " " + t ,monthday: monthday});
  }
};
