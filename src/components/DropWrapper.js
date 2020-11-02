import React from 'react';
import { useDrop } from 'react-dnd';

export default function DropWrapper({ onDrop, noteIndex, children }) {
	const [ { isOver }, drop ] = useDrop({
		accept: 'ITEM',

		drop: (item, monitor) => {
			onDrop(item, noteIndex, monitor);
		},
		collect: (monitor) => ({
			isOver: monitor.isOver()
		})
	});

	const style = () => {
		return isOver ? { backgroundColor: '#2274a5' } : {};
	};

	return (
		<div ref={drop} className={'drop-wrapper'} style={style()}>
			{children}
		</div>
	);
}
