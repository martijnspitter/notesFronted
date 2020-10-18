import React, { useEffect, Suspense, useState } from 'react';

import { useParams } from 'react-router-dom';

import axios from '../api/axios';
import authHeader from '../api/authHeader';

import { useSetRecoilState, useRecoilValue } from 'recoil';
import { notesAtom, selectedProjectAtom } from '../store/atoms';

import Notes from '../pages/Notes';
import AddNote from '../pages/AddNote';

export default function Project() {
	const [ show, setShow ] = useState(false);
	const { id } = useParams();
	const setNotes = useSetRecoilState(notesAtom);
	const selectedProject = useRecoilValue(selectedProjectAtom);

	useEffect(
		() => {
			const fetchNotes = async () => {
				const requestBody = {
					query: `query {notes(projectId: "${id}") {_id title  items{_id title description dueDate creator{username} todos{text check}}}}`
				};
				const response = await axios.post('', requestBody, { headers: authHeader() });
				setNotes(response.data.data.notes);
			};
			fetchNotes();
		},
		[ setNotes, id ]
	);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	return (
		<div>
			{selectedProject ? <h1>{selectedProject.title}</h1> : null}
			<Suspense fallback={<div>Loading..</div>}>
				<div className="notes-container">
					<Notes />
				</div>
			</Suspense>
			<AddNote show={show} onHide={handleClose} />
			<div className="addNote-button" onClick={handleShow}>
				<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem 1rem' }}>
					<svg
						width="1.5em"
						height="1.5em"
						viewBox="0 0 16 16"
						className="bi bi-plus"
						fill="currentColor"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fillRule="evenodd"
							d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"
						/>
					</svg>
					<div style={{ paddingRight: '6px' }}>Add Note</div>
				</div>
			</div>
		</div>
	);
}
