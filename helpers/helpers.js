const moment = require("moment");
const path = require("path");

module.exports = {
	iif: (cond,value) =>{
	  if(cond) return value;
	  return '';
	},
	
	generateTime: (date, format) =>{
		return moment(date).format(format);
	}
}