import React, { Fragment, useState, useRef } from 'react';
import { useSetRecoilState } from 'recoil';
import { itemAtom } from '../store/atoms';

import { useDrag, useDrop } from 'react-dnd';

import ItemModal from './ItemModal';

import axios from '../api/axios';
import authHeader from '../api/authHeader';

export default function Item({ item, itemIndex, noteIndex, moveItem }) {
	const [ itemShow, setItemShow ] = useState(false);
	const setItem = useSetRecoilState(itemAtom);
	const ref = useRef(null);

	const handleClose = () => {
		setItemShow(false);
		setItem({});
	};

	const handleShow = (id) => {
		// fetching when item is selected
		fetchItem(id);
		// show popup
		setItemShow(true);
	};

	// fetch single item data function
	const fetchItem = async (itemId) => {
		const requestBody = {
			query: `query {item(itemId: "${itemId}"){_id title description createdAt updatedAt dueDate todos{_id text check} creator {username} note{_id title}}}`
		};
		const response = await axios.post('', requestBody, { headers: authHeader() });

		setItem(response.data.data.item);
	};

	const [ , drop ] = useDrop({
		accept: 'ITEM',
		hover(item, monitor) {
			if (!ref.current) return;

			const dragIndex = item.itemIndex;
			const hoverIndex = itemIndex;

			if (dragIndex === hoverIndex) return;

			const hoveredRect = ref.current.getBoundingClientRect();
			const hoverMiddleY = (hoveredRect.bottom - hoveredRect.top) / 2;
			const mousePosition = monitor.getClientOffset();
			const hoverClientY = mousePosition.y - hoveredRect.top;

			if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;

			if (dragIndex > hoverIndex && hoverClientY < hoverMiddleY) return;

			moveItem(item, hoverIndex, noteIndex);

			itemIndex = hoverIndex;
		}
	});

	const [ { isDragging }, drag ] = useDrag({
		item: { type: 'ITEM', ...item, itemIndex, noteIndex },
		collect: (monitor) => ({
			isDragging: monitor.isDragging()
		})
	});

	drag(drop(ref));

	const renderTodos = () => {
		if (item.todos.length === 0) return null;
		const totalTodos = item.todos.length;
		const todosCheck = item.todos.filter((todo) => {
			if (todo.check === true) return 1;
		});
		const totalCheckedTodos = todosCheck.length;
		return `${totalCheckedTodos}/${totalTodos} todos completed`;
	};
	return (
		<Fragment>
			<ItemModal show={itemShow} onHide={handleClose} />
			<div
				className="note-item"
				ref={ref}
				style={{
					opacity: isDragging ? 0.5 : 1,
					padding: '.5rem 1rem',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'flex-start',
					justifyContent: 'center'
				}}
				onClick={() => handleShow(item._id)}
			>
				<div>{item.title}</div>
				<div style={{ fontSize: '1.3rem' }}>{renderTodos()}</div>
			</div>
		</Fragment>
	);
}
