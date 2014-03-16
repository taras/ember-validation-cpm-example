import hashSettled from 'appkit/utils/hash-settled';

var get = Em.get;

function validationComputedPropertyMacro (target, rules, options) {

  options = Em.merge({
    delay: 200
  }, options)

  // create array of dependent keys
  var dependentKeys = prefixKeys(target, rules);

  var isPassedKeys = Em.keys(rules).map(function(propName){
    return combine(propName, 'isPassed');
  });

  var ValidationResponse = Em.ObjectProxy.extend(Em.PromiseProxyMixin, {
    isPassed: Em.computed.and.apply(this, isPassedKeys)
  });

  function buildValidationPromise(key, value){
    var _this = this,
        promises = {},
        cacheKey = cacheFor(key),
        cache, result;

    if (arguments.length === 2) {
      // setting the property by setting its cache
      this.set(cacheKey, value);
      result = value;
    } else {
      // invalidated when one of the values changes
      cache = get(this, cacheKey);
      if (cache) { // cache exists
        if (cache.timer) {
          Em.run.cancel(cache.timer);
        }
        cache.timer = Em.run.later(this, recalculate, options.delay);
        result = cache;
      } else {
        result = recalculate.apply(this);
      }
    }

    function recalculate() {
      // create an array of promises for
      Em.keys(rules).forEach(function(propName){
        var callback = rules[propName],
            value = get(_this, combine(target, propName));

        // coerce the return values into being a promise
        promises[propName] = new Em.RSVP.Promise(function(resolve) {
          resolve(callback.call(_this, value));
        });
      });

      var result = ValidationResponse.create({
        promise: hashSettled(promises).then(transform)
      });

      // set this property which will set the cache
      this.set(key, result);

      return result;
    }

    return result;
  }

  return applyComputed(dependentKeys, buildValidationPromise);
}

function applyComputed(dependentKeys, callback) {
  return Em.computed.apply(this, [].concat(dependentKeys, [callback]));
}

function prefixKeys(prefix, hash) {
  return Em.keys(hash).map(function(propName){
    return combine(prefix, propName);
  });
}

function transform(response) {
  Em.keys(response).forEach(function(propName){
    var result = response[propName];
    // TODO: does need to read the return value to figure out if tests?
    response[propName] = {
      isPassed: get(result, 'state') === 'fulfilled',
      error: get(result, 'state') === 'rejected' ? get(result, 'reason') : null,
      value: get(result, 'value')
    };
  });
  return response;
}

function combine(target, property) {
  return target + '.' + property;
}

function cacheFor(key) {
  return '__validationCacheFor'+key;
}

export default validationComputedPropertyMacro;
