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

update_domains_table = ()->
  sdb.list_domains((res)-> 
    domains = res["domains"]
    trs = for domain in domains
      controls = "<button id=\"metadata_#{domain}\" class=\"btn info\" onclick=\"metadata('#{domain}')\">metadata</a>"
      controls += " <button id=\"delete_#{domain}\" class=\"btn secondary\" onclick=\"confirm_delete('#{domain}')\" disabled=\"disabled\" style=\"margin-left:5px\">delete</button>"
      "<tr><td>#{domain}<br />#{controls}</td></tr>"    
    $("#domains_table > tbody").html(trs.join(""))    
  )
  

handle_delete_toggle = ()->
  $("#domain_deletion_control").attr("disabled", "disabled")
  elements = $("button[id^=delete_]")
  if($("#domain_deletion_control").hasClass("active"))
    elements.attr("disabled", "disabled").addClass("secondary").removeClass("danger")
    $("#domain_deletion_control").text("Enable Delete").addClass("secondary").removeClass("danger")
  else
    elements.removeAttr("disabled").addClass("danger").removeClass("secondary")
    $("#domain_deletion_control").text("Disable Delete").addClass("danger").removeClass("secondary")
  $("#domain_deletion_control").removeAttr("disabled")

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
  
  
# handle modal buttons
save_domain = ()->
  #TODO validate
  domain = $("#domain_name").val()
  sdb.create_domain(domain, update_domains_table)
  $('#create_domain_modal').modal('hide')

cancel_domain = ()->
  $('#create_domain_modal').modal('hide')
