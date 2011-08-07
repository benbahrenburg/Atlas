exports.ProviderName="Google";
exports.ProviderVersion=1;

function IsNumeric(input){
    var RE = /^-{0,1}\d*\.{0,1}\d+$/;
    return (RE.test(input));
};
function safeTrim(value){
	if((value===null)||(value===undefined)){
		return '';
	}else{
		return value.replace(/^\s\s*/, '').replace(/\s\s*$/, '');	
	}	
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

	var query = "http://maps.google.com/maps/api/geocode/json?latlng="+ latitude +"," + longitude + "&sensor=false";
		var done = false;
		var xhr = Ti.Network.createHTTPClient();
		xhr.onload = function(){
			if (this.readyState == 4 && !done) {
				// convert the response JSON text into a JavaScript object
				var results =JSON.parse(this.responseText);
				done=true;
				
				//TODO: Add callback return
				
			}	
		};
		xhr.onerror = function(e){
			results.success=false;
			results.message= e.error;
			callback(results);
			return;					
		};			
      xhr.open('GET',query);
  	  xhr.send();
  	  		
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
	
	//TODO: Add logic
};