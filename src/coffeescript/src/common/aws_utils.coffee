# @import sha1_utils.coffee
# @import ../../vendor/lib/date.js

AwsUtils = (() ->

  zeropad = (to_pad)->
    to_pad = to_pad.toString()
    to_pad = "0#{to_pad}" if to_pad.length < 2
    to_pad
  
  yyyymmdd = (date)->
    [
      date.getUTCFullYear(),
      zeropad(date.getUTCMonth()+1),
      zeropad(date.getUTCDate())
    ].join("-")
    
  hhmmss = (date)->
    [
      zeropad(date.getUTCHours()), 
      zeropad(date.getUTCMinutes()), 
      zeropad(date.getUTCSeconds())
    ].join(':');
    
  sort_lower_case = (s1, s2)->
    if (s1 == s2) then 0 else (if s1.toLowerCase() > s2.toLowerCase() then 1 else -1)

  pub = {}
  
  pub.date_time_format = (date=new Date())->
    "#{yyyymmdd(date)}T#{hhmmss(date)}.000Z"
  
  pub.generate_sig = (params, aws_secret_key)->
    param_keys = (k for k,v of params)
    param_keys.sort(sort_lower_case)
    to_sign = for k in param_keys
      "#{k}#{params[k]}"
    return SHA1.b64_hmac_sha1(aws_secret_key, to_sign.join(""))
    
  
  return pub
)()