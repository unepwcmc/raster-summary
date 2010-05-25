
  function PPE_Infowindow(latlng, opts, map) {
    this.latlng_ = latlng;
		this.information_ = opts;
	  this.offsetVertical_ = -125;
	  this.offsetHorizontal_ = -161;
	  this.height_ = 130;
	  this.width_ = 348;
    this.setMap(map);
  }
 
  PPE_Infowindow.prototype = new google.maps.OverlayView();
 
  PPE_Infowindow.prototype.draw = function() {
    var me = this;
 
    var div = this.div_;
    if (!div) {
      div = this.div_ = document.createElement('DIV');
      div.style.border = "none";
      div.style.position = "absolute";
      div.style.paddingLeft = "0px";
      div.style.cursor = 'pointer';
			div.style.width = '348px';
			div.style.height = '130px';
			div.style.background = 'url(images/area_bkg.png) no-repeat 0 0';
			div.style.zIndex = lastMask;
			
			var close = document.createElement('a');
			close.style.position = "absolute";
			close.style.top = '-7px';
			close.style.right = '2px'; 
	    close.style.width = "17px";
	    close.style.height = "17px";
			close.style.background = "url(images/infowindows/close_window.png) no-repeat 0 -17px";
			$(close).hover(function(ev){
				$(this).css('background','url(images/infowindows/close_window.png) no-repeat 0 0');
			}, function(ev){
				$(this).css('background','url(images/infowindows/close_window.png) no-repeat 0 -17px');
			});
			close.style.cursor = "pointer";
			div.appendChild(close);
			
			var imgDiv = document.createElement('div');
			imgDiv.style.position = "absolute";
			imgDiv.style.top = '13px';
			imgDiv.style.left = '11px'; 
			imgDiv.style.width = "108px";
			imgDiv.style.height = "83px";
			imgDiv.style.border = '1px solid #CCCCCC';
			div.appendChild(imgDiv);

			var image_place = document.createElement("img");
			image_place.style.position = "absolute";
			image_place.style.float = 'left';
		  image_place.style.width = "100px";
		  image_place.style.height = "75px";
			image_place.style.border = '4px solid #E5E5E5';
			// 		  if (this.information_pictures!=null || this.information_.pictures.length>0) {
			// 	image_place.src = this.information_.pictures[0];
			// } else {
				image_place.src = 'http://mw2.google.com/mw-panoramio/photos/small/5110708.jpg';
			// }
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
			link_title.style.color = '#FFFFFF';
			// if (this.information_.title.length>40) {
			// 				$(link_title).text(this.information_.title.substr(0,40)+'...');
			// 			} else {
			// 				$(link_title).text(this.information_.title);
			// 			}
			$(link_title).text('Cursos del Río Tajo');
			$(link_title).attr('href','adsf');
			$(link_title).css('text-decoration','none');
			$(link_title).hover(function(ev){
				$(this).css('text-decoration','underline');
			}, function(ev){
				$(this).css('text-decoration','none');
			});
			title.appendChild(link_title);

			div.appendChild(title);

			var country = document.createElement('p');
			country.style.float = "left";
			country.style.padding = '0';
			country.style.width = "180px";
			country.style.margin = '15px 0 0 132px';
			country.style.font = 'normal 13px Arial';
			country.style.color = '#999999';
			$(country).html('Ecuador, IUCN Category <strong>lb</strong');
			div.appendChild(country);
			
			var visit = document.createElement('p');
			visit.style.float = "left";
			visit.style.padding = '0';
			visit.style.width = "180px";
			visit.style.margin = '0 0 0 132px';
			visit.style.font = 'normal 11px Arial';
			visit.style.fontStyle = 'italic';
			visit.style.color = '#999999';
			$(visit).html('click to visit <a href="htpp://www.protectedplanet.net" style="color:#006699" target="blank">protectedplanet.net</a>');
			div.appendChild(visit);
			
			$(close).click(
				function (ev) {
					me.setMap(null);
				}
			);
			

      // Then add the overlay to the DOM
      var panes = this.getPanes();
      panes.overlayImage.appendChild(div);
    }
 
    // Position the overlay 
	  var pixPosition = this.getProjection().fromLatLngToDivPixel(this.latlng_);
    if (pixPosition) {
		  div.style.width = this.width_ + "px";
		  div.style.left = (pixPosition.x + this.offsetHorizontal_) + "px";
		  div.style.height = this.height_ + "px";
		  div.style.top = (pixPosition.y + this.offsetVertical_) + "px";
    }
  };
 
  PPE_Infowindow.prototype.remove = function() {
    // Check if the overlay was on the map and needs to be removed.
    if (this.div_) {
      this.div_.parentNode.removeChild(this.div_);
      this.div_ = null;
    }
  };
 
  PPE_Infowindow.prototype.getPosition = function() {
   return this.latlng_;
  };


	// lastMask++;
	// $(this).children('div').css('z-index',lastMask+1);

