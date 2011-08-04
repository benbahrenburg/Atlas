/*jslint maxerr:1000 */
//Add protoypes we need
Number.prototype.toRad = function() {
   return this * Math.PI / 180;
};

Number.prototype.toDeg = function() {
   return this * 180 / Math.PI;
};

//Helper functions taken from php.js
function rad2deg (angle) {
   return angle * 57.29577951308232; 
};

function deg2rad (angle) {
   return (angle / 180) * Math.PI;
};


var _math = {
	
	addDistance2Coords : function (lat,lon,bearing,distance) {
		var radius = 6371000; //Meters
		var adjustedLat = rad2deg(Math.asin(Math.sin(deg2rad(lat)) * Math.cos(distance / radius) + Math.cos(deg2rad(lat)) * Math.sin(distance / radius) * Math.cos(deg2rad(bearing))));
		var adjustedLon = rad2deg(deg2rad(lon) + Math.atan2(Math.sin(deg2rad(bearing)) * Math.sin(distance / radius) * Math.cos(deg2rad(lat)), Math.cos(distance / radius) - Math.sin(deg2rad(lat)) * Math.sin(deg2rad(adjustedLat))));
		 return {lat:adjustedLat,lon:adjustedLon}; 
	},
	
	distanceBetweenCoords: function(lat1, lon1, lat2, lon2) {
		//http://www.codecodex.com/wiki/Calculate_distance_between_two_points_on_a_globe#JavaScript
		var R = 6371000; // Meters  
		var dLat = (lat2-lat1)*Math.PI/180;  
		var dLon = (lon2-lon1)*Math.PI/180;   
		var a = Math.sin(dLat/2) * Math.sin(dLat/2) +  
		        Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) *   
		        Math.sin(dLon/2) * Math.sin(dLon/2);   
		var c = 2 * Math.asin(Math.sqrt(a));   
		var distance = R * c; //In meters
		
		return distance;
	},
		
	bearing : function(lat1, lon1, lat2){
		//Source Movable Type Scripts
		//http://www.movable-type.co.uk/scripts/latlong.html
		var y = Math.sin(lon1) * Math.cos(lat2);
		var x = Math.cos(lat1)*Math.sin(lat2) -
		        Math.sin(lat1)*Math.cos(lat2)*Math.cos(lon1);
		var brng = Math.atan2(y, x).toDeg();
		return brng;		
	},
	midPoint : function(lat1, lon1, lat2){
		//Source Movable Type Scripts
		//http://www.movable-type.co.uk/scripts/latlong.html
		var Bx = Math.cos(lat2) * Math.cos(lon1);
		var By = Math.cos(lat2) * Math.sin(lon1);
		var lat3 = Math.atan2(Math.sin(lat1)+Math.sin(lat2),
                   Math.sqrt( (Math.cos(lat1)+Bx)*(Math.cos(lat1)+Bx) + By*By) ); 
		var lon3 = lon1 + Math.atan2(By, Math.cos(lat1) + Bx);
		return {
			lat:lat3,
			lon:lon3
		};
	},
	meters2Miles : function(meters){
		var miles = meters * 0.00062137119;
		return miles;
	},
	miles2Meters : function(miles){
		if(miles===0){
			return 0;
		}
		var meters = miles * 1609.344;
		return meters;
	}	
};


var _shapes = {
	createSqArea : function(lat1,lon1,lat2,lon2){
		var northPoint = Math.max(lat1,lat2);
		var southPoint = Math.min(lat1,lat2);
		var eastPoint = Math.max(lon1,lon2);
		var westPoint = Math.min(lon1,lon2);
		return {
		   NorthWest:{
		      lat:northPoint,
		      lon:westPoint
		   },
		   NorthEast : {
		    lat:northPoint,
		    lon:eastPoint
		   },
		   SouthWest:{
		      lat:southPoint,
		      lon:westPoint
		   },
		   SouthEast : {
		      lat:southPoint,
		      lon:eastPoint
		   },
		   width:_math.distanceBetweenCoords(northPoint, westPoint, northPoint, eastPoint),
		   height:_math.distanceBetweenCoords(northPoint, eastPoint, southPoint, eastPoint),
		   isInSqArea : function(lat,lon){
		   	return (
		   		((lat<northPoint)||(lat==northPoint))&&
		   		((lat>southPoint)||(lat==southPoint))&&
		   		((lon<eastPoint)||(lon==eastPoint))&&
		   		((lon>southPoint)||(lon==southPoint))
		   	);
		   }
		 };
	}
};

//Set the functions so they are available via exports
exports.Math = _math;
exports.Shapes = _shapes;