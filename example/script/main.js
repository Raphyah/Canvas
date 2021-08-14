'use strict';

window.addEventListener("error", e => {
	cancelAnimationFrame(game_update);
});

const keyEvent = {
	keydown: {}
};

window.addEventListener("keydown",     e => {
	if (e.key !== undefined) {
		keyEvent.keydown[e.key] = true;
	} else if (e.keyIdentifier !== undefined) {
		keyEvent.keydown[e.keyIdentifier] = true;
	} else if (e.keyCode !== undefined) {
		keyEvent.keydown[e.keyCode] = true;
	}
	// console.log(this.keyEvent);
});
window.addEventListener("keyup",       e => {
	if (e.key !== undefined) {
		keyEvent.keydown[e.key] = !true;
	} else if (e.keyIdentifier !== undefined) {
		keyEvent.keydown[e.keyIdentifier] = !true;
	} else if (e.keyCode !== undefined) {
		keyEvent.keydown[e.keyCode] = !true;
	}
	// console.log(this.keyEvent);
});
/* this.dom.addEventListener("mousedown", e => {
	// e.buttons
	this.mouseEvent["left"] = true;
	this.mouseEvent["right"] = true;
	this.mouseEvent["wheel"] = true;
	console.log(e.button, e.buttons);
});
this.dom.addEventListener("mouseup",   e => {
	// e.buttons
	this.mouseEvent["left"] = false;
	this.mouseEvent["right"] = false;
	this.mouseEvent["wheel"] = false;
});
this.dom.addEventListener("mousemove", e => {
	this.mouseEvent["position"] = [ e.offsetX, e.offsetY ];
});
this.dom.addEventListener("touchstart",e => {
	
});
this.dom.addEventListener("touchend",  e => {
	
});
this.dom.addEventListener("touchmove", e => {
	
});
this.dom.addEventListener("wheel",     e => {
	
}); */

const canvas = new Canvas();
canvas.setSize(1280,720);
document.body.appendChild(canvas.dom);

const rect = new Canvas.Rect(10,10,10,10);
canvas.add(rect);

const walker1 = new Image().src = "./image/walker3.png";

const walkers = [
	new Canvas.Image(walker1,0,0,64,64,0,0,64,64),
	new Canvas.Image("./image/walker2.png",0,64,64,64,0,0,64,64),
	new Canvas.Image("./image/walker3.png",0,64*2,64,64,0,0,64,64)
]

for(let x of walkers){
	canvas.add(x);
}

canvas.render();

const stats = new Stats();
document.body.appendChild( stats.dom );

const objects_in_canvas = new Stats.Panel("Custom","#fff","#000");
stats.addPanel(objects_in_canvas);

function animate(ts){
	objects_in_canvas.update(canvas.objects.length,100);
	// walkers.push(new Canvas.Image(`./image/walker${(walkers.length % 3)+1}.png`,0,64*walkers.length-1,64,64,0,0,64,64));
	// canvas.add(walkers[walkers.length-1])
	for(let x of walkers){
		x.imageX = 64 * ( ( x.imageX / 64 + 1) % ( x.image.naturalWidth / x.imageWidth ) );
		if(keyEvent.keydown["w"]){
			x.imageY = 64 * 4;
			x.y -= 1;
		}else
		if(keyEvent.keydown["s"]){
			x.imageY = 64 * 0;
			x.y += 1;
		}else
		if(keyEvent.keydown["a"]){
			x.imageY = 64 * 6;
			x.x -= 1;
		}else
		if(keyEvent.keydown["d"]){
			x.imageY = 64 * 2;
			x.x += 1;
		} else {
			x.imageX = 64 * 10;
		}
	}
}
function update(ts){
	stats.begin();

	canvas.clear();
	animate(ts);
	canvas.render();

	stats.end();

	game_update = requestAnimationFrame(update);
}
var game_update = requestAnimationFrame(update);