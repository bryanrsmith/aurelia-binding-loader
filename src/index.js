import { resource } from 'aurelia-templating';

export function configure({ aurelia }) {
	const loader = aurelia.loader;
	loader.addPlugin('bind', {
		fetch(address) {
			return loader
				.loadModule(address)
				.then(module => ({ [address]: createViewResource(module) }));
		}
	});
}

function createViewResource(module) {
	const target = class {};
	resource(new ViewResourceBinder(module))(target);
	return target;
}

class ViewResourceBinder {
	constructor(module) {
		this.module = module;
	}

	initialize() {}

	register(registry, name) {
		this.name = name;
		registry.registerViewEngineHooks(this);
	}

	load() {}

	afterCreate(view) {
		const { name, module } = this;

		let imports;
		if (module.hasOwnProperty('default')) {
			if (name) {
				imports = module.default;
			} else {
				console.warn('Can\'t import default without a name. Use <require from="my-module" as="name">');
			}
		} else {
			imports = { ...module };
		}

		if (name) {
			imports = { [name]: imports };
		}

		const originalBind = view.bind;
		view.bind = function(bindingContext, overrideContext, ...rest) {
			Object.assign(overrideContext, imports);
			return originalBind.call(this, bindingContext, overrideContext, ...rest);
		};
	}
}
