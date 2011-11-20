

class SimpleDB

  constructor:(@profile)->
    
  set_profile:(profile)->
    @profile=profile
    
  build_request_url:(action)->
    params = {
      "Action":action
      
    }