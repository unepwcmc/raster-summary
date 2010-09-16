require 'rubygems'#comment out for deployment
require 'sinatra'#comment out for deployment
require 'json'
require 'rio'
require 'fastercsv'

# set :path, "/var/www/vhosts/default_site/public/"
# set :starspanpath, "/usr/local/bin/"

set :path, ""
set :starspanpath, ""


#post geojson and get back the summary of PA data from the 


post '/carbon' do
  content_type :json

  #create file name and put geojson in the file- send back file id as a response
  
  #get unique file name
  id = getid
  filename = "#{id}.geojson"
  #check if file exists
  while rio("#{options.path}data/geojson/" + filename).exist?()
    id = getid
    filename = "#{id}.geojson"
  end
  
  #grab the geojson from the file
  data = [params[:geojson]].flatten.compact.uniq
  

   begin
  
      #chuck it in a file with unique ID
      rio("#{options.path}data/geojson/#{filename}") < data.to_s     # appenddata.to_s

      area = params[:area].to_i

      #choose which resolution for the area calcs (trial and error)
      if area < 10000
        resolution = 1
      else
        resolution = 2
      end


      #run starspan against the carbon raster
      create_carbon_sum_csv "#{options.path}data/geojson/#{filename}", id, resolution

      if rio("#{options.path}data/csv/#{id}.csv").exist?()    
        #unpackage csv and return as json with the 
          out = csvtohash("#{options.path}data/csv/#{id}.csv")
      else
          out = "no_csv"
      end
 
      out["polygon_id"] = id.to_s
      json  = out.to_json

      params[:callback] ? "#{params[:callback]} (#{json})" : json
 
   rescue Exception => e
   
     path = {'path' => options.path.to_s}     
     params[:callback] ? "#{params[:callback]} (#{path})" : path

   end

 
end

#TODO: this needs loads of refactoring- havent touched the old api endpoints so not to break it
#endpoint to recieve json of multiple geojson polygon
post '/carbon/batch' do
  content_type :json
  
  #grab the data and sort it into a way we can read (multiple files)
  
  data = JSON.parse(params[:data])
  
  #get array of features
  features = data["features"]
  
  
  #array to hold output json
  output = []
  features.each {|feature|
    
    #get unique file name
    id = getid
    filename = "#{id}.geojson"
    #check if file exists
    
    
    while rio("#{options.path}data/geojson/" + filename).exist?()
      id = getid
      filename = "#{id}.geojson"
    end

    #grab the geojson from the file
    geojson = feature["geojson"].to_json
    
    begin
        #chuck it in a file with unique ID
        rio("#{options.path}data/geojson/#{filename}") < geojson   # appenddata.to_s

        area = feature["area"].to_i

        #choose which resolution for the area calcs (trial and error)
        if area < 10000
          resolution = 1
        else
          resolution = 2
        end

        #run starspan against the carbon raster
        create_carbon_sum_csv "#{options.path}data/geojson/#{filename}", id, resolution

        if rio("#{options.path}data/csv/#{id}.csv").exist?()    
          #unpackage csv and return as json with the 
            out = csvtohash("#{options.path}data/csv/#{id}.csv")
        else
            out = "no_csv"
        end

        #get the sum out of the hash and add it to a hash array
        output << {"id" => feature["id"].to_s, "sum" => out["sum_Band1"].to_s}
        
     rescue Exception => e
     end
    
    #loop through each array running starspan
    
  }
  
    json  = output.to_json
    params[:callback] ? "#{params[:callback]} (#{json})" : json
  
end



#this returns the coverage of kbas within the polygon submitted by the /carbon service - it will not work if the carbon service has not been run first!!!!
get '/kba' do
  content_type :json

  
  #get unique file name id
  id = params[:polygon_id]
  
  filename = "#{id.to_s}.geojson"
 
  begin
    
    area = params[:area].to_i

    #choose which resolution for the area calcs (trial and error)
    if area < 10000
      resolution = 1
    else
      resolution = 2
    end

    #call the method which runs starspan TODO: would be good to abstract the use of starspan
    kbacoverage = create_kba_coverage "#{options.path}data/geojson/#{filename}", id, resolution  

    out = {"kbaperc" => kbacoverage.to_s}
    json  = out.to_json

    params[:callback] ? "#{params[:callback]} (#{json})" : json

  rescue Exception => e

    path = {'path' => options.path.to_s}
    params[:callback] ? "#{params[:callback]} (#{path})" : path

  end

 
end

#--------------- adding kba stuff in here too:

def create_kba_coverage geojson_path, fileid, resolution

  command = "#{options.starspanpath}starspan --vector #{geojson_path} --raster #{options.path}data/raster/kba/kba_ras/kba_#{resolution} --stats #{options.path}data/csv/kba#{fileid}.csv sum"
  #rio("/var/www/vhosts/default_site/public/tests/log.txt") << command
  system command
  starttime = Time.now
  until rio("#{options.path}data/csv/kba#{fileid}.csv").exist?() || (Time.now - starttime) > 20
    sleep 0.1
  end
  
  #read file here, get sum values and divide by the tot to get the coverage
 
  output = csvtohash "#{options.path}data/csv/kba#{fileid}.csv"
  coverage = output["sum_Band1"].to_f / output["numPixels"].to_f
   
end


def create_carbon_sum_csv geojson_path, fileid, resolution
  #run starspan
  command = "#{options.starspanpath}starspan --vector #{geojson_path} --raster #{options.path}data/raster/carbon2010/carbon_#{resolution} --stats #{options.path}data/csv/#{fileid}.csv sum avg mode min max stdev nulls"
  system command
  
  starttime = Time.now
  until rio("#{options.path}data/csv/#{fileid}.csv").exist?() || (Time.now - starttime) > 20
    sleep 0.1
  end
end

def getid
  (rand() * 100000000000).round.to_s
end

def csvtohash csv_path
  #turn csv into a hash then json (will only ever be one header row and one data row- TODO: change for multiple rasters for now)
  output = {}
  
  FasterCSV.foreach(csv_path, :headers => :first_row) do |row|
    row.each { |hed, val|
      output[hed] = val
    }
  end
  #rio("/var/www/vhosts/default_site/public/tests/log.txt") << output.to_json #testing the output
  output
end

get '/admin/allrequests' do
  geojson_all_requests
end


#request to package up all the geojson requests into one humungus geojson file - BEWARE- feature collections are not supported in QGIS- had to use FME to convert to shp!
def geojson_all_requests

  feature_array = []
  #iterate over all geojson files putting the coordinates into an
  #rio("/var/www/vhosts/default_site/public/data/geojson").files('*.geojson') { |gjfiles|

  rio("#{options.path}data/geojson").files('*.geojson') { |gjfiles|
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
  geojson = { "type" => "FeatureCollection", "features" => feature_array }
        
  geojson.to_json
              
              
  
end

def delete_files fileid
  #TODO: need to set up a way of clearing out all no longer needed result files- will leave for time being while testing
end


