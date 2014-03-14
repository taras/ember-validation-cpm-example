var empty, get, set,
  __hasProp = {}.hasOwnProperty;

get = Ember.get;
set = Ember.set;

empty = function(obj) {
  var key;
  for (key in obj) {
    if (!__hasProp.call(obj, key)) continue;
    return false;
  }
  return true;
};

export default Ember.Mixin.create({
  buffer: null,
  hasBufferedChanges: false,
  unknownProperty: function(key) {
    var buffer;
    buffer = this.buffer;
    if (!(buffer != null ? buffer.hasOwnProperty(key) : void 0)) {
      return this._super(key);
    }
    return buffer[key];
  },
  setUnknownProperty: function(key, value) {
    var buffer, content, current, previous, _ref;
    buffer = (_ref = this.buffer) != null ? _ref : set(this, 'buffer', {});
    content = this.get("content");
    if (content != null) {
      current = get(content, key);
    }
    previous = buffer.hasOwnProperty(key) ? buffer[key] : current;
    if (previous === value) {
      return;
    }
    this.propertyWillChange(key);
    if (current === value) {
      delete buffer[key];
      if (empty(buffer)) {
        this.set("hasBufferedChanges", false);
      }
    } else {
      // make sure that key is model attribute
      if (get(this, 'bufferable').contains(key)) {
        buffer[key] = value;
        this.set("hasBufferedChanges", true);
      } else {
        this._super(key, value);
      }
    }
    this.propertyDidChange(key);
    return value;
  },
  applyBufferedChanges: function() {
    var buffer, content, key;
    buffer = this.buffer;
    content = this.get("content");
    for (key in buffer) {
      if (!__hasProp.call(buffer, key)) continue;
      set(content, key, buffer[key]);
    }
    return this;
  },
  discardBufferedChanges: function() {
    var buffer, content, key;
    buffer = this.buffer;
    content = this.get("content");
    for (key in buffer) {
      if (!__hasProp.call(buffer, key)) continue;
      this.propertyWillChange(key);
      delete buffer[key];
      this.propertyDidChange(key);
    }
    this.clearBuffer();
    return this;
  },
  clearBuffer: function() {
    set(this, 'buffer', {});
    set(this, "hasBufferedChanges", false);
  }
});
