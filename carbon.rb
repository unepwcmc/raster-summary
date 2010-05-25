require 'json'
require 'rio'
require 'fastercsv'


#post geojson and get back the summary of PA data from the 
post '/carbon' do
  content_type :json

  #create file name and put geojson in the file- send back file id as a response
  
  #get unique file name
  id = getid
  filename = "#{id}.geojson"
  #check if file exists
  while rio('/var/www/vhosts/default_site/public/data/geojson/' + filename).exist?()
    id = getid
    filename = "#{id}.geojson"
  end
  
  #grab the geojson from the file
  data = [params[:geojson]].flatten.compact.uniq
 
  #chuck it in a file with unique ID
  rio("/var/www/vhosts/default_site/public/data/geojson/#{filename}") < data.to_s     # appenddata.to_s
  
  area = params[:area].to_i
  
  #choose which resolution for the area calcs (trial and error)
  if area < 10000
    resolution = 1
  else
    resolution = 2
  end

  
  #run starspan against the carbon raster
  create_carbon_sum_csv "/var/www/vhosts/default_site/public/data/geojson/#{filename}", id, resolution
    
  if rio("/var/www/vhosts/default_site/public/data/csv/#{id}.csv").exist?()    
    #unpackage csv and return as json with the 
      json = csvtojson "/var/www/vhosts/default_site/public/data/csv/#{id}.csv"
  else
      json = "no_csv"
  end
  
  params[:callback] ? "#{params[:callback]} (#{json})" : json
end


#post geojson and get back the summary of PA data from the 
get '/carbon/test' do
  content_type :json
  geoff = {'hello' => 'world'}
  json = geoff.to_json
  
  #OUTPUT WITH CALLBACK
  #params[:callback] ? "#{params[:callback]} (#{json})" : json
end

get '/carbon/:id' do
  if rio("data/csv/#{params[:id]}.csv").exist?()    
    IO.readlines("data/csv/#{params[:id]}.csv",'').to_s 
    else
    'not ready'
  end
        
end

def create_carbon_sum_csv geojson_path, fileid, resolution
  
  command = "/usr/local/bin/starspan --vector #{geojson_path} --raster /var/www/vhosts/default_site/public/data/raster/carbon2010/carbon_#{resolution} --stats /var/www/vhosts/default_site/public/data/csv/#{fileid}.csv sum avg mode min max stdev nulls"
  rio("/var/www/vhosts/default_site/public/tests/log.txt") << command
  system command
  starttime = Time.now
  until rio("/var/www/vhosts/default_site/public/data/csv/#{fileid}.csv").exist?() || (Time.now - starttime) > 20
    sleep 0.1
  end
end

def getid
  (rand() * 100000000000).round.to_s
end

def csvtojson csv_path
  #turn csv into a hash then json (will only ever be one header row and one data row- TODO: for now)
  output = {}
  
  FasterCSV.foreach(csv_path, :headers => :first_row) do |row|
    row.each { |hed, val|
      output[hed] = val
    }
  end
  rio("/var/www/vhosts/default_site/public/tests/log.txt") << output.to_json #testing the output
  output.to_json  
end

get '/admin/allrequests' do
  geojson_all_requests
end

def geojson_all_requests

feature_array = []
#iterate over all geojson files putting the coordinates into an
#rio("/var/www/vhosts/default_site/public/data/geojson").files('*.geojson') { |gjfiles|

rio("/var/www/vhosts/default_site/public/data/geojson").files('*.geojson') { |gjfiles|
  #parse the file into an array ready to go into the new json
  begin
    json_ar = JSON.parse rio(gjfiles).read 
    feature = {  "geometry" => json_ar, "type" => "Feature" }       
    feature_array << feature
  rescue Exception => e
    #just to catch the mental json files
  end
  
  }
  
  #set up all the geojson headers and stuff for a feature collection and add the features
  geojson = { "type" => "FeatureCollection",
              "features" => feature_array }
        
  geojson.to_json
              
              
  
end

def delete_files fileid
  #TODO: need to set up a way of clearing out all no longer needed result files- will leave for time being while testing
end


