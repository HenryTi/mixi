### 项目说明
1. 建立一个 /projects 目录
2. 在 /projects 目录下，建/ts-uq子目录。
    1. 从github获取。
    2. https://github.com/HenryTi/ts-uq.git
3. 在 /projects 目录下，建/mixi子目录。
    1. 从github获取。
    2. https://github.com/HenryTi/mixi.git
4. 生成uq接口代码
    1. 在/mixi/src/uqconfig.json中，包含要用到uq名称的定义。
    2. 在/mixi子目录下，运行 node ../../ts-uq/out/index.js。生成的接口代码，在/mixi/src/uqs子目录下
---

### 页面导航
1. react-router-dom导航页面。在浏览器地址栏，会显示页面路径
2. useModal方式，相当于模式对话框。没有页面路径。
    1. let { openModal, closeModal } = useModal();
    2. let result = await openModal(<div>对话框</div>, '标题'); 可以直接返回对话框的结果值
    3. 模式对话框里面，不能调用跟react-router-dom相关的导航操作。也不能用Link。
    4. 模式对话框，仅用来显示信息，或者用户输入信息。
---
### LabelRow 和 LabelRowEdit
1. LabelRow在一行上带label显示值，并可以点击进入下一个页面
2. LabelRowEdit在一行带label显示值，点击进入新页面，可以修改值。返回之后，值自动改变。
3. 多个LabelRow，可以共享一样的显示模板。
4. \mixi\src\app\views\Me\PageEditMe.tsx 有示例
---
### form
1. 主要使用 react-hook-form
2. 简化form的编程，可以用FormRowsView。用json描述form格式和校验
