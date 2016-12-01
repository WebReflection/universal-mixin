//remove:
var mixin = require('../build/universal-mixin.node.js');
//:remove

var checkEnumerable = (function (dP) {
  return !!dP && !dP({}, 'k', {value:1}).propertyIsEnumerable('k');
}(Object.defineProperty));

wru.test([
  {
    name: 'main',
    test: function () {
      wru.assert(typeof mixin == "function");
    }
  }, {
    name: 'Object mixin',
    test: function () {
      var Greeter = mixin({
        greetings: function () {
          return 'Hello there';
        }
      });
      var obj = Greeter({});
      wru.assert('method is working', obj.greetings() === 'Hello there');
      if(checkEnumerable)wru.assert('property is not enumerable', !obj.propertyIsEnumerable('greetings'));
    }
  }, {
    name: 'Class mixin',
    test: function () {
      var Greeter = mixin({
        greetings: function () {
          return 'Hello there';
        }
      });
      function Class() {}
      Greeter(Class);
      var obj = new Class;
      wru.assert('method is working', obj.greetings() === 'Hello there');
      wru.assert('property is inherited', !obj.hasOwnProperty('greetings'));
      wru.assert('property is from prototype', Class.prototype.hasOwnProperty('greetings'));
      if(checkEnumerable)wru.assert('property is not enumerable', !Class.prototype.propertyIsEnumerable('greetings'));
    }
  }, {
    name: 'Mixin shared',
    test: function () {
      var Greeter = mixin({
        greetings: function () {
          return Greeter.DEFAULT_SENTENCE;
        }
      }, {
        DEFAULT_SENTENCE: 'Hello!'
      });
      var obj = Greeter({});
      wru.assert(obj.greetings() === 'Hello!');
    }
  }, {
    name: 'initialization',
    test: function () {
      var Greeter = mixin({
        init: function () {
          this.value = Greeter.DEFAULT_SENTENCE;
        },
        greetings: function () {
          return this.value;
        }
      }, {
        DEFAULT_SENTENCE: 'Hello!'
      });
      var obj = Greeter({});
      obj.init();
      wru.assert(obj.value === Greeter.DEFAULT_SENTENCE);
    }
  }, {
    name: 'multiple initialization',
    test: function () {
      var Greeter = mixin({
        init: function () {
          this.value = Greeter.DEFAULT_SENTENCE;
        },
        greetings: function () {
          return this.value;
        }
      }, {
        DEFAULT_SENTENCE: 'Hello!'
      });
      var Other = mixin({
        init: function () {
          this.other = true;
        }
      });
      var obj = {};
      Greeter(obj);
      Other(obj);
      obj.init();
      wru.assert(obj.value === Greeter.DEFAULT_SENTENCE && obj.other === true);
    }
  }, {
    name: 'inherited mixin',
    test: function () {
      var mA = mixin({init: function () {
        this.mA = true;
      }});
      var mB = mixin({init: function () {
        this.mB = true;
      }});
      var CA = function () {};
      mA(CA);
      var CB = function () {};
      (CB.prototype = new CA).constructor = CB;
      mB(CB);
      var iA = new CA;
      var iB = new CB;
      iA.init();
      iB.init();
      wru.assert('init from A was invoked', iA.mA === true);
      wru.assert('init from A via B was not invoked', iA.mB === undefined);
      wru.assert('init from B via A was invoked', iB.mA === true);
      wru.assert('init from B was invoked', iB.mB === true);
    }
  }
].concat(typeof Symbol !== 'undefined' && Symbol.hasInstance ? [
  {
    name: 'Symbol.hasInstance',
    test: function () {
      var Greeter = mixin({
        init: function () {
          this.value = Greeter.DEFAULT_SENTENCE;
        },
        greetings: function () {
          return this.value;
        }
      }, {
        DEFAULT_SENTENCE: 'Hello!'
      });
      var Other = mixin({
        init: function () {
          this.other = true;
        }
      });
      var obj = {};
      Greeter(obj);
      Other(obj);
      wru.assert(obj instanceof Greeter && obj instanceof Other);
    }
  }
] : []));
