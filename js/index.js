let colors = [];

document.addEventListener("DOMContentLoaded", function(){
	let UI = {
		color: document.getElementById("color"),
		body: document.querySelector("body"),
		//copyColor: document.getElementById("copy-color")
	};

	new Clipboard("p");

	changeBackgroundColor();
	
	UI.body.addEventListener("click", (e) => {
		e.preventDefault();
		changeBackgroundColor();
	});

	UI.color.addEventListener("click", (e) => {
		e.preventDefault();
		e.stopPropagation();
	});

	function changeBackgroundColor(){
		let color = generateColor();
		UI.body.style.backgroundColor = color;
		UI.color.textContent = color;
		//UI.copyColor.textContent = color;
		colors.push(color);
		if(colors.length > 10){
			colors.shift();
		}
	}
	
});

// TODO : Implement copy on click

// TODO : Properly define the color generation function
function generateColor(){
	let colors = ["#ccc", "#fff", "#ecfcff"];
	return colors[Math.floor(Math.random()*colors.length)];
};

function copyDivToClipboard(){
	var range
}