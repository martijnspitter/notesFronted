import React from 'react';

import logo from '../images/logo.svg';

import { Navbar, Nav } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';

import { useSetRecoilState, useRecoilState } from 'recoil';
import { userAtom, selectedProjectAtom, notesAtom } from '../store/atoms';

export default function NavBar() {
	const [ user, setUser ] = useRecoilState(userAtom);
	const setSelectedProject = useSetRecoilState(selectedProjectAtom);
	const setNotes = useSetRecoilState(notesAtom);

	const activeStyle = {
		color: '#45A3D9'
	};

	const logOut = () => {
		localStorage.removeItem('user');
		setUser({
			id: null,
			username: null,
			email: null,
			token: null,
			tokenExpiration: null
		});
	};

	const projectsClick = () => {
		setSelectedProject(undefined);

		setNotes([]);
	};

	return (
		<Navbar>
			<Link to={'/'} style={{ display: 'flex', alignItems: 'center' }}>
				<img
					src={logo}
					alt="martijnspitter.nl logo"
					className="cvlogo"
					style={{ width: '3rem', height: '3rem', marginRight: '1rem' }}
				/>
			</Link>
			<Navbar.Brand href="/documentation" style={{ color: '#E76F51', marginLeft: '1rem', fontSize: '1.5rem' }}>
				Notes
			</Navbar.Brand>
			<Nav className="mr-auto" style={{ marginLeft: '1rem' }}>
				{user.username === null ? null : (
					<React.Fragment>
						<NavLink
							to="/projects"
							activeStyle={activeStyle}
							style={{ color: '#2274a5', textDecoration: 'none' }}
							onClick={() => projectsClick()}
						>
							Projects
						</NavLink>
						<NavLink
							to="/addproject"
							activeStyle={activeStyle}
							style={{ color: '#2274a5', textDecoration: 'none', marginLeft: '2rem' }}
						>
							Create Project
						</NavLink>
					</React.Fragment>
				)}
			</Nav>
			{user.username === null ? (
				<Nav className="ml-auto" style={{ marginLeft: '1rem' }}>
					<NavLink to="/login" activeStyle={activeStyle} style={{ color: '#2274a5', textDecoration: 'none' }}>
						Login
					</NavLink>
					<NavLink
						to="/register"
						activeStyle={activeStyle}
						style={{ color: '#2274a5', textDecoration: 'none', marginLeft: '1rem' }}
					>
						Register
					</NavLink>
				</Nav>
			) : (
				<Nav className="ml-auto" style={{ marginLeft: '1rem' }}>
					<NavLink to="/profile" activeStyle={activeStyle} style={{ color: '#2274a5', textDecoration: 'none' }}>
						{user.username}
					</NavLink>
					<NavLink
						to="/login"
						style={{ color: '#2274a5', textDecoration: 'none', marginLeft: '1rem' }}
						activeStyle={activeStyle}
						onClick={() => logOut()}
					>
						Logout
					</NavLink>
				</Nav>
			)}
		</Navbar>
	);
}
