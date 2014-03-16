# Ember Validation Computed Property Macro Example

**This is an experiment. Feedback is welcome**

This is an [example](http://taras.github.io/ember-validation-cpm-example/#/posts/hello-world/edit) of the
[validation computed property macro](/app/utils/validation.js). It allows to do sync and async validations.
It focuses on being expressive and Promise compatible. It was designed to work with an ObjectController and
is BufferedProxy compatible. Validation rules can be chained together with ```.then()```.
You can return a custom error message with ```Em.RSVP.reject('your message')```

Validation rules take value as an argument and return a Promise that resolves to a value. If the Promise is rejected,
the validation will fail and reason will be the error. You ```.then()``` Promise to modify the result of the validation.

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
      return required(value, "Slug can not be empty.")
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

# How it works

The computed property evaluates to the result of the validation. The above example would produce

```javascript
controller.setProperties({
  title: 'Hello World',
  slug: ''
  })

console.log(controller.get('validation'));
{
  title: {
    isPassed: true,
    value: 'Hello World'
  },
  slug: {
    isPassed: false,
    error: 'Slug can not be empty.'
  },
  isPassed: false
}
```

You can easily bind to this validation object in the template

```html
<ul>
  <li>
    <label {{bind-attr for="titleField.elementId"}}>Title</label>
    {{input value=title viewName="titleField"}}
    {{#if validation.title.error}}<p class="error">{{validation.title.error}}</p>{{/if}}
  </li>
  <li>
    <label {{bind-attr for="slugField.elementId"}}>Code</label>
    {{input value=code viewName="slugField"}}
    {{#if validation.slug.error}}<p class="error">{{validation.slug.error}}</p>{{/if}}
  </li>
  <ul>
</ul>
<br>
<button {{bind-attr disabled=isNotValid}}>Update</button>

```
