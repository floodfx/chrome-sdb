

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
    throw "Max domains must be between 1 and 100" if max_domains not in [1..100]
    params = {      
      MaxNumberOfDomains:max_domains
    }
    params["NextToken"] = next_token if next_token

    this.ajax_request(this.build_request_url("ListDomains", params), (result, data)->
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
    
  
  domain_metadata: (domain_name, callback)->
  
    this.ajax_request(this.build_request_url("DomainMetadata", {"DomainName":domain_name}), (result, data)->
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
    
    
  get_attributes: (domain_name, item_name, callback, attribute_names=[])->
    params = {
      DomainName:domain_name, 
      ItemName:item_name
    }
    for i in [0...attribute_names.length]
      params["AttributeName.#{i}"] = attribute_names[i]
  
    this.ajax_request(this.build_request_url("GetAttributes", params), (result, data)->
      if(result.error != null) 
        callback(result)
      attributes = {}
      $("Attribute", data).each((i)->
        name = $("Name", $(this)).text()
        value = $("Value", $(this)).text()
        attributes[name] = [] unless attributes[name]
        attributes[name].push(value)
      )
      result.attributes = attributes
      callback(result)
    )   
    
  put_attributes: (domain_name, item_name, attribute_objects, callback)->
    params = {
      DomainName:domain_name, 
      ItemName:item_name
    }
    # format of attribute_objects is:
    # [{name:attr_name,values:[attr_val1,attr_val2],replace:boolean}]
    attr_param_count = 0
    for attr_object in attribute_objects
      attr_values = attr_object["values"]
      for v in attr_values
        params["Attribute.#{attr_param_count}.Name"] = attr_object["name"]
        params["Attribute.#{attr_param_count}.Value"] = v
        if attr_object["replace"] && attr_object["replace"] == true
          params["Attribute.#{attr_param_count}.Replace"] = true 
        attr_param_count += 1

    this.ajax_request(this.build_request_url("PutAttributes", params), (result, data)->
      #TODO handle error
      callback(result)
    )
    
  delete_attributes: (domain_name, item_name, attribute_objects, callback)->
    params = {
      DomainName:domain_name, 
      ItemName:item_name
    }
    
    # format of attribute_objects is:
    # [{name:attr_name,values:[attr_val1,attr_val2]}]
    attr_param_count = 0
    for attr_object in attribute_objects     
      attr_values = attr_object["values"]
      if attr_values
        for v in attr_values
          params["Attribute.#{attr_param_count}.Name"] = attr_object["name"]
          params["Attribute.#{attr_param_count}.Value"] = v
          attr_param_count += 1 
      else
        params["Attribute.#{attr_param_count}.Name"] = attr_object["name"]
        attr_param_count += 1 

    this.ajax_request(this.build_request_url("DeleteAttributes", params), (result, data)->
      #TODO handle error
      callback(result)
    )
  
  batch_delete_attributes: (domain_name, item_attribute_objects, callback)->
    params = {
      DomainName:domain_name
    }
    
    # TODO make these Classes
    #format of item_attribute_objects is
    #[{item_name:name,item_attrs:[{name:attr_name,values:[attr_val1,attr_val2]}]},
    # {item_name:name2,item_attrs:[{name:attr_name,values:[attr_val1,attr_val2]}]}]
    for i in [0...item_attribute_objects.length]
      item_attr_obj = item_attribute_objects[i]
      item_name = item_attr_obj["item_name"]
      params["Item.#{i}.ItemName"] = item_name
      attr_param_count = 0
      for attr_object in item_attr_obj["item_attrs"]     
        attr_values = attr_object["values"]
        if attr_values
          for v in attr_values
            params["Item.#{i}.Attribute.#{attr_param_count}.Name"] = attr_object["name"]
            params["Item.#{i}.Attribute.#{attr_param_count}.Value"] = v
            attr_param_count += 1 
        else
          params["Item.#{i}.Attribute.#{attr_param_count}.Name"] = attr_object["name"]
          attr_param_count += 1
    this.ajax_request(this.build_request_url("BatchDeleteAttributes", params), (result, data)->
      #TODO handle error
      callback(result)
    )
     
  batch_put_attributes: (domain_name, item_attribute_objects, callback)->
    params = {
      DomainName:domain_name
    }

    # TODO make these Classes
    #format of item_attribute_objects is
    #[{item_name:name,item_attrs:[{name:attr_name,values:[attr_val1,attr_val2],replace:boolean}],
    # {item_name:name2,item_attrs:[{name:attr_name,values:[attr_val1,attr_val2],replace:boolean}]}]
    for i in [0...item_attribute_objects.length]
      item_attr_obj = item_attribute_objects[i]
      item_name = item_attr_obj["item_name"]
      params["Item.#{i}.ItemName"] = item_name
      attr_param_count = 0
      for attr_object in item_attr_obj["item_attrs"]
        attr_values = attr_object["values"]
        for v in attr_values
          params["Item.#{i}.Attribute.#{attr_param_count}.Name"] = attr_object["name"]
          params["Item.#{i}.Attribute.#{attr_param_count}.Value"] = v
          if attr_object["replace"] && attr_object["replace"] == true
            params["Item.#{i}.Attribute.#{attr_param_count}.Replace"] = true 
          attr_param_count += 1
    this.ajax_request(this.build_request_url("BatchPutAttributes", params), (result, data)->
      #TODO handle error
      callback(result)
    ) 
  
  create_domain: (domain_name, callback)->
    this.ajax_request(this.build_request_url("CreateDomain", {"DomainName":domain_name}), (result, data)->
      #TODO handle error
      callback(result)
    )

  delete_domain: (domain_name, callback)->
    this.ajax_request(this.build_request_url("DeleteDomain", {"DomainName":domain_name}), (result, data)->
      #TODO handle error
      callback(result)
    )

