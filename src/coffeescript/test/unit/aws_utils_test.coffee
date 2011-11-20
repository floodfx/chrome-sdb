# @import ../../vendor/lib/aws_utils.js

describe "AwsUtils", ->

  it "date time format", ->
    date = Date.parse("Oct 13 2011 00:00")
    expect(AwsUtils.date_time_format(date)).toEqual(OldAwsUtil.dateTimeFormat(date))
  
  it "generates expected signature", ->
    expect(AwsUtils.generate_sig({b:"a",a:"b"},"key")).toEqual(OldAwsUtil.generateSignature({b:"a",a:"b"},"key"))
