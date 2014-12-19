glueJs
======

Jquery library to bind data together.

As you could do with AngularJs and other JS framework, this little jQuery plugin is build to manipulate data. The plugin will analyse the dom view and build a JS object out of it. Then you will be able manipulate the data and populate it to the differente place of your view.

## Example

```
<table gl-base="abc">
	<tbody>
		<tr gl-path="1"><td gl-path="firstname">Alexandre</td><td gl-path="lastname">Piel</td></tr>
		<tr gl-path="2"><td gl-path="firstname">Jean</td><td gl-path="lastname">Fontaine</td></tr>
		<tr gl-path="3"><td gl-path="firstname">Hello</td><td gl-path="lastname">World</td></tr>
	</tbody>
</table>
```
```
<input name="firstname" type="text" gl-pull="abc.%row%.firstname" placeholder="firstname" />
```

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
