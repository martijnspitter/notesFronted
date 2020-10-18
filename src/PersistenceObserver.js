import { useRecoilTransactionObserver_UNSTABLE } from 'recoil';

// unstable Persistence observer from recoil documentation

function PersistenceObserver() {
	useRecoilTransactionObserver_UNSTABLE(({ snapshot }) => {
		for (const modifiedAtom of snapshot.getNodes_UNSTABLE({ isModified: true })) {
			const atomLoadable = snapshot.getLoadable(modifiedAtom);
			if (atomLoadable.state === 'hasValue') {
				localStorage.setItem(modifiedAtom.key, JSON.stringify(atomLoadable.contents));
			}
		}
	});
	return null;
}

export default PersistenceObserver;
