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
        preferRegion: null,
        hideOnBlur : false,
        hideOnSelect:true,
        hideOnClickOut: true,
        baloonMsg: '<span id="baloonMsg">Press Enter or click on the marker when<br/>it indicates the right position</span>',
        delay: 600,
        minLength:5 ,
		map: true,
		
	    
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
            if(this.options.hideOnBlur)
            {
                mapCanvas.tween('height',0);
            }
        }.bind(this));

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
           (function() { 
            var value = $(this.options.inputItem).get('value');
            
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
            else if(value.length >= this.options.minLength )
            {
               this.getMap((this.options.country) ? value+', '+this.options.country : value);
            }
             }.bind(this) ).delay(this.options.delay);
        }.bind(this)); //end eventlistener
			
    },
    getMap:function(address){
        this.options.timer = 0; //reset timer

            geocoder = new google.maps.Geocoder();
            if(geocoder)
            {
                geocoder.geocode( {
                    'address':address,
                    'region':this.options.preferRegion
                }, function(results, status)
                { 
                    //console.log('adress: '+address);
                    (function(){
                        if(status == google.maps.GeocoderStatus.OK)
                        {
                            center = results[0].geometry.location;
                            if(this.options.cache.toString()!=center.toString()) //just a bit of cache
                            {
                                this.options.results = results;
                                var type = results[0].geometry.location_type;
                                suggest = results[0].formatted_address;
																		
                                if(this.options.map && (this.options.allowApproximate || (!this.options.allowApproximate &&  type != 'APPROXIMATE')))
                                {
                                    var myOptions =
                                    {
                                        zoom: this.options.zoomLevel,
                                        center: center,
                                        mapTypeId: google.maps.MapTypeId.ROADMAP
                                    }
										
                                    if(this.options.mapCanvas.getSize().y != this.options.rollHeight)
                                    {
                                        this.options.mapCanvas.setStyle('height',this.options.rollHeight+'px'); 
												
                                    }
                                    map = new google.maps.Map(this.options.mapCanvas, myOptions);
																				
                                    marker = new google.maps.Marker({
                                        map: map, 
                                        position: results[0].geometry.location
                                    });
										
                                    if(!document.id('_map_hud') && this.options.baloonMsg)
                                    {
											   
                                        new Element('div',
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
                                            html:this.options.baloonMsg

                                        }).inject(this.options.mapCanvas).highlight('#808080');
                                        
                                    //console.log('inject'); 
                                    } 
                                    this.fireEvent('onMap');
										
										  									
                                    google.maps.event.addListener(marker, 'click', function(){								
                                        this.extract(); 							
                                    }.bind(this));
										
																				
                                }
                            }
                            this.options.cache = results[0].geometry.location;
                        }
								
                    }.bind(this)).delay(100);
								
                }.bind(this));//end geocode
            } //Endif 
					
      
    },
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
                    case 'postal_code':
                        this.options.postalCode = cur.short_name;
                        break; 
                    case 'postal_code_prefix':
                        this.options.postalCode = cur.short_name //some places do not return postal_code, use postal_code_prefix instead, even if not documented in google api V3
                        break;
                    case 'street_number':
                        this.options.street_number = cur.short_name;
                        break;
                    case 'route':
                        this.options.route = cur.short_name;
                        break;
                    case 'locality':
                        this.options.locality = cur.short_name;
                        break;
                    case 'administrative_area_level_1':
                        this.options.admin_area_1 = cur.long_name;
                        break;
                    case 'administrative_area_level_2':
                        this.options.admin_area_2 = cur.long_name;
                        this.options.postalCodePrefix = cur.short_name;
                        break;
                    case 'country':
                        this.options.country = cur.long_name = cur.long_name;
                        break;
                    default:
                        break;
                }					
            }   							
            inputItem.set('value',suggest);
            if (this.options.hideOnSelect)
                mapCanvas.tween('height',0);
            this.fireEvent('select');
        }
    }
});