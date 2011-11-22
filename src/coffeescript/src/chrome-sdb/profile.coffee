
class Profile
  
  constructor:(@name, @settings)->
  
  use_name:(name)->
    @name = name
    this
  
  use_settings:(settings)->
    @settings = settings
    this
  
  get_name:()->
    @name
  
  get_settings:()->
    @settings
    
  save:()->
    # lookup profiles first then save
    # profiles json: {name1:settings1,...}
    profiles = Profile.find_all()
    profiles[@name] = @settings.to_json()
    Storage.set("chrome-sdb.profiles", profiles, true)
  
  delete:()->
    Profile.delete(@name)
  
  to_json:()->
    {
      name:@name,
      settings:@settings.to_json()
    }
  
  @from_json:(json)->
    if json
      new Profile(json["name"], Settings.from_json(json["settings"]))
    else
      null
    
  
  @find_all:()->
    # profiles json: {name1:settings1,...}
    Storage.get("chrome-sdb.profiles", true) ? {}
    
  @delete:(name)->
    profiles = Profile.find_all()
    delete profiles[name]
    Storage.set("chrome-sdb.profiles", profiles, true)