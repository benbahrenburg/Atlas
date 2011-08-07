exports.ProviderName="Titanium";
exports.ProviderVersion=1;

function translateErrorCode(code) {
	if (code === null) {
		return 'Unknown';
	}
	switch (code) {
		case Ti.Geolocation.ERROR_LOCATION_UNKNOWN:
			return "Location unknown";
		case Ti.Geolocation.ERROR_DENIED:
			return "Access denied";
		case Ti.Geolocation.ERROR_NETWORK:
			return "Network error";
		case Ti.Geolocation.ERROR_HEADING_FAILURE:
			return "Failure to detect heading";
		case Ti.Geolocation.ERROR_REGION_MONITORING_DENIED:
			return "Region monitoring access denied";
		case Ti.Geolocation.ERROR_REGION_MONITORING_FAILURE:
			return "Region monitoring access failure";
		case Ti.Geolocation.ERROR_REGION_MONITORING_DELAYED:
			return "Region monitoring setup delayed";
		default:
			return 'Unknown';
	}
};

function findCountryCode(place){
	//Account for the differences between Android & iOS reverse geo return
	if((place.country_code!==undefined)&&(place.country_code!==null)){
		return place.country_code;
	}else{
		if((place.countryCode!==undefined)&&(place.countryCode!==null)){
			return place.countryCode;
		}else{
			return null;
		}
	}
};	

function getUSCAStateCode(address){
	var arPlaces = [];
	var offset=2;
	arPlaces=address.split(',');
	var iLength = arPlaces.length;
	iLength=((iLength-offset)>-1)? (iLength-offset): 0;
	var stateCode = myt.geo.Utils.safeTrim(arPlaces[iLength]);
	if(stateCode.length>2){
		stateCode=stateCode.substring(0,2);
	}
	return stateCode;		
};

function getRegionCode(countryCode,address){
	var regionCode = null;
	
	if((countryCode=='US')||(countryCode=='CA')){
		regionCode=getUSCAStateCode(address);
	}
		
	return regionCode;
};

//This is just here for compatibility
exports.setupProvider=function(providerDetails){};
exports.cleanupProvider=function(providerDetails){};
//This is the standard interface for reverseGeo
exports.reverseGeo=function(latitude,longitude,callback){
	var results = {success:false};
	Ti.Geolocation.reverseGeocoder(latitude,longitude,function(evt){
		if(evt.success){
			var places = evt.places;
			if((places!==null)&&(places.length>0)){
				results.success=true;
				results.address=places[0].address;
				results.getState=getRegionCode(places[0].address);
				results.countryCode=findCountryCode(places[0]);
			}else{
				results.success=false;
				results.message="No address found";				
			}
			if((callback!==null)&&(callback!==undefined)){
				callback(results);	
			}
		}else{
			results.success=false;
			results.message=translateErrorCode(evt.code);
			if((callback!==null)&&(callback!==undefined)){
				callback(results);	
			}
		}
	});	
};
//This is the standard interface for forward Geo
exports.forwardGeo=function(address,callback){
	var results = {success:false};
	Ti.Geolocation.forwardGeocoder(address,function(evt){
		if(evt.success){
			results.success=true;
			results.latitude=evt.latitude;
			results.longitude=evt.longitude;
			if((callback!==null)&&(callback!==undefined)){
				callback(results);	
			}			
		}else{
			results.success=false;
			results.message=translateErrorCode(evt.code);
			if((callback!==null)&&(callback!==undefined)){
				callback(results);	
			}			
		}
	});	
};
