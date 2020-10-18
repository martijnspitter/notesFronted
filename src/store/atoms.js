import { atom } from 'recoil';

export const userAtom = atom({
	key: 'user',
	default: {
		id: null,
		username: null,
		email: null,
		token: null,
		tokenExpiration: null
	}
});

export const projectsAtom = atom({
	key: 'projects',
	default: []
});

export const notesAtom = atom({
	key: 'notes',
	default: []
});

export const itemAtom = atom({
	key: 'item',
	default: {}
});

export const selectedProjectAtom = atom({
	key: 'selectedProject',
	default: undefined
});
