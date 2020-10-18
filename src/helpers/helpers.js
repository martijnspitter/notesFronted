export const convertDate = (date) => {
	const newDate = new Date(date);
	return new Intl.DateTimeFormat('en-GB', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit'
	}).format(newDate);
};

// remove 'hidden' from element. Actual hiding happens with css
export const showClass = (tag) => {
	document.getElementById(tag).className = 'add-item';
};

// add 'hidden' on element. Actual hiding happens with css
export const hideClass = (tag) => {
	document.getElementById(tag).className = 'add-item hidden';
};
