const { peek } = require('@laufire/utils/debug');

const actions = {
	delete: ({ data }) => peek(data, 'delete'),
	create: ({ data }) => peek(data, 'create'),
	update: ({ data }) => peek(data, 'update'),
	uiDelete: ({ data }) => peek(data, 'uiDelete'),
};

module.exports = actions;
