'use strict';

/*
	This is derived by the nice library available https://github.com/thombuchi/ghost-google-cloud-storage
	Updated to work with this version of Ghost
	See the original repository for usage
*/

var fs          = require('fs'),
    path        = require('path'),
    Promise     = require('bluebird'),
    util        = require('util'),
    gcloud      = require('gcloud'),
    errors      = require('../../../../core/server/errors'),
    utils       = require('../../../../core/server/utils'),
    options     = {},
    bucket;

var BaseAdapter = require('ghost-storage-base');

class GStore extends BaseAdapter {

	constructor(config) {
		super();

		options = config || {};

		var gcs = gcloud.storage({
			projectId: options.projectId,
			keyFilename: options.key
		});
		bucket = gcs.bucket(options.bucket);
	}

	save(image, targetDir) {
	    var _self = this;
	    if (!options) return Promise.reject('google cloud storage is not configured');

	    targetDir = targetDir || _self.getTargetDir();
	    var googleStoragePath = 'https://' + options.bucket + '.storage.googleapis.com/',
	    	targetFilename;

	    return this.getUniqueFileName(image, targetDir).then(function (filename) {
	        targetFilename = filename
	        var opts = {
	            destination: targetFilename
	        };
	        return new Promise(function(resolve, reject) {
	            bucket.upload(image.path, opts, function(err, file) {
	                if(err) {
	                    reject(err);
	                    return;
	                }
	                resolve(file);
	                return;
	            });
	        })
	    }).then(function(file){
	        return new Promise(function(resolve, reject) {
	            file.makePublic(function(err, apiResponse) {
	                if(err) {
	                    reject(err);
	                    return;
	                }
	                resolve();
	                return;
	            });
	        })
	    }).then(function () {
	        return googleStoragePath + targetFilename;
	    }).catch(function (e) {
	        errors.logError(e);
	        return Promise.reject(e);
	    });

	}

	// middleware for serving the files
	serve() {
	    // a no-op, these are absolute URLs
	    return function (req, res, next) {
	      next();
	    };
	}

	exists(filename) {
	  return new Promise(function (resolve) {
	    fs.exists(filename, function (exists) {
	      resolve(exists);
	    });
	  });
	}

	delete(filename) {
	  return new Promise(function (resolve, reject) {
	    var file = this.bucket.file(filename);
	    file.delete(function(err, apiResponse) {
	      if (err) { return reject(err); }
	      resolve(apiResponse);
	    });
	  });
	}

	read(options) {
		return Promise.reject('not implemented');
	}

}


module.exports = GStore;
