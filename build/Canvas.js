var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _CanvasObject_x, _CanvasObject_y;
// Get every ancestor of the current prototype.
Object.defineProperty(Object.prototype, "ancestors", {
    /**
     *
     * @returns An array with every descendant of this object.
     */
    get: function () {
        var arr = [];
        var p = this.constructor.prototype;
        while (true) {
            if (!p)
                break;
            arr.push(p.constructor);
            p = Object.getPrototypeOf(p);
        }
        return arr;
    }
});
// Check if the current object is any of value.
Object.defineProperty(Object.prototype, "is_a", {
    /**
     *
     * @param {*} object Check if this is equal to object.
     * @returns a boolean indicating if is descendant of.
     */
    value: function (object) {
        return this.ancestors.includes(object);
    }
});
// The Canvas constructor
var Canvas = /** @class */ (function () {
    // Initialize object
    /**
     *
     * @param {String} ctx Sets the context type. (default: 2d)
     */
    function Canvas(ctx) {
        if (ctx === void 0) { ctx = "2d"; }
        this.objects = [];
        this.dom = document.createElement("canvas");
        this.context = this.dom.getContext(ctx);
    }
    // Set canvas DOM dimensions
    /**
     *
     * @param {Number} width Sets the canvas width.
     * @param {Number} height Sets the canvas height.
     */
    Canvas.prototype.setSize = function (width, height) {
        this.width = width;
        this.height = height;
    };
    // Clears the canvas object
    /**
     *
     * @param {Number} x Sets the initial cleaning position x. Set to 0 if NaN. (default: 0)
     * @param {Number} y Sets the initial cleaning position y. Set to 0 if NaN. (default: 0)
     * @param {Number} width Sets the cleaning area witdh. Set to this.canvas.width if NaN.
     * @param {Number} height Sets the cleaning area height. Set to this.canvas.height if NaN.
     */
    Canvas.prototype.clear = function (x, y, width, height) {
        if (x === void 0) { x = false; }
        if (y === void 0) { y = false; }
        if (width === void 0) { width = false; }
        if (height === void 0) { height = false; }
        x = x.constructor === Number ? x : 0;
        y = y.constructor === Number ? y : 0;
        width = width.constructor === Number ?
            width : this.dom.width;
        height = height.constructor === Number ?
            height : this.dom.height;
        this.context.clearRect(x, y, width, height);
    };
    // Add a new object
    /**
     *
     * @param {CanvasObject} object Append a new object to this one.
     */
    Canvas.prototype.add = function (object) {
        if (!object.is_a(CanvasObject))
            return console.log("The object is not a CanvasObject.");
        this.objects.push(object);
        object.insertIn(this);
        console.log(this.objects);
    };
    // Render every object added to canvas
    /**
     * Render every object appended to this one.
     */
    Canvas.prototype.render = function () {
        for (var x in this.objects) {
            if (this.objects[x].is_a(CanvasObject)) {
                this.objects[x].update();
            }
        }
    };
    Object.defineProperty(Canvas.prototype, "width", {
        // Getter for canvas width
        /**
         *
         * @returns Get the current width of the canvas element.
         */
        get: function () {
            return this.dom.width;
        },
        // Setter for canvas width
        /**
         *
         * @param {Number} value Set a new width for canvas element.
         */
        set: function (value) {
            if (value.constructor === Number)
                this.dom.width = value;
            else
                console.warn("width() value is not a Number.");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, "height", {
        /**
         *
         * @returns {Number} Get the current height of the canvas element.
         */
        get: function () {
            return this.dom.height;
        },
        /**
         *
         * @param {Number} value Set a new height for canvas element.
         */
        set: function (value) {
            if (value.constructor === Number)
                this.dom.height = value;
            else
                console.warn("height() value is not a Number.");
        },
        enumerable: false,
        configurable: true
    });
    return Canvas;
}());
// The CanvasObject constructor
var CanvasObject = /** @class */ (function () {
    /** Create a new CanvasObject with the parameters bellow.
     *
     * @param {Number} x Sets the position x of the object in context to the Canvas origin/parent object.
     * @param {Number} y Sets the position y of the object in context to the Canvas origin/parent object.
     * @param {Number} width Sets the width of the rectangle.
     * @param {Number} height Sets the height of the rectangle.
     */
    function CanvasObject(x, y, width, height) {
        _CanvasObject_x.set(this, void 0);
        _CanvasObject_y.set(this, void 0);
        this.parent = false;
        this.rendering_canvas = false;
        this.objects = [];
        __classPrivateFieldSet(this, _CanvasObject_x, x, "f");
        __classPrivateFieldSet(this, _CanvasObject_y, y, "f");
        this.width = width;
        this.height = height;
    }
    /**
     *
     * @param {CanvasObject} object Add a new object.
     */
    CanvasObject.prototype.add = function (object) {
        this.objects.push(object);
        object.insertIn(this);
    };
    /**
     *
     * @param {Canvas | CanvasObject} object The object for this to be inserted in.
     */
    CanvasObject.prototype.insertIn = function (object) {
        if (!object.is_a(Canvas) && !object.is_a(CanvasObject))
            return console.log("Not a CanvasObject.");
        this.parent = object;
    };
    Object.defineProperty(CanvasObject.prototype, "insertedIn", {
        /**
         *
         * @returns {Canvas | CanvasObject} The parent object of this.
         */
        get: function () {
            return this.parent;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CanvasObject.prototype, "x", {
        /**
         *
         * @returns {Number} The total x position of this.
         */
        get: function () {
            var p = this.parent.is_a(Canvas.Rect) ? this.parent.x : 0;
            return __classPrivateFieldGet(this, _CanvasObject_x, "f") + p;
        },
        /**
         *
         * @param {Number} x Sets the x position of the object accordingly to parent.
         */
        set: function (x) {
            __classPrivateFieldSet(this, _CanvasObject_x, x, "f");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CanvasObject.prototype, "y", {
        /**
         *
         * @returns {Number} The total y position of this.
         */
        get: function () {
            var p = this.parent.is_a(Canvas.Rect) ? this.parent.y : 0;
            return __classPrivateFieldGet(this, _CanvasObject_y, "f") + p;
        },
        /**
         *
         * @param {Number} y Sets the y position of the object accordingly to parent.
         */
        set: function (y) {
            __classPrivateFieldSet(this, _CanvasObject_y, y, "f");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CanvasObject.prototype, "_x", {
        /**
         *
         * @returns {Number} The raw x position of this.
         */
        get: function () {
            return __classPrivateFieldGet(this, _CanvasObject_x, "f");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CanvasObject.prototype, "_y", {
        /**
         *
         * @returns {Number} The raw y position of this.
         */
        get: function () {
            return __classPrivateFieldGet(this, _CanvasObject_y, "f");
        },
        enumerable: false,
        configurable: true
    });
    return CanvasObject;
}());
_CanvasObject_x = new WeakMap(), _CanvasObject_y = new WeakMap();
// The Canvas.Rect constructor
Canvas.Rect = /** @class */ (function (_super) {
    __extends(Rect, _super);
    /** Create a new Rect using the parameters below
     *
     * @param {Number} x Sets the position x of the object in context to the Canvas origin.
     * @param {Number} y Sets the position y of the object in context to the Canvas origin.
     * @param {Number} width Sets the width of the rectangle.
     * @param {Number} height Sets the height of the rectangle.
     * @param {Object} style Add styles to Rect.
     * @param {String} style.type Defines the type of Rect (fill or stroke).
     * @param {String} style.color Defines the color of the Rect.
     *
     */
    function Rect(x, y, width, height, style) {
        if (style === void 0) { style = { color: "#000000" }; }
        var _this = _super.call(this, x, y, width, height) || this;
        if (!style || !style.constructor === Object) {
            style = {};
        }
        if (!style.color)
            style.color = "#000000";
        if (!style.type)
            style.type = "fill";
        style.type = style.type.toLowerCase();
        if (["fill", "rect"].includes(style.type))
            style.type = "fill";
        _this.color = style.color;
        _this.type = style.type;
        return _this;
    }
    /** Update the object and every child
     *
     * @returns false if failed.
     */
    Rect.prototype.update = function () {
        if (!this.parent)
            return false;
        if (!this.rendering_canvas) {
            if (this.is_a(Canvas) || this.is_a(CanvasObject)) {
                var scanning = this.parent;
                while (true) {
                    //console.log(scanning);
                    if (scanning.is_a(Canvas)) {
                        this.rendering_canvas = scanning;
                        //console.log("Rendering canvas set");
                        break;
                    }
                    else if (!scanning.parent) {
                        break;
                    }
                    scanning = scanning.parent;
                }
            }
        }
        if (!this.rendering_canvas)
            return false;
        var ctx = this.rendering_canvas.context;
        ctx.save();
        ctx[this.type + "Style"] = this.color;
        ctx[this.type + "Rect"](this.x, this.y, this.width, this.height);
        ctx.restore();
        for (var x in this.objects)
            this.objects[x].update();
    };
    return Rect;
}(CanvasObject));
