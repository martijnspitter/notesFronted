import React, { useState } from 'react';

import axios from '../api/axios';
import authHeader from '../api/authHeader';

import { Form, Button } from 'react-bootstrap';

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
			setMessage(
				`Note: "${response.data.data.createItem.title}" is created by ${response.data.data.createItem.creator.username}`
			);
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
				<svg
					onClick={() => props.onHide(props.id)}
					style={{ marginTop: '2rem', cursor: 'pointer' }}
					width="2em"
					height="2em"
					viewBox="0 0 16 16"
					className="bi bi-x"
					fill="currentColor"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fillRule="evenodd"
						d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
					/>
				</svg>
			</div>
		</Form>
	);
}
