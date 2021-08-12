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
		x = x || 0;
		y = y || 0;
		width = width || this.dom.width;
		height = height || this.dom.height;
		this.context.clearRect(x, y, width, height);
	}
}