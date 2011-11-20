# @import sha1_utils.coffee

AwsUtils = (() ->

  zeropad = (to_pad)->
    to_pad = to_pad.toString()
    zero_padded = "0#{to_pad}" if to_pad.length < 2
    zero_padded
  
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
    
  sortLowerCase = (str1, str2)->
    if (s1 == s2) then 0 else (str1.toLowerCase() > str2.toLowerCase() ? 1 : -1)

  pub = {}
  
  pub.dateTimeFormat = (date=new Date())->
    "#{yyyymmdd()}T#{hhmmss}.000Z"
  
  pub.generateSignature = (params, aws_secret_key)->
    param_keys = (item for item in params)
    param_keys.sort(sortLowerCase)
    to_sign = for k in param_keys
      "#{k}#{params[k]}"
    return SHA1.b64_hmac_sha1(aws_secret_key, to_sign.join(""))
    
  
  return pub
)()