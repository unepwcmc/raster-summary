require 'rubygems'
require 'httparty'
require 'json'
require 'rio'

class TestcarbonAPI
  
  include HTTParty
  format :html
  #base_uri 'http://ec2-174-129-149-237.compute-1.amazonaws.com'  
  base_uri 'http://localhost:4567'
  def initialize
  end
  
  def sendgeojson()
    
    geojson = IO.readlines('data/testgeojson.json','').to_s
    #puts geojson
    
    options = { :query => {:geojson => geojson, :area => 100} }
    
    puts '.........posted geojson........'
    self.class.post('/carbon', options)
    
    
    
  end
  
  def get_if_done()
  
    #options = { :query => {:id => id} }
    self.class.get("/carbon/test")
    
  end
  
  
  def testrio
  
    rio("tests/log.txt") << "1"
    
  end
  
  
end
