# @import ../../vendor/lib/sha1.js

describe "SHA1", ->

  it "original js sha1 shows correct sha1 hash for abc", ->
    expect(hex_sha1("abc")).toEqual("a9993e364706816aba3e25717850c26c9cd0d89d")    
    
  it "ported coffeescript sha1 shows correct sha1 hash for abc", ->
    expect(SHA1.hex_sha1("abc")).toEqual("a9993e364706816aba3e25717850c26c9cd0d89d")
 