# Atlas - Google Provider

Provider Name : Google
Provider Version: 1

This provider uses the Google Geolocation Rest service
Learn more about them at [http://code.google.com/apis/maps/index.html](http://code.google.com/apis/maps/index.html)

*<b>Before using please check that the Google terms of use are compatible with your application/purpose</b>*

*Please note this provider does not require an api key. Any api key function calls will be ignored. Per Google's developer page they use your IP address to determine your rate limit and usage*

## Capability Rating

* Able to Reverse Geo Decode with a high level of accuracy

* Able to Forward Geolocation with a high level of accuracy


The <b>capabilities</b> property will return the following:
	
* hasReverseGeo:true
* reverseGeoAccuracy: high
* hasForwardGeo:true
* forwardGeoAccuracy: high

## Examples

Please reference the Resources/Examples/GoogleProvider.js for examples on how to use this provider.

## Methods

For these examples we assume the following:

var myProvider = require('/lib/Google/altas.google);

The myProvider object will be used as a reference in the below descriptions.

<b>myProvider.providerName</b>  -> Gives the name of the provider

<b>myProvider.providerVersion</b> -> Gives the version of the provider

<b>myProvider.capabilities</b>	-> Provies a list of the providers capabilities

<b>myProvider.providerSetup</b> -> Provides the provider setup details such as api and other keys

*The providerSetup method is not used by this provider, any call to this method will be ignored*

<b>myProvider.providerCleanup</b> -> Provides the provider with any clean-up instructions

<b>myProvider.providerSetupFromByFile</b> -> Loads setup information from a file. The file path is from the Resources directory

*The providerSetupFromByFile method is not used by this provider, any call to this method will be ignored*

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