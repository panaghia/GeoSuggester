/*
---
description: GeoSuggester

license: MIT-style

authors:
- Sergio Panagia (http://panaghia.it)  

contributors:
- Nicolas Badey (Nico-B)

requires:
- Element.Event
- Fx.Tween
- Element.Style
- Element.Dimensions
- String
- Array

- Google Maps API V3

provides: GeoSuggester.js

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
	    marker : null,
		allowApproximate: false,
		keyValidation: true,
	    inputItem: null,
	    zoomLevel: 12,
	    mapCanvas: null,
		customClass: '_map_canvas',
		container:null,
	    rollHeight: '350',
	    hideOnBlur : false,
		hideOnClickOut: true,
		baloonMsg: null,
		delay: 600,
		minLength:5 ,
		
	    
		results: null,
	    postalCode: null,
		postalCodePrefix:null,
	    street_number: null,
	    route: null,
	    locality: null,
	    country: null,
	    admin_area_1: null,
	    admin_area_2: null,
		latitude: null,
		longitude: null
	    },
	    initialize: function(options)
		{
			this.setOptions(options);
			this.accepted=false;
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
		getPostalCodePrefix: function()
		{
			return this.options.postalCodePrefix;
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
		getLatitude: function()
		{
			return this.options.latitude;
		},
		getLongitude: function()
		{
			return this.options.longitude;
		},
  		init:function ()
  		{

			var cache = this.options.cache;
			var hideOnBlur = this.options.hideOnBlur;  
			
			var inputItem = document.id(this.options.inputItem);
			inputItem.addEvent('mouseenter', function()
			{
				mouseOverMapCanvas = true;				
			});
			inputItem.addEvent('mouseleave', function()
			{
				mouseOverMapCanvas = false;				
			});

			inputItem.addEvent('blur', function()
		  	{
		  		if(hideOnBlur)
		  		{
		  			mapCanvas.tween('height',0);
		  		}
		  	});


			
			var mapCanvas = new Element('div',
			{
				'class': this.options.customClass,
				styles:
				{
					'position':'absolute',
					'left': '0px',
					'top': (inputItem.getSize().y+2)+'px',
					'width': inputItem.getSize().x+'px'			
				}
				
			}).inject(document.id(this.options.container)); 
			this.options.mapCanvas = mapCanvas;            
			
			
		  			
			  			
  			var rollHeight = this.options.rollHeight;	    
  			var zoomLevel = this.options.zoomLevel;
			
			
			var mouseOverMapCanvas = false;
			mapCanvas.addEvent('mouseenter', function()
			{
				mouseOverMapCanvas = true;
			});
			mapCanvas.addEvent('mouseleave', function()
			{
				mouseOverMapCanvas = false;
			});
			
			
			document.id(document.body).addEvent('click', function()
			{
				if (!mouseOverMapCanvas && this.options.hideOnClickOut)
				{
					mapCanvas.tween('height',0);
				}
			}.bind(this));
   		
			inputItem.addEvent('keydown', function(event)
			{
				this.accepted=false;
				if(event.key=='esc')
				{
					this.fireEvent('clear');
					inputItem.set('value','');
					mapCanvas.tween('height',0);   				
				}
				else if(this.options.keyValidation && ( event.key == 'enter' || event.key == 'tab' ) )
				{
					this.extract();
				}
				else if(inputItem.get('value').length >= this.options.minLength )
				{
					this.options.timer = 0; //reset timer
					(function()
					{
						var address = (this.options.country) ? inputItem.get('value')+', '+this.options.country : inputItem.get('value');
						geocoder = new google.maps.Geocoder();
						if(geocoder)
						{
							
							geocoder.geocode( {'address':address}, function(results, status)
							{ 
								//console.log('out');
							    (function(){
								if(status == google.maps.GeocoderStatus.OK)
								{
									center = results[0].geometry.location;
									if(cache.toString()!=center.toString()) //just a bit of cache
									{
										this.options.results = results;
										var type = results[0].geometry.location_type;
										suggest = results[0].formatted_address;
																		
										if(this.options.allowApproximate || (!this.options.allowApproximate &&  type != 'APPROXIMATE'))
										{
											var myOptions =
											{
										      zoom: zoomLevel,
										      center: center,
										      mapTypeId: google.maps.MapTypeId.ROADMAP
											}
										
											if(mapCanvas.getSize().y != rollHeight)
											{
												mapCanvas.setStyle('height',rollHeight+'px'); 
												
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
			                               
											if(!document.id('_map_hud'))
											{ 
											   
												var mapCanvasHUD = new Element('div',
												{
													'id':'_map_hud',
													styles:
													{
														'position':'absolute',
														'top':'20px',
														'left':'80px',
														'width':'auto',
														'backgroundColor':'#333',
														'color':'#fff',
														'z-index':'999',
														'border-radius':'15px',
														'padding-left':'8px',
														'padding-right':'8px',
														'padding-top':'4px',
														'padding-bottom':'4px',
														'font-size':'.8em'
													},
													html:baloonMsg

												}).inject(mapCanvas);
												mapCanvasHUD.highlight('#808080');
												//console.log('inject'); 
											} 
											
										
										  									
											google.maps.event.addListener(marker, 'click', function(){								
												this.extract(); 							
											}.bind(this));
										
																				
										}
									}
									cache = results[0].geometry.location;
								}
								
							}.bind(this)).delay(100);
								
							}.bind(this));//end geocode
						} //Endif 
					
					}.bind(this)).delay(this.options.delay);
				}
			}.bind(this)); //end eventlistener
			
		},//end fun
		extract:function()
		{
			var results = this.options.results
			if (results)
			{
				this.accepted=true;
				
			
				var inputItem = document.id(this.options.inputItem);
				var mapCanvas = document.id(this.options.mapCanvas);
				var k=0;
			
				this.options.latitude = results[0].geometry.location.lat();
				this.options.longitude = results[0].geometry.location.lng();
				
				this.options.postalCode = null;
				this.options.street_number = null;
				this.options.route = null;
				this.options.locality = null;
				this.options.admin_area_1 = null;
				this.options.postalCodePrefix = null;
				this.options.admin_area_2 = null;
				this.options.country = null;
				
				for(k=0;k<results[0].address_components.length;k++)
				{
					
					var cur = results[0].address_components[k];
					var curType = cur.types[0]; 
					//console.log(curType+": "+cur.short_name+"-"+cur.long_name); 
					
					switch(curType)
					{
						case 'postal_code': this.options.postalCode = cur.short_name;
							break; 
						case 'postal_code_prefix': this.options.postalCode = cur.short_name //some places do not return postal_code, use postal_code_prefix instead, even if not documented in google api V3
							break;
						case 'street_number': this.options.street_number = cur.short_name;
							break;
						case 'route': this.options.route = cur.short_name;
							break;
						case 'locality': this.options.locality = cur.short_name;
							break;
						case 'administrative_area_level_1': this.options.admin_area_1 = cur.long_name;
							break;
						case 'administrative_area_level_2': 
							this.options.admin_area_2 = cur.long_name;
							this.options.postalCodePrefix = cur.short_name;
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
				this.fireEvent('select');
			}
		}
	});





		
    	
