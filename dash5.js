var util = require('util');

var _ = exports;

// util
_.format = util.format;

// callback handy
_.fmap = function(callback, iter) {
    return function(err, result) {
        callback(err, _.map(result, iter));
    }
}

_.fapply = function(callback, fn) {
    return function(err, result) {
        callback(err, result && fn(result));
    }
}

// ============ async
_.parallel = function (tasks, callback) {
  var results = [], count = tasks.length;
  tasks.forEach(function(task, index) {
      task(function(err, data) {
          results[index] = data;
          if(err) {
            callback(err);
            callback = null;
          }
          if(--count === 0 && callback) {
            callback(null, results);
          }
      });
  });
}
// ============ iteration
_.each = function(obj, iter) {
    if(!obj) return; 
    if(Array.isArray(obj)) {
        return obj.forEach(iter);
    }
    for(var k in obj) {
        iter(obj[k], k);
    }
}

_.map = function(obj, iter) {
    if(obj == null) return null; 
    if(Array.isArray(obj)) {
        return obj.map(iter);
    }
    var ret = {};
    for(var k in obj) {
        ret[k] = iter(obj[k], k);
    }
    return ret;
}

// ==============
_.zipObject = function(arr1, arr2) {
    var ret = {};
    for (var i = 0, l = arr1.length; i < l; i ++) {
        ret[arr1[i]] = arr2[i];
    }
    return ret;
}

/**
 * _.aggregate([[a,b], [a, c], [c, d], [c, e]], function(item, emit) {
 *      emit(item[0], item[1]);
 * }, function(results) {
 *      // a: [b, c], c: [d, e]
 * });
 *
 */
_.mapReduce = function(arr, map, reduce, callback) {
    var result = {}, len = arr.length, done = 0;
    arr.forEach(function(item) {
            map(item, function emit(key, item) {
                    (result[emit[0]] || (result[emit[0]] = [])).push(emit[1]);
                    if(++done == len) {
                        if(reduce) for(var key in result) {
                            result[key] = reduce(key, result[key]);
                        }
                        callback(null, result);
                    }
            });
    });
}
