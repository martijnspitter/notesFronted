import React, { useState } from 'react';

import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { useSetRecoilState } from 'recoil';

import { userAtom } from '../store/atoms';

import axios from '../api/axios';

export default function Register() {
	const [ email, setEmail ] = useState('');
	const [ password, setPassword ] = useState('');
	const [ message, setMessage ] = useState('');
	const setUser = useSetRecoilState(userAtom);

	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		let requestBody = {
			query: `query {login(email: "${email}", password: "${password}") {userId token tokenExpiration username email}}`
		};

		const response = await axios.post('', requestBody);

		if (response.data.data.login) {
			setMessage(`${response.data.data.login.username} is logged in successfully`);
			setUser(response.data.data.login);
			localStorage.setItem('user', JSON.stringify(response.data.data.login));
			setTimeout(() => {
				navigate('/projects');
			}, 500);
		}
		if (response.data.errors) {
			setMessage(`ERROR: ${response.data.errors[0].message}`);
		}
	};

	return (
		<Form style={{ width: '30%', marginTop: '4rem', alignSelf: 'center' }} onSubmit={handleSubmit}>
			<h1>Login</h1>
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
