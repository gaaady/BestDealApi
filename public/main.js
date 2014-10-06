// TODO: extract services to separate files

var jQuery;

if (window.jQuery === undefined) {
 var script_tag = document.createElement('script');
 script_tag.setAttribute("type","text/javascript");
 script_tag.setAttribute("src","https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js");
 if (script_tag.readyState) {
   script_tag.onreadystatechange = function () { // For old versions of IE
       if (this.readyState == 'complete' || this.readyState == 'loaded') {
           scriptLoadHandler();
       }
   };
 } else { // Other browsers
   script_tag.onload = scriptLoadHandler;
 }
 (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);    
} else {    
 jQuery = window.jQuery;
 main(); //our main JS functionality
}

function scriptLoadHandler() {
 jQuery = window.jQuery.noConflict(true);

 main(); //our main JS functionality
}

function main() {     
   jQuery(document).ready(function($) {
   	(function() {

   		/*
				trip-advisor.js
				Class for data scraping of trip advisor
				@trafficSources: Array of authorized traffic sources
				@host: the current traffic source
			*/

			function TripAdvisor() {
			}

			TripAdvisor.prototype = {
				constructor: TripAdvisor,
				// Look for destination on trip advisor window variables
				// If not available, try scraping the html
				getDestination: function() {
					var destination = window.geoName;
					destination = destination || (function() {
						try {
							return window.ta.retrieve('mapsv2.geoName');
						} 
						catch(e) {
							console.log("BestDeal error" + e.message);
							return null;
						}
					})();
					// TODO: scrape the html if no destination found
					return destination;
				},

				getDates: function () {
			  	var dates = {};
			  	dates.checkin = (function(){
			  		try {
			  			return window.ta.retrieve("multiDP.inDate");	
			  		}
			  		catch(e) {
			  			console.log("BestDeal error" + e.message);
			  			return null;
			  		}
			  	})();
			  	dates.checkout = (function(){
			  		try {
			  			return window.ta.retrieve("multiDP.outDate");	
			  		}
			  		catch(e) {
			  			console.log("BestDeal error" + e.message);
			  			return null;
			  		}
			  	})();
			  	// TODO: scrape the html if no dates found
				  return dates;
				},

				getPrice: function () {
					var price = {};
			  	price.currency = this.getCurrency();

			  	try {
				  	var pricesArr = $('.priceBlock .price'); // get the divs containing the price
				  	var sum = 0;

						$.each(pricesArr,function () {
							var pString = $(this).html();
							var price = parseInt(pString.replace(/\D/g,'')); // remove non number chars from price string
							sum +=  price;
						});

						price.average = parseInt(sum / pricesArr.length);	
			  	} catch(e) {
			  		console.log("BestDeal error" + e.message);
			  		price.average = null;
			  	}

			  	return price; 
				},

				getCurrency: function () {
					var currString = $('#CURRENCYPOP .link').html();
					if(currString) {
						return currString.substring(0,currString.indexOf("<"));
					} else {
						return "";
					}
				}
			};

			function Booking() {
			}

			Booking.prototype = {
				constructor: Booking,
				getDestination: function() {
					return $('#destination').value;
				},

				getDates: function () {
			  	var dates = {};
			  	dates.checkout = (function () {
			  		try {
			  			return window.booking.env.b_checkin_date;
			  		} catch(e) {
			  			console.log("BestDeal error" + e.message);
			  			return null;
			  		}
			  	})();
			  	
				  dates.checkout = (function () {
			  		try {
			  			return window.booking.env.b_checkout_date;
			  		} catch(e) {
			  			console.log("BestDeal error" + e.message);
			  			return null;
			  		}
			  	})();

				  return dates;
				},

				getPrice: function () {
					var price = {};
			  	price.currency = this.getCurrency();
			  	try {
				  	var pricesArr = this.getRoomPricesArray();
				  	var sum = 0;

						$.each(pricesArr,function () {
							var pString = $(this).html();
							var price = parseInt(pString.replace(/\D/g,''));
							sum +=  price;
						});

				  	price.average = parseInt(sum / pricesArr.length);
			  	} catch(e) {
			  		console.log("BestDeal error" + e.message);
			  		price.average = null;
			  	}
			  	return price;
				},

				getCurrency: function () {
					try {
						return window.booking.env.b_selected_currency;
					} catch(e) {
						console.log("BestDeal error" + e.message);
						return null;
					}
				},

				getRoomPricesArray: function () {
					return $('.roomPrice .price b').length > 0 ? $('.roomPrice .price b') : $('.rooms-table-room-price');
				}
			}

			function Hotels() {
			}

			Hotels.prototype = {
				constructor: Hotels,
				getDestination: function() {
					try {
						if($('#destination').length > 0){
				  		return $('#destination').val().split(',')[0];
				  	} else if ($('#q-destination').length > 0) {
				  		return $('#q-destination').val().split(',')[0];
				  	} else if ($('.adr .locality').length > 0) {
				  		return $('.adr .locality').html().split(',')[0];
				  	} else {
				  		return "";
				  	}
					} catch(e) {
						console.log("BestDeal error" + e.message);
						return "";
					}
				},

				getDates: function () {
			  	var dates = {};
			  	dates.checkin = (function () {
			  		try {
			  			return window.commonDataBlock.search.checkinDate;
			  		} catch(e) {
			  			console.log("BestDeal error" + e.message);
			  			return null;
			  		}
			  	})();
			  	dates.checkout = (function () {
			  		try {
			  			return window.commonDataBlock.search.checkoutDate;
			  		} catch(e) {
			  			console.log("BestDeal error" + e.message);
			  			return null;
			  		}
			  	})();
			  	return dates; 
				},

				getPrice: function () {
					var price = {};
			  	price.currency = this.getCurrency();

			  	try {
				  	var pricesArr = $('.price ins');
				  	var sum = 0;

						$.each(pricesArr,function () {
							var pString = $(this).html();
							var price = parseInt(pString.replace(/\D/g,''));

							sum +=  price;
						});

						if(pricesArr.length > 0) {
							price.average = parseInt(sum / pricesArr.length);	
						} else {
							price.average = parseInt($('.feature-price .current-price').html().replace(/\D/g,''));
						}
			  	} catch(e) {
			  		console.log("BestDeal error" + e.message);
			  		price.average = null;
			  	}

			  	return price; 
				},

				getCurrency: function () {
					return window.commonDataBlock.page.currency;
				}
			}


			/*
				ts-service.js
				Service for identifing if the current website is a traffic source
				@trafficSources: Array of authorized traffic sources
				@host: the current traffic source
			*/

				function tsSrvc() {
					this.trafficSources = ["booking.com","hotels.com","tripadvisor.com"],
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
				  },

				  trafficSourceClass: function () {
				  	if(this.host.indexOf(this.trafficSources[0]) > -1) {
				  		return new Booking();
				  	} else if (this.host.indexOf(this.trafficSources[1]) > -1) {
				  		return new Hotels();
				  	} else if (this.host.indexOf(this.trafficSources[2]) > -1) { 
				  		return new TripAdvisor();
				  	}
				  }
				}

			/*
				api.js
				Service for talking to BestDeal API
			*/

				function API(viewSrvc) {
					this.url = "https://blooming-cliffs-1855.herokuapp.com",
					this.viewSrvc = viewSrvc
				}

				API.prototype = {
				  constructor: API,
				  getOffers: function (destination) {
				  	try {
					  	var me = this;
					  	$.getJSON(this.url + '/hotels?destination='+destination+'&callback=?', function(hotels) {
			          me.viewSrvc.renderContainer(hotels);
			        });
					  } catch(e) {
					  	console.log("BestDeal Server Error: "+e.message);
					  }
				  }
				}

			/*
				view-service.js
				Service for rendering the view
				TODO: extract views to templates
			*/

				function viewSrvc(api,data) {
					this.data = data;
				}

				viewSrvc.prototype = {
				  constructor: viewSrvc,
				  
				  renderContainer: function(hotels) {
				  	var bdContainer = $("<div id='best-deal-container'></div>");
						var me = this;
						bdContainer.html(this.renderHotels(hotels));
						bdContainer.append(this.renderDebugMode());
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
				  },

				  renderDebugMode: function() {
				  	var debugContainer = $("<div class='bd-debug-container'></div>");
				  	debugContainer.append("<div>Traffic Source: "+this.data.ts+"</div>");
				  	debugContainer.append("<div>Destination: "+this.data.destination+"</div>");
				  	debugContainer.append("<div>Dates: "+this.data.dates.checkin+"-"+this.data.dates.checkout+"</div>");
				  	debugContainer.append("<div>Average Price: "+this.data.price.currency+" "+ this.data.price.average +"</div>");
				  	return debugContainer;
				  }
				}

			var tsSrvc = new tsSrvc();
			try {
				if(tsSrvc.isTrafficSource(window.location.host)){
					var data = {};
					data.ts = window.location.host;
					var tsClass = tsSrvc.trafficSourceClass();

					data.destination = tsClass.getDestination();
					data.dates = tsClass.getDates();
					data.price = tsClass.getPrice();

					var viewSrvc = new viewSrvc(null,data);
					var api = new API(viewSrvc);
					api.getOffers(data.destination);
				}
			} catch(e) {
				console.log("BestDeal Error"+ e.message);
			}
		})();
	});
}





