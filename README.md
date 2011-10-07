jwerty
======
##### Awesome handling of keyboard events

jwerty is a JS lib which allows you to bind, fire and assert key combination
strings against elements and events. It normalises the poor std api into
something easy to use and clear.

jwerty is a small library, weighing in at around 1.5kb bytes minified and
gzipped (~3kb minified). jwerty has no dependencies, but is compatible with
jQuery, Zepto or Ender if you include those packages alongside it.

For detailed docs, please read the README-DETAILED.md file.

The Short version
=================

Use `jwerty.key` to bind your callback to a key combo (global shortcuts)

    jwerty.key('ctrl+shift+P', function () { [...] });
    jwerty.key('⌃+⇧+P', function () { [...] });
    
Specify optional keys...

    jwerty.key('⌃+⇧+P/⌘+⇧+P', function () { [...] });
    
or key sequences.

    jwerty.key('↑,↑,↓,↓,←,→,←,→,B,A,↩', function () { [...] });

You can also (since 0.3) specify regex-like ranges:

    jwerty.key('ctrl+[a-c]', function () { [...] }); // fires for ctrl+a,ctrl+b or ctrl+c
    
Pass in a context to bind your callback:

    jwerty.key('⌃+⇧+P/⌘+⇧+P', function () { [...] }, this);
    
Pass in a selector to bind a shortcut local to that element

    jwerty.key('⌃+⇧+P/⌘+⇧+P', function () { [...] }, this, '#myinput');
    
Pass in a selector's context, similar to jQuery's $('selector', 'scope')

    jwerty.key('⌃+⇧+P/⌘+⇧+P', function () { [...] }, this, 'input.email', '#myForm');
    
If you're bining to a selector, you can also ommit the function context:

    jwerty.key('⌃+⇧+P/⌘+⇧+P', function () { [...] }, 'input.email', '#myForm');
    
Use `jwerty.event` as a decorator, to bind events your own way:
    
    $('#myinput').bind('keydown', jwerty.event('⌃+⇧+P/⌘+⇧+P', function () { [...] }));
    
Use `jwerty.is` to check a keyCombo against a keyboard event:

    function (event) {
        if ( jwerty.is('⌃+⇧+P', event) ) {
            [...]
        }
    }

Or use `jwerty.fire` to send keyboard events to other places:

    jwerty.fire('enter', 'input:first-child', '#myForm');