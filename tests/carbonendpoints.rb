require 'rubygems'
require 'httparty'
require 'json'
require 'rio'

class TestcarbonAPI
  
  include HTTParty
  format :html
  base_uri 'http://localhost:4567'  
  
  def initialize
  end
  
  def sendgeojson()
    
    geojson = IO.readlines('data/testgeojson.json','').to_s
    #puts geojson
    
    options = { :query => {:geojson => geojson} }
    
    puts '.........posted geojson........'
    self.class.post('/carbon', options)
    
    
    
  end
  
  def get_if_done(id)
  
    #options = { :query => {:id => id} }
    self.class.get("/carbon/#{id}")
    
  end
  
  
  def testrio
  
    rio("tests/log.txt") << "1"
    
  end
  
  
end