import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import './App.scss';

import Register from './pages/Register';
import Login from './pages/Login';
import Navigation from './pages/NavBar';
import Welcome from './pages/Welcome';
import Projects from './components/Projects';
import AddProject from './pages/AddProject';
import Project from './components/Project';

function App() {
	return (
		<DndProvider backend={HTML5Backend}>
			<BrowserRouter>
				<div className="app-container">
					<Navigation />

					<Routes>
						<Route path="/" element={<Welcome />} />
						<Route path="/register" element={<Register />} />
						<Route path="/login" element={<Login />} />
						<Route path="/projects" element={<Projects />} />
						<Route path="/project/:id" element={<Project />} />
						<Route path="/addproject" element={<AddProject />} />
					</Routes>
				</div>
			</BrowserRouter>
		</DndProvider>
	);
}

export default App;
