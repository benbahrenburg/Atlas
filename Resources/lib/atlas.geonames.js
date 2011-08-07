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
		var contents = file.read();
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
//		Learn more about the GeoNames Nearby Service at:
//		http://www.geonames.org/export/web-services.html#findNearby
//
//		Sample return for the below service call
//		http://api.geonames.org/findNearbyJSON?lat=47.3&lng=9&username=demo
// {
   // "geonames":[
      // {
         // "countryName":"Switzerland",
         // "adminCode1":"SG",
         // "fclName":"mountain,hill,rock,... ",
         // "countryCode":"CH",
         // "lng":9.020524,
         // "fcodeName":"mountain",
         // "distance":"1.56869",
         // "toponymName":"Kreuzegg",
         // "fcl":"T",
         // "name":"Kreuzegg",
         // "fcode":"MT",
         // "geonameId":2660109,
         // "lat":47.297696,
         // "adminName1":"Sankt Gallen",
         // "population":0
      // }
   // ]
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
	
	//TODO: Add logic		
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