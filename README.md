[jwerty](http://keithcirkel.co.uk/jwerty/)
======
##### Awesome handling of keyboard events
###### http://keithcirkel.co.uk/jwerty/

jwerty is a JS lib which allows you to bind, fire and assert key combination
strings against elements and events. It normalises the poor std api into
something easy to use and clear.

jwerty is a small library, weighing in at around 1.5kb bytes minified and
gzipped (~3kb minified). jwerty has no dependencies, but is compatible with
[jQuery][jQuery], [Zepto][Zepto], [Ender][Ender] or [CanJS][CanJS] if you
include those packages alongside it. You can install jwerty via [npm][npm] (for
use with Ender) or [Bower][Bower].

For detailed docs, please read the [README-DETAILED.md](README-DETAILED.md) file.

The Short version
=================

Use `jwerty.key` to bind your callback to a key combo (global shortcuts)

```javascript
jwerty.key('ctrl+shift+P', function () { [...] });
jwerty.key('⌃+⇧+P', function () { [...] });
```

Specify optional keys:

```javascript
jwerty.key('⌃+⇧+P/⌘+⇧+P', function () { [...] });
```

or key sequences:

```javascript
jwerty.key('↑,↑,↓,↓,←,→,←,→,B,A,↩', function () { [...] });
```

You can also (since 0.3) specify regex-like ranges:

```javascript
jwerty.key('ctrl+[a-c]', function () { [...] }); // fires for ctrl+a,ctrl+b or ctrl+c
```

Pass in a context to bind your callback:

```javascript
jwerty.key('⌃+⇧+P/⌘+⇧+P', function () { [...] }, this);
```

Pass in a selector to bind a shortcut local to that element:

```javascript
jwerty.key('⌃+⇧+P/⌘+⇧+P', function () { [...] }, this, '#myinput');
```

Pass in a selector's context, similar to jQuery's $('selector', 'scope'):

```javascript
jwerty.key('⌃+⇧+P/⌘+⇧+P', function () { [...] }, this, 'input.email', '#myForm');
```

If you're binding to a selector and don't need the context, you can ommit it:

```javascript
jwerty.key('⌃+⇧+P/⌘+⇧+P', function () { [...] }, 'input.email', '#myForm');
```

Use `jwerty.event` as a decorator, to bind events your own way:

```javascript
$('#myinput').bind('keydown', jwerty.event('⌃+⇧+P/⌘+⇧+P', function () { [...] }));
```

Use `jwerty.is` to check a keyCombo against a keyboard event:

```javascript
function (event) {
    if ( jwerty.is('⌃+⇧+P', event) ) {
        [...]
    }
}
```

Or use `jwerty.fire` to send keyboard events to other places:

```javascript
jwerty.fire('enter', 'input:first-child', '#myForm');
```

[jQuery]: http://jquery.com/
[Zepto]:  http://zeptojs.com/
[Ender]:  http://ender.jit.su/
[CanJS]:  http://canjs.com/
[npm]:    https://npmjs.org/
[Bower]:  http://twitter.github.io/bower/