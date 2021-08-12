// The Canvas constructor
class Canvas {
	// Initialize object
	constructor(ctx){
		this.objects = [];

		this.dom = document.createElement("canvas");
		this.context = this.dom.getContext(ctx);
	}

	// Set canvas DOM dimensions
	setSize(width, height){
		this.width = width;
		this.height = height;
	}

	// Clears the canvas object
	clear(x, y, width, height){
		x = x.constructor === Number ? x : 0;
		y = y.constructor === Number ? y : 0;
		width = width.constructor === Number ?
			width : this.dom.width;
		height = height.constructor === Number ?
			height : this.dom.height;
		this.context.clearRect(x, y, width, height);
	}

	// Add a new object
	add(object){
		this.objects.push(object);
		object.inserted_in(this);
	}

	// Render every object added to canvas
	render(){
		for(let x in this.objects){
			if(typeof this.objects[x] === "function")
				this.objects[x].update();
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

Canvas.Rect = class {

}