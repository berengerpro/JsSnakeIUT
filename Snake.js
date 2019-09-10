

class Map {
	
	constructor(tailleX, tailleY, ctx, fruit, murs) {
		this.tailleX = tailleX;
		this.tailleY = tailleY;
		this.fruit = fruit;
		this.ctx = ctx;
		this.murs = murs;

		ctx.strokeRect(49, 49, tailleX * 20 + 2, tailleY * 20 + 2);

		this.ctx.fillStyle = "blue";
		ctx.fillRect(50 + fruit[0] * 20, 50 + fruit[1] * 20, 20, 20);

		ctx.fillStyle = "red";
		for(var m in murs)
		{
			ctx.fillRect(50 + murs[m][0] * 20, 50 + murs[m][1] * 20, 20, 20);
		}
		ctx.fillStyle = "black";
	}
	
	refresh() {
		this.fruit = [Math.floor(Math.random() * Math.floor(this.tailleX - 1)) + 1, Math.floor(Math.random() * Math.floor(this.tailleY - 1)) + 1];
		this.ctx.fillStyle = "blue";
		this.ctx.fillRect(50 + this.fruit[0] * 20, 50 + this.fruit[1] * 20, 20, 20);
		this.ctx.fillStyle = "black";
	}

	getlimX() {
		return this.tailleX;
	}

	getlimY() {
		return this.tailleY;
	}

	getFruit() {
		return this.fruit;
	}

	getMurs() {
		return this.murs;
	}
}

class Bloc {
	
	constructor(ctx, position){
		this.position = position;
		this.ctx = ctx;
		
		ctx.fillRect(50 + this.position[0] * 20, 50 + this.position[1] * 20, 20, 20);
	}
	
	destroy() {
		ctx.clearRect(50 + this.position[0] * 20, 50 + this.position[1] * 20, 20, 20);
	}
	
	getPosition() {
		return this.position;
	}
}

class Joueur {
	
	constructor(ctx, map) {
		this.ctx = ctx;
		this.map = map;
		this.score = 0;
		score.textContent = "Score : "+ this.score;
		this.classique = true;
		this.direction = [1, 0];
		this.firstPosition = [1,1];
		this.limX = map.getlimX();
		this.limY = map.getlimY();
		this.blocs = new Queue();
		this.blocs.enqueue(new Bloc(ctx,[1,1]));
	}
 
	refresh() {
		if(this.classique)
		{
			var last = this.blocs.dequeue();
			last.destroy();
		} else {
			this.classique = true;
		}
		if(this.firstPosition[0] + this.direction[0] < 0 || this.firstPosition[0] + this.direction[0] >= this.limX 
			|| this.firstPosition[1] - this.direction[1] < 0 || this.firstPosition[1] - this.direction[1] >= this.limY) {
				this.defaite();
		}

		var murs = this.map.getMurs();
		var collision = false;

		for(var m in murs)
		{
			collision = collision || (murs[m][0] == this.firstPosition[0] + this.direction[0] && murs[m][1] == this.firstPosition[1] - this.direction[1]);
		}
		
		if(collision){
			this.defaite();
		}

		var nvBloc = new Bloc(ctx, [this.firstPosition[0] + this.direction[0], 
									this.firstPosition[1] - this.direction[1]]);

		this.firstPosition = nvBloc.getPosition();
		this.blocs.enqueue(nvBloc);

		if(this.firstPosition[0] == map.getFruit()[0] && this.firstPosition[1] == map.getFruit()[1]) {
			
			this.score+=10;
			score.textContent = "Score : "+ this.score;
			this.ajoutBloc();
			this.map.refresh();
		}

		if(this.blocs.checkAutoCollision())
			this.defaite();

	}
	
	ajoutBloc(){
		this.classique = false;
	}

	setDirection(direction) {
		this.direction = direction;
	}

	getDirection() {
		return this.direction;
	}

	defaite() {
		while(!this.blocs.isEmpty())
			{
				var element = this.blocs.dequeue();
				element.destroy();
			}
		alert("Vous avez perdu !\n\nScore de "+this.score+" points");
		retourAccueil();
	}
}

var divcanvas ;
var canvas;
var map;
var ctx;
var joueur;
var divbouton;
var divscore;
var score;
var intervalid;
var nbNiveau = 3;

function createCanvas(){
	divcanvas = document.createElement("div");
	divcanvas.setAttribute("class","w3-center");
	canvas = document.createElement("canvas");
	divcanvas.appendChild(canvas);
}

function createButtons(){
	divbouton = document.createElement("div");
	var i;
	for(i = 0; i < nbNiveau; i++){
		var b = document.createElement("input");
		var div = document.createElement("div");
		div.setAttribute("class","w3-center");
		b.setAttribute("type","button");
		b.setAttribute("value","Niveau"+(i+1));
		b.setAttribute("onclick","lancerJeu('niv"+(i+1)+"')");
		b.setAttribute("class","w3-button w3-white w3-border w3-border-green");
		div.appendChild(b);
		divbouton.appendChild(div);
	}

}

function createText(){
	var div = document.createElement("div");
	div.setAttribute("class","w3-center");
	var snake = document.createElement("h2");
	snake.appendChild(document.createTextNode("Snake Game"));
	div.appendChild(snake);
	divscore = document.createElement("div");
	divscore.setAttribute("class","w3-center");
	score = document.createElement("h4");
	divscore.appendChild(score);
	document.body.appendChild(div);
	

}

window.onload = initDom;

function initDom(){
	createCanvas();
	createButtons();
	createText();
	document.body.appendChild(divbouton);
}

function lancerJeu(niveau) {
	document.body.appendChild(divscore);
	document.body.appendChild(divcanvas);
	document.body.removeChild(divbouton);

	var req = new XMLHttpRequest();
	console.log("iutdoua-web.univ-lyon1.fr/~p1702174/jvs/Snake/niveaux/"+niveau+".json");
	req.open("GET", "https://iutdoua-web.univ-lyon1.fr/~p1702174/jvs/Snake/niveaux/"+niveau+".json");
	req.onerror = function() {
		console.log("Échec de chargement ");
	};
	req.onload = function() {
		if (req.status === 200) {
			var data = JSON.parse(req.responseText);
			var dim = data['dimensions'];
			var fruit = data['fruit'][0];
			var delay = data['delay'];
			var murs = data['walls'];
			initSnake(dim, fruit, delay, murs);
		} else {
			console.log("Erreur " + req.status);
		}
	};
	req.send();
}

function initSnake(dim, fruit, delay, murs){
	canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
	if (canvas.getContext) {
		ctx = canvas.getContext('2d');
		map = new Map(dim[0], dim[1], ctx, fruit, murs);
		joueur = new Joueur(ctx, map);

		document.addEventListener('keydown', (event) => {
			const nomTouche = event.key;
			switch(nomTouche)
			{
				case 'ArrowLeft':
					if(!(joueur.getDirection()[0] == 1 && joueur.getDirection()[1] == 0))
						joueur.setDirection([-1, 0]);
				break;
				case 'ArrowRight':
					if(!(joueur.getDirection()[0] == -1 && joueur.getDirection()[1] == 0))
						joueur.setDirection([1, 0]);
				break;
				case 'ArrowUp':
					if(!(joueur.getDirection()[0] == 0 && joueur.getDirection()[1] == -1))
						joueur.setDirection([0, 1]);
				break;
				case 'ArrowDown':
					if(!(joueur.getDirection()[0] == 0 && joueur.getDirection()[1] == 1))
						joueur.setDirection([0, -1]);
				break;
			}
		  });

		intervalid = setInterval(function(){joueur.refresh();}, delay);
	} else {
		console.log("Le naviguateur ne supporte pas la technologie utilisée...");
	}
}

function retourAccueil(){
	document.body.removeChild(divcanvas);
	document.body.removeChild(divscore);
	document.body.appendChild(divbouton);
	window.clearInterval(intervalid);

}