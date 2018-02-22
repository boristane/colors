let colors = [];
let currentColor = "";
let colorCount = 0;

document.addEventListener("DOMContentLoaded", function(){
	
	let UI = {
		color: document.getElementById("color"),
		body: document.querySelector("body"),
		previous: document.getElementById("previous-btn"),
		footer: document.querySelector("footer"),
		logo: document.querySelector(".logo"),
		shades: document.querySelectorAll(".shade"),
		shadesContainer: document.querySelector(".sub"),
		shadesBtn: document.getElementById("shades-btn"),
		copyTextArea: document.getElementById("copy-text-area")
	};
	
	enter();
	
	UI.footer.addEventListener("click", (e) => {
		e.stopPropagation();
	});
	UI.logo.addEventListener("click", (e) => {
		e.stopPropagation();
	});
	
	function enter(){
		currentColor = generateColor();
		addColor(currentColor);
		changeBackgroundColor(currentColor);
		randomiseStringInDiv(UI.color);
	}
	
	UI.body.addEventListener("click", (e) => {
		e.preventDefault();
		UI.shadesContainer.style.display = "none";
		currentColor = generateColor();
		addColor(currentColor);
		changeBackgroundColor(currentColor);
		randomiseStringInDiv(UI.color);
	});
	
	UI.shadesBtn.addEventListener("click", (e) => {
		e.preventDefault();
		e.stopPropagation();
		applyColorShades();
		fadeIn(UI.shadesContainer)

		for(let i = 0; i < UI.shades.length; i++){
			let shade = UI.shades[i];
			randomiseStringInDiv(shade);
		}
	});

	for(let i = 0; i < UI.shades.length; i++){
		let shade = UI.shades[i];
		shade.addEventListener("mouseover", (e) => {
			e.stopPropagation();
			shade.style.fontSize = "2.1em";
		});
		shade.addEventListener("mouseout", (e) => {
			e.stopPropagation();
			shade.style.fontSize = "2.0em";
		});
		shade.addEventListener("click", (e) => {
			e.stopPropagation();
			e.preventDefault();
			popOut(shade, "2.1em", "2.3em", 0.1);
			copyDivToClipboard(shade);
		});
	}

	UI.color.addEventListener("click", (e) => {
		e.preventDefault();
		e.stopPropagation();
		popOut(UI.color, "4.5em", "4.7em", 0.1);
		copyDivToClipboard(UI.color);
	});
	
	UI.previous.addEventListener("click", (e) => {
		e.preventDefault();
		e.stopPropagation();
		UI.shadesContainer.style.display = "none";
		if(colorCount >= 2){
			removeLastColor();
			currentColor = colors[colorCount - 1];
			changeBackgroundColor(currentColor);
			randomiseStringInDiv(UI.color);
			popOut(UI.previous, "2.8em", "3.0em", 0.1);
		}
	});
	
	function applyColorShades(){
		let lumFactor = -0.9;
		for(let i = 0; i < UI.shades.length; i++){
			let shade = UI.shades[i];
			let shadeColor = colorLuminance(currentColor, lumFactor);
			shade.style.backgroundColor = shadeColor;
			shade.textContent = shadeColor;
			lumFactor += 0.1;
		}
	}

	function changeBackgroundColor(color){
		UI.body.style.backgroundColor = color;
		UI.color.textContent = color;
		if(colorCount >= 2){
			UI.previous.style.color = "white";
			UI.previous.style.cursor = "pointer";
		}else{
			UI.previous.style.color = "black";
			UI.previous.style.cursor = "default";
		}
	}
	
	function popOut(span, initial, end, time){
		span.style.fontSize = end;
		setTimeout(() =>{
			span.style.fontSize = initial;
		}, time*1000);
	}

	function copyDivToClipboard(div){
		UI.copyTextArea.value = div.textContent;
		UI.copyTextArea.select();
		document.execCommand("Copy");
	}
	
	
});

// TODO : Implement copy on click

function generateColor(){
	let hexLetters = [..."0123456789ABCDEF"];
	let color = "#";
	for(let i = 0; i < 6; i++){
		color += hexLetters[Math.floor(Math.random()*hexLetters.length)];
	}
	return color;
};

function addColor(color){
	colors.push(color);
	if(colors.length > 10){
		colors.shift();
	}
	colorCount = colors.length;
}

function removeLastColor(){
	colors.pop();
	colorCount = colors.length;
}



function randomiseStringInDiv(div){
	const chars = ["$", "%", "#", "@", "&", "(", ")", ",", "=", "*", "/"];
	const charsTotal = chars.length;
	const getRandomInt = (min, max) => {return Math.floor(Math.random()*(max-min+1)) + min;}
	let letters = div.textContent.split("");
	let displayString = "";
	
	// Randomising times in milliseconds
	const randomisingTime = 40;
	const randomisingTime2 = 60;
	const randomisingTime3 = 30;
	
	letters.forEach((char, index) => {
		setTimeout(() => {
			displayString += Math.random() < 0.5 ? chars[getRandomInt(0,charsTotal-1)] : char;
			div.textContent = displayString;
		}, index*randomisingTime);
		

		setTimeout(() => {
			let arr = displayString.split("");
			arr[index] = char;
			div.textContent = arr.join("");
		},letters.length*randomisingTime + index*randomisingTime2);
		
		setTimeout(() => {
			let arr = displayString.split("");
			arr[index] = char;
			displayString = arr.join("")
			div.textContent = displayString;
		},letters.length*randomisingTime + letters.length*randomisingTime2 + index*randomisingTime3);
	});
}

function colorLuminance(hex, lumFactor){
	hex = hex.substr(1);
	let rgb = "#";
	for(let i = 0; i<3; i++){
		let color = parseInt(hex.substr(i*2,2),16);
		color = Math.round(clamp(color*(1+lumFactor), 0, 255)).toString(16);
		rgb += ("00"+color).substr(color.length).toUpperCase();
	}
	return rgb;
}

function clamp(num, min, max){
	return num < min ? min : num > max ? max : num;
}

function fadeIn(div){
	var opacity = 0;
	div.style.opacity = opacity.toString();
	div.style.display = "block";
	var id = setInterval(foo, 100);
	
	function foo(){
		if(opacity >= 1) clearInterval(id);
		else{
			opacity += 0.1;
			div.style.opacity = opacity.toString();
		}
	}
}
