QUnit.config.noglobals = true;
QUnit.config.notrycatch = true;
QUnit.config.reorder = false;

var buildEvent = function (keyCode, shift, ctrl, alt, meta, dom) {
    var ret = document.createEvent('Event');
    
    ret.initEvent('keydown', true, true);
    ret.keyCode = keyCode || 65;
    ret.shiftKey = shift || false;
    ret.ctrlKey = ctrl || false;
    ret.altKey = alt || false;
    ret.metaKey = meta || false;
    dom = dom || document;
    
    return dom.dispatchEvent(ret);
},
expectKeyEvents = function (count) {
    equal(QUnit.current_testEnvironment.keyupCount, count, 'Expect ' + count + ' keyup events to fire during test');
};
        
module('jwerty', {
    
    setup: function () {
        this.keyupCount = 0;
        this.assertjwerty = function (event, combo) {
            ok(true, 'jwerty event fired for "' + combo + '"');
        }
        this.input = document.createElement('input');
        var self = this;
        if (window.jQuery || window.Zepto) {
            $(this.input).bind('keydown', function () { ++self.keyupCount; });
        } else {
            this.input.addEventListener('keydown', function () { ++self.keyupCount; });
        }
    }
    
});

test("Test jwerty KEYS contain the correct keys", function () {
    //Only test number/letter keys as the rest are not really worth testing, as
    // one would have to just do basic assertions with an identical object
    // literal as is in the code
    
    var keys = [
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
        'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
    ];
    
    for (var i = 0, c = keys.length; i < c; ++i) {
        equal(jwerty.KEYS.keys[keys[i].toLowerCase()], keys[i].charCodeAt(0), keys[i] + ' = ' + keys[i].charCodeAt(0));
    }
    
});

test("Test jwerty initialise", function () {
    expect(2);
    
    jwerty.key('a', this.assertjwerty, this.input);
    
    // Fire an A key
    buildEvent(65, false, false, false, false, this.input);
    
    // These shouldnt fire
    buildEvent(63, false, false, false, false, this.input);
    buildEvent(67, false, false, false, false, this.input);
    buildEvent(65, true, false, false, false, this.input);
    buildEvent(65, true, true, false, false, this.input);
    buildEvent(65, true, true, true, false, this.input);
    buildEvent(65, true, true, true, true, this.input);
    buildEvent(65, false, true, true, true, this.input);
    buildEvent(65, false, false, true, true, this.input);
    buildEvent(65, false, false, false, true, this.input);
    
    expectKeyEvents(10);
});

test("Test jwerty fires on boolean callback", function () {
    expect(1);
    
    var eventStub  = {}
    ,   event1 = jwerty.event('a', false, this.input)
    ,   event2 = jwerty.event('a', true, this.input);
    
    eventStub = {
        keyCode: 65,
        ctrlKey: false, shiftKey: false, altKey: false, metaKey: false,
        preventDefault: function () {
            ok(true, 'Prevent default was fired');
        }
    };
    event1(eventStub);
    event2(eventStub);
});

test("Test jwerty optional combos", function () {
    expect(3);
    
    jwerty.key([['b', 'a']], this.assertjwerty, this.input);
    
    // Fire an A key
    buildEvent(65, false, false, false, false, this.input);
    // Fire on B key
    buildEvent(66, false, false, false, false, this.input);
    
    // These shouldnt fire
    buildEvent(63, false, false, false, false, this.input);
    buildEvent(67, false, false, false, false, this.input);
    buildEvent(65, true, false, false, false, this.input);
    buildEvent(66, true, true, false, false, this.input);
    buildEvent(65, true, true, true, false, this.input);
    buildEvent(66, true, true, true, true, this.input);
    buildEvent(65, false, true, true, true, this.input);
    buildEvent(66, false, false, true, true, this.input);
    buildEvent(65, false, false, false, true, this.input);
    
    expectKeyEvents(11);
});

test("Test jwerty combos with mod characters", function () {
    expect(3);
    
    jwerty.key([['shift+b', '⌃+⌫']], this.assertjwerty, this.input);
    
    // Fire on B key with SHIFT
    buildEvent(66, true, false, false, false, this.input);
    // Fire on BACKSPACE key with CTRL
    buildEvent(8, false, true, false, false, this.input);
    
    // These shouldnt fire
    buildEvent(8, true, false, false, false, this.input);
    buildEvent(8, true, true, false, false, this.input);
    buildEvent(8, true, true, true, true, this.input);
    buildEvent(8, false, false, true, true, this.input);
    buildEvent(66, true, true, false, false, this.input);
    buildEvent(66, false, true, false, false, this.input);
    buildEvent(66, true, true, true, false, this.input);
    buildEvent(66, true, true, true, true, this.input);
    buildEvent(65, false, false, false, true, this.input);
    
    expectKeyEvents(11);
});

test("Test jwerty sequence", function () {
    expect(3);
    
    jwerty.key([['⌃+⇧+⌥+C'], ['⌃+⇧+⌥+O'], ['⌃+⇧+⌥+O'], ['⌃+⇧+⌥+L']], this.assertjwerty, this.input);
    
    // Get to first result with C plus ctrl, shift, alt
    buildEvent(67, true, true, true, false, this.input);
    // Get to second result with O plus ctrl, shift, alt
    buildEvent(79, true, true, true, false, this.input);
    // Get to second result with O plus ctrl, shift, alt
    buildEvent(79, true, true, true, false, this.input);
    // Get to second result with L plus ctrl, shift, alt
    buildEvent(76, true, true, true, false, this.input);
    
    
    // Get to first result with C plus ctrl, shift, alt
    buildEvent(67, true, true, true, false, this.input);
    // Go back to first result with C plus ctrl, shift, alt
    buildEvent(67, true, true, true, false, this.input);
    // Get to second result with O plus ctrl, shift, alt
    buildEvent(79, true, true, true, false, this.input);
    // Get to second result with O plus ctrl, shift, alt
    buildEvent(79, true, true, true, false, this.input);
    // Get to second result with L plus ctrl, shift, alt
    buildEvent(76, true, true, true, false, this.input);
    
    // These shouldnt fire
    buildEvent(67, true, true, true, false, this.input);
    buildEvent(79, true, true, true, false, this.input);
    buildEvent(79, true, true, true, false, this.input);
    buildEvent(79, true, true, true, false, this.input); // injected key in sequence
    buildEvent(76, true, true, true, false, this.input);
    
    buildEvent(67, true, true, true, false, this.input);
    buildEvent(79, true, true, true, false, this.input);
    buildEvent(79, true, true, true, false, this.input);
    buildEvent(77, true, true, true, false, this.input); // wrong key
    
    buildEvent(67, true, true, true, false, this.input);
    buildEvent(79, true, true, true, false, this.input);
    buildEvent(79, true, true, true, false, this.input);
    buildEvent(76, true, true, true, true, this.input); // meta key included
    
    buildEvent(67, true, true, true, false, this.input);
    buildEvent(79, true, true, false, false, this.input); // Missing alt
    buildEvent(79, true, true, true, false, this.input);
    buildEvent(76, true, true, true, false, this.input);
    
    expectKeyEvents(26);
});

test("(Most importantly) test the konami code", function () {
    expect(2);
    
    jwerty.key([['↑'], ['↑'], ['↓'], ['↓'], ['←'], ['→'], ['←'], ['→'], ['B'], ['A'], ['↩']], this.assertjwerty, this.input);
    
    // Up
    buildEvent(38, false, false, false, false, this.input);
    // Up
    buildEvent(38, false, false, false, false, this.input);
    // Down
    buildEvent(40, false, false, false, false, this.input);
    // Down
    buildEvent(40, false, false, false, false, this.input);
    // Left
    buildEvent(37, false, false, false, false, this.input);
    // Right
    buildEvent(39, false, false, false, false, this.input);
    // Left
    buildEvent(37, false, false, false, false, this.input);
    // Right
    buildEvent(39, false, false, false, false, this.input);
    // B
    buildEvent(66, false, false, false, false, this.input);
    // A
    buildEvent(65, false, false, false, false, this.input);
    // Start (Enter)
    buildEvent(13, false, false, false, false, this.input);
    
    // These wont fire
     // Up
    buildEvent(38, false, false, false, false, this.input);
    // Up
    buildEvent(38, false, false, false, false, this.input);
    // Down
    buildEvent(40, false, false, false, false, this.input);
    // Down
    buildEvent(40, false, false, false, false, this.input);
    // Left
    buildEvent(37, false, false, false, false, this.input);
    // Right
    buildEvent(39, false, false, false, false, this.input);
    // Left
    buildEvent(37, false, false, false, false, this.input);
    // Right
    buildEvent(39, false, false, false, false, this.input);
    // A
    buildEvent(65, false, false, false, false, this.input); // {
    // B                                                    //  Noob
    buildEvent(66, false, false, false, false, this.input); // }
    // Start (Enter)
    buildEvent(13, false, false, false, false, this.input);
    
    // Up
    buildEvent(38, false, false, false, false, this.input);
    // Up
    buildEvent(38, false, false, false, false, this.input);
    // Down
    buildEvent(40, false, false, false, false, this.input);
    // Down
    buildEvent(40, true, false, false, false, this.input); // Shift
    // Left
    buildEvent(37, false, false, false, false, this.input);
    // Right
    buildEvent(39, false, false, false, false, this.input);
    // Left
    buildEvent(37, false, false, false, false, this.input);
    // Right
    buildEvent(39, false, false, false, false, this.input);
    // B
    buildEvent(66, false, false, false, false, this.input);
    // A
    buildEvent(65, false, false, false, false, this.input);
    // Start (Enter)
    buildEvent(13, false, false, false, false, this.input);
    
    expectKeyEvents(33);
});

test("Test jwerty combos as a string", function () {
    expect(3);
    
    jwerty.key('shift+b/⌃+⌫', this.assertjwerty, this.input);
    
    // Fire on B key with SHIFT
    buildEvent(66, true, false, false, false, this.input);
    // Fire on BACKSPACE key with CTRL
    buildEvent(8, false, true, false, false, this.input);
    
    // These shouldnt fire
    buildEvent(8, true, false, false, false, this.input);
    buildEvent(8, true, true, false, false, this.input);
    buildEvent(8, true, true, true, true, this.input);
    buildEvent(8, false, false, true, true, this.input);
    buildEvent(66, true, true, false, false, this.input);
    buildEvent(66, false, true, false, false, this.input);
    buildEvent(66, true, true, true, false, this.input);
    buildEvent(66, true, true, true, true, this.input);
    buildEvent(65, false, false, false, true, this.input);
    
    expectKeyEvents(11);
});

test("Test sequence as a string", function () {
    expect(3);
    
    jwerty.key('↑,↑,↓,↓,←,→,←,→,B,A,↩/space', this.assertjwerty, this.input);
    
    // Up
    buildEvent(38, false, false, false, false, this.input);
    // Up
    buildEvent(38, false, false, false, false, this.input);
    // Down
    buildEvent(40, false, false, false, false, this.input);
    // Down
    buildEvent(40, false, false, false, false, this.input);
    // Left
    buildEvent(37, false, false, false, false, this.input);
    // Right
    buildEvent(39, false, false, false, false, this.input);
    // Left
    buildEvent(37, false, false, false, false, this.input);
    // Right
    buildEvent(39, false, false, false, false, this.input);
    // B
    buildEvent(66, false, false, false, false, this.input);
    // A
    buildEvent(65, false, false, false, false, this.input);
    // Start (Enter)
    buildEvent(13, false, false, false, false, this.input);
    
    // Up
    buildEvent(38, false, false, false, false, this.input);
    // Up
    buildEvent(38, false, false, false, false, this.input);
    // Down
    buildEvent(40, false, false, false, false, this.input);
    // Down
    buildEvent(40, false, false, false, false, this.input);
    // Left
    buildEvent(37, false, false, false, false, this.input);
    // Right
    buildEvent(39, false, false, false, false, this.input);
    // Left
    buildEvent(37, false, false, false, false, this.input);
    // Right
    buildEvent(39, false, false, false, false, this.input);
    // B
    buildEvent(66, false, false, false, false, this.input);
    // A
    buildEvent(65, false, false, false, false, this.input);
    // Space
    buildEvent(32, false, false, false, false, this.input);
    
    // These wont fire
    // Up
    buildEvent(38, false, false, false, false, this.input);
    // Up
    buildEvent(38, false, false, false, false, this.input);
    // Down
    buildEvent(40, false, false, false, false, this.input);
    // Down
    buildEvent(40, false, false, false, false, this.input);
    // Left
    buildEvent(37, false, false, false, false, this.input);
    // Right
    buildEvent(39, false, false, false, false, this.input);
    // Left
    buildEvent(37, false, false, false, false, this.input);
    // Right
    buildEvent(39, false, false, false, false, this.input);
    // A
    buildEvent(65, false, false, false, false, this.input); // {
    // B                                                    //  Noob
    buildEvent(66, false, false, false, false, this.input); // }
    // Start (Enter)
    buildEvent(13, false, false, false, false, this.input);
    
    // Up
    buildEvent(38, false, false, false, false, this.input);
    // Up
    buildEvent(38, false, false, false, false, this.input);
    // Down
    buildEvent(40, false, false, false, false, this.input);
    // Down
    buildEvent(40, true, false, false, false, this.input); // Shift
    // Left
    buildEvent(37, false, false, false, false, this.input);
    // Right
    buildEvent(39, false, false, false, false, this.input);
    // Left
    buildEvent(37, false, false, false, false, this.input);
    // Right
    buildEvent(39, false, false, false, false, this.input);
    // B
    buildEvent(66, false, false, false, false, this.input);
    // A
    buildEvent(65, false, false, false, false, this.input);
    // Start (Enter)
    buildEvent(13, false, false, false, false, this.input);
    
    expectKeyEvents(44);
});

test("Test some weird string combos", function () {
    expect(2);
    
    jwerty.key('shift++', this.assertjwerty);
    
    buildEvent(107, true, false, false, false);
    
    jwerty.key('shift+,,+', this.assertjwerty);
    
    buildEvent(188, true, false, false, false);
    buildEvent(107, false, false, false, false);
});


test("Test jwerty.fire, firing correct events to an eventListener", function () {
    expect(3);
    
    var event = {
        keyCode: 112,
        ctrlKey: true,
        shiftKey: true
    };
    
    listenForKeyup(this.input, function (e) {
        for (var i in event) {
            equal(event[i], e[i], 'Event contains expected ' + i);
        }
    });
    
    jwerty.fire('⌃+shift+F1', this.input);
});

test("Test key binding without element, binding to `document`", function () {
    expect(1);
    
    jwerty.key('space', this.assertjwerty);
    buildEvent(32, false, false, false, false);
});
