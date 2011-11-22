
Storage = (()->
  
  pub = {}    
  
  pub.get = (key, is_json=false)->
    val = localStorage.getItem(key)
    val = JSON.parse(val) if is_json
    val
    
  pub.set = (key, val, is_json=false)->
    val = JSON.stringify(val) if is_json
    localStorage.setItem(key, val)
    val
    
  pub.del = (key)->
    localStorage.removeItem(key)
    
  return pub
  
)()