class Canvas {
	constructor(ctx){
		this.dom = document.createElement("canvas");
		this.context = this.dom.getContext(ctx);
	}
}