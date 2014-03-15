import hashSettled from 'appkit/utils/hash-settled';

var get = Em.get;

function validationComputedPropertyMacro (target, rules) {
  // create array of dependent keys
  var dependentKeys = prefixKeys(target, rules);

  var isPassedKeys = Em.keys(rules).map(function(propName){
    return combine(propName, 'isPassed');
  });

  var ValidationResponse = Em.ObjectProxy.extend(Em.PromiseProxyMixin, {
    isPassed: Em.computed.and.apply(this, isPassedKeys)
  });

  function buildValidationPromise(){
    var _this = this,
        promises = {};

    // create an array of promises for
    Em.keys(rules).forEach(function(propName){
      var callback = rules[propName],
          value = get(_this, combine(target, propName));

      // coerce the return values into being a promise
      promises[propName] = new Em.RSVP.Promise(function(resolve) {
        resolve(callback.call(_this, value));
      });
    });

    return ValidationResponse.create({
      promise: hashSettled(promises).then(transform)
    });
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

export default validationComputedPropertyMacro;
