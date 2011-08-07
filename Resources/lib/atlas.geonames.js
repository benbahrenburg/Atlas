exports.ProviderName="GeoNames";
exports.ProviderVersion=1;
var _apiKey = null;
exports.setupProvider=function(providerDetails){
	if((providerDetails.apiKey!==undefined)&&(providerDetails.apiKey!==undefined)){
		_apiKey=providerDetails.apiKey;
	}else{
		throw "You are missing the apiKey, please pass in an object with the apiKey as a property";
	}	
};
exports.cleanupProvider=function(providerDetails){};
//This is the standard interface for reverseGeo
exports.reverseGeo=function(latitude,longitude,callback){
	if(_apiKey===null){
		throw "You are missing the apiKey, please pass in an object with the apiKey as a property";
	}
};
//This is the standard interface for forward Geo
exports.forwardGeo=function(address,callback){
	if(_apiKey===null){
		throw "You are missing the apiKey, please pass in an object with the apiKey as a property";
	}	
};