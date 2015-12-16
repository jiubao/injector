# injector
dependency injection
basic thought comes from angular injector.js
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
 *		the c-dep should not be referenced during object creation phase
 * todo: catch execption, otherwise normal error will report c-dep.
 * todo: finish invoke
 *
 * how to handle circular dependance(c-dep):
 *		a. just let it happen.
 *			when it happens, remove the c-dep from one side,
 *			reference the dep using injector.get
 *		b. add modules to 'share', modules should implement contract interface
 *		c. tech solution will come sometime.
**/
