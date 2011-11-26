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
  function Settings(access_key, secret_key, region, version) {
    this.access_key = access_key;
    this.secret_key = secret_key;
    this.region = region != null ? region : "us-east-1";
    this.version = version != null ? version : "2009-04-15";
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
  Settings.prototype.to_json = function() {
    return {
      access_key: this.access_key,
      secret_key: this.secret_key,
      region: this.region,
      version: this.version
    };
  };
  Settings.from_json = function(json) {
    if (json) {
      return new Settings(json["access_key"], json["secret_key"], json["region"], json["version"]);
    } else {
      return null;
    }
  };
  return Settings;
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
  function SimpleDB(profile, endpoint) {
    this.profile = profile;
    this.endpoint = endpoint != null ? endpoint : "sdb.amazonaws.com";
    this.sdb_base_url = "http://" + this.endpoint + "?";
  }
  SimpleDB.prototype.set_profile = function(profile) {
    return this.profile = profile;
  };
  SimpleDB.prototype.default_callback = function(results) {
    return console.log(results);
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
      error_callback = callback;
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
      if ((result.error != null)) {
        callback(result);
      }
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
      if ((result.error != null)) {
        callback(result);
      }
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
      if ((result.error != null)) {
        callback(result);
      }
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
})();var confirm_delete, delete_domain, disable_delete, enable_delete, handle_delete_toggle, handle_query, metadata, profile, query, save_domain, sdb, update_domains_table;
profile = Profile.primary();
if (!profile) {
  chrome.tabs.create({
    url: 'config.html'
  });
} else {
  sdb = new SimpleDB(profile);
  $(function() {
    return update_domains_table();
  });
}
update_domains_table = function(callback) {
  if (callback == null) {
    callback = null;
  }
  return sdb.list_domains(function(res) {
    var controls, domain, domains, trs;
    domains = res["domains"];
    trs = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = domains.length; _i < _len; _i++) {
        domain = domains[_i];
        controls = "<button id=\"metadata_" + domain + "\" class=\"btn info\" onclick=\"metadata('" + domain + "')\">metadata</a>";
        controls += " <button id=\"delete_" + domain + "\" class=\"btn\" onclick=\"confirm_delete('" + domain + "')\" disabled=\"disabled\" style=\"margin-left:5px\">delete</button>";
        _results.push("<tr><td>" + domain + "<br />" + controls + "</td></tr>");
      }
      return _results;
    })();
    $("#domains_table > tbody").html(trs.join(""));
    if (callback != null) {
      callback();
    }
    disable_delete();
    return $('#confirm_delete_domain_modal').modal('hide');
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
handle_query = function(results) {
  var attr_name, attr_vals, item, item_count, next_token, tds, ths, trs;
  console.log(results);
  item_count = results.items.length;
  next_token = results.next_token;
  if (next_token != null) {
    next_token = next_token.replace(/\n/g, "");
    $("#next_page_btn").removeAttr("disabled").attr("onclick", "query('" + next_token + "')");
  } else {
    $("#next_page_btn").attr("disabled", "disabled").removeAttr("onclick");
  }
  if (item_count === 0) {
    $("#query_results_table > thead").html("<tr><th>Items</th></tr>");
    return $("#query_results_table > tbody").html("<tr><td>No results...</td></tr>");
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
    trs = (function() {
      var _i, _len, _ref, _results;
      _ref = results.items;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        tds = (function() {
          var _j, _len2, _ref2, _results2;
          _ref2 = results.attr_names;
          _results2 = [];
          for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
            attr_name = _ref2[_j];
            attr_vals = item.attrs[attr_name];
            _results2.push(attr_vals != null ? attr_vals.length > 1 ? "<td><table><tbody><tr><td>" + attr_vals.join("</td><td>") + "</td></tr></tbody></table></td>" : "<td>" + (attr_vals.join('')) + "</td>" : "<td></td>");
          }
          return _results2;
        })();
        _results.push("<tr><td>" + item.name + "</td>" + (tds.join("")) + "</tr>");
      }
      return _results;
    })();
    $("#query_results_table > thead").html("<tr><th>Item Name</th>" + (ths.join('')) + "</tr>");
    $("#query_results_table > tbody").html(trs.join(""));
    return $("#query_btn").button('reset');
  }
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
    console.log("metadata", res);
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
$(function() {
  return $("input[name=confirm_delete]").keydown(function(key) {
    if ($("input[name=confirm_delete]").val() === "DELET" && key.keyCode === 69) {
      return $("#confirm_delete_domain_btn").removeAttr("disabled").addClass("danger").removeClass("secondary");
    } else {
      return $("#confirm_delete_domain_btn").attr("disabled", "disabled").addClass("secondary").removeClass("danger");
    }
  });
});
confirm_delete = function(domain) {
  $("#domain_delete_label").html("<h2>Delete " + domain + "?</h2>");
  $("input[name=confirm_delete]").val("");
  $("#confirm_delete_domain_btn").attr("onclick", "delete_domain('" + domain + "')");
  return $("#confirm_delete_domain_modal").modal('show');
};
delete_domain = function(domain) {
  $("#confirm_delete_domain_btn").button('loading');
  return sdb.delete_domain(domain, function(results) {
    return update_domains_table(function() {
      $("#confirm_delete_domain_btn").button('reset');
      return disable_delete();
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
};