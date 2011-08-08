/*
 * Project Atlas
 * Copyright (c) 2009-2011 by Benjamin Bahrenburg All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */
exports.ProviderName="GeoNames";
exports.ProviderVersion=1;
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

function setKey(providerDetails){
	if((providerDetails.apiKey!==undefined)&&(providerDetails.apiKey!==undefined)){
		_apiKey=providerDetails.apiKey;
	}else{
		throw "You are missing the apiKey, please pass in an object with the apiKey as a property";
	}	
}
//This loads the settings from a stored JSON file
//Please note this requires the full path
exports.setupProviderByFile=function(filePathFromResourceDir){
	var fileResults  = null;
	var file = Ti.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, filePathFromResourceDir);
	if(file.exists()){
		var contents = JSON.parse(''+file.read());
		setKey(contents);
	}else{
		throw "File " + filePathFromResourceDir + " do not exist. Make sure you start the path from the Resource directory.";
	}
};
exports.setupProvider=function(providerDetails){
	setKey(providerDetails);
};
exports.cleanupProvider=function(providerDetails){};

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
			results.address=safeTrim(safeTrim(geoNameResults.streetNumber) + ' ' + safeTrim(geoNameResults.street) + ' ' + safeTrim(geoNameResults.adminName2));
			results.regionCode=safeTrim(geoNameResults.adminCode1);		
			results.countryCode=geoNameResults.countryCode;
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
	
	//TODO: Add logic
};