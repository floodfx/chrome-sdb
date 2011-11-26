# @import ../common/profile.coffee
# @import ../common/settings.coffee
# @import ../common/storage.coffee
# @import ../common/aws_sdb.coffee
# @import ../common/aws_utils.coffee
# @import ../common/sha1_utils.coffee

profile = Profile.primary()

# redirect if no primary profile
unless profile
  chrome.tabs.create({url:'config.html'}) 
else
  sdb = new SimpleDB(profile)  
  $(()->
    update_domains_table()
  )
  
update_region = (region)->
  profile.get_settings().use_region(region)
  profile.save()
  sdb = new SimpleDB(profile)
  update_domains_table()
 
# set region options 
$(()->
  for region in SimpleDB.regions()
    $("#region_select").append($('<option>', { value:region["endpoint"] }).text(region["name"]))
  $("#region_select").val(profile.get_settings().get_region())
  $("#region_select").change(()->
    region = $("#region_select").val()    
    update_region(region)
  )
)

update_domains_table = (callback=null)->
  sdb.list_domains((res)-> 
    domains = res["domains"]
    if domains.length == 0
      trs = ["<tr><td>No domains in this region</td></tr>"]
    else
      trs = for domain in domains
        controls = "<button id=\"metadata_#{domain}\" class=\"btn info\" onclick=\"metadata('#{domain}')\">metadata</a>"
        controls += " <button id=\"delete_#{domain}\" class=\"btn\" onclick=\"confirm_delete('#{domain}')\" disabled=\"disabled\" style=\"margin-left:5px\">delete</button>"
        "<tr><td>#{domain}<br />#{controls}</td></tr>"    
    $("#domains_table > tbody").html(trs.join(""))    
    
    callback() if callback?
  )


enable_delete = ()->
  $("button[id^=delete_]").removeAttr("disabled").addClass("danger").removeClass("secondary")
  $("#domain_deletion_control").text("Disable Delete").addClass("danger").removeClass("secondary").addClass("active")
  
disable_delete = ()->
  $("button[id^=delete_]").attr("disabled", "disabled").addClass("secondary").removeClass("danger")
  $("#domain_deletion_control").text("Enable Delete").addClass("secondary").removeClass("danger").removeClass("active")

handle_delete_toggle = ()->
  if($("#domain_deletion_control").hasClass("active"))
    disable_delete()
  else
    enable_delete()

handle_query = (results)->
  console.log(results)
  item_count = results.items.length
  next_token = results.next_token
  if next_token?    
    next_token = next_token.replace(/\n/g, "") # replace newlines
    $("#next_page_btn").removeAttr("disabled").attr("onclick", "query('#{next_token}')")
  else
    $("#next_page_btn").attr("disabled", "disabled").removeAttr("onclick")
  
  if item_count == 0
    $("#query_results_table > thead").html("<tr><th>Items</th></tr>")
    $("#query_results_table > tbody").html("<tr><td>No results...</td></tr>")
  else
    ths = for attr_name in results.attr_names
      "<th>#{attr_name}</th>"
    trs = for item in results.items
      tds = for attr_name in results.attr_names  
        attr_vals = item.attrs[attr_name]
        if attr_vals?
          if attr_vals.length > 1  
            "<td><table><tbody><tr><td>"+attr_vals.join("</td><td>")+"</td></tr></tbody></table></td>"
          else
            "<td>#{attr_vals.join('')}</td>"
        else 
          "<td></td>"
      "<tr><td>#{item.name}</td>#{tds.join("")}</tr>"
    
    $("#query_results_table > thead").html("<tr><th>Item Name</th>#{ths.join('')}</tr>")
    $("#query_results_table > tbody").html(trs.join(""))
    $("#query_btn").button('reset')
      
        
query = (next_token=null)->
  query_expr = $("#query_expr").val()
  sdb.select(query_expr, handle_query, next_token)
  $("#query_btn").button('loading')
  

metadata = (domain)->
  sdb.domain_metadata(domain, (res)->
    console.log("metadata", res)
    $("#domain_metadata_label").html("<h2>#{domain} <small>Metadata</small></h2>")
    $("input[name=itemCount]").val(res.item_count)
    $("input[name=itemNamesSizeBytes]").val(res.item_names_size_bytes)
    $("input[name=attributeNameCount]").val(res.attribute_name_count)
    $("input[name=attributeNamesSizeBytes]").val(res.attribute_names_size_bytes)
    $("input[name=attributeValueCount]").val(res.attribute_value_count)
    $("input[name=attributeValuesSizeBytes]").val(res.attribute_values_size_bytes)
    $('#domain_metadata_modal').modal('show')
  )

# watch for confirm deletion and enable delete button
$(()->
  $("input[name=confirm_delete]").keydown((key)->
    # DELET + E
    if($("input[name=confirm_delete]").val() == "DELET" && key.keyCode == 69)
      $("#confirm_delete_domain_btn").removeAttr("disabled").addClass("danger").removeClass("secondary")
    else
      $("#confirm_delete_domain_btn").attr("disabled", "disabled").addClass("secondary").removeClass("danger")
  )
)

confirm_delete = (domain)->
  $("#domain_delete_label").html("<h2>Delete #{domain}?</h2>")
  $("input[name=confirm_delete]").val("")
  $("#confirm_delete_domain_btn").attr("onclick", "delete_domain('#{domain}')")
  $("#confirm_delete_domain_modal").modal('show')

delete_domain = (domain)->
  $("#confirm_delete_domain_btn").button('loading')
  sdb.delete_domain(domain, (results)->
    update_domains_table(()->
      $("#confirm_delete_domain_btn").button('reset')
      disable_delete()
    )    
  )  
  
# handle modal buttons
save_domain = ()->
  #TODO validate
  domain = $("#domain_name").val()
  $("#save_domain").button('loading')
  sdb.create_domain(domain, ()->
    update_domains_table(()->
      $("#save_domain").button('reset')
      $('#create_domain_modal').modal('hide')
    )    
  )
