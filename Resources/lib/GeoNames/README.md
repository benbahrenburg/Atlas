# Atlas - GeoNames Provider

Provider Name : GeoNames
Provider Version: 1

This provider uses the GeoNames Geolocation Rest service
Learn more about them at [geonames.org](http://www.geonames.org/export/ws-overview.htmll)

*<b>Before using please check that the GeoNames terms of use are compatible with your application/purpose</b>*

<b>GeoNames requires you obtain an api key. Go to http://www.geonames.org/login to register for a free or paid key.</b>

## Capability Rating

* Able to Reverse Geo Decode with a med level of accuracy

* Able to Forward Geolocation with a low level of accuracy


The <b>capabilities</b> property will return the following:
	
* hasReverseGeo:true
* reverseGeoAccuracy: med
* hasForwardGeo:true
* forwardGeoAccuracy: low

## Examples

Please reference the Resources/Examples/GeoNamesProvider.js for examples on how to use this provider.

## Methods

For these examples we assume the following:

var myProvider = require('/lib/GeoNames/altas.geonames);

The myProvider object will be used as a reference in the below descriptions.

<b>myProvider.providerName</b>  -> Gives the name of the provider

<b>myProvider.providerVersion</b> -> Gives the version of the provider

<b>myProvider.capabilities</b>	-> Provies a list of the providers capabilities

<b>myProvider.providerSetup</b> -> Provides the provider setup details such as api and other keys

The below is the format you must pass your api key in as:
 		{ 
 			"username": "YOUR_USERNAME", 
 		}

<b>myProvider.providerCleanup</b> -> Provides the provider with any clean-up instructions

<b>myProvider.providerSetupFromByFile</b> -> Loads setup information from a file. The file path is from the Resources directory

For the GeoNames provider you need to have an the following in your file. See the apikeys.json file in the GeoNames directory for an example.
 		{ 
 			"username": "YOUR_USERNAME", 
 		}

<b>myProvider.reverseGeo</b> -> Performs a reverse geolocation lookup using the coordinates provided. 
	
	The callback function is provide output in the following format:
				
		success :true/false this provides an indicator if there is an error,
		message: if there is a message this will tell us what it is,
		location:
 		{
 			address : if available the Address of the coordinates provided
 			city : if available the City of the coordinates provided
 			regionCode : if available the Region (state, provance) code will be provided 
 			countryCode : Country code of the coordinates provided,
 			latitude : latitude value used in the lookup, 
 			longitude : longitude value used in the lookup,
 		}

<b>myProvider.forwardGeo</b> -> Performs the search and provides the results to a callback method.
	
	The callback function is provide output in the following format:
	

		success :true/false this provides an indicator if there is an error,
		message: if there is a message this will tell us what it is,
		location:
 		{
 			address : Address or location used in search,
 			city : if available the City, 
 			regionCode : if available the Region (state, provance) code will be provided,
 			countryCode : if available Country code,
 			latitude : latitude value, 
 			longitude : longitude value,
 		}
 		
## Issues

Please report all issues on the GitHub [issue tracker for Atlas](https://github.com/benbahrenburg/Atlas/issues).

## Authors

  * Ben Bahrenburg [@benCoding](http://twitter.com/benCoding)

## License ##

Project Atlas is licensed under the terms of the Apache Public License. Please see the LICENSE included with this distribution for details.