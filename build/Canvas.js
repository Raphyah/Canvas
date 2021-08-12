Object.defineProperty(Object.prototype,"ancestors",{
	get(){
		const arr=[];
		let p=this.constructor.prototype;
		while(true){
			if(!p)break;
			arr.push(p.constructor);
			p=Object.getPrototypeOf(p);
		}
		return arr;
	}
});
Object.defineProperty(Object.prototype,"is_a",{
	value(obj){
		return this.ancestors.include(obj);
	}
});
Object.defineProperty(Array.prototype,"include",{
	value(obj){
		for(let x in this)
			if(this[x] === obj)
				return true;
		return false;
	}
});

// The Canvas constructor
class Canvas {
	// Initialize object
	/**
	 * 
	 * @param {String} ctx Sets the context type.
	 */
	constructor(ctx = "2d"){
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
	setSize(width, height){
		this.width = width;
		this.height = height;
	}

	// Clears the canvas object
	/**
	 * 
	 * @param {Number} x Sets the initial cleaning position x. (default: 0)
	 * @param {Number} y Sets the initial cleaning position y. (default: 0)
	 * @param {Number} width Sets the cleaning area witdh. (default: this.canvas.width)
	 * @param {Number} height Sets the cleaning area height. (default: this.canvas.height)
	 */
	clear(x = false, y = false, width = false, height = false){
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
	 * @param {CanvasObject} object 
	 */
	add(object){
		if(!object.is_a(CanvasObject))return console.log("The object is not a CanvasObject.");
		this.objects.push(object);
		object.insertIn(this);

		console.log(this.objects);
	}

	// Render every object added to canvas
	render(){
		for(let x in this.objects){
			if(this.objects[x].is_a(CanvasObject)){
				this.objects[x].update();
			}
		}
	}

	// Getter for canvas width
	get width(){
		return this.dom.width;
	}

	// Setter for canvas width
	set width(value){
		if(value.constructor === Number)
			this.dom.width = value;
		else
			console.warn("width() value is not a Number.");
	}
	
	// Getter for canvas height
	get height(){
		return this.dom.height;
	}

	// Setter for canvas height
	set height(value){
		if(value.constructor === Number)
			this.dom.height = value;
		else
			console.warn("height() value is not a Number.");
	}
}

class CanvasObject {
	#x;
	#y;

	// Create a new CanvasObject in the specified position and width.
	/**
	 * 
	 * @param {Number} x Sets the position x of the object in context to the Canvas origin.
	 * @param {Number} y Sets the position y of the object in context to the Canvas origin.
	 * @param {Number} width Sets the width of the rectangle.
	 * @param {Number} height Sets the height of the rectangle.
	 */
	constructor(x, y, width, height){
		this.parent=false;
		
		this.rendering_canvas=false;
		
		this.objects=[];

		this.#x = x;
		this.#y = y;
		this.width = width;
		this.height = height;
	}
	
	// Add a new object
	/**
	 * 
	 * @param {CanvasObject} object 
	 */
	 add(object){
		this.objects.push(object);
		object.insertIn(this);
	}

	/**
	 * 
	 * @param {Canvas | CanvasObject} object The object to be inserted in.
	 */
	insertIn(object){
		if(!object.is_a(Canvas) && !object.is_a(CanvasObject))
			return console.log("Not a CanvasObject.");
		this.parent=object;
	}
	get insertedIn(){
		return this.parent;
	}

	get x(){
		const p=this.parent.is_a(Canvas.Rect)?this.parent.x:0;
		return this.#x+p;
	}

	get y(){
		const p=this.parent.is_a(Canvas.Rect)?this.parent.y:0;
		return this.#y+p;
	}

	/**
	 * 
	 * @param {Number} x Sets the x position of the object.
	 */
	set x(x){
		this.#x=x;
	}

	/**
	 * 
	 * @param {Number} y Sets the y position of the object.
	 */
	set y(y){
		this.#y=y;
	}

	get _x(){
		return this.#x;
	}

	get _y(){
		return this.#y;
	}
}

Canvas.Rect = class extends CanvasObject {
	// Initialize object

	// Create a new Rect using the parameters below
	/**
	 * 
	 * @param {Number} x Sets the position x of the object in context to the Canvas origin.
	 * @param {Number} y Sets the position y of the object in context to the Canvas origin.
	 * @param {Number} width Sets the width of the rectangle.
	 * @param {Number} height Sets the height of the rectangle.
	 */
	constructor(x, y, width, height){
		super(x, y, width, height);
	}

	// Update the object and every child
	update(){
		if ( !this.parent )return false;
		if ( !this.rendering_canvas ){
			if ( this.is_a(Canvas) || this.is_a(CanvasObject) ){
				let scanning=this.parent;
				while(true){
					//console.log(scanning);
					if(scanning.is_a(Canvas)){
						this.rendering_canvas=scanning;
						//console.log("Rendering canvas set");
						break;
					}else
					if(!scanning.parent){
						break;
					}
					scanning=scanning.parent;
				}
			}
		}
		if(!this.rendering_canvas)return false;
		
		let ctx=this.rendering_canvas.context;
		
		ctx.save();

		ctx["fill"+"Rect"](this.x,this.y,this.width,this.height);

		ctx.restore();

		for(let x in this.objects)this.objects[x].update();
	}	
}