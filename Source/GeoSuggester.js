/*
---
description: GeoSuggester

license: MIT-style

authors:
- Sergio Panagia (http://panaghia.it)

requires:
- Element.Event
- Fx.Tween
- Element.Style
- Element.Dimenstions
- String
- Array

- Google Maps API V3

provides: [GeoSuggester.js, GeoSuggester.css]

...
*/

var GeoSuggester = new Class({
	Implements: [Options, Events],
    options: {
       	suggest: "",
    	geocoder: null,
    	center: null,
    	map: null,
	    cache : '',
	    first : true,
	    marker : null,
	    inputItem: null,
	    zoomLevel: 12,
	    mapCanvas: null,
	    rollHeight: '350',
	    initText: "Insert street",
	    hideOnBlur : false,
		baloonMsg: null,
		timer: 0,
	    
		results: null,
	    postalCode: null,
	    street_number: null,
	    route: null,
	    locality: null,
	    country: null,
	    admin_area_1: null,
	    admin_area_2: null
	    },
	    initialize: function(options)
		{
			this.setOptions(options);
			/*var timeUp = function(){this.options.timer+=1000;}.bind(this);
			timeUp.periodical(1000);*/
			this.marker = new google.maps.Marker({
				title:"GeoSuggester"
			});
			this.init();
  		},
  		getUnsortedResults: function()
  		{
  			return this.options.results;
  		},
		getPostalCode: function()
		{
			return this.options.postalCode;
		},
		getStreetNumber: function()
		{
			return this.options.street_number;
		},
		getRoute: function()
		{
			return this.options.route;
		},
		getLocality: function()
		{
			return this.options.locality;
		},
		getCountry: function()
		{
			return this.options.country;
		},
		getAdminArea1: function()
		{
			return this.options.admin_area_1;
		},
		getAdminArea2: function()
		{
			return this.options.admin_area_2;
		},
  		init:function ()
  		{
			  			
  			var rollHeight = this.options.rollHeight;	    
  			var zoomLevel = this.options.zoomLevel;
			var inputItem = this.options.inputItem;
			inputItem = document.id(inputItem);
			var mapCanvas = this.options.mapCanvas;
			mapCanvas = document.id(mapCanvas);
			
			var initText = this.options.initText;
			var cache = this.options.cache;
			var first = this.options.first;
			
			var hideOnBlur = this.options.hideOnBlur;
			
			inputItem.set('value', this.options.initText);
			
			inputItem.addEvent('blur', function()
		  	{
		  		if(hideOnBlur)
		  		{
		  			mapCanvas.tween('height',0);
		  			first = true;
		  		}
		  	});
		
			inputItem.addEvent('focus', function()
			{
				if(inputItem.get('value')==initText)
					inputItem.set('value','');
			});
			
			inputItem.addEvent('keydown', function(event)
			{
				
				if(event.key=='esc')
				{
					inputItem.set('value','');
					mapCanvas.tween('height',0);
					first = true;
					this.fireEvent('clear');
				}
				else if(event.key == 'enter')
				{
					//alert(this.options.timer);
					this.extract(this.options.results);
				}
				else if(inputItem.get('value').length>6 )
				{
					var address = inputItem.get('value');
					geocoder = new google.maps.Geocoder();
					if(geocoder)
					{
						geocoder.geocode( {'address':address}, function(results, status)
						{
							if(status == google.maps.GeocoderStatus.OK)
							{
								center = results[0].geometry.location;
								if(cache.toString()!=center.toString()) //just a bit of cache
								{
									this.options.results = results;
									var type = results[0].geometry.location_type;
									suggest = results[0].formatted_address;
																		
									if(type != 'APPROXIMATE')
									{
										var myOptions =
										{
									      zoom: zoomLevel,
									      center: center,
									      mapTypeId: google.maps.MapTypeId.ROADMAP
										}
										
										if(first)
										{
											mapCanvas.tween('height',rollHeight);
											first = false;
										}
										map = new google.maps.Map(mapCanvas, myOptions);
																				
										marker = new google.maps.Marker({
											map: map, 
											position: results[0].geometry.location
										});
										
										if(this.options.baloonMsg == null)
											var baloonMsg = '<span id="baloonMsg">Press Enter or click on the marker when<br/>it indicates the right position</span>';
										else
											var baloonMsg = this.options.baloonMsg;
			
										var baloon = new google.maps.InfoWindow({
										content: baloonMsg
										});
										baloon.open(map, marker);
										
										google.maps.event.addListener(marker, 'click', function() {
										    baloon.close();
										    //map.setZoom(16);
										 });
									
										google.maps.event.addListener(marker, 'click', function(){
										
											this.extract(results);
									
										}.bind(this));
										
																				
									}
								}
								cache = results[0].geometry.location;
							}
						}.bind(this)); //end geocode
					} //Endif
				}
			}.bind(this)); //end eventlistener
			
		},//end fun
		extract:function(results)
		{
			var inputItem = document.id(this.options.inputItem);
			var mapCanvas = document.id(this.options.mapCanvas);
			var k=0;										
			for(k=0;k<results[0].address_components.length;k++)
			{
				var cur = results[0].address_components[k];
				var curType = cur.types[0];
				
				switch(curType)
				{
					case 'postal_code': this.options.postalCode = cur.short_name;
						break;
					case 'street_number': this.options.street_number = cur.short_name;
						break;
					case 'route': this.options.route = cur.short_name;
						break;
					case 'locality': this.options.locality = cur.short_name;
						break;
					case 'administrative_area_level_1': this.options.admin_area_1 = cur.long_name;
						break;
					case 'administrative_area_level_2': this.options.admin_area_2 = cur.long_name;
						break;
					case 'country': this.options.country = cur.long_name = cur.long_name;
						break;
					default:
						break;
				}	
				
				
			}
								
			inputItem.set('value',suggest);
			inputItem.focus();
			inputItem.select();
			mapCanvas.tween('height',0);
			first = true;
			this.fireEvent('select');
		}
	});





		
    	
