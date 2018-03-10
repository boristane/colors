let colors = [];
let shadeColors = [];
let currentColor = "";
let colorCount = 0;
let rgb = false;

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
		copyTextArea: document.getElementById("copy-text-area"),
		shadesVisible: false,
		typeBtn: document.getElementById("type-btn")
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
		if(UI.shadesVisible){
			UI.shadesVisible = false;
			fadeOut(UI.shadesContainer);
		}else{
			UI.shadesContainer.style.display = "none";
			currentColor = generateColor();
			if(rgb){
				currentColor = hexToRgb(currentColor);
			}
			addColor(currentColor);
			changeBackgroundColor(currentColor);
			randomiseStringInDiv(UI.color);
		}
	});
	
	UI.shadesBtn.addEventListener("click", (e) => {
		e.preventDefault();
		e.stopPropagation();
		applyColorShades();
		fadeIn(UI.shadesContainer)
		UI.shadesVisible = true;
		for(let i = 0; i < UI.shades.length; i++){
			let shade = UI.shades[i];
			randomiseStringInDiv(shade);
			shade.style.color = extractLuminance(shade.style.backgroundColor) > 0.7 ? "black" : "white"; 
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

	UI.typeBtn.addEventListener("click", (e)=>{
		e.preventDefault();
		e.stopPropagation();
		if(rgb){
			UI.typeBtn.textContent = "RGB";
			colors = colors.map(color => {
				return rgbToHex(color);
			});
		}else{
			UI.typeBtn.textContent = "HEX";
			colors = colors.map(color => {
				return hexToRgb(color);
			});
		}
		currentColor = colors[colors.length-1];
		changeBackgroundColor(currentColor);
		randomiseStringInDiv(UI.color);

		if(UI.shadesVisible){
			for(var i = 0; i < UI.shades.length; i++){
				let shade = UI.shades[i];
				shade.textContent = rgb ? shadeColors[i] : hexToRgb(shadeColors[i]);
				randomiseStringInDiv(shade);
			}
		}
		rgb = !rgb;
	})
	
	function applyColorShades(){
		let lumFactor = -0.9;
		currentColor = rgb ? rgbToHex(currentColor) : currentColor;
		for(let i = 0; i < UI.shades.length; i++){
			let shade = UI.shades[i];
			let shadeColor = colorLuminance(currentColor, lumFactor);
			shade.style.backgroundColor = shadeColor;
			shadeColors.push(shadeColor);
			shade.textContent = rgb ? hexToRgb(shadeColor) : shadeColor;
			lumFactor += 0.1;
		}
	}

	function changeBackgroundColor(color){
		UI.body.style.backgroundColor = color;
		if(rgb){
			UI.body.style.backgroundColor = "rgb" + color;
		}
		UI.color.textContent = color;
		UI.color.style.color = extractLuminance(UI.body.style.backgroundColor) > 0.7 ? "black" : "white";
		UI.shadesBtn.style.color = extractLuminance(UI.body.style.backgroundColor) > 0.7 ? "black" : "white";
		UI.typeBtn.style.color =  extractLuminance(UI.body.style.backgroundColor) > 0.7 ? "black" : "white";
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

function hexToRgb(hex){
	hex = hex.substr(1);
	var result = "(";
	var temp = result;
	for(var i = 0; i < 3; i++){
		var color = parseInt(hex.substr(i*2,2),16);
		temp += color + ",";
	}
	result = temp.substring(0, temp.length-1) + ")";
	return result;
}


function rgbToHex(rgb){
	var colors = rgb.substring(1, rgb.length-1).split(",");
	var result = "#";
	colors.forEach(color => {
		color = parseInt(color, 10).toString(16);
		result += color.length === 1 ? 0+color : color;
	});
	return result.toUpperCase();
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

function extractLuminance(rgb){
	rgb = rgb.substr(4);
	rgb = rgb.slice(0, rgb.length-1);
	let colors = rgb.split(",").map((val) => parseInt(val));
	let lum = colors.map((val) => val/255);
	return lum.reduce((acc, val) => {
		return acc+val;
	})/lum.length;
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

function fadeOut(div){
	var opacity = 1;
	div.style.opacity = opacity.toString();
	var id = setInterval(foo, 100);
	setTimeout(() => {
		div.style.display = "none";
	},1000)
	function foo(){
		if(opacity <= 0) clearInterval(id);
		else{
			opacity -= 0.1;
			div.style.opacity = opacity.toString();
		}
	}
}
