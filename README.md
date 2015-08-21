universal-mixin [![build status](https://secure.travis-ci.org/WebReflection/universal-mixin.svg)](http://travis-ci.org/WebReflection/universal-mixin)
===================================

Inspired by [Reginald Braithwaite](https://twitter.com/raganwald) proposal in his [Using ES.later Decorators as Mixins](http://raganwald.com/2015/06/26/decorators-in-es7.html) post, and discussed with both Reginald and [Addy Osmani](https://twitter.com/addyosmani) in [the gist](https://gist.github.com/addyosmani/a0ccf60eae4d8e5290a0#gistcomment-1489585) related to Addy's [Exploring ES2016 Decorators](https://medium.com/google-developers/exploring-es7-decorators-76ecb65fb841) post, this `mixin` function goal is to bring a universal way, from _ES3_ to _ES.future_, client or server, to define functions usable as decorators for both clases and generic objects. 

Following the same ES7 example used in Addy's post, based on this `mixin` solution.
```js
const SuperPowers = mixin({
  init() {
    Object.defineProperty(this, '_superPowers', {value: []});
  },
  addPower(name) {
    this._superPowers.push(name);
    return this;
  },
  get powers() {
    return this._superPowers.slice(0);
  }
});

const UtilityBelt = mixin({
  init() {
    Object.defineProperty(this, '_utilityBelt', {value: []});
  },
  addToBelt(name) {
    this._utilityBelt.push(name);
    return this;
  },
  get utilities() {
    return this._utilityBelt.slice(0);
  }
});

// Usable as decorators
@SuperPowers
@UtilityBelt
class ComicBookCharacter {
  constructor(first, last) {
    this.firstName = first;
    this.lastName = last;
    // initialize mixins
    // if or when it's necessary
    this.init();
  }
  realName() {
    return this.firstName + ' ' + this.lastName;
  } 
};

// Usage examples
const batman = new ComicBookCharacter('Bruce', 'Wayne');
console.log(batman.realName());

batman
  .addToBelt('batarang')
  .addToBelt('cape');

console.log(batman.utilities);

batman
  .addPower('detective')
  .addPower('voice sounds like Gollum has asthma');

console.log(batman.powers);
```

It is also possible to use the `mixin` with other objects too.
```js
// as example only, don't use at home
var SimpleEmitter = mixin({
  init: function () {
    Object.defineProperty(
      this,
      '_emitter',
      {value: Object.create(null)}
    );
  },
  on: function (type, handler) {
    (this._emitter[type] || (
      this._emitter[type] = []
    )).push(handler);
  },
  emit: function (type) {
    var args = [].slice.call(arguments, 1);
    (this._emitter[type] || []).forEach(function (fn) {
      fn.apply(this, args);
    }, this);
  }
});


var obj = SimpleEmitter({});

obj.init();
obj.on('event', function (err, res) {
  console.log(err, res);
});
obj.emit('event', null, 123);

```

It is also possible to define mixin constants, propeties, or static methods, passing a second object as parameter.

```js
var WithStatic = mixin({}, {
  VALUE: 'any',
  method: function () {
    return WithStatic.VALUE;
  }
});

WithStatic.method(); // any
```

### Which file ?
In nodejs you can either `npm install universal-mixin` or use [universal-mixin.node.js](build/universal-mixin.node.js) file.

For browsers you can use [universal-mixin.js](build/universal-mixin.js) file, and for AMD you can use [universal-mixin.amd.js](build/universal-mixin.amd.js).



### Compatibility

The provided functionality is compatible with IE6 or greater, Espruino, NodeJS, and other common JavaScript engines.

In pre ES5 copmatible engines properties will be set enumerable and if no ES5 shim+sham is provided upfront getters and setters might not be accepted.

While IE6 and IE7 works just fine, if you are targeting IE8 please be sure ES5 shim+sham is loaded upfront.
You can put this on top of your page.
```html
<!--[if IE 8]>
<script src="//cdnjs.cloudflare.com/ajax/libs/es5-shim/4.1.7/es5-shim.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/es5-shim/4.1.7/es5-sham.min.js"></script>
<![endif]-->
```

Finally, you can test your browser through the [test page](http://webreflection.github.io/universal-mixin/test/).