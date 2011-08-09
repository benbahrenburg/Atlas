# Atlas - Titanium Geolocation Utilities and Providers

Atlas is a set of CommonJS JavaScript libraries that allow you to extend the existing Appcelerator Titanium mobile Geolocation functions.

## Features

The Altas project is divided into two main sections.  The [core](https://github.com/benbahrenburg/Atlas/blob/master/Resources/lib/atlas.js) and the [providers (Google, GeoNames,Titanium)](https://github.com/benbahrenburg/Atlas/tree/master/Resources/lib)  

Altas core provides help Geolocation functions for working with your device and coordinates.

The Altas providers, location in the Resources/lib folder provides Reverse Geo and Forward Geo functionality using such provides as GeoNames, Google, and Titanium.  All provides are implemented using a common interface so you can quickly switch between them in your code.

You can use the Altas core provider methods to manage what providers are loaded and change them together in case one service is unavailable or has reached it's limit.

## Usage

To use Atlas in your Titanium Mobile project please follow the below steps:

1. Check out the Examples folder for how to use each provider. Similar to the KitchenSink example there is a running sample on how to use each provider.
2. Some of the providers need API keys. Check the readme file in each provider directory for instructions on what is needed for each provider.
3. Copy the providers into your project and use them just like any other CommonJS library

## Altas Core
First load the library
var Altas = require('lib/atlas');

How you have access to the following objects Altas.Math, Altas.Shapes, and Altas.Geo
	
<b>Altas.Math</b> gives you some common Geo calculations including:	

* addDistance2Coords - calculates a new set of coordinates based on your bearing and the distance you want to travel

* distanceBetweenCoords - calculates the distance between two coordinates

* bearing - calculates your bearing given a set of coordinates

* midPoint - calculates the midpoint between two sets of coordinates

* meters2Miles - converts meters to miles

* miles2Meters - converts miles to meters

<b>Altas.Shapes</b> gives you access to geolocation shapes including:

* createSqArea - generates the square area between to sets of coordinates.
 
<b>Altas.Geo</b> gives you some common Geolocation functions including:

* enabled - returns a boolean if geolocation services are accessible on your device

* getCurrentHeading - provides your heading information to a callback function. This wraps the native Titanium functions

* getCurrentCoordinates - provides your coordinates information to a callback function. This wraps the native Titanium functions

## CommonJS Libraries

All commonjs files are in the Resources/lib project folder.

* Atlas Core (Resources/lib/atlas.js)

* Titanium Location Provider (Resources/lib/Titanium/altas.ti.js)

* GeoNames Location Provider (Resources/lib/GeoNames/altas.geonames.js)

* Google Location Provider (Resources/lib/Google/altas.google.js)

*<b>Please check each provider's directory for information on the provider and where to obtain any API Keys</b>*

## Issues

Please report all issues on the GitHub [issue tracker for Atlas](https://github.com/benbahrenburg/Atlas/issues).

## Authors

  * Ben Bahrenburg [@benCoding](http://twitter.com/benCoding)

## License ##

Project Atlas is licensed under the terms of the Apache Public License. Please see the LICENSE included with this distribution for details.
