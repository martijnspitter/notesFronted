// var placeholder = document.createElement('div');
// placeholder.className = 'placeholder';

// const dragOverHandler = (e) => {
// 	e.preventDefault();
// 	e.dragged.style.display = 'none';
// 	if (e.target.className == 'placeholder') return;
// 	e.over = e.target;
// 	e.target.parentNode.insertBefore(placeholder, e.target);
// 	var relY = e.clientY - e.over.parentNode.offsetTop;
// 	var height = e.over.offsetHeight / 2;
// 	var parent = e.over.parentNode;
// 	if (relY > height) {
// 		e.nodePlacement = 'after';
// 		parent.insertBefore(placeholder, e.target.nextElementSibling);
// 	} else if (relY < height) {
// 		e.nodePlacement = 'before';
// 		parent.insertBefore(placeholder, e.target);
// 	}
// };

// const dropHandler = (e) => {
// 	e.preventDefault();
// 	console.log(e.target.id);
// };

// const dragStartHandler = (e, index) => {
// 	e.target.style.opacity = '0.4';
// 	e.dragged = e.currentTarget;
// 	e.dataTransfer.effectAllowed = 'move';
// 	// Firefox requires calling dataTransfer.setData
// 	// for the drag to properly work
// 	e.dataTransfer.setData('text/html', e.currentTarget);
// };

// const dragEndHandler = (e, index) => {
// 	e.target.style.opacity = '1';
// 	e.dragged.style.display = 'block';
// 	e.over.parentNode.removeChild(placeholder);
// 	console.log(e.over.parentNode.id);
// 	console.log(e.over.id);

// 	// when moving within own Note use e.over.id else use e.over.parentNade.id
// 	let targetIndex = notes.findIndex((note) => {
// 		if (e.over.parentNode.id === '') return note._id === e.over.id;
// 		else return note._id === e.over.parentNode.id;
// 	});
// 	console.log(targetIndex);
// 	// Update state
// 	let from = Number(index);
// 	let sibling = e.target.nextSibling;
// 	console.log(sibling);
// 	let to;
// 	var data = e.state.data;
// 	var from = Number(e.dragged.dataset.id);
// 	var to = Number(e.over.dataset.id);
// 	if (from < to) to--;
// 	data.splice(to, 0, data.splice(from, 1)[0]);
// 	e.setState({ data: data });
// };
