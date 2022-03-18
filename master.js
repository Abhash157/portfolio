let nav=document.getElementById("navigation");
								let main=document.getElementById("main")
								let burger=document.getElementById("burger")
								let body=document.getElementById("bdy")
								let cross=document.getElementById("cross")								
								
main.addEventListener("click",hide)
function show() {
				nav.style.left="0";
				body.style.background="white"
				main.style.opacity="0.5"
				burger.style.opacity="0"
				burger.style.transition="200ms"
				burger.style.transitionDelay="1ms"
				cross.style.opacity="1";
}
function hide() {
				nav.style.left="-35vw";
				body.style.background="none"
				main.style.opacity="1"
				burger.style.opacity="1"
				burger.style.transition="300ms"
				burger.style.transitionDelay="300ms"
				cross.style.opacity="0";
}
