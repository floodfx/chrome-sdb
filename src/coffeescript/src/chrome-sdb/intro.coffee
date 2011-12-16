add_sample_domain = ()->
  if($("#domain_select > option").length < 1)  
    add_domains(["example_domain_chrome_sdb"])

remove_sample_domain = ()->
  options = $("#domain_select > option")
  if(options.length == 1 && options[0].attr("name") == "example_domain_chrome_sdb")
    $("#domain_select").remove("option")
    
optional_add_domain = ()->
  add_sample_domain()
  guiders.next()
  
sample_query = ()->
  domain = $($("#domain_select > option")[0]).text()
  $("#query_expr").val("select * from `#{domain}`")
  guiders.next()
  
sample_query_results = ()->
  results = 
    items:[{name:"item name", attrs:{"single value attribute":["attribute value"],"multivalued attribute":["val A","val B"]}}],
    attr_names:["single value attribute", "multivalued attribute"]    
  handle_query(results)
  guiders.next()
  
finish_tour = ()->
  results = 
    items:[],
    attr_names:[]
  handle_query(results)
  $("#query_expr").val("")
  remove_sample_domain()
  Storage.set("chrome-sdb-intro", "true")
  guiders.hideAll()

$(()->
  if(Storage.get("chrome-sdb-intro") == null)
    guiders.createGuider({
      buttons: [{name: "Next",onclick:optional_add_domain}],
      description: "This is the Query page in the Chrome Simple DB Tool.  This page is where you add and edit Items and Query your Simple DB domains."
      id: "first",
      next: "second",
      overlay: true,
      title: "Chrome Simple DB Tool: Query Page"
    }).show()

    guiders.createGuider({
      attachTo: "#domains_table",
      buttons: [{name: "Next"}],
      description: "The domains table shows all the Simple DB domains in the selected Amazon Web Services Region.",
      id: "second",
      next: "third",
      position: 2,
      title: "Domains Table",
      width: 450,
      offset: {top:-30, left:0}
    })

    guiders.createGuider({
      attachTo: "#region_select",
      buttons: [{name: "Next"}],
      description: "The Region selector allows you to change the region that you are querying.  It updates the Domain table automatically.",
      id: "third",
      next: "forth",
      position: 2,
      title: "Regions Select",
      width: 450,
      offset: {top:-30, left:0}
    })
  
    guiders.createGuider({
      attachTo: "#create_domain",
      buttons: [{name: "Next"}],
      description: "If you need to add another domain, use the \"Create Domain\" button.",
      id: "forth",
      next: "fifth",
      position: 2,
      title: "Create Domain",
      width: 450,
      offset: {top:-30, left:0}
    })
  
    guiders.createGuider({
      attachTo: "#domain_deletion_control",
      buttons: [{name: "Next"}],
      description: "This button toggles domain deletion enablement.",
      id: "fifth",
      next: "sixth",
      position: 2,
      title: "Delete Domain Control",
      width: 450,
      offset: {top:-30, left:0}
    })
  
    guiders.createGuider({
      attachTo: "#query_expr",
      buttons: [{name: "Next", onclick:sample_query}],
      description: "Enter domain select expressions in the query box.  Don't forget to enclose your domain in backticks (\"`\") in the query",
      id: "sixth",
      next: "seven",
      position: 6,
      title: "Query your domains",
      width: 450,
      offset: {top:-30, left:0}
    })
  
    guiders.createGuider({
      attachTo: "#query_results_table",
      buttons: [{name: "Next", onclick:sample_query_results}],
      description: "Query results show up in the in the table below.",
      id: "seven",
      next: "eight",
      position: 12,
      title: "Query results",
      width: 450,
      offset: {top:-30, left:0}
    })
  
    guiders.createGuider({
      attachTo: "#query_results_table",
      buttons: [{name: "Next"}],
      description: "Scroll over an attribute and click on it to edit.",
      id: "eight",
      next: "ninth",
      position: 6,
      title: "Edit attributes",
      width: 450,
      offset: {top:-30, left:0}
    })
  
    guiders.createGuider({
      buttons: [{name: "Close",onclick:finish_tour}],
      description: "That's it!  Please submit feedback and bugs and enjoy."
      id: "ninth",
      overlay: true,
      title: "Cool? Cool..."
    })

)