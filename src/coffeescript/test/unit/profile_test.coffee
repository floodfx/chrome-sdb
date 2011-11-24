# @import ../../src/common/profile.coffee
# @import ../../src/common/settings.coffee

describe "Profile", ->

  it "test create", ->
    Profile.delete_all()
    expect(Profile.find_all()).toEqual([])
    profile = new Profile("a", new Settings("b", "c"))
    profile.save()
    expect(Profile.find_all().length).toEqual(1)
    expect(Profile.find_all()[0].get_name()).toEqual("a")
  