import { Reflect } from "can";

const getDependencies = (vm) => {
	const keys = Reflect.getOwnKeys(vm);

	const dependencyData = {};

	const addDependency = (key, prop) => {
		if (!dependencyData[key]) {
			dependencyData[key] = new Set();
		}

		dependencyData[key].add(prop);
	};

	const addValueDependencyDepsForKey = (key) => (valueDependency) => {
		const valueDepDeps = Reflect.getValueDependencies(valueDependency) || {};
		const valueDepKeyDependencies = valueDepDeps.keyDependencies || [];
		const valueDepValueDependencies = valueDepDeps.valueDependencies || [];

		// recurse over valueDependencies of this valueDependency
		valueDepValueDependencies.forEach(addValueDependencyDepsForKey(key));

		valueDepKeyDependencies.forEach((props) => {
			props.forEach(prop => {
				addDependency(key, prop);
			});
		});
	};

	keys.forEach((key) => {
		// bind to update dependency data
		Reflect.onKeyValue(vm, key, () => {});

		const deps = Reflect.getKeyDependencies(vm, key);
		const keyDependencies = (deps && deps.keyDependencies) || [];
		const valueDependencies = (deps && deps.valueDependencies) || [];

		// iterate over keyDependencies Map
		keyDependencies.forEach((value, prop) => {
			addDependency(key, prop);
		});

		// iterate over valueDependencies Set
		valueDependencies.forEach(addValueDependencyDepsForKey(key));
	});

	let result = {};
	for (let key in dependencyData) {
		result[key] = [ ...dependencyData[key] ];
	}
	return result;
};

export default getDependencies;
