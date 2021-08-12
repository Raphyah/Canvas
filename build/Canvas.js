class Canvas {
	constructor(ctx){
		this.objects = [];

		this.dom = document.createElement("canvas");
		this.context = this.dom.getContext(ctx);
	}

	setSize(width, height){
		this.dom.width = width;
		this.dom.height = height;
	}

	clear(x, y, width, height){
		x = x.constructor === Number ? x : 0;
		y = y.constructor === Number ? y : 0;
		width = width.constructor === Number ?
			width : this.dom.width;
		height = height.constructor === Number ?
			height : this.dom.height;
		this.context.clearRect(x, y, width, height);
	}

	add(object){
		this.objects.push(object);
		object.inserted_in(this);
	}

	render(){
		for(let x in this.objects){
			if(typeof this.objects[x] === "function")
				this.objects[x].update();
		}
	}

	get width(){
		return this.dom.width;
	}
	
	get height(){
		return this.dom.height;
	}
}