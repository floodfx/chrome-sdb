
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
    found = false
    for profile in profiles
      if @name == profile.get_name()
        profile.use_settings(@settings)
        found = true
    profiles.push(this) if !found
    Storage.set("chrome-sdb.profiles", Profile.profiles_json(profiles), true)
    # set primary if none set
    primary = Profile.primary()    
    this.make_primary() if primary == null || make_primary
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
    profiles_json = Storage.get("chrome-sdb.profiles", true) ? {}
    profiles = for name, settings of profiles_json
      new Profile(name, Settings.from_json(settings))
    
  @find:(by_name)->
    profiles = Profile.find_all()
    for profile in profiles
      if profile.get_name() == by_name
        return profile
    null
    
  @profiles_json:(profiles)->
    profiles_json = {}
    for profile in profiles
      profiles_json[profile.get_name()] = profile.get_settings().to_json()
    profiles_json
    
  @delete_all:()->
    Storage.set("chrome-sdb.profiles", {}, true)
    
  @delete:(name)->
    profiles = Profile.find_all()
    new_profiles = []
    for i in [0...profiles.length]
      if profiles[i].get_name() != name
        new_profiles.push(profiles[i])
    Storage.set("chrome-sdb.profiles", Profile.profiles_json(new_profiles), true)

    
    
    