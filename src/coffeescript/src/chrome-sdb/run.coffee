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


handle_query = (results)->
  item_count = results.items.length
  if item_count == 0
    $("#query_results_table > tbody").html("No results...")
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
      
        
    
    


query = ()->
  query_expr = $("#query_expr").val()
  console.log(query_expr)
  sdb.select(query_expr, handle_query)



