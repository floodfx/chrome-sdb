/**
 * Collection of Methods for Signature Generation
 */
var OldAwsUtil = {
  dateTimeFormat : function(date) {
    if(date == null) date = new Date(); // assume now
    var yyyymmdd = [date.getUTCFullYear(), 
               this.pad(date.getUTCMonth()+1), // month index starts at 0
               this.pad(date.getUTCDate())].join('-');
    var hhmmss = [this.pad(date.getUTCHours()), this.pad(date.getUTCMinutes()), this.pad(date.getUTCSeconds())].join(':');
    return yyyymmdd+'T'+hhmmss+'.000Z';    
  },
  pad : function(to_pad, max_length, pad_with) {
    if(max_length == null) max_length = 2;
    if(pad_with == null)   pad_with = 0;
    var res = to_pad.toString();
    while(res.length < max_length) res = pad_with + res;
    return res;
  },
  sortLowerCase : function(s1, s2) {
    return (s1 == s2) ? 0 : (s1.toLowerCase() > s2.toLowerCase() ? 1 : -1);
  },
  generateSignature : function(params, aws_secret_key) {
    var to_sign = '';
    var param_keys = [];
    for(var key in params) param_keys.push(key); // get keys to sort by
    param_keys.sort(this.sortLowerCase);
    for(var i = 0; i < param_keys.length; i++) {
      var k = param_keys[i];
      var v = params[k];
      to_sign += k+v;
    }
    return b64_hmac_sha1(aws_secret_key, to_sign); // uses sha1.js
  }
}
