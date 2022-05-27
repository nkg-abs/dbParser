const { map, translate, result } = require('@laufire/utils/collection');
const { resolve } = require('@laufire/utils/path');
const { isDefined } = require('@laufire/utils/reflection');
const getAction = require('./getAction');

// eslint-disable-next-line max-lines-per-function
const entity = (context) => {
	const {
		source,
		config,
		data: {
			entityData,
			entityName,
			config: currentConfig,
			parentStatus = 'sync',
		},
	} = context;
	const { statusKey } = config;

	const { [statusKey]: currentStatus, id } = entityData;
	const { maping, children } = currentConfig;
	const maped = translate(entityData, maping);
	const action = getAction({
		...context,
		data: {
			parentStatus: parentStatus,
			currentStatus: currentStatus,
			idExists: isDefined(id),
		},
	});

	return map(children, ({ path }, name) => process({
		...context,
		data: {
			entityData: result(source[entityName], path),
			entityName: name,
			config: result(currentConfig, resolve(`children/${ path }`)),
			parentStatus: currentStatus,
		},
	}));
};

// eslint-disable-next-line max-lines-per-function
const collection = (context) => {
	const { config: { statusKey }} = context;
	const { data: { parentStatus, entityData, config }} = context;
	const { children } = config;

	return map(entityData, (entity) => {
		const { [statusKey]: currentStatus, id } = entity;

		const action = getAction({
			...context,
			data: {
				parentStatus: parentStatus,
				currentStatus: currentStatus,
				idExists: isDefined(id),
			},
		});

		return map(children, (data, name) => process({
			...context,
			data: {
				config: config.children[name],
				entityData: entity[name],
				entityName: name,
				parentStatus: currentStatus,
			},
		}));
	});
};

const process = (context) => {
	const { data: { config: { type }}} = context;
	const typeProcessors = {
		entity,
		collection,
	};

	return typeProcessors[type](context);
};

module.exports = process;
