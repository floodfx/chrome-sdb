

class SimpleDB

  constructor:(@profile, @endpoint="sdb.amazonaws.com")->
    @sdb_base_url = "http://#{@endpoint}?"
    
  set_profile:(profile)->
    @profile=profile
    
  build_request_url: (action,params)->
    # add required params
    params["Action"] = action
    params["Timestamp"] = AwsUtils.date_time_format()
    params["AWSAccessKeyId"] = @profile.get_settings().get_access_key()
    params["Version"] = @profile.get_settings().get_version()
    params["SignatureVersion"] = 1
    params["Signature"] = AwsUtils.generate_sig(params, @profile.get_settings().get_secret_key())
    encoded_params = for k,v of params
      k + "=" + encodeURIComponent(v)
    @sdb_base_url + encoded_params.join("&")
    
  parse_metadata: (data, text_status, req_url)->
    {
      meta:{
        req_id:$("RequestId", data).text(),
        box_usage:parseFloat($("BoxUsage", data).text()),
        status:text_status,
        req_url:req_url
      }
    }
    
  ajax_request: (url, callback, type="GET", error_callback=callback)->
    # use jquery to make request
    req_success_callback = (data, text_status)=>
      callback(this.parse_metadata(data,text_status, url), data)
      
    req_error_callback = (xhr, text_status, error)=>
      result = this.parse_metadata(xhr.responseXML, text_status, url)
      result.error = {
        msg:$("Message", xhr.responseXML).text(),
        code:$("Code", xhr.responseXML).text()
      }
      error_callback(result, xhr.responseXML)
      
    $.ajax({
      type:type, 
      url:url, 
      success:req_success_callback,      
      error:req_error_callback,
      dataType:"xml" 
      }
    )
    
  
  list_domains: (callback, max_domains=100, next_token=null)->
    action = "ListDomains"
    # validate params    
    throw "Max domains must be between 1 and 100" if max_domains not in [1..100]
    params = {      
      MaxNumberOfDomains:max_domains
    }
    params["NextToken"] = next_token if next_token

    this.ajax_request(this.build_request_url(action, params), (result, data)->
      if(result.error != null) 
        callback(result) # TODO handle better than just return the error
      domains = []
      $("DomainName", data).each((i)->
        domains.push($(this).text())
      )
      result.domains = domains
      result.next_token = $("NextToken", data).text()
      callback(result)
    )
    
  
  domainMetadata: (domain_name, callback)->
    action = "DomainMetadata"

    this.ajax_request(this.build_request_url(action, {"DomainName":domain_name}), (result, data)->
      if(result.error != null) 
        callback(result)# just return the error
      result.creation_date_time = $("CreationDateTime", data).text()
      result.item_count = parseInt($("ItemCount", data).text())
      result.item_names_size_bytes = parseInt($("ItemNamesSizeBytes", data).text())
      result.attribute_name_count = parseInt($("AttributeNameCount", data).text())
      result.attribute_names_size_bytes = parseInt($("AttributeNamesSizeBytes", data).text())
      result.attribute_value_count = parseInt($("AttributeValueCount", data).text())
      result.attribute_values_size_bytes = parseInt($("AttributeValuesSizeBytes", data).text())
      result.timestamp = $("Timestamp", data).text()
      callback(result)
    )
    
    
  select: (expression, callback, next_token=null)->
    params = {
      SelectExpression:expression
    }
    params["NextToken"] = next_token if next_token                                 
  
    this.ajax_request(this.build_request_url("Select", params), (result, data)->
      if(result.error != null) 
        callback(result)
      items = []
      $("Item", data).each((i)->
        item = {attrs:{},name:$("Name:first", $(this)).text()}
        $("Attribute", $(this)).each((j)->
          name = $("Name", $(this)).text()
          val  = $("Value", $(this)).text()
          item["attrs"][name] = [] unless item["attrs"][name]
          item["attrs"][name].push(val)
        )
        items.push(item)
      )
      result.items = items
      result.next_token = $("NextToken", data).text()
      callback(result)
    )
    