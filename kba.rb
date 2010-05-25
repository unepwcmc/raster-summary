require 'rubygems'
require 'json'
require 'httparty'

class Kba
  def initialize
    
  end
  
  def self.convert_to_esri_json geojson #only for multipolygon
        
        input = JSON.parse geojson
        coordinates = input ["coordinates"]          
        geometries = { "rings" => coordinates  }
        all = { "geometryType" => "esriGeometryPolygon", "geometries" => geometries }    
    
  end
  
  def send_request_to_esri
  
    
    
  end
  
  
  
end