import React, { useEffect, Suspense } from 'react';
import ProjectsListRender from '../pages/ProjectsListRender';

import axios from '../api/axios';

import { Link } from 'react-router-dom';

import './project.scss';

import { useSetRecoilState, useRecoilValue } from 'recoil';
import { projectsAtom, selectedProjectAtom } from '../store/atoms';

import { ListGroup, Row, Col, Container } from 'react-bootstrap';

import { convertDate } from '../helpers/helpers';

export default function Projects() {
	const setProjects = useSetRecoilState(projectsAtom);

	useEffect(
		() => {
			const fetchProjects = async () => {
				const requestBody = {
					query: `query {projects{_id title description createdAt updatedAt creator {username}}}`
				};
				const response = await axios.post('', requestBody);
				setProjects(response.data.data.projects);
			};

			fetchProjects();
		},
		[ setProjects ]
	);

	return (
		<Container style={{ marginTop: '4rem' }}>
			<h1 style={{ marginBottom: '2rem' }}>Projects</h1>

			<Row style={{ padding: '0 1.25rem' }}>
				<Col style={{ maxWidth: '20%' }}>
					<div>Title</div>
				</Col>
				<Col style={{ maxWidth: '50%' }}>
					<div>Description</div>
				</Col>
				<Col style={{ maxWidth: '15%', textAlign: 'center' }}>
					<div>Created By</div>
				</Col>
				<Col style={{ maxWidth: '15%', textAlign: 'center' }}>
					<div>Created At</div>
				</Col>
			</Row>
			<ListGroup>
				<Suspense fallback={<div>Loading..</div>}>
					<ProjectList />
				</Suspense>
			</ListGroup>
		</Container>
	);
}

const ProjectList = () => {
	const projects = useRecoilValue(projectsAtom);
	const setSelectedProject = useSetRecoilState(selectedProjectAtom);

	return projects.map((project) => {
		return (
			<Link
				to={`/project/${project._id}`}
				key={project._id}
				className="projectListLink"
				onClick={() => {
					setSelectedProject(project);
					localStorage.setItem('selectedProject', JSON.stringify(project));
				}}
			>
				<ProjectsListRender
					title={project.title}
					description={project.description}
					username={project.creator.username}
					createdAt={convertDate(project.createdAt)}
				/>
			</Link>
		);
	});
};
