
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
    
  make_primary:()->
    Storage.set("chrome-sdb.primary-profile", @name)
    this
    
  save:(make_primary=false)->
    # lookup profiles first then save
    # profiles json: {name1:settings1,...}
    profiles = Profile.find_all()    
    profiles[@name] = @settings.to_json()
    Storage.set("chrome-sdb.profiles", profiles, true)
    # set primary if none set
    primary_name = Profile.primary()
    this.make_primary() if primary_name == null || make_primary
    this
  
  delete:()->
    Profile.delete(@name)
    null
  
  to_json:()->
    {
      name:@name,
      settings:@settings.to_json()
    }
  
  @primary:()->
    primary_name = Storage.get("chrome-sdb.primary-profile")
    Profile.find(primary_name)
  
  @from_json:(json)->
    if json
      new Profile(json["name"], Settings.from_json(json["settings"]))
    else
      null 
  
  @find_all:()->
    # profiles json: {name1:settings1,...}
    Storage.get("chrome-sdb.profiles", true) ? {}
    
  @find:(by_name)->
    profiles = Profile.find_all()
    for name, settings of profiles
      if by_name == name
        return new Profile(name, Settings.from_json(settings))
    null
    
  @delete:(name)->
    profiles = Profile.find_all()
    delete profiles[name]
    Storage.set("chrome-sdb.profiles", profiles, true)
    
    
    