import BufferedProxy from 'appkit/mixins/controllers/buffered-proxy';

export default Ember.ObjectController.extend(BufferedProxy, {

  bufferable: ['title', 'code']

});
