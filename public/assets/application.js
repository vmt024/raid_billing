/*!
 * jQuery JavaScript Library v1.7.2
 * http://jquery.com/
 *
 * Copyright 2011, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 * Copyright 2011, The Dojo Foundation
 * Released under the MIT, BSD, and GPL Licenses.
 *
 * Date: Wed Mar 21 12:46:34 2012 -0700
 */

(function( window, undefined ) {

// Use the correct document accordingly with window argument (sandbox)
var document = window.document,
	navigator = window.navigator,
	location = window.location;
var jQuery = (function() {

// Define a local copy of jQuery
var jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// A simple way to check for HTML strings or ID strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	quickExpr = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,

	// Check if a string has a non-whitespace character in it
	rnotwhite = /\S/,

	// Used for trimming whitespace
	trimLeft = /^\s+/,
	trimRight = /\s+$/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,

	// Useragent RegExp
	rwebkit = /(webkit)[ \/]([\w.]+)/,
	ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/,
	rmsie = /(msie) ([\w.]+)/,
	rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/,

	// Matches dashed string for camelizing
	rdashAlpha = /-([a-z]|[0-9])/ig,
	rmsPrefix = /^-ms-/,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return ( letter + "" ).toUpperCase();
	},

	// Keep a UserAgent string for use with jQuery.browser
	userAgent = navigator.userAgent,

	// For matching the engine and version of the browser
	browserMatch,

	// The deferred used on DOM ready
	readyList,

	// The ready event handler
	DOMContentLoaded,

	// Save a reference to some core methods
	toString = Object.prototype.toString,
	hasOwn = Object.prototype.hasOwnProperty,
	push = Array.prototype.push,
	slice = Array.prototype.slice,
	trim = String.prototype.trim,
	indexOf = Array.prototype.indexOf,

	// [[Class]] -> type pairs
	class2type = {};

jQuery.fn = jQuery.prototype = {
	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem, ret, doc;

		// Handle $(""), $(null), or $(undefined)
		if ( !selector ) {
			return this;
		}

		// Handle $(DOMElement)
		if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;
		}

		// The body element only exists once, optimize finding it
		if ( selector === "body" && !context && document.body ) {
			this.context = document;
			this[0] = document.body;
			this.selector = selector;
			this.length = 1;
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			// Are we dealing with HTML string or an ID?
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = quickExpr.exec( selector );
			}

			// Verify a match, and that no context was specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;
					doc = ( context ? context.ownerDocument || context : document );

					// If a single string is passed in and it's a single tag
					// just do a createElement and skip the rest
					ret = rsingleTag.exec( selector );

					if ( ret ) {
						if ( jQuery.isPlainObject( context ) ) {
							selector = [ document.createElement( ret[1] ) ];
							jQuery.fn.attr.call( selector, context, true );

						} else {
							selector = [ doc.createElement( ret[1] ) ];
						}

					} else {
						ret = jQuery.buildFragment( [ match[1] ], [ doc ] );
						selector = ( ret.cacheable ? jQuery.clone(ret.fragment) : ret.fragment ).childNodes;
					}

					return jQuery.merge( this, selector );

				// HANDLE: $("#id")
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The current version of jQuery being used
	jquery: "1.7.2",

	// The default length of a jQuery object is 0
	length: 0,

	// The number of elements contained in the matched element set
	size: function() {
		return this.length;
	},

	toArray: function() {
		return slice.call( this, 0 );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems, name, selector ) {
		// Build a new jQuery matched element set
		var ret = this.constructor();

		if ( jQuery.isArray( elems ) ) {
			push.apply( ret, elems );

		} else {
			jQuery.merge( ret, elems );
		}

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		ret.context = this.context;

		if ( name === "find" ) {
			ret.selector = this.selector + ( this.selector ? " " : "" ) + selector;
		} else if ( name ) {
			ret.selector = this.selector + "." + name + "(" + selector + ")";
		}

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Attach the listeners
		jQuery.bindReady();

		// Add the callback
		readyList.add( fn );

		return this;
	},

	eq: function( i ) {
		i = +i;
		return i === -1 ?
			this.slice( i ) :
			this.slice( i, i + 1 );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ),
			"slice", slice.call(arguments).join(",") );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {
		// Either a released hold or an DOMready/load event and not yet ready
		if ( (wait === true && !--jQuery.readyWait) || (wait !== true && !jQuery.isReady) ) {
			// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
			if ( !document.body ) {
				return setTimeout( jQuery.ready, 1 );
			}

			// Remember that the DOM is ready
			jQuery.isReady = true;

			// If a normal DOM Ready event fired, decrement, and wait if need be
			if ( wait !== true && --jQuery.readyWait > 0 ) {
				return;
			}

			// If there are functions bound, to execute
			readyList.fireWith( document, [ jQuery ] );

			// Trigger any bound ready events
			if ( jQuery.fn.trigger ) {
				jQuery( document ).trigger( "ready" ).off( "ready" );
			}
		}
	},

	bindReady: function() {
		if ( readyList ) {
			return;
		}

		readyList = jQuery.Callbacks( "once memory" );

		// Catch cases where $(document).ready() is called after the
		// browser event has already occurred.
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			return setTimeout( jQuery.ready, 1 );
		}

		// Mozilla, Opera and webkit nightlies currently support this event
		if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", jQuery.ready, false );

		// If IE event model is used
		} else if ( document.attachEvent ) {
			// ensure firing before onload,
			// maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", DOMContentLoaded );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", jQuery.ready );

			// If IE and not a frame
			// continually check to see if the document is ready
			var toplevel = false;

			try {
				toplevel = window.frameElement == null;
			} catch(e) {}

			if ( document.documentElement.doScroll && toplevel ) {
				doScrollCheck();
			}
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	isWindow: function( obj ) {
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		return obj == null ?
			String( obj ) :
			class2type[ toString.call(obj) ] || "object";
	},

	isPlainObject: function( obj ) {
		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!hasOwn.call(obj, "constructor") &&
				!hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.

		var key;
		for ( key in obj ) {}

		return key === undefined || hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		for ( var name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	parseJSON: function( data ) {
		if ( typeof data !== "string" || !data ) {
			return null;
		}

		// Make sure leading/trailing whitespace is removed (IE can't handle it)
		data = jQuery.trim( data );

		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		// Make sure the incoming data is actual JSON
		// Logic borrowed from http://json.org/json2.js
		if ( rvalidchars.test( data.replace( rvalidescape, "@" )
			.replace( rvalidtokens, "]" )
			.replace( rvalidbraces, "")) ) {

			return ( new Function( "return " + data ) )();

		}
		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: function( data ) {
		if ( typeof data !== "string" || !data ) {
			return null;
		}
		var xml, tmp;
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && rnotwhite.test( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toUpperCase() === name.toUpperCase();
	},

	// args is for internal usage only
	each: function( object, callback, args ) {
		var name, i = 0,
			length = object.length,
			isObj = length === undefined || jQuery.isFunction( object );

		if ( args ) {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.apply( object[ name ], args ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.apply( object[ i++ ], args ) === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.call( object[ name ], name, object[ name ] ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.call( object[ i ], i, object[ i++ ] ) === false ) {
						break;
					}
				}
			}
		}

		return object;
	},

	// Use native String.trim function wherever possible
	trim: trim ?
		function( text ) {
			return text == null ?
				"" :
				trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				text.toString().replace( trimLeft, "" ).replace( trimRight, "" );
		},

	// results is for internal usage only
	makeArray: function( array, results ) {
		var ret = results || [];

		if ( array != null ) {
			// The window, strings (and functions) also have 'length'
			// Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
			var type = jQuery.type( array );

			if ( array.length == null || type === "string" || type === "function" || type === "regexp" || jQuery.isWindow( array ) ) {
				push.call( ret, array );
			} else {
				jQuery.merge( ret, array );
			}
		}

		return ret;
	},

	inArray: function( elem, array, i ) {
		var len;

		if ( array ) {
			if ( indexOf ) {
				return indexOf.call( array, elem, i );
			}

			len = array.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in array && array[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var i = first.length,
			j = 0;

		if ( typeof second.length === "number" ) {
			for ( var l = second.length; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}

		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var ret = [], retVal;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( var i = 0, length = elems.length; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value, key, ret = [],
			i = 0,
			length = elems.length,
			// jquery objects are treated as arrays
			isArray = elems instanceof jQuery || length !== undefined && typeof length === "number" && ( ( length > 0 && elems[ 0 ] && elems[ length -1 ] ) || length === 0 || jQuery.isArray( elems ) ) ;

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( key in elems ) {
				value = callback( elems[ key ], key, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return ret.concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		if ( typeof context === "string" ) {
			var tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		var args = slice.call( arguments, 2 ),
			proxy = function() {
				return fn.apply( context, args.concat( slice.call( arguments ) ) );
			};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || proxy.guid || jQuery.guid++;

		return proxy;
	},

	// Mutifunctional method to get and set values to a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, fn, key, value, chainable, emptyGet, pass ) {
		var exec,
			bulk = key == null,
			i = 0,
			length = elems.length;

		// Sets many values
		if ( key && typeof key === "object" ) {
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], 1, emptyGet, value );
			}
			chainable = 1;

		// Sets one value
		} else if ( value !== undefined ) {
			// Optionally, function values get executed if exec is true
			exec = pass === undefined && jQuery.isFunction( value );

			if ( bulk ) {
				// Bulk operations only iterate when executing function values
				if ( exec ) {
					exec = fn;
					fn = function( elem, key, value ) {
						return exec.call( jQuery( elem ), value );
					};

				// Otherwise they run against the entire set
				} else {
					fn.call( elems, value );
					fn = null;
				}
			}

			if ( fn ) {
				for (; i < length; i++ ) {
					fn( elems[i], key, exec ? value.call( elems[i], i, fn( elems[i], key ) ) : value, pass );
				}
			}

			chainable = 1;
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

	now: function() {
		return ( new Date() ).getTime();
	},

	// Use of jQuery.browser is frowned upon.
	// More details: http://docs.jquery.com/Utilities/jQuery.browser
	uaMatch: function( ua ) {
		ua = ua.toLowerCase();

		var match = rwebkit.exec( ua ) ||
			ropera.exec( ua ) ||
			rmsie.exec( ua ) ||
			ua.indexOf("compatible") < 0 && rmozilla.exec( ua ) ||
			[];

		return { browser: match[1] || "", version: match[2] || "0" };
	},

	sub: function() {
		function jQuerySub( selector, context ) {
			return new jQuerySub.fn.init( selector, context );
		}
		jQuery.extend( true, jQuerySub, this );
		jQuerySub.superclass = this;
		jQuerySub.fn = jQuerySub.prototype = this();
		jQuerySub.fn.constructor = jQuerySub;
		jQuerySub.sub = this.sub;
		jQuerySub.fn.init = function init( selector, context ) {
			if ( context && context instanceof jQuery && !(context instanceof jQuerySub) ) {
				context = jQuerySub( context );
			}

			return jQuery.fn.init.call( this, selector, context, rootjQuerySub );
		};
		jQuerySub.fn.init.prototype = jQuerySub.fn;
		var rootjQuerySub = jQuerySub(document);
		return jQuerySub;
	},

	browser: {}
});

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

browserMatch = jQuery.uaMatch( userAgent );
if ( browserMatch.browser ) {
	jQuery.browser[ browserMatch.browser ] = true;
	jQuery.browser.version = browserMatch.version;
}

// Deprecated, use jQuery.browser.webkit instead
if ( jQuery.browser.webkit ) {
	jQuery.browser.safari = true;
}

// IE doesn't match non-breaking spaces with \s
if ( rnotwhite.test( "\xA0" ) ) {
	trimLeft = /^[\s\xA0]+/;
	trimRight = /[\s\xA0]+$/;
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);

// Cleanup functions for the document ready method
if ( document.addEventListener ) {
	DOMContentLoaded = function() {
		document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
		jQuery.ready();
	};

} else if ( document.attachEvent ) {
	DOMContentLoaded = function() {
		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( document.readyState === "complete" ) {
			document.detachEvent( "onreadystatechange", DOMContentLoaded );
			jQuery.ready();
		}
	};
}

// The DOM ready check for Internet Explorer
function doScrollCheck() {
	if ( jQuery.isReady ) {
		return;
	}

	try {
		// If IE is used, use the trick by Diego Perini
		// http://javascript.nwbox.com/IEContentLoaded/
		document.documentElement.doScroll("left");
	} catch(e) {
		setTimeout( doScrollCheck, 1 );
		return;
	}

	// and execute any waiting functions
	jQuery.ready();
}

return jQuery;

})();


// String to Object flags format cache
var flagsCache = {};

// Convert String-formatted flags into Object-formatted ones and store in cache
function createFlags( flags ) {
	var object = flagsCache[ flags ] = {},
		i, length;
	flags = flags.split( /\s+/ );
	for ( i = 0, length = flags.length; i < length; i++ ) {
		object[ flags[i] ] = true;
	}
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	flags:	an optional list of space-separated flags that will change how
 *			the callback list behaves
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible flags:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( flags ) {

	// Convert flags from String-formatted to Object-formatted
	// (we check in cache first)
	flags = flags ? ( flagsCache[ flags ] || createFlags( flags ) ) : {};

	var // Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = [],
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// Flag to know if list is currently firing
		firing,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// Add one or several callbacks to the list
		add = function( args ) {
			var i,
				length,
				elem,
				type,
				actual;
			for ( i = 0, length = args.length; i < length; i++ ) {
				elem = args[ i ];
				type = jQuery.type( elem );
				if ( type === "array" ) {
					// Inspect recursively
					add( elem );
				} else if ( type === "function" ) {
					// Add if not in unique mode and callback is not in
					if ( !flags.unique || !self.has( elem ) ) {
						list.push( elem );
					}
				}
			}
		},
		// Fire callbacks
		fire = function( context, args ) {
			args = args || [];
			memory = !flags.memory || [ context, args ];
			fired = true;
			firing = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( context, args ) === false && flags.stopOnFalse ) {
					memory = true; // Mark as halted
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( !flags.once ) {
					if ( stack && stack.length ) {
						memory = stack.shift();
						self.fireWith( memory[ 0 ], memory[ 1 ] );
					}
				} else if ( memory === true ) {
					self.disable();
				} else {
					list = [];
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					var length = list.length;
					add( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away, unless previous
					// firing was halted (stopOnFalse)
					} else if ( memory && memory !== true ) {
						firingStart = length;
						fire( memory[ 0 ], memory[ 1 ] );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					var args = arguments,
						argIndex = 0,
						argLength = args.length;
					for ( ; argIndex < argLength ; argIndex++ ) {
						for ( var i = 0; i < list.length; i++ ) {
							if ( args[ argIndex ] === list[ i ] ) {
								// Handle firingIndex and firingLength
								if ( firing ) {
									if ( i <= firingLength ) {
										firingLength--;
										if ( i <= firingIndex ) {
											firingIndex--;
										}
									}
								}
								// Remove the element
								list.splice( i--, 1 );
								// If we have some unicity property then
								// we only need to do this once
								if ( flags.unique ) {
									break;
								}
							}
						}
					}
				}
				return this;
			},
			// Control if a given callback is in the list
			has: function( fn ) {
				if ( list ) {
					var i = 0,
						length = list.length;
					for ( ; i < length; i++ ) {
						if ( fn === list[ i ] ) {
							return true;
						}
					}
				}
				return false;
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory || memory === true ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( stack ) {
					if ( firing ) {
						if ( !flags.once ) {
							stack.push( [ context, args ] );
						}
					} else if ( !( flags.once && memory ) ) {
						fire( context, args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};




var // Static reference to slice
	sliceDeferred = [].slice;

jQuery.extend({

	Deferred: function( func ) {
		var doneList = jQuery.Callbacks( "once memory" ),
			failList = jQuery.Callbacks( "once memory" ),
			progressList = jQuery.Callbacks( "memory" ),
			state = "pending",
			lists = {
				resolve: doneList,
				reject: failList,
				notify: progressList
			},
			promise = {
				done: doneList.add,
				fail: failList.add,
				progress: progressList.add,

				state: function() {
					return state;
				},

				// Deprecated
				isResolved: doneList.fired,
				isRejected: failList.fired,

				then: function( doneCallbacks, failCallbacks, progressCallbacks ) {
					deferred.done( doneCallbacks ).fail( failCallbacks ).progress( progressCallbacks );
					return this;
				},
				always: function() {
					deferred.done.apply( deferred, arguments ).fail.apply( deferred, arguments );
					return this;
				},
				pipe: function( fnDone, fnFail, fnProgress ) {
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( {
							done: [ fnDone, "resolve" ],
							fail: [ fnFail, "reject" ],
							progress: [ fnProgress, "notify" ]
						}, function( handler, data ) {
							var fn = data[ 0 ],
								action = data[ 1 ],
								returned;
							if ( jQuery.isFunction( fn ) ) {
								deferred[ handler ](function() {
									returned = fn.apply( this, arguments );
									if ( returned && jQuery.isFunction( returned.promise ) ) {
										returned.promise().then( newDefer.resolve, newDefer.reject, newDefer.notify );
									} else {
										newDefer[ action + "With" ]( this === deferred ? newDefer : this, [ returned ] );
									}
								});
							} else {
								deferred[ handler ]( newDefer[ action ] );
							}
						});
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					if ( obj == null ) {
						obj = promise;
					} else {
						for ( var key in promise ) {
							obj[ key ] = promise[ key ];
						}
					}
					return obj;
				}
			},
			deferred = promise.promise({}),
			key;

		for ( key in lists ) {
			deferred[ key ] = lists[ key ].fire;
			deferred[ key + "With" ] = lists[ key ].fireWith;
		}

		// Handle state
		deferred.done( function() {
			state = "resolved";
		}, failList.disable, progressList.lock ).fail( function() {
			state = "rejected";
		}, doneList.disable, progressList.lock );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( firstParam ) {
		var args = sliceDeferred.call( arguments, 0 ),
			i = 0,
			length = args.length,
			pValues = new Array( length ),
			count = length,
			pCount = length,
			deferred = length <= 1 && firstParam && jQuery.isFunction( firstParam.promise ) ?
				firstParam :
				jQuery.Deferred(),
			promise = deferred.promise();
		function resolveFunc( i ) {
			return function( value ) {
				args[ i ] = arguments.length > 1 ? sliceDeferred.call( arguments, 0 ) : value;
				if ( !( --count ) ) {
					deferred.resolveWith( deferred, args );
				}
			};
		}
		function progressFunc( i ) {
			return function( value ) {
				pValues[ i ] = arguments.length > 1 ? sliceDeferred.call( arguments, 0 ) : value;
				deferred.notifyWith( promise, pValues );
			};
		}
		if ( length > 1 ) {
			for ( ; i < length; i++ ) {
				if ( args[ i ] && args[ i ].promise && jQuery.isFunction( args[ i ].promise ) ) {
					args[ i ].promise().then( resolveFunc(i), deferred.reject, progressFunc(i) );
				} else {
					--count;
				}
			}
			if ( !count ) {
				deferred.resolveWith( deferred, args );
			}
		} else if ( deferred !== firstParam ) {
			deferred.resolveWith( deferred, length ? [ firstParam ] : [] );
		}
		return promise;
	}
});




jQuery.support = (function() {

	var support,
		all,
		a,
		select,
		opt,
		input,
		fragment,
		tds,
		events,
		eventName,
		i,
		isSupported,
		div = document.createElement( "div" ),
		documentElement = document.documentElement;

	// Preliminary tests
	div.setAttribute("className", "t");
	div.innerHTML = "   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>";

	all = div.getElementsByTagName( "*" );
	a = div.getElementsByTagName( "a" )[ 0 ];

	// Can't get basic test support
	if ( !all || !all.length || !a ) {
		return {};
	}

	// First batch of supports tests
	select = document.createElement( "select" );
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName( "input" )[ 0 ];

	support = {
		// IE strips leading whitespace when .innerHTML is used
		leadingWhitespace: ( div.firstChild.nodeType === 3 ),

		// Make sure that tbody elements aren't automatically inserted
		// IE will insert them into empty tables
		tbody: !div.getElementsByTagName("tbody").length,

		// Make sure that link elements get serialized correctly by innerHTML
		// This requires a wrapper element in IE
		htmlSerialize: !!div.getElementsByTagName("link").length,

		// Get the style information from getAttribute
		// (IE uses .cssText instead)
		style: /top/.test( a.getAttribute("style") ),

		// Make sure that URLs aren't manipulated
		// (IE normalizes it by default)
		hrefNormalized: ( a.getAttribute("href") === "/a" ),

		// Make sure that element opacity exists
		// (IE uses filter instead)
		// Use a regex to work around a WebKit issue. See #5145
		opacity: /^0.55/.test( a.style.opacity ),

		// Verify style float existence
		// (IE uses styleFloat instead of cssFloat)
		cssFloat: !!a.style.cssFloat,

		// Make sure that if no value is specified for a checkbox
		// that it defaults to "on".
		// (WebKit defaults to "" instead)
		checkOn: ( input.value === "on" ),

		// Make sure that a selected-by-default option has a working selected property.
		// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
		optSelected: opt.selected,

		// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
		getSetAttribute: div.className !== "t",

		// Tests for enctype support on a form(#6743)
		enctype: !!document.createElement("form").enctype,

		// Makes sure cloning an html5 element does not cause problems
		// Where outerHTML is undefined, this still works
		html5Clone: document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>",

		// Will be defined later
		submitBubbles: true,
		changeBubbles: true,
		focusinBubbles: false,
		deleteExpando: true,
		noCloneEvent: true,
		inlineBlockNeedsLayout: false,
		shrinkWrapBlocks: false,
		reliableMarginRight: true,
		pixelMargin: true
	};

	// jQuery.boxModel DEPRECATED in 1.3, use jQuery.support.boxModel instead
	jQuery.boxModel = support.boxModel = (document.compatMode === "CSS1Compat");

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Test to see if it's possible to delete an expando from an element
	// Fails in Internet Explorer
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	if ( !div.addEventListener && div.attachEvent && div.fireEvent ) {
		div.attachEvent( "onclick", function() {
			// Cloning a node shouldn't copy over any
			// bound event handlers (IE does this)
			support.noCloneEvent = false;
		});
		div.cloneNode( true ).fireEvent( "onclick" );
	}

	// Check if a radio maintains its value
	// after being appended to the DOM
	input = document.createElement("input");
	input.value = "t";
	input.setAttribute("type", "radio");
	support.radioValue = input.value === "t";

	input.setAttribute("checked", "checked");

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "name", "t" );

	div.appendChild( input );
	fragment = document.createDocumentFragment();
	fragment.appendChild( div.lastChild );

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	fragment.removeChild( input );
	fragment.appendChild( div );

	// Technique from Juriy Zaytsev
	// http://perfectionkills.com/detecting-event-support-without-browser-sniffing/
	// We only care about the case where non-standard event systems
	// are used, namely in IE. Short-circuiting here helps us to
	// avoid an eval call (in setAttribute) which can cause CSP
	// to go haywire. See: https://developer.mozilla.org/en/Security/CSP
	if ( div.attachEvent ) {
		for ( i in {
			submit: 1,
			change: 1,
			focusin: 1
		}) {
			eventName = "on" + i;
			isSupported = ( eventName in div );
			if ( !isSupported ) {
				div.setAttribute( eventName, "return;" );
				isSupported = ( typeof div[ eventName ] === "function" );
			}
			support[ i + "Bubbles" ] = isSupported;
		}
	}

	fragment.removeChild( div );

	// Null elements to avoid leaks in IE
	fragment = select = opt = div = input = null;

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, outer, inner, table, td, offsetSupport,
			marginDiv, conMarginTop, style, html, positionTopLeftWidthHeight,
			paddingMarginBorderVisibility, paddingMarginBorder,
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		conMarginTop = 1;
		paddingMarginBorder = "padding:0;margin:0;border:";
		positionTopLeftWidthHeight = "position:absolute;top:0;left:0;width:1px;height:1px;";
		paddingMarginBorderVisibility = paddingMarginBorder + "0;visibility:hidden;";
		style = "style='" + positionTopLeftWidthHeight + paddingMarginBorder + "5px solid #000;";
		html = "<div " + style + "display:block;'><div style='" + paddingMarginBorder + "0;display:block;overflow:hidden;'></div></div>" +
			"<table " + style + "' cellpadding='0' cellspacing='0'>" +
			"<tr><td></td></tr></table>";

		container = document.createElement("div");
		container.style.cssText = paddingMarginBorderVisibility + "width:0;height:0;position:static;top:0;margin-top:" + conMarginTop + "px";
		body.insertBefore( container, body.firstChild );

		// Construct the test element
		div = document.createElement("div");
		container.appendChild( div );

		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		// (only IE 8 fails this test)
		div.innerHTML = "<table><tr><td style='" + paddingMarginBorder + "0;display:none'></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName( "td" );
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";

		// Check if empty table cells still have offsetWidth/Height
		// (IE <= 8 fail this test)
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

		// Check if div with explicit width and no margin-right incorrectly
		// gets computed margin-right based on width of container. For more
		// info see bug #3333
		// Fails in WebKit before Feb 2011 nightlies
		// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
		if ( window.getComputedStyle ) {
			div.innerHTML = "";
			marginDiv = document.createElement( "div" );
			marginDiv.style.width = "0";
			marginDiv.style.marginRight = "0";
			div.style.width = "2px";
			div.appendChild( marginDiv );
			support.reliableMarginRight =
				( parseInt( ( window.getComputedStyle( marginDiv, null ) || { marginRight: 0 } ).marginRight, 10 ) || 0 ) === 0;
		}

		if ( typeof div.style.zoom !== "undefined" ) {
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			// (IE < 8 does this)
			div.innerHTML = "";
			div.style.width = div.style.padding = "1px";
			div.style.border = 0;
			div.style.overflow = "hidden";
			div.style.display = "inline";
			div.style.zoom = 1;
			support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

			// Check if elements with layout shrink-wrap their children
			// (IE 6 does this)
			div.style.display = "block";
			div.style.overflow = "visible";
			div.innerHTML = "<div style='width:5px;'></div>";
			support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );
		}

		div.style.cssText = positionTopLeftWidthHeight + paddingMarginBorderVisibility;
		div.innerHTML = html;

		outer = div.firstChild;
		inner = outer.firstChild;
		td = outer.nextSibling.firstChild.firstChild;

		offsetSupport = {
			doesNotAddBorder: ( inner.offsetTop !== 5 ),
			doesAddBorderForTableAndCells: ( td.offsetTop === 5 )
		};

		inner.style.position = "fixed";
		inner.style.top = "20px";

		// safari subtracts parent border width here which is 5px
		offsetSupport.fixedPosition = ( inner.offsetTop === 20 || inner.offsetTop === 15 );
		inner.style.position = inner.style.top = "";

		outer.style.overflow = "hidden";
		outer.style.position = "relative";

		offsetSupport.subtractsBorderForOverflowNotVisible = ( inner.offsetTop === -5 );
		offsetSupport.doesNotIncludeMarginInBodyOffset = ( body.offsetTop !== conMarginTop );

		if ( window.getComputedStyle ) {
			div.style.marginTop = "1%";
			support.pixelMargin = ( window.getComputedStyle( div, null ) || { marginTop: 0 } ).marginTop !== "1%";
		}

		if ( typeof container.style.zoom !== "undefined" ) {
			container.style.zoom = 1;
		}

		body.removeChild( container );
		marginDiv = div = container = null;

		jQuery.extend( support, offsetSupport );
	});

	return support;
})();




var rbrace = /^(?:\{.*\}|\[.*\])$/,
	rmultiDash = /([A-Z])/g;

jQuery.extend({
	cache: {},

	// Please use with caution
	uuid: 0,

	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( jQuery.fn.jquery + Math.random() ).replace( /\D/g, "" ),

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
		"applet": true
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var privateCache, thisCache, ret,
			internalKey = jQuery.expando,
			getByName = typeof name === "string",

			// We have to handle DOM nodes and JS objects differently because IE6-7
			// can't GC object references properly across the DOM-JS boundary
			isNode = elem.nodeType,

			// Only DOM nodes need the global jQuery cache; JS object data is
			// attached directly to the object so GC can occur automatically
			cache = isNode ? jQuery.cache : elem,

			// Only defining an ID for JS objects if its cache already exists allows
			// the code to shortcut on the same path as a DOM node with no cache
			id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey,
			isEvents = name === "events";

		// Avoid doing any more work than we need to when trying to get data on an
		// object that has no data at all
		if ( (!id || !cache[id] || (!isEvents && !pvt && !cache[id].data)) && getByName && data === undefined ) {
			return;
		}

		if ( !id ) {
			// Only DOM nodes need a new unique ID for each element since their data
			// ends up in the global cache
			if ( isNode ) {
				elem[ internalKey ] = id = ++jQuery.uuid;
			} else {
				id = internalKey;
			}
		}

		if ( !cache[ id ] ) {
			cache[ id ] = {};

			// Avoids exposing jQuery metadata on plain JS objects when the object
			// is serialized using JSON.stringify
			if ( !isNode ) {
				cache[ id ].toJSON = jQuery.noop;
			}
		}

		// An object can be passed to jQuery.data instead of a key/value pair; this gets
		// shallow copied over onto the existing cache
		if ( typeof name === "object" || typeof name === "function" ) {
			if ( pvt ) {
				cache[ id ] = jQuery.extend( cache[ id ], name );
			} else {
				cache[ id ].data = jQuery.extend( cache[ id ].data, name );
			}
		}

		privateCache = thisCache = cache[ id ];

		// jQuery data() is stored in a separate object inside the object's internal data
		// cache in order to avoid key collisions between internal data and user-defined
		// data.
		if ( !pvt ) {
			if ( !thisCache.data ) {
				thisCache.data = {};
			}

			thisCache = thisCache.data;
		}

		if ( data !== undefined ) {
			thisCache[ jQuery.camelCase( name ) ] = data;
		}

		// Users should not attempt to inspect the internal events object using jQuery.data,
		// it is undocumented and subject to change. But does anyone listen? No.
		if ( isEvents && !thisCache[ name ] ) {
			return privateCache.events;
		}

		// Check for both converted-to-camel and non-converted data property names
		// If a data property was specified
		if ( getByName ) {

			// First Try to find as-is property data
			ret = thisCache[ name ];

			// Test for null|undefined property data
			if ( ret == null ) {

				// Try to find the camelCased property
				ret = thisCache[ jQuery.camelCase( name ) ];
			}
		} else {
			ret = thisCache;
		}

		return ret;
	},

	removeData: function( elem, name, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var thisCache, i, l,

			// Reference to internal data cache key
			internalKey = jQuery.expando,

			isNode = elem.nodeType,

			// See jQuery.data for more information
			cache = isNode ? jQuery.cache : elem,

			// See jQuery.data for more information
			id = isNode ? elem[ internalKey ] : internalKey;

		// If there is already no cache entry for this object, there is no
		// purpose in continuing
		if ( !cache[ id ] ) {
			return;
		}

		if ( name ) {

			thisCache = pvt ? cache[ id ] : cache[ id ].data;

			if ( thisCache ) {

				// Support array or space separated string names for data keys
				if ( !jQuery.isArray( name ) ) {

					// try the string as a key before any manipulation
					if ( name in thisCache ) {
						name = [ name ];
					} else {

						// split the camel cased version by spaces unless a key with the spaces exists
						name = jQuery.camelCase( name );
						if ( name in thisCache ) {
							name = [ name ];
						} else {
							name = name.split( " " );
						}
					}
				}

				for ( i = 0, l = name.length; i < l; i++ ) {
					delete thisCache[ name[i] ];
				}

				// If there is no data left in the cache, we want to continue
				// and let the cache object itself get destroyed
				if ( !( pvt ? isEmptyDataObject : jQuery.isEmptyObject )( thisCache ) ) {
					return;
				}
			}
		}

		// See jQuery.data for more information
		if ( !pvt ) {
			delete cache[ id ].data;

			// Don't destroy the parent cache unless the internal data object
			// had been the only thing left in it
			if ( !isEmptyDataObject(cache[ id ]) ) {
				return;
			}
		}

		// Browsers that fail expando deletion also refuse to delete expandos on
		// the window, but it will allow it on all other JS objects; other browsers
		// don't care
		// Ensure that `cache` is not a window object #10080
		if ( jQuery.support.deleteExpando || !cache.setInterval ) {
			delete cache[ id ];
		} else {
			cache[ id ] = null;
		}

		// We destroyed the cache and need to eliminate the expando on the node to avoid
		// false lookups in the cache for entries that no longer exist
		if ( isNode ) {
			// IE does not allow us to delete expando properties from nodes,
			// nor does it have a removeAttribute function on Document nodes;
			// we must handle all of these cases
			if ( jQuery.support.deleteExpando ) {
				delete elem[ internalKey ];
			} else if ( elem.removeAttribute ) {
				elem.removeAttribute( internalKey );
			} else {
				elem[ internalKey ] = null;
			}
		}
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return jQuery.data( elem, name, data, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		if ( elem.nodeName ) {
			var match = jQuery.noData[ elem.nodeName.toLowerCase() ];

			if ( match ) {
				return !(match === true || elem.getAttribute("classid") !== match);
			}
		}

		return true;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var parts, part, attr, name, l,
			elem = this[0],
			i = 0,
			data = null;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					attr = elem.attributes;
					for ( l = attr.length; i < l; i++ ) {
						name = attr[i].name;

						if ( name.indexOf( "data-" ) === 0 ) {
							name = jQuery.camelCase( name.substring(5) );

							dataAttr( elem, name, data[ name ] );
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		parts = key.split( ".", 2 );
		parts[1] = parts[1] ? "." + parts[1] : "";
		part = parts[1] + "!";

		return jQuery.access( this, function( value ) {

			if ( value === undefined ) {
				data = this.triggerHandler( "getData" + part, [ parts[0] ] );

				// Try to fetch any internally stored data first
				if ( data === undefined && elem ) {
					data = jQuery.data( elem, key );
					data = dataAttr( elem, key, data );
				}

				return data === undefined && parts[1] ?
					this.data( parts[0] ) :
					data;
			}

			parts[1] = value;
			this.each(function() {
				var self = jQuery( this );

				self.triggerHandler( "setData" + part, parts );
				jQuery.data( this, key, value );
				self.triggerHandler( "changeData" + part, parts );
			});
		}, null, value, arguments.length > 1, null, false );
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
				data === "false" ? false :
				data === "null" ? null :
				jQuery.isNumeric( data ) ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	for ( var name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}




function handleQueueMarkDefer( elem, type, src ) {
	var deferDataKey = type + "defer",
		queueDataKey = type + "queue",
		markDataKey = type + "mark",
		defer = jQuery._data( elem, deferDataKey );
	if ( defer &&
		( src === "queue" || !jQuery._data(elem, queueDataKey) ) &&
		( src === "mark" || !jQuery._data(elem, markDataKey) ) ) {
		// Give room for hard-coded callbacks to fire first
		// and eventually mark/queue something else on the element
		setTimeout( function() {
			if ( !jQuery._data( elem, queueDataKey ) &&
				!jQuery._data( elem, markDataKey ) ) {
				jQuery.removeData( elem, deferDataKey, true );
				defer.fire();
			}
		}, 0 );
	}
}

jQuery.extend({

	_mark: function( elem, type ) {
		if ( elem ) {
			type = ( type || "fx" ) + "mark";
			jQuery._data( elem, type, (jQuery._data( elem, type ) || 0) + 1 );
		}
	},

	_unmark: function( force, elem, type ) {
		if ( force !== true ) {
			type = elem;
			elem = force;
			force = false;
		}
		if ( elem ) {
			type = type || "fx";
			var key = type + "mark",
				count = force ? 0 : ( (jQuery._data( elem, key ) || 1) - 1 );
			if ( count ) {
				jQuery._data( elem, key, count );
			} else {
				jQuery.removeData( elem, key, true );
				handleQueueMarkDefer( elem, type, "mark" );
			}
		}
	},

	queue: function( elem, type, data ) {
		var q;
		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			q = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !q || jQuery.isArray(data) ) {
					q = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					q.push( data );
				}
			}
			return q || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			fn = queue.shift(),
			hooks = {};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
		}

		if ( fn ) {
			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			jQuery._data( elem, type + ".run", hooks );
			fn.call( elem, function() {
				jQuery.dequeue( elem, type );
			}, hooks );
		}

		if ( !queue.length ) {
			jQuery.removeData( elem, type + "queue " + type + ".run", true );
			handleQueueMarkDefer( elem, type, "queue" );
		}
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, object ) {
		if ( typeof type !== "string" ) {
			object = type;
			type = undefined;
		}
		type = type || "fx";
		var defer = jQuery.Deferred(),
			elements = this,
			i = elements.length,
			count = 1,
			deferDataKey = type + "defer",
			queueDataKey = type + "queue",
			markDataKey = type + "mark",
			tmp;
		function resolve() {
			if ( !( --count ) ) {
				defer.resolveWith( elements, [ elements ] );
			}
		}
		while( i-- ) {
			if (( tmp = jQuery.data( elements[ i ], deferDataKey, undefined, true ) ||
					( jQuery.data( elements[ i ], queueDataKey, undefined, true ) ||
						jQuery.data( elements[ i ], markDataKey, undefined, true ) ) &&
					jQuery.data( elements[ i ], deferDataKey, jQuery.Callbacks( "once memory" ), true ) )) {
				count++;
				tmp.add( resolve );
			}
		}
		resolve();
		return defer.promise( object );
	}
});




var rclass = /[\n\t\r]/g,
	rspace = /\s+/,
	rreturn = /\r/g,
	rtype = /^(?:button|input)$/i,
	rfocusable = /^(?:button|input|object|select|textarea)$/i,
	rclickable = /^a(?:rea)?$/i,
	rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
	getSetAttribute = jQuery.support.getSetAttribute,
	nodeHook, boolHook, fixSpecified;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classNames, i, l, elem,
			setClass, c, cl;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call(this, j, this.className) );
			});
		}

		if ( value && typeof value === "string" ) {
			classNames = value.split( rspace );

			for ( i = 0, l = this.length; i < l; i++ ) {
				elem = this[ i ];

				if ( elem.nodeType === 1 ) {
					if ( !elem.className && classNames.length === 1 ) {
						elem.className = value;

					} else {
						setClass = " " + elem.className + " ";

						for ( c = 0, cl = classNames.length; c < cl; c++ ) {
							if ( !~setClass.indexOf( " " + classNames[ c ] + " " ) ) {
								setClass += classNames[ c ] + " ";
							}
						}
						elem.className = jQuery.trim( setClass );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classNames, i, l, elem, className, c, cl;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call(this, j, this.className) );
			});
		}

		if ( (value && typeof value === "string") || value === undefined ) {
			classNames = ( value || "" ).split( rspace );

			for ( i = 0, l = this.length; i < l; i++ ) {
				elem = this[ i ];

				if ( elem.nodeType === 1 && elem.className ) {
					if ( value ) {
						className = (" " + elem.className + " ").replace( rclass, " " );
						for ( c = 0, cl = classNames.length; c < cl; c++ ) {
							className = className.replace(" " + classNames[ c ] + " ", " ");
						}
						elem.className = jQuery.trim( className );

					} else {
						elem.className = "";
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isBool = typeof stateVal === "boolean";

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					state = stateVal,
					classNames = value.split( rspace );

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space seperated list
					state = isBool ? state : !self.hasClass( className );
					self[ state ? "addClass" : "removeClass" ]( className );
				}

			} else if ( type === "undefined" || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// toggle whole className
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) > -1 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var self = jQuery(this), val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, self.val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// attributes.value is undefined in Blackberry 4.7 but
				// uses .value. See #6932
				var val = elem.attributes.value;
				return !val || val.specified ? elem.value : elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, i, max, option,
					index = elem.selectedIndex,
					values = [],
					options = elem.options,
					one = elem.type === "select-one";

				// Nothing was selected
				if ( index < 0 ) {
					return null;
				}

				// Loop through all the selected options
				i = one ? index : 0;
				max = one ? index + 1 : options.length;
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// Don't return options that are disabled or in a disabled optgroup
					if ( option.selected && (jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null) &&
							(!option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" )) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				// Fixes Bug #2551 -- select.val() broken in IE after form.reset()
				if ( one && !values.length && options.length ) {
					return jQuery( options[ index ] ).val();
				}

				return values;
			},

			set: function( elem, value ) {
				var values = jQuery.makeArray( value );

				jQuery(elem).find("option").each(function() {
					this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
				});

				if ( !values.length ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attrFn: {
		val: true,
		css: true,
		html: true,
		text: true,
		data: true,
		width: true,
		height: true,
		offset: true
	},

	attr: function( elem, name, value, pass ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( pass && name in jQuery.attrFn ) {
			return jQuery( elem )[ name ]( value );
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( notxml ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] || ( rboolean.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;

			} else if ( hooks && "set" in hooks && notxml && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, "" + value );
				return value;
			}

		} else if ( hooks && "get" in hooks && notxml && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {

			ret = elem.getAttribute( name );

			// Non-existent attributes return null, we normalize to undefined
			return ret === null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var propName, attrNames, name, l, isBool,
			i = 0;

		if ( value && elem.nodeType === 1 ) {
			attrNames = value.toLowerCase().split( rspace );
			l = attrNames.length;

			for ( ; i < l; i++ ) {
				name = attrNames[ i ];

				if ( name ) {
					propName = jQuery.propFix[ name ] || name;
					isBool = rboolean.test( name );

					// See #9699 for explanation of this approach (setting first, then removal)
					// Do not do this for boolean attributes (see #10870)
					if ( !isBool ) {
						jQuery.attr( elem, name, "" );
					}
					elem.removeAttribute( getSetAttribute ? name : propName );

					// Set corresponding property to false for boolean attributes
					if ( isBool && propName in elem ) {
						elem[ propName ] = false;
					}
				}
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				// We can't allow the type property to be changed (since it causes problems in IE)
				if ( rtype.test( elem.nodeName ) && elem.parentNode ) {
					jQuery.error( "type property can't be changed" );
				} else if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to it's default in case type is set after value
					// This is for element creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		},
		// Use the value property for back compat
		// Use the nodeHook for button elements in IE6/7 (#1954)
		value: {
			get: function( elem, name ) {
				if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
					return nodeHook.get( elem, name );
				}
				return name in elem ?
					elem.value :
					null;
			},
			set: function( elem, value, name ) {
				if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
					return nodeHook.set( elem, value, name );
				}
				// Does not return so that setAttribute is also used
				elem.value = value;
			}
		}
	},

	propFix: {
		tabindex: "tabIndex",
		readonly: "readOnly",
		"for": "htmlFor",
		"class": "className",
		maxlength: "maxLength",
		cellspacing: "cellSpacing",
		cellpadding: "cellPadding",
		rowspan: "rowSpan",
		colspan: "colSpan",
		usemap: "useMap",
		frameborder: "frameBorder",
		contenteditable: "contentEditable"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				return ( elem[ name ] = value );
			}

		} else {
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
				return ret;

			} else {
				return elem[ name ];
			}
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				var attributeNode = elem.getAttributeNode("tabindex");

				return attributeNode && attributeNode.specified ?
					parseInt( attributeNode.value, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						undefined;
			}
		}
	}
});

// Add the tabIndex propHook to attrHooks for back-compat (different case is intentional)
jQuery.attrHooks.tabindex = jQuery.propHooks.tabIndex;

// Hook for boolean attributes
boolHook = {
	get: function( elem, name ) {
		// Align boolean attributes with corresponding properties
		// Fall back to attribute presence where some booleans are not supported
		var attrNode,
			property = jQuery.prop( elem, name );
		return property === true || typeof property !== "boolean" && ( attrNode = elem.getAttributeNode(name) ) && attrNode.nodeValue !== false ?
			name.toLowerCase() :
			undefined;
	},
	set: function( elem, value, name ) {
		var propName;
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			// value is true since we know at this point it's type boolean and not false
			// Set boolean attributes to the same name and set the DOM property
			propName = jQuery.propFix[ name ] || name;
			if ( propName in elem ) {
				// Only set the IDL specifically if it already exists on the element
				elem[ propName ] = true;
			}

			elem.setAttribute( name, name.toLowerCase() );
		}
		return name;
	}
};

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	fixSpecified = {
		name: true,
		id: true,
		coords: true
	};

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret;
			ret = elem.getAttributeNode( name );
			return ret && ( fixSpecified[ name ] ? ret.nodeValue !== "" : ret.specified ) ?
				ret.nodeValue :
				undefined;
		},
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				ret = document.createAttribute( name );
				elem.setAttributeNode( ret );
			}
			return ( ret.nodeValue = value + "" );
		}
	};

	// Apply the nodeHook to tabindex
	jQuery.attrHooks.tabindex.set = nodeHook.set;

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		});
	});

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		get: nodeHook.get,
		set: function( elem, value, name ) {
			if ( value === "" ) {
				value = "false";
			}
			nodeHook.set( elem, value, name );
		}
	};
}


// Some attributes require a special call on IE
if ( !jQuery.support.hrefNormalized ) {
	jQuery.each([ "href", "src", "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			get: function( elem ) {
				var ret = elem.getAttribute( name, 2 );
				return ret === null ? undefined : ret;
			}
		});
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Normalize to lowercase since IE uppercases css property names
			return elem.style.cssText.toLowerCase() || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = "" + value );
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = jQuery.extend( jQuery.propHooks.selected, {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	});
}

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
if ( !jQuery.support.checkOn ) {
	jQuery.each([ "radio", "checkbox" ], function() {
		jQuery.valHooks[ this ] = {
			get: function( elem ) {
				// Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
				return elem.getAttribute("value") === null ? "on" : elem.value;
			}
		};
	});
}
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = jQuery.extend( jQuery.valHooks[ this ], {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	});
});




var rformElems = /^(?:textarea|input|select)$/i,
	rtypenamespace = /^([^\.]*)?(?:\.(.+))?$/,
	rhoverHack = /(?:^|\s)hover(\.\S+)?\b/,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rquickIs = /^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/,
	quickParse = function( selector ) {
		var quick = rquickIs.exec( selector );
		if ( quick ) {
			//   0  1    2   3
			// [ _, tag, id, class ]
			quick[1] = ( quick[1] || "" ).toLowerCase();
			quick[3] = quick[3] && new RegExp( "(?:^|\\s)" + quick[3] + "(?:\\s|$)" );
		}
		return quick;
	},
	quickIs = function( elem, m ) {
		var attrs = elem.attributes || {};
		return (
			(!m[1] || elem.nodeName.toLowerCase() === m[1]) &&
			(!m[2] || (attrs.id || {}).value === m[2]) &&
			(!m[3] || m[3].test( (attrs[ "class" ] || {}).value ))
		);
	},
	hoverHack = function( events ) {
		return jQuery.event.special.hover ? events : events.replace( rhoverHack, "mouseenter$1 mouseleave$1" );
	};

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	add: function( elem, types, handler, data, selector ) {

		var elemData, eventHandle, events,
			t, tns, type, namespaces, handleObj,
			handleObjIn, quick, handlers, special;

		// Don't attach events to noData or text/comment nodes (allow plain objects tho)
		if ( elem.nodeType === 3 || elem.nodeType === 8 || !types || !handler || !(elemData = jQuery._data( elem )) ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		events = elemData.events;
		if ( !events ) {
			elemData.events = events = {};
		}
		eventHandle = elemData.handle;
		if ( !eventHandle ) {
			elemData.handle = eventHandle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		// jQuery(...).bind("mouseover mouseout", fn);
		types = jQuery.trim( hoverHack(types) ).split( " " );
		for ( t = 0; t < types.length; t++ ) {

			tns = rtypenamespace.exec( types[t] ) || [];
			type = tns[1];
			namespaces = ( tns[2] || "" ).split( "." ).sort();

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: tns[1],
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				quick: selector && quickParse( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			handlers = events[ type ];
			if ( !handlers ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	global: {},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var elemData = jQuery.hasData( elem ) && jQuery._data( elem ),
			t, tns, type, origType, namespaces, origCount,
			j, events, special, handle, eventType, handleObj;

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = jQuery.trim( hoverHack( types || "" ) ).split(" ");
		for ( t = 0; t < types.length; t++ ) {
			tns = rtypenamespace.exec( types[t] ) || [];
			type = origType = tns[1];
			namespaces = tns[2];

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector? special.delegateType : special.bindType ) || type;
			eventType = events[ type ] || [];
			origCount = eventType.length;
			namespaces = namespaces ? new RegExp("(^|\\.)" + namespaces.split(".").sort().join("\\.(?:.*\\.)?") + "(\\.|$)") : null;

			// Remove matching events
			for ( j = 0; j < eventType.length; j++ ) {
				handleObj = eventType[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					 ( !handler || handler.guid === handleObj.guid ) &&
					 ( !namespaces || namespaces.test( handleObj.namespace ) ) &&
					 ( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					eventType.splice( j--, 1 );

					if ( handleObj.selector ) {
						eventType.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( eventType.length === 0 && origCount !== eventType.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			handle = elemData.handle;
			if ( handle ) {
				handle.elem = null;
			}

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery.removeData( elem, [ "events", "handle" ], true );
		}
	},

	// Events that are safe to short-circuit if no handlers are attached.
	// Native DOM events should not be added, they may have inline handlers.
	customEvent: {
		"getData": true,
		"setData": true,
		"changeData": true
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		// Don't do events on text and comment nodes
		if ( elem && (elem.nodeType === 3 || elem.nodeType === 8) ) {
			return;
		}

		// Event object or event type
		var type = event.type || event,
			namespaces = [],
			cache, exclusive, i, cur, old, ontype, special, handle, eventPath, bubbleType;

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "!" ) >= 0 ) {
			// Exclusive events trigger only for the exact event (no namespaces)
			type = type.slice(0, -1);
			exclusive = true;
		}

		if ( type.indexOf( "." ) >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}

		if ( (!elem || jQuery.event.customEvent[ type ]) && !jQuery.event.global[ type ] ) {
			// No jQuery handlers for this event type, and it can't have inline handlers
			return;
		}

		// Caller can pass in an Event, Object, or just an event type string
		event = typeof event === "object" ?
			// jQuery.Event object
			event[ jQuery.expando ] ? event :
			// Object literal
			new jQuery.Event( type, event ) :
			// Just the event type (string)
			new jQuery.Event( type );

		event.type = type;
		event.isTrigger = true;
		event.exclusive = exclusive;
		event.namespace = namespaces.join( "." );
		event.namespace_re = event.namespace? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.)?") + "(\\.|$)") : null;
		ontype = type.indexOf( ":" ) < 0 ? "on" + type : "";

		// Handle a global trigger
		if ( !elem ) {

			// TODO: Stop taunting the data cache; remove global events and always attach to document
			cache = jQuery.cache;
			for ( i in cache ) {
				if ( cache[ i ].events && cache[ i ].events[ type ] ) {
					jQuery.event.trigger( event, data, cache[ i ].handle.elem, true );
				}
			}
			return;
		}

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data != null ? jQuery.makeArray( data ) : [];
		data.unshift( event );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		eventPath = [[ elem, special.bindType || type ]];
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			cur = rfocusMorph.test( bubbleType + type ) ? elem : elem.parentNode;
			old = null;
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push([ cur, bubbleType ]);
				old = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( old && old === elem.ownerDocument ) {
				eventPath.push([ old.defaultView || old.parentWindow || window, bubbleType ]);
			}
		}

		// Fire handlers on the event path
		for ( i = 0; i < eventPath.length && !event.isPropagationStopped(); i++ ) {

			cur = eventPath[i][0];
			event.type = eventPath[i][1];

			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}
			// Note that this is a bare JS function and not a jQuery handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( elem.ownerDocument, data ) === false) &&
				!(type === "click" && jQuery.nodeName( elem, "a" )) && jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				// IE<9 dies on focus/blur to hidden element (#1486)
				if ( ontype && elem[ type ] && ((type !== "focus" && type !== "blur") || event.target.offsetWidth !== 0) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					old = elem[ ontype ];

					if ( old ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					elem[ type ]();
					jQuery.event.triggered = undefined;

					if ( old ) {
						elem[ ontype ] = old;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event || window.event );

		var handlers = ( (jQuery._data( this, "events" ) || {} )[ event.type ] || []),
			delegateCount = handlers.delegateCount,
			args = [].slice.call( arguments, 0 ),
			run_all = !event.exclusive && !event.namespace,
			special = jQuery.event.special[ event.type ] || {},
			handlerQueue = [],
			i, j, cur, jqcur, ret, selMatch, matched, matches, handleObj, sel, related;

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers that should run if there are delegated events
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && !(event.button && event.type === "click") ) {

			// Pregenerate a single jQuery object for reuse with .is()
			jqcur = jQuery(this);
			jqcur.context = this.ownerDocument || this;

			for ( cur = event.target; cur != this; cur = cur.parentNode || this ) {

				// Don't process events on disabled elements (#6911, #8165)
				if ( cur.disabled !== true ) {
					selMatch = {};
					matches = [];
					jqcur[0] = cur;
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];
						sel = handleObj.selector;

						if ( selMatch[ sel ] === undefined ) {
							selMatch[ sel ] = (
								handleObj.quick ? quickIs( cur, handleObj.quick ) : jqcur.is( sel )
							);
						}
						if ( selMatch[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, matches: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( handlers.length > delegateCount ) {
			handlerQueue.push({ elem: this, matches: handlers.slice( delegateCount ) });
		}

		// Run delegates first; they may want to stop propagation beneath us
		for ( i = 0; i < handlerQueue.length && !event.isPropagationStopped(); i++ ) {
			matched = handlerQueue[ i ];
			event.currentTarget = matched.elem;

			for ( j = 0; j < matched.matches.length && !event.isImmediatePropagationStopped(); j++ ) {
				handleObj = matched.matches[ j ];

				// Triggered event must either 1) be non-exclusive and have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( run_all || (!event.namespace && !handleObj.namespace) || event.namespace_re && event.namespace_re.test( handleObj.namespace ) ) {

					event.data = handleObj.data;
					event.handleObj = handleObj;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						event.result = ret;
						if ( ret === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	// *** attrChange attrName relatedNode srcElement  are not normalized, non-W3C, deprecated, will be removed in 1.8 ***
	props: "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var eventDoc, doc, body,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop,
			originalEvent = event,
			fixHook = jQuery.event.fixHooks[ event.type ] || {},
			copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = jQuery.Event( originalEvent );

		for ( i = copy.length; i; ) {
			prop = copy[ --i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Fix target property, if necessary (#1925, IE 6/7/8 & Safari2)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Target should not be a text node (#504, Safari)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// For mouse/key events; add metaKey if it's not there (#3368, IE6/7/8)
		if ( event.metaKey === undefined ) {
			event.metaKey = event.ctrlKey;
		}

		return fixHook.filter? fixHook.filter( event, originalEvent ) : event;
	},

	special: {
		ready: {
			// Make sure the ready event is setup
			setup: jQuery.bindReady
		},

		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},

		focus: {
			delegateType: "focusin"
		},
		blur: {
			delegateType: "focusout"
		},

		beforeunload: {
			setup: function( data, namespaces, eventHandle ) {
				// We only want to do this special case on windows
				if ( jQuery.isWindow( this ) ) {
					this.onbeforeunload = eventHandle;
				}
			},

			teardown: function( namespaces, eventHandle ) {
				if ( this.onbeforeunload === eventHandle ) {
					this.onbeforeunload = null;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{ type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

// Some plugins are using, but it's undocumented/deprecated and will be removed.
// The 1.7 special event interface should provide all the hooks needed now.
jQuery.event.handle = jQuery.event.dispatch;

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		if ( elem.detachEvent ) {
			elem.detachEvent( "on" + type, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

function returnFalse() {
	return false;
}
function returnTrue() {
	return true;
}

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	preventDefault: function() {
		this.isDefaultPrevented = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}

		// if preventDefault exists run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// otherwise set the returnValue property of the original event to false (IE)
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		this.isPropagationStopped = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}
		// if stopPropagation exists run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}
		// otherwise set the cancelBubble property of the original event to true (IE)
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	},
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj,
				selector = handleObj.selector,
				ret;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !form._submit_attached ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submit_bubble = true;
					});
					form._submit_attached = true;
				}
			});
			// return undefined since we don't need an event listener
		},
		
		postDispatch: function( event ) {
			// If form was submitted by the user, bubble the event up the tree
			if ( event._submit_bubble ) {
				delete event._submit_bubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event, true );
				}
			}
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
							jQuery.event.simulate( "change", this, event, true );
						}
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !elem._change_attached ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					elem._change_attached = true;
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var origFn, type;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) { // && selector != null
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			var handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( var type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	live: function( types, data, fn ) {
		jQuery( this.context ).on( types, this.selector, data, fn );
		return this;
	},
	die: function( types, fn ) {
		jQuery( this.context ).off( types, this.selector || "**", fn );
		return this;
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length == 1? this.off( selector, "**" ) : this.off( types, selector, fn );
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		if ( this[0] ) {
			return jQuery.event.trigger( type, data, this[0], true );
		}
	},

	toggle: function( fn ) {
		// Save reference to arguments for access in closure
		var args = arguments,
			guid = fn.guid || jQuery.guid++,
			i = 0,
			toggler = function( event ) {
				// Figure out which function to execute
				var lastToggle = ( jQuery._data( this, "lastToggle" + fn.guid ) || 0 ) % i;
				jQuery._data( this, "lastToggle" + fn.guid, lastToggle + 1 );

				// Make sure that clicks stop
				event.preventDefault();

				// and execute the function
				return args[ lastToggle ].apply( this, arguments ) || false;
			};

		// link all the functions, so any of them can unbind this click handler
		toggler.guid = guid;
		while ( i < args.length ) {
			args[ i++ ].guid = guid;
		}

		return this.click( toggler );
	},

	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
});

jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		if ( fn == null ) {
			fn = data;
			data = null;
		}

		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};

	if ( jQuery.attrFn ) {
		jQuery.attrFn[ name ] = true;
	}

	if ( rkeyEvent.test( name ) ) {
		jQuery.event.fixHooks[ name ] = jQuery.event.keyHooks;
	}

	if ( rmouseEvent.test( name ) ) {
		jQuery.event.fixHooks[ name ] = jQuery.event.mouseHooks;
	}
});



/*!
 * Sizzle CSS Selector Engine
 *  Copyright 2011, The Dojo Foundation
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://sizzlejs.com/
 */
(function(){

var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
	expando = "sizcache" + (Math.random() + '').replace('.', ''),
	done = 0,
	toString = Object.prototype.toString,
	hasDuplicate = false,
	baseHasDuplicate = true,
	rBackslash = /\\/g,
	rReturn = /\r\n/g,
	rNonWord = /\W/;

// Here we check if the JavaScript engine is using some sort of
// optimization where it does not always call our comparision
// function. If that is the case, discard the hasDuplicate value.
//   Thus far that includes Google Chrome.
[0, 0].sort(function() {
	baseHasDuplicate = false;
	return 0;
});

var Sizzle = function( selector, context, results, seed ) {
	results = results || [];
	context = context || document;

	var origContext = context;

	if ( context.nodeType !== 1 && context.nodeType !== 9 ) {
		return [];
	}

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	var m, set, checkSet, extra, ret, cur, pop, i,
		prune = true,
		contextXML = Sizzle.isXML( context ),
		parts = [],
		soFar = selector;

	// Reset the position of the chunker regexp (start from head)
	do {
		chunker.exec( "" );
		m = chunker.exec( soFar );

		if ( m ) {
			soFar = m[3];

			parts.push( m[1] );

			if ( m[2] ) {
				extra = m[3];
				break;
			}
		}
	} while ( m );

	if ( parts.length > 1 && origPOS.exec( selector ) ) {

		if ( parts.length === 2 && Expr.relative[ parts[0] ] ) {
			set = posProcess( parts[0] + parts[1], context, seed );

		} else {
			set = Expr.relative[ parts[0] ] ?
				[ context ] :
				Sizzle( parts.shift(), context );

			while ( parts.length ) {
				selector = parts.shift();

				if ( Expr.relative[ selector ] ) {
					selector += parts.shift();
				}

				set = posProcess( selector, set, seed );
			}
		}

	} else {
		// Take a shortcut and set the context if the root selector is an ID
		// (but not if it'll be faster if the inner selector is an ID)
		if ( !seed && parts.length > 1 && context.nodeType === 9 && !contextXML &&
				Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1]) ) {

			ret = Sizzle.find( parts.shift(), context, contextXML );
			context = ret.expr ?
				Sizzle.filter( ret.expr, ret.set )[0] :
				ret.set[0];
		}

		if ( context ) {
			ret = seed ?
				{ expr: parts.pop(), set: makeArray(seed) } :
				Sizzle.find( parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML );

			set = ret.expr ?
				Sizzle.filter( ret.expr, ret.set ) :
				ret.set;

			if ( parts.length > 0 ) {
				checkSet = makeArray( set );

			} else {
				prune = false;
			}

			while ( parts.length ) {
				cur = parts.pop();
				pop = cur;

				if ( !Expr.relative[ cur ] ) {
					cur = "";
				} else {
					pop = parts.pop();
				}

				if ( pop == null ) {
					pop = context;
				}

				Expr.relative[ cur ]( checkSet, pop, contextXML );
			}

		} else {
			checkSet = parts = [];
		}
	}

	if ( !checkSet ) {
		checkSet = set;
	}

	if ( !checkSet ) {
		Sizzle.error( cur || selector );
	}

	if ( toString.call(checkSet) === "[object Array]" ) {
		if ( !prune ) {
			results.push.apply( results, checkSet );

		} else if ( context && context.nodeType === 1 ) {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && Sizzle.contains(context, checkSet[i])) ) {
					results.push( set[i] );
				}
			}

		} else {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && checkSet[i].nodeType === 1 ) {
					results.push( set[i] );
				}
			}
		}

	} else {
		makeArray( checkSet, results );
	}

	if ( extra ) {
		Sizzle( extra, origContext, results, seed );
		Sizzle.uniqueSort( results );
	}

	return results;
};

Sizzle.uniqueSort = function( results ) {
	if ( sortOrder ) {
		hasDuplicate = baseHasDuplicate;
		results.sort( sortOrder );

		if ( hasDuplicate ) {
			for ( var i = 1; i < results.length; i++ ) {
				if ( results[i] === results[ i - 1 ] ) {
					results.splice( i--, 1 );
				}
			}
		}
	}

	return results;
};

Sizzle.matches = function( expr, set ) {
	return Sizzle( expr, null, null, set );
};

Sizzle.matchesSelector = function( node, expr ) {
	return Sizzle( expr, null, null, [node] ).length > 0;
};

Sizzle.find = function( expr, context, isXML ) {
	var set, i, len, match, type, left;

	if ( !expr ) {
		return [];
	}

	for ( i = 0, len = Expr.order.length; i < len; i++ ) {
		type = Expr.order[i];

		if ( (match = Expr.leftMatch[ type ].exec( expr )) ) {
			left = match[1];
			match.splice( 1, 1 );

			if ( left.substr( left.length - 1 ) !== "\\" ) {
				match[1] = (match[1] || "").replace( rBackslash, "" );
				set = Expr.find[ type ]( match, context, isXML );

				if ( set != null ) {
					expr = expr.replace( Expr.match[ type ], "" );
					break;
				}
			}
		}
	}

	if ( !set ) {
		set = typeof context.getElementsByTagName !== "undefined" ?
			context.getElementsByTagName( "*" ) :
			[];
	}

	return { set: set, expr: expr };
};

Sizzle.filter = function( expr, set, inplace, not ) {
	var match, anyFound,
		type, found, item, filter, left,
		i, pass,
		old = expr,
		result = [],
		curLoop = set,
		isXMLFilter = set && set[0] && Sizzle.isXML( set[0] );

	while ( expr && set.length ) {
		for ( type in Expr.filter ) {
			if ( (match = Expr.leftMatch[ type ].exec( expr )) != null && match[2] ) {
				filter = Expr.filter[ type ];
				left = match[1];

				anyFound = false;

				match.splice(1,1);

				if ( left.substr( left.length - 1 ) === "\\" ) {
					continue;
				}

				if ( curLoop === result ) {
					result = [];
				}

				if ( Expr.preFilter[ type ] ) {
					match = Expr.preFilter[ type ]( match, curLoop, inplace, result, not, isXMLFilter );

					if ( !match ) {
						anyFound = found = true;

					} else if ( match === true ) {
						continue;
					}
				}

				if ( match ) {
					for ( i = 0; (item = curLoop[i]) != null; i++ ) {
						if ( item ) {
							found = filter( item, match, i, curLoop );
							pass = not ^ found;

							if ( inplace && found != null ) {
								if ( pass ) {
									anyFound = true;

								} else {
									curLoop[i] = false;
								}

							} else if ( pass ) {
								result.push( item );
								anyFound = true;
							}
						}
					}
				}

				if ( found !== undefined ) {
					if ( !inplace ) {
						curLoop = result;
					}

					expr = expr.replace( Expr.match[ type ], "" );

					if ( !anyFound ) {
						return [];
					}

					break;
				}
			}
		}

		// Improper expression
		if ( expr === old ) {
			if ( anyFound == null ) {
				Sizzle.error( expr );

			} else {
				break;
			}
		}

		old = expr;
	}

	return curLoop;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Utility function for retreiving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
var getText = Sizzle.getText = function( elem ) {
    var i, node,
		nodeType = elem.nodeType,
		ret = "";

	if ( nodeType ) {
		if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
			// Use textContent || innerText for elements
			if ( typeof elem.textContent === 'string' ) {
				return elem.textContent;
			} else if ( typeof elem.innerText === 'string' ) {
				// Replace IE's carriage returns
				return elem.innerText.replace( rReturn, '' );
			} else {
				// Traverse it's children
				for ( elem = elem.firstChild; elem; elem = elem.nextSibling) {
					ret += getText( elem );
				}
			}
		} else if ( nodeType === 3 || nodeType === 4 ) {
			return elem.nodeValue;
		}
	} else {

		// If no nodeType, this is expected to be an array
		for ( i = 0; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			if ( node.nodeType !== 8 ) {
				ret += getText( node );
			}
		}
	}
	return ret;
};

var Expr = Sizzle.selectors = {
	order: [ "ID", "NAME", "TAG" ],

	match: {
		ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
		ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
		TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
		CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
		POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
		PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
	},

	leftMatch: {},

	attrMap: {
		"class": "className",
		"for": "htmlFor"
	},

	attrHandle: {
		href: function( elem ) {
			return elem.getAttribute( "href" );
		},
		type: function( elem ) {
			return elem.getAttribute( "type" );
		}
	},

	relative: {
		"+": function(checkSet, part){
			var isPartStr = typeof part === "string",
				isTag = isPartStr && !rNonWord.test( part ),
				isPartStrNotTag = isPartStr && !isTag;

			if ( isTag ) {
				part = part.toLowerCase();
			}

			for ( var i = 0, l = checkSet.length, elem; i < l; i++ ) {
				if ( (elem = checkSet[i]) ) {
					while ( (elem = elem.previousSibling) && elem.nodeType !== 1 ) {}

					checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ?
						elem || false :
						elem === part;
				}
			}

			if ( isPartStrNotTag ) {
				Sizzle.filter( part, checkSet, true );
			}
		},

		">": function( checkSet, part ) {
			var elem,
				isPartStr = typeof part === "string",
				i = 0,
				l = checkSet.length;

			if ( isPartStr && !rNonWord.test( part ) ) {
				part = part.toLowerCase();

				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						var parent = elem.parentNode;
						checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
					}
				}

			} else {
				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						checkSet[i] = isPartStr ?
							elem.parentNode :
							elem.parentNode === part;
					}
				}

				if ( isPartStr ) {
					Sizzle.filter( part, checkSet, true );
				}
			}
		},

		"": function(checkSet, part, isXML){
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !rNonWord.test( part ) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "parentNode", part, doneName, checkSet, nodeCheck, isXML );
		},

		"~": function( checkSet, part, isXML ) {
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !rNonWord.test( part ) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "previousSibling", part, doneName, checkSet, nodeCheck, isXML );
		}
	},

	find: {
		ID: function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		},

		NAME: function( match, context ) {
			if ( typeof context.getElementsByName !== "undefined" ) {
				var ret = [],
					results = context.getElementsByName( match[1] );

				for ( var i = 0, l = results.length; i < l; i++ ) {
					if ( results[i].getAttribute("name") === match[1] ) {
						ret.push( results[i] );
					}
				}

				return ret.length === 0 ? null : ret;
			}
		},

		TAG: function( match, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( match[1] );
			}
		}
	},
	preFilter: {
		CLASS: function( match, curLoop, inplace, result, not, isXML ) {
			match = " " + match[1].replace( rBackslash, "" ) + " ";

			if ( isXML ) {
				return match;
			}

			for ( var i = 0, elem; (elem = curLoop[i]) != null; i++ ) {
				if ( elem ) {
					if ( not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n\r]/g, " ").indexOf(match) >= 0) ) {
						if ( !inplace ) {
							result.push( elem );
						}

					} else if ( inplace ) {
						curLoop[i] = false;
					}
				}
			}

			return false;
		},

		ID: function( match ) {
			return match[1].replace( rBackslash, "" );
		},

		TAG: function( match, curLoop ) {
			return match[1].replace( rBackslash, "" ).toLowerCase();
		},

		CHILD: function( match ) {
			if ( match[1] === "nth" ) {
				if ( !match[2] ) {
					Sizzle.error( match[0] );
				}

				match[2] = match[2].replace(/^\+|\s*/g, '');

				// parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
				var test = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(
					match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" ||
					!/\D/.test( match[2] ) && "0n+" + match[2] || match[2]);

				// calculate the numbers (first)n+(last) including if they are negative
				match[2] = (test[1] + (test[2] || 1)) - 0;
				match[3] = test[3] - 0;
			}
			else if ( match[2] ) {
				Sizzle.error( match[0] );
			}

			// TODO: Move to normal caching system
			match[0] = done++;

			return match;
		},

		ATTR: function( match, curLoop, inplace, result, not, isXML ) {
			var name = match[1] = match[1].replace( rBackslash, "" );

			if ( !isXML && Expr.attrMap[name] ) {
				match[1] = Expr.attrMap[name];
			}

			// Handle if an un-quoted value was used
			match[4] = ( match[4] || match[5] || "" ).replace( rBackslash, "" );

			if ( match[2] === "~=" ) {
				match[4] = " " + match[4] + " ";
			}

			return match;
		},

		PSEUDO: function( match, curLoop, inplace, result, not ) {
			if ( match[1] === "not" ) {
				// If we're dealing with a complex expression, or a simple one
				if ( ( chunker.exec(match[3]) || "" ).length > 1 || /^\w/.test(match[3]) ) {
					match[3] = Sizzle(match[3], null, null, curLoop);

				} else {
					var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);

					if ( !inplace ) {
						result.push.apply( result, ret );
					}

					return false;
				}

			} else if ( Expr.match.POS.test( match[0] ) || Expr.match.CHILD.test( match[0] ) ) {
				return true;
			}

			return match;
		},

		POS: function( match ) {
			match.unshift( true );

			return match;
		}
	},

	filters: {
		enabled: function( elem ) {
			return elem.disabled === false && elem.type !== "hidden";
		},

		disabled: function( elem ) {
			return elem.disabled === true;
		},

		checked: function( elem ) {
			return elem.checked === true;
		},

		selected: function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		parent: function( elem ) {
			return !!elem.firstChild;
		},

		empty: function( elem ) {
			return !elem.firstChild;
		},

		has: function( elem, i, match ) {
			return !!Sizzle( match[3], elem ).length;
		},

		header: function( elem ) {
			return (/h\d/i).test( elem.nodeName );
		},

		text: function( elem ) {
			var attr = elem.getAttribute( "type" ), type = elem.type;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" && "text" === type && ( attr === type || attr === null );
		},

		radio: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "radio" === elem.type;
		},

		checkbox: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "checkbox" === elem.type;
		},

		file: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "file" === elem.type;
		},

		password: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "password" === elem.type;
		},

		submit: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && "submit" === elem.type;
		},

		image: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "image" === elem.type;
		},

		reset: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && "reset" === elem.type;
		},

		button: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && "button" === elem.type || name === "button";
		},

		input: function( elem ) {
			return (/input|select|textarea|button/i).test( elem.nodeName );
		},

		focus: function( elem ) {
			return elem === elem.ownerDocument.activeElement;
		}
	},
	setFilters: {
		first: function( elem, i ) {
			return i === 0;
		},

		last: function( elem, i, match, array ) {
			return i === array.length - 1;
		},

		even: function( elem, i ) {
			return i % 2 === 0;
		},

		odd: function( elem, i ) {
			return i % 2 === 1;
		},

		lt: function( elem, i, match ) {
			return i < match[3] - 0;
		},

		gt: function( elem, i, match ) {
			return i > match[3] - 0;
		},

		nth: function( elem, i, match ) {
			return match[3] - 0 === i;
		},

		eq: function( elem, i, match ) {
			return match[3] - 0 === i;
		}
	},
	filter: {
		PSEUDO: function( elem, match, i, array ) {
			var name = match[1],
				filter = Expr.filters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );

			} else if ( name === "contains" ) {
				return (elem.textContent || elem.innerText || getText([ elem ]) || "").indexOf(match[3]) >= 0;

			} else if ( name === "not" ) {
				var not = match[3];

				for ( var j = 0, l = not.length; j < l; j++ ) {
					if ( not[j] === elem ) {
						return false;
					}
				}

				return true;

			} else {
				Sizzle.error( name );
			}
		},

		CHILD: function( elem, match ) {
			var first, last,
				doneName, parent, cache,
				count, diff,
				type = match[1],
				node = elem;

			switch ( type ) {
				case "only":
				case "first":
					while ( (node = node.previousSibling) ) {
						if ( node.nodeType === 1 ) {
							return false;
						}
					}

					if ( type === "first" ) {
						return true;
					}

					node = elem;

					/* falls through */
				case "last":
					while ( (node = node.nextSibling) ) {
						if ( node.nodeType === 1 ) {
							return false;
						}
					}

					return true;

				case "nth":
					first = match[2];
					last = match[3];

					if ( first === 1 && last === 0 ) {
						return true;
					}

					doneName = match[0];
					parent = elem.parentNode;

					if ( parent && (parent[ expando ] !== doneName || !elem.nodeIndex) ) {
						count = 0;

						for ( node = parent.firstChild; node; node = node.nextSibling ) {
							if ( node.nodeType === 1 ) {
								node.nodeIndex = ++count;
							}
						}

						parent[ expando ] = doneName;
					}

					diff = elem.nodeIndex - last;

					if ( first === 0 ) {
						return diff === 0;

					} else {
						return ( diff % first === 0 && diff / first >= 0 );
					}
			}
		},

		ID: function( elem, match ) {
			return elem.nodeType === 1 && elem.getAttribute("id") === match;
		},

		TAG: function( elem, match ) {
			return (match === "*" && elem.nodeType === 1) || !!elem.nodeName && elem.nodeName.toLowerCase() === match;
		},

		CLASS: function( elem, match ) {
			return (" " + (elem.className || elem.getAttribute("class")) + " ")
				.indexOf( match ) > -1;
		},

		ATTR: function( elem, match ) {
			var name = match[1],
				result = Sizzle.attr ?
					Sizzle.attr( elem, name ) :
					Expr.attrHandle[ name ] ?
					Expr.attrHandle[ name ]( elem ) :
					elem[ name ] != null ?
						elem[ name ] :
						elem.getAttribute( name ),
				value = result + "",
				type = match[2],
				check = match[4];

			return result == null ?
				type === "!=" :
				!type && Sizzle.attr ?
				result != null :
				type === "=" ?
				value === check :
				type === "*=" ?
				value.indexOf(check) >= 0 :
				type === "~=" ?
				(" " + value + " ").indexOf(check) >= 0 :
				!check ?
				value && result !== false :
				type === "!=" ?
				value !== check :
				type === "^=" ?
				value.indexOf(check) === 0 :
				type === "$=" ?
				value.substr(value.length - check.length) === check :
				type === "|=" ?
				value === check || value.substr(0, check.length + 1) === check + "-" :
				false;
		},

		POS: function( elem, match, i, array ) {
			var name = match[2],
				filter = Expr.setFilters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );
			}
		}
	}
};

var origPOS = Expr.match.POS,
	fescape = function(all, num){
		return "\\" + (num - 0 + 1);
	};

for ( var type in Expr.match ) {
	Expr.match[ type ] = new RegExp( Expr.match[ type ].source + (/(?![^\[]*\])(?![^\(]*\))/.source) );
	Expr.leftMatch[ type ] = new RegExp( /(^(?:.|\r|\n)*?)/.source + Expr.match[ type ].source.replace(/\\(\d+)/g, fescape) );
}
// Expose origPOS
// "global" as in regardless of relation to brackets/parens
Expr.match.globalPOS = origPOS;

var makeArray = function( array, results ) {
	array = Array.prototype.slice.call( array, 0 );

	if ( results ) {
		results.push.apply( results, array );
		return results;
	}

	return array;
};

// Perform a simple check to determine if the browser is capable of
// converting a NodeList to an array using builtin methods.
// Also verifies that the returned array holds DOM nodes
// (which is not the case in the Blackberry browser)
try {
	Array.prototype.slice.call( document.documentElement.childNodes, 0 )[0].nodeType;

// Provide a fallback method if it does not work
} catch( e ) {
	makeArray = function( array, results ) {
		var i = 0,
			ret = results || [];

		if ( toString.call(array) === "[object Array]" ) {
			Array.prototype.push.apply( ret, array );

		} else {
			if ( typeof array.length === "number" ) {
				for ( var l = array.length; i < l; i++ ) {
					ret.push( array[i] );
				}

			} else {
				for ( ; array[i]; i++ ) {
					ret.push( array[i] );
				}
			}
		}

		return ret;
	};
}

var sortOrder, siblingCheck;

if ( document.documentElement.compareDocumentPosition ) {
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		if ( !a.compareDocumentPosition || !b.compareDocumentPosition ) {
			return a.compareDocumentPosition ? -1 : 1;
		}

		return a.compareDocumentPosition(b) & 4 ? -1 : 1;
	};

} else {
	sortOrder = function( a, b ) {
		// The nodes are identical, we can exit early
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Fallback to using sourceIndex (in IE) if it's available on both nodes
		} else if ( a.sourceIndex && b.sourceIndex ) {
			return a.sourceIndex - b.sourceIndex;
		}

		var al, bl,
			ap = [],
			bp = [],
			aup = a.parentNode,
			bup = b.parentNode,
			cur = aup;

		// If the nodes are siblings (or identical) we can do a quick check
		if ( aup === bup ) {
			return siblingCheck( a, b );

		// If no parents were found then the nodes are disconnected
		} else if ( !aup ) {
			return -1;

		} else if ( !bup ) {
			return 1;
		}

		// Otherwise they're somewhere else in the tree so we need
		// to build up a full list of the parentNodes for comparison
		while ( cur ) {
			ap.unshift( cur );
			cur = cur.parentNode;
		}

		cur = bup;

		while ( cur ) {
			bp.unshift( cur );
			cur = cur.parentNode;
		}

		al = ap.length;
		bl = bp.length;

		// Start walking down the tree looking for a discrepancy
		for ( var i = 0; i < al && i < bl; i++ ) {
			if ( ap[i] !== bp[i] ) {
				return siblingCheck( ap[i], bp[i] );
			}
		}

		// We ended someplace up the tree so do a sibling check
		return i === al ?
			siblingCheck( a, bp[i], -1 ) :
			siblingCheck( ap[i], b, 1 );
	};

	siblingCheck = function( a, b, ret ) {
		if ( a === b ) {
			return ret;
		}

		var cur = a.nextSibling;

		while ( cur ) {
			if ( cur === b ) {
				return -1;
			}

			cur = cur.nextSibling;
		}

		return 1;
	};
}

// Check to see if the browser returns elements by name when
// querying by getElementById (and provide a workaround)
(function(){
	// We're going to inject a fake input element with a specified name
	var form = document.createElement("div"),
		id = "script" + (new Date()).getTime(),
		root = document.documentElement;

	form.innerHTML = "<a name='" + id + "'/>";

	// Inject it into the root element, check its status, and remove it quickly
	root.insertBefore( form, root.firstChild );

	// The workaround has to do additional checks after a getElementById
	// Which slows things down for other browsers (hence the branching)
	if ( document.getElementById( id ) ) {
		Expr.find.ID = function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);

				return m ?
					m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ?
						[m] :
						undefined :
					[];
			}
		};

		Expr.filter.ID = function( elem, match ) {
			var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");

			return elem.nodeType === 1 && node && node.nodeValue === match;
		};
	}

	root.removeChild( form );

	// release memory in IE
	root = form = null;
})();

(function(){
	// Check to see if the browser returns only elements
	// when doing getElementsByTagName("*")

	// Create a fake element
	var div = document.createElement("div");
	div.appendChild( document.createComment("") );

	// Make sure no comments are found
	if ( div.getElementsByTagName("*").length > 0 ) {
		Expr.find.TAG = function( match, context ) {
			var results = context.getElementsByTagName( match[1] );

			// Filter out possible comments
			if ( match[1] === "*" ) {
				var tmp = [];

				for ( var i = 0; results[i]; i++ ) {
					if ( results[i].nodeType === 1 ) {
						tmp.push( results[i] );
					}
				}

				results = tmp;
			}

			return results;
		};
	}

	// Check to see if an attribute returns normalized href attributes
	div.innerHTML = "<a href='#'></a>";

	if ( div.firstChild && typeof div.firstChild.getAttribute !== "undefined" &&
			div.firstChild.getAttribute("href") !== "#" ) {

		Expr.attrHandle.href = function( elem ) {
			return elem.getAttribute( "href", 2 );
		};
	}

	// release memory in IE
	div = null;
})();

if ( document.querySelectorAll ) {
	(function(){
		var oldSizzle = Sizzle,
			div = document.createElement("div"),
			id = "__sizzle__";

		div.innerHTML = "<p class='TEST'></p>";

		// Safari can't handle uppercase or unicode characters when
		// in quirks mode.
		if ( div.querySelectorAll && div.querySelectorAll(".TEST").length === 0 ) {
			return;
		}

		Sizzle = function( query, context, extra, seed ) {
			context = context || document;

			// Only use querySelectorAll on non-XML documents
			// (ID selectors don't work in non-HTML documents)
			if ( !seed && !Sizzle.isXML(context) ) {
				// See if we find a selector to speed up
				var match = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec( query );

				if ( match && (context.nodeType === 1 || context.nodeType === 9) ) {
					// Speed-up: Sizzle("TAG")
					if ( match[1] ) {
						return makeArray( context.getElementsByTagName( query ), extra );

					// Speed-up: Sizzle(".CLASS")
					} else if ( match[2] && Expr.find.CLASS && context.getElementsByClassName ) {
						return makeArray( context.getElementsByClassName( match[2] ), extra );
					}
				}

				if ( context.nodeType === 9 ) {
					// Speed-up: Sizzle("body")
					// The body element only exists once, optimize finding it
					if ( query === "body" && context.body ) {
						return makeArray( [ context.body ], extra );

					// Speed-up: Sizzle("#ID")
					} else if ( match && match[3] ) {
						var elem = context.getElementById( match[3] );

						// Check parentNode to catch when Blackberry 4.6 returns
						// nodes that are no longer in the document #6963
						if ( elem && elem.parentNode ) {
							// Handle the case where IE and Opera return items
							// by name instead of ID
							if ( elem.id === match[3] ) {
								return makeArray( [ elem ], extra );
							}

						} else {
							return makeArray( [], extra );
						}
					}

					try {
						return makeArray( context.querySelectorAll(query), extra );
					} catch(qsaError) {}

				// qSA works strangely on Element-rooted queries
				// We can work around this by specifying an extra ID on the root
				// and working up from there (Thanks to Andrew Dupont for the technique)
				// IE 8 doesn't work on object elements
				} else if ( context.nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
					var oldContext = context,
						old = context.getAttribute( "id" ),
						nid = old || id,
						hasParent = context.parentNode,
						relativeHierarchySelector = /^\s*[+~]/.test( query );

					if ( !old ) {
						context.setAttribute( "id", nid );
					} else {
						nid = nid.replace( /'/g, "\\$&" );
					}
					if ( relativeHierarchySelector && hasParent ) {
						context = context.parentNode;
					}

					try {
						if ( !relativeHierarchySelector || hasParent ) {
							return makeArray( context.querySelectorAll( "[id='" + nid + "'] " + query ), extra );
						}

					} catch(pseudoError) {
					} finally {
						if ( !old ) {
							oldContext.removeAttribute( "id" );
						}
					}
				}
			}

			return oldSizzle(query, context, extra, seed);
		};

		for ( var prop in oldSizzle ) {
			Sizzle[ prop ] = oldSizzle[ prop ];
		}

		// release memory in IE
		div = null;
	})();
}

(function(){
	var html = document.documentElement,
		matches = html.matchesSelector || html.mozMatchesSelector || html.webkitMatchesSelector || html.msMatchesSelector;

	if ( matches ) {
		// Check to see if it's possible to do matchesSelector
		// on a disconnected node (IE 9 fails this)
		var disconnectedMatch = !matches.call( document.createElement( "div" ), "div" ),
			pseudoWorks = false;

		try {
			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( document.documentElement, "[test!='']:sizzle" );

		} catch( pseudoError ) {
			pseudoWorks = true;
		}

		Sizzle.matchesSelector = function( node, expr ) {
			// Make sure that attribute selectors are quoted
			expr = expr.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");

			if ( !Sizzle.isXML( node ) ) {
				try {
					if ( pseudoWorks || !Expr.match.PSEUDO.test( expr ) && !/!=/.test( expr ) ) {
						var ret = matches.call( node, expr );

						// IE 9's matchesSelector returns false on disconnected nodes
						if ( ret || !disconnectedMatch ||
								// As well, disconnected nodes are said to be in a document
								// fragment in IE 9, so check for that
								node.document && node.document.nodeType !== 11 ) {
							return ret;
						}
					}
				} catch(e) {}
			}

			return Sizzle(expr, null, null, [node]).length > 0;
		};
	}
})();

(function(){
	var div = document.createElement("div");

	div.innerHTML = "<div class='test e'></div><div class='test'></div>";

	// Opera can't find a second classname (in 9.6)
	// Also, make sure that getElementsByClassName actually exists
	if ( !div.getElementsByClassName || div.getElementsByClassName("e").length === 0 ) {
		return;
	}

	// Safari caches class attributes, doesn't catch changes (in 3.2)
	div.lastChild.className = "e";

	if ( div.getElementsByClassName("e").length === 1 ) {
		return;
	}

	Expr.order.splice(1, 0, "CLASS");
	Expr.find.CLASS = function( match, context, isXML ) {
		if ( typeof context.getElementsByClassName !== "undefined" && !isXML ) {
			return context.getElementsByClassName(match[1]);
		}
	};

	// release memory in IE
	div = null;
})();

function dirNodeCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];

		if ( elem ) {
			var match = false;

			elem = elem[dir];

			while ( elem ) {
				if ( elem[ expando ] === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 && !isXML ){
					elem[ expando ] = doneName;
					elem.sizset = i;
				}

				if ( elem.nodeName.toLowerCase() === cur ) {
					match = elem;
					break;
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

function dirCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];

		if ( elem ) {
			var match = false;

			elem = elem[dir];

			while ( elem ) {
				if ( elem[ expando ] === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 ) {
					if ( !isXML ) {
						elem[ expando ] = doneName;
						elem.sizset = i;
					}

					if ( typeof cur !== "string" ) {
						if ( elem === cur ) {
							match = true;
							break;
						}

					} else if ( Sizzle.filter( cur, [elem] ).length > 0 ) {
						match = elem;
						break;
					}
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

if ( document.documentElement.contains ) {
	Sizzle.contains = function( a, b ) {
		return a !== b && (a.contains ? a.contains(b) : true);
	};

} else if ( document.documentElement.compareDocumentPosition ) {
	Sizzle.contains = function( a, b ) {
		return !!(a.compareDocumentPosition(b) & 16);
	};

} else {
	Sizzle.contains = function() {
		return false;
	};
}

Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;

	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

var posProcess = function( selector, context, seed ) {
	var match,
		tmpSet = [],
		later = "",
		root = context.nodeType ? [context] : context;

	// Position selectors must be done after the filter
	// And so must :not(positional) so we move all PSEUDOs to the end
	while ( (match = Expr.match.PSEUDO.exec( selector )) ) {
		later += match[0];
		selector = selector.replace( Expr.match.PSEUDO, "" );
	}

	selector = Expr.relative[selector] ? selector + "*" : selector;

	for ( var i = 0, l = root.length; i < l; i++ ) {
		Sizzle( selector, root[i], tmpSet, seed );
	}

	return Sizzle.filter( later, tmpSet );
};

// EXPOSE
// Override sizzle attribute retrieval
Sizzle.attr = jQuery.attr;
Sizzle.selectors.attrMap = {};
jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.filters;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})();


var runtil = /Until$/,
	rparentsprev = /^(?:parents|prevUntil|prevAll)/,
	// Note: This RegExp should be improved, or likely pulled from Sizzle
	rmultiselector = /,/,
	isSimple = /^.[^:#\[\.,]*$/,
	slice = Array.prototype.slice,
	POS = jQuery.expr.match.globalPOS,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var self = this,
			i, l;

		if ( typeof selector !== "string" ) {
			return jQuery( selector ).filter(function() {
				for ( i = 0, l = self.length; i < l; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			});
		}

		var ret = this.pushStack( "", "find", selector ),
			length, n, r;

		for ( i = 0, l = this.length; i < l; i++ ) {
			length = ret.length;
			jQuery.find( selector, this[i], ret );

			if ( i > 0 ) {
				// Make sure that the results are unique
				for ( n = length; n < ret.length; n++ ) {
					for ( r = 0; r < length; r++ ) {
						if ( ret[r] === ret[n] ) {
							ret.splice(n--, 1);
							break;
						}
					}
				}
			}
		}

		return ret;
	},

	has: function( target ) {
		var targets = jQuery( target );
		return this.filter(function() {
			for ( var i = 0, l = targets.length; i < l; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector, false), "not", selector);
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector, true), "filter", selector );
	},

	is: function( selector ) {
		return !!selector && (
			typeof selector === "string" ?
				// If this is a positional selector, check membership in the returned set
				// so $("p:first").is("p:last") won't return true for a doc with two "p".
				POS.test( selector ) ?
					jQuery( selector, this.context ).index( this[0] ) >= 0 :
					jQuery.filter( selector, this ).length > 0 :
				this.filter( selector ).length > 0 );
	},

	closest: function( selectors, context ) {
		var ret = [], i, l, cur = this[0];

		// Array (deprecated as of jQuery 1.7)
		if ( jQuery.isArray( selectors ) ) {
			var level = 1;

			while ( cur && cur.ownerDocument && cur !== context ) {
				for ( i = 0; i < selectors.length; i++ ) {

					if ( jQuery( cur ).is( selectors[ i ] ) ) {
						ret.push({ selector: selectors[ i ], elem: cur, level: level });
					}
				}

				cur = cur.parentNode;
				level++;
			}

			return ret;
		}

		// String
		var pos = POS.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( i = 0, l = this.length; i < l; i++ ) {
			cur = this[i];

			while ( cur ) {
				if ( pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors) ) {
					ret.push( cur );
					break;

				} else {
					cur = cur.parentNode;
					if ( !cur || !cur.ownerDocument || cur === context || cur.nodeType === 11 ) {
						break;
					}
				}
			}
		}

		ret = ret.length > 1 ? jQuery.unique( ret ) : ret;

		return this.pushStack( ret, "closest", selectors );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( isDisconnected( set[0] ) || isDisconnected( all[0] ) ?
			all :
			jQuery.unique( all ) );
	},

	andSelf: function() {
		return this.add( this.prevObject );
	}
});

// A painfully simple check to see if an element is disconnected
// from a document (should be improved, where feasible).
function isDisconnected( node ) {
	return !node || !node.parentNode || node.parentNode.nodeType === 11;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return jQuery.nth( elem, 2, "nextSibling" );
	},
	prev: function( elem ) {
		return jQuery.nth( elem, 2, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.makeArray( elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( !runtil.test( name ) ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		ret = this.length > 1 && !guaranteedUnique[ name ] ? jQuery.unique( ret ) : ret;

		if ( (this.length > 1 || rmultiselector.test( selector )) && rparentsprev.test( name ) ) {
			ret = ret.reverse();
		}

		return this.pushStack( ret, name, slice.call( arguments ).join(",") );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 ?
			jQuery.find.matchesSelector(elems[0], expr) ? [ elems[0] ] : [] :
			jQuery.find.matches(expr, elems);
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	nth: function( cur, result, dir, elem ) {
		result = result || 1;
		var num = 0;

		for ( ; cur; cur = cur[dir] ) {
			if ( cur.nodeType === 1 && ++num === result ) {
				break;
			}
		}

		return cur;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, keep ) {

	// Can't pass null or undefined to indexOf in Firefox 4
	// Set to 0 to skip string check
	qualifier = qualifier || 0;

	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep(elements, function( elem, i ) {
			var retVal = !!qualifier.call( elem, i, elem );
			return retVal === keep;
		});

	} else if ( qualifier.nodeType ) {
		return jQuery.grep(elements, function( elem, i ) {
			return ( elem === qualifier ) === keep;
		});

	} else if ( typeof qualifier === "string" ) {
		var filtered = jQuery.grep(elements, function( elem ) {
			return elem.nodeType === 1;
		});

		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter(qualifier, filtered, !keep);
		} else {
			qualifier = jQuery.filter( qualifier, filtered );
		}
	}

	return jQuery.grep(elements, function( elem, i ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) === keep;
	});
}




function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
	safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:\d+|null)"/g,
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style)/i,
	rnocache = /<(?:script|object|embed|option|style)/i,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /\/(java|ecma)script/i,
	rcleanScript = /^\s*<!(?:\[CDATA\[|\-\-)/,
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		area: [ 1, "<map>", "</map>" ],
		_default: [ 0, "", "" ]
	},
	safeFragment = createSafeFragment( document );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// IE can't serialize <link> and <script> tags normally
if ( !jQuery.support.htmlSerialize ) {
	wrapMap._default = [ 1, "div<div>", "</div>" ];
}

jQuery.fn.extend({
	text: function( value ) {
		return jQuery.access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},

	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function(i) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	},

	append: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 ) {
				this.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 ) {
				this.insertBefore( elem, this.firstChild );
			}
		});
	},

	before: function() {
		if ( this[0] && this[0].parentNode ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this );
			});
		} else if ( arguments.length ) {
			var set = jQuery.clean( arguments );
			set.push.apply( set, this.toArray() );
			return this.pushStack( set, "before", arguments );
		}
	},

	after: function() {
		if ( this[0] && this[0].parentNode ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			});
		} else if ( arguments.length ) {
			var set = this.pushStack( this, "after", arguments );
			set.push.apply( set, jQuery.clean(arguments) );
			return set;
		}
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
			if ( !selector || jQuery.filter( selector, [ elem ] ).length ) {
				if ( !keepData && elem.nodeType === 1 ) {
					jQuery.cleanData( elem.getElementsByTagName("*") );
					jQuery.cleanData( [ elem ] );
				}

				if ( elem.parentNode ) {
					elem.parentNode.removeChild( elem );
				}
			}
		}

		return this;
	},

	empty: function() {
		for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( elem.getElementsByTagName("*") );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return jQuery.access( this, function( value ) {
			var elem = this[0] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					null;
			}


			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ ( rtagName.exec( value ) || ["", ""] )[1].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for (; i < l; i++ ) {
						// Remove element nodes and prevent memory leaks
						elem = this[i] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( elem.getElementsByTagName( "*" ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch(e) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function( value ) {
		if ( this[0] && this[0].parentNode ) {
			// Make sure that the elements are removed from the DOM before they are inserted
			// this can help fix replacing a parent with child elements
			if ( jQuery.isFunction( value ) ) {
				return this.each(function(i) {
					var self = jQuery(this), old = self.html();
					self.replaceWith( value.call( this, i, old ) );
				});
			}

			if ( typeof value !== "string" ) {
				value = jQuery( value ).detach();
			}

			return this.each(function() {
				var next = this.nextSibling,
					parent = this.parentNode;

				jQuery( this ).remove();

				if ( next ) {
					jQuery(next).before( value );
				} else {
					jQuery(parent).append( value );
				}
			});
		} else {
			return this.length ?
				this.pushStack( jQuery(jQuery.isFunction(value) ? value() : value), "replaceWith", value ) :
				this;
		}
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, table, callback ) {
		var results, first, fragment, parent,
			value = args[0],
			scripts = [];

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( !jQuery.support.checkClone && arguments.length === 3 && typeof value === "string" && rchecked.test( value ) ) {
			return this.each(function() {
				jQuery(this).domManip( args, table, callback, true );
			});
		}

		if ( jQuery.isFunction(value) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				args[0] = value.call(this, i, table ? self.html() : undefined);
				self.domManip( args, table, callback );
			});
		}

		if ( this[0] ) {
			parent = value && value.parentNode;

			// If we're in a fragment, just use that instead of building a new one
			if ( jQuery.support.parentNode && parent && parent.nodeType === 11 && parent.childNodes.length === this.length ) {
				results = { fragment: parent };

			} else {
				results = jQuery.buildFragment( args, this, scripts );
			}

			fragment = results.fragment;

			if ( fragment.childNodes.length === 1 ) {
				first = fragment = fragment.firstChild;
			} else {
				first = fragment.firstChild;
			}

			if ( first ) {
				table = table && jQuery.nodeName( first, "tr" );

				for ( var i = 0, l = this.length, lastIndex = l - 1; i < l; i++ ) {
					callback.call(
						table ?
							root(this[i], first) :
							this[i],
						// Make sure that we do not leak memory by inadvertently discarding
						// the original fragment (which might have attached data) instead of
						// using it; in addition, use the original fragment object for the last
						// item instead of first because it can end up being emptied incorrectly
						// in certain situations (Bug #8070).
						// Fragments from the fragment cache must always be cloned and never used
						// in place.
						results.cacheable || ( l > 1 && i < lastIndex ) ?
							jQuery.clone( fragment, true, true ) :
							fragment
					);
				}
			}

			if ( scripts.length ) {
				jQuery.each( scripts, function( i, elem ) {
					if ( elem.src ) {
						jQuery.ajax({
							type: "GET",
							global: false,
							url: elem.src,
							async: false,
							dataType: "script"
						});
					} else {
						jQuery.globalEval( ( elem.text || elem.textContent || elem.innerHTML || "" ).replace( rcleanScript, "/*$0*/" ) );
					}

					if ( elem.parentNode ) {
						elem.parentNode.removeChild( elem );
					}
				});
			}
		}

		return this;
	}
});

function root( elem, cur ) {
	return jQuery.nodeName(elem, "table") ?
		(elem.getElementsByTagName("tbody")[0] ||
		elem.appendChild(elem.ownerDocument.createElement("tbody"))) :
		elem;
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function cloneFixAttributes( src, dest ) {
	var nodeName;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	// clearAttributes removes the attributes, which we don't want,
	// but also removes the attachEvent events, which we *do* want
	if ( dest.clearAttributes ) {
		dest.clearAttributes();
	}

	// mergeAttributes, in contrast, only merges back on the
	// original attributes, not the events
	if ( dest.mergeAttributes ) {
		dest.mergeAttributes( src );
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 fail to clone children inside object elements that use
	// the proprietary classid attribute value (rather than the type
	// attribute) to identify the type of content to display
	if ( nodeName === "object" ) {
		dest.outerHTML = src.outerHTML;

	} else if ( nodeName === "input" && (src.type === "checkbox" || src.type === "radio") ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set
		if ( src.checked ) {
			dest.defaultChecked = dest.checked = src.checked;
		}

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;

	// IE blanks contents when cloning scripts
	} else if ( nodeName === "script" && dest.text !== src.text ) {
		dest.text = src.text;
	}

	// Event data gets referenced instead of copied if the expando
	// gets copied too
	dest.removeAttribute( jQuery.expando );

	// Clear flags for bubbling special change/submit events, they must
	// be reattached when the newly cloned events are first activated
	dest.removeAttribute( "_submit_attached" );
	dest.removeAttribute( "_change_attached" );
}

jQuery.buildFragment = function( args, nodes, scripts ) {
	var fragment, cacheable, cacheresults, doc,
	first = args[ 0 ];

	// nodes may contain either an explicit document object,
	// a jQuery collection or context object.
	// If nodes[0] contains a valid object to assign to doc
	if ( nodes && nodes[0] ) {
		doc = nodes[0].ownerDocument || nodes[0];
	}

	// Ensure that an attr object doesn't incorrectly stand in as a document object
	// Chrome and Firefox seem to allow this to occur and will throw exception
	// Fixes #8950
	if ( !doc.createDocumentFragment ) {
		doc = document;
	}

	// Only cache "small" (1/2 KB) HTML strings that are associated with the main document
	// Cloning options loses the selected state, so don't cache them
	// IE 6 doesn't like it when you put <object> or <embed> elements in a fragment
	// Also, WebKit does not clone 'checked' attributes on cloneNode, so don't cache
	// Lastly, IE6,7,8 will not correctly reuse cached fragments that were created from unknown elems #10501
	if ( args.length === 1 && typeof first === "string" && first.length < 512 && doc === document &&
		first.charAt(0) === "<" && !rnocache.test( first ) &&
		(jQuery.support.checkClone || !rchecked.test( first )) &&
		(jQuery.support.html5Clone || !rnoshimcache.test( first )) ) {

		cacheable = true;

		cacheresults = jQuery.fragments[ first ];
		if ( cacheresults && cacheresults !== 1 ) {
			fragment = cacheresults;
		}
	}

	if ( !fragment ) {
		fragment = doc.createDocumentFragment();
		jQuery.clean( args, doc, fragment, scripts );
	}

	if ( cacheable ) {
		jQuery.fragments[ first ] = cacheresults ? fragment : 1;
	}

	return { fragment: fragment, cacheable: cacheable };
};

jQuery.fragments = {};

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var ret = [],
			insert = jQuery( selector ),
			parent = this.length === 1 && this[0].parentNode;

		if ( parent && parent.nodeType === 11 && parent.childNodes.length === 1 && insert.length === 1 ) {
			insert[ original ]( this[0] );
			return this;

		} else {
			for ( var i = 0, l = insert.length; i < l; i++ ) {
				var elems = ( i > 0 ? this.clone(true) : this ).get();
				jQuery( insert[i] )[ original ]( elems );
				ret = ret.concat( elems );
			}

			return this.pushStack( ret, name, insert.selector );
		}
	};
});

function getAll( elem ) {
	if ( typeof elem.getElementsByTagName !== "undefined" ) {
		return elem.getElementsByTagName( "*" );

	} else if ( typeof elem.querySelectorAll !== "undefined" ) {
		return elem.querySelectorAll( "*" );

	} else {
		return [];
	}
}

// Used in clean, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( elem.type === "checkbox" || elem.type === "radio" ) {
		elem.defaultChecked = elem.checked;
	}
}
// Finds all inputs and passes them to fixDefaultChecked
function findInputs( elem ) {
	var nodeName = ( elem.nodeName || "" ).toLowerCase();
	if ( nodeName === "input" ) {
		fixDefaultChecked( elem );
	// Skip scripts, get other children
	} else if ( nodeName !== "script" && typeof elem.getElementsByTagName !== "undefined" ) {
		jQuery.grep( elem.getElementsByTagName("input"), fixDefaultChecked );
	}
}

// Derived From: http://www.iecss.com/shimprove/javascript/shimprove.1-0-1.js
function shimCloneNode( elem ) {
	var div = document.createElement( "div" );
	safeFragment.appendChild( div );

	div.innerHTML = elem.outerHTML;
	return div.firstChild;
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var srcElements,
			destElements,
			i,
			// IE<=8 does not properly clone detached, unknown element nodes
			clone = jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ?
				elem.cloneNode( true ) :
				shimCloneNode( elem );

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {
			// IE copies events bound via attachEvent when using cloneNode.
			// Calling detachEvent on the clone will also remove the events
			// from the original. In order to get around this, we use some
			// proprietary methods to clear the events. Thanks to MooTools
			// guys for this hotness.

			cloneFixAttributes( elem, clone );

			// Using Sizzle here is crazy slow, so we use getElementsByTagName instead
			srcElements = getAll( elem );
			destElements = getAll( clone );

			// Weird iteration because IE will replace the length property
			// with an element if you are cloning the body and one of the
			// elements on the page has a name or id of "length"
			for ( i = 0; srcElements[i]; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					cloneFixAttributes( srcElements[i], destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			cloneCopyEvent( elem, clone );

			if ( deepDataAndEvents ) {
				srcElements = getAll( elem );
				destElements = getAll( clone );

				for ( i = 0; srcElements[i]; ++i ) {
					cloneCopyEvent( srcElements[i], destElements[i] );
				}
			}
		}

		srcElements = destElements = null;

		// Return the cloned set
		return clone;
	},

	clean: function( elems, context, fragment, scripts ) {
		var checkScriptType, script, j,
				ret = [];

		context = context || document;

		// !context.createElement fails in IE with an error but returns typeof 'object'
		if ( typeof context.createElement === "undefined" ) {
			context = context.ownerDocument || context[0] && context[0].ownerDocument || document;
		}

		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			if ( typeof elem === "number" ) {
				elem += "";
			}

			if ( !elem ) {
				continue;
			}

			// Convert html string into DOM nodes
			if ( typeof elem === "string" ) {
				if ( !rhtml.test( elem ) ) {
					elem = context.createTextNode( elem );
				} else {
					// Fix "XHTML"-style tags in all browsers
					elem = elem.replace(rxhtmlTag, "<$1></$2>");

					// Trim whitespace, otherwise indexOf won't work as expected
					var tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase(),
						wrap = wrapMap[ tag ] || wrapMap._default,
						depth = wrap[0],
						div = context.createElement("div"),
						safeChildNodes = safeFragment.childNodes,
						remove;

					// Append wrapper element to unknown element safe doc fragment
					if ( context === document ) {
						// Use the fragment we've already created for this document
						safeFragment.appendChild( div );
					} else {
						// Use a fragment created with the owner document
						createSafeFragment( context ).appendChild( div );
					}

					// Go to html and back, then peel off extra wrappers
					div.innerHTML = wrap[1] + elem + wrap[2];

					// Move to the right depth
					while ( depth-- ) {
						div = div.lastChild;
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						var hasBody = rtbody.test(elem),
							tbody = tag === "table" && !hasBody ?
								div.firstChild && div.firstChild.childNodes :

								// String was a bare <thead> or <tfoot>
								wrap[1] === "<table>" && !hasBody ?
									div.childNodes :
									[];

						for ( j = tbody.length - 1; j >= 0 ; --j ) {
							if ( jQuery.nodeName( tbody[ j ], "tbody" ) && !tbody[ j ].childNodes.length ) {
								tbody[ j ].parentNode.removeChild( tbody[ j ] );
							}
						}
					}

					// IE completely kills leading whitespace when innerHTML is used
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						div.insertBefore( context.createTextNode( rleadingWhitespace.exec(elem)[0] ), div.firstChild );
					}

					elem = div.childNodes;

					// Clear elements from DocumentFragment (safeFragment or otherwise)
					// to avoid hoarding elements. Fixes #11356
					if ( div ) {
						div.parentNode.removeChild( div );

						// Guard against -1 index exceptions in FF3.6
						if ( safeChildNodes.length > 0 ) {
							remove = safeChildNodes[ safeChildNodes.length - 1 ];

							if ( remove && remove.parentNode ) {
								remove.parentNode.removeChild( remove );
							}
						}
					}
				}
			}

			// Resets defaultChecked for any radios and checkboxes
			// about to be appended to the DOM in IE 6/7 (#8060)
			var len;
			if ( !jQuery.support.appendChecked ) {
				if ( elem[0] && typeof (len = elem.length) === "number" ) {
					for ( j = 0; j < len; j++ ) {
						findInputs( elem[j] );
					}
				} else {
					findInputs( elem );
				}
			}

			if ( elem.nodeType ) {
				ret.push( elem );
			} else {
				ret = jQuery.merge( ret, elem );
			}
		}

		if ( fragment ) {
			checkScriptType = function( elem ) {
				return !elem.type || rscriptType.test( elem.type );
			};
			for ( i = 0; ret[i]; i++ ) {
				script = ret[i];
				if ( scripts && jQuery.nodeName( script, "script" ) && (!script.type || rscriptType.test( script.type )) ) {
					scripts.push( script.parentNode ? script.parentNode.removeChild( script ) : script );

				} else {
					if ( script.nodeType === 1 ) {
						var jsTags = jQuery.grep( script.getElementsByTagName( "script" ), checkScriptType );

						ret.splice.apply( ret, [i + 1, 0].concat( jsTags ) );
					}
					fragment.appendChild( script );
				}
			}
		}

		return ret;
	},

	cleanData: function( elems ) {
		var data, id,
			cache = jQuery.cache,
			special = jQuery.event.special,
			deleteExpando = jQuery.support.deleteExpando;

		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			if ( elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()] ) {
				continue;
			}

			id = elem[ jQuery.expando ];

			if ( id ) {
				data = cache[ id ];

				if ( data && data.events ) {
					for ( var type in data.events ) {
						if ( special[ type ] ) {
							jQuery.event.remove( elem, type );

						// This is a shortcut to avoid jQuery.event.remove's overhead
						} else {
							jQuery.removeEvent( elem, type, data.handle );
						}
					}

					// Null the DOM reference to avoid IE6/7/8 leak (#7054)
					if ( data.handle ) {
						data.handle.elem = null;
					}
				}

				if ( deleteExpando ) {
					delete elem[ jQuery.expando ];

				} else if ( elem.removeAttribute ) {
					elem.removeAttribute( jQuery.expando );
				}

				delete cache[ id ];
			}
		}
	}
});




var ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity=([^)]*)/,
	// fixed for IE9, see #8346
	rupper = /([A-Z]|^ms)/g,
	rnum = /^[\-+]?(?:\d*\.)?\d+$/i,
	rnumnonpx = /^-?(?:\d*\.)?\d+(?!px)[^\d\s]+$/i,
	rrelNum = /^([\-+])=([\-+.\de]+)/,
	rmargin = /^margin/,

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },

	// order is important!
	cssExpand = [ "Top", "Right", "Bottom", "Left" ],

	curCSS,

	getComputedStyle,
	currentStyle;

jQuery.fn.css = function( name, value ) {
	return jQuery.access( this, function( elem, name, value ) {
		return value !== undefined ?
			jQuery.style( elem, name, value ) :
			jQuery.css( elem, name );
	}, name, value, arguments.length > 1 );
};

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;

				} else {
					return elem.style.opacity;
				}
			}
		}
	},

	// Exclude the following css properties to add px
	cssNumber: {
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, origName = jQuery.camelCase( name ),
			style = elem.style, hooks = jQuery.cssHooks[ origName ];

		name = jQuery.cssProps[ origName ] || origName;

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( +( ret[1] + 1) * +ret[2] ) + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value )) !== undefined ) {
				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra ) {
		var ret, hooks;

		// Make sure that we're working with the right name
		name = jQuery.camelCase( name );
		hooks = jQuery.cssHooks[ name ];
		name = jQuery.cssProps[ name ] || name;

		// cssFloat needs a special treatment
		if ( name === "cssFloat" ) {
			name = "float";
		}

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks && (ret = hooks.get( elem, true, extra )) !== undefined ) {
			return ret;

		// Otherwise, if a way to get the computed value exists, use that
		} else if ( curCSS ) {
			return curCSS( elem, name );
		}
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations
	swap: function( elem, options, callback ) {
		var old = {},
			ret, name;

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.call( elem );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	}
});

// DEPRECATED in 1.3, Use jQuery.css() instead
jQuery.curCSS = jQuery.css;

if ( document.defaultView && document.defaultView.getComputedStyle ) {
	getComputedStyle = function( elem, name ) {
		var ret, defaultView, computedStyle, width,
			style = elem.style;

		name = name.replace( rupper, "-$1" ).toLowerCase();

		if ( (defaultView = elem.ownerDocument.defaultView) &&
				(computedStyle = defaultView.getComputedStyle( elem, null )) ) {

			ret = computedStyle.getPropertyValue( name );
			if ( ret === "" && !jQuery.contains( elem.ownerDocument.documentElement, elem ) ) {
				ret = jQuery.style( elem, name );
			}
		}

		// A tribute to the "awesome hack by Dean Edwards"
		// WebKit uses "computed value (percentage if specified)" instead of "used value" for margins
		// which is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
		if ( !jQuery.support.pixelMargin && computedStyle && rmargin.test( name ) && rnumnonpx.test( ret ) ) {
			width = style.width;
			style.width = ret;
			ret = computedStyle.width;
			style.width = width;
		}

		return ret;
	};
}

if ( document.documentElement.currentStyle ) {
	currentStyle = function( elem, name ) {
		var left, rsLeft, uncomputed,
			ret = elem.currentStyle && elem.currentStyle[ name ],
			style = elem.style;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret == null && style && (uncomputed = style[ name ]) ) {
			ret = uncomputed;
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		if ( rnumnonpx.test( ret ) ) {

			// Remember the original values
			left = style.left;
			rsLeft = elem.runtimeStyle && elem.runtimeStyle.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				elem.runtimeStyle.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				elem.runtimeStyle.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

curCSS = getComputedStyle || currentStyle;

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property
	var val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		i = name === "width" ? 1 : 0,
		len = 4;

	if ( val > 0 ) {
		if ( extra !== "border" ) {
			for ( ; i < len; i += 2 ) {
				if ( !extra ) {
					val -= parseFloat( jQuery.css( elem, "padding" + cssExpand[ i ] ) ) || 0;
				}
				if ( extra === "margin" ) {
					val += parseFloat( jQuery.css( elem, extra + cssExpand[ i ] ) ) || 0;
				} else {
					val -= parseFloat( jQuery.css( elem, "border" + cssExpand[ i ] + "Width" ) ) || 0;
				}
			}
		}

		return val + "px";
	}

	// Fall back to computed then uncomputed css if necessary
	val = curCSS( elem, name );
	if ( val < 0 || val == null ) {
		val = elem.style[ name ];
	}

	// Computed unit is not pixels. Stop here and return.
	if ( rnumnonpx.test(val) ) {
		return val;
	}

	// Normalize "", auto, and prepare for extra
	val = parseFloat( val ) || 0;

	// Add padding, border, margin
	if ( extra ) {
		for ( ; i < len; i += 2 ) {
			val += parseFloat( jQuery.css( elem, "padding" + cssExpand[ i ] ) ) || 0;
			if ( extra !== "padding" ) {
				val += parseFloat( jQuery.css( elem, "border" + cssExpand[ i ] + "Width" ) ) || 0;
			}
			if ( extra === "margin" ) {
				val += parseFloat( jQuery.css( elem, extra + cssExpand[ i ]) ) || 0;
			}
		}
	}

	return val + "px";
}

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				if ( elem.offsetWidth !== 0 ) {
					return getWidthOrHeight( elem, name, extra );
				} else {
					return jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					});
				}
			}
		},

		set: function( elem, value ) {
			return rnum.test( value ) ?
				value + "px" :
				value;
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( parseFloat( RegExp.$1 ) / 100 ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			if ( value >= 1 && jQuery.trim( filter.replace( ralpha, "" ) ) === "" ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there there is no filter style applied in a css rule, we are done
				if ( currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

jQuery(function() {
	// This hook cannot be added until DOM ready because the support test
	// for it is not run until after DOM ready
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
				// Work around by temporarily setting element display to inline-block
				return jQuery.swap( elem, { "display": "inline-block" }, function() {
					if ( computed ) {
						return curCSS( elem, "margin-right" );
					} else {
						return elem.style.marginRight;
					}
				});
			}
		};
	}
});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		var width = elem.offsetWidth,
			height = elem.offsetHeight;

		return ( width === 0 && height === 0 ) || (!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {

	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i,

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ],
				expanded = {};

			for ( i = 0; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};
});




var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rhash = /#.*$/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	rinput = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rquery = /\?/,
	rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
	rselectTextarea = /^(?:select|textarea)/i,
	rspacesAjax = /\s+/,
	rts = /([?&])_=[^&]*/,
	rurl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Document location
	ajaxLocation,

	// Document location segments
	ajaxLocParts,

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = ["*/"] + ["*"];

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		if ( jQuery.isFunction( func ) ) {
			var dataTypes = dataTypeExpression.toLowerCase().split( rspacesAjax ),
				i = 0,
				length = dataTypes.length,
				dataType,
				list,
				placeBefore;

			// For each dataType in the dataTypeExpression
			for ( ; i < length; i++ ) {
				dataType = dataTypes[ i ];
				// We control if we're asked to add before
				// any existing element
				placeBefore = /^\+/.test( dataType );
				if ( placeBefore ) {
					dataType = dataType.substr( 1 ) || "*";
				}
				list = structure[ dataType ] = structure[ dataType ] || [];
				// then we add to the structure accordingly
				list[ placeBefore ? "unshift" : "push" ]( func );
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR,
		dataType /* internal */, inspected /* internal */ ) {

	dataType = dataType || options.dataTypes[ 0 ];
	inspected = inspected || {};

	inspected[ dataType ] = true;

	var list = structure[ dataType ],
		i = 0,
		length = list ? list.length : 0,
		executeOnly = ( structure === prefilters ),
		selection;

	for ( ; i < length && ( executeOnly || !selection ); i++ ) {
		selection = list[ i ]( options, originalOptions, jqXHR );
		// If we got redirected to another dataType
		// we try there if executing only and not done already
		if ( typeof selection === "string" ) {
			if ( !executeOnly || inspected[ selection ] ) {
				selection = undefined;
			} else {
				options.dataTypes.unshift( selection );
				selection = inspectPrefiltersOrTransports(
						structure, options, originalOptions, jqXHR, selection, inspected );
			}
		}
	}
	// If we're only executing or nothing was selected
	// we try the catchall dataType if not done already
	if ( ( executeOnly || !selection ) && !inspected[ "*" ] ) {
		selection = inspectPrefiltersOrTransports(
				structure, options, originalOptions, jqXHR, "*", inspected );
	}
	// unnecessary when only executing (prefilters)
	// but it'll be ignored by the caller in that case
	return selection;
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};
	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}
}

jQuery.fn.extend({
	load: function( url, params, callback ) {
		if ( typeof url !== "string" && _load ) {
			return _load.apply( this, arguments );

		// Don't do a request if no elements are being requested
		} else if ( !this.length ) {
			return this;
		}

		var off = url.indexOf( " " );
		if ( off >= 0 ) {
			var selector = url.slice( off, url.length );
			url = url.slice( 0, off );
		}

		// Default to a GET request
		var type = "GET";

		// If the second parameter was provided
		if ( params ) {
			// If it's a function
			if ( jQuery.isFunction( params ) ) {
				// We assume that it's the callback
				callback = params;
				params = undefined;

			// Otherwise, build a param string
			} else if ( typeof params === "object" ) {
				params = jQuery.param( params, jQuery.ajaxSettings.traditional );
				type = "POST";
			}
		}

		var self = this;

		// Request the remote document
		jQuery.ajax({
			url: url,
			type: type,
			dataType: "html",
			data: params,
			// Complete callback (responseText is used internally)
			complete: function( jqXHR, status, responseText ) {
				// Store the response as specified by the jqXHR object
				responseText = jqXHR.responseText;
				// If successful, inject the HTML into all the matched elements
				if ( jqXHR.isResolved() ) {
					// #4825: Get the actual response in case
					// a dataFilter is present in ajaxSettings
					jqXHR.done(function( r ) {
						responseText = r;
					});
					// See if a selector was specified
					self.html( selector ?
						// Create a dummy div to hold the results
						jQuery("<div>")
							// inject the contents of the document in, removing the scripts
							// to avoid any 'Permission Denied' errors in IE
							.append(responseText.replace(rscript, ""))

							// Locate the specified elements
							.find(selector) :

						// If not, just inject the full result
						responseText );
				}

				if ( callback ) {
					self.each( callback, [ responseText, status, jqXHR ] );
				}
			}
		});

		return this;
	},

	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},

	serializeArray: function() {
		return this.map(function(){
			return this.elements ? jQuery.makeArray( this.elements ) : this;
		})
		.filter(function(){
			return this.name && !this.disabled &&
				( this.checked || rselectTextarea.test( this.nodeName ) ||
					rinput.test( this.type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val, i ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

// Attach a bunch of functions for handling common AJAX events
jQuery.each( "ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split( " " ), function( i, o ){
	jQuery.fn[ o ] = function( f ){
		return this.on( o, f );
	};
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			type: method,
			url: url,
			data: data,
			success: callback,
			dataType: type
		});
	};
});

jQuery.extend({

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		if ( settings ) {
			// Building a settings object
			ajaxExtend( target, jQuery.ajaxSettings );
		} else {
			// Extending ajaxSettings
			settings = target;
			target = jQuery.ajaxSettings;
		}
		ajaxExtend( target, settings );
		return target;
	},

	ajaxSettings: {
		url: ajaxLocation,
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		type: "GET",
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		processData: true,
		async: true,
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		traditional: false,
		headers: {},
		*/

		accepts: {
			xml: "application/xml, text/xml",
			html: "text/html",
			text: "text/plain",
			json: "application/json, text/javascript",
			"*": allTypes
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText"
		},

		// List of data converters
		// 1) key format is "source_type destination_type" (a single space in-between)
		// 2) the catchall symbol "*" can be used for source_type
		converters: {

			// Convert anything to text
			"* text": window.String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			context: true,
			url: true
		}
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events
			// It's the callbackContext if one was provided in the options
			// and if it's a DOM node or a jQuery collection
			globalEventContext = callbackContext !== s &&
				( callbackContext.nodeType || callbackContext instanceof jQuery ) ?
						jQuery( callbackContext ) : jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// ifModified key
			ifModifiedKey,
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// Response headers
			responseHeadersString,
			responseHeaders,
			// transport
			transport,
			// timeout handle
			timeoutTimer,
			// Cross-domain detection vars
			parts,
			// The jqXHR state
			state = 0,
			// To know if global events are to be dispatched
			fireGlobals,
			// Loop variable
			i,
			// Fake xhr
			jqXHR = {

				readyState: 0,

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( !state ) {
						var lname = name.toLowerCase();
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match === undefined ? null : match;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					statusText = statusText || "abort";
					if ( transport ) {
						transport.abort( statusText );
					}
					done( 0, statusText );
					return this;
				}
			};

		// Callback for when everything is done
		// It is defined here because jslint complains if it is declared
		// at the end of the function (which would be more logical and readable)
		function done( status, nativeStatusText, responses, headers ) {

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			var isSuccess,
				success,
				error,
				statusText = nativeStatusText,
				response = responses ? ajaxHandleResponses( s, jqXHR, responses ) : undefined,
				lastModified,
				etag;

			// If successful, handle type chaining
			if ( status >= 200 && status < 300 || status === 304 ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {

					if ( ( lastModified = jqXHR.getResponseHeader( "Last-Modified" ) ) ) {
						jQuery.lastModified[ ifModifiedKey ] = lastModified;
					}
					if ( ( etag = jqXHR.getResponseHeader( "Etag" ) ) ) {
						jQuery.etag[ ifModifiedKey ] = etag;
					}
				}

				// If not modified
				if ( status === 304 ) {

					statusText = "notmodified";
					isSuccess = true;

				// If we have data
				} else {

					try {
						success = ajaxConvert( s, response );
						statusText = "success";
						isSuccess = true;
					} catch(e) {
						// We have a parsererror
						statusText = "parsererror";
						error = e;
					}
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( !statusText || status ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = "" + ( nativeStatusText || statusText );

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajax" + ( isSuccess ? "Success" : "Error" ),
						[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		// Attach deferreds
		deferred.promise( jqXHR );
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;
		jqXHR.complete = completeDeferred.add;

		// Status-dependent callbacks
		jqXHR.statusCode = function( map ) {
			if ( map ) {
				var tmp;
				if ( state < 2 ) {
					for ( tmp in map ) {
						statusCode[ tmp ] = [ statusCode[tmp], map[tmp] ];
					}
				} else {
					tmp = map[ jqXHR.status ];
					jqXHR.then( tmp, tmp );
				}
			}
			return this;
		};

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// We also use the url parameter if available
		s.url = ( ( url || s.url ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().split( rspacesAjax );

		// Determine if a cross-domain request is in order
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] != ajaxLocParts[ 1 ] || parts[ 2 ] != ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? 80 : 443 ) ) !=
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? 80 : 443 ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return false;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.data;
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Get ifModifiedKey before adding the anti-cache parameter
			ifModifiedKey = s.url;

			// Add anti-cache in url if needed
			if ( s.cache === false ) {

				var ts = jQuery.now(),
					// try replacing _= if it is there
					ret = s.url.replace( rts, "$1_=" + ts );

				// if nothing was replaced, add timestamp to the end
				s.url = ret + ( ( ret === s.url ) ? ( rquery.test( s.url ) ? "&" : "?" ) + "_=" + ts : "" );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			ifModifiedKey = ifModifiedKey || s.url;
			if ( jQuery.lastModified[ ifModifiedKey ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ ifModifiedKey ] );
			}
			if ( jQuery.etag[ ifModifiedKey ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ ifModifiedKey ] );
			}
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
				// Abort if not done already
				jqXHR.abort();
				return false;

		}

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;
			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout( function(){
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch (e) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		return jqXHR;
	},

	// Serialize an array of form elements or a set of
	// key/values into a query string
	param: function( a, traditional ) {
		var s = [],
			add = function( key, value ) {
				// If value is a function, invoke it and return its value
				value = jQuery.isFunction( value ) ? value() : value;
				s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
			};

		// Set traditional to true for jQuery <= 1.3.2 behavior.
		if ( traditional === undefined ) {
			traditional = jQuery.ajaxSettings.traditional;
		}

		// If an array was passed in, assume that it is an array of form elements.
		if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
			// Serialize the form elements
			jQuery.each( a, function() {
				add( this.name, this.value );
			});

		} else {
			// If traditional, encode the "old" way (the way 1.3.2 or older
			// did it), otherwise encode params recursively.
			for ( var prefix in a ) {
				buildParams( prefix, a[ prefix ], traditional, add );
			}
		}

		// Return the resulting serialization
		return s.join( "&" ).replace( r20, "+" );
	}
});

function buildParams( prefix, obj, traditional, add ) {
	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// If array item is non-scalar (array or object), encode its
				// numeric index to resolve deserialization ambiguity issues.
				// Note that rack (as of 1.0.0) can't currently deserialize
				// nested arrays properly, and attempting to do so may cause
				// a server error. Possible fixes are to modify rack's
				// deserialization algorithm or to provide an option or flag
				// to force array serialization to be shallow.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( var name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}

// This is still on the jQuery object... for now
// Want to move this to jQuery.ajax some day
jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {}

});

/* Handles responses to an ajax request:
 * - sets all responseXXX fields accordingly
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var contents = s.contents,
		dataTypes = s.dataTypes,
		responseFields = s.responseFields,
		ct,
		type,
		finalDataType,
		firstDataType;

	// Fill responseXXX fields
	for ( type in responseFields ) {
		if ( type in responses ) {
			jqXHR[ responseFields[type] ] = responses[ type ];
		}
	}

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "content-type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

// Chain conversions given the request and the original response
function ajaxConvert( s, response ) {

	// Apply the dataFilter if provided
	if ( s.dataFilter ) {
		response = s.dataFilter( response, s.dataType );
	}

	var dataTypes = s.dataTypes,
		converters = {},
		i,
		key,
		length = dataTypes.length,
		tmp,
		// Current and previous dataTypes
		current = dataTypes[ 0 ],
		prev,
		// Conversion expression
		conversion,
		// Conversion function
		conv,
		// Conversion functions (transitive conversion)
		conv1,
		conv2;

	// For each dataType in the chain
	for ( i = 1; i < length; i++ ) {

		// Create converters map
		// with lowercased keys
		if ( i === 1 ) {
			for ( key in s.converters ) {
				if ( typeof key === "string" ) {
					converters[ key.toLowerCase() ] = s.converters[ key ];
				}
			}
		}

		// Get the dataTypes
		prev = current;
		current = dataTypes[ i ];

		// If current is auto dataType, update it to prev
		if ( current === "*" ) {
			current = prev;
		// If no auto and dataTypes are actually different
		} else if ( prev !== "*" && prev !== current ) {

			// Get the converter
			conversion = prev + " " + current;
			conv = converters[ conversion ] || converters[ "* " + current ];

			// If there is no direct converter, search transitively
			if ( !conv ) {
				conv2 = undefined;
				for ( conv1 in converters ) {
					tmp = conv1.split( " " );
					if ( tmp[ 0 ] === prev || tmp[ 0 ] === "*" ) {
						conv2 = converters[ tmp[1] + " " + current ];
						if ( conv2 ) {
							conv1 = converters[ conv1 ];
							if ( conv1 === true ) {
								conv = conv2;
							} else if ( conv2 === true ) {
								conv = conv1;
							}
							break;
						}
					}
				}
			}
			// If we found no converter, dispatch an error
			if ( !( conv || conv2 ) ) {
				jQuery.error( "No conversion from " + conversion.replace(" "," to ") );
			}
			// If found converter is not an equivalence
			if ( conv !== true ) {
				// Convert with 1 or 2 converters accordingly
				response = conv ? conv( response ) : conv2( conv1(response) );
			}
		}
	}
	return response;
}




var jsc = jQuery.now(),
	jsre = /(\=)\?(&|$)|\?\?/i;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		return jQuery.expando + "_" + ( jsc++ );
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var inspectData = ( typeof s.data === "string" ) && /^application\/x\-www\-form\-urlencoded/.test( s.contentType );

	if ( s.dataTypes[ 0 ] === "jsonp" ||
		s.jsonp !== false && ( jsre.test( s.url ) ||
				inspectData && jsre.test( s.data ) ) ) {

		var responseContainer,
			jsonpCallback = s.jsonpCallback =
				jQuery.isFunction( s.jsonpCallback ) ? s.jsonpCallback() : s.jsonpCallback,
			previous = window[ jsonpCallback ],
			url = s.url,
			data = s.data,
			replace = "$1" + jsonpCallback + "$2";

		if ( s.jsonp !== false ) {
			url = url.replace( jsre, replace );
			if ( s.url === url ) {
				if ( inspectData ) {
					data = data.replace( jsre, replace );
				}
				if ( s.data === data ) {
					// Add callback manually
					url += (/\?/.test( url ) ? "&" : "?") + s.jsonp + "=" + jsonpCallback;
				}
			}
		}

		s.url = url;
		s.data = data;

		// Install callback
		window[ jsonpCallback ] = function( response ) {
			responseContainer = [ response ];
		};

		// Clean-up function
		jqXHR.always(function() {
			// Set callback back to previous value
			window[ jsonpCallback ] = previous;
			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( previous ) ) {
				window[ jsonpCallback ]( responseContainer[ 0 ] );
			}
		});

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( jsonpCallback + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Delegate to script
		return "script";
	}
});




// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /javascript|ecmascript/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || document.getElementsByTagName( "head" )[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement( "script" );

				script.async = "async";

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( head && script.parentNode ) {
							head.removeChild( script );
						}

						// Dereference the script
						script = undefined;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};
				// Use insertBefore instead of appendChild  to circumvent an IE6 bug.
				// This arises when a base node is used (#2709 and #4378).
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( 0, 1 );
				}
			}
		};
	}
});




var // #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject ? function() {
		// Abort all pending requests
		for ( var key in xhrCallbacks ) {
			xhrCallbacks[ key ]( 0, 1 );
		}
	} : false,
	xhrId = 0,
	xhrCallbacks;

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject( "Microsoft.XMLHTTP" );
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Determine support properties
(function( xhr ) {
	jQuery.extend( jQuery.support, {
		ajax: !!xhr,
		cors: !!xhr && ( "withCredentials" in xhr )
	});
})( jQuery.ajaxSettings.xhr() );

// Create transport if the browser can provide an xhr
if ( jQuery.support.ajax ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var xhr = s.xhr(),
						handle,
						i;

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers[ "X-Requested-With" ] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( _ ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {

						var status,
							statusText,
							responseHeaders,
							responses,
							xml;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occured
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();
									responses = {};
									xml = xhr.responseXML;

									// Construct response list
									if ( xml && xml.documentElement /* #4958 */ ) {
										responses.xml = xml;
									}

									// When requesting binary data, IE6-9 will throw an exception
									// on any attempt to access responseText (#11426)
									try {
										responses.text = xhr.responseText;
									} catch( _ ) {
									}

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					// if we're in sync mode or it's in cache
					// and has been retrieved directly (IE6 & IE7)
					// we need to manually fire the callback
					if ( !s.async || xhr.readyState === 4 ) {
						callback();
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							// Create the active xhrs callbacks list if needed
							// and attach the unload handler
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							// Add to list of active xhrs callbacks
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback(0,1);
					}
				}
			};
		}
	});
}




var elemdisplay = {},
	iframe, iframeDoc,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,
	timerId,
	fxAttrs = [
		// height animations
		[ "height", "marginTop", "marginBottom", "paddingTop", "paddingBottom" ],
		// width animations
		[ "width", "marginLeft", "marginRight", "paddingLeft", "paddingRight" ],
		// opacity animations
		[ "opacity" ]
	],
	fxNow;

jQuery.fn.extend({
	show: function( speed, easing, callback ) {
		var elem, display;

		if ( speed || speed === 0 ) {
			return this.animate( genFx("show", 3), speed, easing, callback );

		} else {
			for ( var i = 0, j = this.length; i < j; i++ ) {
				elem = this[ i ];

				if ( elem.style ) {
					display = elem.style.display;

					// Reset the inline display of this element to learn if it is
					// being hidden by cascaded rules or not
					if ( !jQuery._data(elem, "olddisplay") && display === "none" ) {
						display = elem.style.display = "";
					}

					// Set elements which have been overridden with display: none
					// in a stylesheet to whatever the default browser style is
					// for such an element
					if ( (display === "" && jQuery.css(elem, "display") === "none") ||
						!jQuery.contains( elem.ownerDocument.documentElement, elem ) ) {
						jQuery._data( elem, "olddisplay", defaultDisplay(elem.nodeName) );
					}
				}
			}

			// Set the display of most of the elements in a second loop
			// to avoid the constant reflow
			for ( i = 0; i < j; i++ ) {
				elem = this[ i ];

				if ( elem.style ) {
					display = elem.style.display;

					if ( display === "" || display === "none" ) {
						elem.style.display = jQuery._data( elem, "olddisplay" ) || "";
					}
				}
			}

			return this;
		}
	},

	hide: function( speed, easing, callback ) {
		if ( speed || speed === 0 ) {
			return this.animate( genFx("hide", 3), speed, easing, callback);

		} else {
			var elem, display,
				i = 0,
				j = this.length;

			for ( ; i < j; i++ ) {
				elem = this[i];
				if ( elem.style ) {
					display = jQuery.css( elem, "display" );

					if ( display !== "none" && !jQuery._data( elem, "olddisplay" ) ) {
						jQuery._data( elem, "olddisplay", display );
					}
				}
			}

			// Set the display of the elements in a second loop
			// to avoid the constant reflow
			for ( i = 0; i < j; i++ ) {
				if ( this[i].style ) {
					this[i].style.display = "none";
				}
			}

			return this;
		}
	},

	// Save the old toggle function
	_toggle: jQuery.fn.toggle,

	toggle: function( fn, fn2, callback ) {
		var bool = typeof fn === "boolean";

		if ( jQuery.isFunction(fn) && jQuery.isFunction(fn2) ) {
			this._toggle.apply( this, arguments );

		} else if ( fn == null || bool ) {
			this.each(function() {
				var state = bool ? fn : jQuery(this).is(":hidden");
				jQuery(this)[ state ? "show" : "hide" ]();
			});

		} else {
			this.animate(genFx("toggle", 3), fn, fn2, callback);
		}

		return this;
	},

	fadeTo: function( speed, to, easing, callback ) {
		return this.filter(":hidden").css("opacity", 0).show().end()
					.animate({opacity: to}, speed, easing, callback);
	},

	animate: function( prop, speed, easing, callback ) {
		var optall = jQuery.speed( speed, easing, callback );

		if ( jQuery.isEmptyObject( prop ) ) {
			return this.each( optall.complete, [ false ] );
		}

		// Do not change referenced properties as per-property easing will be lost
		prop = jQuery.extend( {}, prop );

		function doAnimation() {
			// XXX 'this' does not always have a nodeName when running the
			// test suite

			if ( optall.queue === false ) {
				jQuery._mark( this );
			}

			var opt = jQuery.extend( {}, optall ),
				isElement = this.nodeType === 1,
				hidden = isElement && jQuery(this).is(":hidden"),
				name, val, p, e, hooks, replace,
				parts, start, end, unit,
				method;

			// will store per property easing and be used to determine when an animation is complete
			opt.animatedProperties = {};

			// first pass over propertys to expand / normalize
			for ( p in prop ) {
				name = jQuery.camelCase( p );
				if ( p !== name ) {
					prop[ name ] = prop[ p ];
					delete prop[ p ];
				}

				if ( ( hooks = jQuery.cssHooks[ name ] ) && "expand" in hooks ) {
					replace = hooks.expand( prop[ name ] );
					delete prop[ name ];

					// not quite $.extend, this wont overwrite keys already present.
					// also - reusing 'p' from above because we have the correct "name"
					for ( p in replace ) {
						if ( ! ( p in prop ) ) {
							prop[ p ] = replace[ p ];
						}
					}
				}
			}

			for ( name in prop ) {
				val = prop[ name ];
				// easing resolution: per property > opt.specialEasing > opt.easing > 'swing' (default)
				if ( jQuery.isArray( val ) ) {
					opt.animatedProperties[ name ] = val[ 1 ];
					val = prop[ name ] = val[ 0 ];
				} else {
					opt.animatedProperties[ name ] = opt.specialEasing && opt.specialEasing[ name ] || opt.easing || 'swing';
				}

				if ( val === "hide" && hidden || val === "show" && !hidden ) {
					return opt.complete.call( this );
				}

				if ( isElement && ( name === "height" || name === "width" ) ) {
					// Make sure that nothing sneaks out
					// Record all 3 overflow attributes because IE does not
					// change the overflow attribute when overflowX and
					// overflowY are set to the same value
					opt.overflow = [ this.style.overflow, this.style.overflowX, this.style.overflowY ];

					// Set display property to inline-block for height/width
					// animations on inline elements that are having width/height animated
					if ( jQuery.css( this, "display" ) === "inline" &&
							jQuery.css( this, "float" ) === "none" ) {

						// inline-level elements accept inline-block;
						// block-level elements need to be inline with layout
						if ( !jQuery.support.inlineBlockNeedsLayout || defaultDisplay( this.nodeName ) === "inline" ) {
							this.style.display = "inline-block";

						} else {
							this.style.zoom = 1;
						}
					}
				}
			}

			if ( opt.overflow != null ) {
				this.style.overflow = "hidden";
			}

			for ( p in prop ) {
				e = new jQuery.fx( this, opt, p );
				val = prop[ p ];

				if ( rfxtypes.test( val ) ) {

					// Tracks whether to show or hide based on private
					// data attached to the element
					method = jQuery._data( this, "toggle" + p ) || ( val === "toggle" ? hidden ? "show" : "hide" : 0 );
					if ( method ) {
						jQuery._data( this, "toggle" + p, method === "show" ? "hide" : "show" );
						e[ method ]();
					} else {
						e[ val ]();
					}

				} else {
					parts = rfxnum.exec( val );
					start = e.cur();

					if ( parts ) {
						end = parseFloat( parts[2] );
						unit = parts[3] || ( jQuery.cssNumber[ p ] ? "" : "px" );

						// We need to compute starting value
						if ( unit !== "px" ) {
							jQuery.style( this, p, (end || 1) + unit);
							start = ( (end || 1) / e.cur() ) * start;
							jQuery.style( this, p, start + unit);
						}

						// If a +=/-= token was provided, we're doing a relative animation
						if ( parts[1] ) {
							end = ( (parts[ 1 ] === "-=" ? -1 : 1) * end ) + start;
						}

						e.custom( start, end, unit );

					} else {
						e.custom( start, val, "" );
					}
				}
			}

			// For JS strict compliance
			return true;
		}

		return optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},

	stop: function( type, clearQueue, gotoEnd ) {
		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var index,
				hadTimers = false,
				timers = jQuery.timers,
				data = jQuery._data( this );

			// clear marker counters if we know they won't be
			if ( !gotoEnd ) {
				jQuery._unmark( true, this );
			}

			function stopQueue( elem, data, index ) {
				var hooks = data[ index ];
				jQuery.removeData( elem, index, true );
				hooks.stop( gotoEnd );
			}

			if ( type == null ) {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && index.indexOf(".run") === index.length - 4 ) {
						stopQueue( this, data, index );
					}
				}
			} else if ( data[ index = type + ".run" ] && data[ index ].stop ){
				stopQueue( this, data, index );
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					if ( gotoEnd ) {

						// force the next step to be the last
						timers[ index ]( true );
					} else {
						timers[ index ].saveState();
					}
					hadTimers = true;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( !( gotoEnd && hadTimers ) ) {
				jQuery.dequeue( this, type );
			}
		});
	}

});

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout( clearFxNow, 0 );
	return ( fxNow = jQuery.now() );
}

function clearFxNow() {
	fxNow = undefined;
}

// Generate parameters to create a standard animation
function genFx( type, num ) {
	var obj = {};

	jQuery.each( fxAttrs.concat.apply([], fxAttrs.slice( 0, num )), function() {
		obj[ this ] = type;
	});

	return obj;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx( "show", 1 ),
	slideUp: genFx( "hide", 1 ),
	slideToggle: genFx( "toggle", 1 ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.extend({
	speed: function( speed, easing, fn ) {
		var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
			complete: fn || !fn && easing ||
				jQuery.isFunction( speed ) && speed,
			duration: speed,
			easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
		};

		opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
			opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

		// normalize opt.queue - true/undefined/null -> "fx"
		if ( opt.queue == null || opt.queue === true ) {
			opt.queue = "fx";
		}

		// Queueing
		opt.old = opt.complete;

		opt.complete = function( noUnmark ) {
			if ( jQuery.isFunction( opt.old ) ) {
				opt.old.call( this );
			}

			if ( opt.queue ) {
				jQuery.dequeue( this, opt.queue );
			} else if ( noUnmark !== false ) {
				jQuery._unmark( this );
			}
		};

		return opt;
	},

	easing: {
		linear: function( p ) {
			return p;
		},
		swing: function( p ) {
			return ( -Math.cos( p*Math.PI ) / 2 ) + 0.5;
		}
	},

	timers: [],

	fx: function( elem, options, prop ) {
		this.options = options;
		this.elem = elem;
		this.prop = prop;

		options.orig = options.orig || {};
	}

});

jQuery.fx.prototype = {
	// Simple function for setting a style value
	update: function() {
		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		( jQuery.fx.step[ this.prop ] || jQuery.fx.step._default )( this );
	},

	// Get the current size
	cur: function() {
		if ( this.elem[ this.prop ] != null && (!this.elem.style || this.elem.style[ this.prop ] == null) ) {
			return this.elem[ this.prop ];
		}

		var parsed,
			r = jQuery.css( this.elem, this.prop );
		// Empty strings, null, undefined and "auto" are converted to 0,
		// complex values such as "rotate(1rad)" are returned as is,
		// simple values such as "10px" are parsed to Float.
		return isNaN( parsed = parseFloat( r ) ) ? !r || r === "auto" ? 0 : r : parsed;
	},

	// Start an animation from one number to another
	custom: function( from, to, unit ) {
		var self = this,
			fx = jQuery.fx;

		this.startTime = fxNow || createFxNow();
		this.end = to;
		this.now = this.start = from;
		this.pos = this.state = 0;
		this.unit = unit || this.unit || ( jQuery.cssNumber[ this.prop ] ? "" : "px" );

		function t( gotoEnd ) {
			return self.step( gotoEnd );
		}

		t.queue = this.options.queue;
		t.elem = this.elem;
		t.saveState = function() {
			if ( jQuery._data( self.elem, "fxshow" + self.prop ) === undefined ) {
				if ( self.options.hide ) {
					jQuery._data( self.elem, "fxshow" + self.prop, self.start );
				} else if ( self.options.show ) {
					jQuery._data( self.elem, "fxshow" + self.prop, self.end );
				}
			}
		};

		if ( t() && jQuery.timers.push(t) && !timerId ) {
			timerId = setInterval( fx.tick, fx.interval );
		}
	},

	// Simple 'show' function
	show: function() {
		var dataShow = jQuery._data( this.elem, "fxshow" + this.prop );

		// Remember where we started, so that we can go back to it later
		this.options.orig[ this.prop ] = dataShow || jQuery.style( this.elem, this.prop );
		this.options.show = true;

		// Begin the animation
		// Make sure that we start at a small width/height to avoid any flash of content
		if ( dataShow !== undefined ) {
			// This show is picking up where a previous hide or show left off
			this.custom( this.cur(), dataShow );
		} else {
			this.custom( this.prop === "width" || this.prop === "height" ? 1 : 0, this.cur() );
		}

		// Start by showing the element
		jQuery( this.elem ).show();
	},

	// Simple 'hide' function
	hide: function() {
		// Remember where we started, so that we can go back to it later
		this.options.orig[ this.prop ] = jQuery._data( this.elem, "fxshow" + this.prop ) || jQuery.style( this.elem, this.prop );
		this.options.hide = true;

		// Begin the animation
		this.custom( this.cur(), 0 );
	},

	// Each step of an animation
	step: function( gotoEnd ) {
		var p, n, complete,
			t = fxNow || createFxNow(),
			done = true,
			elem = this.elem,
			options = this.options;

		if ( gotoEnd || t >= options.duration + this.startTime ) {
			this.now = this.end;
			this.pos = this.state = 1;
			this.update();

			options.animatedProperties[ this.prop ] = true;

			for ( p in options.animatedProperties ) {
				if ( options.animatedProperties[ p ] !== true ) {
					done = false;
				}
			}

			if ( done ) {
				// Reset the overflow
				if ( options.overflow != null && !jQuery.support.shrinkWrapBlocks ) {

					jQuery.each( [ "", "X", "Y" ], function( index, value ) {
						elem.style[ "overflow" + value ] = options.overflow[ index ];
					});
				}

				// Hide the element if the "hide" operation was done
				if ( options.hide ) {
					jQuery( elem ).hide();
				}

				// Reset the properties, if the item has been hidden or shown
				if ( options.hide || options.show ) {
					for ( p in options.animatedProperties ) {
						jQuery.style( elem, p, options.orig[ p ] );
						jQuery.removeData( elem, "fxshow" + p, true );
						// Toggle data is no longer needed
						jQuery.removeData( elem, "toggle" + p, true );
					}
				}

				// Execute the complete function
				// in the event that the complete function throws an exception
				// we must ensure it won't be called twice. #5684

				complete = options.complete;
				if ( complete ) {

					options.complete = false;
					complete.call( elem );
				}
			}

			return false;

		} else {
			// classical easing cannot be used with an Infinity duration
			if ( options.duration == Infinity ) {
				this.now = t;
			} else {
				n = t - this.startTime;
				this.state = n / options.duration;

				// Perform the easing function, defaults to swing
				this.pos = jQuery.easing[ options.animatedProperties[this.prop] ]( this.state, n, 0, 1, options.duration );
				this.now = this.start + ( (this.end - this.start) * this.pos );
			}
			// Perform the next step of the animation
			this.update();
		}

		return true;
	}
};

jQuery.extend( jQuery.fx, {
	tick: function() {
		var timer,
			timers = jQuery.timers,
			i = 0;

		for ( ; i < timers.length; i++ ) {
			timer = timers[ i ];
			// Checks the timer has not already been removed
			if ( !timer() && timers[ i ] === timer ) {
				timers.splice( i--, 1 );
			}
		}

		if ( !timers.length ) {
			jQuery.fx.stop();
		}
	},

	interval: 13,

	stop: function() {
		clearInterval( timerId );
		timerId = null;
	},

	speeds: {
		slow: 600,
		fast: 200,
		// Default speed
		_default: 400
	},

	step: {
		opacity: function( fx ) {
			jQuery.style( fx.elem, "opacity", fx.now );
		},

		_default: function( fx ) {
			if ( fx.elem.style && fx.elem.style[ fx.prop ] != null ) {
				fx.elem.style[ fx.prop ] = fx.now + fx.unit;
			} else {
				fx.elem[ fx.prop ] = fx.now;
			}
		}
	}
});

// Ensure props that can't be negative don't go there on undershoot easing
jQuery.each( fxAttrs.concat.apply( [], fxAttrs ), function( i, prop ) {
	// exclude marginTop, marginLeft, marginBottom and marginRight from this list
	if ( prop.indexOf( "margin" ) ) {
		jQuery.fx.step[ prop ] = function( fx ) {
			jQuery.style( fx.elem, prop, Math.max(0, fx.now) + fx.unit );
		};
	}
});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}

// Try to restore the default display value of an element
function defaultDisplay( nodeName ) {

	if ( !elemdisplay[ nodeName ] ) {

		var body = document.body,
			elem = jQuery( "<" + nodeName + ">" ).appendTo( body ),
			display = elem.css( "display" );
		elem.remove();

		// If the simple way fails,
		// get element's real default display by attaching it to a temp iframe
		if ( display === "none" || display === "" ) {
			// No iframe to use yet, so create it
			if ( !iframe ) {
				iframe = document.createElement( "iframe" );
				iframe.frameBorder = iframe.width = iframe.height = 0;
			}

			body.appendChild( iframe );

			// Create a cacheable copy of the iframe document on first call.
			// IE and Opera will allow us to reuse the iframeDoc without re-writing the fake HTML
			// document to it; WebKit & Firefox won't allow reusing the iframe document.
			if ( !iframeDoc || !iframe.createElement ) {
				iframeDoc = ( iframe.contentWindow || iframe.contentDocument ).document;
				iframeDoc.write( ( jQuery.support.boxModel ? "<!doctype html>" : "" ) + "<html><body>" );
				iframeDoc.close();
			}

			elem = iframeDoc.createElement( nodeName );

			iframeDoc.body.appendChild( elem );

			display = jQuery.css( elem, "display" );
			body.removeChild( iframe );
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return elemdisplay[ nodeName ];
}




var getOffset,
	rtable = /^t(?:able|d|h)$/i,
	rroot = /^(?:body|html)$/i;

if ( "getBoundingClientRect" in document.documentElement ) {
	getOffset = function( elem, doc, docElem, box ) {
		try {
			box = elem.getBoundingClientRect();
		} catch(e) {}

		// Make sure we're not dealing with a disconnected DOM node
		if ( !box || !jQuery.contains( docElem, elem ) ) {
			return box ? { top: box.top, left: box.left } : { top: 0, left: 0 };
		}

		var body = doc.body,
			win = getWindow( doc ),
			clientTop  = docElem.clientTop  || body.clientTop  || 0,
			clientLeft = docElem.clientLeft || body.clientLeft || 0,
			scrollTop  = win.pageYOffset || jQuery.support.boxModel && docElem.scrollTop  || body.scrollTop,
			scrollLeft = win.pageXOffset || jQuery.support.boxModel && docElem.scrollLeft || body.scrollLeft,
			top  = box.top  + scrollTop  - clientTop,
			left = box.left + scrollLeft - clientLeft;

		return { top: top, left: left };
	};

} else {
	getOffset = function( elem, doc, docElem ) {
		var computedStyle,
			offsetParent = elem.offsetParent,
			prevOffsetParent = elem,
			body = doc.body,
			defaultView = doc.defaultView,
			prevComputedStyle = defaultView ? defaultView.getComputedStyle( elem, null ) : elem.currentStyle,
			top = elem.offsetTop,
			left = elem.offsetLeft;

		while ( (elem = elem.parentNode) && elem !== body && elem !== docElem ) {
			if ( jQuery.support.fixedPosition && prevComputedStyle.position === "fixed" ) {
				break;
			}

			computedStyle = defaultView ? defaultView.getComputedStyle(elem, null) : elem.currentStyle;
			top  -= elem.scrollTop;
			left -= elem.scrollLeft;

			if ( elem === offsetParent ) {
				top  += elem.offsetTop;
				left += elem.offsetLeft;

				if ( jQuery.support.doesNotAddBorder && !(jQuery.support.doesAddBorderForTableAndCells && rtable.test(elem.nodeName)) ) {
					top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
					left += parseFloat( computedStyle.borderLeftWidth ) || 0;
				}

				prevOffsetParent = offsetParent;
				offsetParent = elem.offsetParent;
			}

			if ( jQuery.support.subtractsBorderForOverflowNotVisible && computedStyle.overflow !== "visible" ) {
				top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
				left += parseFloat( computedStyle.borderLeftWidth ) || 0;
			}

			prevComputedStyle = computedStyle;
		}

		if ( prevComputedStyle.position === "relative" || prevComputedStyle.position === "static" ) {
			top  += body.offsetTop;
			left += body.offsetLeft;
		}

		if ( jQuery.support.fixedPosition && prevComputedStyle.position === "fixed" ) {
			top  += Math.max( docElem.scrollTop, body.scrollTop );
			left += Math.max( docElem.scrollLeft, body.scrollLeft );
		}

		return { top: top, left: left };
	};
}

jQuery.fn.offset = function( options ) {
	if ( arguments.length ) {
		return options === undefined ?
			this :
			this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
	}

	var elem = this[0],
		doc = elem && elem.ownerDocument;

	if ( !doc ) {
		return null;
	}

	if ( elem === doc.body ) {
		return jQuery.offset.bodyOffset( elem );
	}

	return getOffset( elem, doc, doc.documentElement );
};

jQuery.offset = {

	bodyOffset: function( body ) {
		var top = body.offsetTop,
			left = body.offsetLeft;

		if ( jQuery.support.doesNotIncludeMarginInBodyOffset ) {
			top  += parseFloat( jQuery.css(body, "marginTop") ) || 0;
			left += parseFloat( jQuery.css(body, "marginLeft") ) || 0;
		}

		return { top: top, left: left };
	},

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[0] ) {
			return null;
		}

		var elem = this[0],

		// Get *real* offsetParent
		offsetParent = this.offsetParent(),

		// Get correct offsets
		offset       = this.offset(),
		parentOffset = rroot.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();

		// Subtract element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		offset.top  -= parseFloat( jQuery.css(elem, "marginTop") ) || 0;
		offset.left -= parseFloat( jQuery.css(elem, "marginLeft") ) || 0;

		// Add offsetParent borders
		parentOffset.top  += parseFloat( jQuery.css(offsetParent[0], "borderTopWidth") ) || 0;
		parentOffset.left += parseFloat( jQuery.css(offsetParent[0], "borderLeftWidth") ) || 0;

		// Subtract the two offsets
		return {
			top:  offset.top  - parentOffset.top,
			left: offset.left - parentOffset.left
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || document.body;
			while ( offsetParent && (!rroot.test(offsetParent.nodeName) && jQuery.css(offsetParent, "position") === "static") ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return jQuery.access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? (prop in win) ? win[ prop ] :
					jQuery.support.boxModel && win.document.documentElement[ method ] ||
						win.document.body[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					 top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}




// Create width, height, innerHeight, innerWidth, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	var clientProp = "client" + name,
		scrollProp = "scroll" + name,
		offsetProp = "offset" + name;

	// innerHeight and innerWidth
	jQuery.fn[ "inner" + name ] = function() {
		var elem = this[0];
		return elem ?
			elem.style ?
			parseFloat( jQuery.css( elem, type, "padding" ) ) :
			this[ type ]() :
			null;
	};

	// outerHeight and outerWidth
	jQuery.fn[ "outer" + name ] = function( margin ) {
		var elem = this[0];
		return elem ?
			elem.style ?
			parseFloat( jQuery.css( elem, type, margin ? "margin" : "border" ) ) :
			this[ type ]() :
			null;
	};

	jQuery.fn[ type ] = function( value ) {
		return jQuery.access( this, function( elem, type, value ) {
			var doc, docElemProp, orig, ret;

			if ( jQuery.isWindow( elem ) ) {
				// 3rd condition allows Nokia support, as it supports the docElem prop but not CSS1Compat
				doc = elem.document;
				docElemProp = doc.documentElement[ clientProp ];
				return jQuery.support.boxModel && docElemProp ||
					doc.body && doc.body[ clientProp ] || docElemProp;
			}

			// Get document width or height
			if ( elem.nodeType === 9 ) {
				// Either scroll[Width/Height] or offset[Width/Height], whichever is greater
				doc = elem.documentElement;

				// when a window > document, IE6 reports a offset[Width/Height] > client[Width/Height]
				// so we can't use max, as it'll choose the incorrect offset[Width/Height]
				// instead we use the correct client[Width/Height]
				// support:IE6
				if ( doc[ clientProp ] >= doc[ scrollProp ] ) {
					return doc[ clientProp ];
				}

				return Math.max(
					elem.body[ scrollProp ], doc[ scrollProp ],
					elem.body[ offsetProp ], doc[ offsetProp ]
				);
			}

			// Get width or height on the element
			if ( value === undefined ) {
				orig = jQuery.css( elem, type );
				ret = parseFloat( orig );
				return jQuery.isNumeric( ret ) ? ret : orig;
			}

			// Set the width or height on the element
			jQuery( elem ).css( type, value );
		}, type, value, arguments.length, null );
	};
});




// Expose jQuery to the global object
window.jQuery = window.$ = jQuery;

// Expose jQuery as an AMD module, but only for AMD loaders that
// understand the issues with loading multiple versions of jQuery
// in a page that all might call define(). The loader will indicate
// they have special allowances for multiple jQuery versions by
// specifying define.amd.jQuery = true. Register as a named module,
// since jQuery can be concatenated with other files that may use define,
// but not use a proper concatenation script that understands anonymous
// AMD modules. A named AMD is safest and most robust way to register.
// Lowercase jquery is used because AMD module names are derived from
// file names, and jQuery is normally delivered in a lowercase file name.
// Do this after creating the global so that if an AMD module wants to call
// noConflict to hide this version of jQuery, it will work.
if ( typeof define === "function" && define.amd && define.amd.jQuery ) {
	define( "jquery", [], function () { return jQuery; } );
}



})( window );
(function($, undefined) {

/**
 * Unobtrusive scripting adapter for jQuery
 *
 * Requires jQuery 1.6.0 or later.
 * https://github.com/rails/jquery-ujs

 * Uploading file using rails.js
 * =============================
 *
 * By default, browsers do not allow files to be uploaded via AJAX. As a result, if there are any non-blank file fields
 * in the remote form, this adapter aborts the AJAX submission and allows the form to submit through standard means.
 *
 * The `ajax:aborted:file` event allows you to bind your own handler to process the form submission however you wish.
 *
 * Ex:
 *     $('form').live('ajax:aborted:file', function(event, elements){
 *       // Implement own remote file-transfer handler here for non-blank file inputs passed in `elements`.
 *       // Returning false in this handler tells rails.js to disallow standard form submission
 *       return false;
 *     });
 *
 * The `ajax:aborted:file` event is fired when a file-type input is detected with a non-blank value.
 *
 * Third-party tools can use this hook to detect when an AJAX file upload is attempted, and then use
 * techniques like the iframe method to upload the file instead.
 *
 * Required fields in rails.js
 * ===========================
 *
 * If any blank required inputs (required="required") are detected in the remote form, the whole form submission
 * is canceled. Note that this is unlike file inputs, which still allow standard (non-AJAX) form submission.
 *
 * The `ajax:aborted:required` event allows you to bind your own handler to inform the user of blank required inputs.
 *
 * !! Note that Opera does not fire the form's submit event if there are blank required inputs, so this event may never
 *    get fired in Opera. This event is what causes other browsers to exhibit the same submit-aborting behavior.
 *
 * Ex:
 *     $('form').live('ajax:aborted:required', function(event, elements){
 *       // Returning false in this handler tells rails.js to submit the form anyway.
 *       // The blank required inputs are passed to this function in `elements`.
 *       return ! confirm("Would you like to submit the form with missing info?");
 *     });
 */

  // Shorthand to make it a little easier to call public rails functions from within rails.js
  var rails;

  $.rails = rails = {
    // Link elements bound by jquery-ujs
    linkClickSelector: 'a[data-confirm], a[data-method], a[data-remote], a[data-disable-with]',

    // Select elements bound by jquery-ujs
    inputChangeSelector: 'select[data-remote], input[data-remote], textarea[data-remote]',

    // Form elements bound by jquery-ujs
    formSubmitSelector: 'form',

    // Form input elements bound by jquery-ujs
    formInputClickSelector: 'form input[type=submit], form input[type=image], form button[type=submit], form button:not(button[type])',

    // Form input elements disabled during form submission
    disableSelector: 'input[data-disable-with], button[data-disable-with], textarea[data-disable-with]',

    // Form input elements re-enabled after form submission
    enableSelector: 'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled',

    // Form required input elements
    requiredInputSelector: 'input[name][required]:not([disabled]),textarea[name][required]:not([disabled])',

    // Form file input elements
    fileInputSelector: 'input:file',

    // Link onClick disable selector with possible reenable after remote submission
    linkDisableSelector: 'a[data-disable-with]',

    // Make sure that every Ajax request sends the CSRF token
    CSRFProtection: function(xhr) {
      var token = $('meta[name="csrf-token"]').attr('content');
      if (token) xhr.setRequestHeader('X-CSRF-Token', token);
    },

    // Triggers an event on an element and returns false if the event result is false
    fire: function(obj, name, data) {
      var event = $.Event(name);
      obj.trigger(event, data);
      return event.result !== false;
    },

    // Default confirm dialog, may be overridden with custom confirm dialog in $.rails.confirm
    confirm: function(message) {
      return confirm(message);
    },

    // Default ajax function, may be overridden with custom function in $.rails.ajax
    ajax: function(options) {
      return $.ajax(options);
    },

    // Default way to get an element's href. May be overridden at $.rails.href.
    href: function(element) {
      return element.attr('href');
    },

    // Submits "remote" forms and links with ajax
    handleRemote: function(element) {
      var method, url, data, crossDomain, dataType, options;

      if (rails.fire(element, 'ajax:before')) {
        crossDomain = element.data('cross-domain') || null;
        dataType = element.data('type') || ($.ajaxSettings && $.ajaxSettings.dataType);

        if (element.is('form')) {
          method = element.attr('method');
          url = element.attr('action');
          data = element.serializeArray();
          // memoized value from clicked submit button
          var button = element.data('ujs:submit-button');
          if (button) {
            data.push(button);
            element.data('ujs:submit-button', null);
          }
        } else if (element.is(rails.inputChangeSelector)) {
          method = element.data('method');
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + "&" + element.data('params');
        } else {
          method = element.data('method');
          url = rails.href(element);
          data = element.data('params') || null;
        }

        options = {
          type: method || 'GET', data: data, dataType: dataType, crossDomain: crossDomain,
          // stopping the "ajax:beforeSend" event will cancel the ajax request
          beforeSend: function(xhr, settings) {
            if (settings.dataType === undefined) {
              xhr.setRequestHeader('accept', '*/*;q=0.5, ' + settings.accepts.script);
            }
            return rails.fire(element, 'ajax:beforeSend', [xhr, settings]);
          },
          success: function(data, status, xhr) {
            element.trigger('ajax:success', [data, status, xhr]);
          },
          complete: function(xhr, status) {
            element.trigger('ajax:complete', [xhr, status]);
          },
          error: function(xhr, status, error) {
            element.trigger('ajax:error', [xhr, status, error]);
          }
        };
        // Only pass url to `ajax` options if not blank
        if (url) { options.url = url; }

        return rails.ajax(options);
      } else {
        return false;
      }
    },

    // Handles "data-method" on links such as:
    // <a href="/users/5" data-method="delete" rel="nofollow" data-confirm="Are you sure?">Delete</a>
    handleMethod: function(link) {
      var href = rails.href(link),
        method = link.data('method'),
        target = link.attr('target'),
        csrf_token = $('meta[name=csrf-token]').attr('content'),
        csrf_param = $('meta[name=csrf-param]').attr('content'),
        form = $('<form method="post" action="' + href + '"></form>'),
        metadata_input = '<input name="_method" value="' + method + '" type="hidden" />';

      if (csrf_param !== undefined && csrf_token !== undefined) {
        metadata_input += '<input name="' + csrf_param + '" value="' + csrf_token + '" type="hidden" />';
      }

      if (target) { form.attr('target', target); }

      form.hide().append(metadata_input).appendTo('body');
      form.submit();
    },

    /* Disables form elements:
      - Caches element value in 'ujs:enable-with' data store
      - Replaces element text with value of 'data-disable-with' attribute
      - Sets disabled property to true
    */
    disableFormElements: function(form) {
      form.find(rails.disableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        element.data('ujs:enable-with', element[method]());
        element[method](element.data('disable-with'));
        element.prop('disabled', true);
      });
    },

    /* Re-enables disabled form elements:
      - Replaces element text with cached value from 'ujs:enable-with' data store (created in `disableFormElements`)
      - Sets disabled property to false
    */
    enableFormElements: function(form) {
      form.find(rails.enableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        if (element.data('ujs:enable-with')) element[method](element.data('ujs:enable-with'));
        element.prop('disabled', false);
      });
    },

   /* For 'data-confirm' attribute:
      - Fires `confirm` event
      - Shows the confirmation dialog
      - Fires the `confirm:complete` event

      Returns `true` if no function stops the chain and user chose yes; `false` otherwise.
      Attaching a handler to the element's `confirm` event that returns a `falsy` value cancels the confirmation dialog.
      Attaching a handler to the element's `confirm:complete` event that returns a `falsy` value makes this function
      return false. The `confirm:complete` event is fired whether or not the user answered true or false to the dialog.
   */
    allowAction: function(element) {
      var message = element.data('confirm'),
          answer = false, callback;
      if (!message) { return true; }

      if (rails.fire(element, 'confirm')) {
        answer = rails.confirm(message);
        callback = rails.fire(element, 'confirm:complete', [answer]);
      }
      return answer && callback;
    },

    // Helper function which checks for blank inputs in a form that match the specified CSS selector
    blankInputs: function(form, specifiedSelector, nonBlank) {
      var inputs = $(), input,
        selector = specifiedSelector || 'input,textarea';
      form.find(selector).each(function() {
        input = $(this);
        // Collect non-blank inputs if nonBlank option is true, otherwise, collect blank inputs
        if (nonBlank ? input.val() : !input.val()) {
          inputs = inputs.add(input);
        }
      });
      return inputs.length ? inputs : false;
    },

    // Helper function which checks for non-blank inputs in a form that match the specified CSS selector
    nonBlankInputs: function(form, specifiedSelector) {
      return rails.blankInputs(form, specifiedSelector, true); // true specifies nonBlank
    },

    // Helper function, needed to provide consistent behavior in IE
    stopEverything: function(e) {
      $(e.target).trigger('ujs:everythingStopped');
      e.stopImmediatePropagation();
      return false;
    },

    // find all the submit events directly bound to the form and
    // manually invoke them. If anyone returns false then stop the loop
    callFormSubmitBindings: function(form, event) {
      var events = form.data('events'), continuePropagation = true;
      if (events !== undefined && events['submit'] !== undefined) {
        $.each(events['submit'], function(i, obj){
          if (typeof obj.handler === 'function') return continuePropagation = obj.handler(event);
        });
      }
      return continuePropagation;
    },

    //  replace element's html with the 'data-disable-with' after storing original html
    //  and prevent clicking on it
    disableElement: function(element) {
      element.data('ujs:enable-with', element.html()); // store enabled state
      element.html(element.data('disable-with')); // set to disabled state
      element.bind('click.railsDisable', function(e) { // prevent further clicking
        return rails.stopEverything(e)
      });
    },

    // restore element to its original state which was disabled by 'disableElement' above
    enableElement: function(element) {
      if (element.data('ujs:enable-with') !== undefined) {
        element.html(element.data('ujs:enable-with')); // set to old enabled state
        // this should be element.removeData('ujs:enable-with')
        // but, there is currently a bug in jquery which makes hyphenated data attributes not get removed
        element.data('ujs:enable-with', false); // clean up cache
      }
      element.unbind('click.railsDisable'); // enable element
    }

  };

  $.ajaxPrefilter(function(options, originalOptions, xhr){ if ( !options.crossDomain ) { rails.CSRFProtection(xhr); }});

  $(document).delegate(rails.linkDisableSelector, 'ajax:complete', function() {
      rails.enableElement($(this));
  });

  $(document).delegate(rails.linkClickSelector, 'click.rails', function(e) {
    var link = $(this), method = link.data('method'), data = link.data('params');
    if (!rails.allowAction(link)) return rails.stopEverything(e);

    if (link.is(rails.linkDisableSelector)) rails.disableElement(link);

    if (link.data('remote') !== undefined) {
      if ( (e.metaKey || e.ctrlKey) && (!method || method === 'GET') && !data ) { return true; }

      if (rails.handleRemote(link) === false) { rails.enableElement(link); }
      return false;

    } else if (link.data('method')) {
      rails.handleMethod(link);
      return false;
    }
  });

  $(document).delegate(rails.inputChangeSelector, 'change.rails', function(e) {
    var link = $(this);
    if (!rails.allowAction(link)) return rails.stopEverything(e);

    rails.handleRemote(link);
    return false;
  });

  $(document).delegate(rails.formSubmitSelector, 'submit.rails', function(e) {
    var form = $(this),
      remote = form.data('remote') !== undefined,
      blankRequiredInputs = rails.blankInputs(form, rails.requiredInputSelector),
      nonBlankFileInputs = rails.nonBlankInputs(form, rails.fileInputSelector);

    if (!rails.allowAction(form)) return rails.stopEverything(e);

    // skip other logic when required values are missing or file upload is present
    if (blankRequiredInputs && form.attr("novalidate") == undefined && rails.fire(form, 'ajax:aborted:required', [blankRequiredInputs])) {
      return rails.stopEverything(e);
    }

    if (remote) {
      if (nonBlankFileInputs) {
        return rails.fire(form, 'ajax:aborted:file', [nonBlankFileInputs]);
      }

      // If browser does not support submit bubbling, then this live-binding will be called before direct
      // bindings. Therefore, we should directly call any direct bindings before remotely submitting form.
      if (!$.support.submitBubbles && $().jquery < '1.7' && rails.callFormSubmitBindings(form, e) === false) return rails.stopEverything(e);

      rails.handleRemote(form);
      return false;

    } else {
      // slight timeout so that the submit button gets properly serialized
      setTimeout(function(){ rails.disableFormElements(form); }, 13);
    }
  });

  $(document).delegate(rails.formInputClickSelector, 'click.rails', function(event) {
    var button = $(this);

    if (!rails.allowAction(button)) return rails.stopEverything(event);

    // register the pressed submit button
    var name = button.attr('name'),
      data = name ? {name:name, value:button.val()} : null;

    button.closest('form').data('ujs:submit-button', data);
  });

  $(document).delegate(rails.formSubmitSelector, 'ajax:beforeSend.rails', function(event) {
    if (this == event.target) rails.disableFormElements($(this));
  });

  $(document).delegate(rails.formSubmitSelector, 'ajax:complete.rails', function(event) {
    if (this == event.target) rails.enableFormElements($(this));
  });

})( jQuery );
/*
 Highstock JS v1.1.4 (2012-02-15)

 (c) 2009-2011 Torstein H?nsi

 License: www.highcharts.com/license
*/

(function(){function E(a,b){var c;a||(a={});for(c in b)a[c]=b[c];return a}function ja(){for(var a=0,b=arguments,c=b.length,d={};a<c;a++)d[b[a++]]=b[a];return d}function N(a,b){return parseInt(a,b||10)}function zb(a){return typeof a==="string"}function rb(a){return typeof a==="object"}function ic(a){return Object.prototype.toString.call(a)==="[object Array]"}function Sb(a){return typeof a==="number"}function Eb(a){return sa.log(a)/sa.LN10}function rc(a){return sa.pow(10,a)}function Fb(a,b){for(var c=
a.length;c--;)if(a[c]===b){a.splice(c,1);break}}function A(a){return a!==G&&a!==null}function R(a,b,c){var d,e;if(zb(b))A(c)?a.setAttribute(b,c):a&&a.getAttribute&&(e=a.getAttribute(b));else if(A(b)&&rb(b))for(d in b)a.setAttribute(d,b[d]);return e}function sb(a){return ic(a)?a:[a]}function r(){var a=arguments,b,c,d=a.length;for(b=0;b<d;b++)if(c=a[b],typeof c!=="undefined"&&c!==null)return c}function J(a,b){if(Tb&&b&&b.opacity!==G)b.filter="alpha(opacity="+b.opacity*100+")";E(a.style,b)}function na(a,
b,c,d,e){a=S.createElement(a);b&&E(a,b);e&&J(a,{padding:0,border:oa,margin:0});c&&J(a,c);d&&d.appendChild(a);return a}function pa(a,b){var c=function(){};c.prototype=new a;E(c.prototype,b);return c}function Ub(a,b,c,d){var e=X.lang,f=isNaN(b=Ba(b))?2:b,b=c===void 0?e.decimalPoint:c,d=d===void 0?e.thousandsSep:d,e=a<0?"-":"",c=String(N(a=Ba(+a||0).toFixed(f))),g=c.length>3?c.length%3:0;return e+(g?c.substr(0,g)+d:"")+c.substr(g).replace(/(\d{3})(?=\d)/g,"$1"+d)+(f?b+Ba(a-c).toFixed(f).slice(2):"")}
function sc(a,b,c,d){var e,c=r(c,1);e=a/c;if(!b&&(b=[1,2,2.5,5,10],d&&(d.allowDecimals===!1||d.type==="logarithmic")))c===1?b=[1,2,5,10]:c<=0.1&&(b=[1/c]);for(d=0;d<b.length;d++)if(a=b[d],e<=(b[d]+(b[d+1]||b[d]))/2)break;a*=c;return a}function tc(a,b){var c=b||[[tb,[1,2,5,10,20,25,50,100,200,500]],[kb,[1,2,5,10,15,30]],[db,[1,2,5,10,15,30]],[za,[1,2,3,4,6,8,12]],[ka,[1,2]],[Ca,[1,2]],[Ka,[1,2,3,4,6]],[La,null]],d=c[c.length-1],e=D[d[0]],f=d[1],g;for(g=0;g<c.length;g++)if(d=c[g],e=D[d[0]],f=d[1],c[g+
1]&&a<=(e*f[f.length-1]+D[c[g+1][0]])/2)break;e===D[La]&&a<5*e&&(f=[1,2,5]);e===D[La]&&a<5*e&&(f=[1,2,5]);c=sc(a/e,f);return{unitRange:e,count:c,unitName:d[0]}}function Vb(a,b,c,d){var e=[],f={},g=X.global.useUTC,h,j=new Date(b),b=a.unitRange,k=a.count;j.setMilliseconds(0);b>=D[kb]&&j.setSeconds(b>=D[db]?0:k*Na(j.getSeconds()/k));if(b>=D[db])j[uc](b>=D[za]?0:k*Na(j[jc]()/k));if(b>=D[za])j[vc](b>=D[ka]?0:k*Na(j[kc]()/k));if(b>=D[ka])j[lc](b>=D[Ka]?1:k*Na(j[eb]()/k));b>=D[Ka]&&(j[wc](b>=D[La]?0:k*Na(j[Wb]()/
k)),h=j[Xb]());b>=D[La]&&(h-=h%k,j[xc](h));if(b===D[Ca])j[lc](j[eb]()-j[mc]()+r(d,1));d=1;h=j[Xb]();for(var i=j.getTime(),l=j[Wb](),j=j[eb]();i<c;)e.push(i),b===D[La]?i=Yb(h+d*k,0):b===D[Ka]?i=Yb(h,l+d*k):!g&&(b===D[ka]||b===D[Ca])?i=Yb(h,l,j+d*k*(b===D[ka]?1:7)):(i+=b*k,b<=D[za]&&i%D[ka]===0&&(f[i]=ka)),d++;e.push(i);e.info=E(a,{higherRanks:f,totalRange:b*k});return e}function yc(){this.symbol=this.color=0}function Nc(a,b,c,d,e,f,g,h,j){var k=g.x,g=g.y,j=k+c+(j?h:-a-h),i=g-b+d+15,l;j<7&&(j=c+k+h);
j+a>c+e&&(j-=j+a-(c+e),i=g-b+d-h,l=!0);i<d+5?(i=d+5,l&&g>=i&&g<=i+b&&(i=g+d+h)):i+b>d+f&&(i=d+f-b-h);return{x:j,y:i}}function Oc(a,b){var c=a.length,d,e;for(e=0;e<c;e++)a[e].ss_i=e;a.sort(function(a,c){d=b(a,c);return d===0?a.ss_i-c.ss_i:d});for(e=0;e<c;e++)delete a[e].ss_i}function Gb(a){for(var b=a.length,c=a[0];b--;)a[b]<c&&(c=a[b]);return c}function Ab(a){for(var b=a.length,c=a[0];b--;)a[b]>c&&(c=a[b]);return c}function ub(a){for(var b in a)a[b]&&a[b].destroy&&a[b].destroy(),delete a[b]}function Hb(a){Zb||
(Zb=na(vb));a&&Zb.appendChild(a);Zb.innerHTML=""}function Ib(a,b){Lb=r(a,b.animation)}function zc(){var a=X.global.useUTC,b=a?"getUTC":"get",c=a?"setUTC":"set";Yb=a?Date.UTC:function(a,b,c,g,h,j){return(new Date(a,b,r(c,1),r(g,0),r(h,0),r(j,0))).getTime()};jc=b+"Minutes";kc=b+"Hours";mc=b+"Day";eb=b+"Date";Wb=b+"Month";Xb=b+"FullYear";uc=c+"Minutes";vc=c+"Hours";lc=c+"Date";wc=c+"Month";xc=c+"FullYear"}function Bb(){}function $b(a,b){function c(a){function b(a,c){this.pos=a;this.type=c||"";this.isNew=
!0;c||this.addLabel()}function c(a){if(a)this.options=a,this.id=a.id;return this}function d(a,b,c,e){this.isNegative=b;this.options=a;this.x=c;this.stack=e;this.alignOptions={align:a.align||(da?b?"left":"right":"center"),verticalAlign:a.verticalAlign||(da?"middle":b?"bottom":"top"),y:r(a.y,da?4:b?14:-6),x:r(a.x,da?b?-6:6:0)};this.textAlign=a.textAlign||(da?b?"right":"left":"center")}function e(){var a=[],b=[],c;P=Va=null;n(F.series,function(e){if(e.visible||!v.ignoreHiddenSeries){var f=e.options,
g,h,i,j,k,l,o,s,p,Oa=f.threshold,t,n=[],u=0;if(m)f=e.xData,f.length&&(P=va(r(P,f[0]),Gb(f)),Va=T(r(Va,f[0]),Ab(f)));else{var F,ac,x,ya=e.cropped,ca=e.xAxis.getExtremes(),w=!!e.modifyValue;g=f.stacking;$a=g==="percent";if(g)k=f.stack,j=e.type+r(k,""),l="-"+j,e.stackKey=j,h=a[j]||[],a[j]=h,i=b[l]||[],b[l]=i;$a&&(P=0,Va=99);f=e.processedXData;o=e.processedYData;t=o.length;for(c=0;c<t;c++)if(s=f[c],p=o[c],p!==null&&p!==G&&(g?(ac=(F=p<Oa)?i:h,x=F?l:j,p=ac[s]=A(ac[s])?ac[s]+p:p,q[x]||(q[x]={}),q[x][s]||
(q[x][s]=new d(z.stackLabels,F,s,k)),q[x][s].setTotal(p)):w&&(p=e.modifyValue(p)),ya||(f[c+1]||s)>=ca.min&&(f[c-1]||s)<=ca.max))if(s=p.length)for(;s--;)p[s]!==null&&(n[u++]=p[s]);else n[u++]=p;!$a&&n.length&&(P=va(r(P,n[0]),Gb(n)),Va=T(r(Va,n[0]),Ab(n)));e.useThreshold&&Oa!==null&&(P>=Oa?(P=Oa,Ga=!0):Va<Oa&&(Va=Oa,yb=!0))}}})}function f(a){var b;b=a;ma=r(ma,sa.pow(10,Na(sa.log(Da)/sa.LN10)));ma<1&&(b=y(1/ma)*10,b=y(a*b)/b);return b}function g(){var a,b;a=f(Na(O/Da)*Da);var c=f(bc(U/Da)*Da);for(ea=
[];a<=c;){ea.push(a);a=f(a+Da);if(a===b)break;b=a}}function h(){var a,b=Va-P>=M,c,d,e,f,g,i;m&&M===G&&(A(z.min)||A(z.max)?M=null:(n(F.series,function(a){f=a.xData;for(d=g=a.xIncrement?1:f.length-1;d>0;d--)if(e=f[d]-f[d-1],c===G||e<c)c=e}),M=va(c*5,Va-P)));U-O<M&&(a=(M-U+O)/2,a=[O-a,r(z.min,O-a)],b&&(a[2]=P),O=Ab(a),i=[O+M,r(z.max,O+M)],b&&(i[2]=Va),U=Gb(i),U-O<M&&(a[0]=U-M,a[1]=r(z.min,U-M),O=Ab(a)))}function i(a){var b,c,d=z.tickInterval,e=z.tickPixelInterval;Ua?(c=o[m?"xAxis":"yAxis"][z.linkedTo],
b=c.getExtremes(),O=r(b.min,b.dataMin),U=r(b.max,b.dataMax)):(O=r(Ya,z.min,P),U=r(Xa,z.max,Va));w&&(O=Eb(O),U=Eb(U));Db&&(Ya=O=T(O,U-Db),Xa=U,a&&(Db=null));h();if(!Sa&&!$a&&!Ua&&A(O)&&A(U)){b=U-O||1;if(!A(z.min)&&!A(Ya)&&ja&&(P<0||!Ga))O-=b*ja;if(!A(z.max)&&!A(Xa)&&na&&(Va>0||!yb))U+=b*na}Da=O===U||O===void 0||U===void 0?1:Ua&&!d&&e===c.options.tickPixelInterval?c.tickInterval:r(d,Sa?1:(U-O)*e/(I||1));m&&!a&&n(F.series,function(a){a.processData(O!==X||U!==ka)});aa();F.beforeSetTickPositions&&F.beforeSetTickPositions();
F.postProcessTickInterval&&(Da=F.postProcessTickInterval(Da));ya||(ma=sa.pow(10,Na(sa.log(Da)/sa.LN10)),A(z.tickInterval)||(Da=sc(Da,null,ma,z)));F.tickInterval=Da;ab=z.minorTickInterval==="auto"&&Da?Da/5:z.minorTickInterval;(ea=z.tickPositions||La&&La.apply(F,[O,U]))||(ya?ea=(F.getNonLinearTimeTicks||Vb)(tc(Da,z.units),O,U,z.startOfWeek,F.ordinalPositions,F.closestPointRange,!0):g());Y(F,"afterSetTickPositions",{tickPositions:ea});if(!Ua&&(a=ea[0],c=ea[ea.length-1],z.startOnTick?O=a:O>a&&ea.shift(),
z.endOnTick?U=c:U<c&&ea.pop(),lb||(lb={x:0,y:0}),!ya&&ea.length>lb[Aa]&&z.alignTicks!==!1))lb[Aa]=ea.length}function j(a){a=(new c(a)).render();fa.push(a);return a}function k(){var a=z.title,d=z.stackLabels,e=z.alternateGridColor,f=z.lineWidth,g,h,i=o.hasRendered&&A(X)&&!isNaN(X),l=(g=F.series.length&&A(O)&&A(U))||r(z.showEmpty,!0);if(g||Ua){if(ab&&!Sa)for(g=O+(ea[0]-O)%ab;g<=U;g+=ab)ua[g]||(ua[g]=new b(g,"minor")),i&&ua[g].isNew&&ua[g].render(null,!0),ua[g].isActive=!0,ua[g].render();n(ea,function(a,
c){if(!Ua||a>=O&&a<=U)Pa[a]||(Pa[a]=new b(a)),i&&Pa[a].isNew&&Pa[a].render(c,!0),Pa[a].isActive=!0,Pa[a].render(c)});e&&n(ea,function(a,b){if(b%2===0&&a<U)la[a]||(la[a]=new c),la[a].options={from:a,to:ea[b+1]!==G?ea[b+1]:U,color:e},la[a].render(),la[a].isActive=!0});if(!F._addedPlotLB)n((z.plotLines||[]).concat(z.plotBands||[]),function(a){j(a)}),F._addedPlotLB=!0}n([Pa,ua,la],function(a){for(var b in a)a[b].isActive?a[b].isActive=!1:(a[b].destroy(),delete a[b])});f&&(g=C+(p?hb:0)+ca,h=Ha-D-(p?mb:
0)+ca,g=Z.crispLine([ta,s?C:g,s?h:pb,ga,s?ha-Q:g,s?h:Ha-D],f),Wa?Wa.animate({d:g}):Wa=Z.path(g).attr({stroke:z.lineColor,"stroke-width":f,zIndex:7}).add(),Wa[l?"show":"hide"]());if(u&&l)l=s?C:pb,f=N(a.style.fontSize||12),l={low:l+(s?0:I),middle:l+I/2,high:l+(s?I:0)}[a.align],f=(s?pb+mb:C)+(s?1:-1)*(p?-1:1)*Ka+(t===2?f:0),u[u.isNew?"attr":"animate"]({x:s?l:f+(p?hb:0)+ca+(a.x||0),y:s?f-(p?mb:0)+ca:l+(a.y||0)}),u.isNew=!1;if(d&&d.enabled){var m,Oa,d=F.stackTotalGroup;if(!d)F.stackTotalGroup=d=Z.g("stack-labels").attr({visibility:bb,
zIndex:6}).translate($,V).add();for(m in q)for(Oa in a=q[m],a)a[Oa].render(d)}F.isDirty=!1}function l(a){for(var b=fa.length;b--;)fa[b].id===a&&fa[b].destroy()}var m=a.isX,p=a.opposite,s=da?!m:m,t=s?p?0:2:p?1:3,q={},z=H(m?cc:nc,[Pc,Qc,Ac,Rc][t],a),F=this,u,x=z.type,ya=x==="datetime",w=x==="logarithmic",ca=z.offset||0,Aa=m?"x":"y",I=0,Ma,K,Ra,B,C,pb,hb,mb,D,Q,Za,aa,J,S,R,Wa,P,Va,M=z.minRange||z.maxZoom,Db=z.range,Ya,Xa,ba,ia,U=null,O=null,X,ka,ja=z.minPadding,na=z.maxPadding,pa=0,Ua=A(z.linkedTo),
Ga,yb,$a,x=z.events,Ca,fa=[],Da,ab,ma,ea,La=z.tickPositioner,Pa={},ua={},la={},oa,za,Ka,Sa=z.categories,Sc=z.labels.formatter||function(){var a=this.value,b=this.dateTimeLabelFormat;return b?wb(b,a):Da%1E6===0?a/1E6+"M":Da%1E3===0?a/1E3+"k":!Sa&&a>=1E3?Ub(a,0):a},Ia=s&&z.labels.staggerLines,qa=z.reversed,Qa=Sa&&z.tickmarkPlacement==="between"?0.5:0;b.prototype={addLabel:function(){var a=this.pos,b=z.labels,c=Sa&&s&&Sa.length&&!b.step&&!b.staggerLines&&!b.rotation&&wa/Sa.length||!s&&wa/2,d=a===ea[0],
f=a===ea[ea.length-1],e=Sa&&A(Sa[a])?Sa[a]:a,g=this.label,h=ea.info,i;ya&&h&&(i=z.dateTimeLabelFormats[h.higherRanks[a]||h.unitName]);this.isFirst=d;this.isLast=f;a=Sc.call({axis:F,chart:o,isFirst:d,isLast:f,dateTimeLabelFormat:i,value:w?rc(e):e});c=c&&{width:T(1,y(c-2*(b.padding||10)))+Ea};c=E(c,b.style);A(g)?g&&g.attr({text:a}).css(c):this.label=A(a)&&b.enabled?Z.text(a,0,0,b.useHTML).attr({align:b.align,rotation:b.rotation}).css(c).add(S):null},getLabelSize:function(){var a=this.label;return a?
(this.labelBBox=a.getBBox())[s?"height":"width"]:0},render:function(a,b){var c=this.type,d=this.label,f=this.pos,e=z.labels,g=this.gridLine,h=c?c+"Grid":"grid",i=c?c+"Tick":"tick",j=z[h+"LineWidth"],k=z[h+"LineColor"],l=z[h+"LineDashStyle"],m=z[i+"Length"],h=z[i+"Width"]||0,o=z[i+"Color"],Oa=z[i+"Position"],i=this.mark,t=e.step,q=b&&dc||Ha,n;n=s?Za(f+Qa,null,null,b)+Ra:C+ca+(p?(b&&Ja||ha)-Q-C:0);q=s?q-D+ca-(p?mb:0):q-Za(f+Qa,null,null,b)-Ra;if(j){f=J(f+Qa,j,b);if(g===G){g={stroke:k,"stroke-width":j};
if(l)g.dashstyle=l;if(!c)g.zIndex=1;this.gridLine=g=j?Z.path(f).attr(g).add(R):null}!b&&g&&f&&g.animate({d:f})}if(h)Oa==="inside"&&(m=-m),p&&(m=-m),c=Z.crispLine([ta,n,q,ga,n+(s?0:-m),q+(s?m:0)],h),i?i.animate({d:c}):this.mark=Z.path(c).attr({stroke:o,"stroke-width":h}).add(S);d&&!isNaN(n)&&(n=n+e.x-(Qa&&s?Qa*K*(qa?-1:1):0),q=q+e.y-(Qa&&!s?Qa*K*(qa?1:-1):0),A(e.y)||(q+=N(d.styles.lineHeight)*0.9-d.getBBox().height/2),Ia&&(q+=a/(t||1)%Ia*16),this.isFirst&&!r(z.showFirstLabel,1)||this.isLast&&!r(z.showLastLabel,
1)?d.hide():d.show(),t&&a%t&&d.hide(),d[this.isNew?"attr":"animate"]({x:n,y:q}));this.isNew=!1},destroy:function(){ub(this)}};c.prototype={render:function(){var a=this,b=(F.pointRange||0)/2,c=a.options,d=c.label,f=a.label,e=c.width,g=c.to,h=c.from,i=c.value,j,k=c.dashStyle,l=a.svgElem,m=[],z,o,p=c.color;o=c.zIndex;var Oa=c.events;w&&(h=Eb(h),g=Eb(g),i=Eb(i));if(e){if(m=J(i,e),b={stroke:p,"stroke-width":e},k)b.dashstyle=k}else if(A(h)&&A(g))h=T(h,O-b),g=va(g,U+b),j=J(g),(m=J(h))&&j?m.push(j[4],j[5],
j[1],j[2]):m=null,b={fill:p};else return;if(A(o))b.zIndex=o;if(l)m?l.animate({d:m},null,l.onGetPath):(l.hide(),l.onGetPath=function(){l.show()});else if(m&&m.length&&(a.svgElem=l=Z.path(m).attr(b).add(),Oa))for(z in k=function(b){l.on(b,function(c){Oa[b].apply(a,[c])})},Oa)k(z);if(d&&A(d.text)&&m&&m.length&&hb>0&&mb>0){d=H({align:s&&j&&"center",x:s?!j&&4:10,verticalAlign:!s&&j&&"middle",y:s?j?16:10:j?6:-4,rotation:s&&!j&&90},d);if(!f)a.label=f=Z.text(d.text,0,0).attr({align:d.textAlign||d.align,rotation:d.rotation,
zIndex:o}).css(d.style).add();j=[m[1],m[4],r(m[6],m[1])];m=[m[2],m[5],r(m[7],m[2])];z=Gb(j);o=Gb(m);f.align(d,!1,{x:z,y:o,width:Ab(j)-z,height:Ab(m)-o});f.show()}else f&&f.hide();return a},destroy:function(){ub(this);Fb(fa,this)}};d.prototype={destroy:function(){ub(this)},setTotal:function(a){this.cum=this.total=a},render:function(a){var b=this.options.formatter.call(this);this.label?this.label.attr({text:b,visibility:Ta}):this.label=o.renderer.text(b,0,0).css(this.options.style).attr({align:this.textAlign,
rotation:this.options.rotation,visibility:Ta}).add(a)},setOffset:function(a,b){var c=this.isNegative,d=F.translate(this.total),f=F.translate(0),f=Ba(d-f),e=o.xAxis[0].translate(this.x)+a,g=o.plotHeight,c={x:da?c?d:d-f:e,y:da?g-e-b:c?g-d-f:g-d,width:da?f:b,height:da?b:f};this.label&&this.label.align(this.alignOptions,null,c).attr({visibility:bb})}};Za=function(a,b,c,d,f){var e=1,g=0,h=d?B:K,d=d?X:O,f=z.ordinal||w&&f;h||(h=K);c&&(e*=-1,g=I);qa&&(e*=-1,g-=e*I);b?(qa&&(a=I-a),a=a/h+d,f&&(a=F.lin2val(a))):
(f&&(a=F.val2lin(a)),a=e*(a-d)*h+g+e*pa);return a};J=function(a,b,c){var d,f,e,a=Za(a,null,null,c),g=c&&dc||Ha,h=c&&Ja||ha,i,c=f=y(a+Ra);d=e=y(g-a-Ra);if(isNaN(a))i=!0;else if(s){if(d=pb,e=g-D,c<C||c>C+hb)i=!0}else if(c=C,f=h-Q,d<pb||d>pb+mb)i=!0;return i?null:Z.crispLine([ta,c,d,ga,f,e],b||0)};aa=function(){var a=U-O,b=0,c,d;if(m)n(F.series,function(a){b=T(b,a.pointRange);d=a.closestPointRange;!a.noSharedTooltip&&A(d)&&(c=A(c)?va(c,d):d)}),F.pointRange=b,F.closestPointRange=c;B=K;F.translationSlope=
K=I/(a+b||1);Ra=s?C:D;pa=K*(b/2)};Fa.push(F);o[m?"xAxis":"yAxis"].push(F);da&&m&&qa===G&&(qa=!0);E(F,{addPlotBand:j,addPlotLine:j,adjustTickAmount:function(){if(lb&&lb[Aa]&&!ya&&!Sa&&!Ua&&z.alignTicks!==!1){var a=oa,b=ea.length;oa=lb[Aa];if(b<oa){for(;ea.length<oa;)ea.push(f(ea[ea.length-1]+Da));K*=(b-1)/(oa-1);U=ea[ea.length-1]}if(A(a)&&oa!==a)F.isDirty=!0}},categories:Sa,getExtremes:function(){return{min:O,max:U,dataMin:P,dataMax:Va,userMin:Ya,userMax:Xa}},getPlotLinePath:J,getThreshold:function(a){O>
a||a===null?a=O:U<a&&(a=U);return Za(a,0,1)},isXAxis:m,options:z,plotLinesAndBands:fa,getOffset:function(){var a=F.series.length&&A(O)&&A(U),c=a||r(z.showEmpty,!0),d=0,f=0,e=z.title,g=z.labels,h=[-1,1,1,-1][t],i;S||(S=Z.g("axis").attr({zIndex:7}).add(),R=Z.g("grid").attr({zIndex:z.gridZIndex||1}).add());za=0;if(a||Ua)n(ea,function(a){Pa[a]?Pa[a].addLabel():Pa[a]=new b(a)}),n(ea,function(a){if(t===0||t===2||{1:"left",3:"right"}[t]===g.align)za=T(Pa[a].getLabelSize(),za)}),Ia&&(za+=(Ia-1)*16);else for(i in Pa)Pa[i].destroy(),
delete Pa[i];if(e&&e.text){if(!u)u=F.axisTitle=Z.text(e.text,0,0,e.useHTML).attr({zIndex:7,rotation:e.rotation||0,align:e.textAlign||{low:"left",middle:"center",high:"right"}[e.align]}).css(e.style).add(),u.isNew=!0;c&&(d=u.getBBox()[s?"height":"width"],f=r(e.margin,s?5:10));u[c?"show":"hide"]()}ca=h*r(z.offset,L[t]);Ka=r(e.offset,za+f+(t!==2&&za&&h*z.labels[s?"y":"x"]));L[t]=T(L[t],Ka+d+h*ca)},render:k,setAxisSize:function(){var a=z.offsetLeft||0,b=z.offsetRight||0;C=r(z.left,$+a);pb=r(z.top,V);
hb=r(z.width,wa-a+b);mb=r(z.height,xa);D=Ha-mb-pb;Q=ha-hb-C;I=s?hb:mb;F.left=C;F.top=pb;F.len=I},setAxisTranslation:aa,setCategories:function(b,c){F.categories=a.categories=Sa=b;n(F.series,function(a){a.translate();a.setTooltipPoints(!0)});F.isDirty=!0;r(c,!0)&&o.redraw()},setExtremes:function(a,b,c,d){c=r(c,!0);Y(F,"setExtremes",{min:a,max:b},function(){Ya=a;Xa=b;c&&o.redraw(d)})},setScale:function(){var a,b,c;X=O;ka=U;Ma=I;I=s?hb:mb;n(F.series,function(a){if(a.isDirtyData||a.isDirty||a.xAxis.isDirty)c=
!0});if(I!==Ma||c||Ua||Ya!==ba||Xa!==ia){e();i();ba=Ya;ia=Xa;if(!m)for(a in q)for(b in q[a])q[a][b].cum=q[a][b].total;if(!F.isDirty)F.isDirty=o.isDirtyBox||O!==X||U!==ka}},setTickPositions:i,translate:Za,redraw:function(){xb.resetTracker&&xb.resetTracker();k();n(fa,function(a){a.render()});n(F.series,function(a){a.isDirty=!0})},removePlotBand:l,removePlotLine:l,reversed:qa,series:[],stacks:q,destroy:function(){var a;ra(F);for(a in q)ub(q[a]),q[a]=null;if(F.stackTotalGroup)F.stackTotalGroup=F.stackTotalGroup.destroy();
n([Pa,ua,la,fa],function(a){ub(a)});n([Wa,S,R,u],function(a){a&&a.destroy()});Wa=S=R=u=null}});for(Ca in x)W(F,Ca,x[Ca]);if(w)F.val2lin=Eb,F.lin2val=rc}function d(a){function b(){var a=this.points||sb(this),c=a[0].series,d;d=[c.tooltipHeaderFormatter(a[0].key)];n(a,function(a){c=a.series;d.push(c.tooltipFormatter&&c.tooltipFormatter(a)||a.point.tooltipFormatter(c.tooltipOptions.pointFormat))});return d.join("")}function c(a,b){l=m?a:(2*l+a)/3;p=m?b:(p+b)/2;s.attr({x:l,y:p});cb=Ba(a-l)>1||Ba(b-p)>
1?function(){c(a,b)}:null}function d(){if(!m){var a=o.hoverPoints;s.hide();a&&n(a,function(a){a.setState()});o.hoverPoints=null;m=!0}}var f,e=a.borderWidth,g=a.crosshairs,h=[],i=a.style,j=a.shared,k=N(i.padding),m=!0,l=0,p=0;i.padding=0;var s=Z.label("",0,0).attr({padding:k,fill:a.backgroundColor,"stroke-width":e,r:a.borderRadius,zIndex:8}).css(i).hide().add().shadow(a.shadow);return{shared:j,refresh:function(e){var i,k,l,p,q={},t=[];l=e.tooltipPos;i=a.formatter||b;q=o.hoverPoints;j&&(!e.series||
!e.series.noSharedTooltip)?(p=0,q&&n(q,function(a){a.setState()}),o.hoverPoints=e,n(e,function(a){a.setState(fb);p+=a.plotY;t.push(a.getLabelConfig())}),k=e[0].plotX,p=y(p)/e.length,q={x:e[0].category},q.points=t,e=e[0]):q=e.getLabelConfig();q=i.call(q);f=e.series;k=r(k,e.plotX);p=r(p,e.plotY);i=y(l?l[0]:da?wa-p:k);k=y(l?l[1]:da?xa-k:p);l=j||!f.isCartesian||f.tooltipOutsidePlot||Qa(i,k);q===!1||!l?d():(m&&(s.show(),m=!1),s.attr({text:q}),s.attr({stroke:a.borderColor||e.color||f.color||"#606060"}),
k=Nc(s.width,s.height,$,V,wa,xa,{x:i,y:k},r(a.distance,12),da),c(y(k.x),y(k.y)));if(g){g=sb(g);for(k=g.length;k--;)if(l=e.series[k?"yAxis":"xAxis"],g[k]&&l)if(l=l.getPlotLinePath(e[k?"y":"x"],1),h[k])h[k].attr({d:l,visibility:bb});else{i={"stroke-width":g[k].width||1,stroke:g[k].color||"#C0C0C0",zIndex:g[k].zIndex||2};if(g[k].dashStyle)i.dashstyle=g[k].dashStyle;h[k]=Z.path(l).attr(i).add()}}},hide:d,hideCrosshairs:function(){n(h,function(a){a&&a.hide()})},destroy:function(){n(h,function(a){a&&a.destroy()});
s&&(s=s.destroy())}}}function e(a){function b(a){var c,d,e,a=a||fa.event;if(!a.target)a.target=a.srcElement;if(a.originalEvent)a=a.originalEvent;if(a.event)a=a.event;c=a.touches?a.touches.item(0):a;qb=Bc(C);d=qb.left;e=qb.top;Tb?(d=a.x,c=a.y):(d=c.pageX-d,c=c.pageY-e);return E(a,{chartX:y(d),chartY:y(c)})}function c(a){var b={xAxis:[],yAxis:[]};n(Fa,function(c){var d=c.translate,e=c.isXAxis;b[e?"xAxis":"yAxis"].push({axis:c,value:d((da?!e:e)?a.chartX-$:xa-a.chartY+V,!0)})});return b}function e(){var a=
o.hoverSeries,b=o.hoverPoint;if(b)b.onMouseOut();if(a)a.onMouseOut();ua&&(ua.hide(),ua.hideCrosshairs());db=null}function f(){if(l){var a={xAxis:[],yAxis:[]},b=l.getBBox(),c=b.x-$,d=b.y-V;k&&(n(Fa,function(e){if(e.options.zoomEnabled!==!1){var f=e.translate,g=e.isXAxis,h=da?!g:g,i=f(h?c:xa-d-b.height,!0,0,0,1),f=f(h?c+b.width:xa-d,!0,0,0,1);a[g?"xAxis":"yAxis"].push({axis:e,min:va(i,f),max:T(i,f)})}}),Y(o,"selection",a,ob));l=l.destroy()}J(C,{cursor:"auto"});o.mouseIsDown=za=k=!1;ra(S,Ga?"touchend":
"mouseup",f)}function g(a){var b=A(a.pageX)?a.pageX:a.page.x,a=A(a.pageX)?a.pageY:a.page.y;qb&&!Qa(b-qb.left-$,a-qb.top-V)&&e()}function h(){e();qb=null}var i,j,k,l,m=v.zoomType,p=/x/.test(m),s=/y/.test(m),q=p&&!da||s&&da,t=s&&!da||p&&da;Ua=function(){Xa?(Xa.translate($,V),da&&Xa.attr({width:o.plotWidth,height:o.plotHeight}).invert()):o.trackerGroup=Xa=Z.g("tracker").attr({zIndex:9}).add()};Ua();if(a.enabled)o.tooltip=ua=d(a),jb=setInterval(function(){cb&&cb()},32);(function(){C.onmousedown=function(a){a=
b(a);!Ga&&a.preventDefault&&a.preventDefault();o.mouseIsDown=za=!0;o.mouseDownX=i=a.chartX;j=a.chartY;W(S,Ga?"touchend":"mouseup",f)};var d=function(c){if(!c||!(c.touches&&c.touches.length>1)){c=b(c);if(!Ga)c.returnValue=!1;var d=c.chartX,e=c.chartY,f=!Qa(d-$,e-V);Ga&&c.type==="touchstart"&&(R(c.target,"isTracker")?o.runTrackerClick||c.preventDefault():!qa&&!f&&c.preventDefault());f&&(d<$?d=$:d>$+wa&&(d=$+wa),e<V?e=V:e>V+xa&&(e=V+xa));if(za&&c.type!=="touchstart"){if(k=Math.sqrt(Math.pow(i-d,2)+Math.pow(j-
e,2)),k>10){var g=Qa(i-$,j-V);if(Ca&&(p||s)&&g)l||(l=Z.rect($,V,q?1:wa,t?1:xa,0).attr({fill:v.selectionMarkerFill||"rgba(69,114,167,0.25)",zIndex:7}).add());l&&q&&(c=d-i,l.attr({width:Ba(c),x:(c>0?0:c)+i}));l&&t&&(e-=j,l.attr({height:Ba(e),y:(e>0?0:e)+j}));g&&!l&&v.panning&&o.pan(d)}}else if(!f){var h,d=o.hoverPoint,e=o.hoverSeries,m,n,g=ha,u=da?c.chartY:c.chartX-$;if(ua&&a.shared&&(!e||!e.noSharedTooltip)){h=[];m=P.length;for(n=0;n<m;n++)if(P[n].visible&&P[n].options.enableMouseTracking!==!1&&!P[n].noSharedTooltip&&
P[n].tooltipPoints.length)c=P[n].tooltipPoints[u],c._dist=Ba(u-c.plotX),g=va(g,c._dist),h.push(c);for(m=h.length;m--;)h[m]._dist>g&&h.splice(m,1);if(h.length&&h[0].plotX!==db)ua.refresh(h),db=h[0].plotX}if(e&&e.tracker&&(c=e.tooltipPoints[u])&&c!==d)c.onMouseOver()}return f||!Ca}};C.onmousemove=d;W(C,"mouseleave",h);W(S,"mousemove",g);C.ontouchstart=function(a){if(p||s)C.onmousedown(a);d(a)};C.ontouchmove=d;C.ontouchend=function(){k&&e()};C.onclick=function(a){var d=o.hoverPoint,a=b(a);a.cancelBubble=
!0;if(!k)if(d&&R(a.target,"isTracker")){var e=d.plotX,f=d.plotY;E(d,{pageX:qb.left+$+(da?wa-f:e),pageY:qb.top+V+(da?xa-e:f)});Y(d.series,"click",E(a,{point:d}));d.firePointEvent("click",a)}else E(a,c(a)),Qa(a.chartX-$,a.chartY-V)&&Y(o,"click",a);k=!1}})();E(this,{zoomX:p,zoomY:s,resetTracker:e,normalizeMouseEvent:b,destroy:function(){if(o.trackerGroup)o.trackerGroup=Xa=o.trackerGroup.destroy();ra(C,"mouseleave",h);ra(S,"mousemove",g);C.onclick=C.onmousedown=C.onmousemove=C.ontouchstart=C.ontouchend=
C.ontouchmove=null}})}function f(a){var b=a.type||v.type||v.defaultSeriesType,c=ba[b],d=o.hasRendered;if(d)if(da&&b==="column")c=ba.bar;else if(!da&&b==="bar")c=ba.column;b=new c;b.init(o,a);!d&&b.inverted&&(da=!0);if(b.isCartesian)Ca=b.isCartesian;P.push(b);return b}function g(){v.alignTicks!==!1&&n(Fa,function(a){a.adjustTickAmount()});lb=null}function h(a){var b=o.isDirtyLegend,c,d=o.isDirtyBox,e=P.length,f=e,h=o.clipRect;for(Ib(a,o);f--;)if(a=P[f],a.isDirty&&a.options.stacking){c=!0;break}if(c)for(f=
e;f--;)if(a=P[f],a.options.stacking)a.isDirty=!0;n(P,function(a){a.isDirty&&a.options.legendType==="point"&&(b=!0)});if(b&&Ya.renderLegend)Ya.renderLegend(),o.isDirtyLegend=!1;Ca&&(Ka||(lb=null,n(Fa,function(a){a.setScale()})),g(),Ia(),n(Fa,function(a){Y(a,"afterSetExtremes",a.getExtremes());a.isDirty&&a.redraw()}));d&&(eb(),Ua(),h&&(Jb(h),h.animate({width:o.plotSizeX,height:o.plotSizeY+1})));n(P,function(a){a.isDirty&&a.visible&&(!a.isCartesian||a.xAxis)&&a.redraw()});xb&&xb.resetTracker&&xb.resetTracker();
Y(o,"redraw")}function j(){var b=a.xAxis||{},d=a.yAxis||{},b=sb(b);n(b,function(a,b){a.index=b;a.isX=!0});d=sb(d);n(d,function(a,b){a.index=b});b=b.concat(d);n(b,function(a){new c(a)});g()}function k(){var a=X.lang,b=v.resetZoomButton,c=b.relativeTo==="plot"&&{x:$,y:V,width:wa,height:xa};o.resetZoomButton=Z.button(a.resetZoom,null,null,tb,b.theme).attr({align:b.position.align,title:a.resetZoomTitle}).add().align(b.position,!1,c)}function i(b,c){Za=H(a.title,b);D=H(a.subtitle,c);n([["title",b,Za],
["subtitle",c,D]],function(a){var b=a[0],c=o[b],d=a[1],a=a[2];c&&d&&(c=c.destroy());a&&a.text&&!c&&(o[b]=Z.text(a.text,0,0,a.useHTML).attr({align:a.align,"class":gb+b,zIndex:1}).css(a.style).add().align(a,!1,B))})}function l(){Q=v.renderTo;pa=gb+oc++;zb(Q)&&(Q=S.getElementById(Q));Q.innerHTML="";Q.offsetWidth||(M=Q.cloneNode(0),J(M,{position:Cb,top:"-9999px",display:""}),S.body.appendChild(M));ka=(M||Q).offsetWidth;yb=(M||Q).offsetHeight;o.chartWidth=ha=v.width||ka||600;o.chartHeight=Ha=v.height||
(yb>19?yb:400);o.container=C=na(vb,{className:gb+"container"+(v.className?" "+v.className:""),id:pa},E({position:Cc,overflow:Ta,width:ha+Ea,height:Ha+Ea,textAlign:"left",lineHeight:"normal"},v.style),M||Q);o.renderer=Z=v.forExport?new Mb(C,ha,Ha,!0):new Nb(C,ha,Ha);var a,b;Dc&&C.getBoundingClientRect&&(a=function(){J(C,{left:0,top:0});b=C.getBoundingClientRect();J(C,{left:-(b.left-N(b.left))+Ea,top:-(b.top-N(b.top))+Ea})},a(),W(fa,"resize",a),W(o,"destroy",function(){ra(fa,"resize",a)}))}function m(){function a(c){var d=
v.width||Q.offsetWidth,e=v.height||Q.offsetHeight,c=c.target;if(d&&e&&(c===fa||c===S)){if(d!==ka||e!==yb)clearTimeout(b),b=setTimeout(function(){nb(d,e,!1)},100);ka=d;yb=e}}var b;W(fa,"resize",a);W(o,"destroy",function(){ra(fa,"resize",a)})}function p(){o&&Y(o,"endResize",null,function(){Ka-=1})}function t(){for(var b=da||v.inverted||v.type==="bar"||v.defaultSeriesType==="bar",c=a.series,d=c&&c.length;!b&&d--;)c[d].type==="bar"&&(b=!0);o.inverted=da=b}function x(){var b=a.labels,c=a.credits,d;i();
Ya=o.legend=new Bb;n(Fa,function(a){a.setScale()});Ia();n(Fa,function(a){a.setTickPositions(!0)});g();Ia();eb();Ca&&n(Fa,function(a){a.render()});if(!o.seriesGroup)o.seriesGroup=Z.g("series-group").attr({zIndex:3}).add();n(P,function(a){a.translate();a.setTooltipPoints();a.render()});b.items&&n(b.items,function(){var a=E(b.style,this.style),c=N(a.left)+$,d=N(a.top)+V+12;delete a.left;delete a.top;Z.text(this.html,c,d).attr({zIndex:2}).css(a).add()});if(c.enabled&&!o.credits)d=c.href,o.credits=Z.text(c.text,
0,0).on("click",function(){if(d)location.href=d}).attr({align:c.position.align,zIndex:8}).css(c.style).add().align(c.position);Ua();o.hasRendered=!0;M&&(Q.appendChild(C),Hb(M))}function u(){if(!Ob&&fa==fa.top&&S.readyState!=="complete")S.attachEvent("onreadystatechange",function(){S.detachEvent("onreadystatechange",u);S.readyState==="complete"&&u()});else{l();Y(o,"init");if(Highcharts.RangeSelector&&a.rangeSelector.enabled)o.rangeSelector=new Highcharts.RangeSelector(o);ib();kb();t();j();n(a.series||
[],function(a){f(a)});if(Highcharts.Scroller&&(a.navigator.enabled||a.scrollbar.enabled))o.scroller=new Highcharts.Scroller(o);o.render=x;o.tracker=xb=new e(a.tooltip);x();b&&b.apply(o,[o]);n(o.callbacks,function(a){a.apply(o,[o])});Y(o,"load")}}var w=a.series;a.series=null;a=H(X,a);a.series=w;var v=a.chart,w=v.margin,w=rb(w)?w:[w,w,w,w],q=r(v.marginTop,w[0]),ca=r(v.marginRight,w[1]),ya=r(v.marginBottom,w[2]),I=r(v.marginLeft,w[3]),Ra=v.spacingTop,s=v.spacingRight,Aa=v.spacingBottom,K=v.spacingLeft,
B,Za,D,V,aa,Wa,$,L,Q,M,C,pa,ka,yb,ha,Ha,Ja,dc,ia,ja,ma,Kb,o=this,qa=(w=v.events)&&!!w.click,La,Qa,ua,za,Ma,hb,Db,xa,wa,xb,Xa,Ua,Ya,$a,ab,qb,Ca=v.showAxes,Ka=0,Fa=[],lb,P=[],da,Z,cb,jb,db,eb,Ia,ib,kb,nb,ob,tb,Bb=function(){function a(b,c){var d=b.legendItem,e=b.legendLine,g=b.legendSymbol,h=p.color,i=c?f.itemStyle.color:h,h=c?b.color:h;d&&d.css({fill:i});e&&e.attr({stroke:h});g&&g.attr({stroke:h,fill:h})}function b(a,c,d){var e=a.legendItem,f=a.legendLine,g=a.legendSymbol,a=a.checkbox;e&&e.attr({x:c,
y:d});f&&f.translate(c,d-4);g&&g.attr({x:c+g.xOff,y:d+g.yOff});if(a)a.x=c,a.y=d}function c(){n(j,function(a){var b=a.checkbox,c=K.alignAttr;b&&J(b,{left:c.translateX+a.legendItemWidth+b.x-40+Ea,top:c.translateY+b.y-11+Ea})})}function d(c){var e,j,k,o,q=c.legendItem;o=c.series||c;var n=o.options,w=n&&n.borderWidth||0;if(!q){o=/^(bar|pie|area|column)$/.test(o.type);c.legendItem=q=Z.text(f.labelFormatter.call(c),0,0).css(c.visible?l:p).on("mouseover",function(){c.setState(fb);q.css(m)}).on("mouseout",
function(){q.css(c.visible?l:p);c.setState()}).on("click",function(){var a=function(){c.setVisible()};c.firePointEvent?c.firePointEvent("legendItemClick",null,a):Y(c,"legendItemClick",null,a)}).attr({zIndex:2}).add(K);if(!o&&n&&n.lineWidth){var Aa={"stroke-width":n.lineWidth,zIndex:2};if(n.dashStyle)Aa.dashstyle=n.dashStyle;c.legendLine=Z.path([ta,-h-i,0,ga,-i,0]).attr(Aa).add(K)}if(o)k=Z.rect(e=-h-i,j=-11,h,12,2).attr({zIndex:3}).add(K);else if(n&&n.marker&&n.marker.enabled)k=n.marker.radius,k=Z.symbol(c.symbol,
e=-h/2-i-k,j=-4-k,2*k,2*k).attr(c.pointAttr[la]).attr({zIndex:3}).add(K);if(k)k.xOff=e+w%2/2,k.yOff=j+w%2/2;c.legendSymbol=k;a(c,c.visible);if(n&&n.showCheckbox)c.checkbox=na("input",{type:"checkbox",checked:c.selected,defaultChecked:c.selected},f.itemCheckboxStyle,C),W(c.checkbox,"click",function(a){Y(c,"checkboxClick",{checked:a.target.checked},function(){c.select()})})}e=q.getBBox();j=c.legendItemWidth=f.itemWidth||h+i+e.width+s;ya=e.height;if(g&&u-t+j>(y||ha-2*s-t))u=t,x+=ca+ya+r;v=x+r;b(c,u,
x);g?u+=j:x+=ca+ya+r;Ma=y||T(g?u-t:j,Ma)}function e(){u=t;x=s+ca+q-5;v=Ma=0;K||(K=Z.g("legend").attr({zIndex:10}).add());j=[];n(A,function(a){var b=a.options;b.showInLegend&&(j=j.concat(a.legendItems||(b.legendType==="point"?a.data:a)))});Oc(j,function(a,b){return(a.options.legendIndex||0)-(b.options.legendIndex||0)});Ra&&j.reverse();n(j,d);$a=y||Ma;ab=v-q+ya;if(Aa||I){$a+=2*s;ab+=2*s;if(w){if($a>0&&ab>0)w[w.isNew?"attr":"animate"](w.crisp(null,null,null,$a,ab)),w.isNew=!1}else w=Z.rect(0,0,$a,ab,
f.borderRadius,Aa||0).attr({stroke:f.borderColor,"stroke-width":Aa||0,fill:I||oa}).add(K).shadow(f.shadow),w.isNew=!0;w[j.length?"show":"hide"]()}for(var a=["left","right","top","bottom"],b,g=4;g--;)b=a[g],k[b]&&k[b]!=="auto"&&(f[g<2?"align":"verticalAlign"]=b,f[g<2?"x":"y"]=N(k[b])*(g%2?-1:1));j.length&&K.align(E(f,{width:$a,height:ab}),!0,B);Ka||c()}var f=o.options.legend;if(f.enabled){var g=f.layout==="horizontal",h=f.symbolWidth,i=f.symbolPadding,j,k=f.style,l=f.itemStyle,m=f.itemHoverStyle,p=
H(l,f.itemHiddenStyle),s=f.padding||N(k.padding),q=18,t=4+s+h+i,u,x,v,ya=0,ca=f.itemMarginTop||0,r=f.itemMarginBottom||0,w,Aa=f.borderWidth,I=f.backgroundColor,K,Ma,y=f.width,A=o.series,Ra=f.reversed;e();W(o,"endResize",c);return{colorizeItem:a,destroyItem:function(a){var b=a.checkbox;n(["legendItem","legendLine","legendSymbol"],function(b){a[b]&&a[b].destroy()});b&&Hb(a.checkbox)},renderLegend:e,destroy:function(){w&&(w=w.destroy());K&&(K=K.destroy())}}}};Qa=function(a,b){return a>=0&&a<=wa&&b>=
0&&b<=xa};tb=function(){var a=o.resetZoomButton;Y(o,"selection",{resetSelection:!0},ob);if(a)o.resetZoomButton=a.destroy()};ob=function(a){var b=o.pointCount<100,c;o.resetZoomEnabled!==!1&&!o.resetZoomButton&&k();!a||a.resetSelection?n(Fa,function(a){a.options.zoomEnabled!==!1&&(a.setExtremes(null,null,!1),c=!0)}):n(a.xAxis.concat(a.yAxis),function(a){var b=a.axis;if(o.tracker[b.isXAxis?"zoomX":"zoomY"])b.setExtremes(a.min,a.max,!1),c=!0});c&&h(!0,b)};o.pan=function(a){var b=o.xAxis[0],c=o.mouseDownX,
d=b.pointRange/2,e=b.getExtremes(),f=b.translate(c-a,!0)+d,c=b.translate(c+wa-a,!0)-d;(d=o.hoverPoints)&&n(d,function(a){a.setState()});f>va(e.dataMin,e.min)&&c<T(e.dataMax,e.max)&&b.setExtremes(f,c,!0,!1);o.mouseDownX=a;J(C,{cursor:"move"})};Ia=function(){var b=a.legend,c=r(b.margin,10),d=b.x,e=b.y,f=b.align,g=b.verticalAlign,h;ib();if((o.title||o.subtitle)&&!A(q))(h=T(o.title&&!Za.floating&&!Za.verticalAlign&&Za.y||0,o.subtitle&&!D.floating&&!D.verticalAlign&&D.y||0))&&(V=T(V,h+r(Za.margin,15)+
Ra));b.enabled&&!b.floating&&(f==="right"?A(ca)||(aa=T(aa,$a-d+c+s)):f==="left"?A(I)||($=T($,$a+d+c+K)):g==="top"?A(q)||(V=T(V,ab+e+c+Ra)):g==="bottom"&&(A(ya)||(Wa=T(Wa,ab-e+c+Aa))));o.extraBottomMargin&&(Wa+=o.extraBottomMargin);o.extraTopMargin&&(V+=o.extraTopMargin);Ca&&n(Fa,function(a){a.getOffset()});A(I)||($+=L[3]);A(q)||(V+=L[0]);A(ya)||(Wa+=L[2]);A(ca)||(aa+=L[1]);kb()};nb=function(a,b,c){var d=o.title,e=o.subtitle;Ka+=1;Ib(c,o);dc=Ha;Ja=ha;if(A(a))o.chartWidth=ha=y(a);if(A(b))o.chartHeight=
Ha=y(b);J(C,{width:ha+Ea,height:Ha+Ea});Z.setSize(ha,Ha,c);wa=ha-$-aa;xa=Ha-V-Wa;lb=null;n(Fa,function(a){a.isDirty=!0;a.setScale()});n(P,function(a){a.isDirty=!0});o.isDirtyLegend=!0;o.isDirtyBox=!0;Ia();d&&d.align(null,null,B);e&&e.align(null,null,B);h(c);dc=null;Y(o,"resize");Lb===!1?p():setTimeout(p,Lb&&Lb.duration||500)};kb=function(){o.plotLeft=$=y($);o.plotTop=V=y(V);o.plotWidth=wa=y(ha-$-aa);o.plotHeight=xa=y(Ha-V-Wa);o.plotSizeX=da?xa:wa;o.plotSizeY=da?wa:xa;B={x:K,y:Ra,width:ha-K-s,height:Ha-
Ra-Aa};n(Fa,function(a){a.setAxisSize();a.setAxisTranslation()})};ib=function(){V=r(q,Ra);aa=r(ca,s);Wa=r(ya,Aa);$=r(I,K);L=[0,0,0,0]};eb=function(){var a=v.borderWidth||0,b=v.backgroundColor,c=v.plotBackgroundColor,d=v.plotBackgroundImage,e,f={x:$,y:V,width:wa,height:xa};e=a+(v.shadow?8:0);if(a||b)ia?ia.animate(ia.crisp(null,null,null,ha-e,Ha-e)):ia=Z.rect(e/2,e/2,ha-e,Ha-e,v.borderRadius,a).attr({stroke:v.borderColor,"stroke-width":a,fill:b||oa}).add().shadow(v.shadow);c&&(ja?ja.animate(f):ja=Z.rect($,
V,wa,xa,0).attr({fill:c}).add().shadow(v.plotShadow));d&&(ma?ma.animate(f):ma=Z.image(d,$,V,wa,xa).add());v.plotBorderWidth&&(Kb?Kb.animate(Kb.crisp(null,$,V,wa,xa)):Kb=Z.rect($,V,wa,xa,0,v.plotBorderWidth).attr({stroke:v.plotBorderColor,"stroke-width":v.plotBorderWidth,zIndex:4}).add());o.isDirtyBox=!1};v.reflow!==!1&&W(o,"load",m);if(w)for(La in w)W(o,La,w[La]);o.options=a;o.series=P;o.xAxis=[];o.yAxis=[];o.addSeries=function(a,b,c){var d;a&&(Ib(c,o),b=r(b,!0),Y(o,"addSeries",{options:a},function(){d=
f(a);d.isDirty=!0;o.isDirtyLegend=!0;b&&o.redraw()}));return d};o.animation=r(v.animation,!0);o.Axis=c;o.destroy=function(){var b,c=C&&C.parentNode;if(o!==null){Y(o,"destroy");ra(o);for(b=Fa.length;b--;)Fa[b]=Fa[b].destroy();for(b=P.length;b--;)P[b]=P[b].destroy();n("title,subtitle,seriesGroup,clipRect,credits,tracker,scroller,rangeSelector".split(","),function(a){var b=o[a];b&&(o[a]=b.destroy())});n([ia,Kb,ja,Ya,ua,Z,xb],function(a){a&&a.destroy&&a.destroy()});ia=Kb=ja=Ya=ua=Z=xb=null;if(C)C.innerHTML=
"",ra(C),c&&Hb(C),C=null;clearInterval(jb);for(b in o)delete o[b];a=o=null}};o.get=function(a){var b,c,d;for(b=0;b<Fa.length;b++)if(Fa[b].options.id===a)return Fa[b];for(b=0;b<P.length;b++)if(P[b].options.id===a)return P[b];for(b=0;b<P.length;b++){d=P[b].points||[];for(c=0;c<d.length;c++)if(d[c].id===a)return d[c]}return null};o.getSelectedPoints=function(){var a=[];n(P,function(b){a=a.concat(pc(b.points,function(a){return a.selected}))});return a};o.getSelectedSeries=function(){return pc(P,function(a){return a.selected})};
o.hideLoading=function(){Ma&&ec(Ma,{opacity:0},{duration:a.loading.hideDuration||100,complete:function(){J(Ma,{display:oa})}});Db=!1};o.initSeries=f;o.isInsidePlot=Qa;o.redraw=h;o.setSize=nb;o.setTitle=i;o.showLoading=function(b){var c=a.loading;Ma||(Ma=na(vb,{className:gb+"loading"},E(c.style,{left:$+Ea,top:V+Ea,width:wa+Ea,height:xa+Ea,zIndex:10,display:oa}),C),hb=na("span",null,c.labelStyle,Ma));hb.innerHTML=b||a.lang.loading;Db||(J(Ma,{opacity:0,display:""}),ec(Ma,{opacity:c.style.opacity},{duration:c.showDuration||
0}),Db=!0)};o.pointCount=0;o.counters=new yc;u()}var G,S=document,fa=window,sa=Math,y=sa.round,Na=sa.floor,bc=sa.ceil,T=sa.max,va=sa.min,Ba=sa.abs,ia=sa.cos,ma=sa.sin,Ia=sa.PI,Ec=Ia*2/360,ib=navigator.userAgent,Tb=/msie/i.test(ib)&&!fa.opera,Pb=S.documentMode===8,Fc=/AppleWebKit/.test(ib),Dc=/Firefox/.test(ib),Ob=!!S.createElementNS&&!!S.createElementNS("http://www.w3.org/2000/svg","svg").createSVGRect,Tc=Dc&&parseInt(ib.split("Firefox/")[1],10)<4,Nb,Ga=S.documentElement.ontouchstart!==G,Gc={},oc=
0,Zb,X,wb,Lb,Qb,D,vb="div",Cb="absolute",Cc="relative",Ta="hidden",gb="highcharts-",bb="visible",Ea="px",oa="none",ta="M",ga="L",Hc="rgba(192,192,192,"+(Ob?1.0E-6:0.0020)+")",la="",fb="hover",tb="millisecond",kb="second",db="minute",za="hour",ka="day",Ca="week",Ka="month",La="year",Yb,jc,kc,mc,eb,Wb,Xb,uc,vc,lc,wc,xc,B=fa.HighchartsAdapter,Ja=B||{},n=Ja.each,pc=Ja.grep,Bc=Ja.offset,nb=Ja.map,H=Ja.merge,W=Ja.addEvent,ra=Ja.removeEvent,Y=Ja.fireEvent,ec=Ja.animate,Jb=Ja.stop,ba={};fa.Highcharts={};
wb=function(a,b,c){function d(a,b){a=a.toString().replace(/^([0-9])$/,"0$1");b===3&&(a=a.toString().replace(/^([0-9]{2})$/,"0$1"));return a}if(!A(b)||isNaN(b))return"Invalid date";var a=r(a,"%Y-%m-%d %H:%M:%S"),e=new Date(b),f,g=e[kc](),h=e[mc](),j=e[eb](),k=e[Wb](),i=e[Xb](),l=X.lang,m=l.weekdays,b={a:m[h].substr(0,3),A:m[h],d:d(j),e:j,b:l.shortMonths[k],B:l.months[k],m:d(k+1),y:i.toString().substr(2,2),Y:i,H:d(g),I:d(g%12||12),l:g%12||12,M:d(e[jc]()),p:g<12?"AM":"PM",P:g<12?"am":"pm",S:d(e.getSeconds()),
L:d(b%1E3,3)};for(f in b)a=a.replace("%"+f,b[f]);return c?a.substr(0,1).toUpperCase()+a.substr(1):a};yc.prototype={wrapColor:function(a){if(this.color>=a)this.color=0},wrapSymbol:function(a){if(this.symbol>=a)this.symbol=0}};D=ja(tb,1,kb,1E3,db,6E4,za,36E5,ka,864E5,Ca,6048E5,Ka,2592E6,La,31556952E3);Qb={init:function(a,b,c){var b=b||"",d=a.shift,e=b.indexOf("C")>-1,f=e?7:3,g,b=b.split(" "),c=[].concat(c),h,j,k=function(a){for(g=a.length;g--;)a[g]===ta&&a.splice(g+1,0,a[g+1],a[g+2],a[g+1],a[g+2])};
e&&(k(b),k(c));a.isArea&&(h=b.splice(b.length-6,6),j=c.splice(c.length-6,6));d===1&&(c=[].concat(c).splice(0,f).concat(c));a.shift=0;if(b.length)for(a=c.length;b.length<a;)d=[].concat(b).splice(b.length-f,f),e&&(d[f-6]=d[f-2],d[f-5]=d[f-1]),b=b.concat(d);h&&(b=b.concat(h),c=c.concat(j));return[b,c]},step:function(a,b,c,d){var e=[],f=a.length;if(c===1)e=d;else if(f===b.length&&c<1)for(;f--;)d=parseFloat(a[f]),e[f]=isNaN(d)?a[f]:c*parseFloat(b[f]-d)+d;else e=b;return e}};B&&B.init&&B.init(Qb);if(!B&&
fa.jQuery){var qa=jQuery,n=function(a,b){for(var c=0,d=a.length;c<d;c++)if(b.call(a[c],a[c],c,a)===!1)return c},pc=qa.grep,nb=function(a,b){for(var c=[],d=0,e=a.length;d<e;d++)c[d]=b.call(a[d],a[d],d,a);return c},H=function(){var a=arguments;return qa.extend(!0,null,a[0],a[1],a[2],a[3])},Bc=function(a){return qa(a).offset()},W=function(a,b,c){qa(a).bind(b,c)},ra=function(a,b,c){var d=S.removeEventListener?"removeEventListener":"detachEvent";S[d]&&!a[d]&&(a[d]=function(){});qa(a).unbind(b,c)},Y=function(a,
b,c,d){var e=qa.Event(b),f="detached"+b,g;E(e,c);a[b]&&(a[f]=a[b],a[b]=null);n(["preventDefault","stopPropagation"],function(a){var b=e[a];e[a]=function(){try{b.call(e)}catch(c){a==="preventDefault"&&(g=!0)}}});qa(a).trigger(e);a[f]&&(a[b]=a[f],a[f]=null);d&&!e.isDefaultPrevented()&&!g&&d(e)},ec=function(a,b,c){var d=qa(a);if(b.d)a.toD=b.d,b.d=1;d.stop();d.animate(b,c)},Jb=function(a){qa(a).stop()};qa.extend(qa.easing,{easeOutQuad:function(a,b,c,d,e){return-d*(b/=e)*(b-2)+c}});var Ic=jQuery.fx,Jc=
Ic.step;n(["cur","_default","width","height"],function(a,b){var c=b?Jc:Ic.prototype,d=c[a],e;d&&(c[a]=function(a){a=b?a:this;e=a.elem;return e.attr?e.attr(a.prop,a.now):d.apply(this,arguments)})});Jc.d=function(a){var b=a.elem;if(!a.started){var c=Qb.init(b,b.d,b.toD);a.start=c[0];a.end=c[1];a.started=!0}b.attr("d",Qb.step(a.start,a.end,a.pos,b.toD))}}B={enabled:!0,align:"center",x:0,y:15,style:{color:"#666",fontSize:"11px",lineHeight:"14px"}};X={colors:"#4572A7,#AA4643,#89A54E,#80699B,#3D96AE,#DB843D,#92A8CD,#A47D7C,#B5CA92".split(","),
symbols:["circle","diamond","square","triangle","triangle-down"],lang:{loading:"Loading...",months:"January,February,March,April,May,June,July,August,September,October,November,December".split(","),shortMonths:"Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec".split(","),weekdays:"Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday".split(","),decimalPoint:".",resetZoom:"Reset zoom",resetZoomTitle:"Reset zoom level 1:1",thousandsSep:","},global:{useUTC:!0},chart:{borderColor:"#4572A7",borderRadius:5,
defaultSeriesType:"line",ignoreHiddenSeries:!0,spacingTop:10,spacingRight:10,spacingBottom:15,spacingLeft:10,style:{fontFamily:'"Lucida Grande", "Lucida Sans Unicode", Verdana, Arial, Helvetica, sans-serif',fontSize:"12px"},backgroundColor:"#FFFFFF",plotBorderColor:"#C0C0C0",resetZoomButton:{theme:{zIndex:20},position:{align:"right",x:-10,y:10},relativeTo:"plot"}},title:{text:"Chart title",align:"center",y:15,style:{color:"#3E576F",fontSize:"16px"}},subtitle:{text:"",align:"center",y:30,style:{color:"#6D869F"}},
plotOptions:{line:{allowPointSelect:!1,showCheckbox:!1,animation:{duration:1E3},events:{},lineWidth:2,shadow:!0,marker:{enabled:!0,lineWidth:0,radius:4,lineColor:"#FFFFFF",states:{hover:{},select:{fillColor:"#FFFFFF",lineColor:"#000000",lineWidth:2}}},point:{events:{}},dataLabels:H(B,{enabled:!1,y:-6,formatter:function(){return this.y}}),cropThreshold:300,pointRange:0,showInLegend:!0,states:{hover:{marker:{}},select:{marker:{}}},stickyTracking:!0}},labels:{style:{position:Cb,color:"#3E576F"}},legend:{enabled:!0,
align:"center",layout:"horizontal",labelFormatter:function(){return this.name},borderWidth:1,borderColor:"#909090",borderRadius:5,shadow:!1,style:{padding:"5px"},itemStyle:{cursor:"pointer",color:"#3E576F"},itemHoverStyle:{color:"#000000"},itemHiddenStyle:{color:"#C0C0C0"},itemCheckboxStyle:{position:Cb,width:"13px",height:"13px"},symbolWidth:16,symbolPadding:5,verticalAlign:"bottom",x:0,y:0},loading:{labelStyle:{fontWeight:"bold",position:Cc,top:"1em"},style:{position:Cb,backgroundColor:"white",
opacity:0.5,textAlign:"center"}},tooltip:{enabled:!0,backgroundColor:"rgba(255, 255, 255, .85)",borderWidth:2,borderRadius:5,headerFormat:'<span style="font-size: 10px">{point.key}</span><br/>',pointFormat:'<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>',shadow:!0,snap:Ga?25:10,style:{color:"#333333",fontSize:"12px",padding:"5px",whiteSpace:"nowrap"}},credits:{enabled:!0,text:"Highcharts.com",href:"http://www.highcharts.com",position:{align:"right",x:-10,verticalAlign:"bottom",
y:-5},style:{cursor:"pointer",color:"#909090",fontSize:"10px"}}};var cc={dateTimeLabelFormats:ja(tb,"%H:%M:%S.%L",kb,"%H:%M:%S",db,"%H:%M",za,"%H:%M",ka,"%e. %b",Ca,"%e. %b",Ka,"%b '%y",La,"%Y"),endOnTick:!1,gridLineColor:"#C0C0C0",labels:B,lineColor:"#C0D0E0",lineWidth:1,max:null,min:null,minPadding:0.01,maxPadding:0.01,minorGridLineColor:"#E0E0E0",minorGridLineWidth:1,minorTickColor:"#A0A0A0",minorTickLength:2,minorTickPosition:"outside",startOfWeek:1,startOnTick:!1,tickColor:"#C0D0E0",tickLength:5,
tickmarkPlacement:"between",tickPixelInterval:100,tickPosition:"outside",tickWidth:1,title:{align:"middle",style:{color:"#6D869F",fontWeight:"bold"}},type:"linear"},nc=H(cc,{endOnTick:!0,gridLineWidth:1,tickPixelInterval:72,showLastLabel:!0,labels:{align:"right",x:-8,y:3},lineWidth:0,maxPadding:0.05,minPadding:0.05,startOnTick:!0,tickWidth:0,title:{rotation:270,text:"Y-values"},stackLabels:{enabled:!1,formatter:function(){return this.total},style:B.style}}),Rc={labels:{align:"right",x:-8,y:null},
title:{rotation:270}},Qc={labels:{align:"left",x:8,y:null},title:{rotation:90}},Ac={labels:{align:"center",x:0,y:14},title:{rotation:0}},Pc=H(Ac,{labels:{y:-5}}),aa=X.plotOptions,B=aa.line;aa.spline=H(B);aa.scatter=H(B,{lineWidth:0,states:{hover:{lineWidth:0}},tooltip:{headerFormat:'<span style="font-size: 10px; color:{series.color}">{series.name}</span><br/>',pointFormat:"x: <b>{point.x}</b><br/>y: <b>{point.y}</b><br/>"}});aa.area=H(B,{threshold:0});aa.areaspline=H(aa.area);aa.column=H(B,{borderColor:"#FFFFFF",
borderWidth:1,borderRadius:0,groupPadding:0.2,marker:null,pointPadding:0.1,minPointLength:0,cropThreshold:50,pointRange:null,states:{hover:{brightness:0.1,shadow:!1},select:{color:"#C0C0C0",borderColor:"#000000",shadow:!1}},dataLabels:{y:null,verticalAlign:null},threshold:0});aa.bar=H(aa.column,{dataLabels:{align:"left",x:5,y:0}});aa.pie=H(B,{borderColor:"#FFFFFF",borderWidth:1,center:["50%","50%"],colorByPoint:!0,dataLabels:{distance:30,enabled:!0,formatter:function(){return this.point.name},y:5},
legendType:"point",marker:null,size:"75%",showInLegend:!1,slicedOffset:10,states:{hover:{brightness:0.1,shadow:!1}}});zc();var cb=function(a){var b=[],c;(function(a){(c=/rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]?(?:\.[0-9]+)?)\s*\)/.exec(a))?b=[N(c[1]),N(c[2]),N(c[3]),parseFloat(c[4],10)]:(c=/#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(a))&&(b=[N(c[1],16),N(c[2],16),N(c[3],16),1])})(a);return{get:function(c){return b&&!isNaN(b[0])?c==="rgb"?"rgb("+b[0]+","+
b[1]+","+b[2]+")":c==="a"?b[3]:"rgba("+b.join(",")+")":a},brighten:function(a){if(Sb(a)&&a!==0){var c;for(c=0;c<3;c++)b[c]+=N(a*255),b[c]<0&&(b[c]=0),b[c]>255&&(b[c]=255)}return this},setOpacity:function(a){b[3]=a;return this}}};Bb.prototype={init:function(a,b){this.element=S.createElementNS("http://www.w3.org/2000/svg",b);this.renderer=a;this.attrSetters={}},animate:function(a,b,c){b=r(b,Lb,!0);Jb(this);if(b){b=H(b);if(c)b.complete=c;ec(this,a,b)}else this.attr(a),c&&c()},attr:function(a,b){var c,
d,e,f,g=this.element,h=g.nodeName,j=this.renderer,k,i=this.attrSetters,l=this.shadows,m=this.htmlNode,p,n=this;zb(a)&&A(b)&&(c=a,a={},a[c]=b);if(zb(a))c=a,h==="circle"?c={x:"cx",y:"cy"}[c]||c:c==="strokeWidth"&&(c="stroke-width"),n=R(g,c)||this[c]||0,c!=="d"&&c!=="visibility"&&(n=parseFloat(n));else for(c in a){k=!1;d=a[c];e=i[c]&&i[c](d,c);if(e!==!1){e!==G&&(d=e);if(c==="d")d&&d.join&&(d=d.join(" ")),/(NaN| {2}|^$)/.test(d)&&(d="M 0 0"),this.d=d;else if(c==="x"&&h==="text"){for(e=0;e<g.childNodes.length;e++)f=
g.childNodes[e],R(f,"x")===R(g,"x")&&R(f,"x",d);this.rotation&&R(g,"transform","rotate("+this.rotation+" "+d+" "+N(a.y||R(g,"y"))+")")}else if(c==="fill")d=j.color(d,g,c);else if(h==="circle"&&(c==="x"||c==="y"))c={x:"cx",y:"cy"}[c]||c;else if(h==="rect"&&c==="r")R(g,{rx:d,ry:d}),k=!0;else if(c==="translateX"||c==="translateY"||c==="rotation"||c==="verticalAlign")this[c]=d,this.updateTransform(),k=!0;else if(c==="stroke")d=j.color(d,g,c);else if(c==="dashstyle")if(c="stroke-dasharray",d=d&&d.toLowerCase(),
d==="solid")d=oa;else{if(d){d=d.replace("shortdashdotdot","3,1,1,1,1,1,").replace("shortdashdot","3,1,1,1").replace("shortdot","1,1,").replace("shortdash","3,1,").replace("longdash","8,3,").replace(/dot/g,"1,3,").replace("dash","4,3,").replace(/,$/,"").split(",");for(e=d.length;e--;)d[e]=N(d[e])*a["stroke-width"];d=d.join(",")}}else c==="isTracker"?this[c]=d:c==="width"?d=N(d):c==="align"?(c="text-anchor",d={left:"start",center:"middle",right:"end"}[d]):c==="title"&&(e=S.createElementNS("http://www.w3.org/2000/svg",
"title"),e.appendChild(S.createTextNode(d)),g.appendChild(e));c==="strokeWidth"&&(c="stroke-width");Fc&&c==="stroke-width"&&d===0&&(d=1.0E-6);this.symbolName&&/^(x|y|r|start|end|innerR|anchorX|anchorY)/.test(c)&&(p||(this.symbolAttr(a),p=!0),k=!0);if(l&&/^(width|height|visibility|x|y|d|transform)$/.test(c))for(e=l.length;e--;)R(l[e],c,d);if((c==="width"||c==="height")&&h==="rect"&&d<0)d=0;c==="text"?(this.textStr=d,this.added&&j.buildText(this)):k||R(g,c,d)}if(m&&(c==="x"||c==="y"||c==="translateX"||
c==="translateY"||c==="visibility")){e=m.length?m:[this];f=e.length;var x;for(x=0;x<f;x++)m=e[x],k=m.getBBox(),m=m.htmlNode,J(m,E(this.styles,{left:k.x+(this.translateX||0)+Ea,top:k.y+(this.translateY||0)+Ea})),c==="visibility"&&J(m,{visibility:d})}}if(Fc&&/Chrome\/(18|19)/.test(ib)&&h==="text"&&(a.x!==G||a.y!==G))c=g.parentNode,d=g.nextSibling,c&&(c.removeChild(g),d?c.insertBefore(g,d):c.appendChild(g));return n},symbolAttr:function(a){var b=this;n("x,y,r,start,end,width,height,innerR,anchorX,anchorY".split(","),
function(c){b[c]=r(a[c],b[c])});b.attr({d:b.renderer.symbols[b.symbolName](b.x,b.y,b.width,b.height,b)})},clip:function(a){return this.attr("clip-path","url("+this.renderer.url+"#"+a.id+")")},crisp:function(a,b,c,d,e){var f,g={},h={},j,a=a||this.strokeWidth||this.attr&&this.attr("stroke-width")||0;j=y(a)%2/2;h.x=Na(b||this.x||0)+j;h.y=Na(c||this.y||0)+j;h.width=Na((d||this.width||0)-2*j);h.height=Na((e||this.height||0)-2*j);h.strokeWidth=a;for(f in h)this[f]!==h[f]&&(this[f]=g[f]=h[f]);return g},
css:function(a){var b=this.element,b=a&&a.width&&b.nodeName==="text",c,d="",e=function(a,b){return"-"+b.toLowerCase()};if(a&&a.color)a.fill=a.color;this.styles=a=E(this.styles,a);if(Tb&&!Ob)b&&delete a.width,J(this.element,a);else{for(c in a)d+=c.replace(/([A-Z])/g,e)+":"+a[c]+";";this.attr({style:d})}b&&this.added&&this.renderer.buildText(this);return this},on:function(a,b){var c=b;Ga&&a==="click"&&(a="touchstart",c=function(a){a.preventDefault();b()});this.element["on"+a]=c;return this},translate:function(a,
b){return this.attr({translateX:a,translateY:b})},invert:function(){this.inverted=!0;this.updateTransform();return this},updateTransform:function(){var a=this.translateX||0,b=this.translateY||0,c=this.inverted,d=this.rotation,e=[];c&&(a+=this.attr("width"),b+=this.attr("height"));(a||b)&&e.push("translate("+a+","+b+")");c?e.push("rotate(90) scale(-1,1)"):d&&e.push("rotate("+d+" "+this.x+" "+this.y+")");e.length&&R(this.element,"transform",e.join(" "))},toFront:function(){var a=this.element;a.parentNode.appendChild(a);
return this},align:function(a,b,c){a?(this.alignOptions=a,this.alignByTranslate=b,c||this.renderer.alignedObjects.push(this)):(a=this.alignOptions,b=this.alignByTranslate);var c=r(c,this.renderer),d=a.align,e=a.verticalAlign,f=(c.x||0)+(a.x||0),g=(c.y||0)+(a.y||0),h={};/^(right|center)$/.test(d)&&(f+=(c.width-(a.width||0))/{right:1,center:2}[d]);h[b?"translateX":"x"]=y(f);/^(bottom|middle)$/.test(e)&&(g+=(c.height-(a.height||0))/({bottom:1,middle:2}[e]||1));h[b?"translateY":"y"]=y(g);this[this.placed?
"animate":"attr"](h);this.placed=!0;this.alignAttr=h;return this},getBBox:function(){var a,b,c,d=this.rotation,e=d*Ec;try{a=E({},this.element.getBBox())}catch(f){a={width:0,height:0}}b=a.width;c=a.height;if(d)a.width=Ba(c*ma(e))+Ba(b*ia(e)),a.height=Ba(c*ia(e))+Ba(b*ma(e));return a},show:function(){return this.attr({visibility:bb})},hide:function(){return this.attr({visibility:Ta})},add:function(a){var b=this.renderer,c=a||b,d=c.element||b.box,e=d.childNodes,f=this.element,g=R(f,"zIndex"),h;this.parentInverted=
a&&a.inverted;this.textStr!==void 0&&b.buildText(this);if(a&&this.htmlNode){if(!a.htmlNode)a.htmlNode=[];a.htmlNode.push(this)}if(g)c.handleZ=!0,g=N(g);if(c.handleZ)for(c=0;c<e.length;c++)if(a=e[c],b=R(a,"zIndex"),a!==f&&(N(b)>g||!A(g)&&A(b))){d.insertBefore(f,a);h=!0;break}h||d.appendChild(f);this.added=!0;Y(this,"add");return this},safeRemoveChild:function(a){var b=a.parentNode;b&&b.removeChild(a)},destroy:function(){var a=this,b=a.element||{},c=a.shadows,d=a.box,e,f;b.onclick=b.onmouseout=b.onmouseover=
b.onmousemove=null;Jb(a);if(a.clipPath)a.clipPath=a.clipPath.destroy();if(a.stops){for(f=0;f<a.stops.length;f++)a.stops[f]=a.stops[f].destroy();a.stops=null}a.safeRemoveChild(b);c&&n(c,function(b){a.safeRemoveChild(b)});d&&d.destroy();Fb(a.renderer.alignedObjects,a);for(e in a)delete a[e];return null},empty:function(){for(var a=this.element,b=a.childNodes,c=b.length;c--;)a.removeChild(b[c])},shadow:function(a,b){var c=[],d,e,f=this.element,g=this.parentInverted?"(-1,-1)":"(1,1)";if(a){for(d=1;d<=
3;d++)e=f.cloneNode(0),R(e,{isShadow:"true",stroke:"rgb(0, 0, 0)","stroke-opacity":0.05*d,"stroke-width":7-2*d,transform:"translate"+g,fill:oa}),b?b.element.appendChild(e):f.parentNode.insertBefore(e,f),c.push(e);this.shadows=c}return this}};var Mb=function(){this.init.apply(this,arguments)};Mb.prototype={Element:Bb,init:function(a,b,c,d){var e=location,f;f=this.createElement("svg").attr({xmlns:"http://www.w3.org/2000/svg",version:"1.1"});a.appendChild(f.element);this.box=f.element;this.boxWrapper=
f;this.alignedObjects=[];this.url=Tb?"":e.href.replace(/#.*?$/,"").replace(/\(/g,"\\(").replace(/\)/g,"\\)");this.defs=this.createElement("defs").add();this.forExport=d;this.gradients={};this.setSize(b,c,!1)},destroy:function(){var a=this.defs;this.box=null;this.boxWrapper=this.boxWrapper.destroy();ub(this.gradients||{});this.gradients=null;if(a)this.defs=a.destroy();return this.alignedObjects=null},createElement:function(a){var b=new this.Element;b.init(this,a);return b},buildText:function(a){for(var b=
a.element,c=r(a.textStr,"").toString().replace(/<(b|strong)>/g,'<span style="font-weight:bold">').replace(/<(i|em)>/g,'<span style="font-style:italic">').replace(/<a/g,"<span").replace(/<\/(b|strong|i|em|a)>/g,"</span>").split(/<br.*?>/g),d=b.childNodes,e=/style="([^"]+)"/,f=/href="([^"]+)"/,g=R(b,"x"),h=a.styles,j=h&&a.useHTML&&!this.forExport,k=a.htmlNode,i=h&&N(h.width),l=h&&h.lineHeight,m,p=d.length;p--;)b.removeChild(d[p]);i&&!a.added&&this.box.appendChild(b);c[c.length-1]===""&&c.pop();n(c,
function(c,d){var h,j=0,k,c=c.replace(/<span/g,"|||<span").replace(/<\/span>/g,"</span>|||");h=c.split("|||");n(h,function(c){if(c!==""||h.length===1){var p={},n=S.createElementNS("http://www.w3.org/2000/svg","tspan");e.test(c)&&R(n,"style",c.match(e)[1].replace(/(;| |^)color([ :])/,"$1fill$2"));f.test(c)&&(R(n,"onclick",'location.href="'+c.match(f)[1]+'"'),J(n,{cursor:"pointer"}));c=(c.replace(/<(.|\n)*?>/g,"")||" ").replace(/&lt;/g,"<").replace(/&gt;/g,">");n.appendChild(S.createTextNode(c));j?
p.dx=3:p.x=g;if(!j){if(d){!Ob&&a.renderer.forExport&&J(n,{display:"block"});k=fa.getComputedStyle&&N(fa.getComputedStyle(m,null).getPropertyValue("line-height"));if(!k||isNaN(k))k=l||m.offsetHeight||18;R(n,"dy",k)}m=n}R(n,p);b.appendChild(n);j++;if(i)for(var c=c.replace(/-/g,"- ").split(" "),t,r=[];c.length||r.length;)t=a.getBBox().width,p=t>i,!p||c.length===1?(c=r,r=[],c.length&&(n=S.createElementNS("http://www.w3.org/2000/svg","tspan"),R(n,{dy:l||16,x:g}),b.appendChild(n),t>i&&(i=t))):(n.removeChild(n.firstChild),
r.unshift(c.pop())),c.length&&n.appendChild(S.createTextNode(c.join(" ").replace(/- /g,"-")))}})});if(j){if(!k)k=a.htmlNode=na("span",null,E(h,{position:Cb,top:0,left:0}),this.box.parentNode);k.innerHTML=a.textStr;for(p=d.length;p--;)d[p].style.visibility=Ta}},button:function(a,b,c,d,e,f,g){var h=this.label(a,b,c),j=0,k,i,l,m,p,a={x1:0,y1:0,x2:0,y2:1},e=H(ja("stroke-width",1,"stroke","#999","fill",ja("linearGradient",a,"stops",[[0,"#FFF"],[1,"#DDD"]]),"r",3,"padding",3,"style",ja("color","black")),
e);l=e.style;delete e.style;f=H(e,ja("stroke","#68A","fill",ja("linearGradient",a,"stops",[[0,"#FFF"],[1,"#ACF"]])),f);m=f.style;delete f.style;g=H(e,ja("stroke","#68A","fill",ja("linearGradient",a,"stops",[[0,"#9BD"],[1,"#CDF"]])),g);p=g.style;delete g.style;W(h.element,"mouseenter",function(){h.attr(f).css(m)});W(h.element,"mouseleave",function(){k=[e,f,g][j];i=[l,m,p][j];h.attr(k).css(i)});h.setState=function(a){(j=a)?a===2&&h.attr(g).css(p):h.attr(e).css(l)};return h.on("click",function(){d.call(h)}).attr(e).css(E({cursor:"default"},
l))},crispLine:function(a,b){a[1]===a[4]&&(a[1]=a[4]=y(a[1])+b%2/2);a[2]===a[5]&&(a[2]=a[5]=y(a[2])+b%2/2);return a},path:function(a){return this.createElement("path").attr({d:a,fill:oa})},circle:function(a,b,c){a=rb(a)?a:{x:a,y:b,r:c};return this.createElement("circle").attr(a)},arc:function(a,b,c,d,e,f){if(rb(a))b=a.y,c=a.r,d=a.innerR,e=a.start,f=a.end,a=a.x;return this.symbol("arc",a||0,b||0,c||0,c||0,{innerR:d||0,start:e||0,end:f||0})},rect:function(a,b,c,d,e,f){if(rb(a))b=a.y,c=a.width,d=a.height,
e=a.r,f=a.strokeWidth,a=a.x;e=this.createElement("rect").attr({rx:e,ry:e,fill:oa});return e.attr(e.crisp(f,a,b,T(c,0),T(d,0)))},setSize:function(a,b,c){var d=this.alignedObjects,e=d.length;this.width=a;this.height=b;for(this.boxWrapper[r(c,!0)?"animate":"attr"]({width:a,height:b});e--;)d[e].align()},g:function(a){var b=this.createElement("g");return A(a)?b.attr({"class":gb+a}):b},image:function(a,b,c,d,e){var f={preserveAspectRatio:oa};arguments.length>1&&E(f,{x:b,y:c,width:d,height:e});f=this.createElement("image").attr(f);
f.element.setAttributeNS?f.element.setAttributeNS("http://www.w3.org/1999/xlink","href",a):f.element.setAttribute("hc-svg-href",a);return f},symbol:function(a,b,c,d,e,f){var g,h=this.symbols[a],h=h&&h(y(b),y(c),d,e,f),j=/^url\((.*?)\)$/,k;if(h)g=this.path(h),E(g,{symbolName:a,x:b,y:c,width:d,height:e}),f&&E(g,f);else if(j.test(a)){var i=function(a,b){a.attr({width:b[0],height:b[1]}).translate(-y(b[0]/2),-y(b[1]/2))};k=a.match(j)[1];a=Gc[k];g=this.image(k).attr({x:b,y:c});a?i(g,a):(g.attr({width:0,
height:0}),na("img",{onload:function(){i(g,Gc[k]=[this.width,this.height])},src:k}))}return g},symbols:{circle:function(a,b,c,d){var e=0.166*c;return[ta,a+c/2,b,"C",a+c+e,b,a+c+e,b+d,a+c/2,b+d,"C",a-e,b+d,a-e,b,a+c/2,b,"Z"]},square:function(a,b,c,d){return[ta,a,b,ga,a+c,b,a+c,b+d,a,b+d,"Z"]},triangle:function(a,b,c,d){return[ta,a+c/2,b,ga,a+c,b+d,a,b+d,"Z"]},"triangle-down":function(a,b,c,d){return[ta,a,b,ga,a+c,b,a+c/2,b+d,"Z"]},diamond:function(a,b,c,d){return[ta,a+c/2,b,ga,a+c,b+d/2,a+c/2,b+d,
a,b+d/2,"Z"]},arc:function(a,b,c,d,e){var f=e.start,c=e.r||c||d,g=e.end-1.0E-6,d=e.innerR,h=ia(f),j=ma(f),k=ia(g),g=ma(g),e=e.end-f<Ia?0:1;return[ta,a+c*h,b+c*j,"A",c,c,0,e,1,a+c*k,b+c*g,ga,a+d*k,b+d*g,"A",d,d,0,e,0,a+d*h,b+d*j,"Z"]}},clipRect:function(a,b,c,d){var e=gb+oc++,f=this.createElement("clipPath").attr({id:e}).add(this.defs),a=this.rect(a,b,c,d,0).add(f);a.id=e;a.clipPath=f;return a},color:function(a,b,c){var d,e=/^rgba/;if(a&&a.linearGradient){var f=this,g=a.linearGradient,b=!ic(g),c=f.gradients,
h,j=g.x1||g[0]||0,k=g.y1||g[1]||0,i=g.x2||g[2]||0,l=g.y2||g[3]||0,m,p,t=[b,j,k,i,l,a.stops.join(",")].join(",");c[t]?g=R(c[t].element,"id"):(g=gb+oc++,h=f.createElement("linearGradient").attr(E({id:g,x1:j,y1:k,x2:i,y2:l},b?null:{gradientUnits:"userSpaceOnUse"})).add(f.defs),h.stops=[],n(a.stops,function(a){e.test(a[1])?(d=cb(a[1]),m=d.get("rgb"),p=d.get("a")):(m=a[1],p=1);a=f.createElement("stop").attr({offset:a[0],"stop-color":m,"stop-opacity":p}).add(h);h.stops.push(a)}),c[t]=h);return"url("+this.url+
"#"+g+")"}else return e.test(a)?(d=cb(a),R(b,c+"-opacity",d.get("a")),d.get("rgb")):(b.removeAttribute(c+"-opacity"),a)},text:function(a,b,c,d){var e=X.chart.style,b=y(r(b,0)),c=y(r(c,0)),a=this.createElement("text").attr({x:b,y:c,text:a}).css({fontFamily:e.fontFamily,fontSize:e.fontSize});a.x=b;a.y=c;a.useHTML=d;return a},label:function(a,b,c,d,e,f){function g(){var a=i.styles,a=a&&a.textAlign,b=x,c=x+y(N(i.element.style.fontSize||11)*1.2);if(A(u)&&(a==="center"||a==="right"))b+={center:0.5,right:1}[a]*
(u-p.width);(b!==l.x||c!==l.y)&&l.attr({x:b,y:c});l.x=b;l.y=c}function h(a,b){m?m.attr(a,b):ya[a]=b}function j(){i.attr({text:a,x:b,y:c,anchorX:e,anchorY:f})}var k=this,i=k.g(),l=k.text().attr({zIndex:1}).add(i),m,p,t="left",x=3,u,w,v,q,r=0,ya={},I=i.attrSetters;W(i,"add",j);I.width=function(a){u=a;return!1};I.height=function(a){w=a;return!1};I.padding=function(a){x=a;g();return!1};I.align=function(a){t=a;return!1};I.text=function(a,b){l.attr(b,a);p=(u===void 0||w===void 0||i.styles.textAlign)&&l.getBBox(!0);
i.width=(u||p.width)+2*x;i.height=(w||p.height)+2*x;if(!m)i.box=m=d?k.symbol(d,0,0,i.width,i.height):k.rect(0,0,i.width,i.height,0,ya["stroke-width"]),m.add(i);m.attr(H({width:i.width,height:i.height},ya));ya=null;g();return!1};I["stroke-width"]=function(a,b){r=a%2/2;h(b,a);return!1};I.stroke=I.fill=I.r=function(a,b){h(b,a);return!1};I.anchorX=function(a,b){e=a;h(b,a+r-v);return!1};I.anchorY=function(a,b){f=a;h(b,a-q);return!1};I.x=function(a){v=a;v-={left:0,center:0.5,right:1}[t]*((u||p.width)+x);
i.attr("translateX",y(v));return!1};I.y=function(a){q=a;i.attr("translateY",y(a));return!1};var Ra=i.css;return E(i,{css:function(a){if(a){var b={},a=H({},a);n("fontSize,fontWeight,fontFamily,color,lineHeight,width".split(","),function(c){a[c]!==G&&(b[c]=a[c],delete a[c])});l.css(b)}return Ra.call(i,a)},getBBox:function(){return m.getBBox()},shadow:function(a){m.shadow(a);return i},destroy:function(){ra(i,"add",j);ra(i.element,"mouseenter");ra(i.element,"mouseleave");l&&(l=l.destroy());Bb.prototype.destroy.call(i)}})}};
Nb=Mb;var Rb;if(!Ob)B=pa(Bb,{init:function(a,b){var c=["<",b,' filled="f" stroked="f"'],d=["position: ",Cb,";"];(b==="shape"||b===vb)&&d.push("left:0;top:0;width:10px;height:10px;");Pb&&d.push("visibility: ",b===vb?Ta:bb);c.push(' style="',d.join(""),'"/>');if(b)c=b===vb||b==="span"||b==="img"?c.join(""):a.prepVML(c),this.element=na(c);this.renderer=a;this.attrSetters={}},add:function(a){var b=this.renderer,c=this.element,d=b.box,d=a?a.element||a:d;a&&a.inverted&&b.invertChild(c,d);Pb&&d.gVis===Ta&&
J(c,{visibility:Ta});d.appendChild(c);this.added=!0;this.alignOnAdd&&!this.deferUpdateTransform&&this.updateTransform();Y(this,"add");return this},toggleChildren:function(a,b){for(var c=a.childNodes,d=c.length;d--;)J(c[d],{visibility:b}),c[d].nodeName==="DIV"&&this.toggleChildren(c[d],b)},attr:function(a,b){var c,d,e,f=this.element||{},g=f.style,h=f.nodeName,j=this.renderer,k=this.symbolName,i,l=this.shadows,m,p=this.attrSetters,n=this;zb(a)&&A(b)&&(c=a,a={},a[c]=b);if(zb(a))c=a,n=c==="strokeWidth"||
c==="stroke-width"?this.strokeweight:this[c];else for(c in a)if(d=a[c],m=!1,e=p[c]&&p[c](d,c),e!==!1&&d!==null){e!==G&&(d=e);if(k&&/^(x|y|r|start|end|width|height|innerR|anchorX|anchorY)/.test(c))i||(this.symbolAttr(a),i=!0),m=!0;else if(c==="d"){d=d||[];this.d=d.join(" ");e=d.length;for(m=[];e--;)m[e]=Sb(d[e])?y(d[e]*10)-5:d[e]==="Z"?"x":d[e];d=m.join(" ")||"x";f.path=d;if(l)for(e=l.length;e--;)l[e].path=d;m=!0}else if(c==="zIndex"||c==="visibility"){if(Pb&&c==="visibility"&&h==="DIV")f.gVis=d,this.toggleChildren(f,
d),d===bb&&(d=null);d&&(g[c]=d);m=!0}else if(c==="width"||c==="height")d=T(0,d),this[c]=d,this.updateClipping?(this[c]=d,this.updateClipping()):g[c]=d,m=!0;else if(/^(x|y)$/.test(c))this[c]=d,f.tagName==="SPAN"?this.updateTransform():g[{x:"left",y:"top"}[c]]=d;else if(c==="class")f.className=d;else if(c==="stroke")d=j.color(d,f,c),c="strokecolor";else if(c==="stroke-width"||c==="strokeWidth")f.stroked=d?!0:!1,c="strokeweight",this[c]=d,Sb(d)&&(d+=Ea);else if(c==="dashstyle")(f.getElementsByTagName("stroke")[0]||
na(j.prepVML(["<stroke/>"]),null,null,f))[c]=d||"solid",this.dashstyle=d,m=!0;else if(c==="fill")h==="SPAN"?g.color=d:(f.filled=d!==oa?!0:!1,d=j.color(d,f,c),c="fillcolor");else if(c==="translateX"||c==="translateY"||c==="rotation"||c==="align")c==="align"&&(c="textAlign"),this[c]=d,this.updateTransform(),m=!0;else if(c==="text")this.bBox=null,f.innerHTML=d,m=!0;if(l&&c==="visibility")for(e=l.length;e--;)l[e].style[c]=d;m||(Pb?f[c]=d:R(f,c,d))}return n},clip:function(a){var b=this,c=a.members;c.push(b);
b.destroyClip=function(){Fb(c,b)};return b.css(a.getCSS(b.inverted))},css:function(a){var b=this.element;if(b=a&&b.tagName==="SPAN"&&a.width)delete a.width,this.textWidth=b,this.updateTransform();this.styles=E(this.styles,a);J(this.element,a);return this},safeRemoveChild:function(a){a.parentNode&&Hb(a)},destroy:function(){this.destroyClip&&this.destroyClip();return Bb.prototype.destroy.apply(this)},empty:function(){for(var a=this.element.childNodes,b=a.length,c;b--;)c=a[b],c.parentNode.removeChild(c)},
getBBox:function(a){var b=this.element,c=this.bBox;if(!c||a){if(b.nodeName==="text")b.style.position=Cb;c=this.bBox={x:b.offsetLeft,y:b.offsetTop,width:b.offsetWidth,height:b.offsetHeight}}return c},on:function(a,b){this.element["on"+a]=function(){var a=fa.event;a.target=a.srcElement;b(a)};return this},updateTransform:function(){if(this.added){var a=this,b=a.element,c=a.translateX||0,d=a.translateY||0,e=a.x||0,f=a.y||0,g=a.textAlign||"left",h={left:0,center:0.5,right:1}[g],j=g&&g!=="left",k=a.shadows;
if(c||d)J(b,{marginLeft:c,marginTop:d}),k&&n(k,function(a){J(a,{marginLeft:c+1,marginTop:d+1})});a.inverted&&n(b.childNodes,function(c){a.renderer.invertChild(c,b)});if(b.tagName==="SPAN"){var i,l,k=a.rotation,m;i=0;var p=1,t=0,x;m=N(a.textWidth);var u=a.xCorr||0,w=a.yCorr||0,v=[k,g,b.innerHTML,a.textWidth].join(",");if(v!==a.cTT)A(k)&&(i=k*Ec,p=ia(i),t=ma(i),J(b,{filter:k?["progid:DXImageTransform.Microsoft.Matrix(M11=",p,", M12=",-t,", M21=",t,", M22=",p,", sizingMethod='auto expand')"].join(""):
oa})),i=r(a.elemWidth,b.offsetWidth),l=r(a.elemHeight,b.offsetHeight),i>m&&(J(b,{width:m+Ea,display:"block",whiteSpace:"normal"}),i=m),m=y((N(b.style.fontSize)||12)*1.2),u=p<0&&-i,w=t<0&&-l,x=p*t<0,u+=t*m*(x?1-h:h),w-=p*m*(k?x?h:1-h:1),j&&(u-=i*h*(p<0?-1:1),k&&(w-=l*h*(t<0?-1:1)),J(b,{textAlign:g})),a.xCorr=u,a.yCorr=w;J(b,{left:e+u,top:f+w});a.cTT=v}}else this.alignOnAdd=!0},shadow:function(a,b){var c=[],d,e=this.element,f=this.renderer,g,h=e.style,j,k=e.path;k&&typeof k.value!=="string"&&(k="x");
if(a){for(d=1;d<=3;d++)j=['<shape isShadow="true" strokeweight="',7-2*d,'" filled="false" path="',k,'" coordsize="100,100" style="',e.style.cssText,'" />'],g=na(f.prepVML(j),null,{left:N(h.left)+1,top:N(h.top)+1}),j=['<stroke color="black" opacity="',0.05*d,'"/>'],na(f.prepVML(j),null,null,g),b?b.element.appendChild(g):e.parentNode.insertBefore(g,e),c.push(g);this.shadows=c}return this}}),Rb=function(){this.init.apply(this,arguments)},Rb.prototype=H(Mb.prototype,{Element:B,isIE8:ib.indexOf("MSIE 8.0")>
-1,init:function(a,b,c){var d;this.alignedObjects=[];d=this.createElement(vb);a.appendChild(d.element);this.box=d.element;this.boxWrapper=d;this.setSize(b,c,!1);if(!S.namespaces.hcv)S.namespaces.add("hcv","urn:schemas-microsoft-com:vml"),S.createStyleSheet().cssText="hcv\\:fill, hcv\\:path, hcv\\:shape, hcv\\:stroke{ behavior:url(#default#VML); display: inline-block; } "},clipRect:function(a,b,c,d){var e=this.createElement();return E(e,{members:[],left:a,top:b,width:c,height:d,getCSS:function(a){var b=
this.top,c=this.left,d=c+this.width,e=b+this.height,b={clip:"rect("+y(a?c:b)+"px,"+y(a?e:d)+"px,"+y(a?d:e)+"px,"+y(a?b:c)+"px)"};!a&&Pb&&E(b,{width:d+Ea,height:e+Ea});return b},updateClipping:function(){n(e.members,function(a){a.css(e.getCSS(a.inverted))})}})},color:function(a,b,c){var d,e=/^rgba/;if(a&&a.linearGradient){var f,g,h=a.linearGradient,j=h.x1||h[0]||0,k=h.y1||h[1]||0,i=h.x2||h[2]||0,h=h.y2||h[3]||0,l,m,p,t;n(a.stops,function(a,b){e.test(a[1])?(d=cb(a[1]),f=d.get("rgb"),g=d.get("a")):(f=
a[1],g=1);b?(p=f,t=g):(l=f,m=g)});if(c==="fill")a=90-sa.atan((h-k)/(i-j))*180/Ia,a=['<fill colors="0% ',l,",100% ",p,'" angle="',a,'" opacity="',t,'" o:opacity2="',m,'" type="gradient" focus="100%" method="any" />'],na(this.prepVML(a),null,null,b);else return f}else if(e.test(a)&&b.tagName!=="IMG")return d=cb(a),a=["<",c,' opacity="',d.get("a"),'"/>'],na(this.prepVML(a),null,null,b),d.get("rgb");else{b=b.getElementsByTagName(c);if(b.length)b[0].opacity=1;return a}},prepVML:function(a){var b=this.isIE8,
a=a.join("");b?(a=a.replace("/>",' xmlns="urn:schemas-microsoft-com:vml" />'),a=a.indexOf('style="')===-1?a.replace("/>",' style="display:inline-block;behavior:url(#default#VML);" />'):a.replace('style="','style="display:inline-block;behavior:url(#default#VML);')):a=a.replace("<","<hcv:");return a},text:function(a,b,c){var d=X.chart.style;return this.createElement("span").attr({text:a,x:y(b),y:y(c)}).css({whiteSpace:"nowrap",fontFamily:d.fontFamily,fontSize:d.fontSize})},path:function(a){return this.createElement("shape").attr({coordsize:"100 100",
d:a})},circle:function(a,b,c){return this.symbol("circle").attr({x:a,y:b,r:c})},g:function(a){var b;a&&(b={className:gb+a,"class":gb+a});return this.createElement(vb).attr(b)},image:function(a,b,c,d,e){var f=this.createElement("img").attr({src:a});arguments.length>1&&f.css({left:b,top:c,width:d,height:e});return f},rect:function(a,b,c,d,e,f){if(rb(a))b=a.y,c=a.width,d=a.height,f=a.strokeWidth,a=a.x;var g=this.symbol("rect");g.r=e;return g.attr(g.crisp(f,a,b,T(c,0),T(d,0)))},invertChild:function(a,
b){var c=b.style;J(a,{flip:"x",left:N(c.width)-10,top:N(c.height)-10,rotation:-90})},symbols:{arc:function(a,b,c,d,e){var f=e.start,g=e.end,c=e.r||c||d,d=ia(f),h=ma(f),j=ia(g),k=ma(g),e=e.innerR,i=0.07/c,l=e&&0.1/e||0;if(g-f===0)return["x"];else 2*Ia-g+f<i?j=-i:g-f<l&&(j=ia(f+l));return["wa",a-c,b-c,a+c,b+c,a+c*d,b+c*h,a+c*j,b+c*k,"at",a-e,b-e,a+e,b+e,a+e*j,b+e*k,a+e*d,b+e*h,"x","e"]},circle:function(a,b,c,d){return["wa",a,b,a+c,b+d,a+c,b+d/2,a+c,b+d/2,"e"]},rect:function(a,b,c,d,e){if(!A(e))return[];
var f=a+c,g=b+d,c=va(e.r||0,c,d);return[ta,a+c,b,ga,f-c,b,"wa",f-2*c,b,f,b+2*c,f-c,b,f,b+c,ga,f,g-c,"wa",f-2*c,g-2*c,f,g,f,g-c,f-c,g,ga,a+c,g,"wa",a,g-2*c,a+2*c,g,a+c,g,a,g-c,ga,a,b+c,"wa",a,b,a+2*c,b+2*c,a,b+c,a+c,b,"x","e"]}}}),Nb=Rb;$b.prototype.callbacks=[];var jb=function(){};jb.prototype={init:function(a,b,c){var d=a.chart.counters;this.series=a;this.applyOptions(b,c);this.pointAttr={};if(a.options.colorByPoint){b=a.chart.options.colors;if(!this.options)this.options={};this.color=this.options.color=
this.color||b[d.color++];d.wrapColor(b.length)}a.chart.pointCount++;return this},applyOptions:function(a,b){var c=this.series,d=typeof a;this.config=a;if(d==="number"||a===null)this.y=a;else if(typeof a[0]==="number")this.x=a[0],this.y=a[1];else if(d==="object"&&typeof a.length!=="number")E(this,a),this.options=a;else if(typeof a[0]==="string")this.name=a[0],this.y=a[1];if(this.x===G)this.x=b===G?c.autoIncrement():b},destroy:function(){var a=this.series,b=a.chart.hoverPoints,c;a.chart.pointCount--;
b&&(this.setState(),Fb(b,this));if(this===a.chart.hoverPoint)this.onMouseOut();a.chart.hoverPoints=null;if(this.graphic||this.dataLabel)ra(this),this.destroyElements();this.legendItem&&this.series.chart.legend.destroyItem(this);for(c in this)this[c]=null},destroyElements:function(){for(var a="graphic,tracker,dataLabel,group,connector,shadowGroup".split(","),b,c=6;c--;)b=a[c],this[b]&&(this[b]=this[b].destroy())},getLabelConfig:function(){return{x:this.category,y:this.y,key:this.name||this.category,
series:this.series,point:this,percentage:this.percentage,total:this.total||this.stackTotal}},select:function(a,b){var c=this,d=c.series.chart,a=r(a,!c.selected);c.firePointEvent(a?"select":"unselect",{accumulate:b},function(){c.selected=a;c.setState(a&&"select");b||n(d.getSelectedPoints(),function(a){if(a.selected&&a!==c)a.selected=!1,a.setState(la),a.firePointEvent("unselect")})})},onMouseOver:function(){var a=this.series,b=a.chart,c=b.tooltip,d=b.hoverPoint;if(d&&d!==this)d.onMouseOut();this.firePointEvent("mouseOver");
c&&(!c.shared||a.noSharedTooltip)&&c.refresh(this);this.setState(fb);b.hoverPoint=this},onMouseOut:function(){this.firePointEvent("mouseOut");this.setState();this.series.chart.hoverPoint=null},tooltipFormatter:function(a){var b=this.series,c=b.tooltipOptions,d=String(this.y).split("."),d=d[1]?d[1].length:0,e=a.match(/\{(series|point)\.[a-zA-Z]+\}/g),f=/[\.}]/,g,h,j;for(j in e)h=e[j],zb(h)&&h!==a&&(g=h.indexOf("point")===1?this:b,g=h==="{point.y}"?(c.valuePrefix||c.yPrefix||"")+Ub(this.y,r(c.valueDecimals,
c.yDecimals,d))+(c.valueSuffix||c.ySuffix||""):g[e[j].split(f)[1]],a=a.replace(e[j],g));return a},update:function(a,b,c){var d=this,e=d.series,f=d.graphic,g,h=e.data,j=h.length,k=e.chart,b=r(b,!0);d.firePointEvent("update",{options:a},function(){d.applyOptions(a);rb(a)&&(e.getAttribs(),f&&f.attr(d.pointAttr[e.state]));for(g=0;g<j;g++)if(h[g]===d){e.xData[g]=d.x;e.yData[g]=d.y;e.options.data[g]=a;break}e.isDirty=!0;e.isDirtyData=!0;b&&k.redraw(c)})},remove:function(a,b){var c=this,d=c.series,e=d.chart,
f,g=d.data,h=g.length;Ib(b,e);a=r(a,!0);c.firePointEvent("remove",null,function(){for(f=0;f<h;f++)if(g[f]===c){g.splice(f,1);d.options.data.splice(f,1);d.xData.splice(f,1);d.yData.splice(f,1);break}c.destroy();d.isDirty=!0;d.isDirtyData=!0;a&&e.redraw()})},firePointEvent:function(a,b,c){var d=this,e=this.series.options;(e.point.events[a]||d.options&&d.options.events&&d.options.events[a])&&this.importEvents();a==="click"&&e.allowPointSelect&&(c=function(a){d.select(null,a.ctrlKey||a.metaKey||a.shiftKey)});
Y(this,a,b,c)},importEvents:function(){if(!this.hasImportedEvents){var a=H(this.series.options.point,this.options).events,b;this.events=a;for(b in a)W(this,b,a[b]);this.hasImportedEvents=!0}},setState:function(a){var b=this.plotX,c=this.plotY,d=this.series,e=d.options.states,f=aa[d.type].marker&&d.options.marker,g=f&&!f.enabled,h=f&&f.states[a],j=h&&h.enabled===!1,k=d.stateMarkerGraphic,i=d.chart,l=this.pointAttr,a=a||la;if(!(a===this.state||this.selected&&a!=="select"||e[a]&&e[a].enabled===!1||a&&
(j||g&&!h.enabled))){if(this.graphic)e=this.graphic.symbolName&&l[a].r,this.graphic.attr(H(l[a],e?{x:b-e,y:c-e,width:2*e,height:2*e}:{}));else{if(a){if(!k)e=f.radius,d.stateMarkerGraphic=k=i.renderer.symbol(d.symbol,-e,-e,2*e,2*e).attr(l[a]).add(d.group);k.translate(b,c)}if(k)k[a?"show":"hide"]()}this.state=a}}};var M=function(){};M.prototype={isCartesian:!0,type:"line",pointClass:jb,pointAttrToOptions:{stroke:"lineColor","stroke-width":"lineWidth",fill:"fillColor",r:"radius"},init:function(a,b){var c,
d;d=a.series.length;this.chart=a;this.options=b=this.setOptions(b);this.bindAxes();E(this,{index:d,name:b.name||"Series "+(d+1),state:la,pointAttr:{},visible:b.visible!==!1,selected:b.selected===!0});d=b.events;for(c in d)W(this,c,d[c]);if(d&&d.click||b.point&&b.point.events&&b.point.events.click||b.allowPointSelect)a.runTrackerClick=!0;this.getColor();this.getSymbol();this.setData(b.data,!1)},bindAxes:function(){var a=this,b=a.options,c=a.chart,d;a.isCartesian&&n(["xAxis","yAxis"],function(e){n(c[e],
function(c){d=c.options;if(b[e]===d.index||b[e]===G&&d.index===0)c.series.push(a),a[e]=c,c.isDirty=!0})})},autoIncrement:function(){var a=this.options,b=this.xIncrement,b=r(b,a.pointStart,0);this.pointInterval=r(this.pointInterval,a.pointInterval,1);this.xIncrement=b+this.pointInterval;return b},getSegments:function(){var a=-1,b=[],c,d=this.points,e=d.length;if(e)if(this.options.connectNulls){for(c=e;c--;)d[c].y===null&&d.splice(c,1);b=[d]}else n(d,function(c,g){c.y===null?(g>a+1&&b.push(d.slice(a+
1,g)),a=g):g===e-1&&b.push(d.slice(a+1,g+1))});this.segments=b},setOptions:function(a){var b=this.chart.options,c=b.plotOptions,d=a.data;a.data=null;c=H(c[this.type],c.series,a);c.data=a.data=d;this.tooltipOptions=H(b.tooltip,c.tooltip);return c},getColor:function(){var a=this.chart.options.colors,b=this.chart.counters;this.color=this.options.color||a[b.color++]||"#0000ff";b.wrapColor(a.length)},getSymbol:function(){var a=this.options.marker,b=this.chart,c=b.options.symbols,b=b.counters;this.symbol=
a.symbol||c[b.symbol++];if(/^url/.test(this.symbol))a.radius=0;b.wrapSymbol(c.length)},addPoint:function(a,b,c,d){var e=this.data,f=this.graph,g=this.area,h=this.chart,j=this.xData,k=this.yData,i=f&&f.shift||0,l=this.options.data;Ib(d,h);if(f&&c)f.shift=i+1;if(g)g.shift=i+1,g.isArea=!0;b=r(b,!0);d={series:this};this.pointClass.prototype.applyOptions.apply(d,[a]);j.push(d.x);k.push(this.valueCount===4?[d.open,d.high,d.low,d.close]:d.y);l.push(a);c&&(e[0]?e[0].remove(!1):(e.shift(),j.shift(),k.shift(),
l.shift()));this.getAttribs();this.isDirtyData=this.isDirty=!0;b&&h.redraw()},setData:function(a,b){var c=this.points,d=this.options,e=this.initialColor,f=this.chart,g=null;this.xIncrement=null;this.pointRange=this.xAxis&&this.xAxis.categories&&1||d.pointRange;if(A(e))f.counters.color=e;var h=[],j=[],k=a?a.length:[],i=this.valueCount===4;if(k>(d.turboThreshold||1E3)){for(e=0;g===null&&e<k;)g=a[e],e++;if(Sb(g)){g=r(d.pointStart,0);d=r(d.pointInterval,1);for(e=0;e<k;e++)h[e]=g,j[e]=a[e],g+=d;this.xIncrement=
g}else if(ic(g))if(i)for(e=0;e<k;e++)d=a[e],h[e]=d[0],j[e]=d.slice(1,5);else for(e=0;e<k;e++)d=a[e],h[e]=d[0],j[e]=d[1]}else for(e=0;e<k;e++)d={series:this},this.pointClass.prototype.applyOptions.apply(d,[a[e]]),h[e]=d.x,j[e]=i?[d.open,d.high,d.low,d.close]:d.y;this.data=[];this.options.data=a;this.xData=h;this.yData=j;for(e=c&&c.length||0;e--;)c[e]&&c[e].destroy&&c[e].destroy();this.isDirty=this.isDirtyData=f.isDirtyBox=!0;r(b,!0)&&f.redraw(!1)},remove:function(a,b){var c=this,d=c.chart,a=r(a,!0);
if(!c.isRemoving)c.isRemoving=!0,Y(c,"remove",null,function(){c.destroy();d.isDirtyLegend=d.isDirtyBox=!0;a&&d.redraw(b)});c.isRemoving=!1},processData:function(a){var b=this.xData,c=this.yData,d=b.length,e=0,f=d,g,h,j=this.xAxis,k=this.options,i=k.cropThreshold;if(this.isCartesian&&!this.isDirty&&!j.isDirty&&!this.yAxis.isDirty&&!a)return!1;if(!i||d>i||this.forceCrop)if(a=j.getExtremes(),j=a.min,i=a.max,b[d-1]<j||b[0]>i)b=[],c=[];else if(b[0]<j||b[d-1]>i){for(a=0;a<d;a++)if(b[a]>=j){e=T(0,a-1);break}for(;a<
d;a++)if(b[a]>i){f=a+1;break}b=b.slice(e,f);c=c.slice(e,f);g=!0}for(a=b.length-1;a>0;a--)if(d=b[a]-b[a-1],h===G||d<h)h=d;this.cropped=g;this.cropStart=e;this.processedXData=b;this.processedYData=c;if(k.pointRange===null)this.pointRange=h||1;this.closestPointRange=h},generatePoints:function(){var a=this.options.data,b=this.data,c,d=this.processedXData,e=this.processedYData,f=this.pointClass,g=d.length,h=this.cropStart||0,j,k=this.hasGroupedData,i,l=[],m;if(!b&&!k)b=[],b.length=a.length,b=this.data=
b;for(m=0;m<g;m++)j=h+m,k?l[m]=(new f).init(this,[d[m]].concat(sb(e[m]))):(b[j]?i=b[j]:b[j]=i=(new f).init(this,a[j],d[m]),l[m]=i);if(b&&(g!==(c=b.length)||k))for(m=0;m<c;m++)m===h&&!k&&(m+=g),b[m]&&b[m].destroyElements();this.data=b;this.points=l},translate:function(){this.processedXData||this.processData();this.generatePoints();var a=this.chart,b=this.options,c=b.stacking,d=this.xAxis,e=d.categories,f=this.yAxis,g=this.points,h=g.length,j=!!this.modifyValue,k=this.index===f.series.length-1,i;for(i=
0;i<h;i++){var l=g[i],m=l.x,p=l.y,n=l.low,r=f.stacks[(p<b.threshold?"-":"")+this.stackKey];l.plotX=y(d.translate(m)*10)/10;if(c&&this.visible&&r&&r[m]){n=r[m];m=n.total;n.cum=n=n.cum-p;p=n+p;if(k)n=b.threshold;c==="percent"&&(n=m?n*100/m:0,p=m?p*100/m:0);l.percentage=m?l.y*100/m:0;l.stackTotal=m}if(A(n))l.yBottom=f.translate(n,0,1,0,1);j&&(p=this.modifyValue(p,l));if(p!==null)l.plotY=y(f.translate(p,0,1,0,1)*10)/10;l.clientX=a.inverted?a.plotHeight-l.plotX:l.plotX;l.category=e&&e[l.x]!==G?e[l.x]:
l.x}this.getSegments()},setTooltipPoints:function(a){var b=this.chart,c=b.inverted,d=[],b=y((c?b.plotTop:b.plotLeft)+b.plotSizeX),e,f;e=this.xAxis;var g,h,j=[];if(this.options.enableMouseTracking!==!1){if(a)this.tooltipPoints=null;n(this.segments||this.points,function(a){d=d.concat(a)});e&&e.reversed&&(d=d.reverse());a=d.length;for(h=0;h<a;h++){g=d[h];e=d[h-1]?d[h-1]._high+1:0;for(f=g._high=d[h+1]?Na((g.plotX+(d[h+1]?d[h+1].plotX:b))/2):b;e<=f;)j[c?b-e++:e++]=g}this.tooltipPoints=j}},tooltipHeaderFormatter:function(a){var b=
this.tooltipOptions,c=b.xDateFormat||"%A, %b %e, %Y",d=this.xAxis;return b.headerFormat.replace("{point.key}",d&&d.options.type==="datetime"?wb(c,a):a).replace("{series.name}",this.name).replace("{series.color}",this.color)},onMouseOver:function(){var a=this.chart,b=a.hoverSeries;if(Ga||!a.mouseIsDown){if(b&&b!==this)b.onMouseOut();this.options.events.mouseOver&&Y(this,"mouseOver");this.setState(fb);a.hoverSeries=this}},onMouseOut:function(){var a=this.options,b=this.chart,c=b.tooltip,d=b.hoverPoint;
if(d)d.onMouseOut();this&&a.events.mouseOut&&Y(this,"mouseOut");c&&!a.stickyTracking&&!c.shared&&c.hide();this.setState();b.hoverSeries=null},animate:function(a){var b=this.chart,c=this.clipRect,d=this.options.animation;d&&!rb(d)&&(d={});if(a){if(!c.isAnimating)c.attr("width",0),c.isAnimating=!0}else c.animate({width:b.plotSizeX},d),this.animate=null},drawPoints:function(){var a,b=this.points,c=this.chart,d,e,f,g,h,j,k,i;if(this.options.marker.enabled)for(f=b.length;f--;)if(g=b[f],d=g.plotX,e=g.plotY,
i=g.graphic,e!==G&&!isNaN(e))if(a=g.pointAttr[g.selected?"select":la],h=a.r,j=r(g.marker&&g.marker.symbol,this.symbol),k=j.indexOf("url")===0,i)i.animate(E({x:d-h,y:e-h},i.symbolName?{width:2*h,height:2*h}:{}));else if(h>0||k)g.graphic=c.renderer.symbol(j,d-h,e-h,2*h,2*h).attr(a).add(this.group)},convertAttribs:function(a,b,c,d){var e=this.pointAttrToOptions,f,g,h={},a=a||{},b=b||{},c=c||{},d=d||{};for(f in e)g=e[f],h[f]=r(a[g],b[f],c[f],d[f]);return h},getAttribs:function(){var a=this,b=aa[a.type].marker?
a.options.marker:a.options,c=b.states,d=c[fb],e,f=a.color,g={stroke:f,fill:f},h=a.points,j=[],k,i=a.pointAttrToOptions,l;a.options.marker?(d.radius=d.radius||b.radius+2,d.lineWidth=d.lineWidth||b.lineWidth+1):d.color=d.color||cb(d.color||f).brighten(d.brightness).get();j[la]=a.convertAttribs(b,g);n([fb,"select"],function(b){j[b]=a.convertAttribs(c[b],j[la])});a.pointAttr=j;for(f=h.length;f--;){g=h[f];if((b=g.options&&g.options.marker||g.options)&&b.enabled===!1)b.radius=0;e=!1;if(g.options)for(l in i)A(b[i[l]])&&
(e=!0);if(e){k=[];c=b.states||{};e=c[fb]=c[fb]||{};if(!a.options.marker)e.color=cb(e.color||g.options.color).brighten(e.brightness||d.brightness).get();k[la]=a.convertAttribs(b,j[la]);k[fb]=a.convertAttribs(c[fb],j[fb],k[la]);k.select=a.convertAttribs(c.select,j.select,k[la])}else k=j;g.pointAttr=k}},destroy:function(){var a=this,b=a.chart,c=a.clipRect,d=/AppleWebKit\/533/.test(ib),e,f,g=a.data||[],h,j,k;Y(a,"destroy");ra(a);n(["xAxis","yAxis"],function(b){if(k=a[b])Fb(k.series,a),k.isDirty=!0});
a.legendItem&&a.chart.legend.destroyItem(a);for(f=g.length;f--;)(h=g[f])&&h.destroy&&h.destroy();a.points=null;if(c&&c!==b.clipRect)a.clipRect=c.destroy();n(["area","graph","dataLabelsGroup","group","tracker"],function(b){a[b]&&(e=d&&b==="group"?"hide":"destroy",a[b][e]())});if(b.hoverSeries===a)b.hoverSeries=null;Fb(b.series,a);for(j in a)delete a[j]},drawDataLabels:function(){if(this.options.dataLabels.enabled){var a=this,b,c,d=a.points,e=a.options,f=e.dataLabels,g,h,j,k=a.dataLabelsGroup,i=a.chart,
l=a.xAxis,l=l?l.left:i.plotLeft,m=a.yAxis,m=m?m.top:i.plotTop,p=i.renderer,t=i.inverted,x=a.type,u=e.stacking,w=x==="column"||x==="bar",v=f.verticalAlign===null,q=f.y===null,ca;w&&(u?(v&&(f=H(f,{verticalAlign:"middle"})),q&&(f=H(f,{y:{top:14,middle:4,bottom:-6}[f.verticalAlign]}))):v&&(f=H(f,{verticalAlign:"top"})));k?k.translate(l,m):k=a.dataLabelsGroup=p.g("data-labels").attr({visibility:a.visible?bb:Ta,zIndex:6}).translate(l,m).add();h=f;n(d,function(d){ca=d.dataLabel;f=h;(g=d.options)&&g.dataLabels&&
(f=H(f,g.dataLabels));if(ca&&a.isCartesian&&!i.isInsidePlot(d.plotX,d.plotY))d.dataLabel=ca.destroy();else if(f.enabled){j=f.formatter.call(d.getLabelConfig(),f);var l=d.barX,m=l&&l+d.barW/2||d.plotX||-999,n=r(d.plotY,-999),v=f.align,K=q?d.y>=0?-6:12:f.y;b=(t?i.plotWidth-n:m)+f.x;c=(t?i.plotHeight-m:n)+K;x==="column"&&(b+={left:-1,right:1}[v]*d.barW/2||0);!u&&t&&d.y<0&&(v="right",b-=10);f.style.color=r(f.color,f.style.color,a.color,"black");if(ca)t&&!f.y&&(c=c+N(ca.styles.lineHeight)*0.9-ca.getBBox().height/
2),ca.attr({text:j}).animate({x:b,y:c});else if(A(j))ca=d.dataLabel=p.text(j,b,c).attr({align:v,rotation:f.rotation,zIndex:1}).css(f.style).add(k),t&&!f.y&&ca.attr({y:c+N(ca.styles.lineHeight)*0.9-ca.getBBox().height/2});if(w&&e.stacking&&ca)m=d.barY,n=d.barW,d=d.barH,ca.align(f,null,{x:t?i.plotWidth-m-d:l,y:t?i.plotHeight-l-n:m,width:t?d:n,height:t?n:d})}})}},drawGraph:function(){var a=this,b=a.options,c=a.graph,d=[],e,f=a.area,g=a.group,h=b.lineColor||a.color,j=b.lineWidth,k=b.dashStyle,i,l=a.chart.renderer,
m=a.yAxis.getThreshold(b.threshold),p=/^area/.test(a.type),t=[],x=[];n(a.segments,function(c){i=[];n(c,function(d,e){a.getPointSpline?i.push.apply(i,a.getPointSpline(c,d,e)):(i.push(e?ga:ta),e&&b.step&&i.push(d.plotX,c[e-1].plotY),i.push(d.plotX,d.plotY))});c.length>1?d=d.concat(i):t.push(c[0]);if(p){var e=[],f,g=i.length;for(f=0;f<g;f++)e.push(i[f]);g===3&&e.push(ga,i[1],i[2]);if(b.stacking&&a.type!=="areaspline")for(f=c.length-1;f>=0;f--)f<c.length-1&&b.step&&e.push(c[f+1].plotX,c[f].yBottom),e.push(c[f].plotX,
c[f].yBottom);else e.push(ga,c[c.length-1].plotX,m,ga,c[0].plotX,m);x=x.concat(e)}});a.graphPath=d;a.singlePoints=t;if(p)e=r(b.fillColor,cb(a.color).setOpacity(b.fillOpacity||0.75).get()),f?f.animate({d:x}):a.area=a.chart.renderer.path(x).attr({fill:e}).add(g);if(c)Jb(c),c.animate({d:d});else if(j){c={stroke:h,"stroke-width":j};if(k)c.dashstyle=k;a.graph=l.path(d).attr(c).add(g).shadow(b.shadow)}},render:function(){var a=this,b=a.chart,c,d,e=a.options,f=e.clip!==!1,g=e.animation,h=g&&a.animate,g=
h?g&&g.duration||500:0,j=a.clipRect,k=b.renderer;if(!j&&(j=a.clipRect=!b.hasRendered&&b.clipRect?b.clipRect:k.clipRect(0,0,b.plotSizeX,b.plotSizeY+1),!b.clipRect))b.clipRect=j;if(!a.group)c=a.group=k.g("series"),b.inverted&&(d=function(){c.attr({width:b.plotWidth,height:b.plotHeight}).invert()},d(),W(b,"resize",d),W(a,"destroy",function(){ra(b,"resize",d)})),f&&c.clip(j),c.attr({visibility:a.visible?bb:Ta,zIndex:e.zIndex}).translate(a.xAxis.left,a.yAxis.top).add(b.seriesGroup);a.drawDataLabels();
h&&a.animate(!0);a.getAttribs();a.drawGraph&&a.drawGraph();a.drawPoints();a.options.enableMouseTracking!==!1&&a.drawTracker();h&&a.animate();setTimeout(function(){j.isAnimating=!1;if((c=a.group)&&j!==b.clipRect&&j.renderer){if(f)c.clip(a.clipRect=b.clipRect);j.destroy()}},g);a.isDirty=a.isDirtyData=!1},redraw:function(){var a=this.chart,b=this.isDirtyData,c=this.group;c&&(a.inverted&&c.attr({width:a.plotWidth,height:a.plotHeight}),c.animate({translateX:this.xAxis.left,translateY:this.yAxis.top}));
this.translate();this.setTooltipPoints(!0);this.render();b&&Y(this,"updatedData")},setState:function(a){var b=this.options,c=this.graph,d=b.states,b=b.lineWidth,a=a||la;if(this.state!==a)this.state=a,d[a]&&d[a].enabled===!1||(a&&(b=d[a].lineWidth||b+1),c&&!c.dashstyle&&c.attr({"stroke-width":b},a?0:500))},setVisible:function(a,b){var c=this.chart,d=this.legendItem,e=this.group,f=this.tracker,g=this.dataLabelsGroup,h,j=this.points,k=c.options.chart.ignoreHiddenSeries;h=this.visible;h=(this.visible=
a=a===G?!h:a)?"show":"hide";if(e)e[h]();if(f)f[h]();else if(j)for(e=j.length;e--;)if(f=j[e],f.tracker)f.tracker[h]();if(g)g[h]();d&&c.legend.colorizeItem(this,a);this.isDirty=!0;this.options.stacking&&n(c.series,function(a){if(a.options.stacking&&a.visible)a.isDirty=!0});if(k)c.isDirtyBox=!0;b!==!1&&c.redraw();Y(this,h)},show:function(){this.setVisible(!0)},hide:function(){this.setVisible(!1)},select:function(a){this.selected=a=a===G?!this.selected:a;if(this.checkbox)this.checkbox.checked=a;Y(this,
a?"select":"unselect")},drawTracker:function(){var a=this,b=a.options,c=[].concat(a.graphPath),d=c.length,e=a.chart,f=e.renderer,g=e.options.tooltip.snap,h=a.tracker,j=b.cursor,j=j&&{cursor:j},k=a.singlePoints,i;if(d)for(i=d+1;i--;)c[i]===ta&&c.splice(i+1,0,c[i+1]-g,c[i+2],ga),(i&&c[i]===ta||i===d)&&c.splice(i,0,ga,c[i-2]+g,c[i-1]);for(i=0;i<k.length;i++)d=k[i],c.push(ta,d.plotX-g,d.plotY,ga,d.plotX+g,d.plotY);h?h.attr({d:c}):(h=f.g().clip(e.clipRect).add(e.trackerGroup),a.tracker=f.path(c).attr({isTracker:!0,
stroke:Hc,fill:oa,"stroke-linejoin":"bevel","stroke-width":b.lineWidth+2*g,visibility:a.visible?bb:Ta,zIndex:b.zIndex||1}).on(Ga?"touchstart":"mouseover",function(){if(e.hoverSeries!==a)a.onMouseOver()}).on("mouseout",function(){if(!b.stickyTracking)a.onMouseOut()}).css(j).add(h))}};B=pa(M);ba.line=B;B=pa(M,{type:"area",useThreshold:!0});ba.area=B;B=pa(M,{type:"spline",getPointSpline:function(a,b,c){var d=b.plotX,e=b.plotY,f=a[c-1],g=a[c+1],h,j,k,i;if(c&&c<a.length-1){a=f.plotY;k=g.plotX;var g=g.plotY,
l;h=(1.5*d+f.plotX)/2.5;j=(1.5*e+a)/2.5;k=(1.5*d+k)/2.5;i=(1.5*e+g)/2.5;l=(i-j)*(k-d)/(k-h)+e-i;j+=l;i+=l;j>a&&j>e?(j=T(a,e),i=2*e-j):j<a&&j<e&&(j=va(a,e),i=2*e-j);i>g&&i>e?(i=T(g,e),j=2*e-i):i<g&&i<e&&(i=va(g,e),j=2*e-i);b.rightContX=k;b.rightContY=i}c?(b=["C",f.rightContX||f.plotX,f.rightContY||f.plotY,h||d,j||e,d,e],f.rightContX=f.rightContY=null):b=[ta,d,e];return b}});ba.spline=B;B=pa(B,{type:"areaspline",useThreshold:!0});ba.areaspline=B;var fc=pa(M,{type:"column",useThreshold:!0,tooltipOutsidePlot:!0,
pointAttrToOptions:{stroke:"borderColor","stroke-width":"borderWidth",fill:"color",r:"borderRadius"},init:function(){M.prototype.init.apply(this,arguments);var a=this,b=a.chart;b.hasRendered&&n(b.series,function(b){if(b.type===a.type)b.isDirty=!0})},translate:function(){var a=this,b=a.chart,c=a.options,d=c.stacking,e=c.borderWidth,f=0,g=a.xAxis,h=g.reversed,j={},k,i;M.prototype.translate.apply(a);n(b.series,function(b){if(b.type===a.type&&b.visible&&a.options.group===b.options.group)b.options.stacking?
(k=b.stackKey,j[k]===G&&(j[k]=f++),i=j[k]):i=f++,b.columnIndex=i});var l=a.points,g=Ba(g.translationSlope)*(g.ordinalSlope||g.closestPointRange||1),m=g*c.groupPadding,p=(g-2*m)/f,t=c.pointWidth,x=A(t)?(p-t)/2:p*c.pointPadding,u=bc(T(r(t,p-2*x),1)),w=x+(m+((h?f-a.columnIndex:a.columnIndex)||0)*p-g/2)*(h?-1:1),v=a.yAxis.getThreshold(c.threshold),q=r(c.minPointLength,5);n(l,function(f){var g=f.plotY,h=f.yBottom||v,i=f.plotX+w,j=bc(va(g,h)),k=bc(T(g,h)-j),l=a.yAxis.stacks[(f.y<0?"-":"")+a.stackKey];d&&
a.visible&&l&&l[f.x]&&l[f.x].setOffset(w,u);Ba(k)<q&&q&&(k=q,j=Ba(j-v)>q?h-q:v-(g<=v?q:0));E(f,{barX:i,barY:j,barW:u,barH:k});f.shapeType="rect";g=E(b.renderer.Element.prototype.crisp.apply({},[e,i,j,u,k]),{r:c.borderRadius});e%2&&(g.y-=1,g.height+=1);f.shapeArgs=g;f.trackerArgs=Ba(k)<3&&H(f.shapeArgs,{height:6,y:j-3})})},getSymbol:function(){},drawGraph:function(){},drawPoints:function(){var a=this,b=a.options,c=a.chart.renderer,d,e;n(a.points,function(f){var g=f.plotY;if(g!==G&&!isNaN(g)&&f.y!==
null)d=f.graphic,e=f.shapeArgs,d?(Jb(d),d.animate(e)):f.graphic=d=c[f.shapeType](e).attr(f.pointAttr[f.selected?"select":la]).add(a.group).shadow(b.shadow)})},drawTracker:function(){var a=this,b=a.chart,c=b.renderer,d,e,f=+new Date,g=a.options,h=g.cursor,j=h&&{cursor:h},k,i;a.isCartesian&&(k=c.g().clip(b.clipRect).add(b.trackerGroup));n(a.points,function(h){e=h.tracker;d=h.trackerArgs||h.shapeArgs;delete d.strokeWidth;if(h.y!==null)e?e.attr(d):h.tracker=c[h.shapeType](d).attr({isTracker:f,fill:Hc,
visibility:a.visible?bb:Ta,zIndex:g.zIndex||1}).on(Ga?"touchstart":"mouseover",function(c){i=c.relatedTarget||c.fromElement;if(b.hoverSeries!==a&&R(i,"isTracker")!==f)a.onMouseOver();h.onMouseOver()}).on("mouseout",function(b){if(!g.stickyTracking&&(i=b.relatedTarget||b.toElement,R(i,"isTracker")!==f))a.onMouseOut()}).css(j).add(h.group||k)})},animate:function(a){var b=this,c=b.points;if(!a)n(c,function(a){var c=a.graphic,a=a.shapeArgs;c&&(c.attr({height:0,y:b.yAxis.translate(0,0,1)}),c.animate({height:a.height,
y:a.y},b.options.animation))}),b.animate=null},remove:function(){var a=this,b=a.chart;b.hasRendered&&n(b.series,function(b){if(b.type===a.type)b.isDirty=!0});M.prototype.remove.apply(a,arguments)}});ba.column=fc;B=pa(fc,{type:"bar",init:function(){this.inverted=!0;fc.prototype.init.apply(this,arguments)}});ba.bar=B;B=pa(M,{type:"scatter",translate:function(){var a=this;M.prototype.translate.apply(a);n(a.points,function(b){b.shapeType="circle";b.shapeArgs={x:b.plotX,y:b.plotY,r:a.chart.options.tooltip.snap}})},
drawTracker:function(){for(var a=this,b=a.options.cursor,b=b&&{cursor:b},c=a.points,d=c.length,e;d--;)if(e=c[d].graphic)e.element._index=d;a._hasTracking?a._hasTracking=!0:a.group.on(Ga?"touchstart":"mouseover",function(b){a.onMouseOver();c[b.target._index].onMouseOver()}).on("mouseout",function(){if(!a.options.stickyTracking)a.onMouseOut()}).css(b)}});ba.scatter=B;B=pa(jb,{init:function(){jb.prototype.init.apply(this,arguments);var a=this,b;E(a,{visible:a.visible!==!1,name:r(a.name,"Slice")});b=
function(){a.slice()};W(a,"select",b);W(a,"unselect",b);return a},setVisible:function(a){var b=this.series.chart,c=this.tracker,d=this.dataLabel,e=this.connector,f=this.shadowGroup,g;g=(this.visible=a=a===G?!this.visible:a)?"show":"hide";this.group[g]();if(c)c[g]();if(d)d[g]();if(e)e[g]();if(f)f[g]();this.legendItem&&b.legend.colorizeItem(this,a)},slice:function(a,b,c){var d=this.series.chart,e=this.slicedTranslation;Ib(c,d);r(b,!0);a=this.sliced=A(a)?a:!this.sliced;a={translateX:a?e[0]:d.plotLeft,
translateY:a?e[1]:d.plotTop};this.group.animate(a);this.shadowGroup&&this.shadowGroup.animate(a)}});B=pa(M,{type:"pie",isCartesian:!1,pointClass:B,pointAttrToOptions:{stroke:"borderColor","stroke-width":"borderWidth",fill:"color"},getColor:function(){this.initialColor=this.chart.counters.color},animate:function(){var a=this;n(a.points,function(b){var c=b.graphic,b=b.shapeArgs,d=-Ia/2;c&&(c.attr({r:0,start:d,end:d}),c.animate({r:b.r,start:b.start,end:b.end},a.options.animation))});a.animate=null},
setData:function(){M.prototype.setData.apply(this,arguments);this.processData();this.generatePoints()},translate:function(){this.generatePoints();var a=0,b=-0.25,c=this.options,d=c.slicedOffset,e=d+c.borderWidth,f=c.center.concat([c.size,c.innerSize||0]),g=this.chart,h=g.plotWidth,j=g.plotHeight,k,i,l,m=this.points,p=2*Ia,t,r=va(h,j),u,w,v,q=c.dataLabels.distance,f=nb(f,function(a,b){return(u=/%$/.test(a))?[h,j,r,r][b]*N(a)/100:a});this.getX=function(a,b){l=sa.asin((a-f[1])/(f[2]/2+q));return f[0]+
(b?-1:1)*ia(l)*(f[2]/2+q)};this.center=f;n(m,function(b){a+=b.y});n(m,function(c){t=a?c.y/a:0;k=y(b*p*1E3)/1E3;b+=t;i=y(b*p*1E3)/1E3;c.shapeType="arc";c.shapeArgs={x:f[0],y:f[1],r:f[2]/2,innerR:f[3]/2,start:k,end:i};l=(i+k)/2;c.slicedTranslation=nb([ia(l)*d+g.plotLeft,ma(l)*d+g.plotTop],y);w=ia(l)*f[2]/2;v=ma(l)*f[2]/2;c.tooltipPos=[f[0]+w*0.7,f[1]+v*0.7];c.labelPos=[f[0]+w+ia(l)*q,f[1]+v+ma(l)*q,f[0]+w+ia(l)*e,f[1]+v+ma(l)*e,f[0]+w,f[1]+v,q<0?"center":l<p/4?"left":"right",l];c.percentage=t*100;c.total=
a});this.setTooltipPoints()},render:function(){this.getAttribs();this.drawPoints();this.options.enableMouseTracking!==!1&&this.drawTracker();this.drawDataLabels();this.options.animation&&this.animate&&this.animate();this.isDirty=!1},drawPoints:function(){var a=this.chart,b=a.renderer,c,d,e,f=this.options.shadow,g,h;n(this.points,function(j){d=j.graphic;h=j.shapeArgs;e=j.group;g=j.shadowGroup;if(f&&!g)g=j.shadowGroup=b.g("shadow").attr({zIndex:4}).add();if(!e)e=j.group=b.g("point").attr({zIndex:5}).add();
c=j.sliced?j.slicedTranslation:[a.plotLeft,a.plotTop];e.translate(c[0],c[1]);g&&g.translate(c[0],c[1]);d?d.animate(h):j.graphic=b.arc(h).attr(E(j.pointAttr[la],{"stroke-linejoin":"round"})).add(j.group).shadow(f,g);j.visible===!1&&j.setVisible(!1)})},drawDataLabels:function(){var a=this.data,b,c=this.chart,d=this.options.dataLabels,e=r(d.connectorPadding,10),f=r(d.connectorWidth,1),g,h,j=r(d.softConnector,!0),k=d.distance,i=this.center,l=i[2]/2,i=i[1],m=k>0,p=[[],[]],t,x,u,w,v=2,q;if(d.enabled){M.prototype.drawDataLabels.apply(this);
n(a,function(a){a.dataLabel&&p[a.labelPos[7]<Ia/2?0:1].push(a)});p[1].reverse();w=function(a,b){return b.y-a.y};for(a=p[0][0]&&p[0][0].dataLabel&&N(p[0][0].dataLabel.styles.lineHeight);v--;){var y=[],A=[],I=p[v],B=I.length,s;for(q=i-l-k;q<=i+l+k;q+=a)y.push(q);u=y.length;if(B>u){h=[].concat(I);h.sort(w);for(q=B;q--;)h[q].rank=q;for(q=B;q--;)I[q].rank>=u&&I.splice(q,1);B=I.length}for(q=0;q<B;q++){b=I[q];h=b.labelPos;b=9999;for(x=0;x<u;x++)g=Ba(y[x]-h[1]),g<b&&(b=g,s=x);if(s<q&&y[q]!==null)s=q;else for(u<
B-q+s&&y[q]!==null&&(s=u-B+q);y[s]===null;)s++;A.push({i:s,y:y[s]});y[s]=null}A.sort(w);for(q=0;q<B;q++){b=I[q];h=b.labelPos;g=b.dataLabel;x=A.pop();t=h[1];u=b.visible===!1?Ta:bb;s=x.i;x=x.y;if(t>x&&y[s+1]!==null||t<x&&y[s-1]!==null)x=t;t=this.getX(s===0||s===y.length-1?t:x,v);g.attr({visibility:u,align:h[6]})[g.moved?"animate":"attr"]({x:t+d.x+({left:e,right:-e}[h[6]]||0),y:x+d.y});g.moved=!0;if(m&&f)g=b.connector,h=j?[ta,t+(h[6]==="left"?5:-5),x,"C",t,x,2*h[2]-h[4],2*h[3]-h[5],h[2],h[3],ga,h[4],
h[5]]:[ta,t+(h[6]==="left"?5:-5),x,ga,h[2],h[3],ga,h[4],h[5]],g?(g.animate({d:h}),g.attr("visibility",u)):b.connector=g=this.chart.renderer.path(h).attr({"stroke-width":f,stroke:d.connectorColor||b.color||"#606060",visibility:u,zIndex:3}).translate(c.plotLeft,c.plotTop).add()}}}},drawTracker:fc.prototype.drawTracker,getSymbol:function(){}});ba.pie=B;var Q=M.prototype,Uc=Q.processData,Vc=Q.generatePoints,Wc=Q.destroy,Xc=Q.tooltipHeaderFormatter,B={approximation:"average",groupPixelWidth:2,dateTimeLabelFormats:ja(tb,
["%A, %b %e, %H:%M:%S.%L","%A, %b %e, %H:%M:%S.%L","-%H:%M:%S.%L"],kb,["%A, %b %e, %H:%M:%S","%A, %b %e, %H:%M:%S","-%H:%M:%S"],db,["%A, %b %e, %H:%M","%A, %b %e, %H:%M","-%H:%M"],za,["%A, %b %e, %H:%M","%A, %b %e, %H:%M","-%H:%M"],ka,["%A, %b %e, %Y","%A, %b %e","-%A, %b %e, %Y"],Ca,["Week from %A, %b %e, %Y","%A, %b %e","-%A, %b %e, %Y"],Ka,["%B %Y","%B","-%B %Y"],La,["%Y","%Y","-%Y"])},Kc=[[tb,[1,2,5,10,20,25,50,100,200,500]],[kb,[1,2,5,10,15,30]],[db,[1,2,5,10,15,30]],[za,[1,2,3,4,6,8,12]],[ka,
[1]],[Ca,[1]],[Ka,[1,3,6]],[La,null]],ob={sum:function(a){var b=a.length,c;if(!b&&a.hasNulls)c=null;else if(b)for(c=0;b--;)c+=a[b];return c},average:function(a){var b=a.length,a=ob.sum(a);typeof a==="number"&&b&&(a/=b);return a},open:function(a){return a.length?a[0]:a.hasNulls?null:G},high:function(a){return a.length?Ab(a):a.hasNulls?null:G},low:function(a){return a.length?Gb(a):a.hasNulls?null:G},close:function(a){return a.length?a[a.length-1]:a.hasNulls?null:G},ohlc:function(a,b,c,d){a=ob.open(a);
b=ob.high(b);c=ob.low(c);d=ob.close(d);if(typeof a==="number"||typeof b==="number"||typeof c==="number"||typeof d==="number")return[a,b,c,d]}};Q.groupData=function(a,b,c,d){var e=this.data,f=this.options.data,g=[],h=[],j=a.length,k,i,l=!!b;i=[];var m=[],n=[],t=[],r=typeof d==="function"?d:ob[d],u;for(u=0;u<=j;u++){for(;c[1]!==G&&a[u]>=c[1]||u===j;)if(k=c.shift(),i=r(i,m,n,t),i!==G&&(g.push(k),h.push(i)),i=[],m=[],n=[],t=[],u===j)break;if(u===j)break;k=l?b[u]:null;if(d==="ohlc"){k=this.cropStart+u;
var w=e&&e[k]||this.pointClass.prototype.applyOptions.apply({},[f[k]]);k=w.open;var v=w.high,q=w.low,w=w.close;if(typeof k==="number")i.push(k);else if(k===null)i.hasNulls=!0;if(typeof v==="number")m.push(v);else if(v===null)m.hasNulls=!0;if(typeof q==="number")n.push(q);else if(q===null)n.hasNulls=!0;if(typeof w==="number")t.push(w);else if(w===null)t.hasNulls=!0}else if(typeof k==="number")i.push(k);else if(k===null)i.hasNulls=!0}return[g,h]};Q.processData=function(){var a=this.options,b=a.dataGrouping,
c=b&&b.enabled,d=this.groupedData,e;this.forceCrop=c;if(Uc.apply(this,arguments)!==!1&&c){n(d||[],function(a,b){a&&(d[b]=a.destroy?a.destroy():null)});var f;f=this.chart;var c=this.processedXData,g=this.processedYData,h=f.plotSizeX,j=this.xAxis,k=r(j.groupPixelWidth,b.groupPixelWidth),i=c.length,l=f.series,m=this.pointRange;if(!j.groupPixelWidth){for(f=l.length;f--;)l[f].xAxis===j&&l[f].options.dataGrouping&&(k=T(k,l[f].options.dataGrouping.groupPixelWidth));j.groupPixelWidth=k}if(i>h/k||b.forced){e=
!0;this.points=null;f=j.getExtremes();i=f.min;l=f.max;f=j.getGroupIntervalFactor&&j.getGroupIntervalFactor(i,l,c)||1;h=k*(l-i)/h*f;j=(j.getNonLinearTimeTicks||Vb)(tc(h,b.units||Kc),i,l,null,c,this.closestPointRange);g=Q.groupData.apply(this,[c,g,j,b.approximation]);c=g[0];g=g[1];if(b.smoothed){f=c.length-1;for(c[f]=l;f--&&f>0;)c[f]+=h/2;c[0]=i}this.currentDataGrouping=j.info;if(a.pointRange===null)this.pointRange=j.info.totalRange;this.closestPointRange=j.info.totalRange;this.processedXData=c;this.processedYData=
g}else this.currentDataGrouping=null,this.pointRange=m;this.hasGroupedData=e}};Q.generatePoints=function(){Vc.apply(this);this.groupedData=this.hasGroupedData?this.points:null};Q.tooltipHeaderFormatter=function(a){var b=this.tooltipOptions,c=this.options.dataGrouping,d=b.xDateFormat,e,f=this.xAxis,g,h;if(f&&f.options.type==="datetime"&&c){g=this.currentDataGrouping;c=c.dateTimeLabelFormats;if(g)f=c[g.unitName],g.count===1?d=f[0]:(d=f[1],e=f[2]);else if(!d)for(h in D)if(D[h]>=f.closestPointRange){d=
c[h][0];break}d=wb(d,a);e&&(d+=wb(e,a+g.totalRange-1));a=b.headerFormat.replace("{point.key}",d)}else a=Xc.apply(this,[a]);return a};Q.destroy=function(){for(var a=this.groupedData||[],b=a.length;b--;)a[b]&&a[b].destroy();Wc.apply(this)};aa.line.dataGrouping=aa.spline.dataGrouping=aa.area.dataGrouping=aa.areaspline.dataGrouping=B;aa.column.dataGrouping=H(B,{approximation:"sum",groupPixelWidth:10});aa.ohlc=H(aa.column,{lineWidth:1,dataGrouping:{approximation:"ohlc",enabled:!0,groupPixelWidth:5},states:{hover:{lineWidth:3}}});
var B=pa(jb,{applyOptions:function(a){var b=this.series,c=0;if(typeof a==="object"&&typeof a.length!=="number")E(this,a),this.options=a;else if(a.length){if(a.length===5){if(typeof a[0]==="string")this.name=a[0];else if(typeof a[0]==="number")this.x=a[0];c++}this.open=a[c++];this.high=a[c++];this.low=a[c++];this.close=a[c++]}this.y=this.high;if(this.x===G&&b)this.x=b.autoIncrement();return this},tooltipFormatter:function(){var a=this.series;return['<span style="color:'+a.color+';font-weight:bold">',
this.name||a.name,"</span><br/>Open: ",this.open,"<br/>High: ",this.high,"<br/>Low: ",this.low,"<br/>Close: ",this.close,"<br/>"].join("")}}),qc=pa(ba.column,{type:"ohlc",valueCount:4,pointClass:B,useThreshold:!1,pointAttrToOptions:{stroke:"color","stroke-width":"lineWidth"},translate:function(){var a=this.yAxis;ba.column.prototype.translate.apply(this);n(this.points,function(b){if(b.open!==null)b.plotOpen=a.translate(b.open,0,1,0,1);if(b.close!==null)b.plotClose=a.translate(b.close,0,1,0,1)})},drawPoints:function(){var a=
this,b=a.chart,c,d,e,f,g,h,j,k;n(a.points,function(i){if(i.plotY!==G)j=i.graphic,c=i.pointAttr[i.selected?"selected":""],f=c["stroke-width"]%2/2,k=y(i.plotX)+f,g=y(i.barW/2),h=["M",k,y(i.yBottom),"L",k,y(i.plotY)],i.open!==null&&(d=y(i.plotOpen)+f,h.push("M",k,d,"L",k-g,d)),i.close!==null&&(e=y(i.plotClose)+f,h.push("M",k,e,"L",k+g,e)),j?j.animate({d:h}):i.graphic=b.renderer.path(h).attr(c).add(a.group)})},animate:null});ba.ohlc=qc;aa.candlestick=H(aa.column,{dataGrouping:{approximation:"ohlc",enabled:!0},
lineColor:"black",lineWidth:1,upColor:"white",states:{hover:{lineWidth:2}}});B=pa(qc,{type:"candlestick",pointAttrToOptions:{fill:"color",stroke:"lineColor","stroke-width":"lineWidth"},getAttribs:function(){qc.prototype.getAttribs.apply(this,arguments);var a=this.options,b=a.states,a=a.upColor,c=H(this.pointAttr);c[""].fill=a;c.hover.fill=b.hover.upColor||a;c.select.fill=b.select.upColor||a;n(this.points,function(a){if(a.open<a.close)a.pointAttr=c})},drawPoints:function(){var a=this,b=a.chart,c,d,
e,f,g,h,j,k,i,l;n(a.points,function(m){k=m.graphic;if(m.plotY!==G)c=m.pointAttr[m.selected?"selected":""],h=c["stroke-width"]%2/2,j=y(m.plotX)+h,d=y(m.plotOpen)+h,e=y(m.plotClose)+h,f=sa.min(d,e),g=sa.max(d,e),l=y(m.barW/2),i=["M",j-l,g,"L",j-l,f,"L",j+l,f,"L",j+l,g,"L",j-l,g,"M",j,g,"L",j,y(m.yBottom),"M",j,f,"L",j,y(m.plotY),"Z"],k?k.animate({d:i}):m.graphic=b.renderer.path(i).attr(c).add(a.group)})}});ba.candlestick=B;var gc=Mb.prototype.symbols;aa.flags=H(aa.column,{dataGrouping:null,fillColor:"white",
lineWidth:1,pointRange:0,shape:"flag",stackDistance:7,states:{hover:{lineColor:"black",fillColor:"#FCFFC5"}},style:{fontSize:"11px",fontWeight:"bold",textAlign:"center"},y:-30});ba.flags=pa(ba.column,{type:"flags",noSharedTooltip:!0,useThreshold:!1,init:M.prototype.init,pointAttrToOptions:{fill:"fillColor",stroke:"color","stroke-width":"lineWidth",r:"radius"},translate:function(){ba.column.prototype.translate.apply(this);var a=this.chart,b=this.points,c=b.length-1,d,e,f,g=(d=this.options.onSeries)&&
a.get(d),h,j,k;if(g){h=g.points;d=h.length;for(b.sort(function(a,b){return a.x-b.x});d--&&b[c];)if(e=b[c],j=h[d],j.x<=e.x&&(e.plotY=j.plotY,j.x<e.x&&(k=h[d+1])&&(e.plotY+=(e.x-j.x)/(k.x-j.x)*(k.plotY-j.plotY)),c--,d++,c<0))break}n(b,function(c,d){if(!g)c.plotY=c.y===G?a.plotHeight:c.plotY;if((f=b[d-1])&&f.plotX===c.plotX){if(f.stackIndex===G)f.stackIndex=0;c.stackIndex=f.stackIndex+1}})},drawPoints:function(){var a,b=this.points,c=this.chart.renderer,d,e,f=this.options,g=f.y,h=f.shape,j,k,i,l,m=f.lineWidth%
2/2,n;for(k=b.length;k--;)if(i=b[k],d=i.plotX+m,a=i.stackIndex,e=i.plotY+g+m-(a!==G&&a*f.stackDistance),isNaN(e)&&(e=0),j=a?G:i.plotX+m,n=a?G:i.plotY,l=i.graphic,e!==G)a=i.pointAttr[i.selected?"select":""],l?l.attr({x:d,y:e,r:a.r,anchorX:j,anchorY:n}):l=i.graphic=c.label(i.options.title||f.title||"A",d,e,h,j,n).css(H(f.style,i.style)).attr(a).attr({align:h==="flag"?"left":"center",width:f.width,height:f.height}).add(this.group).shadow(f.shadow),j=l.box,a=j.getBBox(),i.shapeArgs=E(a,{x:d-(h==="flag"?
0:j.attr("width")/2),y:e})},drawTracker:function(){ba.column.prototype.drawTracker.apply(this);n(this.points,function(a){W(a.tracker.element,"mouseover",function(){a.graphic.toFront()})})},tooltipFormatter:function(a){return a.point.text},animate:function(){}});gc.flag=function(a,b,c,d,e){var f=e&&e.anchorX||a,e=e&&e.anchorY||b;return["M",f,e,"L",a,b+d,a,b,a+c,b,a+c,b+d,a,b+d,"M",f,e,"Z"]};n(["circle","square"],function(a){gc[a+"pin"]=function(b,c,d,e,f){var g=f&&f.anchorX,f=f&&f.anchorY,b=gc[a](b,
c,d,e);g&&f&&b.push("M",g,c+e,"L",g,f);return b}});Nb===Rb&&n(["flag","circlepin","squarepin"],function(a){Rb.prototype.symbols[a]=gc[a]});var hc=Ga?"touchstart":"mousedown",Lc=Ga?"touchmove":"mousemove",Mc=Ga?"touchend":"mouseup",B=ja("linearGradient",{x1:0,y1:0,x2:0,y2:1},"stops",[[0,"#FFF"],[1,"#CCC"]]),Ja=[].concat(Kc);Ja[4]=[ka,[1,2,3,4]];Ja[5]=[Ca,[1,2,3]];E(X,{navigator:{handles:{backgroundColor:"#FFF",borderColor:"#666"},height:40,margin:10,maskFill:"rgba(255, 255, 255, 0.75)",outlineColor:"#444",
outlineWidth:1,series:{type:"areaspline",color:"#4572A7",compare:null,fillOpacity:0.4,dataGrouping:{approximation:"average",groupPixelWidth:2,smoothed:!0,units:Ja},dataLabels:{enabled:!1},id:gb+"navigator-series",lineColor:"#4572A7",lineWidth:1,marker:{enabled:!1},pointRange:0,shadow:!1},xAxis:{tickWidth:0,lineWidth:0,gridLineWidth:1,tickPixelInterval:200,labels:{align:"left",x:3,y:-4}},yAxis:{gridLineWidth:0,startOnTick:!1,endOnTick:!1,minPadding:0.1,maxPadding:0.1,labels:{enabled:!1},title:{text:null},
tickWidth:0}},scrollbar:{height:Ga?20:14,barBackgroundColor:B,barBorderRadius:2,barBorderWidth:1,barBorderColor:"#666",buttonArrowColor:"#666",buttonBackgroundColor:B,buttonBorderColor:"#666",buttonBorderRadius:2,buttonBorderWidth:1,rifleColor:"#666",trackBackgroundColor:ja("linearGradient",{x1:0,y1:0,x2:0,y2:1},"stops",[[0,"#EEE"],[1,"#FFF"]]),trackBorderColor:"#CCC",trackBorderWidth:1}});Highcharts.Scroller=function(a){function b(a,b){var c={fill:Q.backgroundColor,stroke:Q.borderColor,"stroke-width":1},
d;fa||(ja[b]=j.g().css({cursor:"e-resize"}).attr({zIndex:4-b}).add(),d=j.rect(-4.5,0,9,16,3,1).attr(c).add(ja[b]),oa.push(d),d=j.path(["M",-1.5,4,"L",-1.5,12,"M",0.5,4,"L",0.5,12]).attr(c).add(ja[b]),oa.push(d));ja[b].translate(X+L+parseInt(a,10),C+J/2-8)}function c(a){var b;fa||(ua[a]=j.g().add(o),b=j.rect(-0.5,-0.5,L+1,L+1,u.buttonBorderRadius,u.buttonBorderWidth).attr({stroke:u.buttonBorderColor,"stroke-width":u.buttonBorderWidth,fill:u.buttonBackgroundColor}).add(ua[a]),oa.push(b),b=j.path(["M",
L/2+(a?-1:1),L/2-3,"L",L/2+(a?-1:1),L/2+3,L/2+(a?2:-2),L/2]).attr({fill:u.buttonArrowColor}).add(ua[a]),oa.push(b));a&&ua[a].attr({translateX:ha-L})}function d(d,e,f,g){if(!isNaN(d)){var h=u.barBorderWidth;Y=C+R;m=r(s.left,a.plotLeft+L);p=r(s.len,a.plotWidth-2*L);X=m-L;ha=p+2*L;if(s.getExtremes){var k=a.xAxis[0].getExtremes(),n=k.dataMin===null,q=s.getExtremes(),t=va(k.dataMin,q.dataMin),k=T(k.dataMax,q.dataMax);!n&&(t!==q.min||k!==q.max)&&s.setExtremes(t,k,!0,!1)}f=r(f,s.translate(d));g=r(g,s.translate(e));
K=N(va(f,g));E=N(T(f,g));D=E-K;if(!fa&&(l&&(ia=j.rect().attr({fill:i.maskFill,zIndex:3}).add(),la=j.rect().attr({fill:i.maskFill,zIndex:3}).add(),ma=j.path().attr({"stroke-width":$,stroke:i.outlineColor,zIndex:3}).add()),w))o=j.g().add(),d=u.trackBorderWidth,na=j.rect().attr({y:-d%2/2,fill:u.trackBackgroundColor,stroke:u.trackBorderColor,"stroke-width":d,r:u.trackBorderRadius||0,height:L}).add(o),pa=j.rect().attr({y:-h%2/2,height:L,fill:u.barBackgroundColor,stroke:u.barBorderColor,"stroke-width":h,
r:aa}).add(o),qa=j.path().attr({stroke:u.rifleColor,"stroke-width":1}).add(o);l&&(ia.attr({x:m,y:C,width:K,height:J}),la.attr({x:m+E,y:C,width:p-E,height:J}),ma.attr({d:[ta,X,Y,ga,m+K+R,Y,m+K+R,Y+S-L,ta,m+E-R,Y+S-L,ga,m+E-R,Y,X+ha,Y]}),b(K+R,0),b(E+R,1));w&&(c(0),c(1),o.translate(X,y(Y+J)),na.attr({width:ha}),pa.attr({x:y(L+K)+h%2/2,width:D-h}),h=L+K+D/2-0.5,qa.attr({d:[ta,h-3,L/4,ga,h-3,2*L/3,ta,h,L/4,ga,h,2*L/3,ta,h+3,L/4,ga,h+3,2*L/3],visibility:D>12?bb:Ta}));fa=!0}}function e(b){var b=a.tracker.normalizeMouseEvent(b),
c=b.chartX,d=b.chartY,e=Ga?10:7;if(d>C&&d<C+J+L)(d=!w||d<C+J)&&sa.abs(c-K-m)<e?(v=!0,B=E):d&&sa.abs(c-E-m)<e?(q=!0,B=K):c>m+K&&c<m+E?(A=c,V=M.cursor,M.cursor="ew-resize",I=c-K):c>X&&c<X+ha&&(c=d?c-m-D/2:c<m?K-va(10,D):c>X+ha-L?K+va(10,D):c<m+K?K-D:E,c<0?c=0:c+D>p&&(c=p-D),c!==K&&a.xAxis[0].setExtremes(s.translate(c,!0),s.translate(c+D,!0),!0,!1));b.preventDefault&&b.preventDefault()}function f(b){b=a.tracker.normalizeMouseEvent(b);b=b.chartX;b<m?b=m:b>X+ha-L&&(b=X+ha-L);v?(G=!0,d(0,0,b-m,B)):q?(G=
!0,d(0,0,B,b-m)):A&&(G=!0,b<I?b=I:b>p+I-D&&(b=p+I-D),d(0,0,b-I,b-I+D))}function g(){G&&a.xAxis[0].setExtremes(s.translate(K,!0),s.translate(E,!0),!0,!1);v=q=A=G=I=null;M.cursor=V}function h(){var b=ba.xAxis,c=b.getExtremes(),e=c.min,f=c.max,g=c.dataMin,c=c.dataMax,h=f-e,j,i,k,l,m;j=t.xData;var n=!!b.setExtremes;i=f>=j[j.length-1];j=e<=g;if(!x)t.options.pointStart=ba.xData[0],t.setData(ba.options.data,!1),m=!0;j&&(l=g,k=l+h);i&&(k=c,j||(l=T(k-h,t.xData[0])));n&&(j||i)?b.setExtremes(l,k,!0,!1):(m&&
a.redraw(!1),d(T(e,g),va(f,c)))}var j=a.renderer,k=a.options,i=k.navigator,l=i.enabled,m,p,t,x,u=k.scrollbar,w=u.enabled,v,q,A,B,I,G,s,Aa,K,E,D,M=document.body.style,V,Q=i.handles,J=l?i.height:0,$=i.outlineWidth,L=w?u.height:0,S=J+L,aa=u.barBorderRadius,C,R=$/2,Y,X,ha,fa,ka=i.baseSeries,ba=a.series[ka]||typeof ka==="string"&&a.get(ka)||a.series[0],ia,la,ma,ja=[],o,na,pa,qa,ua=[],oa=[];a.resetZoomEnabled=!1;(function(){var b=a.xAxis.length,c=a.yAxis.length,d=a.setSize;a.extraBottomMargin=S+i.margin;
C=i.top||a.chartHeight-J-L-k.chart.spacingBottom;if(l){var j=ba.options,m=j.data,n=i.series;x=n.data;j.data=n.data=null;s=new a.Axis(H({ordinal:ba.xAxis.options.ordinal},i.xAxis,{isX:!0,type:"datetime",index:b,height:J,top:C,offset:0,offsetLeft:L,offsetRight:-L,startOnTick:!1,endOnTick:!1,minPadding:0,maxPadding:0,zoomEnabled:!1}));Aa=new a.Axis(H(i.yAxis,{alignTicks:!1,height:J,top:C,offset:0,index:c,zoomEnabled:!1}));b=H(ba.options,n,{threshold:null,clip:!1,enableMouseTracking:!1,group:"nav",padXAxis:!1,
xAxis:b,yAxis:c,name:"Navigator",showInLegend:!1,isInternal:!0,visible:!0});j.data=m;n.data=x;b.data=x||m;t=a.initSeries(b);W(ba,"updatedData",h)}else s={translate:function(b,c){var d=ba.xAxis.getExtremes(),e=a.plotWidth-2*L,f=d.dataMin,d=d.dataMax-f;return c?b*d/e+f:e*(b-f)/d}};a.setSize=function(b,c,e){s.options.top=Aa.options.top=C=i.top||c-J-L-k.chart.spacingBottom;d.call(a,b,c,e)};W(a.container,hc,e);W(a.container,Lc,f);W(document,Mc,g)})();return{render:d,destroy:function(){ra(a.container,hc,
e);ra(a.container,Lc,f);ra(document,Mc,g);l&&ra(ba,"updatedData",h);n([s,Aa,ia,la,ma,na,pa,qa,o],function(a){a&&a.destroy&&a.destroy()});s=Aa=ia=la=ma=na=pa=qa=o=null;n([ua,ja,oa],function(a){ub(a)})}}};E(X,{rangeSelector:{buttonTheme:{width:28,height:16,padding:1,r:0,zIndex:10}}});X.lang=H(X.lang,{rangeSelectorZoom:"Zoom",rangeSelectorFrom:"From:",rangeSelectorTo:"To:"});Highcharts.RangeSelector=function(a){function b(b,c,d){var e=a.xAxis[0],f=e&&e.getExtremes(),g,h=f&&f.dataMin,j=f&&f.dataMax,i,
k=e&&va(f.max,j),f=new Date(k);g=c.type;var c=c.count,l,m,n={millisecond:1,second:1E3,minute:6E4,hour:36E5,day:864E5,week:6048E5};if(!(h===null||j===null||b===x))n[g]?(l=n[g]*c,i=T(k-l,h)):g==="month"?(f.setMonth(f.getMonth()-c),i=T(f.getTime(),h),l=2592E6*c):g==="ytd"?(f=new Date(0),g=new Date,m=g.getFullYear(),f.setFullYear(m),String(m)!==wb("%Y",f)&&f.setFullYear(m-1),i=m=T(h||0,f.getTime()),g=g.getTime(),k=va(j||g,g)):g==="year"?(f.setFullYear(f.getFullYear()-c),i=T(h,f.getTime()),l=31536E6*c):
g==="all"&&e&&(i=h,k=j),w[b]&&w[b].setState(2),e?setTimeout(function(){e.setExtremes(i,k,r(d,1),0);x=b},1):(h=a.options.xAxis,h[0]=H(h[0],{range:l,min:m}),x=b)}function c(){i&&i.blur();l&&l.blur()}function d(a,b){var c=a.hasFocus?q.inputEditDateFormat||"%Y-%m-%d":q.inputDateFormat||"%b %e, %Y";if(b)a.HCTime=b;a.value=wb(c,a.HCTime)}function e(b){var c=b==="min",e;m[b]=na("span",{innerHTML:j[c?"rangeSelectorFrom":"rangeSelectorTo"]},q.labelStyle,k);e=na("input",{name:b,className:gb+"range-selector",
type:"text"},E({width:"80px",height:"16px",border:"1px solid silver",marginLeft:"5px",marginRight:c?"5px":"0",textAlign:"center"},q.inputStyle),k);e.onfocus=e.onblur=function(a){a=a||window.event;e.hasFocus=a.type==="focus";d(e)};e.onchange=function(){var b=e.value,d=Date.parse(b),f=a.xAxis[0].getExtremes();isNaN(d)&&(d=b.split("-"),d=Date.UTC(N(d[0]),N(d[1])-1,N(d[2])));if(!isNaN(d)&&(c&&d>=f.dataMin&&d<=l.HCTime||!c&&d<=f.dataMax&&d>=i.HCTime))a.xAxis[0].setExtremes(c?d:f.min,c?f.max:d)};return e}
var f=a.renderer,g,h=a.container,j=X.lang,k,i,l,m={},p,t,x,u,w=[],v,q,y=[{type:"month",count:1,text:"1m"},{type:"month",count:3,text:"3m"},{type:"month",count:6,text:"6m"},{type:"ytd",text:"YTD"},{type:"year",count:1,text:"1y"},{type:"all",text:"All"}];a.resetZoomEnabled=!1;(function(){a.extraTopMargin=25;q=a.options.rangeSelector;v=q.buttons||y;var d=q.selected;W(h,hc,c);d!==G&&v[d]&&b(d,v[d],!1);W(a,"load",function(){W(a.xAxis[0],"afterSetExtremes",function(){w[x]&&w[x].setState(0);x=null})})})();
return{render:function(c,m){var r=a.options.chart.style,s=q.buttonTheme,y=q.inputEnabled!==!1,A=s&&s.states,B=a.plotLeft,D;g||(u=f.text(j.rangeSelectorZoom,B,a.plotTop-10).css(q.labelStyle).add(),D=B+u.getBBox().width+5,n(v,function(c,d){w[d]=f.button(c.text,D,a.plotTop-25,function(){b(d,c);this.isActive=!0},s,A&&A.hover,A&&A.select).css({textAlign:"center"}).add();D+=w[d].width+(q.buttonSpacing||0);x===d&&w[d].setState(2)}),y&&(t=k=na("div",null,{position:"relative",height:0,fontFamily:r.fontFamily,
fontSize:r.fontSize,zIndex:1}),h.parentNode.insertBefore(k,h),p=k=na("div",null,E({position:"absolute",top:a.plotTop-25+"px",right:a.chartWidth-a.plotLeft-a.plotWidth+"px"},q.inputBoxStyle),k),i=e("min"),l=e("max")));y&&(d(i,c),d(l,m));g=!0},destroy:function(){ra(h,hc,c);n([w],function(a){ub(a)});u&&(u=u.destroy());if(i)i.onfocus=i.onblur=i.onchange=null;if(l)l.onfocus=l.onblur=l.onchange=null;n([i,l,m.min,m.max,p,t],function(a){Hb(a)});i=l=m=k=p=t=null}}};$b.prototype.callbacks.push(function(a){function b(){f=
a.xAxis[0].getExtremes();g.render(T(f.min,f.dataMin),va(f.max,f.dataMax))}function c(){f=a.xAxis[0].getExtremes();h.render(f.min,f.max)}function d(a){g.render(a.min,a.max)}function e(a){h.render(a.min,a.max)}var f,g=a.scroller,h=a.rangeSelector;g&&(W(a.xAxis[0],"afterSetExtremes",d),W(a,"resize",b),b());h&&(W(a.xAxis[0],"afterSetExtremes",e),W(a,"resize",c),c());W(a,"destroy",function(){g&&(ra(a,"resize",b),ra(a.xAxis[0],"afterSetExtremes",d));h&&(ra(a,"resize",c),ra(a.xAxis[0],"afterSetExtremes",
e))})});Highcharts.StockChart=function(a,b){var c=a.series,d,e={marker:{enabled:!1,states:{hover:{enabled:!0,radius:5}}},shadow:!1,states:{hover:{lineWidth:2}},dataGrouping:{enabled:!0}};a.xAxis=nb(sb(a.xAxis||{}),function(a){return H({minPadding:0,maxPadding:0,ordinal:!0,title:{text:null},showLastLabel:!0},a,{type:"datetime",categories:null})});a.yAxis=nb(sb(a.yAxis||{}),function(a){d=a.opposite;return H({labels:{align:d?"right":"left",x:d?-2:2,y:-2},showLastLabel:!1,title:{text:null}},a)});a.series=
null;a=H({chart:{panning:!0},navigator:{enabled:!0},scrollbar:{enabled:!0},rangeSelector:{enabled:!0},title:{text:null},tooltip:{shared:!0,crosshairs:!0},legend:{enabled:!1},plotOptions:{line:e,spline:e,area:e,areaspline:e,column:{shadow:!1,borderWidth:0,dataGrouping:{enabled:!0}}}},a,{chart:{inverted:!1}});a.series=c;return new $b(a,b)};var Yc=Q.init,Zc=Q.processData,$c=jb.prototype.tooltipFormatter;Q.init=function(){Yc.apply(this,arguments);var a=this.options.compare;if(a)this.modifyValue=function(b,
c){var d=this.compareValue,b=a==="value"?b-d:b=100*(b/d)-100;if(c)c.change=b;return b}};Q.processData=function(){Zc.apply(this,arguments);if(this.options.compare)for(var a=0,b=this.processedXData,c=this.processedYData,d=c.length,e=this.xAxis.getExtremes().min;a<d;a++)if(typeof c[a]==="number"&&b[a]>=e){this.compareValue=c[a];break}};jb.prototype.tooltipFormatter=function(a){a=a.replace("{point.change}",(this.change>0?"+":"")+Ub(this.change,this.series.tooltipOptions.changeDecimals||2));return $c.apply(this,
[a])};(function(){var a=Q.init,b=Q.getSegments;Q.init=function(){var b,d;a.apply(this,arguments);b=this.chart;(d=this.xAxis)&&d.options.ordinal&&W(this,"updatedData",function(){delete d.ordinalIndex});if(d&&d.options.ordinal&&!d.hasOrdinalExtension){d.hasOrdinalExtension=!0;d.beforeSetTickPositions=function(){var a,b=[],c=!1,e,k=this.getExtremes(),i=k.min,k=k.max,l;if(this.options.ordinal){n(this.series,function(c,d){if(c.visible!==!1&&(b=b.concat(c.processedXData),a=b.length,d&&a)){b.sort(function(a,
b){return a-b});for(d=a-1;d--;)b[d]===b[d+1]&&b.splice(d,1)}});a=b.length;if(a>2){e=b[1]-b[0];for(l=a-1;l--&&!c;)b[l+1]-b[l]!==e&&(c=!0)}c?(this.ordinalPositions=b,c=d.val2lin(i,!0),e=d.val2lin(k,!0),this.ordinalSlope=k=(k-i)/(e-c),this.ordinalOffset=i-c*k):this.ordinalPositions=this.ordinalSlope=this.ordinalOffset=G}};d.val2lin=function(a,b){var c=this.ordinalPositions;if(c){var d=c.length,e,i;for(e=d;e--;)if(c[e]===a){i=e;break}for(e=d-1;e--;)if(a>c[e]||e===0){c=(a-c[e])/(c[e+1]-c[e]);i=e+c;break}return b?
i:this.ordinalSlope*(i||0)+this.ordinalOffset}else return a};d.lin2val=function(a,b){var c=this.ordinalPositions;if(c){var d=this.ordinalSlope,e=this.ordinalOffset,i=c.length-1,l,m;if(b)a<0?a=c[0]:a>i?a=c[i]:(i=Na(a),m=a-i);else for(;i--;)if(l=d*i+e,a>=l){d=d*(i+1)+e;m=(a-l)/(d-l);break}return m!==G&&c[i]!==G?c[i]+(m?m*(c[i+1]-c[i]):0):a}else return a};d.getExtendedPositions=function(){var a=d.series[0].currentDataGrouping,e=d.ordinalIndex,h=a?a.count+a.unitName:"raw",j=d.getExtremes(),k,i;if(!e)e=
d.ordinalIndex={};if(!e[h])k={series:[],getExtremes:function(){return{min:j.dataMin,max:j.dataMax}},options:{ordinal:!0}},n(d.series,function(d){i={xAxis:k,xData:d.xData,chart:b};i.options={dataGrouping:a?{enabled:!0,forced:!0,approximation:"open",units:[[a.unitName,[a.count]]]}:{enabled:!1}};d.processData.apply(i);k.series.push(i)}),d.beforeSetTickPositions.apply(k),e[h]=k.ordinalPositions;return e[h]};d.getGroupIntervalFactor=function(a,b,c){for(var d=0,e=c.length,i=[];d<e-1;d++)i[d]=c[d+1]-c[d];
i.sort(function(a,b){return a-b});c=i[Na(e/2)];return e*c/(b-a)};d.postProcessTickInterval=function(a){var b=this.ordinalSlope;return b?a/(b/d.closestPointRange):a};d.getNonLinearTimeTicks=function(a,b,c,d,e,i,l){var m=0,n=0,r,x={},u,w,v,q=[];if(!e||b===G)return Vb(a,b,c,d);for(w=e.length;n<w;n++){v=n&&e[n-1]>c;if(e[n]<b)m=n;else if(n===w-1||e[n+1]-e[n]>i*5||v)r=Vb(a,e[m],e[n],d),q=q.concat(r),m=n+1;if(v)break}a=r.info;if(l&&a.unitRange<=D[za]){n=q.length-1;for(m=1;m<n;m++)(new Date(q[m]))[eb]()!==
(new Date(q[m-1]))[eb]()&&(x[q[m]]=ka,u=!0);u&&(x[q[0]]=ka);a.higherRanks=x}q.info=a;return q};W(d,"afterSetTickPositions",function(a){var b=d.options.tickPixelInterval,a=a.tickPositions;if(d.ordinalPositions&&A(b))for(var c=a.length,e,k,i,l=(e=a.info)?e.higherRanks:[];c--;)k=d.translate(a[c]),i&&i-k<b*0.6?(l[a[c]]&&!l[a[c+1]]?(e=c+1,i=k):e=c,a.splice(e,1)):i=k});var e=b.pan;b.pan=function(a){var d=b.xAxis[0],h=!1;if(d.options.ordinal){var j=b.mouseDownX,k=d.getExtremes(),i=k.dataMax,l=k.min,m=k.max,
p;p=b.hoverPoints;var r=d.closestPointRange,j=(j-a)/(d.translationSlope*(d.ordinalSlope||r)),x={ordinalPositions:d.getExtendedPositions()},u,r=d.lin2val,w=d.val2lin;if(x.ordinalPositions){if(Ba(j)>1)p&&n(p,function(a){a.setState()}),j<0?(p=x,x=d.ordinalPositions?d:x):p=d.ordinalPositions?d:x,u=x.ordinalPositions,i>u[u.length-1]&&u.push(i),p=r.apply(p,[w.apply(p,[l,!0])+j,!0]),j=r.apply(x,[w.apply(x,[m,!0])+j,!0]),p>va(k.dataMin,l)&&j<T(i,m)&&d.setExtremes(p,j,!0,!1),b.mouseDownX=a,J(b.container,{cursor:"move"})}else h=
!0}else h=!0;h&&e.apply(b,arguments)}}};Q.getSegments=function(){var a=this,d,e=a.options.gapSize;b.apply(a);if(a.xAxis.options.ordinal&&e)d=a.segments,n(d,function(b,g){for(var h=b.length-1;h--;)b[h+1].x-b[h].x>a.xAxis.closestPointRange*e&&d.splice(g+1,0,b.splice(h+1,b.length-h))})}})();E(Highcharts,{Chart:$b,dateFormat:wb,pathAnim:Qb,getOptions:function(){return X},hasRtlBug:Tc,numberFormat:Ub,Point:jb,Color:cb,Renderer:Nb,seriesTypes:ba,setOptions:function(a){cc=H(cc,a.xAxis);nc=H(nc,a.yAxis);
a.xAxis=a.yAxis=G;X=H(X,a);zc();return X},Series:M,addEvent:W,removeEvent:ra,createElement:na,discardElement:Hb,css:J,each:n,extend:E,map:nb,merge:H,pick:r,splat:sb,extendClass:pa,product:"Highstock",version:"1.1.4"})})();
/* ===================================================
 * bootstrap-transition.js v2.0.4
 * http://twitter.github.com/bootstrap/javascript.html#transitions
 * ===================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */



!function ($) {

  $(function () {

    "use strict"; // jshint ;_;


    /* CSS TRANSITION SUPPORT (http://www.modernizr.com/)
     * ======================================================= */

    $.support.transition = (function () {

      var transitionEnd = (function () {

        var el = document.createElement('bootstrap')
          , transEndEventNames = {
               'WebkitTransition' : 'webkitTransitionEnd'
            ,  'MozTransition'    : 'transitionend'
            ,  'OTransition'      : 'oTransitionEnd'
            ,  'msTransition'     : 'MSTransitionEnd'
            ,  'transition'       : 'transitionend'
            }
          , name

        for (name in transEndEventNames){
          if (el.style[name] !== undefined) {
            return transEndEventNames[name]
          }
        }

      }())

      return transitionEnd && {
        end: transitionEnd
      }

    })()

  })

}(window.jQuery);
/* ==========================================================
 * bootstrap-alert.js v2.0.4
 * http://twitter.github.com/bootstrap/javascript.html#alerts
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */



!function ($) {

  "use strict"; // jshint ;_;


 /* ALERT CLASS DEFINITION
  * ====================== */

  var dismiss = '[data-dismiss="alert"]'
    , Alert = function (el) {
        $(el).on('click', dismiss, this.close)
      }

  Alert.prototype.close = function (e) {
    var $this = $(this)
      , selector = $this.attr('data-target')
      , $parent

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    $parent = $(selector)

    e && e.preventDefault()

    $parent.length || ($parent = $this.hasClass('alert') ? $this : $this.parent())

    $parent.trigger(e = $.Event('close'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      $parent
        .trigger('closed')
        .remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent.on($.support.transition.end, removeElement) :
      removeElement()
  }


 /* ALERT PLUGIN DEFINITION
  * ======================= */

  $.fn.alert = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('alert')
      if (!data) $this.data('alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.alert.Constructor = Alert


 /* ALERT DATA-API
  * ============== */

  $(function () {
    $('body').on('click.alert.data-api', dismiss, Alert.prototype.close)
  })

}(window.jQuery);
/* =========================================================
 * bootstrap-modal.js v2.0.4
 * http://twitter.github.com/bootstrap/javascript.html#modals
 * =========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */



!function ($) {

  "use strict"; // jshint ;_;


 /* MODAL CLASS DEFINITION
  * ====================== */

  var Modal = function (content, options) {
    this.options = options
    this.$element = $(content)
      .delegate('[data-dismiss="modal"]', 'click.dismiss.modal', $.proxy(this.hide, this))
  }

  Modal.prototype = {

      constructor: Modal

    , toggle: function () {
        return this[!this.isShown ? 'show' : 'hide']()
      }

    , show: function () {
        var that = this
          , e = $.Event('show')

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        $('body').addClass('modal-open')

        this.isShown = true

        escape.call(this)
        backdrop.call(this, function () {
          var transition = $.support.transition && that.$element.hasClass('fade')

          if (!that.$element.parent().length) {
            that.$element.appendTo(document.body) //don't move modals dom position
          }

          that.$element
            .show()

          if (transition) {
            that.$element[0].offsetWidth // force reflow
          }

          that.$element.addClass('in')

          transition ?
            that.$element.one($.support.transition.end, function () { that.$element.trigger('shown') }) :
            that.$element.trigger('shown')

        })
      }

    , hide: function (e) {
        e && e.preventDefault()

        var that = this

        e = $.Event('hide')

        this.$element.trigger(e)

        if (!this.isShown || e.isDefaultPrevented()) return

        this.isShown = false

        $('body').removeClass('modal-open')

        escape.call(this)

        this.$element.removeClass('in')

        $.support.transition && this.$element.hasClass('fade') ?
          hideWithTransition.call(this) :
          hideModal.call(this)
      }

  }


 /* MODAL PRIVATE METHODS
  * ===================== */

  function hideWithTransition() {
    var that = this
      , timeout = setTimeout(function () {
          that.$element.off($.support.transition.end)
          hideModal.call(that)
        }, 500)

    this.$element.one($.support.transition.end, function () {
      clearTimeout(timeout)
      hideModal.call(that)
    })
  }

  function hideModal(that) {
    this.$element
      .hide()
      .trigger('hidden')

    backdrop.call(this)
  }

  function backdrop(callback) {
    var that = this
      , animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
        .appendTo(document.body)

      if (this.options.backdrop != 'static') {
        this.$backdrop.click($.proxy(this.hide, this))
      }

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      doAnimate ?
        this.$backdrop.one($.support.transition.end, callback) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      $.support.transition && this.$element.hasClass('fade')?
        this.$backdrop.one($.support.transition.end, $.proxy(removeBackdrop, this)) :
        removeBackdrop.call(this)

    } else if (callback) {
      callback()
    }
  }

  function removeBackdrop() {
    this.$backdrop.remove()
    this.$backdrop = null
  }

  function escape() {
    var that = this
    if (this.isShown && this.options.keyboard) {
      $(document).on('keyup.dismiss.modal', function ( e ) {
        e.which == 27 && that.hide()
      })
    } else if (!this.isShown) {
      $(document).off('keyup.dismiss.modal')
    }
  }


 /* MODAL PLUGIN DEFINITION
  * ======================= */

  $.fn.modal = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('modal')
        , options = $.extend({}, $.fn.modal.defaults, $this.data(), typeof option == 'object' && option)
      if (!data) $this.data('modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option]()
      else if (options.show) data.show()
    })
  }

  $.fn.modal.defaults = {
      backdrop: true
    , keyboard: true
    , show: true
  }

  $.fn.modal.Constructor = Modal


 /* MODAL DATA-API
  * ============== */

  $(function () {
    $('body').on('click.modal.data-api', '[data-toggle="modal"]', function ( e ) {
      var $this = $(this), href
        , $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
        , option = $target.data('modal') ? 'toggle' : $.extend({}, $target.data(), $this.data())

      e.preventDefault()
      $target.modal(option)
    })
  })

}(window.jQuery);
/* ============================================================
 * bootstrap-dropdown.js v2.0.4
 * http://twitter.github.com/bootstrap/javascript.html#dropdowns
 * ============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */



!function ($) {

  "use strict"; // jshint ;_;


 /* DROPDOWN CLASS DEFINITION
  * ========================= */

  var toggle = '[data-toggle="dropdown"]'
    , Dropdown = function (element) {
        var $el = $(element).on('click.dropdown.data-api', this.toggle)
        $('html').on('click.dropdown.data-api', function () {
          $el.parent().removeClass('open')
        })
      }

  Dropdown.prototype = {

    constructor: Dropdown

  , toggle: function (e) {
      var $this = $(this)
        , $parent
        , selector
        , isActive

      if ($this.is('.disabled, :disabled')) return

      selector = $this.attr('data-target')

      if (!selector) {
        selector = $this.attr('href')
        selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
      }

      $parent = $(selector)
      $parent.length || ($parent = $this.parent())

      isActive = $parent.hasClass('open')

      clearMenus()

      if (!isActive) $parent.toggleClass('open')

      return false
    }

  }

  function clearMenus() {
    $(toggle).parent().removeClass('open')
  }


  /* DROPDOWN PLUGIN DEFINITION
   * ========================== */

  $.fn.dropdown = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('dropdown')
      if (!data) $this.data('dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.dropdown.Constructor = Dropdown


  /* APPLY TO STANDARD DROPDOWN ELEMENTS
   * =================================== */

  $(function () {
    $('html').on('click.dropdown.data-api', clearMenus)
    $('body')
      .on('click.dropdown', '.dropdown form', function (e) { e.stopPropagation() })
      .on('click.dropdown.data-api', toggle, Dropdown.prototype.toggle)
  })

}(window.jQuery);
/* =============================================================
 * bootstrap-scrollspy.js v2.0.4
 * http://twitter.github.com/bootstrap/javascript.html#scrollspy
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================== */



!function ($) {

  "use strict"; // jshint ;_;


  /* SCROLLSPY CLASS DEFINITION
   * ========================== */

  function ScrollSpy( element, options) {
    var process = $.proxy(this.process, this)
      , $element = $(element).is('body') ? $(window) : $(element)
      , href
    this.options = $.extend({}, $.fn.scrollspy.defaults, options)
    this.$scrollElement = $element.on('scroll.scroll.data-api', process)
    this.selector = (this.options.target
      || ((href = $(element).attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      || '') + ' .nav li > a'
    this.$body = $('body')
    this.refresh()
    this.process()
  }

  ScrollSpy.prototype = {

      constructor: ScrollSpy

    , refresh: function () {
        var self = this
          , $targets

        this.offsets = $([])
        this.targets = $([])

        $targets = this.$body
          .find(this.selector)
          .map(function () {
            var $el = $(this)
              , href = $el.data('target') || $el.attr('href')
              , $href = /^#\w/.test(href) && $(href)
            return ( $href
              && href.length
              && [[ $href.position().top, href ]] ) || null
          })
          .sort(function (a, b) { return a[0] - b[0] })
          .each(function () {
            self.offsets.push(this[0])
            self.targets.push(this[1])
          })
      }

    , process: function () {
        var scrollTop = this.$scrollElement.scrollTop() + this.options.offset
          , scrollHeight = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight
          , maxScroll = scrollHeight - this.$scrollElement.height()
          , offsets = this.offsets
          , targets = this.targets
          , activeTarget = this.activeTarget
          , i

        if (scrollTop >= maxScroll) {
          return activeTarget != (i = targets.last()[0])
            && this.activate ( i )
        }

        for (i = offsets.length; i--;) {
          activeTarget != targets[i]
            && scrollTop >= offsets[i]
            && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
            && this.activate( targets[i] )
        }
      }

    , activate: function (target) {
        var active
          , selector

        this.activeTarget = target

        $(this.selector)
          .parent('.active')
          .removeClass('active')

        selector = this.selector
          + '[data-target="' + target + '"],'
          + this.selector + '[href="' + target + '"]'

        active = $(selector)
          .parent('li')
          .addClass('active')

        if (active.parent('.dropdown-menu'))  {
          active = active.closest('li.dropdown').addClass('active')
        }

        active.trigger('activate')
      }

  }


 /* SCROLLSPY PLUGIN DEFINITION
  * =========================== */

  $.fn.scrollspy = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('scrollspy')
        , options = typeof option == 'object' && option
      if (!data) $this.data('scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.scrollspy.Constructor = ScrollSpy

  $.fn.scrollspy.defaults = {
    offset: 10
  }


 /* SCROLLSPY DATA-API
  * ================== */

  $(function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      $spy.scrollspy($spy.data())
    })
  })

}(window.jQuery);
/* ========================================================
 * bootstrap-tab.js v2.0.4
 * http://twitter.github.com/bootstrap/javascript.html#tabs
 * ========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================== */



!function ($) {

  "use strict"; // jshint ;_;


 /* TAB CLASS DEFINITION
  * ==================== */

  var Tab = function ( element ) {
    this.element = $(element)
  }

  Tab.prototype = {

    constructor: Tab

  , show: function () {
      var $this = this.element
        , $ul = $this.closest('ul:not(.dropdown-menu)')
        , selector = $this.attr('data-target')
        , previous
        , $target
        , e

      if (!selector) {
        selector = $this.attr('href')
        selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
      }

      if ( $this.parent('li').hasClass('active') ) return

      previous = $ul.find('.active a').last()[0]

      e = $.Event('show', {
        relatedTarget: previous
      })

      $this.trigger(e)

      if (e.isDefaultPrevented()) return

      $target = $(selector)

      this.activate($this.parent('li'), $ul)
      this.activate($target, $target.parent(), function () {
        $this.trigger({
          type: 'shown'
        , relatedTarget: previous
        })
      })
    }

  , activate: function ( element, container, callback) {
      var $active = container.find('> .active')
        , transition = callback
            && $.support.transition
            && $active.hasClass('fade')

      function next() {
        $active
          .removeClass('active')
          .find('> .dropdown-menu > .active')
          .removeClass('active')

        element.addClass('active')

        if (transition) {
          element[0].offsetWidth // reflow for transition
          element.addClass('in')
        } else {
          element.removeClass('fade')
        }

        if ( element.parent('.dropdown-menu') ) {
          element.closest('li.dropdown').addClass('active')
        }

        callback && callback()
      }

      transition ?
        $active.one($.support.transition.end, next) :
        next()

      $active.removeClass('in')
    }
  }


 /* TAB PLUGIN DEFINITION
  * ===================== */

  $.fn.tab = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('tab')
      if (!data) $this.data('tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tab.Constructor = Tab


 /* TAB DATA-API
  * ============ */

  $(function () {
    $('body').on('click.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
      e.preventDefault()
      $(this).tab('show')
    })
  })

}(window.jQuery);
/* ===========================================================
 * bootstrap-tooltip.js v2.0.4
 * http://twitter.github.com/bootstrap/javascript.html#tooltips
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ===========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */



!function ($) {

  "use strict"; // jshint ;_;


 /* TOOLTIP PUBLIC CLASS DEFINITION
  * =============================== */

  var Tooltip = function (element, options) {
    this.init('tooltip', element, options)
  }

  Tooltip.prototype = {

    constructor: Tooltip

  , init: function (type, element, options) {
      var eventIn
        , eventOut

      this.type = type
      this.$element = $(element)
      this.options = this.getOptions(options)
      this.enabled = true

      if (this.options.trigger != 'manual') {
        eventIn  = this.options.trigger == 'hover' ? 'mouseenter' : 'focus'
        eventOut = this.options.trigger == 'hover' ? 'mouseleave' : 'blur'
        this.$element.on(eventIn, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut, this.options.selector, $.proxy(this.leave, this))
      }

      this.options.selector ?
        (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
        this.fixTitle()
    }

  , getOptions: function (options) {
      options = $.extend({}, $.fn[this.type].defaults, options, this.$element.data())

      if (options.delay && typeof options.delay == 'number') {
        options.delay = {
          show: options.delay
        , hide: options.delay
        }
      }

      return options
    }

  , enter: function (e) {
      var self = $(e.currentTarget)[this.type](this._options).data(this.type)

      if (!self.options.delay || !self.options.delay.show) return self.show()

      clearTimeout(this.timeout)
      self.hoverState = 'in'
      this.timeout = setTimeout(function() {
        if (self.hoverState == 'in') self.show()
      }, self.options.delay.show)
    }

  , leave: function (e) {
      var self = $(e.currentTarget)[this.type](this._options).data(this.type)

      if (this.timeout) clearTimeout(this.timeout)
      if (!self.options.delay || !self.options.delay.hide) return self.hide()

      self.hoverState = 'out'
      this.timeout = setTimeout(function() {
        if (self.hoverState == 'out') self.hide()
      }, self.options.delay.hide)
    }

  , show: function () {
      var $tip
        , inside
        , pos
        , actualWidth
        , actualHeight
        , placement
        , tp

      if (this.hasContent() && this.enabled) {
        $tip = this.tip()
        this.setContent()

        if (this.options.animation) {
          $tip.addClass('fade')
        }

        placement = typeof this.options.placement == 'function' ?
          this.options.placement.call(this, $tip[0], this.$element[0]) :
          this.options.placement

        inside = /in/.test(placement)

        $tip
          .remove()
          .css({ top: 0, left: 0, display: 'block' })
          .appendTo(inside ? this.$element : document.body)

        pos = this.getPosition(inside)

        actualWidth = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight

        switch (inside ? placement.split(' ')[1] : placement) {
          case 'bottom':
            tp = {top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'top':
            tp = {top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'left':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth}
            break
          case 'right':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width}
            break
        }

        $tip
          .css(tp)
          .addClass(placement)
          .addClass('in')
      }
    }

  , isHTML: function(text) {
      // html string detection logic adapted from jQuery
      return typeof text != 'string'
        || ( text.charAt(0) === "<"
          && text.charAt( text.length - 1 ) === ">"
          && text.length >= 3
        ) || /^(?:[^<]*<[\w\W]+>[^>]*$)/.exec(text)
    }

  , setContent: function () {
      var $tip = this.tip()
        , title = this.getTitle()

      $tip.find('.tooltip-inner')[this.isHTML(title) ? 'html' : 'text'](title)
      $tip.removeClass('fade in top bottom left right')
    }

  , hide: function () {
      var that = this
        , $tip = this.tip()

      $tip.removeClass('in')

      function removeWithAnimation() {
        var timeout = setTimeout(function () {
          $tip.off($.support.transition.end).remove()
        }, 500)

        $tip.one($.support.transition.end, function () {
          clearTimeout(timeout)
          $tip.remove()
        })
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        removeWithAnimation() :
        $tip.remove()
    }

  , fixTitle: function () {
      var $e = this.$element
      if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
        $e.attr('data-original-title', $e.attr('title') || '').removeAttr('title')
      }
    }

  , hasContent: function () {
      return this.getTitle()
    }

  , getPosition: function (inside) {
      return $.extend({}, (inside ? {top: 0, left: 0} : this.$element.offset()), {
        width: this.$element[0].offsetWidth
      , height: this.$element[0].offsetHeight
      })
    }

  , getTitle: function () {
      var title
        , $e = this.$element
        , o = this.options

      title = $e.attr('data-original-title')
        || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

      return title
    }

  , tip: function () {
      return this.$tip = this.$tip || $(this.options.template)
    }

  , validate: function () {
      if (!this.$element[0].parentNode) {
        this.hide()
        this.$element = null
        this.options = null
      }
    }

  , enable: function () {
      this.enabled = true
    }

  , disable: function () {
      this.enabled = false
    }

  , toggleEnabled: function () {
      this.enabled = !this.enabled
    }

  , toggle: function () {
      this[this.tip().hasClass('in') ? 'hide' : 'show']()
    }

  }


 /* TOOLTIP PLUGIN DEFINITION
  * ========================= */

  $.fn.tooltip = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('tooltip')
        , options = typeof option == 'object' && option
      if (!data) $this.data('tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tooltip.Constructor = Tooltip

  $.fn.tooltip.defaults = {
    animation: true
  , placement: 'top'
  , selector: false
  , template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
  , trigger: 'hover'
  , title: ''
  , delay: 0
  }

}(window.jQuery);
/* ===========================================================
 * bootstrap-popover.js v2.0.4
 * http://twitter.github.com/bootstrap/javascript.html#popovers
 * ===========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =========================================================== */



!function ($) {

  "use strict"; // jshint ;_;


 /* POPOVER PUBLIC CLASS DEFINITION
  * =============================== */

  var Popover = function ( element, options ) {
    this.init('popover', element, options)
  }


  /* NOTE: POPOVER EXTENDS BOOTSTRAP-TOOLTIP.js
     ========================================== */

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype, {

    constructor: Popover

  , setContent: function () {
      var $tip = this.tip()
        , title = this.getTitle()
        , content = this.getContent()

      $tip.find('.popover-title')[this.isHTML(title) ? 'html' : 'text'](title)
      $tip.find('.popover-content > *')[this.isHTML(content) ? 'html' : 'text'](content)

      $tip.removeClass('fade top bottom left right in')
    }

  , hasContent: function () {
      return this.getTitle() || this.getContent()
    }

  , getContent: function () {
      var content
        , $e = this.$element
        , o = this.options

      content = $e.attr('data-content')
        || (typeof o.content == 'function' ? o.content.call($e[0]) :  o.content)

      return content
    }

  , tip: function () {
      if (!this.$tip) {
        this.$tip = $(this.options.template)
      }
      return this.$tip
    }

  })


 /* POPOVER PLUGIN DEFINITION
  * ======================= */

  $.fn.popover = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('popover')
        , options = typeof option == 'object' && option
      if (!data) $this.data('popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.popover.Constructor = Popover

  $.fn.popover.defaults = $.extend({} , $.fn.tooltip.defaults, {
    placement: 'right'
  , content: ''
  , template: '<div class="popover"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title"></h3><div class="popover-content"><p></p></div></div></div>'
  })

}(window.jQuery);
/* ============================================================
 * bootstrap-button.js v2.0.4
 * http://twitter.github.com/bootstrap/javascript.html#buttons
 * ============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */



!function ($) {

  "use strict"; // jshint ;_;


 /* BUTTON PUBLIC CLASS DEFINITION
  * ============================== */

  var Button = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.button.defaults, options)
  }

  Button.prototype.setState = function (state) {
    var d = 'disabled'
      , $el = this.$element
      , data = $el.data()
      , val = $el.is('input') ? 'val' : 'html'

    state = state + 'Text'
    data.resetText || $el.data('resetText', $el[val]())

    $el[val](data[state] || this.options[state])

    // push to event loop to allow forms to submit
    setTimeout(function () {
      state == 'loadingText' ?
        $el.addClass(d).attr(d, d) :
        $el.removeClass(d).removeAttr(d)
    }, 0)
  }

  Button.prototype.toggle = function () {
    var $parent = this.$element.parent('[data-toggle="buttons-radio"]')

    $parent && $parent
      .find('.active')
      .removeClass('active')

    this.$element.toggleClass('active')
  }


 /* BUTTON PLUGIN DEFINITION
  * ======================== */

  $.fn.button = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('button')
        , options = typeof option == 'object' && option
      if (!data) $this.data('button', (data = new Button(this, options)))
      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  $.fn.button.defaults = {
    loadingText: 'loading...'
  }

  $.fn.button.Constructor = Button


 /* BUTTON DATA-API
  * =============== */

  $(function () {
    $('body').on('click.button.data-api', '[data-toggle^=button]', function ( e ) {
      var $btn = $(e.target)
      if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
      $btn.button('toggle')
    })
  })

}(window.jQuery);
/* =============================================================
 * bootstrap-collapse.js v2.0.4
 * http://twitter.github.com/bootstrap/javascript.html#collapse
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */



!function ($) {

  "use strict"; // jshint ;_;


 /* COLLAPSE PUBLIC CLASS DEFINITION
  * ================================ */

  var Collapse = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.collapse.defaults, options)

    if (this.options.parent) {
      this.$parent = $(this.options.parent)
    }

    this.options.toggle && this.toggle()
  }

  Collapse.prototype = {

    constructor: Collapse

  , dimension: function () {
      var hasWidth = this.$element.hasClass('width')
      return hasWidth ? 'width' : 'height'
    }

  , show: function () {
      var dimension
        , scroll
        , actives
        , hasData

      if (this.transitioning) return

      dimension = this.dimension()
      scroll = $.camelCase(['scroll', dimension].join('-'))
      actives = this.$parent && this.$parent.find('> .accordion-group > .in')

      if (actives && actives.length) {
        hasData = actives.data('collapse')
        if (hasData && hasData.transitioning) return
        actives.collapse('hide')
        hasData || actives.data('collapse', null)
      }

      this.$element[dimension](0)
      this.transition('addClass', $.Event('show'), 'shown')
      this.$element[dimension](this.$element[0][scroll])
    }

  , hide: function () {
      var dimension
      if (this.transitioning) return
      dimension = this.dimension()
      this.reset(this.$element[dimension]())
      this.transition('removeClass', $.Event('hide'), 'hidden')
      this.$element[dimension](0)
    }

  , reset: function (size) {
      var dimension = this.dimension()

      this.$element
        .removeClass('collapse')
        [dimension](size || 'auto')
        [0].offsetWidth

      this.$element[size !== null ? 'addClass' : 'removeClass']('collapse')

      return this
    }

  , transition: function (method, startEvent, completeEvent) {
      var that = this
        , complete = function () {
            if (startEvent.type == 'show') that.reset()
            that.transitioning = 0
            that.$element.trigger(completeEvent)
          }

      this.$element.trigger(startEvent)

      if (startEvent.isDefaultPrevented()) return

      this.transitioning = 1

      this.$element[method]('in')

      $.support.transition && this.$element.hasClass('collapse') ?
        this.$element.one($.support.transition.end, complete) :
        complete()
    }

  , toggle: function () {
      this[this.$element.hasClass('in') ? 'hide' : 'show']()
    }

  }


 /* COLLAPSIBLE PLUGIN DEFINITION
  * ============================== */

  $.fn.collapse = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('collapse')
        , options = typeof option == 'object' && option
      if (!data) $this.data('collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.collapse.defaults = {
    toggle: true
  }

  $.fn.collapse.Constructor = Collapse


 /* COLLAPSIBLE DATA-API
  * ==================== */

  $(function () {
    $('body').on('click.collapse.data-api', '[data-toggle=collapse]', function ( e ) {
      var $this = $(this), href
        , target = $this.attr('data-target')
          || e.preventDefault()
          || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
        , option = $(target).data('collapse') ? 'toggle' : $this.data()
      $(target).collapse(option)
    })
  })

}(window.jQuery);
/* ==========================================================
 * bootstrap-carousel.js v2.0.4
 * http://twitter.github.com/bootstrap/javascript.html#carousel
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */



!function ($) {

  "use strict"; // jshint ;_;


 /* CAROUSEL CLASS DEFINITION
  * ========================= */

  var Carousel = function (element, options) {
    this.$element = $(element)
    this.options = options
    this.options.slide && this.slide(this.options.slide)
    this.options.pause == 'hover' && this.$element
      .on('mouseenter', $.proxy(this.pause, this))
      .on('mouseleave', $.proxy(this.cycle, this))
  }

  Carousel.prototype = {

    cycle: function (e) {
      if (!e) this.paused = false
      this.options.interval
        && !this.paused
        && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))
      return this
    }

  , to: function (pos) {
      var $active = this.$element.find('.active')
        , children = $active.parent().children()
        , activePos = children.index($active)
        , that = this

      if (pos > (children.length - 1) || pos < 0) return

      if (this.sliding) {
        return this.$element.one('slid', function () {
          that.to(pos)
        })
      }

      if (activePos == pos) {
        return this.pause().cycle()
      }

      return this.slide(pos > activePos ? 'next' : 'prev', $(children[pos]))
    }

  , pause: function (e) {
      if (!e) this.paused = true
      clearInterval(this.interval)
      this.interval = null
      return this
    }

  , next: function () {
      if (this.sliding) return
      return this.slide('next')
    }

  , prev: function () {
      if (this.sliding) return
      return this.slide('prev')
    }

  , slide: function (type, next) {
      var $active = this.$element.find('.active')
        , $next = next || $active[type]()
        , isCycling = this.interval
        , direction = type == 'next' ? 'left' : 'right'
        , fallback  = type == 'next' ? 'first' : 'last'
        , that = this
        , e = $.Event('slide')

      this.sliding = true

      isCycling && this.pause()

      $next = $next.length ? $next : this.$element.find('.item')[fallback]()

      if ($next.hasClass('active')) return

      if ($.support.transition && this.$element.hasClass('slide')) {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $next.addClass(type)
        $next[0].offsetWidth // force reflow
        $active.addClass(direction)
        $next.addClass(direction)
        this.$element.one($.support.transition.end, function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () { that.$element.trigger('slid') }, 0)
        })
      } else {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $active.removeClass('active')
        $next.addClass('active')
        this.sliding = false
        this.$element.trigger('slid')
      }

      isCycling && this.cycle()

      return this
    }

  }


 /* CAROUSEL PLUGIN DEFINITION
  * ========================== */

  $.fn.carousel = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('carousel')
        , options = $.extend({}, $.fn.carousel.defaults, typeof option == 'object' && option)
      if (!data) $this.data('carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (typeof option == 'string' || (option = options.slide)) data[option]()
      else if (options.interval) data.cycle()
    })
  }

  $.fn.carousel.defaults = {
    interval: 5000
  , pause: 'hover'
  }

  $.fn.carousel.Constructor = Carousel


 /* CAROUSEL DATA-API
  * ================= */

  $(function () {
    $('body').on('click.carousel.data-api', '[data-slide]', function ( e ) {
      var $this = $(this), href
        , $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
        , options = !$target.data('modal') && $.extend({}, $target.data(), $this.data())
      $target.carousel(options)
      e.preventDefault()
    })
  })

}(window.jQuery);
/* =============================================================
 * bootstrap-typeahead.js v2.0.4
 * http://twitter.github.com/bootstrap/javascript.html#typeahead
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */



!function($){

  "use strict"; // jshint ;_;


 /* TYPEAHEAD PUBLIC CLASS DEFINITION
  * ================================= */

  var Typeahead = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.typeahead.defaults, options)
    this.matcher = this.options.matcher || this.matcher
    this.sorter = this.options.sorter || this.sorter
    this.highlighter = this.options.highlighter || this.highlighter
    this.updater = this.options.updater || this.updater
    this.$menu = $(this.options.menu).appendTo('body')
    this.source = this.options.source
    this.shown = false
    this.listen()
  }

  Typeahead.prototype = {

    constructor: Typeahead

  , select: function () {
      var val = this.$menu.find('.active').attr('data-value')
      this.$element
        .val(this.updater(val))
        .change()
      return this.hide()
    }

  , updater: function (item) {
      return item
    }

  , show: function () {
      var pos = $.extend({}, this.$element.offset(), {
        height: this.$element[0].offsetHeight
      })

      this.$menu.css({
        top: pos.top + pos.height
      , left: pos.left
      })

      this.$menu.show()
      this.shown = true
      return this
    }

  , hide: function () {
      this.$menu.hide()
      this.shown = false
      return this
    }

  , lookup: function (event) {
      var that = this
        , items
        , q

      this.query = this.$element.val()

      if (!this.query) {
        return this.shown ? this.hide() : this
      }

      items = $.grep(this.source, function (item) {
        return that.matcher(item)
      })

      items = this.sorter(items)

      if (!items.length) {
        return this.shown ? this.hide() : this
      }

      return this.render(items.slice(0, this.options.items)).show()
    }

  , matcher: function (item) {
      return ~item.toLowerCase().indexOf(this.query.toLowerCase())
    }

  , sorter: function (items) {
      var beginswith = []
        , caseSensitive = []
        , caseInsensitive = []
        , item

      while (item = items.shift()) {
        if (!item.toLowerCase().indexOf(this.query.toLowerCase())) beginswith.push(item)
        else if (~item.indexOf(this.query)) caseSensitive.push(item)
        else caseInsensitive.push(item)
      }

      return beginswith.concat(caseSensitive, caseInsensitive)
    }

  , highlighter: function (item) {
      var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&')
      return item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
        return '<strong>' + match + '</strong>'
      })
    }

  , render: function (items) {
      var that = this

      items = $(items).map(function (i, item) {
        i = $(that.options.item).attr('data-value', item)
        i.find('a').html(that.highlighter(item))
        return i[0]
      })

      items.first().addClass('active')
      this.$menu.html(items)
      return this
    }

  , next: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , next = active.next()

      if (!next.length) {
        next = $(this.$menu.find('li')[0])
      }

      next.addClass('active')
    }

  , prev: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , prev = active.prev()

      if (!prev.length) {
        prev = this.$menu.find('li').last()
      }

      prev.addClass('active')
    }

  , listen: function () {
      this.$element
        .on('blur',     $.proxy(this.blur, this))
        .on('keypress', $.proxy(this.keypress, this))
        .on('keyup',    $.proxy(this.keyup, this))

      if ($.browser.webkit || $.browser.msie) {
        this.$element.on('keydown', $.proxy(this.keypress, this))
      }

      this.$menu
        .on('click', $.proxy(this.click, this))
        .on('mouseenter', 'li', $.proxy(this.mouseenter, this))
    }

  , keyup: function (e) {
      switch(e.keyCode) {
        case 40: // down arrow
        case 38: // up arrow
          break

        case 9: // tab
        case 13: // enter
          if (!this.shown) return
          this.select()
          break

        case 27: // escape
          if (!this.shown) return
          this.hide()
          break

        default:
          this.lookup()
      }

      e.stopPropagation()
      e.preventDefault()
  }

  , keypress: function (e) {
      if (!this.shown) return

      switch(e.keyCode) {
        case 9: // tab
        case 13: // enter
        case 27: // escape
          e.preventDefault()
          break

        case 38: // up arrow
          if (e.type != 'keydown') break
          e.preventDefault()
          this.prev()
          break

        case 40: // down arrow
          if (e.type != 'keydown') break
          e.preventDefault()
          this.next()
          break
      }

      e.stopPropagation()
    }

  , blur: function (e) {
      var that = this
      setTimeout(function () { that.hide() }, 150)
    }

  , click: function (e) {
      e.stopPropagation()
      e.preventDefault()
      this.select()
    }

  , mouseenter: function (e) {
      this.$menu.find('.active').removeClass('active')
      $(e.currentTarget).addClass('active')
    }

  }


  /* TYPEAHEAD PLUGIN DEFINITION
   * =========================== */

  $.fn.typeahead = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('typeahead')
        , options = typeof option == 'object' && option
      if (!data) $this.data('typeahead', (data = new Typeahead(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.typeahead.defaults = {
    source: []
  , items: 8
  , menu: '<ul class="typeahead dropdown-menu"></ul>'
  , item: '<li><a href="#"></a></li>'
  }

  $.fn.typeahead.Constructor = Typeahead


 /* TYPEAHEAD DATA-API
  * ================== */

  $(function () {
    $('body').on('focus.typeahead.data-api', '[data-provide="typeahead"]', function (e) {
      var $this = $(this)
      if ($this.data('typeahead')) return
      e.preventDefault()
      $this.typeahead($this.data())
    })
  })

}(window.jQuery);












(function() {



}).call(this);
(function() {



}).call(this);
(function() {

  jQuery(function() {
    $("a[rel=popover]").popover();
    $(".tooltip").tooltip();
    return $("a[rel=tooltip]").tooltip();
  });

}).call(this);
(function() {



}).call(this);
function number_pages() {
  var vars={};
  var x=document.location.search.substring(1).split('&');
  for(var i in x) {var z=x[i].split('=',2);vars[z[0]] = unescape(z[1]);}
  var x=['frompage','topage','page','webpage','section','subsection','subsubsection'];
  for(var i in x) {
    var y = document.getElementsByClassName(x[i]);
    for(var j=0; j<y.length; ++j) y[j].textContent = vars[x[i]];
  }
}
;
(function() {



}).call(this);
(function() {



}).call(this);
// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//





;
