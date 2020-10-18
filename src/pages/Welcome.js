import React from 'react';

export default function Home() {
	return (
		<div
			style={{
				marginTop: '4rem',
				width: '60%',
				alignSelf: 'center',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'flex-start'
			}}
		>
			<div style={{ width: '70%' }}>
				<h1>Welcome on the Notes website!</h1>
				<p>
					With this webapplication you can create projects and fill them with Notes. These Notes can contain text fields
					and todo lists. You can also asign a place for them on the dashboard to signify the importance of a Note.
				</p>
				<p>To start register and login. Have fun and good luck on your projects!</p>
			</div>
		</div>
	);
}
