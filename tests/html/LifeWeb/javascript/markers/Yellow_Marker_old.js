

function Yellow_Marker(latlng,opts,map) {
  google.maps.OverlayView.call(this);
  this.latlng_ = latlng;
  this.map_ = map;
  this.offsetVertical_ = -14;
  this.offsetHorizontal_ = -14;
  this.height_ = 28;
  this.width_ = 28;
	this.information_ = opts;

  var me = this;

	
  // this.setMap(this.map_);
}

Yellow_Marker.prototype = new google.maps.OverlayView();

Yellow_Marker.prototype.remove = function() {
  if (this.div_) {
    this.div_.parentNode.removeChild(this.div_);
    this.div_ = null;
  }
};

Yellow_Marker.prototype.draw = function() {
  // Creates the element if it doesn't exist already.
  this.createElement();
  if (!this.div_) return;

  // Calculate the DIV coordinates of two opposite corners of our bounds to
  // get the size and position of our Bar
  var pixPosition = this.getProjection().fromLatLngToDivPixel(this.latlng_);
  if (!pixPosition) return;

  // Now position our DIV based on the DIV coordinates of our bounds
  this.div_.style.width = this.width_ + "px";
  this.div_.style.left = (pixPosition.x + this.offsetHorizontal_) + "px";
  this.div_.style.height = this.height_ + "px";
  this.div_.style.top = (pixPosition.y + this.offsetVertical_) + "px";
	
	$(this.div_).fadeIn('fast');
  // this.div_.style.display = 'block';
};

Yellow_Marker.prototype.createElement = function() {
  var panes = this.getPanes();
	var this_ = this;
  var div = this.div_;
  if (!div) {
	
    div = this.div_ = document.createElement("div");
		$(div).addClass('marker_infowindow');
    div.style.border = "0px none";
    div.style.position = "absolute";
    div.style.background = "url('images/markers/18_yellow.png') no-repeat 0 0";
    div.style.width = "28px";
    div.style.height = "28px";
		div.style.cursor = 'pointer';
	
		var hiddenDiv = document.createElement('div');
		hiddenDiv.style.position = "absolute";
		hiddenDiv.style.display = 'none';
		hiddenDiv.style.top = '-107px';
		hiddenDiv.style.left = '-147px'; 
	  hiddenDiv.style.width = "342px";
	  hiddenDiv.style.height = "125px";
		hiddenDiv.style.background = "url('images/infowindows/bkg_yellow.png') no-repeat 0 0";
	  hiddenDiv.style.cursor = "default";

		var close = document.createElement('a');
		close.style.position = "absolute";
		close.style.top = '-7px';
		close.style.right = '-3px'; 
    close.style.width = "17px";
    close.style.height = "17px";
		close.style.background = "url(images/infowindows/close_window.png) no-repeat 0 -17px";
		$(close).hover(function(ev){
			$(this).css('background','url(images/infowindows/close_window.png) no-repeat 0 0');
		}, function(ev){
			$(this).css('background','url(images/infowindows/close_window.png) no-repeat 0 -17px');
		});
		close.style.cursor = "pointer";
		hiddenDiv.appendChild(close);


		var imgDiv = document.createElement('div');
		imgDiv.style.position = "absolute";
		imgDiv.style.top = '13px';
		imgDiv.style.left = '11px'; 
		imgDiv.style.width = "108px";
		imgDiv.style.height = "83px";
		imgDiv.style.border = '1px solid #CCCCCC';
		hiddenDiv.appendChild(imgDiv);

		var image_place = document.createElement("img");
		image_place.style.position = "absolute";
		image_place.style.float = 'left';
	  image_place.style.width = "100px";
	  image_place.style.height = "75px";
		image_place.style.border = '4px solid #E5E5E5';
	  if (this.information_.pictures.length>0) {
			image_place.src = this.information_.pictures[0];
		} else {
			image_place.src = 'http://mw2.google.com/mw-panoramio/photos/small/5110708.jpg';
		}
		imgDiv.appendChild(image_place);

		var title = document.createElement('p');
		title.style.float = "left";
		title.style.margin = '15px 0 0 132px';
		title.style.padding = '0';
	  title.style.width = "189px";
		title.style.height = "37px";
		title.style.overflow = "hidden";
		
		var link_title = document.createElement('a');
		link_title.style.font = 'bold 15px Arial';
		link_title.style.color = '#006699';
		if (this.information_.title.length>40) {
			$(link_title).text(this.information_.title.substr(0,40)+'...');
		} else {
			$(link_title).text(this.information_.title);
		}
		$(link_title).attr('href',this.information_.href);
		$(link_title).css('text-decoration','none');
		$(link_title).hover(function(ev){
			$(this).css('text-decoration','underline');
		}, function(ev){
			$(this).css('text-decoration','none');
		});
		title.appendChild(link_title);
		

		
		
		hiddenDiv.appendChild(title);

		var country = document.createElement('p');
		country.style.float = "left";
		country.style.padding = '0';
		country.style.width = "180px";
		country.style.margin = '2px 0 0 132px';
		country.style.font = 'normal 13px Arial';
		country.style.color = '#999999';
		$(country).html('Palau. 396,250$ required');
		hiddenDiv.appendChild(country);
		
		var good_div = document.createElement('div');
		good_div.style.margin = '5px 0 0 132px';
		good_div.style.position = "relative";
		good_div.style.float = "left";
	  good_div.style.width = "180px";
		
		var good_for = document.createElement('img');
		good_for.style.float = 'left';
	  good_for.style.width = "auto";
	  good_for.style.height = "auto";
		good_for.style.padding = "0";
		good_for.src = './images/infowindows/good_for.png';
		good_div.appendChild(good_for);
	
		var image_air = document.createElement("img");
		image_air.style.float = 'left';
	  image_air.style.width = "auto";
	  image_air.style.height = "auto";
		image_air.style.padding = "3px 0 0 5px";
		image_air.src = './images/infowindows/air.png';
		good_div.appendChild(image_air);
		
		var image_oil = document.createElement("img");
		image_oil.style.float = 'left';
	  image_oil.style.width = "auto";
	  image_oil.style.height = "auto";
		image_oil.style.padding = "3px 0 0 5px";
		image_oil.src = './images/infowindows/oil.png';
		good_div.appendChild(image_oil);
		
		var image_food = document.createElement("img");
		image_food.style.float = 'left';
	  image_food.style.width = "auto";
	  image_food.style.height = "auto";
		image_food.style.padding = "3px 0 0 5px";
		image_food.src = './images/infowindows/food.png';
		good_div.appendChild(image_food);
		
		var image_climate = document.createElement("img");
		image_climate.style.float = 'left';
	  image_climate.style.width = "auto";
	  image_climate.style.height = "auto";
		image_climate.style.padding = "3px 0 0 5px";
		image_climate.src = './images/infowindows/climate.png';
		good_div.appendChild(image_climate);
		
		var image_water = document.createElement("img");
		image_water.style.float = 'left';
	  image_water.style.width = "auto";
	  image_water.style.height = "auto";
		image_water.style.padding = "3px 0 0 5px";
		image_water.src = './images/infowindows/water.png';
		good_div.appendChild(image_water);
	
		hiddenDiv.appendChild(good_div);
	

    div.appendChild(hiddenDiv);


    function removeInfoBox(ib) {
      return function() {
        ib.setMap(null);
      };
    }

		$(close).click(
			function (ev) {
				$(this).parent().hide();
			}
		);
		
		$(div).hover(
			function (ev) {
				$(this).css('z-index',lastMask+1);
				lastMask++;
			}
		);

		$(div).click(
			function (ev) {
				if ($(ev.target).hasClass('marker_infowindow')) {
					if (!$(this).children('div').is(':visible')) {
						if (this_.map_.getZoom()<6) {
							this_.map_.setCenter(this_.latlng_);
							this_.map_.setZoom(6);
							this_.map_.panBy(0,-115);
						} else {
							if (!$(this).children('div').is(':visible')) {
								this_.map_.setCenter(this_.latlng_);
								this_.map_.panBy(0,-115);
							}
						}
					}

					if ( $(this).children('div').is(':visible')) {
						$(this).children('div').hide();
					} else {	
						$(this).parent().trigger("close_image");
						$(this).parent().bind('close_image', function() {
							$(this).children('div').children('div').hide();
						});				
						lastMask++;
						$(this).children('div').css('z-index',lastMask+1);
						$(this).css('z-index',lastMask);
						$(this).children('div').show();
					}
				}
			}
		);

    panes.floatPane.appendChild(div);				
		
    this.panMap();
  } else if (div.parentNode != panes.floatPane) {
    // The panes have changed.  Move the div.
    div.parentNode.removeChild(div);
    panes.floatPane.appendChild(div);
  }
}

Yellow_Marker.prototype.getPosition = function() {
    return this.latlng_;
};

Yellow_Marker.prototype.panMap = function() {

};

Yellow_Marker.prototype.setIcon = function(source,type) {
	$(this.div_).css('background','url("'+source+'") no-repeat 0 0');
	if (type=='far') {
		$(this.div_).css('height','28px');
		$(this.div_).css('width','28px');
		$(this.div_).children('div').css('left','-147px');
	  this.offsetVertical_ = -14;
	  this.offsetHorizontal_ = -14;
	  this.height_ = 28;
	  this.width_ = 28;
	} else {
		$(this.div_).css('height','54px');
		$(this.div_).css('width','52px');
		$(this.div_).children('div').css('left','-135px');
	  this.offsetVertical_ = -54;
	  this.offsetHorizontal_ = -26;
	  this.height_ = 54;
	  this.width_ = 52;
	}
};


Yellow_Marker.prototype.setVisible = function(bool) {
	if (bool) {
		this.setMap(this.map_);
	} else {
		this.setMap(null);
	}	
};

