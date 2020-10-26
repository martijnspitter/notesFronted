import React, { useState } from 'react';

import axios from '../api/axios';
import authHeader from '../api/authHeader';

import { Form, Button } from 'react-bootstrap';
import cross from '../images/cross.svg';

import { useRecoilState } from 'recoil';
import { notesAtom } from '../store/atoms';

import _ from 'lodash';

export default function AddItem(props) {
	const [ title, setTitle ] = useState('');
	const [ message, setMessage ] = useState('');

	const [ notes, setNotes ] = useRecoilState(notesAtom);

	const handleSubmit = async (e) => {
		e.preventDefault();
		let requestBody = {
			query: `mutation {createItem(input: {title: "${title}", note: "${props.id}"}) {_id title description dueDate todos{_id text check} creator{username}}}`
		};

		const response = await axios.post('', requestBody, { headers: authHeader() });

		if (response.data.data.createItem) {
			setMessage('');
			setTitle('');
		}
		if (response.data.errors) {
			setMessage(`ERROR: ${response.data.errors[0].message}`);
		}

		// updating atom with cloneDeep from lodash to get a copy of the state.
		const index = notes.findIndex((note) => note._id === props.id);
		var notesCopy = _.cloneDeep(notes);

		notesCopy[index].items.push(response.data.data.createItem);

		// pushing new state into notesAtom.
		// This is deeply nested state and it only re-renders because I set the whole notesAtom state with the new state. This saves data fetching for each Note.
		setNotes(notesCopy);
	};

	return (
		<Form
			style={{ width: '100%', marginTop: '2rem', alignSelf: 'center' }}
			onSubmit={handleSubmit}
			className="add-item hidden"
			id={'form' + props.id}
		>
			<Form.Group>
				<Form.Label htmlFor="title">Title</Form.Label>
				<Form.Control
					size="lg"
					type="text"
					id="title"
					placeholder="Enter a title for the item.."
					required
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>
			</Form.Group>

			<div>{message}</div>
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
				<Button
					type="submit"
					style={{ fontSize: '1.6rem', marginTop: '2rem', backgroundColor: '#2274a5' }}
					onClick={() => props.onHide(props.id)}
				>
					Create Item
				</Button>
				<img
					src={cross}
					alt="cross"
					onClick={() => {
						props.onHide(props.id);
						setTitle('');
						setMessage('');
					}}
					style={{ marginTop: '2rem', cursor: 'pointer', width: '2rem', height: '2rem' }}
				/>
			</div>
		</Form>
	);
}
