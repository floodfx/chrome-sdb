
class Settings

  constructor:(@access_key, @secret_key, @region="sdb.amazonaws.com", @version="2009-04-15", @https_protocol=false)->
  
  use_access_key:(access_key)->
    @access_key = access_key
    this
  
  use_secret_key:(secret_key)->
    @secret_key = secret_key
    this
  
  use_region:(region)->
    @region = region
    this
  
  use_version:(version)->
    @version = version
    this
  
  use_https_protocol:(true_or_false)->
    @https_protocol = true_or_false
    this
  
  get_access_key:()->
    @access_key
  
  get_secret_key:()->
    @secret_key
    
  get_region:()->
    @region
  
  get_version:()->
    @version
  
  get_use_https:()->
    @https_protocol
  
  to_json:()->
    {
      access_key:@access_key,
      secret_key:@secret_key,
      region:@region,
      version:@version,
      https_protocol:@https_protocol
    }

  @from_json:(json)->
    if json
      new Settings(json["access_key"], json["secret_key"], json["region"], json["version"], json["https_protocol"])
    else
      null
  