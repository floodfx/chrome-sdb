
class Settings

  constructor:(@access_key, @secret_key, @region="us-east-1", @version="2009-04-15")->
  
  use_region:(region)->
    @region=region
    this
  
  use_version:(version)->
    @version=version
    this
  
  access_key:()->
    @access_key
  
  secret_key:()->
    @secret_key
    
  region:()->
    @region
  
  version:()->
    @version
  