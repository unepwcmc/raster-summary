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
    
    options = { :query => {:geojson => geojson, :area => 7642899} }
    
    puts '.........posted geojson........'
    response = self.class.post('/carbon', options)
    
    output = JSON.parse(response)
    puts  output.class.to_s
    puts '.........carbon complete.......'
    
    puts output['polygon_id'].to_s
    
    
    pgid = output['polygon_id'].to_s
    kbaoptions = { :query => {:polygon_id =>  pgid, :area => 7642899} }
    puts '.........posted pgid...........'
    kbaoutput = self.class.get('/kba', kbaoptions)
    puts '.........return pgid...........'
    puts kbaoutput.to_s
   
  end
  
  def testbatch()
    
   geojson = IO.readlines('data/testjson.json','').to_s
   options = { :query => {:data => geojson} }
   
   puts "post geojson"
   response = self.class.post('/carbon/batch', options)
   
   output = JSON.parse(response)
   puts  output.class.to_s
   puts '.........carbon complete.......'
   puts output.to_yaml
    
  end
  
  
  def get_if_done()
  
    #options = { :query => {:id => id} }
    self.class.get("/carbon/test")
    
  end
  
  
  def testrio
  
    rio("tests/log.txt") << "1"
    
  end
  
  
end
