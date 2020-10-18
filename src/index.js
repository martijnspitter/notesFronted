import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import { RecoilRoot } from 'recoil';
import { userAtom, selectedProjectAtom } from './store/atoms';
import PersistenceObserver from './PersistenceObserver';

// set state persistence on user object
const initializeState = ({ set }) => {
	if (localStorage.user) {
		const user = localStorage.user;
		set(userAtom, JSON.parse(user));
	}
	if (localStorage.selectedProject) {
		const selectedProject = localStorage.selectedProject;
		set(selectedProjectAtom, JSON.parse(selectedProject));
	}
};

ReactDOM.render(
	<React.StrictMode>
		<RecoilRoot initializeState={initializeState}>
			<PersistenceObserver />
			<App />
		</RecoilRoot>
	</React.StrictMode>,
	document.getElementById('root')
);
