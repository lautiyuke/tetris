const TAMAÑO_BLOQUE = 30;
const ANCHO = 10;
const ALTO = 20;

const piezas = [
	{
		id: 1,
		posision: {x: 8, y: 0},
		shape: [
			[1, 1],
			[1, 1],
		],
		color: "#0dc2ff",
	},
	{
		id: 2,
		posision: {x: 0, y: 0},
		shape: [
			[1, 0],
			[1, 0],
			[1, 1],
		],
		color: "#f538ff",
	},
	{
		id: 3,
		posision: {x: 0, y: 0},
		shape: [
			[0, 1, 0],
			[1, 1, 1],
		],
		color: "#ff0d72",
	},
	{
		id: 4,
		posision: {x: 0, y: 0},
		shape: [
			[0, 1],
			[0, 1],
			[1, 1],
		],
		color: "#ff8e0d",
	},
	{
		id: 5,
		posision: {x: 0, y: 0},
		shape: [[1], [1], [1], [1]],
		color: "#0dff72",
	},
	{
		id: 6,
		posision: {x: 0, y: 0},
		shape: [
			[1, 1, 0],
			[0, 1, 1],
		],
		color: "#3877ff",
	},
	{
		id: 7,
		posision: {x: 0, y: 0},
		shape: [
			[0, 1, 1],
			[1, 1, 0],
		],
		color: "#0dff72",
	},
];

const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");
const puntos = document.getElementsByClassName("puntos");
let puntaje = 0;
let tablero = [];
let bajando = false;

canvas.width = TAMAÑO_BLOQUE * ANCHO;
canvas.height = TAMAÑO_BLOQUE * ALTO;
context.scale(TAMAÑO_BLOQUE, TAMAÑO_BLOQUE);

function crearTablero() {
	for (let i = 0; i < ALTO; i++) {
		let columna = [];
		for (let x = 0; x < ANCHO; x++) {
			columna.push(0);
		}
		tablero.push(columna);
	}
}

function proxPieza() {
	pieza = piezas[Math.floor(Math.random() * piezas.length)];
	pieza.posision.x = Math.floor(ANCHO / 2);
	pieza.posision.y = 0;
	if (verColision()) {
		perdiste();
	}
}

function actualizar(context) {
	dibujar();
	window.requestAnimationFrame(actualizar);
}

function dibujar() {
	context.fillStyle = "black";
	context.fillRect(0, 0, canvas.width, canvas.height);
	tablero.forEach((row, y) => {
		row.forEach((value, x) => {
			if (value != 0) {
				context.fillStyle = piezas[value - 1].color;
				context.fillRect(x, y, 1, 1);
			}
		});
	});

	pieza.shape.forEach((row, y) => {
		row.forEach((value, x) => {
			if (value === 1) {
				context.fillStyle = pieza.color;
				context.fillRect(x + pieza.posision.x, y + pieza.posision.y, 1, 1);
			}
		});
	});
}

function verColision() {
	return pieza.shape.find((row, y) => {
		return row.find((value, x) => {
			return (
				value == 1 && tablero[y + pieza.posision.y]?.[x + pieza.posision.x] != 0
			);
		});
	});
}

function endurecer() {
	pieza.shape.forEach((row, y) => {
		row.forEach((value, x) => {
			if (value === 1) {
				tablero[y + pieza.posision.y][x + pieza.posision.x] = pieza.id;
			}
		});
	});
}

function eliminarFilas() {
	tablero.forEach((row, y) => {
		if (row.every((element) => element != 0)) {
			tablero.splice(y, 1);
			const ceroArray = Array.apply(null, Array(ANCHO)).map(() => 0);
			tablero.unshift(ceroArray);
			puntaje += 100;
			puntos[0].innerText = puntaje;
			puntos[1].innerTExt = puntaje;
		}
	});
}

function LEFT() {
	pieza.posision.x--;
	if (verColision()) {
		pieza.posision.x++;
	}
}

function RIGHT() {
	pieza.posision.x++;
	if (verColision()) {
		pieza.posision.x--;
	}
}

function UP() {
	const anteriorPieza = pieza.shape;
	let vuelta = [];
	for (let i = 0; i < pieza.shape[0].length; i++) {
		let fila = [];
		for (let x = pieza.shape.length - 1; x >= 0; x--) {
			fila.push(pieza.shape[x][i]);
		}
		vuelta.push(fila);
	}
	pieza.shape = vuelta;
	if (verColision()) {
		pieza.shape = anteriorPieza;
	}
}

function DOWN() {
	pieza.posision.y++;
	if (verColision()) {
		pieza.posision.y--;
		endurecer();
		bajando = false;
		eliminarFilas();
		proxPieza();
	}
}

function perdiste() {
	const gameContainer = document.getElementById("gameContainer");
	gameContainer.style.display = "none";

	const perdiste = document.getElementById("perdiste");
	perdiste.style.display = "flex";
	perdiste.addEventListener("click", () => {
		location.reload();
	});
}

document.addEventListener("keydown", (event) => {
	switch (event.keyCode) {
		case 37:
			LEFT();
			break;
		case 39:
			RIGHT();
			break;
		case 38:
			UP();
			break;
		case 40:
			DOWN();
			break;
		case 32:
			bajando = true;
			while (bajando) {
				DOWN();
			}
			break;
		default:
			break;
	}
});

crearTablero();
let pieza = piezas[0];
let interval = setInterval(DOWN, 1000);
actualizar();
