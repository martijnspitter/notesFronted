import React, { useState, Suspense } from 'react';

import { useRecoilValue, useSetRecoilState } from 'recoil';
import { notesAtom, itemAtom } from '../store/atoms';

import { Card } from 'react-bootstrap';

import AddItem from './AddItem';
import Item from './Item';
import DeleteNotePopup from './DeleteNotePopup';

import cross from '../images/cross.svg';
import plus from '../images/plus.svg';

import { hideClass, showClass } from '../helpers/helpers';

import axios from '../api/axios';
import authHeader from '../api/authHeader';

export default function Notes() {
	const [ itemShow, setItemShow ] = useState(false);
	const [ deleteNoteShow, setDeleteNoteShow ] = useState(false);
	const [ noteToDelete, setNoteToDelete ] = useState({});

	const [ dragItem, setDragItem ] = useState(null);
	const [ dragTarget, setDragTarget ] = useState(null);
	const [ dragItemIndex, setDragItemIndex ] = useState(null);

	const notes = useRecoilValue(notesAtom);
	const setItem = useSetRecoilState(itemAtom);

	const handleClose = () => {
		setItemShow(false);
		setItem({});
	};

	const handleShow = (id) => {
		// fetching when item is selected
		fetchItem(id);
		// show popup
		setItemShow(true);
	};

	const handleDeleteNoteShow = (note) => {
		setNoteToDelete(note);
		setDeleteNoteShow(true);
	};

	const handleDeleteNoteClose = () => {
		setNoteToDelete({});
		setDeleteNoteShow(false);
	};

	// fetch single item data function
	const fetchItem = async (itemId) => {
		const requestBody = {
			query: `query {item(itemId: "${itemId}"){_id title description createdAt updatedAt dueDate todos{_id text check} creator {username} note{_id title}}}`
		};
		const response = await axios.post('', requestBody, { headers: authHeader() });

		setItem(response.data.data.item);
	};

	// hides the 'add an item' div. Shows the form
	const toggleAdd = (id) => {
		hideClass('note' + id);
		showClass('form' + id);
	};

	// hides the form. shows the 'add an item' div
	const toggleForm = (id) => {
		hideClass('form' + id);
		showClass('note' + id);
	};

	var placeholder = document.createElement('div');
	placeholder.className = 'placeholder';

	const dragOverHandler = (e) => {
		e.preventDefault();
		e.dragged.style.display = 'none';
		if (e.target.className == 'placeholder') return;
		e.over = e.target;
		e.target.parentNode.insertBefore(placeholder, e.target);
		// var relY = e.clientY - e.over.parentNode.offsetTop;
		// var height = e.over.offsetHeight / 2;
		// var parent = e.over.parentNode;
		// if (relY > height) {
		// 	e.nodePlacement = 'after';
		// 	parent.insertBefore(placeholder, e.target.nextElementSibling);
		// } else if (relY < height) {
		// 	e.nodePlacement = 'before';
		// 	parent.insertBefore(placeholder, e.target);
		// }
	};

	const dropHandler = (e) => {
		e.preventDefault();
		//console.log(e.target.id);
	};

	const dragStartHandler = (e, index) => {
		e.target.style.opacity = '0.4';
		e.dragged = e.currentTarget;
		e.dataTransfer.effectAllowed = 'move';
		// Firefox requires calling dataTransfer.setData
		// for the drag to properly work
		e.dataTransfer.setData('text/html', e.currentTarget);
	};

	const dragEndHandler = (e, index) => {
		e.target.style.opacity = '1';
		e.dragged.style.display = 'block';
		e.over.parentNode.removeChild(placeholder);
		// console.log(e.over.parentNode.id);
		// console.log(e.over.id);

		// when moving within own Note use e.over.id else use e.over.parentNade.id
		let targetIndex = notes.findIndex((note) => {
			if (e.over.parentNode.id === '') return note._id === e.over.id;
			else return note._id === e.over.parentNode.id;
		});
		console.log(targetIndex);
		// Update state
		let from = Number(index);
		let sibling = e.target.nextSibling;
		console.log(sibling);
		let to;
		// var data = e.state.data;
		// var from = Number(e.dragged.dataset.id);
		// var to = Number(e.over.dataset.id);
		// if (from < to) to--;
		// data.splice(to, 0, data.splice(from, 1)[0]);
		// e.setState({ data: data });
	};

	return (
		<React.Fragment>
			<Suspense fallback={null}>
				<Item show={itemShow} onHide={handleClose} />
				<DeleteNotePopup show={deleteNoteShow} onHide={handleDeleteNoteClose} note={noteToDelete} />
			</Suspense>
			{notes.map((note) => {
				console.log(note._id);
				return (
					<Card className="note-card" id={note._id} key={note._id} style={{ minHeight: '20rem' }}>
						<Card.Body>
							<div
								style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}
							>
								<h3 style={{ color: '#2274a5' }}>{note.title}</h3>
								<img
									src={cross}
									alt="cross to delete"
									style={{ cursor: 'pointer', width: '2rem', height: '2rem' }}
									onClick={() => handleDeleteNoteShow(note)}
								/>
							</div>
							<div
								style={{ height: '100%' }}
								onDrop={(event) => dropHandler(event, note._id)}
								onDragOver={(event) => dragOverHandler(event, note._id)}
								id={note._id}
							>
								{note.items.map((item, index) => {
									return (
										<div
											id={item._id}
											className="note-item"
											draggable="true"
											onDragStart={(e) => dragStartHandler(e, index)}
											onDragEnd={(e) => dragEndHandler(e, index)}
											key={item._id}
											onClick={() => handleShow(item._id)}
											style={{ opacity: '1' }}
										>
											{item.title}
										</div>
									);
								})}
							</div>
						</Card.Body>
						<Card.Footer>
							<div
								style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
								id={'note' + note._id}
								className="add-item"
								onClick={() => {
									toggleAdd(note._id);
								}}
							>
								<img src={plus} alt="plus to add" style={{ width: '2.5rem', height: '2.5rem' }} />
								Add an item to this Note
							</div>
							<AddItem id={note._id} onHide={toggleForm} />
						</Card.Footer>
					</Card>
				);
			})}
		</React.Fragment>
	);
}
