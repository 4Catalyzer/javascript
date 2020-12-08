describe('Preset', () => {
  let preset;
  let babel;

  beforeEach(() => {
    babel = require('@babel/core');
    preset = require('..');
  });

  function transformCode(code, options) {
    return babel.transformSync(code, {
      presets: [[preset, options]],
      babelrc: false,
    }).code;
  }

  it('should be a valid config', () => {
    const opts = babel.loadOptions({
      presets: [[preset]],
      babelrc: false,
    });

    expect(opts.plugins).not.toHaveLength(0);
  });

  it('should compile for modern browsers', () => {
    expect(
      transformCode(
        `
          /* not compiled */
          const foo = (async () => await 1)();

          /* compiled */
          foo?.bar ?? true;

          /* compiles a = 1 for edge */
          const foo1 = ({ a = 1 }, b = 2, ...args) => [a, b, args];

          async function baz() {
            /* compiles but preserves native awaits */
            for await (let foo of iter()) {
              continue
            }
          }
        `,
      ),
    ).toMatchInlineSnapshot(`
      "\\"use strict\\";

      var _foo$bar;

      function _asyncIterator(iterable) { var method; if (typeof Symbol !== \\"undefined\\") { if (Symbol.asyncIterator) { method = iterable[Symbol.asyncIterator]; if (method != null) return method.call(iterable); } if (Symbol.iterator) { method = iterable[Symbol.iterator]; if (method != null) return method.call(iterable); } } throw new TypeError(\\"Object is not async iterable\\"); }

      /* not compiled */
      const foo = (async () => await 1)();
      /* compiled */


      (_foo$bar = foo == null ? void 0 : foo.bar) != null ? _foo$bar : true;
      /* compiles a = 1 for edge */

      const foo1 = ({
        a: _a = 1
      }, b = 2, ...args) => [_a, b, args];

      async function baz() {
        /* compiles but preserves native awaits */
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;

        var _iteratorError;

        try {
          for (var _iterator = _asyncIterator(iter()), _step, _value; _step = await _iterator.next(), _iteratorNormalCompletion = _step.done, _value = await _step.value, !_iteratorNormalCompletion; _iteratorNormalCompletion = true) {
            let foo = _value;
            continue;
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
              await _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }"
    `);
  });

  describe('Built-ins and Polyfilling', () => {
    const builtInCode = /* JS */ `
        const a = [].includes('1')

        const b = Object.assign({})
        const bb = { ...b }

        const c = Promise.resolve()

        Promise.allSettled([]).finally(() => {})
    `;

    it('it uses native built-ins but does not try to polyfill them', () => {
      const result = transformCode(builtInCode);

      expect(result).toContain('const bb = Object.assign({}, b);');
      expect(result).not.toContain('core-js');
    });

    it('it polyfills but excludes small impl bugs', () => {
      const result = transformCode(builtInCode, {
        includePolyfills: 'usage-global',
      });

      expect(result).toContain('core-js/modules/es.promise.all-settled');
      expect(result).toContain('core-js/modules/es.promise.finally');

      expect(result).not.toContain('"core-js/modules/es.promise"');
      expect(result).not.toContain('es.array');
    });

    it("doesn't break without options", () => {
      const result = transformCode(builtInCode, {
        target: 'web-app',
      });

      expect(result).toContain('core-js/modules/es.promise.all-settled');
      expect(result).toContain('core-js/modules/es.promise.finally');
    });

    it("doesn't break with options", () => {
      const result = transformCode(builtInCode, {
        target: 'web-app',
        includePolyfills: 'usage-global',
      });

      expect(result).toContain('core-js/modules/es.promise.all-settled');
      expect(result).toContain('core-js/modules/es.promise.finally');
    });

    it('it polyfills all the things', () => {
      const result = transformCode(builtInCode, {
        includePolyfills: {
          method: 'usage-global',
          exclude: [],
        },
      });

      expect(result).toContain('es.array');
      expect(result).toContain('es.object.assign');
      expect(result).toContain('"core-js/modules/es.promise.js"');
    });

    it('it polyfills purely', () => {
      const result = transformCode(builtInCode, {
        includePolyfills: {
          method: 'usage-pure',
          exclude: [],
        },
      });

      expect(result).toContain('core-js-pure/stable/object/assign.js');
      expect(result).toContain('core-js-pure/stable/promise/index.js');
    });

    it('it polyfills adaptively', () => {
      const result = transformCode(
        `
        async function* foo() {

        }
      `,
        {
          includePolyfills: {
            method: 'usage-pure',
            exclude: [],
          },
        },
      );

      expect(result).toMatchInlineSnapshot(`
        "\\"use strict\\";

        var _index = _interopRequireDefault(require(\\"core-js-pure/stable/promise/index.js\\"));

        var _asyncIterator = _interopRequireDefault(require(\\"core-js-pure/stable/symbol/async-iterator.js\\"));

        function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

        function _awaitAsyncGenerator(value) { return new _AwaitValue(value); }

        function _wrapAsyncGenerator(fn) { return function () { return new _AsyncGenerator(fn.apply(this, arguments)); }; }

        function _AsyncGenerator(gen) { var front, back; function send(key, arg) { return new _index.default(function (resolve, reject) { var request = { key: key, arg: arg, resolve: resolve, reject: reject, next: null }; if (back) { back = back.next = request; } else { front = back = request; resume(key, arg); } }); } function resume(key, arg) { try { var result = gen[key](arg); var value = result.value; var wrappedAwait = value instanceof _AwaitValue; _index.default.resolve(wrappedAwait ? value.wrapped : value).then(function (arg) { if (wrappedAwait) { resume(key === \\"return\\" ? \\"return\\" : \\"next\\", arg); return; } settle(result.done ? \\"return\\" : \\"normal\\", arg); }, function (err) { resume(\\"throw\\", err); }); } catch (err) { settle(\\"throw\\", err); } } function settle(type, value) { switch (type) { case \\"return\\": front.resolve({ value: value, done: true }); break; case \\"throw\\": front.reject(value); break; default: front.resolve({ value: value, done: false }); break; } front = front.next; if (front) { resume(front.key, front.arg); } else { back = null; } } this._invoke = send; if (typeof gen.return !== \\"function\\") { this.return = undefined; } }

        if (typeof Symbol === \\"function\\" && _asyncIterator.default) { _AsyncGenerator.prototype[_asyncIterator.default] = function () { return this; }; }

        _AsyncGenerator.prototype.next = function (arg) { return this._invoke(\\"next\\", arg); };

        _AsyncGenerator.prototype.throw = function (arg) { return this._invoke(\\"throw\\", arg); };

        _AsyncGenerator.prototype.return = function (arg) { return this._invoke(\\"return\\", arg); };

        function _AwaitValue(value) { this.wrapped = value; }

        function foo() {
          return _foo.apply(this, arguments);
        }

        function _foo() {
          _foo = _wrapAsyncGenerator(function* () {});
          return _foo.apply(this, arguments);
        }"
      `);
    });
  });
});
