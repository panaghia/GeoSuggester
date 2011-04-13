GeoSuggester
===========

GeoSuggester is a rapid way of enhance user experience when filling geographic data into forms.

It provides a GMap as a drop-down element: user may auto-complete their address string by pressing 'enter' or clicking on the marker on the map.

See documentation for reference: http://geosuggester.panaghia.it/doc

How to use
----------

Just declare an instance of GeoSuggester class in your code

Example usage:



var geo = new GeoSuggester({
		inputItem: 'city',
		mapCanvas: 'GeoSuggesterContainer',
		initText: "Please, provide a street address",
		rollHeight: '400',
	   	baloonMsg: '<p>Right location?</p><p>press enter!</p>',
		customClass: '_map_canvas',
		delay:1000,
		onSelect: function()
		{
			document.id('postalCode').set('value',geo.getPostalCode());
			document.id('route').set('value', geo.getRoute());
			document.id('street_number').set('value', geo.getStreetNumber());
			document.id('locality').set('value', geo.getLocality());
			document.id('region').set('value', geo.getAdminArea1());
			document.id('coordinates').set('value', geo.getLatitude()+" "+geo.getLongitude());
		},
		onClear: function()
		{
			$$('.geoInput').set('value','');
		}
		
	});

Screenshots
-----------


![Screenshot 1](http://dl.dropbox.com/u/5138746/geosuggester.png)
![Screenshot 2](http://dl.dropbox.com/u/5138746/geosuggester_snapshot_real.png)



