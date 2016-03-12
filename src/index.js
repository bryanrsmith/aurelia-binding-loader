import { resource } from 'aurelia-templating';

export function configure({ aurelia }) {
	const loader = aurelia.loader;
	loader.addPlugin('module', {
		fetch(address) {
			return loader
				.loadModule(address + '!jspm-loader-css-modules')
				.then(module => ({ [address]: createCSSModulesResource(module.default) }));
		}
	});
}

function createCSSModulesResource(styles) {
	const target = class {};
	resource(new CSSModulesResource(styles))(target);
	return target;
}

class CSSModulesResource {
	constructor(styles) {
		this.styles = styles;
	}

	initialize() {}

	register(registry, name) {
		this.name = name;
		registry.registerViewEngineHooks(this);
	}

	load() {}

	afterCreate(view) {
		const originalBind = view.bind;
		const name = this.name;
		const styles = this.styles;

		view.bind = function(bindingContext, overrideContext, ...rest) {
			overrideContext[name] = styles;
			return originalBind.call(this, bindingContext, overrideContext, ...rest);
		};
	}
}
