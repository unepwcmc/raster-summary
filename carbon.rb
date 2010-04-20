require 'rubygems'
require 'sinatra'
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
  while rio('data/geojson/' + filename).exist?()
    id = getid
    filename = "#{id}.geojson"
  end
  
  #grab the geojson from the file
  data = [params[:geojson]].flatten.compact.uniq
  
  #chuck it in a file with unique ID
  rio("data/geojson/#{filename}") << data.to_s     # appenddata.to_s
  
  #run starspan against the carbon raster
  create_carbon_sum_csv "data/geojson/#{filename}", id
    
  #send back results when the file is detected- if longer than 1 minute then send back id for polling
  starttime = Time.now
  until rio("data/csv/#{id}.csv").exist?() || (Time.now - starttime) > 60
  end
  
  
  if rio("data/csv/#{id}.csv").exist?()    
    #unpackage csv and return as json with the 
      csvtojson "data/csv/#{id}.csv"
  else
      id.to_s
  end
  
 
end

get '/carbon/:id' do
  if rio("data/csv/#{params[:id]}.csv").exist?()    
    IO.readlines("data/csv/#{params[:id]}.csv",'').to_s 
    else
    'not ready'
  end
        
end

def create_carbon_sum_csv geojson_path, fileid 
  `starspan --vector #{geojson_path} --raster data/raster/carbon_tot --stats data/csv/#{fileid}.csv sum avg mode min max stdev nulls`
  # just for testing rio("data/csv/#{id}.csv") << "1,2,3,4,arse"  
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
  #rio("tests/log.txt") << output.to_json #testing the output
  output.to_json  
end

def delete_files fileid
  #TODO: need to set up a way of clearing out all no longer needed result files- will leave for time being while testing
end
