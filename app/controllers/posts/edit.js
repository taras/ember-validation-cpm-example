import BufferedProxy from 'appkit/mixins/controllers/buffered-proxy';
import validation from 'appkit/utils/validation';
import {
  required
} from 'appkit/utils/validations';
import ajax from 'appkit/utils/ajax';

export default Ember.ObjectController.extend(BufferedProxy, {

  isValid: Em.computed.alias('validation.isPassed'),
  isNotValid: Em.computed.not('isValid'),

  bufferable: ['title', 'slug'],

  validation: validation('buffer', {
    title: function(value) {
      if (Em.isNone(value)) {
        return true;
      } else {
        return required(value);
      }
    },
    slug: function(value) {
      if (Em.isNone(value)) {
        // buffer doesn't have value therefore value is unchanged, assume valid
        return true;
      } else {
        return required(value)
        .then(function(value){
          return ajax('/posts/' + value);
        })
        .then(function(){
          // item exists, therefore this code is not availabe
          return Em.RSVP.reject('Code already exists');
        }, function() {
          // doesn't exist, therefore available
          return Em.RSVP.resolve(value);
        });
      }
    }
  })

});
