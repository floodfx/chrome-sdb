var Settings;
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
    var primary_name, profiles;
    if (make_primary == null) {
      make_primary = false;
    }
    profiles = Profile.find_all();
    profiles[this.name] = this.settings.to_json();
    Storage.set("chrome-sdb.profiles", profiles, true);
    primary_name = Profile.primary();
    if (primary_name === null || make_primary) {
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
    var _ref;
    return (_ref = Storage.get("chrome-sdb.profiles", true)) != null ? _ref : {};
  };
  Profile.find = function(by_name) {
    var name, profiles, settings;
    profiles = Profile.find_all();
    for (name in profiles) {
      settings = profiles[name];
      if (by_name === name) {
        return new Profile(name, Settings.from_json(settings));
      }
    }
    return null;
  };
  Profile["delete"] = function(name) {
    var profiles;
    profiles = Profile.find_all();
    delete profiles[name];
    return Storage.set("chrome-sdb.profiles", profiles, true);
  };
  return Profile;
})();var message, primary, profiles;
primary = Profile.primary();
profiles = Profile.find_all();
if (primary === null && profiles === {}) {
  message = '<div class="alert-message warning">\n  <a id="close_message_box" class="close" href="#">×</a>\n  <p><strong>Create a profile</strong> Enter your AWS Credentials to begin.</p>\n</div>';
  $(function() {
    $("#message_box").append(message).show();
    return $("#close_message_box").click(function() {
      return $("#message_box").hide();
    });
  });
} else {
  $(function() {
    var name, settings, trs, use;
    trs = (function() {
      var _results;
      _results = [];
      for (name in profiles) {
        settings = profiles[name];
        use = name === primary.get_name() ? "In use" : "<a id=\"use_profile_" + name + "\" class=\"btn\" href=\"#\">Use</a>";
        _results.push("<tr><td>" + name + "</td><td><a id=\"profile_" + name + "\" href=\"#edit_profile\">Edit</a></td><td>" + use + "</td></tr>");
      }
      return _results;
    })();
    return $("#profiles_table > tbody").html(trs.join(""));
  });
}
$(function() {
  $("#save_profile").click(function() {
    var access_key, name, secret_key;
    name = $("#profile_name").val();
    access_key = $("#profile_aws_access_key").val();
    secret_key = $("#profile_aws_secret_key").val();
    new Profile(name, new Settings(access_key, secret_key)).save();
    return $('#create_profile_modal').modal('hide');
  });
  return $("#cancel_profile").click(function() {
    return $('#create_profile_modal').modal('hide');
  });
});