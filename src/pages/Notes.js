import React, { useState, Suspense, useEffect } from 'react';

import { useRecoilState } from 'recoil';
import { notesAtom } from '../store/atoms';

import { Card } from 'react-bootstrap';

import AddItem from './AddItem';
import DeleteNotePopup from './DeleteNotePopup';
import Item from './Item';
import DropWrapper from '../components/DropWrapper';

import cross from '../images/cross.svg';
import plus from '../images/plus.svg';

import { hideClass, showClass } from '../helpers/helpers';
import { useDrop } from 'react-dnd';

import _ from 'lodash';

export default function Notes() {
	const [ deleteNoteShow, setDeleteNoteShow ] = useState(false);
	const [ noteToDelete, setNoteToDelete ] = useState({});

	const [ notes, setNotes ] = useRecoilState(notesAtom);

	const handleDeleteNoteShow = (note) => {
		setNoteToDelete(note);
		setDeleteNoteShow(true);
	};

	const handleDeleteNoteClose = () => {
		setNoteToDelete({});
		setDeleteNoteShow(false);
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

	useEffect(() => {
		return function cleanup() {
			console.log('clean up');
		};
	});

	const onDrop = (item, noteIndex, monitor) => {
		// if origin of item is the same as the drop target return and don't change state
		if (item.noteIndex === noteIndex) return;

		// clone notes
		const newNotes = _.cloneDeep(notes);

		setNotes((prevState) => {
			// filter out the item being dragged
			const newItems = prevState[item.noteIndex].items.filter((i, idx) => i._id !== item._id);

			// set new filtered items in newNotes
			newNotes[item.noteIndex].items = newItems;

			// concat item to the target DropWrapper
			const newItemsInNotes = newNotes[noteIndex].items.concat({ ...item });

			// set new concated items in newNotes
			newNotes[noteIndex].items = newItemsInNotes;
			console.log('drop');
			return newNotes;
		});
	};

	const moveItem = (item, hoverIndex, noteIndex) => {
		// if the origin of the note is not the same as the drop target return and don't change state
		if (item.noteIndex !== noteIndex) return;

		setNotes((prevState) => {
			// filter out the item being dragged
			const newItems = prevState[noteIndex].items.filter((i, idx) => i._id !== item._id);
			// insert item being dragged on the hover index
			newItems.splice(hoverIndex, 0, item);

			// clone notes and set new items
			const newNotes = _.cloneDeep(notes);
			newNotes[noteIndex].items = newItems;
			console.log('move');
			return newNotes;
		});
	};

	return (
		<React.Fragment>
			<Suspense fallback={null}>
				<DeleteNotePopup show={deleteNoteShow} onHide={handleDeleteNoteClose} note={noteToDelete} />
			</Suspense>
			{notes.map((note, noteIndex) => {
				return (
					<Card className="note-card" id={note._id} key={note._id} style={{ minHeight: '20rem' }}>
						<Card.Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
							<h3 style={{ color: '#2274a5', marginBottom: 0 }}>{note.title}</h3>
							<img
								src={cross}
								alt="cross to delete"
								style={{ cursor: 'pointer', width: '2rem', height: '2rem' }}
								onClick={() => handleDeleteNoteShow(note)}
							/>
						</Card.Header>
						<Card.Body style={{ height: '100%' }}>
							<DropWrapper onDrop={onDrop} noteIndex={noteIndex} key={`dropwrapperkey${note._id}`}>
								{note.items.map((item, itemIndex) => {
									return (
										<Item
											moveItem={moveItem}
											id={item._id}
											itemIndex={itemIndex}
											item={item}
											noteIndex={noteIndex}
											key={`itemkey${item._id}`}
										/>
									);
								})}
							</DropWrapper>
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
