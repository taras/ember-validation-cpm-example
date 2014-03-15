define("appkit/tests/acceptance/component-test", 
  [],
  function() {
    "use strict";
    var App;

    module('Acceptances - Component', {
      setup: function(){
        App = startApp();
      },
      teardown: function() {
        Ember.run(App, 'destroy');
      }
    });

    test('component output is rendered', function(){
      expect(2);

      visit('/component-test').then(function(){
        var list = find('.pretty-color');
        equal(list.length, 3);
        equal(list.first().text(), 'Pretty Color: purple\n');
      });
    });
  });
define("appkit/tests/acceptance/helper-test", 
  [],
  function() {
    "use strict";
    var App;

    module("Acceptances - Helper", {
      setup: function(){
        App = startApp();
      },
      teardown: function() {
        Ember.run(App, 'destroy');
      }
    });

    test("helper output is rendered", function(){
      expect(1);

      visit('/helper-test').then(function(){
        ok(exists("h3:contains('My name is Ember.')"));
      });
    });
  });
define("appkit/tests/helpers/isolated-container", 
  ["appkit/tests/helpers/resolver","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var resolver = __dependency1__["default"];

    function isolatedContainer(fullNames) {
      var container = new Ember.Container();

      container.optionsForType('component', { singleton: false });
      container.optionsForType('view', { singleton: false });
      container.optionsForType('template', { instantiate: false });
      container.optionsForType('helper', { instantiate: false });

      for (var i = fullNames.length; i > 0; i--) {
        var fullName = fullNames[i - 1];
        container.register(fullName, resolver.resolve(fullName));
      }

      return container;
    }

    __exports__["default"] = isolatedContainer;
  });
define("appkit/tests/helpers/module-for", 
  ["appkit/tests/helpers/resolver","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var __testing_context__;

    var resolver = __dependency1__["default"];

    function defaultSubject(factory, options) {
      return factory.create(options);
    }

    function moduleFor(fullName, description, callbacks, delegate) {
      callbacks = callbacks || { };

      var needs = [fullName].concat(callbacks.needs || []);
      var container = isolatedContainer(needs);

      callbacks.subject = callbacks.subject || defaultSubject;

      callbacks.setup    = callbacks.setup    || function() { };
      callbacks.teardown = callbacks.teardown || function() { };

      function factory() {
        return container.lookupFactory(fullName);
      }

      function subject(options) {
        return callbacks.subject(factory(), options);
      }

      __testing_context__ = {
        container: container,
        subject: subject,
        factory: factory,
        __setup_properties__: callbacks
      };

      if (delegate) {
        delegate(container, __testing_context__);
      }

      var context = __testing_context__;
      var _callbacks = {
        setup: function(){
          buildContextVariables(context);
          callbacks.setup.call(context, container);
        },
        teardown: function(){
          Ember.run(function(){
            container.destroy();
            // destroy all cached variables
          });

          Ember.$('#ember-testing').empty();
          // maybe destroy all the add-hoc objects

          callbacks.teardown(container);
        }
      };

      module(description || fullName, _callbacks);
    }

    __exports__.moduleFor = moduleFor;// allow arbitrary named factories, like rspec let
    function buildContextVariables(context) {
      var cache = { };
      var callbacks = context.__setup_properties__;
      var factory = context.factory;
      var container = context.container;

      Ember.keys(callbacks).filter(function(key){
        // ignore the default setup/teardown keys
        return key !== 'setup' && key !== 'teardown';
      }).forEach(function(key){
        context[key] = function(options) {
          if (cache[key]) {
            return cache[key];
          }

          var result = callbacks[key](factory(), options, container);
          cache[key] = result;
          return result;
        };
      });
    }

    function test(testName, callback) {
      var context = __testing_context__; // save refence

      function wrapper() {
        var result = callback.call(context);

        function failTestOnPromiseRejection(reason) {
          ok(false, reason);
        }

        Ember.run(function(){
          stop();
          Ember.RSVP.Promise.cast(result)['catch'](failTestOnPromiseRejection)['finally'](start);
        });
      }

      QUnit.test(testName, wrapper);
    }

    __exports__.test = test;function moduleForModel(name, description, callbacks) {
      moduleFor('model:' + name, description, callbacks, function(container, context) {
        // custom model specific awesomeness
        container.register('store:main', DS.Store);
        container.register('adapter:application', DS.FixtureAdapter);

        context.__setup_properties__.store = function(){
          return container.lookup('store:main');
        };

        if (context.__setup_properties__.subject === defaultSubject) {
          context.__setup_properties__.subject = function(factory, options) {
            return Ember.run(function() {
              return container.lookup('store:main').createRecord(name, options);
            });
          };
        }
      });
    }

    __exports__.moduleForModel = moduleForModel;function moduleForComponent(name, description, callbacks) {
      moduleFor('component:' + name, description, callbacks, function(container, context) {
        var templateName = 'template:components/' + name;

        var template = resolver.resolve(templateName);

        if (template) {
          container.register(templateName, template);
          container.injection('component:' + name, 'template', templateName);
        }

        context.__setup_properties__.$ = function(selector) {
          var view = Ember.run(function(){
            return context.subject().appendTo(Ember.$('#ember-testing')[0]);
          });

          return view.$();
        };
      });
    }

    __exports__.moduleForComponent = moduleForComponent;
  });
define("appkit/tests/helpers/resolver", 
  ["ember/resolver","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Resolver = __dependency1__["default"];

    var resolver = Resolver.create();

    resolver.namespace = {
      modulePrefix: 'appkit'
    };

    __exports__["default"] = resolver;
  });
define("appkit/tests/helpers/start-app", 
  ["appkit/app","appkit/router","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Application = __dependency1__["default"];
    var Router = __dependency2__["default"];

    function startApp(attrs) {
      var App;

      var attributes = Ember.merge({
        // useful Test defaults
        rootElement: '#ember-testing',
        LOG_ACTIVE_GENERATION:false,
        LOG_VIEW_LOOKUPS: false
      }, attrs); // but you can override;

      Router.reopen({
        location: 'none'
      });

      Ember.run(function(){
        App = Application.create(attributes);
        App.setupForTesting();
        App.injectTestHelpers();
      });

      App.reset(); // this shouldn't be needed, i want to be able to "start an app at a specific URL"

      return App;
    }

    __exports__["default"] = startApp;
  });
define("appkit/tests/unit/components/pretty-color-test", 
  ["appkit/tests/helpers/module-for"],
  function(__dependency1__) {
    "use strict";
    var test = __dependency1__.test;
    var moduleForComponent = __dependency1__.moduleForComponent;

    moduleForComponent('pretty-color');

    test("changing colors", function(){
      var component = this.subject();

      Ember.run(function(){
        component.set('name','red');
      });

      // first call to $() renders the component.
      equal(this.$().attr('style'), 'color: red;');

      Ember.run(function(){
        component.set('name', 'green');
      });

      equal(this.$().attr('style'), 'color: green;');
    });

    test("className", function(){
      // first call to this.$() renders the component.
      ok(this.$().is('.pretty-color'));
    });

    test("template", function(){
      var component = this.subject();

      equal($.trim(this.$().text()), 'Pretty Color:');

      Ember.run(function(){
        component.set('name', 'green');
      });

      equal($.trim(this.$().text()), 'Pretty Color: green');
    });
  });
define("appkit/tests/unit/components/template-less-component-test", 
  ["appkit/tests/helpers/module-for"],
  function(__dependency1__) {
    "use strict";
    var test = __dependency1__.test;
    var moduleForComponent = __dependency1__.moduleForComponent;

    moduleForComponent('template-less');

    test("template", function(){
      var component = this.subject();
      ok(this.$());
    });
  });
define("appkit/tests/unit/controllers/posts-edit-test", 
  ["appkit/controllers/posts/edit","appkit/tests/helpers/module-for"],
  function(__dependency1__, __dependency2__) {
    "use strict";
    var PostsEditController = __dependency1__["default"];
    var test = __dependency2__.test;
    var moduleFor = __dependency2__.moduleFor;

    moduleFor('controller:posts/edit', "Validation");

    test('it exists', function(){
      ok(this.subject() instanceof PostsEditController);
    });

    test('isValid', function(){
      var controller = this.subject();

      Em.run(function(){
        controller.set('content', {
          id: '4',
          title: 'Apple',
          code: 'apple'
        });
      });

      equal(controller.get('isValid'), true, "With content unchanged isValid should be true.");

      Em.run(function(){
        controller.set("code", "_apple");
      });

      equal(controller.get('isValid'), false, "Code is invalid so the controller should be invalid.");

    });
  });
//# sourceMappingURL=tests.js.map