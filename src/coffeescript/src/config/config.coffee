# @import ../common/profile.coffee
# @import ../common/settings.coffee
# @import ../common/storage.coffee

primary = Profile.primary()
profiles = Profile.find_all()

if Profile.find_all() == []
  message = '''
    <div class="alert-message warning">
      <a id="close_message_box" class="close" href="#">×</a>
      <p><strong>Create a profile</strong> Enter your AWS Credentials to begin.</p>
    </div>
  '''
  $(()->
    $("#message_box").append(message).show()
    $("#close_message_box").click(()->
      $("#message_box").hide()
    )
  )

else  
  # load profiles 
  $(()->
    update_profiles_table() 
  )


update_profiles_table = ()->
  primary = Profile.primary()
  profiles = Profile.find_all()
  trs = for profile in profiles
    name = profile.get_name()
    primary_name = primary?.get_name() ? null
    access_key = profile.get_settings().get_access_key()
    use = if(profile.get_name() == primary_name) then "In use" else "<a class=\"btn\" href=\"#\" onclick=\"use_profile('#{name}')\">Use</a>"
    edit = "<a href=\"#\" onclick=\"edit_profile('#{name}')\">Edit</a>"
    del = "<a href=\"#\" onclick=\"delete_profile('#{name}')\">Delete</a>"
    "<tr><td>#{name}</td><td>#{access_key}</td><td>#{edit}</td><td>#{use}</td><td>#{del}</td></tr>"
  $("#profiles_table > tbody").html(trs.join(""))
  

# handle modal buttons
save_profile = ()->
  valid = true
  valid &&= validate_text_box("#profile_name", 3, 30)
  valid &&= validate_text_box("#profile_aws_access_key", 15, 25)
  valid &&= validate_text_box("#profile_aws_secret_key", 35, 45)

  if valid
    name = $("#profile_name").val()  
    access_key = $("#profile_aws_access_key").val()
    secret_key = $("#profile_aws_secret_key").val()
    new Profile(name, new Settings(access_key,secret_key)).save()
    # update profiles table
    $('#create_profile_modal').modal('hide')
    update_profiles_table()
  

validate_text_box = (text_box_name, min_length = 0, max_length = 100)->
  value = $(text_box_name).val()
  if value == null || value.length < min_length || value.length > max_length
    $(text_box_name).parentsUntil("fieldset").addClass("error")
    false
  else
    $(text_box_name).parentsUntil("fieldset").removeClass("error")
    true


cancel_profile = ()->
  $('#create_profile_modal').modal('hide')


#handle edit click
edit_profile = (profile_name)->
  profile = Profile.find(profile_name)
  $("#profile_name").val(profile.get_name())
  $("#profile_aws_access_key").val(profile.get_settings().get_access_key())
  $("#profile_aws_secret_key").val(profile.get_settings().get_secret_key())
  $('#create_profile_modal').modal('show')

delete_profile = (profile_name)->
  Profile.delete(profile_name)
  update_profiles_table()

use_profile = (profile_name)->
  profile = Profile.find(profile_name)
  profile.make_primary()
  update_profiles_table()


