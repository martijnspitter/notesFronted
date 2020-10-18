import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import axios from '../api/axios';
import authHeader from '../api/authHeader';

import { Form, Button } from 'react-bootstrap';

export default function AddProject() {
	const [ title, setTitle ] = useState('');
	const [ description, setDescription ] = useState('');
	const [ message, setMessage ] = useState('');

	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		let requestBody = {
			query: `mutation {createProject(input: {title: "${title}", description: "${description}"}) {title description creator{username}}}`
		};

		const response = await axios.post('', requestBody, { headers: authHeader() });

		if (response.data.data.createProject) {
			setMessage(
				`Project: "${response.data.data.createProject.title}" is created by ${response.data.data.createProject.creator
					.username}`
			);

			setTimeout(() => {
				navigate('/projects');
			}, 1000);
		}
		if (response.data.errors) {
			setMessage(`ERROR: ${response.data.errors[0].message}`);
		}
	};

	return (
		<Form style={{ width: '30%', marginTop: '4rem', alignSelf: 'center' }} onSubmit={handleSubmit}>
			<h1>Create Project</h1>
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

			<Form.Group>
				<Form.Label htmlFor="description">Description</Form.Label>
				<Form.Control
					as="textarea"
					rows="15"
					size="lg"
					type="text"
					id="description"
					placeholder="description"
					required
					value={description}
					onChange={(e) => setDescription(e.target.value)}
				/>
			</Form.Group>
			<div>{message}</div>
			<Button type="submit" style={{ fontSize: '1.6rem', marginTop: '2rem', backgroundColor: '#2274a5' }}>
				Submit
			</Button>
		</Form>
	);
}
