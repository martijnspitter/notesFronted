import React, { useState } from 'react';

import { Modal, Form, Button } from 'react-bootstrap';

import emptyBox from '../images/emptyBox.svg';
import checkBox from '../images/checkBox.svg';
import cross from '../images/cross.svg';
import pencil from '../images/pencil.svg';
import descBox from '../images/descBox.svg';
import checkListBox from '../images/checkListBox.svg';
import titleBox from '../images/titleBox.svg';
import ProgressBar from '../components/ProgressBar';

import { useRecoilState } from 'recoil';
import { itemAtom } from '../store/atoms';

import axios from '../api/axios';
import authHeader from '../api/authHeader';

import _ from 'lodash';
import { showClass, hideClass } from '../helpers/helpers';

export default function Item(props) {
	const [ item, setItem ] = useRecoilState(itemAtom);

	const [ description, setDescription ] = useState('');

	const [ title, setTitle ] = useState('');

	// const [ dueDate, setDueDate ] = useState();
	const [ todoText, setTodoText ] = useState('');
	const [ message, setMessage ] = useState('');
	const [ edit, setEdit ] = useState(false);

	// edit an Item title / description and or duedate (work needed for title and dueDate)
	const handleSubmit = async (e) => {
		e.preventDefault();
		let requestBody = {
			query: `mutation {editItem(input: {itemId: "${item._id}", title: "${item.title}", description: "${description}", dueDate: "${item.dueDate}"}) {_id title description createdAt updatedAt dueDate todos{_id text check} creator {username} note{title}}}`
		};

		const response = await axios.post('', requestBody, { headers: authHeader() });

		// if editItem was succesful
		if (response.data.data.editItem) {
			// replace old state with response data
			setItem(response.data.data.editItem);
			// set descritption state with response description
			setDescription(response.data.data.editItem.description);

			// if edit is true also hide form and show description.
			if (edit) {
				showClass('desc' + item._id);
				hideClass('form' + item._id);
			}
		}
		if (response.data.errors) {
			setMessage(`ERROR: ${response.data.errors[0].message}`);
		}
	};

	const handleTitleEdit = async (e) => {
		e.preventDefault();
		let requestBody = {
			query: `mutation {editItem(input: {itemId: "${item._id}", title: "${title}", description: "${item.description}", dueDate: "${item.dueDate}"}) {_id title description createdAt updatedAt dueDate todos{_id text check} creator {username} note{title}}}`
		};

		const response = await axios.post('', requestBody, { headers: authHeader() });

		// if editItem was succesful
		if (response.data.data.editItem) {
			// replace old state with response data
			setItem(response.data.data.editItem);
			// set title state with response title
			setTitle(response.data.data.editItem.title);
			// hide form
			hideClass('title-form' + item._id);
		}

		if (response.data.errors) {
			setMessage(`ERROR: ${response.data.errors[0].message}`);
		}
	};

	// Post a todoList item to the api
	const handleTodoSubmit = async (e) => {
		e.preventDefault();
		let requestBody = {
			query: `mutation {createTodo(input: {itemId: "${item._id}" text: "${todoText}", check: false}) {_id text check creator{username} }}`
		};

		const response = await axios.post('', requestBody, { headers: authHeader() });

		if (response.data.data.createTodo) {
			setTodoText('');
			// clone state from itemAtom and adding newly created Item
			const itemCopy = _.cloneDeep(item);
			itemCopy.todos.push(response.data.data.createTodo);
			// replace old state with mutated state
			setItem(itemCopy);
		}
		if (response.data.errors) {
			setMessage(`ERROR: ${response.data.errors[0].message}`);
		}
	};

	// handle todoList item edit on check and text
	const handleTodoEdit = async (todo) => {
		console.log(todo);
		let checkReverse = !todo.check;

		let requestBody = {
			query: `mutation {editTodo(input: {todoId: "${todo._id}" text: "${todo.text}", check: ${checkReverse}}) {_id text check creator{username} }}`
		};

		const response = await axios.post('', requestBody, { headers: authHeader() });

		if (response.data.errors) {
			setMessage(`ERROR: ${response.data.errors[0].message}`);
		}

		// request succesful
		if (response.data.data.editTodo) {
			// clone state from itemAtom and adding newly created Item
			const itemCopy = _.cloneDeep(item);

			// find index of todo in item
			const index = item.todos.findIndex((todoToFind) => todoToFind._id === todo._id);

			// replace old todo with new todo in clone state
			itemCopy.todos[index] = response.data.data.editTodo;
			// replace old state with mutated state
			setItem(itemCopy);
		}
	};

	// delete todo item
	const handleTodoDelete = async (id) => {
		let requestBody = {
			query: `mutation {deleteTodo(todoId: "${id}") {_id}}`
		};

		const response = await axios.post('', requestBody, { headers: authHeader() });

		if (response.data.data.deleteTodo) {
			// clone state from itemAtom and adding newly created Item
			const itemCopy = _.cloneDeep(item);

			// find index of todo in item
			const index = item.todos.findIndex((todoToFind) => todoToFind._id === id);

			// remove the todo with splice
			itemCopy.todos.splice(index, 1);

			// replace old state with mutated state
			setItem(itemCopy);
		}

		if (response.data.errors) {
			setMessage(`ERROR: ${response.data.errors[0].message}`);
		}
	};

	// conditional title render for while loading
	const noteTitleRender = () => {
		if (!item.note) return 'loading..';
		else return item.note.title;
	};

	// when edit pencil is clicked editState is set to true. Hidden on description. Remove hidden from form.
	const toggleEditDiscription = (id) => {
		setEdit(true);
		showClass('form' + id);
		hideClass('desc' + id);
	};

	const editTitle = () => {
		return (
			<Form
				onSubmit={handleTitleEdit}
				className="add-item hidden"
				id={'title-form' + item._id}
				style={{ width: '70%', marginLeft: '3.6rem', marginTop: '1rem' }}
			>
				<Form.Group>
					<Form.Control
						as="textarea"
						size="lg"
						rows="1"
						id="title"
						required
						value={title}
						onChange={(e) => {
							setTitle(e.target.value);
						}}
					/>
				</Form.Group>

				<div>{message}</div>
				<div style={{ display: 'flex', alignItems: 'center' }}>
					<Button
						type="submit"
						style={{ fontSize: '1.3rem', backgroundColor: '#e2e2e2', border: '1px solid #eee', color: 'black' }}
					>
						Change Title
					</Button>
					<Button
						style={{
							fontSize: '1.3rem',
							backgroundColor: '#e2e2e2',
							border: '1px solid #eee',
							marginLeft: '2rem',
							color: 'black'
						}}
						onClick={() => {
							// when button is clicked hide the form and clear state
							hideClass('title-form' + item._id);
							setTitle(item.title);
						}}
					>
						Cancel
					</Button>
				</div>
			</Form>
		);
	};

	// if description hidden on form. If no description hidden is on description and form is shown
	const descriptionRender = (item) => {
		let descriptionText = '';
		if (item.description) {
			descriptionText = item.description;
		} else {
			descriptionText = '"Description"';
		}

		return (
			<React.Fragment>
				<div
					className={'add-item '}
					id={'desc' + item._id}
					style={{
						marginLeft: '3.6rem',
						backgroundColor: '#f5f5f5',
						maxWidth: '70%',
						minHeight: '5rem',
						padding: '0 .6rem'
					}}
				>
					{descriptionText}
				</div>

				<Form
					onSubmit={handleSubmit}
					className={'add-item hidden'}
					id={'form' + item._id}
					style={{ width: '70%', marginLeft: '3.6rem' }}
				>
					<Form.Group>
						<Form.Control
							as="textarea"
							rows="3"
							id="description"
							required
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						/>
					</Form.Group>

					<div>{message}</div>
					<div style={{ display: 'flex', alignItems: 'center' }}>
						<Button
							type="submit"
							style={{ fontSize: '1.3rem', backgroundColor: '#e2e2e2', border: '1px solid #eee', color: 'black' }}
						>
							Add Description
						</Button>
						<Button
							style={{
								fontSize: '1.3rem',
								backgroundColor: '#e2e2e2',
								border: '1px solid #eee',
								marginLeft: '2rem',
								color: 'black'
							}}
							onClick={() => {
								// when button is clicked the editState is set to false. Hidden on form and remove hidden from description
								setEdit(false);
								showClass('desc' + item._id);
								hideClass('form' + item._id);
								setDescription(item.description);
							}}
						>
							Cancel
						</Button>
					</div>
				</Form>
			</React.Fragment>
		);
	};

	// conditional todoList render
	const todoListRender = () => {
		if (item.todos) {
			return item.todos.map((todo) => {
				return (
					<div
						style={{
							margin: '0 0 .6rem 3.6rem',
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							width: '50%',
							backgroundColor: '#f5f5f5',
							borderRadius: '2px',
							padding: '0 .6rem'
						}}
						key={todo._id}
					>
						<div style={{ display: 'flex', alignItems: 'center' }}>
							{isChecked(todo)}
							{todo.text}
						</div>
						<img
							src={cross}
							alt="cross"
							onClick={() => handleTodoDelete(todo._id)}
							style={{ cursor: 'pointer', width: '15px', height: '15px' }}
						/>
					</div>
				);
			});
		} else return null;
	};

	// if the item is checked show checkbox with V.
	const isChecked = (todo) => {
		if (todo.check)
			return (
				<img
					src={checkBox}
					alt="checked checkbox"
					onClick={() => handleTodoEdit(todo)}
					style={{ marginRight: '.5rem', cursor: 'pointer', width: '10px', height: '10px' }}
				/>
			);
		else
			return (
				<img
					src={emptyBox}
					alt="empty square"
					onClick={() => handleTodoEdit(todo)}
					style={{ marginRight: '.8rem', cursor: 'pointer', width: '10px', height: '10px' }}
				/>
			);
	};

	const todoListForm = () => {
		return (
			<Form onSubmit={handleTodoSubmit} style={{ margin: '1.5rem 0 0 3.6rem', width: '50%' }}>
				<Form.Group>
					<Form.Control
						type="text"
						size="lg"
						id="todo"
						placeholder="Add a check item"
						required
						value={todoText}
						onChange={(e) => setTodoText(e.target.value)}
					/>
				</Form.Group>

				<div>{message}</div>
				<Button
					type="submit"
					style={{ fontSize: '1.3rem', backgroundColor: '#e2e2e2', border: '1px solid #eee', color: 'black' }}
				>
					Add a check item
				</Button>
			</Form>
		);
	};

	const progressBarRender = () => {
		var count = 0;
		if (item.todos) {
			if (item.todos.length > 0) {
				var total = item.todos.length;
				item.todos.filter((todo) => (todo.check ? count++ : null));
				const percentage = count / total * 100;
				const percentageRound = (Math.round(percentage * 100) / 100).toFixed(1);
				return (
					<div style={{ display: 'flex', flexDirection: 'column' }}>
						<ProgressBar percentage={percentage} />
						<div style={{ fontSize: '1.2rem', marginLeft: '.5rem' }}>{percentageRound + ' % completed'}</div>
					</div>
				);
			} else return null;
		}
	};

	return (
		<Modal show={props.show} onHide={props.onHide} centered dialogClassName="item-modal">
			<Modal.Header closeButton style={{ padding: '2rem 2rem 2rem 3rem' }}>
				<div style={{ display: 'flex', flexDirection: 'column', width: '70%' }}>
					<div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
						<img src={titleBox} alt="titlebox" style={{ marginRight: '1rem', width: '25px', height: '20px' }} />
						<div style={{ display: 'flex', alignItems: 'center' }}>
							<h3 style={{ margin: 0 }}>{item.title}</h3>
							<img
								src={pencil}
								alt="pencil"
								style={{ cursor: 'pointer', margin: '.2rem 0 0 .6rem', width: '12px', height: '12px' }}
								onClick={() => {
									setTitle(item.title);
									showClass('title-form' + item._id);
								}}
							/>
						</div>
					</div>
					<div style={{ fontSize: '1.2rem', marginLeft: '3.6rem' }}>in the Note: {noteTitleRender()}</div>
					{editTitle()}
				</div>
			</Modal.Header>
			<Modal.Body style={{ padding: '2rem 2rem 4rem 3rem' }}>
				<div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
					<img src={descBox} alt="description box" style={{ marginRight: '1rem', width: '25px', height: '20px' }} />

					<div style={{ display: 'flex', alignItems: 'center' }}>
						<h3 style={{ margin: 0 }}>Description</h3>
						<img
							src={pencil}
							alt="pencil"
							style={{ cursor: 'pointer', margin: '.2rem 0 0 .6rem', width: '12px', height: '12px' }}
							onClick={() => {
								setDescription(item.description);
								toggleEditDiscription(item._id);
							}}
						/>
					</div>
				</div>
				{descriptionRender(item)}
				<div style={{ display: 'flex', alignItems: 'center', margin: '2rem 0 1rem 0' }}>
					<img src={checkListBox} alt="check list box" style={{ marginRight: '1rem', width: '25px', height: '20px' }} />

					<h3 style={{ marginBottom: '0' }}>Checklist</h3>
				</div>
				<div style={{ display: 'flex', flexDirection: 'column', width: '70%', margin: '0 0 2rem 3.6rem' }}>
					{progressBarRender()}
				</div>
				{todoListRender()}
				{todoListForm()}
			</Modal.Body>
		</Modal>
	);
}
