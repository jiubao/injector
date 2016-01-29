/**
 * DESCRIPTION
 * handle dependencies between modules
 * case insensitive, lazy execute
 * support share module across all modules
 *
 * interface:
 * get, put, factory, define, share
 * invoke
 *
 * sample codes:
 * define
 * define(function() {})
 * define('name', function() {})
 * define('name', ['d1', 'd2', function(d1, d2) {}])
 *
 * todo list:
 * todo: multi-providers for same name
 * todo: recursive dependent (circular dependent) (c-dep)
 *
 * c-dep:
 *  the c-dep should not be referenced during object creation phase
 * todo: catch execption, otherwise normal error will report c-dep.
 * todo: finish invoke
 *
 * how to handle circular dependance(c-dep):
 *  a. just let it happen.
 *    when it happens, remove the c-dep from one side,
 *    reference the dep using injector.get
 *  b. add modules to 'share', modules should implement contract interface
 *  c. tech solution will come sometime.
**/

function createInjector(modules) {
  var share = {modules:[]},
  providers = {},
  cache = {'share': share},
  INSTANTIATING = {};

  //injector = cache.$injector = create();
  //return injector;

  //put('share', share);

  return {
    get: get,
    put: put,
    factory: function(name, factory) {
      name = format(name);
      providers[name] = cache[name] = factory;
    },
    define: define,
    //invoke: invoke,
    share: function(name, factory) {
      share[name] = factory();
    }
  };

  function format(name) {
    return name.toLowerCase();
  }

  function put(name, service) {
    name = format(name);
    if (isFunction(service)) {
      providers[name] = service;
    } else {
      providers[name] = cache[name] = service;
    }
  }

  //todo: resolve deps, support [para1, para2, ... , function(p1, p2, ...) {}] syntax.
  function invoke(provider) {

    var deps = provider.$depends;
    var args = [];
    if (deps && deps.length > 0) {
      deps.forEach(function(dep){
        args.push(get(dep));
      });
    }
    //todo: support parameter for prototypal inheritance model
    return isPrototypal(provider) ? new provider() : provider.apply(null, args);
  }

  //todo: catch execption, otherwise normal error will report c-dep.
  function get(name) {
    name = format(name);

    if (cache.hasOwnProperty(name)) {
      if (cache[name] === INSTANTIATING) {
        throw "c-dep: " + name;
      }

      return cache[name];
    }

    try {
      var provider = providers[name];
      if (!provider) {
        throw "no provider: " + name;
      }

      cache[name] = INSTANTIATING;
      cache[name] = invoke(provider);

      if (cache[name]) {
        share.modules.push(cache[name]);
        //todo: add parameter to define, determining whether add to share.
        cache[name].$share = share;
      }

      return cache[name];
    } catch(ex) {
      if (cache[name] === INSTANTIATING) {
        delete cache[name];
      }
      throw ex;
    }
  }

  function define() {
    if (arguments.length === 0)
      return;
    if (arguments.length === 1) {
      return;
    }

    var provider = arguments[1];
    if (isArray(provider)) {
      provider = provider[provider.length-1];
      provider.$depends = arguments[1].slice(0, arguments[1].length-1).map(format);
    }

    put(arguments[0], provider);
  }
}
