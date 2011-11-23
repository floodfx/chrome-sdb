var Profile;
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
})();/**
 * Version: 1.0 Alpha-1 
 * Build Date: 13-Nov-2007
 * Copyright (c) 2006-2007, Coolite Inc. (http://www.coolite.com/). All rights reserved.
 * License: Licensed under The MIT License. See license.txt and http://www.datejs.com/license/. 
 * Website: http://www.datejs.com/ or http://www.coolite.com/datejs/
 */
Date.CultureInfo={name:"en-US",englishName:"English (United States)",nativeName:"English (United States)",dayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],abbreviatedDayNames:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],shortestDayNames:["Su","Mo","Tu","We","Th","Fr","Sa"],firstLetterDayNames:["S","M","T","W","T","F","S"],monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],abbreviatedMonthNames:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],amDesignator:"AM",pmDesignator:"PM",firstDayOfWeek:0,twoDigitYearMax:2029,dateElementOrder:"mdy",formatPatterns:{shortDate:"M/d/yyyy",longDate:"dddd, MMMM dd, yyyy",shortTime:"h:mm tt",longTime:"h:mm:ss tt",fullDateTime:"dddd, MMMM dd, yyyy h:mm:ss tt",sortableDateTime:"yyyy-MM-ddTHH:mm:ss",universalSortableDateTime:"yyyy-MM-dd HH:mm:ssZ",rfc1123:"ddd, dd MMM yyyy HH:mm:ss GMT",monthDay:"MMMM dd",yearMonth:"MMMM, yyyy"},regexPatterns:{jan:/^jan(uary)?/i,feb:/^feb(ruary)?/i,mar:/^mar(ch)?/i,apr:/^apr(il)?/i,may:/^may/i,jun:/^jun(e)?/i,jul:/^jul(y)?/i,aug:/^aug(ust)?/i,sep:/^sep(t(ember)?)?/i,oct:/^oct(ober)?/i,nov:/^nov(ember)?/i,dec:/^dec(ember)?/i,sun:/^su(n(day)?)?/i,mon:/^mo(n(day)?)?/i,tue:/^tu(e(s(day)?)?)?/i,wed:/^we(d(nesday)?)?/i,thu:/^th(u(r(s(day)?)?)?)?/i,fri:/^fr(i(day)?)?/i,sat:/^sa(t(urday)?)?/i,future:/^next/i,past:/^last|past|prev(ious)?/i,add:/^(\+|after|from)/i,subtract:/^(\-|before|ago)/i,yesterday:/^yesterday/i,today:/^t(oday)?/i,tomorrow:/^tomorrow/i,now:/^n(ow)?/i,millisecond:/^ms|milli(second)?s?/i,second:/^sec(ond)?s?/i,minute:/^min(ute)?s?/i,hour:/^h(ou)?rs?/i,week:/^w(ee)?k/i,month:/^m(o(nth)?s?)?/i,day:/^d(ays?)?/i,year:/^y((ea)?rs?)?/i,shortMeridian:/^(a|p)/i,longMeridian:/^(a\.?m?\.?|p\.?m?\.?)/i,timezone:/^((e(s|d)t|c(s|d)t|m(s|d)t|p(s|d)t)|((gmt)?\s*(\+|\-)\s*\d\d\d\d?)|gmt)/i,ordinalSuffix:/^\s*(st|nd|rd|th)/i,timeContext:/^\s*(\:|a|p)/i},abbreviatedTimeZoneStandard:{GMT:"-000",EST:"-0400",CST:"-0500",MST:"-0600",PST:"-0700"},abbreviatedTimeZoneDST:{GMT:"-000",EDT:"-0500",CDT:"-0600",MDT:"-0700",PDT:"-0800"}};
Date.getMonthNumberFromName=function(name){var n=Date.CultureInfo.monthNames,m=Date.CultureInfo.abbreviatedMonthNames,s=name.toLowerCase();for(var i=0;i<n.length;i++){if(n[i].toLowerCase()==s||m[i].toLowerCase()==s){return i;}}
return-1;};Date.getDayNumberFromName=function(name){var n=Date.CultureInfo.dayNames,m=Date.CultureInfo.abbreviatedDayNames,o=Date.CultureInfo.shortestDayNames,s=name.toLowerCase();for(var i=0;i<n.length;i++){if(n[i].toLowerCase()==s||m[i].toLowerCase()==s){return i;}}
return-1;};Date.isLeapYear=function(year){return(((year%4===0)&&(year%100!==0))||(year%400===0));};Date.getDaysInMonth=function(year,month){return[31,(Date.isLeapYear(year)?29:28),31,30,31,30,31,31,30,31,30,31][month];};Date.getTimezoneOffset=function(s,dst){return(dst||false)?Date.CultureInfo.abbreviatedTimeZoneDST[s.toUpperCase()]:Date.CultureInfo.abbreviatedTimeZoneStandard[s.toUpperCase()];};Date.getTimezoneAbbreviation=function(offset,dst){var n=(dst||false)?Date.CultureInfo.abbreviatedTimeZoneDST:Date.CultureInfo.abbreviatedTimeZoneStandard,p;for(p in n){if(n[p]===offset){return p;}}
return null;};Date.prototype.clone=function(){return new Date(this.getTime());};Date.prototype.compareTo=function(date){if(isNaN(this)){throw new Error(this);}
if(date instanceof Date&&!isNaN(date)){return(this>date)?1:(this<date)?-1:0;}else{throw new TypeError(date);}};Date.prototype.equals=function(date){return(this.compareTo(date)===0);};Date.prototype.between=function(start,end){var t=this.getTime();return t>=start.getTime()&&t<=end.getTime();};Date.prototype.addMilliseconds=function(value){this.setMilliseconds(this.getMilliseconds()+value);return this;};Date.prototype.addSeconds=function(value){return this.addMilliseconds(value*1000);};Date.prototype.addMinutes=function(value){return this.addMilliseconds(value*60000);};Date.prototype.addHours=function(value){return this.addMilliseconds(value*3600000);};Date.prototype.addDays=function(value){return this.addMilliseconds(value*86400000);};Date.prototype.addWeeks=function(value){return this.addMilliseconds(value*604800000);};Date.prototype.addMonths=function(value){var n=this.getDate();this.setDate(1);this.setMonth(this.getMonth()+value);this.setDate(Math.min(n,this.getDaysInMonth()));return this;};Date.prototype.addYears=function(value){return this.addMonths(value*12);};Date.prototype.add=function(config){if(typeof config=="number"){this._orient=config;return this;}
var x=config;if(x.millisecond||x.milliseconds){this.addMilliseconds(x.millisecond||x.milliseconds);}
if(x.second||x.seconds){this.addSeconds(x.second||x.seconds);}
if(x.minute||x.minutes){this.addMinutes(x.minute||x.minutes);}
if(x.hour||x.hours){this.addHours(x.hour||x.hours);}
if(x.month||x.months){this.addMonths(x.month||x.months);}
if(x.year||x.years){this.addYears(x.year||x.years);}
if(x.day||x.days){this.addDays(x.day||x.days);}
return this;};Date._validate=function(value,min,max,name){if(typeof value!="number"){throw new TypeError(value+" is not a Number.");}else if(value<min||value>max){throw new RangeError(value+" is not a valid value for "+name+".");}
return true;};Date.validateMillisecond=function(n){return Date._validate(n,0,999,"milliseconds");};Date.validateSecond=function(n){return Date._validate(n,0,59,"seconds");};Date.validateMinute=function(n){return Date._validate(n,0,59,"minutes");};Date.validateHour=function(n){return Date._validate(n,0,23,"hours");};Date.validateDay=function(n,year,month){return Date._validate(n,1,Date.getDaysInMonth(year,month),"days");};Date.validateMonth=function(n){return Date._validate(n,0,11,"months");};Date.validateYear=function(n){return Date._validate(n,1,9999,"seconds");};Date.prototype.set=function(config){var x=config;if(!x.millisecond&&x.millisecond!==0){x.millisecond=-1;}
if(!x.second&&x.second!==0){x.second=-1;}
if(!x.minute&&x.minute!==0){x.minute=-1;}
if(!x.hour&&x.hour!==0){x.hour=-1;}
if(!x.day&&x.day!==0){x.day=-1;}
if(!x.month&&x.month!==0){x.month=-1;}
if(!x.year&&x.year!==0){x.year=-1;}
if(x.millisecond!=-1&&Date.validateMillisecond(x.millisecond)){this.addMilliseconds(x.millisecond-this.getMilliseconds());}
if(x.second!=-1&&Date.validateSecond(x.second)){this.addSeconds(x.second-this.getSeconds());}
if(x.minute!=-1&&Date.validateMinute(x.minute)){this.addMinutes(x.minute-this.getMinutes());}
if(x.hour!=-1&&Date.validateHour(x.hour)){this.addHours(x.hour-this.getHours());}
if(x.month!==-1&&Date.validateMonth(x.month)){this.addMonths(x.month-this.getMonth());}
if(x.year!=-1&&Date.validateYear(x.year)){this.addYears(x.year-this.getFullYear());}
if(x.day!=-1&&Date.validateDay(x.day,this.getFullYear(),this.getMonth())){this.addDays(x.day-this.getDate());}
if(x.timezone){this.setTimezone(x.timezone);}
if(x.timezoneOffset){this.setTimezoneOffset(x.timezoneOffset);}
return this;};Date.prototype.clearTime=function(){this.setHours(0);this.setMinutes(0);this.setSeconds(0);this.setMilliseconds(0);return this;};Date.prototype.isLeapYear=function(){var y=this.getFullYear();return(((y%4===0)&&(y%100!==0))||(y%400===0));};Date.prototype.isWeekday=function(){return!(this.is().sat()||this.is().sun());};Date.prototype.getDaysInMonth=function(){return Date.getDaysInMonth(this.getFullYear(),this.getMonth());};Date.prototype.moveToFirstDayOfMonth=function(){return this.set({day:1});};Date.prototype.moveToLastDayOfMonth=function(){return this.set({day:this.getDaysInMonth()});};Date.prototype.moveToDayOfWeek=function(day,orient){var diff=(day-this.getDay()+7*(orient||+1))%7;return this.addDays((diff===0)?diff+=7*(orient||+1):diff);};Date.prototype.moveToMonth=function(month,orient){var diff=(month-this.getMonth()+12*(orient||+1))%12;return this.addMonths((diff===0)?diff+=12*(orient||+1):diff);};Date.prototype.getDayOfYear=function(){return Math.floor((this-new Date(this.getFullYear(),0,1))/86400000);};Date.prototype.getWeekOfYear=function(firstDayOfWeek){var y=this.getFullYear(),m=this.getMonth(),d=this.getDate();var dow=firstDayOfWeek||Date.CultureInfo.firstDayOfWeek;var offset=7+1-new Date(y,0,1).getDay();if(offset==8){offset=1;}
var daynum=((Date.UTC(y,m,d,0,0,0)-Date.UTC(y,0,1,0,0,0))/86400000)+1;var w=Math.floor((daynum-offset+7)/7);if(w===dow){y--;var prevOffset=7+1-new Date(y,0,1).getDay();if(prevOffset==2||prevOffset==8){w=53;}else{w=52;}}
return w;};Date.prototype.isDST=function(){console.log('isDST');return this.toString().match(/(E|C|M|P)(S|D)T/)[2]=="D";};Date.prototype.getTimezone=function(){return Date.getTimezoneAbbreviation(this.getUTCOffset,this.isDST());};Date.prototype.setTimezoneOffset=function(s){var here=this.getTimezoneOffset(),there=Number(s)*-6/10;this.addMinutes(there-here);return this;};Date.prototype.setTimezone=function(s){return this.setTimezoneOffset(Date.getTimezoneOffset(s));};Date.prototype.getUTCOffset=function(){var n=this.getTimezoneOffset()*-10/6,r;if(n<0){r=(n-10000).toString();return r[0]+r.substr(2);}else{r=(n+10000).toString();return"+"+r.substr(1);}};Date.prototype.getDayName=function(abbrev){return abbrev?Date.CultureInfo.abbreviatedDayNames[this.getDay()]:Date.CultureInfo.dayNames[this.getDay()];};Date.prototype.getMonthName=function(abbrev){return abbrev?Date.CultureInfo.abbreviatedMonthNames[this.getMonth()]:Date.CultureInfo.monthNames[this.getMonth()];};Date.prototype._toString=Date.prototype.toString;Date.prototype.toString=function(format){var self=this;var p=function p(s){return(s.toString().length==1)?"0"+s:s;};return format?format.replace(/dd?d?d?|MM?M?M?|yy?y?y?|hh?|HH?|mm?|ss?|tt?|zz?z?/g,function(format){switch(format){case"hh":return p(self.getHours()<13?self.getHours():(self.getHours()-12));case"h":return self.getHours()<13?self.getHours():(self.getHours()-12);case"HH":return p(self.getHours());case"H":return self.getHours();case"mm":return p(self.getMinutes());case"m":return self.getMinutes();case"ss":return p(self.getSeconds());case"s":return self.getSeconds();case"yyyy":return self.getFullYear();case"yy":return self.getFullYear().toString().substring(2,4);case"dddd":return self.getDayName();case"ddd":return self.getDayName(true);case"dd":return p(self.getDate());case"d":return self.getDate().toString();case"MMMM":return self.getMonthName();case"MMM":return self.getMonthName(true);case"MM":return p((self.getMonth()+1));case"M":return self.getMonth()+1;case"t":return self.getHours()<12?Date.CultureInfo.amDesignator.substring(0,1):Date.CultureInfo.pmDesignator.substring(0,1);case"tt":return self.getHours()<12?Date.CultureInfo.amDesignator:Date.CultureInfo.pmDesignator;case"zzz":case"zz":case"z":return"";}}):this._toString();};
Date.now=function(){return new Date();};Date.today=function(){return Date.now().clearTime();};Date.prototype._orient=+1;Date.prototype.next=function(){this._orient=+1;return this;};Date.prototype.last=Date.prototype.prev=Date.prototype.previous=function(){this._orient=-1;return this;};Date.prototype._is=false;Date.prototype.is=function(){this._is=true;return this;};Number.prototype._dateElement="day";Number.prototype.fromNow=function(){var c={};c[this._dateElement]=this;return Date.now().add(c);};Number.prototype.ago=function(){var c={};c[this._dateElement]=this*-1;return Date.now().add(c);};(function(){var $D=Date.prototype,$N=Number.prototype;var dx=("sunday monday tuesday wednesday thursday friday saturday").split(/\s/),mx=("january february march april may june july august september october november december").split(/\s/),px=("Millisecond Second Minute Hour Day Week Month Year").split(/\s/),de;var df=function(n){return function(){if(this._is){this._is=false;return this.getDay()==n;}
return this.moveToDayOfWeek(n,this._orient);};};for(var i=0;i<dx.length;i++){$D[dx[i]]=$D[dx[i].substring(0,3)]=df(i);}
var mf=function(n){return function(){if(this._is){this._is=false;return this.getMonth()===n;}
return this.moveToMonth(n,this._orient);};};for(var j=0;j<mx.length;j++){$D[mx[j]]=$D[mx[j].substring(0,3)]=mf(j);}
var ef=function(j){return function(){if(j.substring(j.length-1)!="s"){j+="s";}
return this["add"+j](this._orient);};};var nf=function(n){return function(){this._dateElement=n;return this;};};for(var k=0;k<px.length;k++){de=px[k].toLowerCase();$D[de]=$D[de+"s"]=ef(px[k]);$N[de]=$N[de+"s"]=nf(de);}}());Date.prototype.toJSONString=function(){return this.toString("yyyy-MM-ddThh:mm:ssZ");};Date.prototype.toShortDateString=function(){return this.toString(Date.CultureInfo.formatPatterns.shortDatePattern);};Date.prototype.toLongDateString=function(){return this.toString(Date.CultureInfo.formatPatterns.longDatePattern);};Date.prototype.toShortTimeString=function(){return this.toString(Date.CultureInfo.formatPatterns.shortTimePattern);};Date.prototype.toLongTimeString=function(){return this.toString(Date.CultureInfo.formatPatterns.longTimePattern);};Date.prototype.getOrdinal=function(){switch(this.getDate()){case 1:case 21:case 31:return"st";case 2:case 22:return"nd";case 3:case 23:return"rd";default:return"th";}};
(function(){Date.Parsing={Exception:function(s){this.message="Parse error at '"+s.substring(0,10)+" ...'";}};var $P=Date.Parsing;var _=$P.Operators={rtoken:function(r){return function(s){var mx=s.match(r);if(mx){return([mx[0],s.substring(mx[0].length)]);}else{throw new $P.Exception(s);}};},token:function(s){return function(s){return _.rtoken(new RegExp("^\s*"+s+"\s*"))(s);};},stoken:function(s){return _.rtoken(new RegExp("^"+s));},until:function(p){return function(s){var qx=[],rx=null;while(s.length){try{rx=p.call(this,s);}catch(e){qx.push(rx[0]);s=rx[1];continue;}
break;}
return[qx,s];};},many:function(p){return function(s){var rx=[],r=null;while(s.length){try{r=p.call(this,s);}catch(e){return[rx,s];}
rx.push(r[0]);s=r[1];}
return[rx,s];};},optional:function(p){return function(s){var r=null;try{r=p.call(this,s);}catch(e){return[null,s];}
return[r[0],r[1]];};},not:function(p){return function(s){try{p.call(this,s);}catch(e){return[null,s];}
throw new $P.Exception(s);};},ignore:function(p){return p?function(s){var r=null;r=p.call(this,s);return[null,r[1]];}:null;},product:function(){var px=arguments[0],qx=Array.prototype.slice.call(arguments,1),rx=[];for(var i=0;i<px.length;i++){rx.push(_.each(px[i],qx));}
return rx;},cache:function(rule){var cache={},r=null;return function(s){try{r=cache[s]=(cache[s]||rule.call(this,s));}catch(e){r=cache[s]=e;}
if(r instanceof $P.Exception){throw r;}else{return r;}};},any:function(){var px=arguments;return function(s){var r=null;for(var i=0;i<px.length;i++){if(px[i]==null){continue;}
try{r=(px[i].call(this,s));}catch(e){r=null;}
if(r){return r;}}
throw new $P.Exception(s);};},each:function(){var px=arguments;return function(s){var rx=[],r=null;for(var i=0;i<px.length;i++){if(px[i]==null){continue;}
try{r=(px[i].call(this,s));}catch(e){throw new $P.Exception(s);}
rx.push(r[0]);s=r[1];}
return[rx,s];};},all:function(){var px=arguments,_=_;return _.each(_.optional(px));},sequence:function(px,d,c){d=d||_.rtoken(/^\s*/);c=c||null;if(px.length==1){return px[0];}
return function(s){var r=null,q=null;var rx=[];for(var i=0;i<px.length;i++){try{r=px[i].call(this,s);}catch(e){break;}
rx.push(r[0]);try{q=d.call(this,r[1]);}catch(ex){q=null;break;}
s=q[1];}
if(!r){throw new $P.Exception(s);}
if(q){throw new $P.Exception(q[1]);}
if(c){try{r=c.call(this,r[1]);}catch(ey){throw new $P.Exception(r[1]);}}
return[rx,(r?r[1]:s)];};},between:function(d1,p,d2){d2=d2||d1;var _fn=_.each(_.ignore(d1),p,_.ignore(d2));return function(s){var rx=_fn.call(this,s);return[[rx[0][0],r[0][2]],rx[1]];};},list:function(p,d,c){d=d||_.rtoken(/^\s*/);c=c||null;return(p instanceof Array?_.each(_.product(p.slice(0,-1),_.ignore(d)),p.slice(-1),_.ignore(c)):_.each(_.many(_.each(p,_.ignore(d))),px,_.ignore(c)));},set:function(px,d,c){d=d||_.rtoken(/^\s*/);c=c||null;return function(s){var r=null,p=null,q=null,rx=null,best=[[],s],last=false;for(var i=0;i<px.length;i++){q=null;p=null;r=null;last=(px.length==1);try{r=px[i].call(this,s);}catch(e){continue;}
rx=[[r[0]],r[1]];if(r[1].length>0&&!last){try{q=d.call(this,r[1]);}catch(ex){last=true;}}else{last=true;}
if(!last&&q[1].length===0){last=true;}
if(!last){var qx=[];for(var j=0;j<px.length;j++){if(i!=j){qx.push(px[j]);}}
p=_.set(qx,d).call(this,q[1]);if(p[0].length>0){rx[0]=rx[0].concat(p[0]);rx[1]=p[1];}}
if(rx[1].length<best[1].length){best=rx;}
if(best[1].length===0){break;}}
if(best[0].length===0){return best;}
if(c){try{q=c.call(this,best[1]);}catch(ey){throw new $P.Exception(best[1]);}
best[1]=q[1];}
return best;};},forward:function(gr,fname){return function(s){return gr[fname].call(this,s);};},replace:function(rule,repl){return function(s){var r=rule.call(this,s);return[repl,r[1]];};},process:function(rule,fn){return function(s){var r=rule.call(this,s);return[fn.call(this,r[0]),r[1]];};},min:function(min,rule){return function(s){var rx=rule.call(this,s);if(rx[0].length<min){throw new $P.Exception(s);}
return rx;};}};var _generator=function(op){return function(){var args=null,rx=[];if(arguments.length>1){args=Array.prototype.slice.call(arguments);}else if(arguments[0]instanceof Array){args=arguments[0];}
if(args){for(var i=0,px=args.shift();i<px.length;i++){args.unshift(px[i]);rx.push(op.apply(null,args));args.shift();return rx;}}else{return op.apply(null,arguments);}};};var gx="optional not ignore cache".split(/\s/);for(var i=0;i<gx.length;i++){_[gx[i]]=_generator(_[gx[i]]);}
var _vector=function(op){return function(){if(arguments[0]instanceof Array){return op.apply(null,arguments[0]);}else{return op.apply(null,arguments);}};};var vx="each any all".split(/\s/);for(var j=0;j<vx.length;j++){_[vx[j]]=_vector(_[vx[j]]);}}());(function(){var flattenAndCompact=function(ax){var rx=[];for(var i=0;i<ax.length;i++){if(ax[i]instanceof Array){rx=rx.concat(flattenAndCompact(ax[i]));}else{if(ax[i]){rx.push(ax[i]);}}}
return rx;};Date.Grammar={};Date.Translator={hour:function(s){return function(){this.hour=Number(s);};},minute:function(s){return function(){this.minute=Number(s);};},second:function(s){return function(){this.second=Number(s);};},meridian:function(s){return function(){this.meridian=s.slice(0,1).toLowerCase();};},timezone:function(s){return function(){var n=s.replace(/[^\d\+\-]/g,"");if(n.length){this.timezoneOffset=Number(n);}else{this.timezone=s.toLowerCase();}};},day:function(x){var s=x[0];return function(){this.day=Number(s.match(/\d+/)[0]);};},month:function(s){return function(){this.month=((s.length==3)?Date.getMonthNumberFromName(s):(Number(s)-1));};},year:function(s){return function(){var n=Number(s);this.year=((s.length>2)?n:(n+(((n+2000)<Date.CultureInfo.twoDigitYearMax)?2000:1900)));};},rday:function(s){return function(){switch(s){case"yesterday":this.days=-1;break;case"tomorrow":this.days=1;break;case"today":this.days=0;break;case"now":this.days=0;this.now=true;break;}};},finishExact:function(x){x=(x instanceof Array)?x:[x];var now=new Date();this.year=now.getFullYear();this.month=now.getMonth();this.day=1;this.hour=0;this.minute=0;this.second=0;for(var i=0;i<x.length;i++){if(x[i]){x[i].call(this);}}
this.hour=(this.meridian=="p"&&this.hour<13)?this.hour+12:this.hour;if(this.day>Date.getDaysInMonth(this.year,this.month)){throw new RangeError(this.day+" is not a valid value for days.");}
var r=new Date(this.year,this.month,this.day,this.hour,this.minute,this.second);if(this.timezone){r.set({timezone:this.timezone});}else if(this.timezoneOffset){r.set({timezoneOffset:this.timezoneOffset});}
return r;},finish:function(x){x=(x instanceof Array)?flattenAndCompact(x):[x];if(x.length===0){return null;}
for(var i=0;i<x.length;i++){if(typeof x[i]=="function"){x[i].call(this);}}
if(this.now){return new Date();}
var today=Date.today();var method=null;var expression=!!(this.days!=null||this.orient||this.operator);if(expression){var gap,mod,orient;orient=((this.orient=="past"||this.operator=="subtract")?-1:1);if(this.weekday){this.unit="day";gap=(Date.getDayNumberFromName(this.weekday)-today.getDay());mod=7;this.days=gap?((gap+(orient*mod))%mod):(orient*mod);}
if(this.month){this.unit="month";gap=(this.month-today.getMonth());mod=12;this.months=gap?((gap+(orient*mod))%mod):(orient*mod);this.month=null;}
if(!this.unit){this.unit="day";}
if(this[this.unit+"s"]==null||this.operator!=null){if(!this.value){this.value=1;}
if(this.unit=="week"){this.unit="day";this.value=this.value*7;}
this[this.unit+"s"]=this.value*orient;}
return today.add(this);}else{if(this.meridian&&this.hour){this.hour=(this.hour<13&&this.meridian=="p")?this.hour+12:this.hour;}
if(this.weekday&&!this.day){this.day=(today.addDays((Date.getDayNumberFromName(this.weekday)-today.getDay()))).getDate();}
if(this.month&&!this.day){this.day=1;}
return today.set(this);}}};var _=Date.Parsing.Operators,g=Date.Grammar,t=Date.Translator,_fn;g.datePartDelimiter=_.rtoken(/^([\s\-\.\,\/\x27]+)/);g.timePartDelimiter=_.stoken(":");g.whiteSpace=_.rtoken(/^\s*/);g.generalDelimiter=_.rtoken(/^(([\s\,]|at|on)+)/);var _C={};g.ctoken=function(keys){var fn=_C[keys];if(!fn){var c=Date.CultureInfo.regexPatterns;var kx=keys.split(/\s+/),px=[];for(var i=0;i<kx.length;i++){px.push(_.replace(_.rtoken(c[kx[i]]),kx[i]));}
fn=_C[keys]=_.any.apply(null,px);}
return fn;};g.ctoken2=function(key){return _.rtoken(Date.CultureInfo.regexPatterns[key]);};g.h=_.cache(_.process(_.rtoken(/^(0[0-9]|1[0-2]|[1-9])/),t.hour));g.hh=_.cache(_.process(_.rtoken(/^(0[0-9]|1[0-2])/),t.hour));g.H=_.cache(_.process(_.rtoken(/^([0-1][0-9]|2[0-3]|[0-9])/),t.hour));g.HH=_.cache(_.process(_.rtoken(/^([0-1][0-9]|2[0-3])/),t.hour));g.m=_.cache(_.process(_.rtoken(/^([0-5][0-9]|[0-9])/),t.minute));g.mm=_.cache(_.process(_.rtoken(/^[0-5][0-9]/),t.minute));g.s=_.cache(_.process(_.rtoken(/^([0-5][0-9]|[0-9])/),t.second));g.ss=_.cache(_.process(_.rtoken(/^[0-5][0-9]/),t.second));g.hms=_.cache(_.sequence([g.H,g.mm,g.ss],g.timePartDelimiter));g.t=_.cache(_.process(g.ctoken2("shortMeridian"),t.meridian));g.tt=_.cache(_.process(g.ctoken2("longMeridian"),t.meridian));g.z=_.cache(_.process(_.rtoken(/^(\+|\-)?\s*\d\d\d\d?/),t.timezone));g.zz=_.cache(_.process(_.rtoken(/^(\+|\-)\s*\d\d\d\d/),t.timezone));g.zzz=_.cache(_.process(g.ctoken2("timezone"),t.timezone));g.timeSuffix=_.each(_.ignore(g.whiteSpace),_.set([g.tt,g.zzz]));g.time=_.each(_.optional(_.ignore(_.stoken("T"))),g.hms,g.timeSuffix);g.d=_.cache(_.process(_.each(_.rtoken(/^([0-2]\d|3[0-1]|\d)/),_.optional(g.ctoken2("ordinalSuffix"))),t.day));g.dd=_.cache(_.process(_.each(_.rtoken(/^([0-2]\d|3[0-1])/),_.optional(g.ctoken2("ordinalSuffix"))),t.day));g.ddd=g.dddd=_.cache(_.process(g.ctoken("sun mon tue wed thu fri sat"),function(s){return function(){this.weekday=s;};}));g.M=_.cache(_.process(_.rtoken(/^(1[0-2]|0\d|\d)/),t.month));g.MM=_.cache(_.process(_.rtoken(/^(1[0-2]|0\d)/),t.month));g.MMM=g.MMMM=_.cache(_.process(g.ctoken("jan feb mar apr may jun jul aug sep oct nov dec"),t.month));g.y=_.cache(_.process(_.rtoken(/^(\d\d?)/),t.year));g.yy=_.cache(_.process(_.rtoken(/^(\d\d)/),t.year));g.yyy=_.cache(_.process(_.rtoken(/^(\d\d?\d?\d?)/),t.year));g.yyyy=_.cache(_.process(_.rtoken(/^(\d\d\d\d)/),t.year));_fn=function(){return _.each(_.any.apply(null,arguments),_.not(g.ctoken2("timeContext")));};g.day=_fn(g.d,g.dd);g.month=_fn(g.M,g.MMM);g.year=_fn(g.yyyy,g.yy);g.orientation=_.process(g.ctoken("past future"),function(s){return function(){this.orient=s;};});g.operator=_.process(g.ctoken("add subtract"),function(s){return function(){this.operator=s;};});g.rday=_.process(g.ctoken("yesterday tomorrow today now"),t.rday);g.unit=_.process(g.ctoken("minute hour day week month year"),function(s){return function(){this.unit=s;};});g.value=_.process(_.rtoken(/^\d\d?(st|nd|rd|th)?/),function(s){return function(){this.value=s.replace(/\D/g,"");};});g.expression=_.set([g.rday,g.operator,g.value,g.unit,g.orientation,g.ddd,g.MMM]);_fn=function(){return _.set(arguments,g.datePartDelimiter);};g.mdy=_fn(g.ddd,g.month,g.day,g.year);g.ymd=_fn(g.ddd,g.year,g.month,g.day);g.dmy=_fn(g.ddd,g.day,g.month,g.year);g.date=function(s){return((g[Date.CultureInfo.dateElementOrder]||g.mdy).call(this,s));};g.format=_.process(_.many(_.any(_.process(_.rtoken(/^(dd?d?d?|MM?M?M?|yy?y?y?|hh?|HH?|mm?|ss?|tt?|zz?z?)/),function(fmt){if(g[fmt]){return g[fmt];}else{throw Date.Parsing.Exception(fmt);}}),_.process(_.rtoken(/^[^dMyhHmstz]+/),function(s){return _.ignore(_.stoken(s));}))),function(rules){return _.process(_.each.apply(null,rules),t.finishExact);});var _F={};var _get=function(f){return _F[f]=(_F[f]||g.format(f)[0]);};g.formats=function(fx){if(fx instanceof Array){var rx=[];for(var i=0;i<fx.length;i++){rx.push(_get(fx[i]));}
return _.any.apply(null,rx);}else{return _get(fx);}};g._formats=g.formats(["yyyy-MM-ddTHH:mm:ss","ddd, MMM dd, yyyy H:mm:ss tt","ddd MMM d yyyy HH:mm:ss zzz","d"]);g._start=_.process(_.set([g.date,g.time,g.expression],g.generalDelimiter,g.whiteSpace),t.finish);g.start=function(s){try{var r=g._formats.call({},s);if(r[1].length===0){return r;}}catch(e){}
return g._start.call({},s);};}());Date._parse=Date.parse;Date.parse=function(s){var r=null;if(!s){return null;}
try{r=Date.Grammar.start.call({},s);}catch(e){return null;}
return((r[1].length===0)?r[0]:null);};Date.getParseFunction=function(fx){var fn=Date.Grammar.formats(fx);return function(s){var r=null;try{r=fn.call({},s);}catch(e){return null;}
return((r[1].length===0)?r[0]:null);};};Date.parseExact=function(s,fx){return Date.getParseFunction(fx)(s);};
var SimpleDB;
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
      var items;
      if ((result.error != null)) {
        callback(result);
      }
      items = [];
      $("Item", data).each(function(i) {
        var item;
        item = {
          attrs: {},
          name: $("Name:first", $(this)).text()
        };
        $("Attribute", $(this)).each(function(j) {
          var name, val;
          name = $("Name", $(this)).text();
          val = $("Value", $(this)).text();
          if (!item["attrs"][name]) {
            item["attrs"][name] = [];
          }
          return item["attrs"][name].push(val);
        });
        return items.push(item);
      });
      result.items = items;
      result.next_token = $("NextToken", data).text();
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
})();var SHA1;
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
})();