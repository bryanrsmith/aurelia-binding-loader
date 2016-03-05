import { resource } from 'aurelia-templating';

export function configure({ aurelia }) {
	const loader = aurelia.loader;
	loader.addPlugin('module', {
		fetch(address) {
			const loadModule = () => loader.loadModule(address + '!jspm-loader-css-modules');
			return { [address]: createCSSModulesResource(loadModule) };
		}
	});
}

function createCSSModulesResource(load) {
	const target = CSSModuleInjector;
	resource(new CSSModulesResource(load))(target);
	return target;
}

class CSSModulesResource {
	constructor(loadResource) {
		this.loadResource = loadResource;
	}

	initialize(container, target) {
		this.injector = new target();
	}

	register(registry, name) {
		this.injector.name = name;
		registry.registerViewEngineHooks(this.injector);
	}

	load(container) {
		return this.loadResource()
			.then(module => {
				this.injector.resource = module.default;
			});
	}
}

class CSSModuleInjector {
	afterCreate(view) {
		const originalBind = view.bind;
		const name = this.name;
		const resource = this.resource;

		view.bind = function(bindingContext, overrideContext, ...rest) {
			overrideContext[name] = resource;
			return originalBind.call(this, bindingContext, overrideContext, ...rest);
		};
	}
}
