# @import ../common/profile.coffee
# @import ../common/settings.coffee
# @import ../common/storage.coffee
# @import ../common/aws_sdb.coffee
# @import ../common/aws_utils.coffee
# @import ../common/sha1_utils.coffee

profile = Profile.primary()

# redirect if no primary profile
chrome.tabs.create({url:'config.html'}) unless profile

handle_domains = (res)->
  

sdb = new SimpleDB(profile)  

sdb.list_domains((res)-> 
  domains = res["domains"]
  trs = for domain in domains
    metadata = "<a id=\"metadata_#{domain}\" class=\"btn\" href=\"#\">Metadata</a>"
    "<tr><td>#{domain}</td><td>#{metadata}</td></tr>"
  $(()->
    $("#domains_table > tbody").html(trs.join(""))
  )
)



