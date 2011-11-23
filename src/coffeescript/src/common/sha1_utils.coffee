# 
# Ported to Coffeescript by Donnie Flood (donnie@floodfx.com)
#
# A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
# in FIPS 180-1
# Version 2.2-alpha Copyright Paul Johnston 2000 - 2002.
# Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
# Distributed under the BSD License
# See http://pajhome.org.uk/crypt/md5 for details.
#

#
# These are the functions you'll usually want to call
# They take string arguments and return either hex or base-64 encoded strings
#

SHA1 = (()->

  pub = {} 

  #
  # Calculate the SHA1 of a raw string
  #
  rstr_sha1 = (s)->
    return binb2rstr(binb_sha1(rstr2binb(s), s.length * 8))

  #
  # Calculate the HMAC-SHA1 of a key and some data (raw strings)
  #
  rstr_hmac_sha1 = (key, data)->
    bkey = rstr2binb(key)
    if(bkey.length > 16) 
      bkey = binb_sha1(bkey, key.length * 8)

    ipad = Array(16)
    opad = Array(16)
    for i in [0...16]
      ipad[i] = bkey[i] ^ 0x36363636
      opad[i] = bkey[i] ^ 0x5C5C5C5C

    hash = binb_sha1(ipad.concat(rstr2binb(data)), 512 + data.length * 8)
    return binb2rstr(binb_sha1(opad.concat(hash), 512 + 160))

  #
  # Convert a raw string to a hex string
  #
  rstr2hex = (input, lower_hexcase=true)->
    hex_tab = if(lower_hexcase) then "0123456789abcdef" else "0123456789ABCDEF"
    output = ""
    for i in [0...input.length]
      x = input.charCodeAt(i)
      output += hex_tab.charAt((x >>> 4) & 0x0F) +
                hex_tab.charAt( x        & 0x0F)
    return output

  #
  # Convert a raw string to a base-64 string
  #
  rstr2b64 = (input, b64pad="=")->
    tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
    output = ""
    len = input.length;
    for i in [0...len] by 3
      triplet = (input.charCodeAt(i) << 16) |
                (if(i + 1 < len) then input.charCodeAt(i+1) << 8 else 0) |
                (if(i + 2 < len) then input.charCodeAt(i+2)      else 0)
      for j in [0...4]
        if(i * 8 + j * 6 > input.length * 8) 
          output += b64pad
        else 
          output += tab.charAt((triplet >>> 6*(3-j)) & 0x3F)
    return output

  #
  # Convert a raw string to an arbitrary string encoding
  #
  rstr2any = (input, encoding)->
    divisor = encoding.length
    remainders = Array()

    # Convert to an array of 16-bit big-endian values, forming the dividend 
    dividend = Array(Math.ceil(input.length / 2));
    for i in [0...dividend.length]
      dividend[i] = (input.charCodeAt(i * 2) << 8) | input.charCodeAt(i * 2 + 1)

    #
    # Repeatedly perform a long division. The binary array forms the dividend,
    # the length of the encoding is the divisor. Once computed, the quotient
    # forms the dividend for the next step. We stop when the dividend is zero.
    # All remainders are stored for later use.
    #
    while(dividend.length > 0)
      quotient = Array()
      x = 0
      for i in [0...dividend.length]
        x = (x << 16) + dividend[i]
        q = Math.floor(x / divisor)
        x -= q * divisor
        if(quotient.length > 0 || q > 0)
          quotient[quotient.length] = q
      remainders[remainders.length] = x
      dividend = quotient

    # Convert the remainders to the output string 
    output = ""
    for i in [remainders.length - 1..0]
      output += encoding.charAt(remainders[i])

    # Append leading zero equivalents 
    full_length = Math.ceil(input.length * 8 / (Math.log(encoding.length) / Math.log(2)))
    for i in [output.length..full_length]
      output = encoding[0] + output

    return output

  #
  # Encode a string as utf-8.
  # For efficiency, this assumes the input is valid utf-16.
  #
  str2rstr_utf8 = (input)->    
    output = ""

    for i in [0...input.length]
      # Decode utf-16 surrogate pairs 
      x = input.charCodeAt(i)
      y = if( i + 1 < input.length) then input.charCodeAt(i + 1) else 0
      if(0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF)
        x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF)
        i++

      # Encode output as utf-8 
      if(x <= 0x7F)
        output += String.fromCharCode(x)
      else if(x <= 0x7FF)
        output += String.fromCharCode(0xC0 | ((x >>> 6 ) & 0x1F),
                                      0x80 | ( x         & 0x3F))
      else if(x <= 0xFFFF)
        output += String.fromCharCode(0xE0 | ((x >>> 12) & 0x0F),
                                      0x80 | ((x >>> 6 ) & 0x3F),
                                      0x80 | ( x         & 0x3F))
      else if(x <= 0x1FFFFF)
        output += String.fromCharCode(0xF0 | ((x >>> 18) & 0x07),
                                      0x80 | ((x >>> 12) & 0x3F),
                                      0x80 | ((x >>> 6 ) & 0x3F),
                                      0x80 | ( x         & 0x3F))
    return output

  ###
   Encode a string as utf-16
  ###
  str2rstr_utf16le = (input)->
    output = ""
    for i in [0...input.length]
      output += String.fromCharCode( input.charCodeAt(i)        & 0xFF,
                                    (input.charCodeAt(i) >>> 8) & 0xFF)
    return output

  str2rstr_utf16be = (input)->
    output = ""
    for i in [0...input.length]
      output += String.fromCharCode((input.charCodeAt(i) >>> 8) & 0xFF,
                                     input.charCodeAt(i)        & 0xFF)
    return output

  ###
   Convert a raw string to an array of big-endian words
   Characters >255 have their high-byte silently ignored.
  ###
  rstr2binb = (input)->
    output = Array(input.length >> 2)
    for i in [0...output.length]
      output[i] = 0;
    for i in [0...input.length*8] by 8
      output[i>>5] |= (input.charCodeAt(i / 8) & 0xFF) << (24 - i % 32)
    return output

  ###
   Convert an array of little-endian words to a string
  ###
  binb2rstr = (input)->
    output = ""
    for i in [0...input.length*32] by 8
      output += String.fromCharCode((input[i>>5] >>> (24 - i % 32)) & 0xFF)
    return output

  ###
   Calculate the SHA-1 of an array of big-endian words, and a bit length
  ###
  binb_sha1 = (x, len)->
    # append padding 
    x[len >> 5] |= 0x80 << (24 - len % 32)
    x[((len + 64 >> 9) << 4) + 15] = len

    w = Array(80)
    a =  1732584193
    b = -271733879
    c = -1732584194
    d =  271733878
    e = -1009589776

    for i in [0...x.length] by 16
      olda = a;
      oldb = b;
      oldc = c;
      oldd = d;
      olde = e;

      for j in [0...80]
        if(j < 16) 
          w[j] = x[i + j]
        else 
          w[j] = bit_rol(w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16], 1)
        t = safe_add(safe_add(bit_rol(a, 5), sha1_ft(j, b, c, d)),
                         safe_add(safe_add(e, w[j]), sha1_kt(j)))
        e = d
        d = c
        c = bit_rol(b, 30)
        b = a
        a = t

      a = safe_add(a, olda)
      b = safe_add(b, oldb)
      c = safe_add(c, oldc)
      d = safe_add(d, oldd)
      e = safe_add(e, olde)
    
    return Array(a, b, c, d, e)

  ###
   Perform the appropriate triplet combination function for the current iteration
  ###
  sha1_ft = (t, b, c, d)->
    if(t < 20)
      (b & c) | ((~b) & d)
    else if(t < 40)
      b ^ c ^ d
    else if(t < 60)
     (b & c) | (b & d) | (c & d)
    else 
      b ^ c ^ d

  ###
   Determine the appropriate additive constant for the current iteration
  ###
  sha1_kt = (t)->
    if(t < 20)
      1518500249
    else if(t < 40)
      1859775393
    else if(t < 60)
     -1894007588
    else 
      -899497514

  ###
   Add integers, wrapping at 2^32. This uses 16-bit operations internally
   to work around bugs in some JS interpreters.
  ###
  safe_add = (x, y)->
    lsw = (x & 0xFFFF) + (y & 0xFFFF)
    msw = (x >> 16) + (y >> 16) + (lsw >> 16)
    return (msw << 16) | (lsw & 0xFFFF)

  ###
   Bitwise rotate a 32-bit number to the left.
  ###
  bit_rol = (num, cnt)->
    return (num << cnt) | (num >>> (32 - cnt)) 

  pub.hex_sha1 = (s)->  
    rstr2hex(rstr_sha1(str2rstr_utf8(s)))

  pub.b64_sha1 = (s)->   
    return rstr2b64(rstr_sha1(str2rstr_utf8(s)))

  pub.any_sha1 = (s, e)->
    return rstr2any(rstr_sha1(str2rstr_utf8(s)), e)

  pub.hex_hmac_sha1 = (k, d)->
    return rstr2hex(rstr_hmac_sha1(str2rstr_utf8(k), str2rstr_utf8(d)))

  pub.b64_hmac_sha1 = (k, d)->
    return rstr2b64(rstr_hmac_sha1(str2rstr_utf8(k), str2rstr_utf8(d)))

  pub.any_hmac_sha1 = (k, d, e)->
    return rstr2any(rstr_hmac_sha1(str2rstr_utf8(k), str2rstr_utf8(d)), e)



  return pub

)()

