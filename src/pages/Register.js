import React, { useState } from 'react';

import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import axios from '../api/axios';

export default function Register() {
	const [ email, setEmail ] = useState('');
	const [ username, setUsername ] = useState('');
	const [ password, setPassword ] = useState('');
	const [ message, setMessage ] = useState('');

	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		let requestBody = {
			query: `mutation {createUser(input: {email: "${email}", username: "${username}", password: "${password}"}) {_id email}}`
		};

		const response = await axios.post('', requestBody);

		if (response.data.data.createUser) {
			setMessage(
				`User created with email: ${response.data.data.createUser.email} and username: ${response.data.data.createUser
					.username}`
			);
			setTimeout(() => {
				navigate('/login');
			}, 1000);
		}
		if (response.data.errors) {
			setMessage(`ERROR: ${response.data.errors[0].message}`);
		}
	};

	return (
		<Form style={{ width: '30%', marginTop: '4rem', alignSelf: 'center' }} onSubmit={handleSubmit}>
			<h1>Register</h1>
			<Form.Group>
				<Form.Label htmlFor="email">Email</Form.Label>
				<Form.Control
					type="email"
					id="email"
					placeholder="email"
					required
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
			</Form.Group>
			<Form.Group>
				<Form.Label htmlFor="username">Username</Form.Label>
				<Form.Control
					type="name"
					id="username"
					placeholder="username"
					required
					value={username}
					onChange={(e) => setUsername(e.target.value)}
				/>
			</Form.Group>
			<Form.Group>
				<Form.Label htmlFor="password">Password</Form.Label>
				<Form.Control
					type="password"
					id="password"
					placeholder="password"
					required
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
			</Form.Group>
			<div>{message}</div>
			<Button type="submit" style={{ fontSize: '1.6rem', marginTop: '2rem', backgroundColor: '#2274a5' }}>
				Submit
			</Button>
		</Form>
	);
}
