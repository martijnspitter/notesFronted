import React from 'react';

import { Modal, Button } from 'react-bootstrap';

import axios from '../api/axios';
import authHeader from '../api/authHeader';

import { useRecoilState } from 'recoil';
import { notesAtom } from '../store/atoms';

import _ from 'lodash';

export default function DeleteNotePopup(props) {
	const [ notes, setNotes ] = useRecoilState(notesAtom);

	const handleDelete = async () => {
		const requestBody = {
			query: `mutation {deleteNote(noteId: "${props.note._id}"){_id }}`
		};
		const response = await axios.post('', requestBody, { headers: authHeader() });

		if (response.data.data.deleteTodo) {
			// clone state from itemAtom and adding newly created Item
			const notesCopy = _.cloneDeep(notes);

			// find index of todo in item
			const index = notes.findIndex((note) => note._id === props.note._id);

			// remove the todo with splice
			notesCopy.todos.splice(index, 1);

			// replace old state with mutated state
			setNotes(notesCopy);
		}

		if (response.data.errors) {
			console.log(`ERROR: ${response.data.errors[0].message}`);
		}
	};

	return (
		<Modal show={props.show} onHide={props.onHide} centered>
			<Modal.Header>
				<div style={{ fontSize: '1.6rem', padding: '1rem' }}>Delete Note</div>
			</Modal.Header>
			<Modal.Body>
				<div style={{ fontSize: '1.6rem', padding: '1rem' }}>
					Are you sure you want to delete the note with title: <br />
					<strong>{props.note.title}</strong>
				</div>
			</Modal.Body>
			<Modal.Footer style={{ justifyContent: 'space-evenly' }}>
				<Button variant="danger" onClick={handleDelete} style={{ fontSize: '1.6rem' }}>
					Delete
				</Button>
				<Button onClick={props.onHide} style={{ fontSize: '1.6rem' }}>
					Cancel
				</Button>
			</Modal.Footer>
		</Modal>
	);
}
