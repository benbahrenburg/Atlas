/*jslint maxerr:1000 */
/*
 * Project Atlas
 * Copyright (c) 2009-2011 by Benjamin Bahrenburg All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */
//*************************************************************
//		Go to http://geonames.org
//		and check the licening terms to make sure it is compatible
//		with your application
//*************************************************************
//-----------------------------------------------------------
//	Provider Name : GeoNames
//	Provider Version: 1
//
//	You can get your GeoNames Keys at the below url:
//	https://geonames.org/
//
//	Public exports:
//	exports.providerName  -> Gives the name of the provider
//
//	exports.providerVersion -> Gives the version of the provider
//
//	exports.capabilities	-> Provies a list of the providers capabilities
//
//	exports.providerSetup -> Provides the provider setup details
//							such as api and other keys
//
//	The below is the format you must pass your api key in as:
// 		{ 
// 			"username": "YOUR_USERNAME", 
// 		}
//
//	exports.providerCleanup -> Provides the provider with any clean-up instructions
//
//	exports.providerSetupFromByFile -> Loads setup information
//									from a file. The file path
//									is from the Resources directory
//
//	For the GeoNames provider you need to have an the following
//	in your file.
//
// 		{ 
// 			"username": "YOUR_USERNAME", 
// 		}
//
//	exports.reverseGeo -> Performs a reverse geolocation lookup
//						  using the coordinates provided.
//
//		success :true/false this provides an indicator if there is an error,
//		message: if there is a message this will tell us what it is,
//		location:
// 		{
// 			address : if available the Address of the coordinates provided
// 			city : if available the City of the coordinates provided
// 			regionCode : if available the Region (state, provance) code will be provided 
// 			countryCode : Country code of the coordinates provided,
// 			latitude : latitude value used in the lookup, 
// 			longitude : longitude value used in the lookup,
// 		}
//
//	exports.forwardGeo -> Performs the search and provides the results
//							to a callback method in the following format:
//
//		success :true/false this provides an indicator if there is an error,
//		message: if there is a message this will tell us what it is,
//		location:
// 		{
// 			address : Address or location used in search,
// 			city : if available the City, 
// 			regionCode : if available the Region (state, provance) code will be provided,
// 			countryCode : if available Country code,
// 			latitude : latitude value, 
// 			longitude : longitude value,
// 		}
//

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//	PRIVATE HELPER FUNCTIONS START HERE
//	Scroll down to see what exports are available.
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
var _apiKey = null;
//*************************************************************
//		This provider needs an API Key
//		Go to http://www.geonames.org/
//		to get your free key
//		Please check the licening terms to make sure it is compatible
//		with your application
//*************************************************************
function safeTrim(value){
	if((value===null)||(value===undefined)){
		return '';
	}else{
		return value.replace(/^\s\s*/, '').replace(/\s\s*$/, '');	
	}	
};

function IsNumeric(input){
    var RE = /^-{0,1}\d*\.{0,1}\d+$/;
    return (RE.test(input));
};
function searchTermTokenize(searchTerm){
	return searchTerm.replace(' ','+');
};
function setKey(providerDetails){
	if((providerDetails.apiKey!==undefined)&&(providerDetails.apiKey!==undefined)){
		_apiKey=providerDetails.apiKey;
	}else{
		throw "You are missing the apiKey, please pass in an object with the apiKey as a property";
	}	
}
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//	PRIVATE HELPER FUNCTIONS END HERE
//	Scroll down to see what exports are available.
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//	PUBLIC EXPORTS START HERE
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

//-----------------------------------------------------------
//	Provider Name
//-----------------------------------------------------------
exports.ProviderName="GeoNames";
//-----------------------------------------------------------
//	Provider Version
//-----------------------------------------------------------
exports.ProviderVersion=1;
//-----------------------------------------------------------
//	Provider Capabilities
//	This provides a list of the capabilities
//	of the content provider, such as the ability
//	to support radius filters or forward geo lookups
//-----------------------------------------------------------
exports.capabilities ={
	hasReverseGeo:true,
	reverseGeoAccuracy:'med',
	hasForwardGeo:true,
	forwardGeoAccuracy:'low'
};
//-----------------------------------------------------------
//	Many of the search APIs require API Key Information
//	This method can be used to set this information programmatically
//	
//	Please note this will be different for each search provider
//
// 		{ 
// 			"username": "YOUR_USERNAME", 
// 		}
//-----------------------------------------------------------
exports.providerSetup=function(providerDetails){
	setKey(providerDetails);
};
//-----------------------------------------------------------
//	Many of the geo APIs require API Key Information
//	This method can be used to set this information by loading
//	the api information from a file.
//	
//	It is important to note the path provide should be from
//	the RESOURCES directory ie it isn't a relative path.
//	
//	Please note this will be different for each search provider
//
//	For the GeoNames provider you need to have an the following
//	in your file.
//
// 		{ 
// 			"username": "YOUR_USERNAME", 
// 		}
//-----------------------------------------------------------
exports.providerSetupFromByFile=function(filePathFromResourceDir){
	var fileResults  = null;
	var file = Ti.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, filePathFromResourceDir);
	if(file.exists()){
		var contents = JSON.parse(''+file.read());
		setKey(contents);
	}else{
		throw "File " + filePathFromResourceDir + " do not exist. Make sure you start the path from the Resource directory.";
	}
};

//-----------------------------------------------------------
//	Provider Clean-up
//	This method contains any of the instructions needed
//	to shutdown the provider when the user has finished
//-----------------------------------------------------------
exports.providerCleanup=function(providerDetails){};

//		This is the standard interface for reverseGeo
//		Learn more about the GeoNames Nearby Address Service at:
//		http://www.geonames.org/maps/us-reverse-geocoder.html#findNearestAddress
//
//		Sample return for the below service call
//		http://api.geonames.org/findNearestAddressJSON?lat=37.451&lng=-122.18&username=demo 
// {
   // "address":{
      // "postalcode":"94025",
      // "adminCode2":"081",
      // "adminCode1":"CA",
      // "street":"Roble Ave",
      // "countryCode":"US",
      // "lng":"-122.18032",
      // "placename":"Menlo Park",
      // "adminName2":"San Mateo",
      // "distance":"0.04",
      // "streetNumber":"651",
      // "mtfcc":"S1400",
      // "lat":"37.45127",
      // "adminName1":"California"
   // }
// }
 exports.reverseGeo=function(latitude,longitude,callback){
	var results = {success:false};

	if(callback===null){
		throw "No callback method provided";
	}
	if(_apiKey===null){
		results.success=false;
		results.message= "No api found. Please send the apiKey as a property of an object when calling the setupProvider method";
		callback(results);
		return;
	}	
	if(!IsNumeric(latitude)){
		results.success=false;
		results.message= "latitude value of " + latitude + " is not a valid number";
		callback(results);
		return;
	}
	if(!IsNumeric(longitude)){
		results.success=false;
		results.message= "longitude value of " + longitude + " is not a valid number";
		callback(results);
		return;		
	}

	var query = "http://api.geonames.org/findNearestAddressJSON?lat="+ latitude +"&lng=" + longitude + "&username=" + _apiKey;
	var done = false;
	var xhr = Ti.Network.createHTTPClient();
	xhr.onload = function(){
		if (this.readyState == 4 && !done) {
			// convert the response JSON text into a JavaScript object
			var geoNameResults = JSON.parse(this.responseText);
			done=true;
		
			results.success=true;
			results.location = {
				address:safeTrim(safeTrim(geoNameResults.streetNumber) + ' ' + safeTrim(geoNameResults.street) + ' ' + safeTrim(geoNameResults.adminName2)),
				city:safeTrim(geoNameResults.adminName2),
				regionCode:safeTrim(geoNameResults.adminCode1),		
				countryCode:geoNameResults.countryCode,
				latitude:latitude,
				longitude:longitude			
			};			
			callback(results);
		}	
	};
	xhr.onerror = function(exr){
		results.success=false;
		results.message= exr.error;
		callback(results);
	};			
  	
  	xhr.open('GET',query);
  	xhr.send();
				
};

//*****************************************************
//			IMPORTANT
//	GeoNames Forward lookup is not very accurate
//	and doesn't handle street addresses well.
//	If you need street level lookups I would
//	recommend trying another provider
//*****************************************************

//	This is the standard interface for forward Geo
//	To learn more about this search please visit the below
//	http://www.geonames.org/export/geonames-search.html
//
//	Sample data for the below call is:
//	http://api.geonames.org/search?q=london&maxRows=1&username=demo&type=json
// {
   // "totalResultsCount":5048,
   // "geonames":[
      // {
         // "countryName":"United Kingdom",
         // "adminCode1":"ENG",
         // "fclName":"city, village,...",
         // "countryCode":"GB",
         // "lng":-0.125741958618164,
         // "fcodeName":"capital of a political entity",
         // "toponymName":"London",
         // "fcl":"P",
         // "name":"London",
         // "fcode":"PPLC",
         // "geonameId":2643743,
         // "lat":51.5085287758629,
         // "adminName1":"England",
         // "population":7556900
      // }
   // ]
// }
exports.forwardGeo=function(address,callback){
	var results = {success:false};

	if(callback===null){
		throw "No callback method provided";
	}	
	if(_apiKey===null){
		results.success=false;
		results.message= "No api found. Please send the apiKey as a property of an object when calling the setupProvider method";
		callback(results);
		return;
	}		
	if(address===null){
		results.success=false;
		results.message= "No address provided";
		callback(results);
		return;
	}	

	var query = "http://api.geonames.org/search?q="+ searchTermTokenize(address) +"&type=json&username=" + _apiKey;
	var done = false;
	var xhr = Ti.Network.createHTTPClient();
	xhr.onload = function(){
		if (this.readyState == 4 && !done) {
			// convert the response JSON text into a JavaScript object
			var geoNameResults = JSON.parse(this.responseText);
			done=true;
		
			results.success=true;
			results.location = {
				addresss:address,
				city:null,
				regionCode:null,		
				countryCode:geoNameResults.countryCode,
				latitude:geoNameResults.lat,
				longitude:geoNameResults.lng			
			};			
			callback(results);
		}	
	};
	xhr.onerror = function(exr){
		results.success=false;
		results.message= exr.error;
		callback(results);
	};			
  	
  	xhr.open('GET',query);
  	xhr.send();
};
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//	PUBLIC EXPORTS END HERE
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@