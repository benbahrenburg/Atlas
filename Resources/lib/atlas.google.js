exports.ProviderName="Google";
exports.ProviderVersion=1;
//*************************************************************
//		Go to http://code.google.com/apis/maps/index.html
//		and check the licening terms to make sure it is compatible
//		with your application
//*************************************************************

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
function findCodeInResults(resultSet,matchCode){
	var iLoop=0;
        var maxSize=resultSet.results.length;
        var iAddressLoop=0;
        var returnCode='';
        for (iLoop=0;iLoop < maxSize;iLoop++){
                if(resultSet.results[iLoop].address_components!==undefined){
                        var addressCount = resultSet.results[iLoop].address_components.length;
                        for (iAddressLoop=0;iAddressLoop < addressCount;iAddressLoop++){
                                var iAdrTypeLoop=0;
                                var iAdrTypeCount=resultSet.results[iLoop].address_components[iAddressLoop].types.length;
                                for (iAdrTypeLoop=0;iAdrTypeLoop < iAdrTypeCount;iAdrTypeLoop++){
                                        if(resultSet.results[iLoop].address_components[iAddressLoop].types[iAdrTypeLoop].toUpperCase()==matchCode.toUpperCase()){
                                           returnCode=resultSet.results[iLoop].address_components[iAddressLoop].short_name.toUpperCase();
                                           break;                                                          
                                        }
                                }

                        }
                }                               

        }
        return returnCode;       
};
//This is just here for compatibility
exports.setupProvider=function(providerDetails){};
exports.cleanupProvider=function(providerDetails){};
exports.setupProviderByFile=function(filePathFromResourceDir){};

//This is the standard interface for reverseGeo
   // "results" : [
      // {
         // "address_components" : [
            // {
               // "long_name" : "655",
               // "short_name" : "655",
               // "types" : [ "street_number" ]
            // },
            // {
               // "long_name" : "Roble Ave",
               // "short_name" : "Roble Ave",
               // "types" : [ "route" ]
            // },
            // {
               // "long_name" : "Menlo Park",
               // "short_name" : "Menlo Park",
               // "types" : [ "locality", "political" ]
            // },
            // {
               // "long_name" : "San Mateo",
               // "short_name" : "San Mateo",
               // "types" : [ "administrative_area_level_3", "political" ]
            // },
            // {
               // "long_name" : "San Mateo",
               // "short_name" : "San Mateo",
               // "types" : [ "administrative_area_level_2", "political" ]
            // },
            // {
               // "long_name" : "California",
               // "short_name" : "CA",
               // "types" : [ "administrative_area_level_1", "political" ]
            // },
            // {
               // "long_name" : "United States",
               // "short_name" : "US",
               // "types" : [ "country", "political" ]
            // },
            // {
               // "long_name" : "94025",
               // "short_name" : "94025",
               // "types" : [ "postal_code" ]
            // }
         // ],
         // "formatted_address" : "655 Roble Ave, Menlo Park, CA 94025, USA",
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
				var googleResults =JSON.parse(this.responseText);
				done=true;
				if((googleResults.results===null)||(googleResults.results===undefined)){
					results.success=false;
					results.message= 'Invalid return from Google';
					callback(results);	
					return;				
				}
				if(googleResults.results.length===0){
					results.success=false;
					results.message= 'No address information provided';
					callback(results);
					return;					
				}
				results.success=true;
				results.address=googleResults.results[0].formatted_address;
				results.regionCode=findCodeInResults(googleResults.results[0],'administrative_area_level_1');
				results.countryCode=findCodeInResults(googleResults.results[0],'COUNTRY');
				callback(results);
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