var SHA1;
SHA1 = (function() {
  var binb2rstr, binb_sha1, bit_rol, pub, rstr2any, rstr2b64, rstr2binb, rstr2hex, rstr_hmac_sha1, rstr_sha1, safe_add, sha1_ft, sha1_kt, str2rstr_utf16be, str2rstr_utf16le, str2rstr_utf8;
  pub = {};
  rstr_sha1 = function(s) {
    return binb2rstr(binb_sha1(rstr2binb(s), s.length * 8));
  };
  rstr_hmac_sha1 = function(key, data) {
    var bkey, hash, i, ipad, opad;
    bkey = rstr2binb(key);
    if (bkey.length > 16) {
      bkey = binb_sha1(bkey, key.length * 8);
    }
    ipad = Array(16);
    opad = Array(16);
    for (i = 0; i < 16; i++) {
      ipad[i] = bkey[i] ^ 0x36363636;
      opad[i] = bkey[i] ^ 0x5C5C5C5C;
    }
    hash = binb_sha1(ipad.concat(rstr2binb(data)), 512 + data.length * 8);
    return binb2rstr(binb_sha1(opad.concat(hash), 512 + 160));
  };
  rstr2hex = function(input, lower_hexcase) {
    var hex_tab, i, output, x, _ref;
    if (lower_hexcase == null) {
      lower_hexcase = true;
    }
    hex_tab = lower_hexcase ? "0123456789abcdef" : "0123456789ABCDEF";
    output = "";
    for (i = 0, _ref = input.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
      x = input.charCodeAt(i);
      output += hex_tab.charAt((x >>> 4) & 0x0F) + hex_tab.charAt(x & 0x0F);
    }
    return output;
  };
  rstr2b64 = function(input, b64pad) {
    var i, j, len, output, tab, triplet;
    if (b64pad == null) {
      b64pad = "=";
    }
    tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    output = "";
    len = input.length;
    for (i = 0; i < len; i += 3) {
      triplet = (input.charCodeAt(i) << 16) | (i + 1 < len ? input.charCodeAt(i + 1) << 8 : 0) | (i + 2 < len ? input.charCodeAt(i + 2) : 0);
      for (j = 0; j < 4; j++) {
        if (i * 8 + j * 6 > input.length * 8) {
          output += b64pad;
        } else {
          output += tab.charAt((triplet >>> 6 * (3 - j)) & 0x3F);
        }
      }
    }
    return output;
  };
  rstr2any = function(input, encoding) {
    var dividend, divisor, full_length, i, output, q, quotient, remainders, x, _ref, _ref2, _ref3, _ref4;
    divisor = encoding.length;
    remainders = Array();
    dividend = Array(Math.ceil(input.length / 2));
    for (i = 0, _ref = dividend.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
      dividend[i] = (input.charCodeAt(i * 2) << 8) | input.charCodeAt(i * 2 + 1);
    }
    while (dividend.length > 0) {
      quotient = Array();
      x = 0;
      for (i = 0, _ref2 = dividend.length; 0 <= _ref2 ? i < _ref2 : i > _ref2; 0 <= _ref2 ? i++ : i--) {
        x = (x << 16) + dividend[i];
        q = Math.floor(x / divisor);
        x -= q * divisor;
        if (quotient.length > 0 || q > 0) {
          quotient[quotient.length] = q;
        }
      }
      remainders[remainders.length] = x;
      dividend = quotient;
    }
    output = "";
    for (i = _ref3 = remainders.length - 1; _ref3 <= 0 ? i <= 0 : i >= 0; _ref3 <= 0 ? i++ : i--) {
      output += encoding.charAt(remainders[i]);
    }
    full_length = Math.ceil(input.length * 8 / (Math.log(encoding.length) / Math.log(2)));
    for (i = _ref4 = output.length; _ref4 <= full_length ? i <= full_length : i >= full_length; _ref4 <= full_length ? i++ : i--) {
      output = encoding[0] + output;
    }
    return output;
  };
  str2rstr_utf8 = function(input) {
    var i, output, x, y, _ref;
    output = "";
    for (i = 0, _ref = input.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
      x = input.charCodeAt(i);
      y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
      if (0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF) {
        x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
        i++;
      }
      if (x <= 0x7F) {
        output += String.fromCharCode(x);
      } else if (x <= 0x7FF) {
        output += String.fromCharCode(0xC0 | ((x >>> 6) & 0x1F), 0x80 | (x & 0x3F));
      } else if (x <= 0xFFFF) {
        output += String.fromCharCode(0xE0 | ((x >>> 12) & 0x0F), 0x80 | ((x >>> 6) & 0x3F), 0x80 | (x & 0x3F));
      } else if (x <= 0x1FFFFF) {
        output += String.fromCharCode(0xF0 | ((x >>> 18) & 0x07), 0x80 | ((x >>> 12) & 0x3F), 0x80 | ((x >>> 6) & 0x3F), 0x80 | (x & 0x3F));
      }
    }
    return output;
  };
  /*
     Encode a string as utf-16
    */
  str2rstr_utf16le = function(input) {
    var i, output, _ref;
    output = "";
    for (i = 0, _ref = input.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
      output += String.fromCharCode(input.charCodeAt(i) & 0xFF, (input.charCodeAt(i) >>> 8) & 0xFF);
    }
    return output;
  };
  str2rstr_utf16be = function(input) {
    var i, output, _ref;
    output = "";
    for (i = 0, _ref = input.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
      output += String.fromCharCode((input.charCodeAt(i) >>> 8) & 0xFF, input.charCodeAt(i) & 0xFF);
    }
    return output;
  };
  /*
     Convert a raw string to an array of big-endian words
     Characters >255 have their high-byte silently ignored.
    */
  rstr2binb = function(input) {
    var i, output, _ref, _ref2;
    output = Array(input.length >> 2);
    for (i = 0, _ref = output.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
      output[i] = 0;
    }
    for (i = 0, _ref2 = input.length * 8; i < _ref2; i += 8) {
      output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (24 - i % 32);
    }
    return output;
  };
  /*
     Convert an array of little-endian words to a string
    */
  binb2rstr = function(input) {
    var i, output, _ref;
    output = "";
    for (i = 0, _ref = input.length * 32; i < _ref; i += 8) {
      output += String.fromCharCode((input[i >> 5] >>> (24 - i % 32)) & 0xFF);
    }
    return output;
  };
  /*
     Calculate the SHA-1 of an array of big-endian words, and a bit length
    */
  binb_sha1 = function(x, len) {
    var a, b, c, d, e, i, j, olda, oldb, oldc, oldd, olde, t, w, _ref;
    x[len >> 5] |= 0x80 << (24 - len % 32);
    x[((len + 64 >> 9) << 4) + 15] = len;
    w = Array(80);
    a = 1732584193;
    b = -271733879;
    c = -1732584194;
    d = 271733878;
    e = -1009589776;
    for (i = 0, _ref = x.length; i < _ref; i += 16) {
      olda = a;
      oldb = b;
      oldc = c;
      oldd = d;
      olde = e;
      for (j = 0; j < 80; j++) {
        if (j < 16) {
          w[j] = x[i + j];
        } else {
          w[j] = bit_rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
        }
        t = safe_add(safe_add(bit_rol(a, 5), sha1_ft(j, b, c, d)), safe_add(safe_add(e, w[j]), sha1_kt(j)));
        e = d;
        d = c;
        c = bit_rol(b, 30);
        b = a;
        a = t;
      }
      a = safe_add(a, olda);
      b = safe_add(b, oldb);
      c = safe_add(c, oldc);
      d = safe_add(d, oldd);
      e = safe_add(e, olde);
    }
    return Array(a, b, c, d, e);
  };
  /*
     Perform the appropriate triplet combination function for the current iteration
    */
  sha1_ft = function(t, b, c, d) {
    if (t < 20) {
      return (b & c) | ((~b) & d);
    } else if (t < 40) {
      return b ^ c ^ d;
    } else if (t < 60) {
      return (b & c) | (b & d) | (c & d);
    } else {
      return b ^ c ^ d;
    }
  };
  /*
     Determine the appropriate additive constant for the current iteration
    */
  sha1_kt = function(t) {
    if (t < 20) {
      return 1518500249;
    } else if (t < 40) {
      return 1859775393;
    } else if (t < 60) {
      return -1894007588;
    } else {
      return -899497514;
    }
  };
  /*
     Add integers, wrapping at 2^32. This uses 16-bit operations internally
     to work around bugs in some JS interpreters.
    */
  safe_add = function(x, y) {
    var lsw, msw;
    lsw = (x & 0xFFFF) + (y & 0xFFFF);
    msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
  };
  /*
     Bitwise rotate a 32-bit number to the left.
    */
  bit_rol = function(num, cnt) {
    return (num << cnt) | (num >>> (32 - cnt));
  };
  pub.hex_sha1 = function(s) {
    return rstr2hex(rstr_sha1(str2rstr_utf8(s)));
  };
  pub.b64_sha1 = function(s) {
    return rstr2b64(rstr_sha1(str2rstr_utf8(s)));
  };
  pub.any_sha1 = function(s, e) {
    return rstr2any(rstr_sha1(str2rstr_utf8(s)), e);
  };
  pub.hex_hmac_sha1 = function(k, d) {
    return rstr2hex(rstr_hmac_sha1(str2rstr_utf8(k), str2rstr_utf8(d)));
  };
  pub.b64_hmac_sha1 = function(k, d) {
    return rstr2b64(rstr_hmac_sha1(str2rstr_utf8(k), str2rstr_utf8(d)));
  };
  pub.any_hmac_sha1 = function(k, d, e) {
    return rstr2any(rstr_hmac_sha1(str2rstr_utf8(k), str2rstr_utf8(d)), e);
  };
  return pub;
})();var AwsUtils;
AwsUtils = (function() {
  var hhmmss, pub, sort_lower_case, yyyymmdd, zeropad;
  zeropad = function(to_pad) {
    to_pad = to_pad.toString();
    if (to_pad.length < 2) {
      to_pad = "0" + to_pad;
    }
    return to_pad;
  };
  yyyymmdd = function(date) {
    return [date.getUTCFullYear(), zeropad(date.getUTCMonth() + 1), zeropad(date.getUTCDate())].join("-");
  };
  hhmmss = function(date) {
    return [zeropad(date.getUTCHours()), zeropad(date.getUTCMinutes()), zeropad(date.getUTCSeconds())].join(':');
  };
  sort_lower_case = function(s1, s2) {
    if (s1 === s2) {
      return 0;
    } else {
      if (s1.toLowerCase() > s2.toLowerCase()) {
        return 1;
      } else {
        return -1;
      }
    }
  };
  pub = {};
  pub.date_time_format = function(date) {
    if (date == null) {
      date = new Date();
    }
    return "" + (yyyymmdd(date)) + "T" + (hhmmss(date)) + ".000Z";
  };
  pub.generate_sig = function(params, aws_secret_key) {
    var k, param_keys, to_sign, v;
    param_keys = (function() {
      var _results;
      _results = [];
      for (k in params) {
        v = params[k];
        _results.push(k);
      }
      return _results;
    })();
    param_keys.sort(sort_lower_case);
    to_sign = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = param_keys.length; _i < _len; _i++) {
        k = param_keys[_i];
        _results.push("" + k + params[k]);
      }
      return _results;
    })();
    return SHA1.b64_hmac_sha1(aws_secret_key, to_sign.join(""));
  };
  return pub;
})();var SimpleDB;
var __indexOf = Array.prototype.indexOf || function(item) {
  for (var i = 0, l = this.length; i < l; i++) {
    if (this[i] === item) return i;
  }
  return -1;
};
SimpleDB = (function() {
  function SimpleDB(profile, secure, error_callback) {
    this.profile = profile;
    this.secure = secure != null ? secure : false;
    this.error_callback = error_callback != null ? error_callback : this.default_callback;
    this.protocol = this.secure ? "https" : "http";
    this.endpoint = this.profile.get_settings().get_region();
    this.sdb_base_url = "" + this.protocol + "://" + this.endpoint + "?";
  }
  SimpleDB.prototype.set_profile = function(profile) {
    return this.profile = profile;
  };
  SimpleDB.prototype.default_callback = function(results, xmldoc) {
    if (xmldoc == null) {
      xmldoc = null;
    }
    console.log(results);
    if (xmldoc !== null) {
      return console.log(xmldoc);
    }
  };
  SimpleDB.prototype.build_request_url = function(action, params) {
    var encoded_params, k, v;
    params["Action"] = action;
    params["Timestamp"] = AwsUtils.date_time_format();
    params["AWSAccessKeyId"] = this.profile.get_settings().get_access_key();
    params["Version"] = this.profile.get_settings().get_version();
    params["SignatureVersion"] = 1;
    params["Signature"] = AwsUtils.generate_sig(params, this.profile.get_settings().get_secret_key());
    encoded_params = (function() {
      var _results;
      _results = [];
      for (k in params) {
        v = params[k];
        _results.push(k + "=" + encodeURIComponent(v));
      }
      return _results;
    })();
    return this.sdb_base_url + encoded_params.join("&");
  };
  SimpleDB.regions = function() {
    return [
      {
        name: "US East (Northern Virginia) Region",
        endpoint: "sdb.amazonaws.com"
      }, {
        name: "US West (Oregon) Region",
        endpoint: "sdb.us-west-2.amazonaws.com"
      }, {
        name: "US West (Northern California) Region",
        endpoint: "sdb.us-west-1.amazonaws.com"
      }, {
        name: "EU (Ireland) Region",
        endpoint: "sdb.eu-west-1.amazonaws.com"
      }, {
        name: "Asia Pacific (Singapore) Region",
        endpoint: "sdb.ap-southeast-1.amazonaws.com"
      }, {
        name: "Asia Pacific (Tokyo) Region",
        endpoint: "sdb.ap-northeast-1.amazonaws.com"
      }, {
        name: "South America (Sao Paulo) Region",
        endpoint: "sdb.sa-east-1.amazonaws.com"
      }
    ];
  };
  SimpleDB.parse_metadata = function(data, text_status, req_url) {
    return {
      meta: {
        req_id: $("RequestId", data).text(),
        box_usage: parseFloat($("BoxUsage", data).text()),
        status: text_status,
        req_url: req_url
      }
    };
  };
  SimpleDB.prototype.ajax_request = function(url, callback, type, error_callback) {
    var req_error_callback, req_success_callback;
    if (type == null) {
      type = "GET";
    }
    if (error_callback == null) {
      error_callback = this.error_callback;
    }
    req_success_callback = function(data, text_status) {
      return callback(SimpleDB.parse_metadata(data, text_status, url), data);
    };
    req_error_callback = function(xhr, text_status, error) {
      var result;
      result = SimpleDB.parse_metadata(xhr.responseXML, text_status, url);
      result.error = {
        msg: $("Message", xhr.responseXML).text(),
        code: $("Code", xhr.responseXML).text()
      };
      return error_callback(result, xhr.responseXML);
    };
    return $.ajax({
      type: type,
      url: url,
      success: req_success_callback,
      error: req_error_callback,
      dataType: "xml"
    });
  };
  SimpleDB.prototype.list_domains = function(callback, max_domains, next_token) {
    var params, _i, _results;
    if (callback == null) {
      callback = this.default_callback;
    }
    if (max_domains == null) {
      max_domains = 100;
    }
    if (next_token == null) {
      next_token = null;
    }
    if (__indexOf.call((function() {
      _results = [];
      for (_i = 1; _i <= 100; _i++){ _results.push(_i); }
      return _results;
    }).apply(this), max_domains) < 0) {
      throw "Max domains must be between 1 and 100";
    }
    params = {
      MaxNumberOfDomains: max_domains
    };
    if (next_token) {
      params["NextToken"] = next_token;
    }
    return this.ajax_request(this.build_request_url("ListDomains", params), function(result, data) {
      var domains;
      domains = [];
      $("DomainName", data).each(function(i) {
        return domains.push($(this).text());
      });
      result.domains = domains;
      result.next_token = $("NextToken", data).text();
      return callback(result);
    });
  };
  SimpleDB.prototype.domain_metadata = function(domain_name, callback) {
    if (callback == null) {
      callback = this.default_callback;
    }
    return this.ajax_request(this.build_request_url("DomainMetadata", {
      "DomainName": domain_name
    }), function(result, data) {
      result.creation_date_time = $("CreationDateTime", data).text();
      result.item_count = parseInt($("ItemCount", data).text());
      result.item_names_size_bytes = parseInt($("ItemNamesSizeBytes", data).text());
      result.attribute_name_count = parseInt($("AttributeNameCount", data).text());
      result.attribute_names_size_bytes = parseInt($("AttributeNamesSizeBytes", data).text());
      result.attribute_value_count = parseInt($("AttributeValueCount", data).text());
      result.attribute_values_size_bytes = parseInt($("AttributeValuesSizeBytes", data).text());
      result.timestamp = $("Timestamp", data).text();
      return callback(result);
    });
  };
  SimpleDB.prototype.select = function(expression, callback, next_token) {
    var params;
    if (callback == null) {
      callback = this.default_callback;
    }
    if (next_token == null) {
      next_token = null;
    }
    params = {
      SelectExpression: expression
    };
    if (next_token) {
      params["NextToken"] = next_token;
    }
    return this.ajax_request(this.build_request_url("Select", params), function(result, data) {
      var attr_name, attr_name2, attr_names, items;
      items = [];
      attr_names = {};
      $("Item", data).each(function(i) {
        var item;
        item = {
          attrs: {},
          name: $("Name:first", $(this)).text()
        };
        $("Attribute", $(this)).each(function(j) {
          var name, val;
          name = $("Name", $(this)).text();
          attr_names[name] = name;
          val = $("Value", $(this)).text();
          if (!item["attrs"][name]) {
            item["attrs"][name] = [];
          }
          return item["attrs"][name].push(val);
        });
        return items.push(item);
      });
      result.items = items;
      result.attr_names = (function() {
        var _results;
        _results = [];
        for (attr_name in attr_names) {
          attr_name2 = attr_names[attr_name];
          _results.push(attr_name);
        }
        return _results;
      })();
      next_token = $("NextToken", data).text();
      if (next_token !== "") {
        result.next_token = next_token;
      }
      return callback(result);
    });
  };
  SimpleDB.prototype.get_attributes = function(domain_name, item_name, callback, attribute_names) {
    var i, params, _ref;
    if (callback == null) {
      callback = this.default_callback;
    }
    if (attribute_names == null) {
      attribute_names = [];
    }
    params = {
      DomainName: domain_name,
      ItemName: item_name
    };
    for (i = 0, _ref = attribute_names.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
      params["AttributeName." + i] = attribute_names[i];
    }
    return this.ajax_request(this.build_request_url("GetAttributes", params), function(result, data) {
      var attributes;
      if ((result.error != null)) {
        callback(result);
      }
      attributes = {};
      $("Attribute", data).each(function(i) {
        var name, value;
        name = $("Name", $(this)).text();
        value = $("Value", $(this)).text();
        if (!attributes[name]) {
          attributes[name] = [];
        }
        return attributes[name].push(value);
      });
      result.attributes = attributes;
      return callback(result);
    });
  };
  SimpleDB.prototype.put_attributes = function(domain_name, item_name, attribute_objects, callback) {
    var attr_object, attr_param_count, attr_values, params, v, _i, _j, _len, _len2;
    if (callback == null) {
      callback = this.default_callback;
    }
    params = {
      DomainName: domain_name,
      ItemName: item_name
    };
    attr_param_count = 0;
    for (_i = 0, _len = attribute_objects.length; _i < _len; _i++) {
      attr_object = attribute_objects[_i];
      attr_values = attr_object["values"];
      for (_j = 0, _len2 = attr_values.length; _j < _len2; _j++) {
        v = attr_values[_j];
        params["Attribute." + attr_param_count + ".Name"] = attr_object["name"];
        params["Attribute." + attr_param_count + ".Value"] = v;
        if (attr_object["replace"] && attr_object["replace"] === true) {
          params["Attribute." + attr_param_count + ".Replace"] = true;
        }
        attr_param_count += 1;
      }
    }
    return this.ajax_request(this.build_request_url("PutAttributes", params), function(result, data) {
      return callback(result);
    });
  };
  SimpleDB.prototype.delete_attributes = function(domain_name, item_name, attribute_objects, callback) {
    var attr_object, attr_param_count, attr_values, params, v, _i, _j, _len, _len2;
    if (callback == null) {
      callback = this.default_callback;
    }
    params = {
      DomainName: domain_name,
      ItemName: item_name
    };
    attr_param_count = 0;
    for (_i = 0, _len = attribute_objects.length; _i < _len; _i++) {
      attr_object = attribute_objects[_i];
      attr_values = attr_object["values"];
      if (attr_values) {
        for (_j = 0, _len2 = attr_values.length; _j < _len2; _j++) {
          v = attr_values[_j];
          params["Attribute." + attr_param_count + ".Name"] = attr_object["name"];
          params["Attribute." + attr_param_count + ".Value"] = v;
          attr_param_count += 1;
        }
      } else {
        params["Attribute." + attr_param_count + ".Name"] = attr_object["name"];
        attr_param_count += 1;
      }
    }
    return this.ajax_request(this.build_request_url("DeleteAttributes", params), function(result, data) {
      return callback(result);
    });
  };
  SimpleDB.prototype.batch_delete_attributes = function(domain_name, item_attribute_objects, callback) {
    var attr_object, attr_param_count, attr_values, i, item_attr_obj, item_name, params, v, _i, _j, _len, _len2, _ref, _ref2;
    if (callback == null) {
      callback = this.default_callback;
    }
    params = {
      DomainName: domain_name
    };
    for (i = 0, _ref = item_attribute_objects.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
      item_attr_obj = item_attribute_objects[i];
      item_name = item_attr_obj["item_name"];
      params["Item." + i + ".ItemName"] = item_name;
      attr_param_count = 0;
      _ref2 = item_attr_obj["item_attrs"];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        attr_object = _ref2[_i];
        attr_values = attr_object["values"];
        if (attr_values) {
          for (_j = 0, _len2 = attr_values.length; _j < _len2; _j++) {
            v = attr_values[_j];
            params["Item." + i + ".Attribute." + attr_param_count + ".Name"] = attr_object["name"];
            params["Item." + i + ".Attribute." + attr_param_count + ".Value"] = v;
            attr_param_count += 1;
          }
        } else {
          params["Item." + i + ".Attribute." + attr_param_count + ".Name"] = attr_object["name"];
          attr_param_count += 1;
        }
      }
    }
    return this.ajax_request(this.build_request_url("BatchDeleteAttributes", params), function(result, data) {
      return callback(result);
    });
  };
  SimpleDB.prototype.batch_put_attributes = function(domain_name, item_attribute_objects, callback) {
    var attr_object, attr_param_count, attr_values, i, item_attr_obj, item_name, params, v, _i, _j, _len, _len2, _ref, _ref2;
    if (callback == null) {
      callback = this.default_callback;
    }
    params = {
      DomainName: domain_name
    };
    for (i = 0, _ref = item_attribute_objects.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
      item_attr_obj = item_attribute_objects[i];
      item_name = item_attr_obj["item_name"];
      params["Item." + i + ".ItemName"] = item_name;
      attr_param_count = 0;
      _ref2 = item_attr_obj["item_attrs"];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        attr_object = _ref2[_i];
        attr_values = attr_object["values"];
        for (_j = 0, _len2 = attr_values.length; _j < _len2; _j++) {
          v = attr_values[_j];
          params["Item." + i + ".Attribute." + attr_param_count + ".Name"] = attr_object["name"];
          params["Item." + i + ".Attribute." + attr_param_count + ".Value"] = v;
          if (attr_object["replace"] && attr_object["replace"] === true) {
            params["Item." + i + ".Attribute." + attr_param_count + ".Replace"] = true;
          }
          attr_param_count += 1;
        }
      }
    }
    return this.ajax_request(this.build_request_url("BatchPutAttributes", params), function(result, data) {
      return callback(result);
    });
  };
  SimpleDB.prototype.create_domain = function(domain_name, callback) {
    if (callback == null) {
      callback = this.default_callback;
    }
    return this.ajax_request(this.build_request_url("CreateDomain", {
      "DomainName": domain_name
    }), function(result, data) {
      return callback(result);
    });
  };
  SimpleDB.prototype.delete_domain = function(domain_name, callback) {
    if (callback == null) {
      callback = this.default_callback;
    }
    return this.ajax_request(this.build_request_url("DeleteDomain", {
      "DomainName": domain_name
    }), function(result, data) {
      return callback(result);
    });
  };
  return SimpleDB;
})();var Storage;
Storage = (function() {
  var pub;
  pub = {};
  pub.get = function(key, is_json) {
    var val;
    if (is_json == null) {
      is_json = false;
    }
    val = localStorage.getItem(key);
    if (is_json) {
      val = JSON.parse(val);
    }
    return val;
  };
  pub.set = function(key, val, is_json) {
    if (is_json == null) {
      is_json = false;
    }
    if (is_json) {
      val = JSON.stringify(val);
    }
    localStorage.setItem(key, val);
    return val;
  };
  pub.del = function(key) {
    return localStorage.removeItem(key);
  };
  return pub;
})();var Settings;
Settings = (function() {
  function Settings(access_key, secret_key, region, version, https_protocol) {
    this.access_key = access_key;
    this.secret_key = secret_key;
    this.region = region != null ? region : "sdb.amazonaws.com";
    this.version = version != null ? version : "2009-04-15";
    this.https_protocol = https_protocol != null ? https_protocol : false;
  }
  Settings.prototype.use_access_key = function(access_key) {
    this.access_key = access_key;
    return this;
  };
  Settings.prototype.use_secret_key = function(secret_key) {
    this.secret_key = secret_key;
    return this;
  };
  Settings.prototype.use_region = function(region) {
    this.region = region;
    return this;
  };
  Settings.prototype.use_version = function(version) {
    this.version = version;
    return this;
  };
  Settings.prototype.use_https_protocol = function(true_or_false) {
    this.https_protocol = true_or_false;
    return this;
  };
  Settings.prototype.get_access_key = function() {
    return this.access_key;
  };
  Settings.prototype.get_secret_key = function() {
    return this.secret_key;
  };
  Settings.prototype.get_region = function() {
    return this.region;
  };
  Settings.prototype.get_version = function() {
    return this.version;
  };
  Settings.prototype.get_use_https = function() {
    return this.https_protocol;
  };
  Settings.prototype.to_json = function() {
    return {
      access_key: this.access_key,
      secret_key: this.secret_key,
      region: this.region,
      version: this.version,
      https_protocol: this.https_protocol
    };
  };
  Settings.from_json = function(json) {
    if (json) {
      return new Settings(json["access_key"], json["secret_key"], json["region"], json["version"], json["https_protocol"]);
    } else {
      return null;
    }
  };
  return Settings;
})();var Profile;
Profile = (function() {
  function Profile(name, settings) {
    this.name = name;
    this.settings = settings;
  }
  Profile.prototype.use_name = function(name) {
    this.name = name;
    return this;
  };
  Profile.prototype.use_settings = function(settings) {
    this.settings = settings;
    return this;
  };
  Profile.prototype.get_name = function() {
    return this.name;
  };
  Profile.prototype.get_settings = function() {
    return this.settings;
  };
  Profile.prototype.make_primary = function() {
    Storage.set("chrome-sdb.primary-profile", this.name);
    return this;
  };
  Profile.prototype.save = function(make_primary) {
    var found, primary, profile, profiles, _i, _len;
    if (make_primary == null) {
      make_primary = false;
    }
    profiles = Profile.find_all();
    found = false;
    for (_i = 0, _len = profiles.length; _i < _len; _i++) {
      profile = profiles[_i];
      if (this.name === profile.get_name()) {
        profile.use_settings(this.settings);
        found = true;
      }
    }
    if (!found) {
      profiles.push(this);
    }
    Storage.set("chrome-sdb.profiles", Profile.profiles_json(profiles), true);
    primary = Profile.primary();
    if (primary === null || make_primary) {
      this.make_primary();
    }
    return this;
  };
  Profile.prototype["delete"] = function() {
    Profile["delete"](this.name);
    return null;
  };
  Profile.prototype.to_json = function() {
    return {
      name: this.name,
      settings: this.settings.to_json()
    };
  };
  Profile.primary = function() {
    var primary_name;
    primary_name = Storage.get("chrome-sdb.primary-profile");
    return Profile.find(primary_name);
  };
  Profile.from_json = function(json) {
    if (json) {
      return new Profile(json["name"], Settings.from_json(json["settings"]));
    } else {
      return null;
    }
  };
  Profile.find_all = function() {
    var name, profiles, profiles_json, settings, _ref;
    profiles_json = (_ref = Storage.get("chrome-sdb.profiles", true)) != null ? _ref : {};
    return profiles = (function() {
      var _results;
      _results = [];
      for (name in profiles_json) {
        settings = profiles_json[name];
        _results.push(new Profile(name, Settings.from_json(settings)));
      }
      return _results;
    })();
  };
  Profile.find = function(by_name) {
    var profile, profiles, _i, _len;
    profiles = Profile.find_all();
    for (_i = 0, _len = profiles.length; _i < _len; _i++) {
      profile = profiles[_i];
      if (profile.get_name() === by_name) {
        return profile;
      }
    }
    return null;
  };
  Profile.profiles_json = function(profiles) {
    var profile, profiles_json, _i, _len;
    profiles_json = {};
    for (_i = 0, _len = profiles.length; _i < _len; _i++) {
      profile = profiles[_i];
      profiles_json[profile.get_name()] = profile.get_settings().to_json();
    }
    return profiles_json;
  };
  Profile.delete_all = function() {
    return Storage.set("chrome-sdb.profiles", {}, true);
  };
  Profile["delete"] = function(name) {
    var i, new_profiles, profiles, _ref;
    profiles = Profile.find_all();
    new_profiles = [];
    for (i = 0, _ref = profiles.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
      if (profiles[i].get_name() !== name) {
        new_profiles.push(profiles[i]);
      }
    }
    return Storage.set("chrome-sdb.profiles", Profile.profiles_json(new_profiles), true);
  };
  return Profile;
})();var add_domains, add_item, confirm_delete, confirm_delete_item, delete_domain, delete_item, disable_delete, domain_from_query, edit_item, enable_delete, handle_delete_toggle, handle_error, handle_query, metadata, profile, query, save_domain, save_item, sdb, update_domains_table, update_region;
profile = Profile.primary();
handle_error = function(results, xmldoc) {
  var error_code, error_msg, url;
  error_code = results.error.code;
  error_msg = results.error.msg;
  url = results.meta.req_url;
  $("#error_code").text(error_code);
  $("#error_msg").text(error_msg);
  $("#error_url").attr("href", url);
  $("#message_box").show();
  return $("#query_btn").button('reset');
};
if (!profile) {
  window.location = "config.html";
} else {
  sdb = new SimpleDB(profile, false, handle_error);
  $(function() {
    return update_domains_table();
  });
}
update_region = function(region) {
  profile.get_settings().use_region(region);
  profile.save();
  sdb = new SimpleDB(profile, false, handle_error);
  return update_domains_table();
};
$(function() {
  var region, _i, _len, _ref;
  _ref = SimpleDB.regions();
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    region = _ref[_i];
    $("#region_select").append($('<option>', {
      value: region["endpoint"]
    }).text(region["name"]));
  }
  $("#region_select").val(profile.get_settings().get_region());
  $("#region_select").change(function() {
    region = $("#region_select").val();
    return update_region(region);
  });
  $("#domain_table_div").height($(window).height() - 200);
  $(window).resize(function() {
    return $("#domain_table_div").height($(this).height() - 200);
  });
  $('#query_btn').click(function() {
    return query();
  });
  $('#add_item').click(function() {
    return add_item();
  });
  $('#domain_deletion_control').click(function() {
    return handle_delete_toggle();
  });
  $('#save_attribute_btn').click(function() {
    return save_item();
  });
  $('#save_domain').click(function() {
    return save_domain();
  });
  $('#save_domain_cancel').click(function() {
    return $('#create_domain_modal').modal('hide');
  });
  $('#reset_attribute_btn_cancel').click(function() {
    return $('#add_edit_item_attributes').modal('hide');
  });
  $('#confirm_delete_domain_btn_cancel').click(function() {
    return $('#confirm_delete_domain_modal').modal('hide');
  });
  $('#metadata_btn_ok').click(function() {
    return $('#domain_metadata_modal').modal('hide');
  });
  $('.msg_box_close').click(function() {
    return $('#message_box').hide();
  });
  $('#delete_item_btn_yes').click(function() {
    return delete_item();
  });
  $('#delete_item_btn_cancel').click(function() {
    return $('#item_delete_modal').hide();
  });
  return $("input[name=confirm_delete]").keydown(function(key) {
    if ($("input[name=confirm_delete]").val() === "DELET" && key.keyCode === 69) {
      return $("#confirm_delete_domain_btn").removeAttr("disabled").addClass("danger").removeClass("secondary");
    } else {
      return $("#confirm_delete_domain_btn").attr("disabled", "disabled").addClass("secondary").removeClass("danger");
    }
  });
});
add_domains = function(domains) {
  var btn_del, btn_md, domain, name, td, tr, _i, _j, _len, _len2, _results;
  if (domains.length === 0) {
    tr = "<tr><td>No domains in this region</td></tr>";
    return $("#domains_table > tbody").html(tr);
  } else {
    $("#domains_table > tbody").html('');
    for (_i = 0, _len = domains.length; _i < _len; _i++) {
      domain = domains[_i];
      btn_md = $("<button id=\"metadata_" + domain + "\" class=\"btn info\">metadata</a>");
      btn_md.click(function() {
        return metadata(domain);
      });
      btn_del = $("<button id=\"delete_" + domain + "\" class=\"btn\" disabled=\"disabled\" style=\"margin-left:5px\">delete</button>");
      btn_del.click(function() {
        return confirm_delete(domain);
      });
      name = $('<a href="#">' + domain + '</a>').click(function() {
        var domain_name;
        domain_name = $(this).html();
        return $('#query_expr').val('select * from `' + domain_name + '`');
      });
      td = $("<td></td>").append(name).append('<br />').append(btn_md).append(btn_del);
      tr = $("<tr></tr>").append(td);
      $("#domains_table > tbody").append(tr);
    }
    $("#domain_select > option").remove();
    _results = [];
    for (_j = 0, _len2 = domains.length; _j < _len2; _j++) {
      domain = domains[_j];
      _results.push($("#domain_select").append($('<option>', {
        value: domain
      }).text(domain)));
    }
    return _results;
  }
};
update_domains_table = function(callback) {
  if (callback == null) {
    callback = null;
  }
  return sdb.list_domains(function(res) {
    add_domains(res["domains"]);
    if (callback != null) {
      return callback();
    }
  });
};
add_item = function() {
  $("#domain_select").val(domain_from_query());
  $("#item_name").val("");
  $("#attr_name").val("");
  $("#attr_value_textarea").val("");
  $("#attr_value_is_multivalued").removeAttr("checked");
  return $('#add_edit_item_label').text('Add Item');
};
edit_item = function(domain, item, attr_name, attr_values) {
  $("#domain_select").val(domain);
  $("#item_name").val(item);
  $("#attr_name").val(attr_name);
  $("#attr_value_textarea").val(attr_values.join("\n")).attr("rows", Math.max(1, attr_values.length));
  if (attr_values.length > 1) {
    $("#attr_value_is_multivalued").attr("checked", "checked");
  } else {
    $("#attr_value_is_multivalued").removeAttr("checked");
  }
  $('#add_edit_item_label').text('Edit Item');
  return $('#add_edit_item_attributes').modal('show');
};
save_item = function() {
  var attr_multivalued, attr_multivalued_delimiter, attr_name, attr_replace, attr_value, attr_values, domain_name, item_name;
  domain_name = $("#domain_select").val();
  item_name = $("#item_name").val();
  attr_name = $("#attr_name").val();
  attr_value = $("#attr_value_textarea").val();
  attr_replace = $("#attr_replace").is(":checked");
  attr_multivalued = $("#attr_value_is_multivalued").is(":checked");
  attr_multivalued_delimiter = $("#attr_value_delimiter").val();
  if (attr_multivalued) {
    attr_values = attr_value.split(new RegExp(attr_multivalued_delimiter));
  } else {
    attr_values = [attr_value];
  }
  return sdb.put_attributes(domain_name, item_name, [
    {
      name: attr_name,
      values: attr_values,
      replace: attr_replace
    }
  ], function(res) {
    return $('#add_edit_item_attributes').modal('hide');
  });
};
enable_delete = function() {
  $("button[id^=delete_]").removeAttr("disabled").addClass("danger").removeClass("secondary");
  return $("#domain_deletion_control").text("Disable Delete").addClass("danger").removeClass("secondary").addClass("active");
};
disable_delete = function() {
  $("button[id^=delete_]").attr("disabled", "disabled").addClass("secondary").removeClass("danger");
  return $("#domain_deletion_control").text("Enable Delete").addClass("secondary").removeClass("danger").removeClass("active");
};
handle_delete_toggle = function() {
  if ($("#domain_deletion_control").hasClass("active")) {
    return disable_delete();
  } else {
    return enable_delete();
  }
};
domain_from_query = function() {
  var domain_match;
  domain_match = $("#query_expr").val().match(/\`(.+)\`/);
  if (domain_match !== null) {
    return domain_match[1];
  } else {
    return null;
  }
};
handle_query = function(results) {
  var attr_name, attr_vals, delTd, item, item_count, next_token, tds, ths, tr, _i, _len, _ref;
  $("#message_box").hide();
  item_count = results.items.length;
  next_token = results.next_token;
  if (next_token != null) {
    next_token = next_token.replace(/\n/g, "");
    $("#next_page_btn").removeAttr("disabled").click(function() {
      return query(next_token);
    });
  } else {
    $("#next_page_btn").attr("disabled", "disabled").unbind("click");
  }
  if (item_count === 0) {
    $("#query_results_table > thead").html("<tr><th>Items</th></tr>");
    $("#query_results_table > tbody").html("<tr><td>No results...</td></tr>");
  } else {
    ths = (function() {
      var _i, _len, _ref, _results;
      _ref = results.attr_names;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        attr_name = _ref[_i];
        _results.push("<th>" + attr_name + "</th>");
      }
      return _results;
    })();
    $("#query_results_table > thead").html("<tr><th></th><th>Item Name</th>" + (ths.join('')) + "</tr>");
    $("#query_results_table > tbody").html('');
    _ref = results.items;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      tds = (function() {
        var _j, _len2, _ref2, _results;
        _ref2 = results.attr_names;
        _results = [];
        for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
          attr_name = _ref2[_j];
          attr_vals = item.attrs[attr_name];
          _results.push(attr_vals != null ? attr_vals.length > 1 ? ("<td data-attr-name=\"" + attr_name + "\" data-attr-multivalued=\"true\"><table class=\"multivalued\"><tbody><tr><td>") + attr_vals.join("</td></tr><tr><td>") + "</td></tr></tbody></table></td>" : "<td data-attr-name=\"" + attr_name + "\" data-attr-multivalued=\"false\">" + (attr_vals.join('')) + "</td>" : "<td data-attr-name=\"" + attr_name + "\" data-attr-multivalued=\"false\"></td>");
        }
        return _results;
      })();
      delTd = $('<td class="delete">x</td>').click(function() {
        return confirm_delete_item($(this).closest('tr').attr('data-item-name'));
      });
      tr = $('<tr></tr>').attr('data-item-name', item.name).append(delTd).append('<td>' + item.name + '</td>').append(tds.join(''));
      $("#query_results_table > tbody").append(tr);
    }
    $("#query_results_table > tbody > tr").each(function(index, val) {
      return $(val).children("td").each(function(jindex, tdval) {
        var handler_in, handler_out;
        if (jindex > 1) {
          handler_in = function() {
            return $(this).addClass("edititem").dblclick(function() {
              var is_multivalued, item_name, values;
              item_name = $(this).parent().attr("data-item-name");
              attr_name = $(this).attr("data-attr-name");
              is_multivalued = $(this).attr("data-attr-multivalued") === "true";
              values = [];
              if (is_multivalued) {
                $(this).children("table").children("tbody").children("tr").children("td").each(function(index, el) {
                  return values.push($(el).text());
                });
              } else {
                values.push($(this).text());
              }
              return edit_item(domain_from_query(), item_name, attr_name, values);
            });
          };
          handler_out = function() {
            return $(this).removeClass('edititem');
          };
          return $(tdval).hover(handler_in, handler_out);
        }
      });
    });
  }
  return $("#query_btn").button('reset');
};
query = function(next_token) {
  var query_expr;
  if (next_token == null) {
    next_token = null;
  }
  query_expr = $("#query_expr").val();
  sdb.select(query_expr, handle_query, next_token);
  return $("#query_btn").button('loading');
};
metadata = function(domain) {
  return sdb.domain_metadata(domain, function(res) {
    $("#domain_metadata_label").html("<h2>" + domain + " <small>Metadata</small></h2>");
    $("input[name=itemCount]").val(res.item_count);
    $("input[name=itemNamesSizeBytes]").val(res.item_names_size_bytes);
    $("input[name=attributeNameCount]").val(res.attribute_name_count);
    $("input[name=attributeNamesSizeBytes]").val(res.attribute_names_size_bytes);
    $("input[name=attributeValueCount]").val(res.attribute_value_count);
    $("input[name=attributeValuesSizeBytes]").val(res.attribute_values_size_bytes);
    return $('#domain_metadata_modal').modal('show');
  });
};
confirm_delete_item = function(name) {
  $('#item_delete_modal').find('input[name="domain_name"]').val(domain_from_query());
  $('#item_delete_modal').find('input[name="item_name"]').val(name);
  return $('#item_delete_modal').modal('show');
};
delete_item = function() {
  var domain, name;
  domain = $('#item_delete_modal').find('input[name="domain_name"]').val();
  name = $('#item_delete_modal').find('input[name="item_name"]').val();
  return sdb.delete_attributes(domain, name, {}, function(res) {
    $('#query_results_table').find('*[data-item-name="' + name + '"]').remove();
    return $('#item_delete_modal').hide();
  });
};
confirm_delete = function(domain) {
  $("#domain_delete_label").html("<h2>Delete " + domain + "?</h2>");
  $("input[name=confirm_delete]").val("");
  $("#confirm_delete_domain_modal").modal('show');
  return $("#confirm_delete_domain_btn").click(function() {
    return delete_domain(domain);
  });
};
delete_domain = function(domain) {
  $("#confirm_delete_domain_btn").button('loading');
  return sdb.delete_domain(domain, function(results) {
    $("#confirm_delete_domain_btn").button('reset');
    return update_domains_table(function() {
      disable_delete();
      return $("#confirm_delete_domain_modal").modal('hide');
    });
  });
};
save_domain = function() {
  var domain;
  domain = $("#domain_name").val();
  $("#save_domain").button('loading');
  return sdb.create_domain(domain, function() {
    return update_domains_table(function() {
      $("#save_domain").button('reset');
      return $('#create_domain_modal').modal('hide');
    });
  });
};var add_sample_domain, finish_tour, optional_add_domain, sample_query, sample_query_results;
add_sample_domain = function() {
  if ($("#domain_select > option").length < 1) {
    return add_domains(["example_domain_chrome_sdb"]);
  }
};
optional_add_domain = function() {
  add_sample_domain();
  return guiders.next();
};
sample_query = function() {
  var domain;
  domain = $($("#domain_select > option")[0]).text();
  $("#query_expr").val("select * from `" + domain + "`");
  return guiders.next();
};
sample_query_results = function() {
  var results;
  results = {
    items: [
      {
        name: "item name",
        attrs: {
          "single value attribute": ["attribute value"],
          "multivalued attribute": ["val A", "val B"]
        }
      }
    ],
    attr_names: ["single value attribute", "multivalued attribute"]
  };
  handle_query(results);
  return guiders.next();
};
finish_tour = function() {
  var results;
  results = {
    items: [],
    attr_names: []
  };
  handle_query(results);
  $("#query_expr").val("");
  update_domains_table();
  Storage.set("chrome-sdb-intro", "true");
  return guiders.hideAll();
};
$(function() {
  if (Storage.get("chrome-sdb-intro") === null) {
    guiders.createGuider({
      buttons: [
        {
          name: "Next",
          onclick: optional_add_domain
        }
      ],
      description: "This is the Query page in the Chrome Simple DB Tool.  This page is where you add and edit Items and Query your Simple DB domains.",
      id: "first",
      next: "second",
      overlay: true,
      title: "Chrome Simple DB Tool: Query Page"
    }).show();
    guiders.createGuider({
      attachTo: "#domains_table",
      buttons: [
        {
          name: "Next"
        }
      ],
      description: "The domains table shows all the Simple DB domains in the selected Amazon Web Services Region.",
      id: "second",
      next: "third",
      position: 2,
      title: "Domains Table",
      width: 450,
      offset: {
        top: -30,
        left: 0
      }
    });
    guiders.createGuider({
      attachTo: "#region_select",
      buttons: [
        {
          name: "Next"
        }
      ],
      description: "The Region selector allows you to change the region that you are querying.  It updates the Domain table automatically.",
      id: "third",
      next: "forth",
      position: 2,
      title: "Regions Select",
      width: 450,
      offset: {
        top: -30,
        left: 0
      }
    });
    guiders.createGuider({
      attachTo: "#create_domain",
      buttons: [
        {
          name: "Next"
        }
      ],
      description: "If you need to add another domain, use the \"Create Domain\" button.",
      id: "forth",
      next: "fifth",
      position: 2,
      title: "Create Domain",
      width: 450,
      offset: {
        top: -30,
        left: 0
      }
    });
    guiders.createGuider({
      attachTo: "#domain_deletion_control",
      buttons: [
        {
          name: "Next"
        }
      ],
      description: "This button toggles domain deletion enablement.",
      id: "fifth",
      next: "sixth",
      position: 2,
      title: "Delete Domain Control",
      width: 450,
      offset: {
        top: -30,
        left: 0
      }
    });
    guiders.createGuider({
      attachTo: "#query_expr",
      buttons: [
        {
          name: "Next",
          onclick: sample_query
        }
      ],
      description: "Enter domain select expressions in the query box.  Don't forget to enclose your domain in backticks (\"`\") in the query",
      id: "sixth",
      next: "seven",
      position: 6,
      title: "Query your domains",
      width: 450,
      offset: {
        top: -30,
        left: 0
      }
    });
    guiders.createGuider({
      attachTo: "#query_results_table",
      buttons: [
        {
          name: "Next",
          onclick: sample_query_results
        }
      ],
      description: "Query results show up in the in the table below.",
      id: "seven",
      next: "eight",
      position: 12,
      title: "Query results",
      width: 450,
      offset: {
        top: -30,
        left: 0
      }
    });
    guiders.createGuider({
      attachTo: "#query_results_table",
      buttons: [
        {
          name: "Next"
        }
      ],
      description: "Scroll over an attribute and click on it to edit.",
      id: "eight",
      next: "ninth",
      position: 6,
      title: "Edit attributes",
      width: 450,
      offset: {
        top: -30,
        left: 0
      }
    });
    return guiders.createGuider({
      buttons: [
        {
          name: "Close",
          onclick: finish_tour
        }
      ],
      description: "That's it!  Please submit feedback and bugs and enjoy.",
      id: "ninth",
      overlay: true,
      title: "Cool? Cool..."
    });
  }
});