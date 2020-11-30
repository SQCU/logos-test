//drawing from  moz canvas docs at:
//https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/rotate
//https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame
console.log("we in it uh");
const canv = document.getElementById('drawzone');
const ctx = canv.getContext('2d');
const sheet = document.getElementById("hivis"); 
let canWidth = canv.width;
let canHeight = canv.height;
let start;

function Frame(img, sx, sy, swidth, sheight) {	//pulled from frotwad.js
this.img = img;
this.sx = sx;
this.sy = sy;
this.swidth = swidth;
this.sheight = sheight;
this.width = swidth; //scaling factor width
this.height = sheight; //scaling factor height
}
const schwayFrame = new Frame(sheet, 32, 64, 32, 32);

function draw(frame, xpos, ypos) { //pass frame data.
ctx.drawImage(frame.img, frame.sx, frame.sy, frame.swidth, frame.sheight, xpos, ypos, frame.swidth, frame.sheight);
//console.log("drawn at "+xpos+","+ypos+".");
}

function step(timestamp)	{
	if(start === undefined)
		start = timestamp;
	const elapsed = timestamp - start;
	canv.width = canv.offsetWidth;
	canv.height = canv.offsetHeight;
	
	const canWidth = canv.width;
	const canHeight = canv.height;
	const center = [Math.floor(canWidth/2), Math.floor(canHeight/2)];	//why arrays? I thought I had a matrix-add in the standard library.  Actually math and Math are two different libraries, silly me!
	var displacement = Math.ceil(canWidth/8);
	
	let theta = elapsed/500;
	let finna = elapsed/1300*Math.log(elapsed/1300);
	//1 revolution every 4? seconds.
	//nlogn is funnier than any other numerical progression, look it up, it's the bedrock of comp complexity theory.
	target = [displacement*Math.cos(theta), displacement*Math.sin(theta)];
	
	ctx.translate(center[0], center[1]);	//translate origin to center canvas
	draw(schwayFrame, -schwayFrame.width/2, -schwayFrame.height/2);	//draw mark, centered, to canvas
	ctx.translate(target[0], target[1]);	//translate origin to orbit
	ctx.rotate(finna);	//rotate origin about orbit
	draw(schwayFrame, -schwayFrame.width/2, -schwayFrame.height/2);	//draw rotated mark to orbit
	ctx.rotate(-finna);	//reverse rotation
	ctx.translate(-target[0], -target[1]);	//reverse translation to orbit
	ctx.translate(-center[0], -center[1]);	//reverse translation to center


	ctx.setTransform(1, 0, 0, 1, 0, 0);		//JUST IN CASE, reset transformation matrix for context.
	
	window.requestAnimationFrame(step);		//next frame call
}

//first invocation of reqanifra callback
window.requestAnimationFrame(step);
