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

provides: [GeoSuggester.js]

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
	    show: "all"
	    },
	    initialize: function(options){
	    	 this.setOptions(options);
	    	 
	    	 this.marker = new google.maps.Marker({
      			title:"GeoSuggester"
  			});
  			this.init();
  		},
  		init:function ()
  		{
  			var rollHeight = this.options.rollHeight;
  			var show = this.options.show;
  					    
  			var zoomLevel = this.options.zoomLevel;
			var inputItem = this.options.inputItem;
			inputItem = $(inputItem);
			
			var mapCanvas = this.options.mapCanvas;
			mapCanvas = $(mapCanvas);
			
			var initText = this.options.initText;
			var cache = this.options.cache;
			var first = this.options.first;
			
			inputItem.set('value', this.options.initText);
			
			inputItem.addEvent('blur', function()
		  	{
		  		//mapCanvas.tween('height',0);
		  		//first = true;
		  	});
		
			inputItem.addEvent('focus', function()
			{
				if(inputItem.get('value')==initText)
					inputItem.set('value','');
			});
			
			inputItem.addEvent('keydown', function(event)
			{
				if(event.key=='esc')
					inputItem.set('value','');
				if(event.key=='enter' || inputItem.get('value').length>6 )
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
								if(cache.toString()!=center.toString())
								{
									var type = results[0].geometry.location_type;
									if(show=='all')
										suggest = results[0].formatted_address;
									else if(show == 'postal_code')
										suggest = results[0].address_components[6].short_name;
																	
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
										
										google.maps.event.addListener(marker, 'click', function() {
											inputItem.set('value',suggest);
											inputItem.focus();
											inputItem.select();
											mapCanvas.tween('height',0);
			  								first = true;														
										});
									}
								}
								cache = results[0].geometry.location;
							}
						}); //end geocode
					} //Endif
				}
			}); //end eventlistener
				
		}//end fun
	});





		
    	
