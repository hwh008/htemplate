(() => {

    /**
     * 模板引擎函数，根据模板字符串和slot字符串生成最终字符串
     * @param {string} templateStr - 模板字符串
     * @param {string} slotStr - 调用模板时传递的slot字符串
     * @return {string} 生成的最终字符串
     */
    function renderTemplate(templateStr, slotStr, templateId) {
        // 创建DOMParser实例用于解析HTML字符串
        const parser = new DOMParser();

        // 解析模板字符串为DOM
        const templateDoc = parser.parseFromString(templateStr, 'text/html');

        // 解析slot字符串为DOM
        const slotDoc = parser.parseFromString(slotStr, 'text/html');


        // 查找模板中所有带有h-slot属性的元素
        const templateElement = templateDoc.getElementById(templateId);
        templateDoc.body.innerHTML = templateElement.innerHTML;
        const slotElements = templateDoc.querySelectorAll('[h-slot]');

        // 遍历所有slot元素
        slotElements.forEach(slotElement => {
            const slotName = slotElement.getAttribute('h-slot');

            // 直接使用querySelectorAll，它原生支持各种CSS选择器
            const replacementNodes = slotDoc.querySelectorAll(slotName);

            // 如果找到了对应的元素，则进行替换
            if (replacementNodes && replacementNodes.length > 0) {
                // 我们将使用第一个匹配的replacementNode作为基础
                const firstReplacementNode = replacementNodes[0];

                // 创建一个新元素，使用与replacementNode相同的标签名
                const newElement = templateDoc.createElement(firstReplacementNode.tagName);

                // 复制slotElement的所有属性（除了h-slot）
                const slotAttributes = slotElement.attributes;
                for (let i = 0; i < slotAttributes.length; i++) {
                    const attr = slotAttributes[i];
                    if (attr.name !== 'h-slot') {
                        newElement.setAttribute(attr.name, attr.value);
                    }
                }

                // 复制replacementNode的所有属性
                const replacementAttributes = firstReplacementNode.attributes;
                for (let i = 0; i < replacementAttributes.length; i++) {
                    const attr = replacementAttributes[i];
                    newElement.setAttribute(attr.name, attr.value);
                }

                // 复制replacementNode的内容
                newElement.innerHTML = firstReplacementNode.innerHTML;

                // 替换原来的slotElement
                slotElement.parentNode.replaceChild(newElement, slotElement);
            }
        });

        // 查找并返回生成的内容
        // 移除slotDoc根节点的h-tmpl属性
        const slotRoot = slotDoc.querySelector('body > *');
        if (slotRoot && slotRoot.hasAttribute('h-tmpl')) {
            slotRoot.removeAttribute('h-tmpl');
        }

        // 设置slotDoc的innerHTML为templateDoc的body内容
        slotRoot.innerHTML = templateDoc.body.innerHTML;
        // 复制slotRoot的所有属性到其第一个子元素上
        if (slotRoot && slotRoot.firstElementChild) {
            const slotRootAttributes = slotRoot.attributes;
            for (let i = 0; i < slotRootAttributes.length; i++) {
                const attr = slotRootAttributes[i];
                slotRoot.firstElementChild.setAttribute(attr.name, attr.value);
            }
        }

        // 返回修改后的slotDoc根节点的outerHTML
        return slotRoot.innerHTML;
    }

    /**
     * 展开文档中所有带有h-tmpl属性的节点
     * @param {Document} doc - 要处理的文档对象
     */
    function expandTemplates(doc) {
        // 查找所有带有h-tmpl属性的节点
        const tmplNodes = doc.querySelectorAll('[h-tmpl]');

        // 如果没有找到任何节点，直接返回
        if (tmplNodes.length === 0) {
            return;
        }

        // 遍历所有找到的节点
        tmplNodes.forEach(node => {
            // 获取模板ID
            const templateId = node.getAttribute('h-tmpl');

            // 查找对应的模板元素
            const templateElement = doc.getElementById(templateId);
            if (!templateElement) {
                node.removeAttribute('h-tmpl');
                console.error(`未找到ID为${templateId}的模板元素`);
                return;
            }

            // 获取模板字符串
            const templateStr = templateElement.outerHTML;

            // 获取slot字符串（节点的innerHTML）
            const slotStr = node.outerHTML;

            // 调用renderTemplate函数生成最终HTML
            const resultHTML = renderTemplate(templateStr, slotStr, templateId);

            // 创建一个临时容器来解析生成的HTML
            const tempContainer = doc.createElement('div');
            tempContainer.innerHTML = resultHTML;

            // 替换原始节点
            node.parentNode.replaceChild(tempContainer.firstElementChild, node);
        });

        // 递归调用，处理可能的嵌套模板
        expandTemplates(doc);
    }

    function test_htemplate() {
        // 模板字符串
        const templateStr = `
<template id="TablePage">
<div class="hero">
    <h1 class="title" h-slot="h1"></h1>
    <div class="menu">
        <div h-slot=".menu-item"></div>
    </div>
</div>

<div class="container">
    <table>
        <tr>
            <th>姓名</th>
            <th>年龄</th>
        </tr>
        <tr class="table-row" h-slot="tr"></tr>
        <tr>
            <td>总人数</td>
            <td>{{table.length}}</td>
        </tr>
    </table>
</div>
</template>
`;

        // 调用模板的slot字符串
        const slotStr = `
<div h-tmpl="TablePage" x-data>
    <h1>例子网站</h1>
    <div class="menu-item" x-for="item in menu">
        <a href="{item.href}">{item.text}</a>
    </div>
    <table>
    <tr x-for="item in table">
 
        <td>{item.name}</td>
        <td>{item.age}</td>
  
    </tr>
    </table>
</div>
`;

        // 调用模板引擎函数
        console.log(new DOMParser().parseFromString(slotStr, 'text/html'));
        const result = renderTemplate(templateStr, slotStr, 'TablePage');

        console.log(result);
    }

    /**
     * 从iframe中加载模板并添加到当前页面
     * @param {string} iframe - iframe元素的ID
     * @param {string} doc - 要添加模板的容器ID
     */
    function loadTemplatesFromIframe(iframe, doc) {

        // 等待iframe加载完成
        iframe.onload = function () {
            try {
                // 获取iframe中的document
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

                // 获取所有template元素
                const templates = iframeDoc.querySelectorAll('template');

                if (templates.length === 0) {
                    console.warn('在iframe中未找到template元素');
                    return;
                }

                // 遍历所有template元素
                templates.forEach(template => {
                    // 克隆模板内容
                    const templateContent = doc.importNode(template, true);

                    // 直接将模板内容添加到document.body
                    doc.body.appendChild(templateContent);
                });

                console.log(`iframe成功加载 ${templates.length} 个模板`);
            } catch (error) {
                console.error('加载模板时出错:', error);
            }
        };
    }

    function loadIframeTemplates(doc) {
        // 查找document下所有含有h-import属性的iframe元素
        const iframes = doc.querySelectorAll('iframe[h-import]');

        // 遍历所有找到的iframe元素
        iframes.forEach(iframe => {
            // 调用loadTemplatesFromIframe函数加载模板
            loadTemplatesFromIframe(iframe, doc);
            iframe.removeAttribute("h-import");

        });
    }

    const script = document.currentScript;
    const src = script.getAttribute('src');
    const params = new URLSearchParams(src.split('?')[1]);
    const exportFlag = params.get('export');
    if (exportFlag == 1) {
        document.addEventListener('DOMContentLoaded', function () {
            loadIframeTemplates(document);
        });
        window.expandTemplates = expandTemplates
    }
    else {
        document.addEventListener('DOMContentLoaded', function () {
            loadIframeTemplates(document);
            expandTemplates(document);
        });
    }

})(); //结束包装