// TODO: extract services to separate files

var jQuery;

if (window.jQuery === undefined) {
 var script_tag = document.createElement('script');
 script_tag.setAttribute("type","text/javascript");
 script_tag.setAttribute("src","http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js");
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
				ts-service.js
				Service for identifing if the current website is a traffic source
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
				  wwwbookingcomDestination: function () {
				  	return document.getElementById('destination').value;
				  },

				  wwwhotelscomDestination: function () {
				  	if($('#destination').length > 0){
				  		return $('#destination').val().split(',')[0];
				  	} else if ($('#q-destination').length > 0) {
				  		return $('#q-destination').val().split(',')[0];
				  	} else if ($('.adr .locality').length > 0) {
				  		return $('.adr .locality').html().split(',')[0];
				  	} else {
				  		return null;
				  	}
				  },

				  wwwtripadvisorcomDestination: function () {
				  	return window.geoName || window.ta.retrieve('mapsv2.geoName');
				  },

				  getDestination: function (host) {
						try {
							return eval("this."+host.replace(/\./g,'')+"Destination()");	
						}
						catch(err) {
							console.log(err.message);
							return "";
						}
				  }
				}

			/*
				dates-service.js
				Service for indentifying the dates in different Traffic Sources
			*/

				function datesSrvc() {
				}

				datesSrvc.prototype = {
				  constructor: datesSrvc,
				  wwwbookingcomDates: function () {
				  	var dates = {};
				  	dates.checkout = window.booking.env.b_checkout_date;
				  	return dates;
				  },

				  wwwhotelscomDates: function () {
				  	var dates = {};
				  	dates.checkin = window.commonDataBlock.search.checkinDate;
				  	dates.checkout = window.commonDataBlock.search.checkoutDate;
				  	return dates;  
				  },

				  wwwtripadvisorcomDates: function () {
				  	var dates = {};
				  	dates.checkin = ta.retrieve("multiDP.inDate");
				  	dates.checkout = ta.retrieve("multiDP.outDate");
				  	return dates;
				  },

				  getDates: function (host) {
						try {
							return eval("this."+host.replace(/\./g,'')+"Dates()");	
						}
						catch(err) {
							console.log(err.message);
							return {};
						}
				  }
				}

			/*
				price-service.js
				Service for indentifying the price in different Traffic Sources
				TODO: calculate price per night
			*/

				function priceSrvc() {
				}

				priceSrvc.prototype = {
				  constructor: priceSrvc,
				  wwwbookingcomPrice: function () {
				  	var price = {};
				  	price.currency = window.booking.env.b_selected_currency;

				  	var pricesArr = $('.roomPrice .price b').length > 0 ? $('.roomPrice .price b') : $('.rooms-table-room-price');
				  	var sum = 0;

						$.each(pricesArr,function () {
							var pString = $(this).html();
							var price = parseInt(pString.replace(/\D/g,''));

							sum +=  price;
						});

				  	price.average = parseInt(sum / pricesArr.length);
				  	return price;
				  },

				  wwwhotelscomPrice: function () {
				  	var price = {};
				  	price.currency = window.commonDataBlock.page.currency;

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
				  	

				  	return price; 
				  },

				  wwwtripadvisorcomPrice: function () {
				  	var price = {};
				  	var currString = $('#CURRENCYPOP .link').html();
				  	price.currency = currString.substring(0,currString.indexOf("<"))

				  	var pricesArr = $('.priceBlock .price');
				  	var sum = 0;

						$.each(pricesArr,function () {
							var pString = $(this).html();
							var price = parseInt(pString.replace(/\D/g,''));

							sum +=  price;
						});

						price.average = parseInt(sum / pricesArr.length);	
				  	return price; 
				  },

				  getPrice: function (host) {
						try {
							return eval("this."+host.replace(/\./g,'')+"Price()");	
						}
						catch(err) {
							console.log(err);
							return {};
						}
				  }
				}

			/*
				api.js
				Service for talking to BestDeal API
			*/

				function API(viewSrvc) {
					this.url = "http://localhost:3000";//"http://blooming-cliffs-1855.herokuapp.com",
					this.viewSrvc = viewSrvc
				}

				API.prototype = {
				  constructor: API,
				  getOffers: function (destination) {
				  	var me = this;
				  	$.getJSON(this.url + '/hotels?destination='+destination+'&callback=?', function(hotels) {
		          me.viewSrvc.renderContainer(hotels);
		        });
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
			if(tsSrvc.isTrafficSource(window.location.host)){
				var data = {};
				data.ts = window.location.host;

				var destSrvc = new destSrvc();
				data.destination = destSrvc.getDestination(tsSrvc.host);

				var datesSrvc = new datesSrvc();
				data.dates = datesSrvc.getDates(tsSrvc.host);

				var priceSrvc = new priceSrvc();
				data.price = priceSrvc.getPrice(tsSrvc.host);

				var viewSrvc = new viewSrvc(null,data);
				//viewSrvc.renderContainer();

				var api = new API(viewSrvc);
				api.getOffers(data.destination);
			}
		})();
	});
}





