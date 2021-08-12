window.addEventListener("error", e => {
	cancelAnimationFrame(game_update);
});

const canvas = new Canvas();
canvas.setSize(1280,720);

function update(){
	game_update = requestAnimationFrame(update);
}
let game_update = requestAnimationFrame(update);