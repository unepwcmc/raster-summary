/* VARIABLES */
var map;
var protected_layer;
var carbon_layer;
var kba_layer;
var cluster1;
var cluster2;
var white_markers= [];
var yellow_markers=[];
var white_style = new Object();
var yellow_style = new Object();
var lastMask = 10000;

var e1 = true;
var e2 = true;
var e3 = true;
var e4 = true;
var e5 = true;

var ppe_infowindow;
var ppe_layer = false;

function initialize(lat,lng) {
		var center = new google.maps.LatLng(lat, lng);
 
		map = new google.maps.Map(document.getElementById('map'), {
			zoom: 6,
			center: center,
			mapTypeControl:false,
			navigationControl:false,
			mapTypeId: google.maps.MapTypeId.TERRAIN
		});
		

		carbon_layer=new SparseTileLayerOverlay();
		    carbon_layer.setUrl = function SetUrl(xy,z){
		    	var u=[];
		    	u[0]= 'http://development3.unep-wcmc.org/ArcGIS/rest/services/LifeWeb/Carbon2/MapServer/tile/'+z+'/'+xy.y+'/'+xy.x;
		    	return u;
		    };
		carbon_layer.setMap(map);
		carbon_layer.setStyle(0,{alpha:0.5});
		
		kba_layer=new SparseTileLayerOverlay();
		    kba_layer.setUrl = function SetUrl(xy,z){
		    	var u=[];
		    	u[0]= 'http://development3.unep-wcmc.org/ArcGIS/rest/services/LifeWeb/KBA/MapServer/tile/'+z+'/'+xy.y+'/'+xy.x;
		    	return u;
		    };
		kba_layer.setMap(null);
		kba_layer.setStyle(0,{alpha:0});
		
		protected_layer=new SparseTileLayerOverlay();
		    protected_layer.setUrl = function SetUrl(xy,z){
		    	var q=[];
		    	q[0]= 'http://184.73.201.235/blue/'+z+'/'+xy.x+'/'+xy.y;
		    	return q;
		    };
		protected_layer.setMap(null);
		protected_layer.setStyle(0,{alpha:0});
		
		
		
   
		$.ajax({
		  url: 'http://lifeweb.heroku.com/projects',
		  dataType: 'jsonp',
		  data: null,
		  success: function(result) {
			
					$.each(result, function(key, value) {
						if (value.matched) {
							var marker = new White_Marker(new google.maps.LatLng(value.lat, value.lon),value,map);
							white_markers.push(marker);
						} else {
							var marker = new Yellow_Marker(new google.maps.LatLng(value.lat, value.lon),value,map); 
							yellow_markers.push(marker);
						}
						marker.setMap(map);
					});
			 }
		});
		
		
		google.maps.event.addListener(map, 'click', function(ev){ 
				// console.log(ev);
				if (ppe_layer) {
					$.ajax({
					  url: 'http://www.protectedplanet.net/api2/sites?lat='+ev.latLng.b+'&lng='+ev.latLng.c,
					  dataType: 'jsonp',
					  data: null,
					  success: function(result) {
						 		console.log(result);

						 }
					});
				}
								
			}
		);

		
}

$(document).ready(function() {
		
	$('a.filter_markers_legend_button').click(function(ev){
		ev.stopPropagation();
		ev.preventDefault();
		if ($(this).parent().parent().hasClass('unclicked')){
			$(this).parent().parent().parent().children('div.clicked').fadeIn();
		} else {
			$(this).parent().parent().parent().children('div.clicked').fadeOut();				
		}
	});
	
  $('div.filterButtons div a').click(function(ev){
	  ev.stopPropagation();
	  ev.preventDefault();
  
	  if ($(this).parent().hasClass('unclicked')){
	          $(this).parent().parent().children('div.list').show();
	          $(this).parent().removeClass('unclicked');
	          $(this).parent().addClass('clicked');                   
	  }
	  else {
	          $(this).parent().parent().children('div.list').fadeOut();
	          $(this).parent().removeClass('clicked');
	          $(this).parent().addClass('unclicked');                                         
	  }
          
  });

	
	$('#matches').click(function(ev){
		ev.stopPropagation();
		ev.preventDefault();
		if ($(this).children('p').hasClass('enabled')) {
			$(this).children('p').removeClass('enabled');
			$(this).children('p').addClass('disabled');		
			cleanWhiteMarkers();
		} else {
			$(this).children('p').removeClass('disabled');
			$(this).children('p').addClass('enabled');
			showWhiteClusters();
		}
	});
	
	
	$('#potential').click(function(ev){
		ev.stopPropagation();
		ev.preventDefault();
		if ($(this).children('p').hasClass('enabled')) {
			$(this).children('p').removeClass('enabled');
			$(this).children('p').addClass('disabled');		
			cleanYellowMarkers();
		} else {
			$(this).children('p').removeClass('disabled');
			$(this).children('p').addClass('enabled');	
			showYellowClusters();
		}
	});
	
	
	$('#carbon_layer').click(function(ev){
		ev.stopPropagation();
		ev.preventDefault();
		if ($(this).parent().hasClass('checked')) {
			$(this).parent().removeClass('checked');
			$(this).parent().addClass('unchecked');		
			carbon_layer.setStyle(0,{alpha:0});
		} else {
			$(this).parent().removeClass('unchecked');
			$(this).parent().addClass('checked');	
			carbon_layer.setStyle(0,{alpha:.5});		
		}
	});
	
	$('#protected_layer').click(function(ev){
		ev.stopPropagation();
		ev.preventDefault();
		if ($(this).parent().hasClass('checked')) {
			$(this).parent().removeClass('checked');
			$(this).parent().addClass('unchecked');
			protected_layer.setMap(map);
			protected_layer.setStyle(0,{alpha:0});
			ppe_layer = false;		
		} else {
			$(this).parent().removeClass('unchecked');
			$(this).parent().addClass('checked');
			protected_layer.setMap(map);
			protected_layer.setStyle(0,{alpha:.5});	
			ppe_layer = true;	
		}
	});
	
	$('#kba_layer').click(function(ev){
		ev.stopPropagation();
		ev.preventDefault();
		if ($(this).parent().hasClass('checked')) {
			$(this).parent().removeClass('checked');
			$(this).parent().addClass('unchecked');
			kba_layer.setStyle(0,{alpha:0});
		} else {
			$(this).parent().removeClass('unchecked');
			$(this).parent().addClass('checked');
			kba_layer.setMap(map);
			kba_layer.setStyle(0,{alpha:.5});	
		}
	});
	
	
	$('#climate').click(function(ev){
		ev.stopPropagation();
		ev.preventDefault();
		if ($(this).parent().hasClass('checked')) {
			$(this).parent().removeClass('checked');
			$(this).parent().addClass('unchecked');
			e1 = false;
			if ($('#matches').children('p').hasClass('enabled')) showWhiteClusters();
			if ($('#potential').children('p').hasClass('enabled')) showYellowClusters();
		} else {
			$(this).parent().removeClass('unchecked');
			$(this).parent().addClass('checked');
			e1 = true;
			if ($('#matches').children('p').hasClass('enabled')) showWhiteClusters();
			if ($('#potential').children('p').hasClass('enabled')) showYellowClusters();
		}
	});
	
	
	$('#freshwater').click(function(ev){
		ev.stopPropagation();
		ev.preventDefault();
		if ($(this).parent().hasClass('checked')) {
			$(this).parent().removeClass('checked');
			$(this).parent().addClass('unchecked');
			e2 = false;
			if ($('#matches').children('p').hasClass('enabled')) showWhiteClusters();
			if ($('#potential').children('p').hasClass('enabled')) showYellowClusters();
		} else {
			$(this).parent().removeClass('unchecked');
			$(this).parent().addClass('checked');
			e2 = true;
			if ($('#matches').children('p').hasClass('enabled')) showWhiteClusters();
			if ($('#potential').children('p').hasClass('enabled')) showYellowClusters();
		}
	});
	
	
	$('#food').click(function(ev){
		ev.stopPropagation();
		ev.preventDefault();
		if ($(this).parent().hasClass('checked')) {
			$(this).parent().removeClass('checked');
			$(this).parent().addClass('unchecked');
			e3 = false;
			if ($('#matches').children('p').hasClass('enabled')) showWhiteClusters();
			if ($('#potential').children('p').hasClass('enabled')) showYellowClusters();
		} else {
			$(this).parent().removeClass('unchecked');
			$(this).parent().addClass('checked');
			e3 = true;
			if ($('#matches').children('p').hasClass('enabled')) showWhiteClusters();
			if ($('#potential').children('p').hasClass('enabled')) showYellowClusters();
		}
	});
	

	$('#potential_pro').click(function(ev){
		ev.stopPropagation();
		ev.preventDefault();
		if ($(this).parent().hasClass('checked')) {
			$(this).parent().removeClass('checked');
			$(this).parent().addClass('unchecked');
			e4 = false;
			if ($('#matches').children('p').hasClass('enabled')) showWhiteClusters();
			if ($('#potential').children('p').hasClass('enabled')) showYellowClusters();
		} else {
			$(this).parent().removeClass('unchecked');
			$(this).parent().addClass('checked');
			e4 = true;
			if ($('#matches').children('p').hasClass('enabled')) showWhiteClusters();
			if ($('#potential').children('p').hasClass('enabled')) showYellowClusters();
		}
	});


	$('#cultural').click(function(ev){
		ev.stopPropagation();
		ev.preventDefault();
		if ($(this).parent().hasClass('checked')) {
			$(this).parent().removeClass('checked');
			$(this).parent().addClass('unchecked');
			e5 = false;
			if ($('#matches').children('p').hasClass('enabled')) showWhiteClusters();
			if ($('#potential').children('p').hasClass('enabled')) showYellowClusters();	
		} else {
			$(this).parent().removeClass('unchecked');
			$(this).parent().addClass('checked');
			e5 = true;
			if ($('#matches').children('p').hasClass('enabled')) showWhiteClusters();
			if ($('#potential').children('p').hasClass('enabled')) showYellowClusters();
		}
	});



	
	
});


function showWhiteClusters() {
	for (var i=0; i<white_markers.length;i++) {
		if ((e1 && white_markers[i].information_.ecosystem_service.e1) || (e2 && white_markers[i].information_.ecosystem_service.e2) || (e3 && white_markers[i].information_.ecosystem_service.e3) || (e4 && white_markers[i].information_.ecosystem_service.e4) || (e5 && white_markers[i].information_.ecosystem_service.e5)) {
			white_markers[i].setMap(map);
		} else {
			white_markers[i].setMap(null);
		}
	}
	
}


function showYellowClusters() {
	for (var i=0; i<yellow_markers.length;i++) {
		if ((e1 && yellow_markers[i].information_.ecosystem_service.e1) || (e2 && yellow_markers[i].information_.ecosystem_service.e2) || (e3 && yellow_markers[i].information_.ecosystem_service.e3) || (e4 && yellow_markers[i].information_.ecosystem_service.e4) || (e5 && yellow_markers[i].information_.ecosystem_service.e5)) {
			yellow_markers[i].setMap(map);
		}else {
			yellow_markers[i].setMap(null);
		}
	}
}


function cleanYellowMarkers() {
	for (var i=0; i<yellow_markers.length;i++) {
			yellow_markers[i].setMap(null);
	}
}

function cleanWhiteMarkers() {
	for (var i=0; i<white_markers.length;i++) {
			white_markers[i].setMap(null);
	}
}

