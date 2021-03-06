var Router = Ember.Router.extend(); // ensure we don't share routes between all Router instances

Router.map(function() {
  this.route('component-test');
  this.route('helper-test');
  this.resource('posts', function() {
    this.route('post', {path: ':slug'});
    this.route('edit', {path: ':slug/edit'});
  });
});

export default Router;
