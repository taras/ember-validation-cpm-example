define("appkit/adapters/application", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = DS.FixtureAdapter.extend();
  });
define("appkit/app", 
  ["ember/resolver","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Resolver = __dependency1__["default"];

    var App = Ember.Application.extend({
      LOG_ACTIVE_GENERATION: true,
      LOG_MODULE_RESOLVER: true,
      LOG_TRANSITIONS: true,
      LOG_TRANSITIONS_INTERNAL: true,
      LOG_VIEW_LOOKUPS: true,
      modulePrefix: 'appkit', // TODO: loaded via config
      Resolver: Resolver['default']
    });

    if (Em.get(window, 'ENV.FIXTURES')) {
      /* global ic */
      ic.ajax.FIXTURES = Em.get(window, 'ENV.FIXTURES');
    }

    __exports__["default"] = App;
  });
define("appkit/components/pretty-color", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = Ember.Component.extend({
      classNames: ['pretty-color'],
      attributeBindings: ['style'],
      style: function(){
        return 'color: ' + this.get('name') + ';';
      }.property('name')
    });
  });
define("appkit/components/template-less", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = Ember.Component.extend({
      classNames: ['look-ma-no-template'],
      tagName: ['span']
    });
  });
define("appkit/controllers/posts/edit", 
  ["appkit/mixins/controllers/buffered-proxy","appkit/utils/validation","appkit/utils/validations","appkit/utils/ajax","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {
    "use strict";
    var BufferedProxy = __dependency1__["default"];
    var validation = __dependency2__["default"];
    var required = __dependency3__.required;
    var ajax = __dependency4__["default"];

    __exports__["default"] = Ember.ObjectController.extend(BufferedProxy, {

      isValid: Em.computed.alias('validation.isPassed'),
      isNotValid: Em.computed.not('isValid'),

      bufferable: ['title', 'code'],

      validation: validation('buffer', {
        title: function(value) {
          if (Em.isNone(value)) {
            return true;
          } else {
            return required(value);
          }
        },
        code: function(value) {
          if (Em.isNone(value)) {
            // buffer doesn't have value therefore value is unchanged, assume valid
            return true;
          } else {
            return required(value).then(function(value){
              return ajax('/posts/' + value).then(function(){
                // item exists, therefore this code is not availabe
                return Em.RSVP.reject('Code already exists');
              }, function() {
                // doesn't exist, therefore available
                return Em.RSVP.resolve(value);
              });
            });
          }
        }
      })

    });
  });
define("appkit/helpers/reverse-word", 
  ["exports"],
  function(__exports__) {
    "use strict";
    // Please note that Handlebars helpers will only be found automatically by the
    // resolver if their name contains a dash (reverse-word, translate-text, etc.)
    // For more details: http://stefanpenner.github.io/ember-app-kit/guides/using-modules.html

    __exports__["default"] = Ember.Handlebars.makeBoundHelper(function(word) {
      return word.split('').reverse().join('');
    });
  });
define("appkit/mixins/controllers/buffered-proxy", 
  ["exports"],
  function(__exports__) {
    "use strict";
    var empty, get, set,
      __hasProp = {}.hasOwnProperty;

    get = Ember.get;
    set = Ember.set;

    empty = function(obj) {
      var key;
      for (key in obj) {
        if (!__hasProp.call(obj, key)) continue;
        return false;
      }
      return true;
    };

    __exports__["default"] = Ember.Mixin.create({
      buffer: null,
      hasBufferedChanges: false,
      unknownProperty: function(key) {
        var buffer;
        buffer = this.buffer;
        if (!(buffer != null ? buffer.hasOwnProperty(key) : void 0)) {
          return this._super(key);
        }
        return buffer[key];
      },
      setUnknownProperty: function(key, value) {
        var buffer, content, current, previous, _ref;
        buffer = (_ref = this.buffer) != null ? _ref : set(this, 'buffer', {});
        content = this.get("content");
        if (content != null) {
          current = get(content, key);
        }
        previous = buffer.hasOwnProperty(key) ? buffer[key] : current;
        if (previous === value) {
          return;
        }
        this.propertyWillChange(key);
        if (current === value) {
          delete buffer[key];
          if (empty(buffer)) {
            this.clearBuffer();
          }
        } else {
          // make sure that key is model attribute
          if (get(this, 'bufferable').contains(key)) {
            set(buffer, key, value);
            this.set("hasBufferedChanges", true);
          } else {
            this._super(key, value);
          }
        }
        this.propertyDidChange(key);
        return value;
      },
      applyBufferedChanges: function() {
        var buffer, content, key;
        buffer = this.buffer;
        content = this.get("content");
        for (key in buffer) {
          if (!__hasProp.call(buffer, key)) continue;
          set(content, key, buffer[key]);
        }
        return this;
      },
      discardBufferedChanges: function() {
        var buffer, content, key;
        buffer = this.buffer;
        content = this.get("content");
        for (key in buffer) {
          if (!__hasProp.call(buffer, key)) continue;
          this.propertyWillChange(key);
          delete buffer[key];
          this.propertyDidChange(key);
        }
        this.clearBuffer();
        return this;
      },
      clearBuffer: function() {
        set(this, 'buffer', {});
        set(this, "hasBufferedChanges", false);
      }
    });
  });
define("appkit/router", 
  ["exports"],
  function(__exports__) {
    "use strict";
    var Router = Ember.Router.extend(); // ensure we don't share routes between all Router instances

    Router.map(function() {
      this.route('component-test');
      this.route('helper-test');
      this.resource('posts', function() {
        this.route('post', {path: ':code'});
        this.route('edit', {path: ':code/edit'});
      });
    });

    __exports__["default"] = Router;
  });
define("appkit/routes/component-test", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = Ember.Route.extend({
      model: function() {
        return ['purple', 'green', 'orange'];
      }
    });
  });
define("appkit/routes/helper-test", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = Ember.Route.extend({
      model: function() {
        return {
          name: "rebmE"
        };
      }
    });
  });
define("appkit/routes/index", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = Ember.Route.extend({
      redirect: function() {
        this.transitionTo('posts.index');
      }
    });
  });
define("appkit/routes/posts", 
  ["appkit/utils/ajax","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var ajax = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend({
      model: function() {
        return ajax('/posts');
      }
    });
  });
define("appkit/routes/posts/edit", 
  ["appkit/routes/posts/post","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var PostRoute = __dependency1__["default"];

    __exports__["default"] = PostRoute.extend({
    });
  });
define("appkit/routes/posts/index", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = Ember.Route.extend({
      model: function() {
        return this.modelFor('posts');
      }
    });
  });
define("appkit/routes/posts/post", 
  ["appkit/utils/ajax","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var ajax = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend({
      model: function(params) {
        return ajax('/posts/'+params.code);
      }
    });
  });
define("appkit/utils/ajax", 
  ["exports"],
  function(__exports__) {
    "use strict";
    /* global ic */
    __exports__["default"] = function ajax(){
      return ic.ajax.apply(null, arguments);
    }
  });
define("appkit/utils/hash-settled", 
  ["exports"],
  function(__exports__) {
    "use strict";
    var Promise = Em.RSVP.Promise,
        keysOf = Em.keys;

    /**
     * Here until RSVP 3.0.6 is merged into main
     * @see https://github.com/tildeio/rsvp.js/blob/3.0.6/lib/rsvp/hash-settled.js
     */

    /**
      `RSVP.hashSettled` is similar to `RSVP.allSettled`, but takes an object
      instead of an array for its `promises` argument.

      Unlike `RSVP.all` or `RSVP.hash`, which implement a fail-fast method,
      but like `RSVP.allSettled`, `hashSettled` waits until all the
      constituent promises have returned and then shows you all the results
      with their states and values/reasons. This is useful if you want to
      handle multiple promises' failure states together as a set.

      Returns a promise that is fulfilled when all the given promises have been
      settled, or rejected if the passed parameters are invalid.

      The returned promise is fulfilled with a hash that has the same key names as
      the `promises` object argument. If any of the values in the object are not
      promises, they will be copied over to the fulfilled object and marked with state
      'fulfilled'.

      Example:

      ```javascript
      var promises = {
        myPromise: RSVP.Promise.resolve(1),
        yourPromise: RSVP.Promise.resolve(2),
        theirPromise: RSVP.Promise.resolve(3),
        notAPromise: 4
      };

      RSVP.hashSettled(promises).then(function(hash){
        // hash here is an object that looks like:
        // {
        //   myPromise: { state: 'fulfilled', value: 1 },
        //   yourPromise: { state: 'fulfilled', value: 2 },
        //   theirPromise: { state: 'fulfilled', value: 3 },
        //   notAPromise: { state: 'fulfilled', value: 4 }
        // }
      });
      ```

      If any of the `promises` given to `RSVP.hash` are rejected, the state will
      be set to 'rejected' and the reason for rejection provided.

      Example:

      ```javascript
      var promises = {
        myPromise: RSVP.Promise.resolve(1),
        rejectedPromise: RSVP.Promise.reject(new Error('rejection')),
        anotherRejectedPromise: RSVP.Promise.reject(new Error('more rejection')),
      };

      RSVP.hashSettled(promises).then(function(hash){
        // hash here is an object that looks like:
        // {
        //   myPromise:              { state: 'fulfilled', value: 1 },
        //   rejectedPromise:        { state: 'rejected', reason: Error },
        //   anotherRejectedPromise: { state: 'rejected', reason: Error },
        // }
        // Note that for rejectedPromise, reason.message == 'rejection',
        // and for anotherRejectedPromise, reason.message == 'more rejection'.
      });
      ```

      An important note: `RSVP.hashSettled` is intended for plain JavaScript objects that
      are just a set of keys and values. `RSVP.hashSettled` will NOT preserve prototype
      chains.

      Example:

      ```javascript
      function MyConstructor(){
        this.example = RSVP.Promise.resolve('Example');
      }

      MyConstructor.prototype = {
        protoProperty: RSVP.Promise.resolve('Proto Property')
      };

      var myObject = new MyConstructor();

      RSVP.hashSettled(myObject).then(function(hash){
        // protoProperty will not be present, instead you will just have an
        // object that looks like:
        // {
        //   example: { state: 'fulfilled', value: 'Example' }
        // }
        //
        // hash.hasOwnProperty('protoProperty'); // false
        // 'undefined' === typeof hash.protoProperty
      });
      ```

      @method hashSettled
      @for RSVP
      @param {Object} promises
      @param {String} label optional string that describes the promise.
      Useful for tooling.
      @return {Promise} promise that is fulfilled when when all properties of `promises`
      have been settled.
      @static
    */
    __exports__["default"] = function hashSettled(object, label) {
      return new Promise(function(resolve, reject){
        var results = {};
        var keys = keysOf(object);
        var remaining = keys.length;
        var entry, property;

        if (remaining === 0) {
          resolve(results);
          return;
        }

        function fulfilledResolver(property) {
          return function(value) {
            resolveAll(property, fulfilled(value));
          };
        }

        function rejectedResolver(property) {
          return function(reason) {
            resolveAll(property, rejected(reason));
          };
        }

        function resolveAll(property, value) {
          results[property] = value;
          if (--remaining === 0) {
            resolve(results);
          }
        }

        for (var i = 0; i < keys.length; i++) {
          property = keys[i];
          entry = object[property];

          if (isNonThenable(entry)) {
            resolveAll(property, fulfilled(entry));
          } else {
            Promise.resolve(entry).then(fulfilledResolver(property), rejectedResolver(property));
          }
        }
      });
    }

    function fulfilled(value) {
      return { state: 'fulfilled', value: value };
    }


    function rejected(reason) {
      return { state: 'rejected', reason: reason };
    }

    function isNonThenable(x) {
      return !objectOrFunction(x);
    }

    function objectOrFunction(x) {
      return typeof x === "function" || (typeof x === "object" && x !== null);
    }
  });
define("appkit/utils/validation", 
  ["appkit/utils/hash-settled","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var hashSettled = __dependency1__["default"];

    var get = Em.get;

    function validationComputedPropertyMacro (target, rules, options) {

      options = Em.merge({
        spacing: 200 // throttle spacing
      }, options)

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

    __exports__["default"] = validationComputedPropertyMacro;
  });
define("appkit/utils/validations", 
  ["exports"],
  function(__exports__) {
    "use strict";
    var resolve = Em.RSVP.resolve,
        reject = Em.RSVP.reject;

    function required(value, message) {
      return ($.trim(value).length > 0) ? resolve(value) : reject(message || "Must not be empty.");
    }

    __exports__.required = required;var urlRegex = /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
    var emailRegex = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
    var dateISORegex = /^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/;
    var numberRegex = /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/;

    var url = format(urlRegex, "Must be a url and start with http://");
    __exports__.url = url;var email = format(emailRegex, "Must be an email address.");
    __exports__.email = email;var dateISO = format(dateISORegex, "Must be in date ISO format.");
    __exports__.dateISO = dateISO;var number = format(numberRegex, "Must be a number");
    __exports__.number = number;
    function date(value, message) {
      var passed = !/Invalid|NaN/.test(new Date(value).toString());
      return (passed) ? resolve(value) : reject(message || "Must be a valid date.");
    }

    __exports__.date = date;function creditcard(value, message) {
      // accept only spaces, digits and dashes
      if ( /[^0-9 \-]+/.test(value) ) {
        return false;
      }
      var nCheck = 0,
          nDigit = 0,
          bEven = false;

      value = value.replace(/\D/g, "");

      for (var n = value.length - 1; n >= 0; n--) {
        var cDigit = value.charAt(n);
        nDigit = parseInt(cDigit, 10);
        if ( bEven ) {
          if ( (nDigit *= 2) > 9 ) {
            nDigit -= 9;
          }
        }
        nCheck += nDigit;
        bEven = !bEven;
      }

      var passed = (nCheck % 10) === 0;

      return (passed) ? resolve(value) : reject(message || "");
    }

    __exports__.creditcard = creditcard;function format(regex, defaultMessage) {
      return function(value, message) {
        var passed = regex.test(value);
        return (passed) ? resolve(value) : reject(message || defaultMessage);
      };
    }
  });
//# sourceMappingURL=app.js.map