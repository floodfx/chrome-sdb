# @import ../common/profile.coffee
# @import ../common/settings.coffee
# @import ../common/storage.coffee
# @import ../common/aws_sdb.coffee
# @import ../common/aws_utils.coffee
# @import ../common/sha1_utils.coffee

profile = Profile.primary()

handle_error = (results, xmldoc)->
  error_code = results.error.code
  error_msg = results.error.msg
  url = results.meta.req_url
  $("#error_code").text(error_code)
  $("#error_msg").text(error_msg)
  $("#error_url").attr("href", url)
  $("#message_box").show()
  # reset buttons
  $("#query_btn").button('reset')

# redirect if no primary profile
unless profile
  chrome.tabs.create({url:'config.html'}) 
else
  sdb = new SimpleDB(profile, false, handle_error)
  $(()->    
    update_domains_table()
  )
  
update_region = (region)->
  profile.get_settings().use_region(region)
  profile.save()
  sdb = new SimpleDB(profile, false, handle_error)
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
    
    for domain in domains
      $("#domain_select").append($('<option>', {value:domain}).text(domain))
    
    callback() if callback?
  )
  
add_item = ()->
  $("#domain_select").val(domain_from_query())
  $("#item_name").val("")
  $("#attr_name").val("")
  $("#attr_value_textarea").val("")
  $("#attr_value_is_multivalued").removeAttr("checked")
  $('#add_edit_item_label').text('Add Item')
  # $('#add_edit_item_attributes').modal('show')
  
edit_item = (domain, item, attr_name, attr_values)->
  $("#domain_select").val(domain)
  $("#item_name").val(item)
  $("#attr_name").val(attr_name)
  $("#attr_value_textarea").val(attr_values.join("\n")).attr("rows", Math.max(1,attr_values.length))
  if(attr_values.length > 1) 
    $("#attr_value_is_multivalued").attr("checked", "checked")
  else
    $("#attr_value_is_multivalued").removeAttr("checked")
  $('#add_edit_item_label').text('Edit Item')
  $('#add_edit_item_attributes').modal('show')  
  
save_item = ()->
  domain_name = $("#domain_select").val()
  item_name = $("#item_name").val()
  attr_name = $("#attr_name").val()
  attr_value = $("#attr_value_textarea").val()
  attr_replace = $("#attr_replace").is(":checked")
  attr_multivalued = $("#attr_value_is_multivalued").is(":checked")
  attr_multivalued_delimiter = $("#attr_value_delimiter").val()
  if(attr_multivalued)
    attr_values = attr_value.split(new RegExp(attr_multivalued_delimiter))
  else
    attr_values = [attr_value]
  sdb.put_attributes(domain_name,item_name,[{name:attr_name,values:attr_values,replace:attr_replace}],(res)->
    $('#add_edit_item_attributes').modal('hide')
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
    
domain_from_query = ()->
  domain_match = $("#query_expr").val().match(/\`(.+)\`/) 
  if(domain_match != null) then domain_match[1] else null

handle_query = (results)->
  $("#message_box").hide()
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
            "<td data-attr-name=\"#{attr_name}\" data-attr-multivalued=\"true\"><table><tbody><tr><td>"+attr_vals.join("</td><td>")+"</td></tr></tbody></table></td>"
          else
            "<td data-attr-name=\"#{attr_name}\" data-attr-multivalued=\"false\">#{attr_vals.join('')}</td>"
        else 
          "<td data-attr-name=\"#{attr_name}\" data-attr-multivalued=\"false\"></td>"
      "<tr data-item-name=\"#{item.name}\"><td>#{item.name}</td>#{tds.join("")}</tr>"
    
    $("#query_results_table > thead").html("<tr><th>Item Name</th>#{ths.join('')}</tr>")
    $("#query_results_table > tbody").html(trs.join(""))
    $("#query_btn").button('reset')
    
    # add click listener
    $("#query_results_table > tbody > tr").each((index, val)->
      # for each td
      $(val).children("td").each((jindex, tdval)->
        #skip 0 index since it is item name
        if(jindex > 0)
          id = "edit_image"
          handler_in = ()->        
            $(this).append(" <img id=\"#{id}\" src=\"images/attr_edit.png\"/>").click(()->
              item_name = $(this).parent().attr("data-item-name")
              attr_name = $(this).attr("data-attr-name")
              is_multivalued = $(this).attr("data-attr-multivalued") == "true"
              values = []
              if(is_multivalued)
                $(this).children("table").children("tbody").children("tr").children("td").each((index, el)->
                  values.push($(el).text())
                )
              else
                values.push($(this).text())
              edit_item(domain_from_query(), item_name, attr_name, values)
            )
          handler_out = ()->
            $("#"+id).remove()
          $(tdval).hover(handler_in,handler_out)
        
      )   
      
    )
      
        
query = (next_token=null)->
  query_expr = $("#query_expr").val()
  sdb.select(query_expr, handle_query, next_token)
  $("#query_btn").button('loading')
  

metadata = (domain)->
  sdb.domain_metadata(domain, (res)->
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
