# aurelia-binding-loader
Import any module into Aurelia HTML view templates

This loader lets you `<require>` any module from an Aurelia view template. This makes it easy to load configuration, localization, or theme data that may not be relevant to your view model. It can also be stacked with other loaders.

## Installation
First install the loader plugin with jspm.

```
jspm install npm:aurelia-binding-loader
```

Then register the plugin with Aurelia.

```diff
export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging()
+   .plugin('aurelia-binding-loader');

  aurelia.start().then(() => aurelia.setRoot());
}
```

## Use

Import your modules using the `<require>` and specify the `bind` loader. Use the `as` attribute to choose a binding name for the module's exports.

### Basic example
In `aurelia-view.html`:
```html
<template>
  <require from="theme!bind"></require>

  <div class.one-time="theme.header">header</div>
</template>
```
In `theme.js`:
```js
export const theme = {
	header: 'header-class'
};
```

### CSS Modules Example
You can also combine the loader with other loaders. The [CSS modules](http://glenmaddern.com/articles/css-modules) loader processes a CSS file and returns a module with the generated class names. Use the `bind` loader to make that module available in your Aurelia view.

Install the JSPM CSS Modules loader (here we alias it to the name `css-module`):
```
jspm install module=npm:jspm-loader-css-modules
```

In `aurelia-view.html`:
```html
<template>
  <require from="styles.css!module!bind" as="styles"></require>

  <div class.one-time="styles.first">First</div>
  <div class.one-time="styles.second">Second</div>
</template>
```
Note that in the path we specified the `module` loader followed by the `bind` loader. `bind` will process the result of the earlier loader.

In `styles.css`:
```css
.shared {
  border-width: 5px;
  border-style: solid;
}

.first {
  composes: shared;
  border-color: hotpink;
}

.second {
  composes: shared;
  border-color: cornflowerblue;
}
```
