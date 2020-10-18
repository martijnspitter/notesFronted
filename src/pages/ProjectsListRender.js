import React from 'react';

import { ListGroup, Row, Col } from 'react-bootstrap';

export default function ProjectsListRender(props) {
	return (
		<ListGroup.Item className="projectList-item" style={{ backgroundColor: '#e2e2e2', color: '#0e0a0a' }}>
			<Row>
				<Col style={{ maxWidth: '20%' }}>
					<div>{props.title}</div>
				</Col>
				<Col style={{ maxWidth: '50%' }}>
					<div>{props.description}</div>
				</Col>
				<Col style={{ maxWidth: '15%', textAlign: 'center' }}>
					<div>{props.username}</div>
				</Col>
				<Col style={{ maxWidth: '15%', textAlign: 'center' }}>
					<div>{props.createdAt}</div>
				</Col>
			</Row>
		</ListGroup.Item>
	);
}
