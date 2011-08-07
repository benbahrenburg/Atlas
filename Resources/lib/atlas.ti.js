exports.ProviderName="Titanium";
exports.ProviderVersion=1;

function IsNumeric(input){
    var RE = /^-{0,1}\d*\.{0,1}\d+$/;
    return (RE.test(input));
};
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

function safeTrim(value){
	if((value===null)||(value===undefined)){
		return '';
	}else{
		return value.replace(/^\s\s*/, '').replace(/\s\s*$/, '');	
	}	
};

function findCountryCode(place){
	//Account for the differences between Android & iOS reverse geo return
	if((place.country_code!==undefined)&&(place.country_code!==null)){
		return safeTrim(place.country_code);
	}else{
		if((place.countryCode!==undefined)&&(place.countryCode!==null)){
			return safeTrim(place.countryCode);
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
	var stateCode = safeTrim(arPlaces[iLength]);
	if(stateCode.length>2){
		stateCode=stateCode.substring(0,2);
	}
	return stateCode;		
};

function getRegionCode(countryCode,address){
	var regionCode = null;
	
	if((countryCode=='US')||(countryCode=='CA')){
		regionCode=getUSCAStateCode(safeTrim(address));
	}
		
	return regionCode;
};

//This is just here for compatibility
exports.setupProvider=function(providerDetails){};
exports.cleanupProvider=function(providerDetails){};
exports.setupProviderByFile=function(filePathFromResourceDir){};

//This is the standard interface for reverseGeo
exports.reverseGeo=function(latitude,longitude,callback){
	var results = {success:false};
	if(callback===null){
		throw "No callback method provided";
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
	Ti.Geolocation.reverseGeocoder(latitude,longitude,function(evt){
		if(evt.success){
			var places = evt.places;
			if((places!==null)&&(places.length>0)){
				results.success=true;
				results.address=safeTrim(places[0].address);
				results.regionCode=getRegionCode(safeTrim(places[0].address));
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
	if(callback===null){
		throw "No callback method provided";
	}	
	if(address===null){
		results.success=false;
		results.message= "No address provided";
		callback(results);
		return;
	}
		
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
