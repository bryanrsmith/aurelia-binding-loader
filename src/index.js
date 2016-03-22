import { resource } from 'aurelia-templating';
import * as LogManager from 'aurelia-logging';

const logger = LogManager.getLogger('aurelia-binding-loader');

export function configure({ aurelia }) {
	const loader = aurelia.loader;
	loader.addPlugin('bind', {
		fetch(address) {
			return loader
				.loadModule(address)
				.then(module => ({ [address]: createViewResource(module, address) }));
		},
	});
}

function createViewResource(module, address) {
	@resource({
		initialize() {},
		load() {},
		register(registry, name) {
			const bindings = getBindings(name, module, address);
			registry.registerViewEngineHooks({
				beforeBind(view) {
					Object.assign(view.overrideContext, bindings);
				},
			});
		},
	})
	class Target {}

	return Target;
}

function getBindings(name, module, address) {
	let imports;
	if (module.hasOwnProperty('default')) {
		if (name) {
			imports = module.default;
		} else {
			logger.error(`${address}: Can't import default without a name. Use <require from="my-module!bind" as="name">`);
		}
	} else {
		imports = { ...module };
	}

	if (name) {
		imports = { [name]: imports };
	}

	return imports;
}
