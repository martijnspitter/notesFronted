import React from 'react';

import './ProgressBar.scss';

const Filler = (props) => {
	return <span className="filler" style={{ width: `${props.percentage}%` }} />;
};

export default function ProgressBar(props) {
	return (
		<div className="dgprogress-bar">
			<Filler percentage={props.percentage} />
		</div>
	);
}
