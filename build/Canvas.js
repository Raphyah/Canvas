// Get every ancestor of the current prototype.
Object.defineProperty(Object.prototype, "ancestors", {
    /**
     *
     * @returns An array with every descendant of this object.
     */
    get() {
        const arr = [];
        let p = this;
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
// The CanvasObject constructor
class CanvasObject {
    #x;
    #y;
    #width;
    #height;
    #orbit = 0;
    /** Create a new CanvasObject with the parameters bellow.
     *
     * @param {Number} x Sets the position x of the object in context to the Canvas origin/parent object.
     * @param {Number} y Sets the position y of the object in context to the Canvas origin/parent object.
     * @param {Number} width Sets the width of the rectangle.
     * @param {Number} height Sets the height of the rectangle.
     */
    constructor(x, y, width, height, style = {}) {
        this.parent = false;
        this.rendering_canvas = false;
        this.objects = [];
        this.#x = x;
        this.#y = y;
        this.#width = width;
        this.#height = height;
        if (!style || !style.is_a(Object)) {
            style = {};
        }
        if (!style.color)
            style.color = "#000000";
        if (!style.alpha)
            style.alpha = false;
        if (!style.type)
            style.type = "fill";
        style.type = style.type.toLowerCase();
        if (!["fill", "stroke"].includes(style.type))
            style.type = "fill";
        this.color = style.color;
        this.alpha = style.alpha.is_of(Number) ? style.alpha : false;
        this.type = style.type;
    }
    fetchCanvas() {
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
     * @param {CanvasObject} obj
     */
    remove(obj) {
        const index = this.objects.indexOf(obj);
        if (index)
            this.objects.splice(obj);
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
    prepare() {
        const ctx = this.rendering_canvas.context;
        ctx[this.type + "Style"] = this.color;
        const tx = this.parent.x + this.parent.width / 2;
        const ty = this.parent.y + this.parent.height / 2;
        ctx.translate(tx, ty);
        ctx.rotate(this.orbit);
        ctx.translate(-tx, -ty);
        if (this.alpha.is_of(Number))
            ctx.globalAlpha = this.alpha;
    }
    updateChild() {
        for (let x in this.objects)
            this.objects[x].update();
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
        return this.#x + p;
    }
    /**
     *
     * @returns {Number} The total y position of this.
     */
    get y() {
        const p = this.parent.is_of(CanvasObject) ? this.parent.y : 0;
        return this.#y + p;
    }
    /**
     *
     * @returns {Number} The object x position after orbit.
     */
    get rotOffX() {
        const a = this.orbit === 0 ? 0 : Math.cos(CanvasObject.degToRad(this.orbit));
        const o = a * (this.x - this.y);
        return o;
    }
    /**
     *
     * @returns {Number} The object y position after orbit.
     */
    get rotOffY() {
        const o = Math.sin(CanvasObject.degToRad(this.orbit)) * (this.y - this.x);
        return o;
    }
    /**
     *
     * @param {Number} x Sets the x position of the object accordingly to parent.
     */
    set x(x) {
        this.#x = x;
    }
    /**
     *
     * @param {Number} y Sets the y position of the object accordingly to parent.
     */
    set y(y) {
        this.#y = y;
    }
    /**
     * @returns {Number} Gets the width of the object.
     */
    get width() {
        return this.#width;
    }
    /**
     * @returns {Number} Gets the height of the object.
     */
    get height() {
        return this.#height;
    }
    /**
     *
     * @param {Number} value Sets the width position of the object.
     */
    set width(value) {
        if (isNaN(+value))
            return console.warn("CanvasObject.width() value is not a Number.");
        this.#width = value;
    }
    /**
     *
     * @param {Number} value Sets the height of the object.
     */
    set height(value) {
        if (isNaN(+value))
            return console.warn("CanvasObject.height() value is not a Number.");
        this.#height = value;
    }
    /**
     *
     * @returns {Number} The raw x position of this.
     */
    get _x() {
        return this.#x;
    }
    /**
     *
     * @returns {Number} The raw y position of this.
     */
    get _y() {
        return this.#y;
    }
    /**
     * @param value {Number} Sets the orbit value for the object in radians.
     */
    set orbit(value) {
        this.#orbit = value;
    }
    /**
     * @returns {Number} Gets the orbit value in radians.
     */
    get orbit() {
        return this.#orbit;
    }
    /**
     *
     * @param {Number} degrees The value in degrees.
     * @returns {Number} Converted value in radians.
     */
    static degToRad(degrees) {
        return degrees * Math.PI / 180;
    }
    /**
     *
     * @param {Number} radians The value in radians.
     * @returns {Number} Converted value in degrees.
     */
    static radToDeg(radians) {
        return radians * 180 / Math.PI;
    }
}
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
        if (!object.is_of(CanvasObject) && !object.is_a(Canvas))
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
        if (isNaN(+value))
            return console.warn("width() value is not a Number.");
        this.dom.width = value;
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
        if (isNaN(+value))
            return console.warn("height() value is not a Number.");
        this.dom.height = value;
    }
}
Canvas.Rect = class Rect extends CanvasObject {
    /** Create a new Rect using the parameters below.
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
    constructor(x, y, width, height, style = {}) {
        super(x, y, width, height, style);
    }
    /** Update the object and every child.
     *
     * @returns false if failed.
     */
    update() {
        this.fetchCanvas();
        if (!this.rendering_canvas.is_a(Canvas))
            return;
        let ctx = this.rendering_canvas.context;
        ctx.save();
        this.prepare();
        ctx[this.type + "Rect"](this.x + (this.parent.rotOffX ? this.parent.rotOffX : 0), this.y + (this.parent.rotOffY ? this.parent.rotOffY : 0), this.width, this.height);
        ctx.restore();
        this.updateChild();
    }
};
Canvas.Image = class Image extends CanvasObject {
    #imageX;
    #imageY;
    #imageWidth;
    #imageHeight;
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
    constructor(src, x, y, width, height, iX = false, iY = false, iW = false, iH = false, style = {}) {
        super(x, y, width, height, style);
        this.image = src.is_a(HTMLImageElement) ? src : (function () {
            const a = new window.Image();
            a.src = src;
            return a;
        })();
        this.#imageX = iX || 0;
        this.#imageY = iY || 0;
        this.#imageWidth = iW || this.image.naturalWidth;
        this.#imageHeight = iH || this.image.naturalHeight;
    }
    /** Update the object and every child.
     *
     * @returns false if failed.
     */
    update() {
        this.fetchCanvas();
        let ctx = this.rendering_canvas.context;
        ctx.save();
        this.prepare();
        ctx.drawImage(this.image, this.#imageX, this.#imageY, this.#imageWidth, this.#imageHeight, this.x, this.y, this.width, this.height);
        ctx.restore();
        this.updateChild();
    }
    /**
     *
     * @returns {Number} The rendered x position of the image source.
     */
    get imageX() {
        return this.#imageX;
    }
    /**
     *
     * @returns {Number} The rendered y position of the image source.
     */
    get imageY() {
        return this.#imageY;
    }
    /**
     *
     * @param value {Number} Sets the x position of the image source to render.
     */
    set imageX(value) {
        if (isNaN(+value))
            return false;
        this.#imageX = value;
    }
    /**
     *
     * @param value {Number} Sets the y position of the image source to render.
     */
    set imageY(value) {
        if (isNaN(+value))
            return false;
        this.#imageY = value;
    }
    /**
     *
     * @returns {Number} The rendered width of the image source.
     */
    get imageWidth() {
        return this.#imageWidth;
    }
    /**
     *
     * @returns {Number} The rendered height of the image source.
     */
    get imageHeight() {
        return this.#imageHeight;
    }
    /**
     *
     * @param value {Number} Sets the y width of the image source to render.
     */
    set imageWidth(value) {
        if (isNaN(+value))
            return false;
        this.#imageWidth = value;
    }
    /**
     *
     * @param value {Number} Sets the y height of the image source to render.
     */
    set imageHeight(value) {
        if (isNaN(+value))
            return false;
        this.#imageHeight = value;
    }
};
Canvas.Arc = class Arc extends CanvasObject {
    #radius;
    #start;
    #end;
    /** Create a new Arc using the parameters below.
     *
     * @param {Number} x Sets the position x of the object in context to the Canvas origin.
     * @param {Number} y Sets the position y of the object in context to the Canvas origin.
     * @param {Number} radius Sets the radius of the circle (width and height divided by 2).
     * @param {Number} start Sets the start position of the arc in radians.
     * @param {Number} end Sets the end position of the arc in radians.
     * @param {Object} style Add styles to Rect.
     * @param {String} style.type Defines the type of Rect (fill or stroke).
     * @param {String} style.color Defines the color of the Rect.
     *
     */
    constructor(x, y, radius, start, end, style = {}) {
        radius = Math.abs(radius);
        super(x, y, radius * 2, radius * 2, style);
        this.#radius = radius;
        this.#start = start;
        this.#end = end;
    }
    /** Update the object and every child.
     *
     * @returns false if failed.
     */
    update() {
        this.fetchCanvas();
        if (!this.rendering_canvas.is_a(Canvas))
            return;
        let ctx = this.rendering_canvas.context;
        ctx.save();
        this.prepare();
        ctx.beginPath();
        ctx.arc(this.x + (this.parent.rotOffX ? this.parent.rotOffX : 0) + this.radius, this.y + (this.parent.rotOffY ? this.parent.rotOffY : 0) + this.radius, this.radius, this.start, this.end);
        ctx[this.type]();
        ctx.restore();
        this.updateChild();
    }
    /**
     *
     * @param value {Number} Sets the radius of the arc.
     */
    set radius(value) {
        value = Math.abs(value);
        this.width = value * 2;
        this.height = value * 2;
        this.#radius = value;
    }
    /**
     *
     * @returns {Number} Gets the radius of the arc.
     */
    get radius() {
        return this.#radius;
    }
    /**
     *
     * @param value {Number} Sets the start of the arc in radians.
     */
    set start(value) {
        this.#start = value;
    }
    /**
     *
     * @returns {Number} Returns the value of the arc start in radians.
     */
    get start() {
        return this.#start;
    }
    /**
     *
     * @param value {Number} Sets the end of the arc in radians.
     */
    set end(value) {
        this.#end = value;
    }
    /**
     *
     * @returns {Number} Returns the value of the arc end in radians.
     */
    get end() {
        return this.#end;
    }
};
