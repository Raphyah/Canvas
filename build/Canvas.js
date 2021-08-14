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
// Get every ancestor of the current prototype.
Object.defineProperty(Object.prototype, "ancestors", {
    /**
     *
     * @returns An array with every descendant of this object.
     */
    get() {
        const arr = [];
        let p = this.constructor.prototype;
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
     * @returns a boolean indicating if is the same of.
     */
    value(object) {
        return Object.getPrototypeOf(this).constructor === object;
    }
});
// Check if the current object is any of value.
Object.defineProperty(Object.prototype, "is_of", {
    /**
     *
     * @param {*} object Check if this is equal to an object ancestor.
     * @returns a boolean indicating if is descendant of.
     */
    value(object) {
        return this.ancestors.includes(object);
    }
});
class Canvas {
    // Initialize object
    /**
     *
     * @param {String} ctx Sets the context type. (default: 2d)
     */
    constructor(ctx = "2d") {
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
    setSize(width, height) {
        this.width = width;
        this.height = height;
    }
    // Clears the canvas object
    /**
     *
     * @param {Number} x Sets the initial cleaning position x. Set to 0 if NaN. (default: 0)
     * @param {Number} y Sets the initial cleaning position y. Set to 0 if NaN. (default: 0)
     * @param {Number} width Sets the cleaning area witdh. Set to this.canvas.width if NaN.
     * @param {Number} height Sets the cleaning area height. Set to this.canvas.height if NaN.
     */
    clear(x = false, y = false, width = false, height = false) {
        x = x.constructor === Number ? x : 0;
        y = y.constructor === Number ? y : 0;
        width = width.constructor === Number ?
            width : this.dom.width;
        height = height.constructor === Number ?
            height : this.dom.height;
        this.context.clearRect(x, y, width, height);
    }
    // Add a new object
    /**
     *
     * @param {CanvasObject} object Append a new object to this one.
     */
    add(object) {
        if (!object.is_of(CanvasObject))
            return console.log("The object is not a CanvasObject.");
        this.objects.push(object);
        object.insertIn(this);
    }
    // Render every object added to canvas
    /**
     * Render every object appended to this one.
     */
    render() {
        for (let x in this.objects) {
            if (this.objects[x].is_of(CanvasObject)) {
                this.objects[x].update();
            }
        }
    }
    // Getter for canvas width
    /**
     *
     * @returns Get the current width of the canvas element.
     */
    get width() {
        return this.dom.width;
    }
    // Setter for canvas width
    /**
     *
     * @param {Number} value Set a new width for canvas element.
     */
    set width(value) {
        if (!isNaN(+value))
            this.dom.width = value;
        else
            console.warn("width() value is not a Number.");
    }
    /**
     *
     * @returns {Number} Get the current height of the canvas element.
     */
    get height() {
        return this.dom.height;
    }
    /**
     *
     * @param {Number} value Set a new height for canvas element.
     */
    set height(value) {
        if (!isNaN(+value))
            this.dom.height = value;
        else
            console.warn("height() value is not a Number.");
    }
}
var _CanvasObject_x, _CanvasObject_y, _CanvasObject_width, _CanvasObject_height, _CanvasObject_orbit;
// The CanvasObject constructor
class CanvasObject {
    /** Create a new CanvasObject with the parameters bellow.
     *
     * @param {Number} x Sets the position x of the object in context to the Canvas origin/parent object.
     * @param {Number} y Sets the position y of the object in context to the Canvas origin/parent object.
     * @param {Number} width Sets the width of the rectangle.
     * @param {Number} height Sets the height of the rectangle.
     */
    constructor(x, y, width, height) {
        _CanvasObject_x.set(this, void 0);
        _CanvasObject_y.set(this, void 0);
        _CanvasObject_width.set(this, void 0);
        _CanvasObject_height.set(this, void 0);
        _CanvasObject_orbit.set(this, 0);
        this.parent = false;
        this.rendering_canvas = false;
        this.objects = [];
        __classPrivateFieldSet(this, _CanvasObject_x, x, "f");
        __classPrivateFieldSet(this, _CanvasObject_y, y, "f");
        __classPrivateFieldSet(this, _CanvasObject_width, width, "f");
        __classPrivateFieldSet(this, _CanvasObject_height, height, "f");
    }
    /**
     *
     * @param {CanvasObject} object Add a new object.
     */
    add(object) {
        if (!object.is_of(CanvasObject))
            return console.log("The object is not a CanvasObject.");
        this.objects.push(object);
        object.insertIn(this);
    }
    /**
     *
     * @param {Canvas | CanvasObject} object The object for this to be inserted in.
     */
    insertIn(object) {
        if (!object.is_a(Canvas) && !object.is_of(CanvasObject))
            return console.log("The object is not a Canvas nor a CanvasObject.");
        this.parent = object;
    }
    /**
     *
     * @returns {Canvas | CanvasObject} The parent object of this.
     */
    get insertedIn() {
        return this.parent;
    }
    /**
     *
     * @returns {Number} The total x position of this.
     */
    get x() {
        const p = this.parent.is_of(CanvasObject) ? this.parent.x : 0;
        return __classPrivateFieldGet(this, _CanvasObject_x, "f") + p;
    }
    /**
     *
     * @returns {Number} The total y position of this.
     */
    get y() {
        const p = this.parent.is_of(CanvasObject) ? this.parent.y : 0;
        return __classPrivateFieldGet(this, _CanvasObject_y, "f") + p;
    }
    /**
     *
     * @param {Number} x Sets the x position of the object accordingly to parent.
     */
    set x(x) {
        __classPrivateFieldSet(this, _CanvasObject_x, x, "f");
    }
    /**
     *
     * @param {Number} y Sets the y position of the object accordingly to parent.
     */
    set y(y) {
        __classPrivateFieldSet(this, _CanvasObject_y, y, "f");
    }
    get width() {
        return __classPrivateFieldGet(this, _CanvasObject_width, "f");
    }
    get height() {
        return __classPrivateFieldGet(this, _CanvasObject_height, "f");
    }
    /**
     *
     * @param {Number} value Sets the width position of the object.
     */
    set width(value) {
        if (!value.is_a(Number) || Number.isNaN(value))
            return false;
        __classPrivateFieldSet(this, _CanvasObject_width, value, "f");
    }
    /**
     *
     * @param {Number} value Sets the height of the object.
     */
    set height(value) {
        if (!value.is_a(Number) || Number.isNaN(value))
            return false;
        __classPrivateFieldSet(this, _CanvasObject_height, value, "f");
    }
    /**
     *
     * @returns {Number} The raw x position of this.
     */
    get _x() {
        return __classPrivateFieldGet(this, _CanvasObject_x, "f");
    }
    /**
     *
     * @returns {Number} The raw y position of this.
     */
    get _y() {
        return __classPrivateFieldGet(this, _CanvasObject_y, "f");
    }
    set orbit(value) {
        __classPrivateFieldSet(this, _CanvasObject_orbit, value, "f");
    }
    get orbit() {
        return __classPrivateFieldGet(this, _CanvasObject_orbit, "f");
    }
    static degToRad(degrees) {
        return degrees * Math.PI / 180;
    }
    static radToDeg(radians) {
        return radians * 180 / Math.PI;
    }
}
_CanvasObject_x = new WeakMap(), _CanvasObject_y = new WeakMap(), _CanvasObject_width = new WeakMap(), _CanvasObject_height = new WeakMap(), _CanvasObject_orbit = new WeakMap();
// The Canvas.Rect constructor
Canvas.Rect = class Rect extends CanvasObject {
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
    constructor(x, y, width, height, style = { color: "#000000" }) {
        super(x, y, width, height);
        if (!style || !style.is_a(Object)) {
            style = {};
        }
        if (!style.color)
            style.color = "#000000";
        if (!style.type)
            style.type = "fill";
        style.type = style.type.toLowerCase();
        if (!["clear", "fill", "rect"].includes(style.type))
            style.type = "fill";
        this.color = style.color;
        this.type = style.type;
    }
    /** Update the object and every child
     *
     * @returns false if failed.
     */
    update() {
        if (!this.parent)
            return false;
        if (!this.rendering_canvas) {
            if (this.is_a(Canvas) || this.is_of(CanvasObject)) {
                let scanning = this.parent;
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
        let ctx = this.rendering_canvas.context;
        ctx.save();
        ctx[this.type + "Style"] = this.color;
        ctx[this.type + "Rect"](this.x, this.y, this.width, this.height);
        ctx.restore();
        for (let x in this.objects)
            this.objects[x].update();
    }
};
var _Image_imageX, _Image_imageY, _Image_imageWidth, _Image_imageHeight, _a;
Canvas.Image = (_a = class Image extends CanvasObject {
        /** Create a new Image using the parameters below.
         *
         * @param {String} src The source of the image or an Image object.
         * @param {Number} x The x-position of the image in the context.
         * @param {Number} y The y-position of the image in the context.
         * @param {Number} width The width of the image on the context.
         * @param {Number} height The height of the image on the context.
         * @param {Number} iX The image source x-position to be rendered in the context. 0 if false.
         * @param {Number} iY The image source y-position to be rendered in the context. 0 if false.
         * @param {Number} iW The image source width to be rendered in the context. Same as Image.width if false.
         * @param {Number} iH The image source height to be rendered in the context. Same as Image.height if false.
         *
         * @param iX and @param iY have no result if @param iW and @param iH are equal to the image width/height.
         */
        constructor(src, x, y, width, height, iX = false, iY = false, iW = false, iH = false) {
            super(x, y, width, height);
            _Image_imageX.set(this, void 0);
            _Image_imageY.set(this, void 0);
            _Image_imageWidth.set(this, void 0);
            _Image_imageHeight.set(this, void 0);
            this.image = src.is_a(HTMLImageElement) ? src : (function () {
                const a = new window.Image();
                a.src = src;
                return a;
            })();
            __classPrivateFieldSet(this, _Image_imageX, iX || 0, "f");
            __classPrivateFieldSet(this, _Image_imageY, iY || 0, "f");
            __classPrivateFieldSet(this, _Image_imageWidth, iW || this.image.naturalWidth, "f");
            __classPrivateFieldSet(this, _Image_imageHeight, iH || this.image.naturalHeight, "f");
        }
        /** Update the object and every child
         *
         * @returns false if failed.
         */
        update() {
            if (!this.image.complete)
                return false;
            if (!this.parent)
                return false;
            if (!this.rendering_canvas) {
                if (this.is_a(Canvas) || this.is_of(CanvasObject)) {
                    let scanning = this.parent;
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
            let ctx = this.rendering_canvas.context;
            ctx.save();
            ctx.drawImage(this.image, __classPrivateFieldGet(this, _Image_imageX, "f"), __classPrivateFieldGet(this, _Image_imageY, "f"), __classPrivateFieldGet(this, _Image_imageWidth, "f"), __classPrivateFieldGet(this, _Image_imageHeight, "f"), this.x, this.y, this.width, this.height);
            ctx.restore();
            for (let x in this.objects)
                this.objects[x].update();
        }
        /**
         *
         * @returns {Number} The rendered x position of the image source.
         */
        get imageX() {
            return __classPrivateFieldGet(this, _Image_imageX, "f");
        }
        /**
         *
         * @returns {Number} The rendered y position of the image source.
         */
        get imageY() {
            return __classPrivateFieldGet(this, _Image_imageY, "f");
        }
        set imageX(value) {
            if (isNaN(value))
                return false;
            __classPrivateFieldSet(this, _Image_imageX, value, "f");
        }
        set imageY(value) {
            if (!value.is_a(Number) || Number.isNaN(value))
                return false;
            __classPrivateFieldSet(this, _Image_imageY, value, "f");
        }
        /**
         *
         * @returns {Number} The rendered width of the image source.
         */
        get imageWidth() {
            return __classPrivateFieldGet(this, _Image_imageWidth, "f");
        }
        /**
         *
         * @returns {Number} The rendered height of the image source.
         */
        get imageHeight() {
            return __classPrivateFieldGet(this, _Image_imageHeight, "f");
        }
        set imageWidth(value) {
            if (!value.is_a(Number) || Number.isNaN(value))
                return false;
            __classPrivateFieldSet(this, _Image_imageWidth, value, "f");
        }
        set imageHeight(value) {
            if (!value.is_a(Number) || Number.isNaN(value))
                return false;
            __classPrivateFieldSet(this, _Image_imageHeight, value, "f");
        }
    },
    _Image_imageX = new WeakMap(),
    _Image_imageY = new WeakMap(),
    _Image_imageWidth = new WeakMap(),
    _Image_imageHeight = new WeakMap(),
    _a);
