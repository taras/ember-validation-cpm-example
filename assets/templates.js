define('appkit/templates/application', ['exports'], function(__exports__){ __exports__['default'] = Ember.Handlebars.compile("<h2 id='title'>Welcome to Ember.js</h2>\n\n{{outlet}}\n"); });

define('appkit/templates/component-test', ['exports'], function(__exports__){ __exports__['default'] = Ember.Handlebars.compile("{{#each}}\n  {{pretty-color name=this}}\n{{/each}}\n"); });

define('appkit/templates/components/pretty-color', ['exports'], function(__exports__){ __exports__['default'] = Ember.Handlebars.compile("Pretty Color: {{name}}\n"); });

define('appkit/templates/error', ['exports'], function(__exports__){ __exports__['default'] = Ember.Handlebars.compile("<h1>Sorry, Something went wrong</h1>\n{{message}}\n<pre>\n{{stack}}\n</pre>\n"); });

define('appkit/templates/helper-test', ['exports'], function(__exports__){ __exports__['default'] = Ember.Handlebars.compile("<h3>My name is {{reverse-word name}}.</h3>\n"); });

define('appkit/templates/index', ['exports'], function(__exports__){ __exports__['default'] = Ember.Handlebars.compile("<ul>\n{{#each}}\n  <li>{{this}}</li>\n{{/each}}\n</ul>\n"); });

define('appkit/templates/loading', ['exports'], function(__exports__){ __exports__['default'] = Ember.Handlebars.compile("<h1>Loading...</h1>\n"); });

define('appkit/templates/posts/edit', ['exports'], function(__exports__){ __exports__['default'] = Ember.Handlebars.compile("<ul>\n  <li>\n    <label {{bind-attr for=\"titleField.elementId\"}}>Title</label>\n    {{input value=title viewName=\"titleField\"}} <small>Remove value to see validation</small>\n    {{#if validation.title.error}}<p class=\"error\">{{validation.title.error}}</p>{{/if}}\n  </li>\n  <li>\n    <label {{bind-attr for=\"slugField.elementId\"}}>Slug</label>\n    {{input value=slug viewName=\"slugField\"}} <small>enter <em>validation-is-hard</em> to see ajax validation</small>\n    {{#if validation.slug.error}}<p class=\"error\">{{validation.slug.error}}</p>{{/if}}\n  </li>\n  <ul>\n</ul>\n<br>\n<button {{bind-attr disabled=isNotValid}}>Update</button>\n<hr>\n<p>isValid: <strong>{{isValid}}</strong></p>\n"); });

define('appkit/templates/posts/index', ['exports'], function(__exports__){ __exports__['default'] = Ember.Handlebars.compile("<ul>\n{{#each}}\n  <li>{{#link-to 'posts.post' this}}{{title}}{{/link-to}}</li>\n{{/each}}\n</ul>\n"); });

define('appkit/templates/posts/post', ['exports'], function(__exports__){ __exports__['default'] = Ember.Handlebars.compile("<h2>{{title}}</h2>\n{{#link-to 'posts.edit' model}}edit{{/link-to}}\n"); });