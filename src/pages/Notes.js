import React, { useState, Suspense } from 'react';

import { useRecoilValue, useSetRecoilState } from 'recoil';
import { notesAtom, itemAtom } from '../store/atoms';

import { Card } from 'react-bootstrap';

import AddItem from './AddItem';
import Item from './Item';

import { hideClass, showClass } from '../helpers/helpers';

import axios from '../api/axios';
import authHeader from '../api/authHeader';

export default function Notes() {
	const [ show, setShow ] = useState(false);

	const notes = useRecoilValue(notesAtom);
	const setItem = useSetRecoilState(itemAtom);

	const title = '';
	const description = '';
	const dueDate = '';

	const handleClose = () => {
		setShow(false);
		setItem({});
	};

	const handleShow = (id) => {
		// fetching when item is selected
		fetchItem(id);
		// show popup
		setShow(true);
	};

	// fetch single item data function
	const fetchItem = async (itemId) => {
		const requestBody = {
			query: `query {item(itemId: "${itemId}"){_id title description createdAt updatedAt dueDate todos{_id text check} creator {username} note{title}}}`
		};
		const response = await axios.post('', requestBody, { headers: authHeader() });

		setItem(response.data.data.item);
	};

	// hides the 'add an item' div. Shows the form
	const toggleAdd = (id) => {
		hideClass(id);
		showClass('form' + id);
	};

	// hides the form. shows the 'add an item' div
	const toggleForm = (id) => {
		hideClass('form' + id);
		showClass(id);
	};

	return (
		<React.Fragment>
			<Suspense fallback={null}>
				<Item show={show} onHide={handleClose} />
			</Suspense>
			{notes.map((note) => {
				return (
					<Card className="note-card" key={note._id} style={{ minHeight: '20rem' }}>
						<Card.Body>
							<div
								style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}
							>
								<h3>{note.title}</h3>
								<svg
									style={{ cursor: 'pointer' }}
									onClick={() => alert('delete popup')}
									width="1.3em"
									height="1.3em"
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

							{note.items.map((item) => {
								return (
									<div className="note-item" key={item._id} onClick={() => handleShow(item._id)}>
										{item.title}
									</div>
								);
							})}
						</Card.Body>
						<Card.Footer>
							<div
								style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
								id={note._id}
								className="add-item"
								onClick={() => {
									toggleAdd(note._id);
								}}
							>
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
