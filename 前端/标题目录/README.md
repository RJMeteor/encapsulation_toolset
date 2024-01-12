> 在我们web项目中，涉及根据内容生成标题目录结构，标题目录追踪切换的工具，我手写了相关前端实现代码

## tocbot.ts 

生成标题目录树形结构

### 使用方法

~~~javascript
import {TocbotTemplate} from "tocbot.ts";
const tocbotInstance = new TocbotTemplate();

const tocbotDoms =Array.from(domcument.querySelectorAll("h1,h2,h3,h4,h5,h6"));
for(let dom of tocbotDoms){
 const leval = +dom.nodeName.toLowerCase().substr(1);
 const raw = dom.textContent;   
 const originId = `${leval}+${raw}`;
 tocbotInstance.analysis(leval,raw,originId)   
}
const tocbot = tocbotInstance.getTocbot()
console.log(tocbot)  //标题目录结构对象
~~~

### 类方法

- #### analysis

  实际生成树形结构入口函数

  |   参数   |  类型  |                       说明                       |
  | :------: | :----: | :----------------------------------------------: |
  |  level   | number |    标题层级，例如`h1`层级`1`，`h2`层级`2`...     |
  |   raw    | string | 标题标签内的内容，例如`<h1>hello<h1>`内容`hello` |
  | originId | string |             `level`拼接`raw`的字符串             |

- #### getTocbot

  得到树形结构对象



## scrollListener.ts

标题目录所在位置标注

### 使用方法

ScrollListener类中有依赖vue3的`watch`方法

~~~javascript
import {ScrollListener} from "scrollListener.ts";
const source = document,getElementById("source")
const other = document,getElementById("other")
const tocbotChange = new ScrollListener(source,other);
~~~

#### 构造方法

|  参数  |         类型         |                        说明                        |
| :----: | :------------------: | :------------------------------------------------: |
| source |       Element        |                要监听的目标元素区域                |
|  raw   | Element[]\|undefined | 当目标区域不位于页面顶部，则提供目标区域上面的元素 |





