The jwertyCode
==============

All jwerty events will require a jwertyCode in some way. jwertyCodes can be
passed as strings, or arrays, strings being the easiest way to express a combo.
A jwertyCode string, should look similar to this:

    '⌃+⇧+P/⌘+⇧+P, X'

Case and whitespace do not matter. `+` is used to add keys to make a single
combo, `/` is used to provide a list of optional keys or key combos, and `,` is
used to make a key combo sequence. For example, if you wanted to look for the
key combination of control + shift + P, then one of the following would
represent that (you can use shorthand names or symbols for keys that need it):

    'ctrl+shift+p' OR 'control+shift+P' OR '⌃+⇧+P'

If you wanted *either* control + shift + P *or* command + shift + P then you
would use the `/` key to separate the two:

    'ctrl+shift+p/cmd+shift+P'

If you wanted to only fire an event when the user has typed ctrl+shift+p
followed by the P key, on it's own again, then you need to use the `,` key, like
so:

    'ctrl+shift+p, p'
    
You could also mix sequences and optionals:

    'ctrl+shift+p/cmd+shift+p, p'

Also, since version 0.3, you can specify ranges:

    'ctrl+shift+[0-9], ctrl+shift+[num-0-num-9]'

This will automatically expand these to ctrl+shift+0, ctrl+shift+1 and so on.
Because these are worked out on the keyboard keycodes, they'll work many types
of ranges, such as:

    '[f1-f11], [num-3-num-7], [a-c], [g-f], [←-↓]' // (the last one matches all arrow codes)
    
If you have a complex pattern, it may be more readable to use an array literal
to express the combination. If you express it as an array, then the top level
array will delemit a sequence, while each value in the array can be a string,
which is parsed for commas, or an array which will delimit optionals.
In other words, the following are the same:

    [['ctrl+shift+p', 'cmd+shift+p'], 'p'] OR 'ctrl+shift+p/cmd+shift+p, p'

--------------------------------------------------------------------------------
    
jwerty.key
==========

    jwerty.key(jwertyCode, callbackFunction, [callbackContext]);

`jwerty.key` will attach an event listener and fire `callbackFunction` when
`jwertyCode` matches. The event listener is attached to `document`, meaning
it will listen for any key events on the page (a global shortcut listener). If
`callbackContext` is specified then it will be supplied as
`callbackFunction`'s context - in other words, the keyword `this` will be
set to `callbackContext` inside the `callbackFunction` function.

 - If `callbackFunction` returns `false` then preventDefault() will be
   called for the event, in other words - what the browser normally does when
   this key is pressed will not happen.
   
 - If `callbackFunction` can be a boolen (`true` or `false`), rather than an
   actual function. If it is a boolean, it will be treated like a function that
   instantly returns that value. This is useful if you just want to disable a
   key, for example: `jwerty.key('ctrl+V', false)` will disable ctrl+V's default
   behaviour.

    jwerty.key(jwertyCode, callbackFunction, [callbackContext], [selector, [selectorContext]]);

`jwerty.key` will attach an event listener and fire `callbackFunction` when
`jwertyCode` matches. The event listener is attached to `selector`.
`callbackContext` can be ommited if not needed, and `selector` becomes
the third argument. `selectorContext` is used to search for `selector`
within `selectorContext`, similar to jQuery's `$('selector', 'context')`.

 - `selector` can be a CSS1/2/3 selector - it will use
   document.querySelectorAll, unless you have jQuery, Zepto or Ender installed,
   in which case it will use those as the selector engine.
 - `selector` can be a DOM element (such as HTMLDivElement), or a jQuery
   element object, or a Zepto element object, or an Ender element object.
 - `selectorContext` has the same rules as `selector`, it can be a
   string, DOM element or jQuery/Zepto/Ender element object.

#### Example Usage

    // prevents 'ctrl+shift+p''s default action
    jwerty.key('ctrl+shift+p', false);
    
    // outputs "print!" to the console when pressed.
    jwerty.key('ctrl+shift+p', function () { console.log('print!') });
    
    // will prevent the shortcut from running, only when '#myInput' is in focus
    jwerty.key('ctrl+shift+p', false, '#myInput');

--------------------------------------------------------------------------------
    
jwerty.event
==========

    jwerty.event(jwertyCode, callbackFunction, [callbackContext]);

`jwerty.event` will return a function, which expects the first argument to be a
key event. When the key event matches `jwertyCode`, `callbackFunction`
is fired. `jwerty.event` is used by `jwerty.key` to bind the function it returns.
`jwerty.event` is useful for attaching to your own event listeners. It can be
used as a decorator method to encapsulate functionality that you only want to
fire after a specific key combo. If `callbackContext` is specified then it
will be supplied as `callbackFunction`'s context - in other words, the
keyword `this` will be set to `callbackContext` inside the
`callbackFunction` function.

 - If `callbackFunction` returns `false` then preventDefault() will be
   called for the event, in other words - what the browser normally does when
   this key is pressed will not happen.
   
 - If `callbackFunction` can be a boolen (`true` or `false`), rather than an
   actual function. If it is a boolean, it will be treated like a function that
   instantly returns that value. This is useful if you just want to disable a
   key, for example: `jwerty.key('ctrl+V', false)` will disable ctrl+V's default
   behaviour.
   
#### Example Usage

    // prevents pasting in #myinput
    $('#myinput').bind('keydown', jwerty.event('ctrl+v/cmd+v', false));
    
    // great to use with Backbone JS view events:
    events: {
        'keyup input': 'keyupInput'
    },
    keyupInput: jwerty.event('enter', function () {
        this.submit();
    }),  

--------------------------------------------------------------------------------
    
jwerty.is
==========

    jwerty.is(jwertyCode, event, [sequenceKey]);

`jwerty.is` will return a boolean value, based on if `event` matches
`jwertyCode`. `jwerty.is` is called by `jwerty.event` to check whether or
not to fire the callback. `event` can be a DOM event, or a
jQuery/Zepto/Ender manufactured event. The properties of `jwertyCode`
(speficially ctrlKey, altKey, metaKey, shiftKey and keyCode) should match
`jwertyCode`'s properties - if they do, then `jwerty.is` will return `true`.
If they don't, `jwerty.is` will return `false`.

 - If `jwertyCode` is a key sequence (e.g 'ctrl+c, d, e') then it will check
   the first part of the sequence unless you specify `sequenceKey`.
   `sequenceKey` needs to be an integer for the zero-indexed array of keys
   in the key sequence. So for example, running `jwerty.is(e, 'ctrl+c, d, e', 0)`
   will try to match `ctrl+c`, whereas `jwerty.is(e, 'ctrl+c, d, e', 1)` will
   try to match `d` and so on.

 - If `jwertyCode` includes optionals (e.g 'ctrl+shift+p/cmd+shift+p') it
   will look at both, and if either return match then the return value will be
   `true`.
   
#### Example Usage

    // add "pasted" class when ctrl+v/cmd+v is pressed
    $('#myinput').bind('keydown', function () {
        if (jwerty.is('ctrl+v/cmd+v')) {
            this.addClass('pasted');
        }
    });
   
--------------------------------------------------------------------------------
    
jwerty.fire
==========

    jwerty.fire(jwertyCode, [selector, [selectorContext]], [sequenceKey]);

`jwerty.fire` will construct a keydown event to fire, based on `jwertyCode`.
The event will be fired against `selector`. `selectorContext` is used to
search for `selector` within `selectorContext`, similar to jQuery's
`$('selector', 'context')`.

 - `selector` can be a CSS1/2/3 selector - it will use
   document.querySelectorAll, unless you have jQuery, Zepto or Ender installed,
   in which case it will use those as the selector engine.
 - `selector` can be a DOM element (such as HTMLDivElement), or a jQuery
   element object, or a Zepto element object, or an Ender element object.
 - `selectorContext` has the same rules as `selector`, it can be a
   string, DOM element or jQuery/Zepto/Ender element object.
   
#### Example Usage

    // fire 'a' on body
    jwerty.fire('a');
    
    // fire 'a' on #myform input.name
    jwerty.fire('a, b', 'input.name', '#myForm');
    
    // fire 'b' on #myform input.name
    jwerty.fire('a, b', 'input.name', '#myForm', 2);