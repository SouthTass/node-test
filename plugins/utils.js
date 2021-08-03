const moment = require('moment')
exports.currentTime = function(val){
  return moment().format(val || 'YYYY年MM月DD日 HH:mm:ss')
}