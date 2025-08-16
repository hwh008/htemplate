# htemplate

**htemplate** 是一个另类的HTML模板引擎，用原生HTML标签实现组件/模板，我们只会用到HTML基础知识，不需要写JavaScript。


**htemplate** 仅依靠HTML `<template>` `<iframe>` 标签，`h-tmpl` `h-slot` `h-import` 属性，就能提供前端开发的组件系统功能，有效简化页面结构，不需要打包或者服务端渲染，支持静态文件直接预览。


[htemplate 演示demo](https://hwh008.github.io/htemplate/htemplate-test.html)


## 快速开始

1. 首先引入脚本

```html
<script src="js/htemplate.js"></script>
```

2. 编写页面：声明页面元素所使用的组件模板，只需要在页面编写核心元素，有效简化页面结构。

```html
<!-- 通过 `h-tmpl` 属性指定组件模板，里面的3个子元素是页面核心功能，
也是组件用到的参数，分别对应对话框标题、输入框和提交按钮 -->
<div h-tmpl="BaseDialog" x-show="showDialog">
      <p>HELLO HTEMPLATE</p>
      <input class="input input-param1" type="text" x-model="param1" placeholder="input something">
      <button class="button is-success">
                设置
      </button>
</div>
```


3. 编写组件模板：通过组件模板丰富页面的展示效果

```html
<!-- 我们给BaseDialog组件编写了丰富的样式，
自定义子元素通过 `h-slot` 属性从模板的引用节点[2]进行查找，查找方式和 CSS query 相同-->
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


现在，我们可以用浏览器直接打开刚刚编辑的 html 文件看看模板引擎的效果。

4. 接下来我们想把所有组件模板提取到一个单独的文件进行复用，全部放到了components.html，用 `<iframe>` 标签加载它， `h-import` 标记， **htemplate** 会搞定一切。

```html
    <iframe id="componentsFrame" h-import src="components.html" style="display: none;"></iframe>
```

再次用浏览器打开我们的页面，脚本在执行时会遇到iframe同源问题。为了成功打开，需要把这些文件和脚本放到网页服务器目录下面，比如用python在当前代码目录打开一个web server。

```bash
#访问 `http://127.0.0.1:8080/your_page.html`
python -m http.server
```

5. 如果你想自己掌握模板引擎运行的时机，需要调整一点代码

```html
    <script src="js/htemplate.js?export=1"></script>
```

```js
    //调用模板引擎
    expandTemplates(document);
```

## 总结
这就是这个模板引擎的全部，它和 [Alpine.js](https://alpinejs.dev/start-here) 这种简单的 MVVM 框架非常搭配，极大增强了组件的实际使用范围。
