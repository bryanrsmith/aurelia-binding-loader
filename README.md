# aurelia-css-modules-loader
Import [CSS modules](http://glenmaddern.com/articles/css-modules) into Aurelia HTML view templates

*Warning: This loader is experimental, and may not work properly in all situations.*

## Installation
First install the loader plugin with jspm.

```
jspm install npm:aurelia-css-modules-loader
```

Then register the plugin with Aurelia.

```diff
export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging()
+   .plugin('aurelia-css-modules-loader');

  aurelia.start().then(() => aurelia.setRoot());
}
```

## Use

Import CSS module files in Aurelia templates as normal. Specify the `!module` loader, and add an `as` attribute to set the binding name use for the CSS module.

In `aurelia-view.html`:
```html
<template>
  <require from="styles.css!module" as="styles"></require>

  <div class.one-time="styles.first">First</div>
  <div class.one-time="styles.second">Second</div>
</template>
```

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
