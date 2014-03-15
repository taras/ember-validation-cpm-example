# Ember Validation Computed Property Macro Example

**This is an experiment. Feedback is welcome**

This is an example of the [validation computed property macro](/app/utils/validation.js).
It allows to do sync and async validations. It focuses on being expressive and Promise compatible.
It was designed to work with an ObjectController and is BufferedProxy compatible. Validation rules can
be chained together with ```.then()```. You can return a custom error message with ```Em.RSVP.reject('your message')```

## Setup

```javascript
import validation from 'appkit/utils/validation';
import {
  required
} from 'appkit/utils/validations';
import ajax from 'appkit/utils/ajax';

export default Ember.ObjectController.extend({

  isValid: Em.computed.alias('validation.isPassed'),
  isNotValid: Em.computed.not('isValid'),

  validation: validation('content', {
    title: function(value) {
      return required(value);
    },
    slug: function(value) {
      return required(value)
        .then(function(value){
          return ajax('/posts/' + value).then(function(){
            // request returns data, therefore object exists and slug is not available
            return Em.RSVP.reject("Slug already taken, choose another.");
            }, function(){
              // returns an error, so it must be available
              return Em.RSVP.resolve(value);
              })
          });
    }
  })

});
```

## License

Copyright 2013 by Stefan Penner and Ember App Kit Contributors, and licensed under the MIT License. See included
[LICENSE](/stefanpenner/ember-app-kit/blob/master/LICENSE) file for details.
