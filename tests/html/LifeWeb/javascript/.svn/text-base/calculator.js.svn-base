	var COLORS = [["#999999", "#333333"]];
	var options = {};
	var lineCounter_ = 0;
	var shapeCounter_ = 0;
	var markerCounter_ = 0;
	var colorIndex_ = 0;
	var featureTable_;
	var map;
	var geocoder = null;
	var polygon;
	var ex_polygon;
	var map_click_event;
	var polygon_area;
  
	
	
	$(document).ready(function() {
		
			if ($('#search_text').val()!='Search by city, area, ...') {
				$(this).css('color','#666666');
			}
			
			$('div.modal').css('opacity','0.7');
		
	    $('#zoom_in').click(function(ev){
				ev.stopPropagation();
				ev.preventDefault();
				map.setZoom(map.getZoom()+1);
			});
			$('#zoom_out').click(function(ev){
				ev.stopPropagation();
				ev.preventDefault();
				map.setZoom(map.getZoom()-1);
			});
			$('#search_text').click(function(ev){
				ev.stopPropagation();
				ev.preventDefault();
				if ($(this).val() == 'Search by city, area, ...') {
					$(this).val('');
					$(this).focus();
					$(this).css('color','#666666');
				}
			});
			
			$('div.map_tools a').click(function(ev){
				ev.stopPropagation();
				ev.preventDefault();
			});
			
	});
	

	function select(buttonId) {
		if (buttonId == 'select') {
			// FAKE POLYGON CLICK
			GEvent.addListener(map, "click", function(overlay, latlng, overlaylatlng) {
				showLoader();
				setTimeout(function(){
					if (overlaylatlng!=null) {
						GEvent.clearListeners(map, "click");
						map.setCenter(new GLatLng(5.380866756582382, -7.525634765625));
						if (polygon!=null) {
							map.removeOverlay(polygon);
						}
						ex_polygon.setFillStyle({opacity:0.7});
						ex_polygon.setStrokeStyle({opacity:0.9});
						makePolygonOperations();
					  ex_polygon.enableEditing();
						GEvent.bind(ex_polygon, "lineupdated", null, function(){
							makePolygonOperations();
						});
					}
					$('div.big_loader').fadeOut();
				},2000);
				
			});
		}
		if (buttonId == 'draw') {
			GEvent.clearListeners(map, "click");
		}
	  document.getElementById("select").className="";
	  document.getElementById("draw").className="";
	  document.getElementById(buttonId).className="selected";
	}

	function stopEditing() {
	  select("select");
	}

	function getColor(named) {
	  return COLORS[(colorIndex_++) % COLORS.length][named ? 0 : 1];
	}

	function startShape() {
	  select("draw");
		if (!$('#done').hasClass('disabled')) {
			$('#done').addClass('disabled');
		}
		if (polygon!=null) {
			map.removeOverlay(polygon);
		}
		ex_polygon.setFillStyle({opacity:0});
		ex_polygon.setStrokeStyle({opacity:0});
		ex_polygon.disableEditing();
		$('strong.area').html('');
		$('strong.carbon').html('');
	  var color = getColor(false);
	  polygon = new GPolygon([], color, 2, 0.7, color, 0.2);
	  startDrawing(polygon, "Shape " + (++shapeCounter_), function() {
		  	var area = polygon.getArea();
				getStaticImage(polygon);
				if ($('#done').hasClass('disabled')) {
					$('#done').removeClass('disabled');
				}
				$('strong.area').html('');
				$('strong.carbon').html('');
				$('#loader_image').show();
				getCarbonHeight(polygon);
				
				polygon_area = (Math.floor(area / 10000) / 100).toFixed(0);
				$('strong.area').html(polygon_area);
				$('div.modal_window p.area').html(polygon_area);
		  }, color);
	}


	function startDrawing(poly, name, onUpdate, color) {
	  map.addOverlay(polygon);
	  polygon.enableDrawing(options);
	  polygon.enableEditing({onEvent: "mouseover"});
	  polygon.disableEditing({onEvent: "mouseout"});
		
	  GEvent.addListener(polygon, "endline", function() {
			select("select");
			GEvent.bind(polygon, "lineupdated", null, onUpdate);
	    GEvent.addListener(poly, "click", function(latlng, index) {
	      if (typeof index == "number") {
	        polygon.deleteVertex(index);
	      }
	    });
	  });
	}


	function makePolygonOperations() {
			var area = ex_polygon.getArea();
			getStaticImage(ex_polygon);
			if ($('#done').hasClass('disabled')) {
				$('#done').removeClass('disabled');
			}
			$('strong.area').html('');
			$('strong.carbon').html('');
			$('#loader_image').show();
			getCarbonHeight(ex_polygon);
			polygon_area = (Math.floor(area / 10000) / 100).toFixed(0);
			$('strong.area').html(polygon_area);
			$('div.modal_window p.area').html(polygon_area);
	}
	

	function initialize() {
	  if (GBrowserIsCompatible()) {
	    map = new GMap2(document.getElementById("map"));
	    map.setCenter(new GLatLng(42.4419, 15.1419), 2);
	    map.clearOverlays();
			map.setMapType(G_PHYSICAL_MAP);
			geocoder = new GClientGeocoder();
			
			var copy_wcmc = new GCopyrightCollection("g");
			copy_wcmc.addCopyright(new GCopyright('Carbon',new GLatLngBounds(new GLatLng(-90,-180), new GLatLng(90,180)),0,'2010 UNEP-WCMC'));
			var tilelayer = new GTileLayer(copy_wcmc);
			tilelayer.getTileUrl = function(xy,z) { return 'http://development3.unep-wcmc.org/ArcGIS/rest/services/LifeWeb/Carbon_webmerc/MapServer/tile/'+z+'/'+xy.y+'/'+xy.x};
			tilelayer.isPng = function() { return true;};
			tilelayer.getOpacity = function() { return 0.7; }

			ppeOverlay = new GTileLayerOverlay(tilelayer);
			map.addOverlay(ppeOverlay);

			var copy_gbif = new GCopyrightCollection("©");
			copy_gbif.addCopyright(new GCopyright(' ',new GLatLngBounds(new GLatLng(-90,-180), new GLatLng(90,180)),0,' '));
			var tilelayer_ppe = new GTileLayer(copy_gbif);
			tilelayer_ppe.getTileUrl = function(xy,z) { return 'http://184.73.201.235/blue/'+z+'/'+xy.x+'/'+xy.y; };
			tilelayer_ppe.isPng = function() { return true;};
			tilelayer_ppe.getOpacity = function() { return 1; }

			var ppe_overlay = new GTileLayerOverlay(tilelayer_ppe);
			map.addOverlay(ppe_overlay);

	    ex_polygon = new GPolygon(ex_coords,"#999999", 2, 0, "#333333", 0);
			map.addOverlay(ex_polygon);
			
	    select("select");

	  }
	}
	
	function showAddress(address) {
    if (geocoder) {
      geocoder.getLatLng(
        address,
        function(point) {
          if (!point) {
            $('#not_found').fadeIn();
						$('#not_found').delay(2000).fadeOut();
          } else {
            map.setCenter(point, 8);
          }
        }
      );
    }
  }

	function getCarbonHeight(polygon){
		var geojson = polys2geoJson([polygon]);
		var dataObj = ({area:polygon_area,geojson: geojson});    
		$.ajax({
					//http://192.168.1.129:4567/
		    	url: "http://ec2-174-129-149-237.compute-1.amazonaws.com/carbon",
					method: 'POST',
		    	data: dataObj,
		    	cache: false,
					dataType: 'jsonp',
		    	success: function(result){
						$('#loader_image').hide();
						$('strong.carbon').text(Math.floor(result.sum_Band1));
		    	},
		      error:function (xhr, ajaxOptions, thrownError){
	        	alert('CBD' + xhr.status + "\n" + thrownError);
	        }
		 });
	}
	
	function polys2geoJson(polygons) {
	    var geojson={"type":"MultiPolygon"};
	    var polys = [];
	    _.each(polygons,function(pol) {
	        var poly =[];
	        //fake the paths, we dont support yet inner rings
	        var path=[];
	        var numPoints = pol.getVertexCount();
	        for(var i=0; i < numPoints; i++) {
	            var lat = pol.getVertex(i).lat();
	            var lng = pol.getVertex(i).lng();
	            path.push([lng,lat]);
	        }
	        poly.push(path);
	        polys.push(poly);
	    });
	    geojson['coordinates'] = polys;

	    return $.toJSON(geojson);
	}
	
	function showModal() {
		if (!$('#done').hasClass('disabled')) {
			GEvent.clearListeners(map, "click");
			var wscr = $(window).width();
		  var hscr = $(window).height();

		  var mleft = ( wscr - 544 ) / 2;
		  var mtop = ( hscr - 315 ) / 2;

		  $('div.modal_window').css("left", mleft+'px');
		  $('div.modal_window').css("top", mtop+'px');
			$('div.modal').fadeIn(100,function(ev){$('div.modal_window').fadeIn(400)});
		}
	}
	
	function showLoader() {
			var wscr = $(window).width();

		  var mleft = ( wscr - 60 ) / 2;

		  $('div.big_loader').css("left", mleft+'px');
			$('div.big_loader').show();
	}
	
	function firstState() {
		if (polygon!=null) {
			map.removeOverlay(polygon);
		}
		ex_polygon.setFillStyle({opacity:0});
		ex_polygon.setStrokeStyle({opacity:0});
		ex_polygon.disableEditing();
		$('#done').addClass('disabled');
		$('div.modal_window').fadeOut(300,function(ev){
			$('div.modal').fadeOut(100);
			select('select');
			$('#loader_image').hide();
			$('strong.area').html('');
			$('strong.carbon').html('');
			if (!$('#done').hasClass('disabled')) {
				$('#done').addClass('disabled');
			}
		});
		
	}
	
	function getStaticImage(polygon) {
		var markers=[];
    var numPoints = polygon.getVertexCount();
		
		for(var i=0; i < numPoints; i++) {
        var lat = polygon.getVertex(i).lat();
        var lng = polygon.getVertex(i).lng();
        markers.push(new GLatLng(lat,lng));
    }

		var polygonEncoder = new PolylineEncoder();
		var finalPolygon = polygonEncoder.dpEncode(markers);
		
		$('div.image img').attr('src','http://maps.google.com/maps/api/staticmap?size=115x75&key=nokey&sensor=false&path=fillcolor:0x666666|color:0x666666|weight:1|enc:'+finalPolygon.encodedPoints);

	}
	
	//function checkPointArea(latlng) {
		// $.ajax({
		// 			    	type: "POST",
		// 			    	url: "http://www.protectedplanet.net/api2/sites?lat="+latlng.lat()+"&lng="+latlng.lng(),
		// 			    	data: null,
		// 			    	cache: false,
		// 			    	success: function(result){
		// 			console.log(result);
		// 			    	},
		// 			      error:function (xhr, ajaxOptions, thrownError){
		// 		        	alert('CBD' + xhr.status + "\n" + thrownError);
		// 		        }
		//  });
	//}
	