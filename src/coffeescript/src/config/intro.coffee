after_intro = ()->
  Storage.set("chrome-sdb-config-intro", "true")
  $('#create_profile_modal').modal('show')
  guiders.hideAll()


$(()->
  if(Storage.get("chrome-sdb-config-intro") == null)
  
    guiders.createGuider({
      buttons: [{name: "Close", onclick:after_intro}],
      description: "Welcome to Simple DB Tool for Chrome.  Please setup one or more AWS Credentials to start using this tool!"
      id: "first",
      overlay: true,
      title: "Chrome Simple DB Tool: Configuration"
    }).show()
    

)