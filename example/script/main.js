'use strict';

const canvas = new Canvas();
canvas.setSize(1280,720);
document.body.appendChild(canvas.dom);

const rect = new Canvas.Rect(10,10,10,10);
canvas.add(rect);
canvas.render();

function animate(ts){
	rect.x = ts / 100;
}
function update(ts){
	canvas.clear();
	animate(ts);
	canvas.render();
	game_update = requestAnimationFrame(update);
}
let game_update = requestAnimationFrame(update);

window.addEventListener("error", e => {
	cancelAnimationFrame(game_update);
});