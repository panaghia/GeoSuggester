GeoSuggester
===========

A MooTools class that applies the spirit of Auto Completers to Geocoding


How to use
----------

Just declare an instance of GeoSuggester class in your code

Example usage:

	geo = new GeoSuggester({
		inputItem: document.id('city'),
		mapCanvas: document.id('map_canvas'),
		initText: "Please, provide a street address",
		rollHeight: '400',
		//baloonMsg: '<p>html instructions here</p>',
		onSelect: function()
		{
			document.id('postalCode').set('value',geo.getPostalCode());
			document.id('route').set('value', geo.getRoute());
			document.id('street_number').set('value', geo.getStreetNumber());
			document.id('locality').set('value', geo.getLocality());
			document.id('region').set('value', geo.getAdminArea1());
		},
		onClear: function()
		{
			$$('.geoInput').set('value','');
		}
		
	});

Screenshots
-----------


![Screenshot 1](http://panaghia.it/imgs/geo_snap.jpg)



