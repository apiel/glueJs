glueJs
======

Jquery library to bind data together.

Like AngularJs and other JS framework, this little jQuery plugin is build to manipulate data. The plugin will analyse the view (dom) and build a JS object out of it. Then you will be able manipulate the data and populate it to the differente place of your view.

## Balise attributes

- **gl-base** : define the root of your current object
- **gl-path** : define the child of your object tree
- **gl-var** : use a variable as value
- **gl-pull** : get data from your object
 
## Methods

- $.glueJs.set(path, val) : set data for a given path/dom element
- $.glueJs.get(path) : get data for a given path/dom element
- $.glueJs.getPath(dom) : get path from dom element
- $.glueJs.init() : re/initialise glueJs in case you change your dom (view)
- $.glueJs.pull(dom, variables) : get data from your object to a dom element, with variables e.g. {"%var%": "eg", "var": "e.g."}
- $.glueJs.push(dom) : set data for the given dom element
- $(*).glueJs('push') : set data for the given dom element
