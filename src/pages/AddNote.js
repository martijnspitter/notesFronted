import React, { useState } from 'react';

import axios from '../api/axios';
import authHeader from '../api/authHeader';

import { Form, Button, Modal } from 'react-bootstrap';

import { useRecoilValue, useRecoilState } from 'recoil';
import { notesAtom, selectedProjectAtom } from '../store/atoms';

import _ from 'lodash';

export default function AddNote(props) {
	const [ title, setTitle ] = useState('');
	const [ message, setMessage ] = useState('');

	const selectedProject = useRecoilValue(selectedProjectAtom);
	const [ notes, setNotes ] = useRecoilState(notesAtom);

	const handleSubmit = async (e) => {
		e.preventDefault();
		let requestBody = {
			query: `mutation {createNote(input: {title: "${title}", project: "${selectedProject._id}"}) {_id title creator{username} items{title}}}`
		};

		const response = await axios.post('', requestBody, { headers: authHeader() });

		// clone state from notesAtom and adding newly created Note
		const notesCopy = _.clone(notes);
		notesCopy.push(response.data.data.createNote);
		// replace old state with mutated state
		setNotes(notesCopy);

		if (response.data.data.createNote) {
			setMessage(
				`Note: "${response.data.data.createNote.title}" is created by ${response.data.data.createNote.creator.username}`
			);
			props.onHide();
		}
		if (response.data.errors) {
			setMessage(`ERROR: ${response.data.errors[0].message}`);
		}
	};

	return (
		<Modal show={props.show} onHide={props.onHide} centered>
			<Modal.Header closeButton>
				<Modal.Title>Add a Note</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				Notes are where everything happens.
				<Form style={{ width: '100%', marginTop: '2rem', alignSelf: 'center' }} onSubmit={handleSubmit}>
					<Form.Group>
						<Form.Label htmlFor="title">Title</Form.Label>
						<Form.Control
							size="lg"
							type="text"
							id="title"
							placeholder="title"
							required
							value={title}
							onChange={(e) => setTitle(e.target.value)}
						/>
					</Form.Group>

					<div>{message}</div>
					<Button type="submit" style={{ fontSize: '1.6rem', marginTop: '2rem', backgroundColor: '#2274a5' }}>
						Submit
					</Button>
				</Form>
			</Modal.Body>
		</Modal>
	);
}
