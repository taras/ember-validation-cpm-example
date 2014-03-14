import ajax from 'appkit/utils/ajax';

export default Ember.Route.extend({
  model: function() {
    return ajax('/posts');
  }
});
