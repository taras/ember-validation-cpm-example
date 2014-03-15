import PostsEditController from 'appkit/controllers/posts/edit';
import { test , moduleFor } from 'appkit/tests/helpers/module-for';

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
