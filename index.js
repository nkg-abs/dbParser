const source = require('./structure');
const config = require('./config');
const { map } = require('@laufire/utils/collection');
const process = require('./process');

const parser = (context) => {
	const { source: entities } = context;

	return map(entities, (data, name) =>
		process({
			...context,
			data: {
				config: config.children[name],
				entityData: data,
				entityName: name,
			},
		}));
};

const result = parser({ source, config });

console.log;
