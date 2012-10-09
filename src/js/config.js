var after_intro;
after_intro = function() {
  Storage.set("chrome-sdb-config-intro", "true");
  $('#create_profile_modal').modal('show');
  return guiders.hideAll();
};
$(function() {
  if (Storage.get("chrome-sdb-config-intro") === null) {
    return guiders.createGuider({
      buttons: [
        {
          name: "Close",
          onclick: after_intro
        }
      ],
      description: "Welcome to Simple DB Tool for Chrome.  Please setup one or more AWS Credentials to start using this tool!",
      id: "first",
      overlay: true,
      title: "Chrome Simple DB Tool: Configuration"
    }).show();
  }
});var Storage;
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
})();var cancel_profile, delete_profile, edit_profile, message, primary, profiles, save_profile, update_profiles_table, use_profile, validate_text_box;
primary = Profile.primary();
profiles = Profile.find_all();
if (Profile.find_all() === []) {
  message = '<div class="alert-message warning">\n  <a id="close_message_box" class="close" href="#">×</a>\n  <p><strong>Create a profile</strong> Enter your AWS Credentials to begin.</p>\n</div>';
  $(function() {
    $("#message_box").append(message).show();
    return $("#close_message_box").click(function() {
      return $("#message_box").hide();
    });
  });
} else {
  $(function() {
    return update_profiles_table();
  });
}
update_profiles_table = function() {
  var access_key, del, edit, name, primary_name, profile, trs, use;
  primary = Profile.primary();
  profiles = Profile.find_all();
  trs = (function() {
    var _i, _len, _ref, _results;
    _results = [];
    for (_i = 0, _len = profiles.length; _i < _len; _i++) {
      profile = profiles[_i];
      name = profile.get_name();
      primary_name = (_ref = primary != null ? primary.get_name() : void 0) != null ? _ref : null;
      access_key = profile.get_settings().get_access_key();
      use = profile.get_name() === primary_name ? "In use" : "<a class=\"btn\" href=\"#\" onclick=\"use_profile('" + name + "')\">Use</a>";
      edit = "<a href=\"#\" onclick=\"edit_profile('" + name + "')\">Edit</a>";
      del = "<a href=\"#\" onclick=\"delete_profile('" + name + "')\">Delete</a>";
      _results.push("<tr><td>" + name + "</td><td>" + access_key + "</td><td>" + edit + "</td><td>" + use + "</td><td>" + del + "</td></tr>");
    }
    return _results;
  })();
  return $("#profiles_table > tbody").html(trs.join(""));
};
save_profile = function() {
  var access_key, name, secret_key, valid;
  valid = true;
  valid && (valid = validate_text_box("#profile_name", 3, 30));
  valid && (valid = validate_text_box("#profile_aws_access_key", 15, 25));
  valid && (valid = validate_text_box("#profile_aws_secret_key", 35, 45));
  if (valid) {
    name = $("#profile_name").val();
    access_key = $("#profile_aws_access_key").val();
    secret_key = $("#profile_aws_secret_key").val();
    new Profile(name, new Settings(access_key, secret_key)).save();
    $('#create_profile_modal').modal('hide');
    return update_profiles_table();
  }
};
validate_text_box = function(text_box_name, min_length, max_length) {
  var value;
  if (min_length == null) {
    min_length = 0;
  }
  if (max_length == null) {
    max_length = 100;
  }
  value = $(text_box_name).val();
  if (value === null || value.length < min_length || value.length > max_length) {
    $(text_box_name).parentsUntil("fieldset").addClass("error");
    return false;
  } else {
    $(text_box_name).parentsUntil("fieldset").removeClass("error");
    return true;
  }
};
cancel_profile = function() {
  return $('#create_profile_modal').modal('hide');
};
edit_profile = function(profile_name) {
  var profile;
  profile = Profile.find(profile_name);
  $("#profile_name").val(profile.get_name());
  $("#profile_aws_access_key").val(profile.get_settings().get_access_key());
  $("#profile_aws_secret_key").val(profile.get_settings().get_secret_key());
  return $('#create_profile_modal').modal('show');
};
delete_profile = function(profile_name) {
  Profile["delete"](profile_name);
  return update_profiles_table();
};
use_profile = function(profile_name) {
  var profile;
  profile = Profile.find(profile_name);
  profile.make_primary();
  return update_profiles_table();
};