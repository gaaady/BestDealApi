//= require jquery.min.js

(function() {
	/*
		ts-service.js
		Service for identifing if the current website is a traffic source
	*/

		function tsSrvc() {
			this.trafficSources = ["booking.com","hotels.com"],
			this.host = null
		}

		tsSrvc.prototype = {
		  constructor: tsSrvc,
		  isTrafficSource: function (host) {
		  	if(new RegExp( '\\b' + this.trafficSources.join('\\b|\\b') + '\\b',"i").test(host)) {
				  this.host = host;
				  return true;
				} else {
					return false;
				}
		  }
		}


	/*
		destination-service.js
		Service for indentifying the destination in different Traffic Sources
	*/

		function destSrvc() {
		}

		destSrvc.prototype = {
		  constructor: destSrvc,
		  getDestination: function (host) {
		  	if(host == "www.booking.com") {
		  		return document.getElementById('destination').value;
		  	}
		  }
		}

	/*
		api.js
		Service for talking to BestDeal API
	*/

		function API() {
			this.url = "http://blooming-cliffs-1855.herokuapp.com"
		}

		API.prototype = {
		  constructor: API,
		  getOffers: function (destination) {
		  	// return $.getJSON(this.url + '/hotels?callback=bestdealCallback&destination='+destination, function(hotels) {
	     //      return hotels;
	     //    });
				var url = this.url + '/hotels'
				return $.ajax({
			    url: url,
			    data: 
			    {
			        destination: destination,
			        callback: "bestdealCallback"
			    },
			    dataType: "jsonp"
				});
		  }
		}

	/*
		view-service.js
		Service for rendering the view
	*/

		function viewSrvc(api,destination) {
			this.destination = destination,
			this.api = api
		}

		viewSrvc.prototype = {
		  constructor: viewSrvc,
		  
		  renderContainer: function() {
		  	var bdContainer = $("<div id='best-deal-container'></div>");
				var me = this;
				if(this.destination != "") {
					this.api.getOffers(this.destination).success(function(hotels) {
						bdContainer.html(me.renderHotels(hotels));
					});
				} else {
					this.api.getOffers(this.destination).success(function(hotels) {
						bdContainer.html(me.renderHotels(hotels));
					});
				}

				$('body').append(bdContainer);
		  },

		  renderHotels: function(hotels) {
		  	var hotelsContainer = $("<div class='bd-offers-container'></div>");
		  	var me = this;
		  	$.each(hotels, function() { 
		  		hotelsContainer.append($(me.renderHotel(this.hotel)));
		  	});
		  	return hotelsContainer;
		  },

		  renderHotel: function(hotel) {
		  	var html = "<div class='bd-offer'>";

		  	html+= "<div class='bd-offer-img-container'>";
		  	html+= "<img src='"+hotel.image+"'>";
		  	html+= "</div>";

		  	html+= "<div class='bd-offer-details-container'>";
		  	html+= "<div class='bd-offer-city'>"+hotel.city+"</div>";
		  	html+= "<div class='bd-offer-hotel-name'>"+hotel.name+"</div>";
		  	html+= "<div class='bd-offer-hotel-price'>"+hotel.price+"</div>";
		  	html+= "</div>";

		  	html+="</div>";
		  	return html;
		  }
		}

	var tsSrvc = new tsSrvc();
	if(tsSrvc.isTrafficSource(window.location.host)){
		var destSrvc = new destSrvc();
		var dest = destSrvc.getDestination(tsSrvc.host);

		var api = new API();
		//api.getOffers(dest);

		var viewSrvc = new viewSrvc(api,dest);
		viewSrvc.renderContainer();
	}
})();



