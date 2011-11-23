# @import ../common/profile.coffee
# @import ../common/settings.coffee
# @import ../common/storage.coffee

primary = Profile.primary()
profiles = Profile.find_all()

if primary == null && profiles == {}
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
    trs = for name, settings of profiles
      use = if(name == primary.get_name()) then "In use" else "<a id=\"use_profile_#{name}\" class=\"btn\" href=\"#\">Use</a>"
      "<tr><td>#{name}</td><td><a id=\"profile_#{name}\" href=\"#edit_profile\">Edit</a></td><td>#{use}</td></tr>"
    $("#profiles_table > tbody").html(trs.join(""))
  )


$(()->
  $("#save_profile").click(()->
    #TODO validate
    name = $("#profile_name").val()
    access_key = $("#profile_aws_access_key").val()
    secret_key = $("#profile_aws_secret_key").val()
    new Profile(name, new Settings(access_key,secret_key)).save()
    # update profiles table
    $('#create_profile_modal').modal('hide')
  )

  $("#cancel_profile").click(()->
    $('#create_profile_modal').modal('hide')
  )
)