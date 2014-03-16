import ajax from 'appkit/utils/ajax';

export default Ember.Route.extend({
  model: function(params) {
    return ajax('/posts/'+params.slug);
  }
});
