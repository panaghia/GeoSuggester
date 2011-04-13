GeoSuggester
===========

GeoSuggester is a rapid way of enhance user experience when filling geographic data into forms.

It provides a Google Map canvas as a drop-down element: user may auto-complete their address string by pressing 'enter' or clicking on the marker on the map.

See documentation for reference: http://geosuggester.panaghia.it/doc


How to use
----------

Put your input element inside a container with position style expressely declared (fixed, relative or absolute).

	<div id="GeoSuggesterContainer" style="position:relative">
		<input type="text" id="city" value="insert here" />
	</div>

Declare an instance of GeoSuggester class in your code 

	var geo = new GeoSuggester({
		inputItem: 'city',
		container: 'GeoSuggesterContainer',
		initText: "Please, provide a street address",
		rollHeight: 400,
		baloonMsg: 'Right location?<br/>Press enter!',
		customClass: '_map_canvas',
		delay: 1000,
		onSelect: function()
		{
			//fires when user select a location
			document.id('postalCode').set('value', geo.getPostalCode());
			//see documentation for function reference
		},
		onClear: function()
		{
			document.id('city').set('value', '');
			//fires when users press esc (in input context)		
		}		
	});




Screenshots
-----------

![Screenshot 1](http://dl.dropbox.com/u/5138746/geosuggester.png)
![Screenshot 2](http://dl.dropbox.com/u/5138746/geosuggester_snapshot_real.png)

Resources
-----------------

Check GeoSuggester Wiki on GitHub
and official minisite (http://geosuggester.panaghia.it).

