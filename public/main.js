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
         Orbitz.js
         Class for data scraping of Orbitz
         @trafficSources: Array of authorized traffic sources
         @host: the current traffic source
         */

        function Orbitz() {
        }


        Orbitz.prototype = {
            constructor: Orbitz,

            getHotelName: function(){

                var hotelName = jQuery("h1[data-context='hotelName']").text();

                return hotelName;
            },

            getDestination: function() {

                var destination = jQuery("input[name='hotel.keyword.key']").val();
                return destination;
            },

            getDates: function () {
                var dates = {};
                dates.checkin = jQuery("input[name='hotel.chkin']").val();
                dates.checkout = jQuery("input[name='hotel.chkout']").val();
                return dates;
            },

            getPrice: function () {
                var price = {};
                price.currency = this.getCurrency();

                try {
                    var pricesArr = jQuery(".leadPrice"); // get the divs containing the price
                    var sum = 0;
                    var minimalPrice = 10000000; // Instead of using this giant price I could took the first price from the list
                    $.each(pricesArr,function () {
                        var pString = $(this).html();
                        var price = parseInt(pString.replace(/\D/g,'')); // remove non number chars from price string

                        sum +=  price;
                        if (minimalPrice > price)
                        {
                            minimalPrice = price;
                        }

                    });

                    price.minimal = minimalPrice;

                    price.average = parseInt(sum / pricesArr.length);
                } catch(e) {
                    console.log("BestDeal error" + e.message);
                    price.average = null;
                }

                return price;
            },

            getCurrency: function () {
                return jQuery(".leadPrice").first().text().trim().substring(0,1);
            }
        };






        /*
         price-line.js
         Class for data scraping of Price Line
         @trafficSources: Array of authorized traffic sources
         @host: the current traffic source
         */

        function PriceLine() {
        }


        PriceLine.prototype = {
            constructor: PriceLine,

            // There are no variables inside the url so I have to get all the information from the HTML

            getHotelName: function(){

                var hotelName = $("#detailsHotelSummaryName").text().trim();

                return hotelName;
            },

            getDestination: function() {

                var destination = $("#cityName").val();
                if (destination == undefined)
                {
                    destination = window.c2c.locDest;
                }
                return destination;
            },

            getDates: function () {
                var dates = {};
                dates.checkin = $("#checkInDate").val();
                dates.checkout = $("#checkOutDate").val();

                if (dates.checkin == undefined || dates.checkout == undefined)
                {
                    dates.checkin = $("#detailsChangeSearchCheckInInput").val();
                    dates.checkout = $("#detailsChangeSearchCheckOutInput").val();
                }


                return dates;
            },

            // Return the minimal price
            getPrice: function () {
                var price = {};
                price.currency = this.getCurrency();

                try {
                    var pricesArr = $(".listitem_price_amount"); // get the divs containing the price
                    var sum = 0;
                    var minimalPrice = 10000000; // Instead of using this giant price I could took the first price from the list

                    $.each(pricesArr,function () {
                        var pString = $(this).html();
                        var price = parseInt(pString.replace(/\D/g,'')); // remove non number chars from price string
                        sum +=  price;
                        if (minimalPrice > price)
                        {
                            minimalPrice = price;
                        }
                    });

                    price.minimal = minimalPrice;

                    if (price.minimal == 10000000)
                    {
                        price.minimal = parseInt($("#overViewHeaderPrice").text());
                    }

                    price.average = parseInt(sum / pricesArr.length);
                } catch(e) {
                    console.log("BestDeal error" + e.message);
                    price.average = null;
                }

                return price;
            },

            getCurrency: function () {
                var currency = $(".listitem_price_currency").first().text().substring($(".listitem_price_currency").first().text().length - 1);
                if (currency == "")
                {
                    currency = $(".currencySymbol").first().text();

                }
               return currency;
            }
        };







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

                getHotelName: function(){

                    var hotelName = $("#detailsHotelSummaryName").text().trim();

                    return hotelName;
                },

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

                // Return the minimal price
				getPrice: function () {
					var price = {};
			  	price.currency = this.getCurrency();

			  	try {
				  	var pricesArr = $('.priceBlock .price'); // get the divs containing the price
				  	var sum = 0;
                    var minimalPrice = 10000000; // Instead of using this giant price I could took the first price from the list
                    $.each(pricesArr,function () {
                        var pString = $(this).html();
                        var price = parseInt(pString.replace(/\D/g,'')); // remove non number chars from price string
                        sum +=  price;
                        if (minimalPrice > price)
                        {
                            minimalPrice = price;
                        }
                    });

                    price.average = parseInt(sum / pricesArr.length);
                    price.minimal = minimalPrice;

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

                getHotelName: function(){

                    var hotelName = $("#detailsHotelSummaryName").text().trim();

                    return hotelName;
                },

                getDestination: function() {
					return $('#destination').val();
				},

				getDates: function () {
			  	var dates = {};
			  	dates.checkin = (function () {
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

                // Return the minimal price
				getPrice: function () {
					var price = {};
			  	price.currency = this.getCurrency();
			  	try {
				  	var pricesArr = this.getRoomPricesArray();
				  	var duration = this.getDuration();
				  	var sum = 0;
                    var minimalPrice = 10000000; // Instead of using this giant price I could took the first price from the list

                    $.each(pricesArr,function () {
                        var pString = $(this).html();
                        var price = parseInt(pString.replace(/\D/g,''));
                        sum +=  price;
                        if (minimalPrice > price)
                        {
                            minimalPrice = price;
                        }
                    });
                    price.minimal = minimalPrice;
				  	price.average = parseInt(sum / pricesArr.length) / duration;
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
					var arr = $('.roomPrice .price');
					if(arr.length > 0) {
						return arr;
					} 
					arr = $('.rooms-table-room-price'); 
					if(arr.length > 0) {
						return arr;
					} 

					arr = $('.fromprice a.test2'); 
					if(arr.length > 0) {
						return arr;
					} 
					return [];
				},

				getDuration: function () {
					try {
						var dates = this.getDates();
						return Math.floor(( Date.parse(dates.checkout) - Date.parse(dates.checkin) ) / 86400000);
					} catch(e) {
						console.log("BestDeal error" + e.message);
						return null;
					}
				}
			}

			function Hotels() {
			}

			Hotels.prototype = {
				constructor: Hotels,

                getHotelName: function(){

                    var hotelName = $("#detailsHotelSummaryName").text().trim();

                    return hotelName;
                },

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

                // Return the minimal price
				getPrice: function () {
					var price = {};
			  	price.currency = this.getCurrency();

			  	try {

				  	var pricesArr = $(".current-price strong");
                    if (pricesArr.size() == 0)
                    {
                        pricesArr = $('.price ins');
                    }
				  	var duration = this.getDuration();
				  	var sum = 0;
                    var minimalPrice = 10000000; // Instead of using this giant price I could took the first price from the list

                    $.each(pricesArr,function () {
                        var pString = $(this).html();
                        var price = parseInt(pString.replace(/\D/g,''));

                        sum +=  price;
                        if (minimalPrice > price)
                        {
                            minimalPrice = price;
                        }
                    });

                    if(pricesArr.length > 0) {
                        price.minimal = minimalPrice;
                        price.average = parseInt(sum / pricesArr.length) / duration;
                    } else {
                        price.average = parseInt($('.feature-price .current-price').html().replace(/\D/g,'')) / duration;
                        price.minimal = parseInt($('.feature-price .current-price').html().replace(/\D/g,'')) / duration;  // Look to be the same because there is only one price
                    }
			  	} catch(e) {
			  		console.log("BestDeal error" + e.message);
			  		price.average = null;
			  	}

			  	return price; 
				},

				getCurrency: function () {
					return window.commonDataBlock.page.currency;
				},

				getDuration: function () {
					try {
						var dates = this.getDates();
						return Math.floor(( Date.parse(dates.checkout) - Date.parse(dates.checkin) ) / 86400000);
					} catch(e) {
						console.log("BestDeal error" + e.message);
						return null;
					}
				}
			}


			/*
				ts-service.js
				Service for identifing if the current website is a traffic source
				@trafficSources: Array of authorized traffic sources
				@host: the current traffic source
			*/

				function tsSrvc() {
					this.trafficSources = ["booking.com","hotels.com","tripadvisor.com", "priceline.com", "orbitz.com"],
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
				  	} else if (this.host.indexOf(this.trafficSources[3]) > -1) {
                        return new PriceLine();
                    } else if (this.host.indexOf(this.trafficSources[4]) > -1) {
                        return new Orbitz();
                    }
				  }
				}

			/*
				api.js
				Service for talking to BestDeal API
			*/

				function API(viewSrvc) {
					// prod_url = https://blooming-cliffs-1855.herokuapp.com
					// dev_url = http://localhost:3000
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
                    var bdBrand = $("<div id='best-deal-brand'>Best Deals</div>");
                    var bdSettings = $("<div id='best-deal-settings'></div>");
                    var bdCloseSetting = $("<div class='best-deal-setting-box'></div>");
                    var bdGearSetting = $("<div class='best-deal-setting-box'></div>");
                    var bdAboutSetting = $("<div class='best-deal-setting-box'></div>");
                    var bdGearSettinglink = $("<a class='gear-setting-original-28'></a>");
                    var bdAboutSettinglink = $("<a class='question-setting-original-28'></a>");
                    var bdCloseSettinglink = $("<a class='x-setting-original-28'></a>");

                    bdSettings.html(bdCloseSetting.html(bdCloseSettinglink));
                    bdSettings.append(bdGearSetting.html(bdGearSettinglink));
                    bdSettings.append(bdAboutSetting.html(bdAboutSettinglink));
                    bdSettings.append("Powered by bestdeal");
                      var me = this;
                    bdContainer.html(bdBrand);
                    bdContainer.append(this.renderHotels(hotels));
                    bdContainer.append(this.renderDebugMode());
                    bdContainer.append(bdSettings);
                    $('body').append(bdContainer);
				  },

				  renderHotels: function(hotels) {
				  	var hotelsContainer = $("<div class='bd-offers-container'></div>");
				  	var me = this;
				  	$.each(hotels, function() { 
				  		hotelsContainer.append($(me.renderHotel(this.hotel)));
				  	});


                    // Add settings popup, currently only for the gear icon.

                    var bdGearSettingPopup = $("<div class='gear-setting-popup'></div>");

                    hotelsContainer.append(bdGearSettingPopup);

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

                    if (this.data.hotelName != undefined && this.data.hotelName != "")
                    {
                        debugContainer.append("<div>Hotel Name: "+this.data.hotelName+"</div>");
                    }

                    debugContainer.append("<div>Dates: "+this.data.dates.checkin+"-"+this.data.dates.checkout+"</div>");

                    if (!isNaN(this.data.price.average))
				  	{
                        debugContainer.append("<div>Average Price: "+this.data.price.currency+" "+ this.data.price.average +"</div>");
                    }
				  	debugContainer.append("<div>Minimal Price: "+this.data.price.currency+" "+ this.data.price.minimal +"</div>");
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

                    if(data.destination != undefined && data.destination != "")
                    {
                        data.dates = tsClass.getDates();
                        data.price = tsClass.getPrice();
                        data.hotelName =tsClass.getHotelName();
                        var viewSrvc = new viewSrvc(null,data);
                        var api = new API(viewSrvc);
                        api.getOffers(data.destination);


                        // Configure the click event for the gear icon
                        $('.gear-setting-original-28').click(function(){
                            $('.gear-setting-popup').toggle();
                        });
                    }

				}
			} catch(e) {
				console.log("BestDeal Error"+ e.message);
			}
		})();
	});
}





