# htemplate
[中文文档](https://github.com/hwh008/htemplate/blob/main/README.cn.md)

**htemplate** is a very distinctive HTML template engine. It's an alternative. It uses pure markup to build web templates and components. We only use basic HTML knowledge. There's no need to write JavaScript.



**htemplate** only employs HTML includes `<template>` `<iframe>` markup, and `h-tmpl`, `h-slot`, `h-import` attributes. It depends on these 5 little keywords to provide a component system for front-end web development. It can make the page structure easier. There's no need for a heavy compile process like Vue or React, and no need for server - side rendering. It supports previewing on a static page.html file.


[htemplate example demo](https://hwh008.github.io/htemplate/htemplate-test.html)


## Get Started

1. Include it from a <script> tag.

```html
<script src="js/htemplate.js" defer></script>
```

2. Write the page: We just write down the key business elements and refer to the component name. Less is clearer, less is better.

```html
 <!-- Set the `h-tmpl` attribute to the component name we want to refer to.
The 3 inner elements are the parameters when the component makes the template. -->
<div h-tmpl="BaseDialog" x-show="showDialog">
      <p>HELLO HTEMPLATE</p>
      <input class="input input-param1" type="text" x-model="param1" placeholder="input something">
      <button class="button is-success">
                foobar submit
      </button>
</div>
```


3. Write the component template: We write more code in the template to make the page more colorful, with better styles and tags.

```html
<!--We write an experience dialog component copied from bulma.css.
 The `h-slot` specifies that its customized child elements are found from the reference-node[2] using a CSS query.
-->
<template id="BaseDialog">
        <div class="modal is-active">
            <div class="modal-background"></div>
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title" h-slot="p">template title</p>
                </header>
                <section class="modal-card-body">
                    <form class="slot-body">
                        <div class="field">
                            <label class="label">PARAM1</label>
                            <div class="control">
                                <input h-slot=".input-param1">
                            </div>
                        </div>
                    </form>
                </section>
                <footer class="modal-card-foot">
                    <div class="buttons">
                        <button h-slot="button"></button>
                        <button class="button">Cancel</button>
                    </div>
                </footer>
            </div>
        </div>
    </template>
```

Okay, take a break. We can click on our page.html opened in the browser to preview what **htemplate** shows.


4. As we progress, we try to put all components into a separate file named components.html to reuse them. Yes, Don't Repeat Yourself (DRY). We use the `<iframe>` tag to load it and the `h-import` attribute to mark it. **htemplate** takes control.

```html
    <iframe id="componentsFrame" h-import src="components.html" style="display: none;"></iframe>
```

When we open the page.html again, a glitch occurs. The iframe's CORS doesn't support local files. So we can put this code on a web server, for example, use Python to run a web server in the source directory.

```bash
#visit `http://127.0.0.1:8080/your_page.html`
python -m http.server
```


5. If you want to manage the **htemplate** engine by yourself, it needs a little modification.

```html
    <script src="js/htemplate.js?export=1"></script>
```

```js
    //call the engine to work
    expandTemplates(document);
```

## Conclusion

This is all the knowledge we need to know. I highly recommend [Alpine.js](https://alpinejs.dev/start-here). 

**htemplate** really works well with it, which greatly improves the actual functions of this HTML template engine.

