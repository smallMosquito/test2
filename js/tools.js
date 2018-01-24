//选中文本 点击文本所属类型 对应显示不同的背景色
//获得鼠标选中内容
function getSelectionField(e) {
    var selection = '';
    selection = getIeSelection(e);
    if (selection == '') {
        selection = getFireFoxSelection(e);
    }
    // console.log("选中的文本-----------" + selection);
    return selection;     //字符串格式
}
//获得鼠标选中内容  兼容IE
function getIeSelection(e) {
    if (window.getSelection) {
        return window.getSelection().toString();
    }
    else if (document.getSelection) {
        return document.getSelection();
    } else if (document.selection) {
        return document.selection.createRange().text;
    }
}
//获得鼠标选中内容  兼容火狐
function getFireFoxSelection(e) {
    if (e.selectionStart != undefined && e.selectionEnd != undefined) {
        var start = e.selectionStart;
        var end = e.selectionEnd;
        return e.value.substring(start, end);
    } else {
        return "";
    }
}
//定义标签名对应的颜色  从后台获取
var data = {
    labels:{
        "标题":"#335cad",
        "趋势(标题内)":"#ad8533",
        "发布机构":"#ffadff",
        "作者姓名":"#33adff",
        "岗位":"#ffadad",
        "电话":"#5c5cff",
        "邮箱":"#d65c5c",
        "发布时间":"#5cad33",
        "证券名称":"#855cff",
        "证券代码":"#ffcc00"
    },
}
//根据数据 动态生成 文档内容标签
var docContenLabel = template("labelTemplate",data);
var textContain = document.querySelector(".first-tool .text-contain>table");
textContain.innerHTML = docContenLabel;


var n = 0;  //计数器
var obj1 = {};  //用来存储每块选中文本的 被选择的按钮
var bgc = "";
/*document.onmouseup = function (e) {
    var e = e || window.event;
    stopBubble(e);
    var str = getSelectionField(e);
    //如果有文本被选中   n++
    if (str != "") {
        n++;
        //截取选中文本 并在两端添加span标签  给span添加边框
        var len = str.length;
        var target = e.target;
        var position = target.innerHTML.indexOf(str);  //选中文本的开始位置
        var position2 = position + len;    //选中文本的结束位置
        var tempstr1 = target.innerHTML.substring(0, position);    //选中文本的前一段字符
        var tempstr2 = target.innerHTML.substring(position2);    //选中文本的后一段字符
//根据数据 动态生成 文档内容标签选择按钮
        var docContenSelectLabel = template("labelSelectTemplate",data);
        str = "<div class='sele-box sele"+n+"'><span class='sele-border' style='border: 1px dashed grey'>" + str + "</span>" +
            "<div class=\"select-label\">\n" +
            docContenSelectLabel +
            "</div></div>";
        //并在两端添加span标签  给span添加边框
       /!* str = "<div class='sele-box sele"+n+"'><span class='sele-border' style='border: 1px dashed grey'>" + str + "</span>" +
            "<div class=\"select-label\">\n" +
            "    <ul>\n" +
            "        <li><input type=\"radio\" name=\"radio"+n+"\">标题</li>\n" +
            "        <li><input type=\"radio\" name=\"radio"+n+"\">趋势(标题内)</li>\n" +
            "        <li><input type=\"radio\" name=\"radio"+n+"\">发布机构</li>\n" +
            "        <li><input type=\"radio\" name=\"radio"+n+"\">作者姓名</li>\n" +
            "        <li><input type=\"radio\" name=\"radio"+n+"\">岗位</li>\n" +
            "        <li><input type=\"radio\" name=\"radio"+n+"\">电话</li>\n" +
            "        <li><input type=\"radio\" name=\"radio"+n+"\">邮箱</li>\n" +
            "        <li><input type=\"radio\" name=\"radio"+n+"\">发布时间</li>\n" +
            "        <li><input type=\"radio\" name=\"radio"+n+"\">证券名称</li>\n" +
            "        <li><input type=\"radio\" name=\"radio"+n+"\">证券代码</li>\n" +
            "        <li><input type=\"radio\" name=\"radio"+n+"\" class='select-label-cancel'>取消标签</li>\n" +
            "    </ul>\n" +
            "</div></div>";*!/
        target.innerHTML = tempstr1 + str + tempstr2;
    }
    //查询页面中的sele-box 并给他添加index属性  相对于它的父盒子内它之前的文字宽度进行边偏移
    var seleBoxes = document.querySelectorAll(".sele-box");
    for (var i=0; i<seleBoxes.length; i++) {
        seleBoxes[i].index = i;
        //它之前的文字节点  有和没有两种情况
        var textNode = seleBoxes[i].previousSibling;
        console.log(textNode.offsetWidth);
        console.dir(textNode);
        if(textNode) {
            var textNumber = textNode.nodeValue.length;
            var width = window.getComputedStyle(seleBoxes[i].parentNode,null).getPropertyValue("font-size");
            var leftWidth = textNumber * parseFloat(width)/2;
            seleBoxes[i].style.left = leftWidth + "px";
            console.log(width);
            console.log(leftWidth);
        } else if(!textNode) {
            seleBoxes[i].style.left = 0;
        }
        //计算它的父盒子的实际宽度
        // seleBoxes[i].style.left = seleBoxes[i].parentNode.offsetWidth + "px";
        // console.log(seleBoxes[i].parentNode.offsetWidth);
    }
    //勾选标注 给select-label注册点击事件 给对应的报告内部标签添加样式
    //查询出页面所有的select-label盒子
    var selectLabels = document.querySelectorAll(".select-label");
    for(var i=0; i<selectLabels.length; i++) {
        //查询出每个select-label盒子中的被选中的li元素
        var lis = selectLabels[i].querySelectorAll("li");
        for (var j=0; j<lis.length; j++) {
            lis[j].index = j;    //给出每个li的索引
            var checkbox = lis[j].firstElementChild   //获得单选按钮
            checkbox.onclick = function () {
                //排他  获得该点击对象的父容器盒子
                var parent = this.parentNode.parentNode;
                var children = parent.children;
                for(var i=0 ; i< children.length; i++) {
                    var tempCheckbox = children[i].firstElementChild;
                    // tempCheckbox.setAttribute("checked","false");
                    tempCheckbox.removeAttribute("checked");
                }
                if(this.checked) {
                    this.setAttribute("checked","true");
                    var parentSeleBox = this.parentNode.parentNode.parentNode.parentNode;
                    //将用户选中的文本 对应的工具栏选择的按钮的索引 以键值对的形式存储起来
                    obj1["select"+parentSeleBox.index] = this.parentNode.index;
                    console.log(obj1);
                    addBgc(parentSeleBox,this.parentNode.index);
                    //获得这个按钮的祖先元素 sele-box总盒子  this.parentNode.parentNode.parentNode.parentNode
                    parentSeleBox.style.backgroundColor = bgc;
                    //如果这个被选中的按钮是 取消按钮 即class类名为select-label-cancel的 则移除选中文本两端的span标签
                    if(this.className == "select-label-cancel") {
                        //获得被选中的文本内容
                        var seleText = parentSeleBox.querySelector(".sele-border").innerText;
                        //向这个sele-box前 插入被选中的文本节点
                        //首先创建这个文本节点
                        var seleTextNode = document.createTextNode(seleText);
                        //再插入
                        parentSeleBox.parentNode.insertBefore(seleTextNode,parentSeleBox);
                        // preSib.appendChild(seleTextNode);
                        parentSeleBox.parentNode.removeChild(parentSeleBox);
                    }
                }
            }
        }
    }
};*/

//     区域选中
(function () {
    //用户导入文档区域的选中
    var viewer = document.getElementById("viewer");
    //相对于每个页面进行偏移
    var pages = viewer.querySelectorAll(".page");
    //给每个页面的textLayer注册鼠标按下事件
    for(var i=0; i<pages.length; i++) {
        var page = pages[i];
        var textLayer = page.querySelector(".textLayer");
        textLayer.onmouseup = function () {
            break;
            var e = e || window.event;
            stopBubble(e);
            var str = getSelectionField(e);
            if (str != "") {
                _contentScript.onRuntimeMessage({id:"get_selection_range"},null);
                _contentScript.onRuntimeMessage({id:"create_highlight",range:g1,highlightId:Math.random(),className:"red"},null);
                window.getSelection().removeAllRanges();  //兼容处理
            }
        }
        var closes = document.querySelectorAll(".close");
    }
    // viewer.onmousedown = function () {
    //
    //     var selList = [];
    //     //获取页面中的文本
    //     var fileNodes = this.getElementsByTagName("div");
    //
    //     for (var i = 0; i < fileNodes.length; i++) {
    //         // if (fileNodes[i].className.indexOf("fileDiv") == -1) {
    //         //     fileNodes[i].className = "fileDiv";
    //             //将 类名是fileDiv的 div 存储到selList中
    //             selList.push(fileNodes[i]);
    //         // }
    //     }
    //
    //     //假设被选中
    //     var isSelect = true;
    //     var evt = window.event || arguments[0];
    //     var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
    //     var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
    //     var startX = evt.pageX || evt.clientX + scrollX;
    //     var startY = evt.pageY || evt.clientY + scrollY;
    //     //创建鼠标拖动产生的区域框 selDiv
    //     var selDiv = document.createElement("div");
    //     //设置创建的 区域框selDiv 的样式
    //     selDiv.style.cssText = "position:absolute;width:0px;height:0px;font-size:0px;margin:0px;padding:0px;border:1px dashed #0099FF;background-color:#C3D5ED;z-index:1000;filter:alpha(opacity:60);opacity:0.6;display:none;";
    //     selDiv.id = "selectDiv";
    //     this.appendChild(selDiv);
    //
    //     //设置 区域框的左边距 和 右边距
    //     selDiv.style.left = startX + "px";
    //     selDiv.style.top = startY + "px";
    //
    //     var _x = null;
    //     var _y = null;
    //     stopBubble(evt);
    //
    //     this.onmousemove = function () {
    //         evt = window.event || arguments[0];
    //         if (isSelect) {
    //             if (selDiv.style.display == "none") {
    //                 selDiv.style.display = "";
    //             }
    //             var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
    //             var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
    //             var _x = evt.pageX || evt.clientX + scrollX;
    //             var _y = evt.pageY || evt.clientY + scrollY;
    //             /* _x = (evt.x || evt.clientX);
    //              _y = (evt.y || evt.clientY);*/
    //             selDiv.style.left = Math.min(_x, startX) + "px";
    //             selDiv.style.top = Math.min(_y, startY) + "px";
    //             selDiv.style.width = Math.abs(_x - startX) + "px";
    //             selDiv.style.height = Math.abs(_y - startY) + "px";
    //
    //             /*// ---------------- 关键算法 ---------------------
    //             var _l = selDiv.offsetLeft, _t = selDiv.offsetTop;
    //             var _w = selDiv.offsetWidth, _h = selDiv.offsetHeight;
    //             for (var i = 0; i < selList.length; i++) {
    //                 var sl = selList[i].offsetWidth + selList[i].offsetLeft;
    //                 var st = selList[i].offsetHeight + selList[i].offsetTop;
    //                 if (sl > _l && st > _t && selList[i].offsetLeft < _l + _w && selList[i].offsetTop < _t + _h) {
    //                     if (selList[i].className.indexOf("seled") == -1) {
    //                         selList[i].className = selList[i].className + " seled";
    //                     }
    //                 } else {
    //                     if (selList[i].className.indexOf("seled") != -1) {
    //                         selList[i].className = "fileDiv";
    //                     }
    //                 }
    //             }*/
    //
    //         }
    //         stopBubble(evt);
    //     }
    //
    //     this.onmouseup = function () {
    //         // ---------------- 关键算法 ---------------------
    //         var _l = selDiv.offsetLeft, _t = selDiv.offsetTop;
    //         var _w = selDiv.offsetWidth, _h = selDiv.offsetHeight;
    //         for (var i = 0; i < selList.length; i++) {
    //             var sl = selList[i].offsetWidth + selList[i].offsetLeft;
    //             var st = selList[i].offsetHeight + selList[i].offsetTop;
    //             if (sl > _l && st > _t && selList[i].offsetLeft < _l + _w && selList[i].offsetTop < _t + _h) {
    //                 if (selList[i].className.indexOf("seled") == -1) {
    //                     selList[i].className = selList[i].className + " seled";
    //                 }
    //             } else {
    //                 if (selList[i].className.indexOf("seled") != -1) {
    //                     // selList[i].className = "fileDiv";
    //                 }
    //             }
    //         }
    //
    //         isSelect = false;
    //         if (selDiv) {
    //             this.removeChild(selDiv);
    //             // showSelDiv(selList);
    //         }
    //         selList = null, _x = null, _y = null, selDiv = null, startX = null, startY = null, evt = null;
    //     }
    // }
})();


//     实现报告整体标签的层级选择
var table = document.querySelector(".mulTandem-table");
console.log(table);
var trs = table.querySelectorAll("tr");
var seleMulBoxes = document.querySelectorAll(".menu-sub");
//遍历trs 给tr的第二个td注册点击事件
for (var i=1; i<trs.length-1; i++) {
    var td = trs[i].querySelector("td:last-of-type");
    console.log(td);
    td.onclick = function (e) {
        //阻止冒泡
        var e = e || window.event;
        stopBubble(e)
        //先让.menu-sub 都隐藏
        for(var j=0; j<seleMulBoxes.length; j++) {
            seleMulBoxes[j].style.display = "none";
        }
        //让当前的显示
        var seleMulBox = this.querySelector(".menu-sub");
        seleMulBox.style.display = "block";
        //给报告内标签添加点击事件
        //给报告内标签内的h3、h4、 如果存在三级标签则也包括三级标签里的li，如果不存在三级标签则包括二级标签内的li 添加点击事件
        var h3s = this.querySelectorAll("h3");
        for (var i=0 ;i<h3s.length; i++) {
            h3s[i].onclick = function (e) {
                //阻止冒泡
                var e = e || window.event;
                stopBubble(e)
                //找到这个h3对应的td父元素
                var parentTd3 = this.parentNode.parentNode.parentNode.parentNode;
                //找到td对应要显示的文本
                var p = parentTd3.querySelector("p");
                p.innerText = this.innerText;
                //然后让报告内.menu-sub盒子隐藏
                parentTd3.querySelector(".menu-sub").style.display = "none";
            }
        }
        var h4s = this.querySelectorAll("h4");
        for (var i=0 ;i<h4s.length; i++) {
            h4s[i].onclick = function () {
                //阻止冒泡
                var e = e || window.event;
                stopBubble(e)
                //找到这个h4对应的td父元素
                var parentTd4 = this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
                //找到td对应要显示的文本
                var p = parentTd4.querySelector("p");
                //有h4说明是三级标题 有h3 要将h3与h4拼接显示
                //找到这个h4对应的h3的父元素
                var h4H3Parent = this.parentNode.parentNode.parentNode.parentNode;
                p.innerText = h4H3Parent.querySelector("h3").innerText + this.innerText;
                //然后让报告内.menu-sub盒子隐藏
                parentTd4.querySelector(".menu-sub").style.display = "none";
            }
        }
        //查找当前td的第一层li集合
        var lis = this.querySelectorAll(".menu-sub-first>li");
        //判断每个li里有没有h4标签
        for(var i=0; i<lis.length; i++) {
            var h4 = lis[i].querySelector("h4");
            //如果有h4 给第三层下的li注册点击事件
            if(h4) {
                var thirdUls = lis[i].querySelectorAll(".menu-sub-third");
                var thirdLis = [];
                for(var j=0; j<thirdUls.length; j++) {
                    for(var m=0; m<thirdUls[j].children.length; m++) {
                        thirdLis.push( thirdUls[j].children[m] );
                    }
                }
                //注册点击事件
                for(var j=0; j<thirdLis.length; j++) {
                    thirdLis[j].onclick = function (e) {
                        //阻止冒泡
                        var e = e || window.event;
                        stopBubble(e);
                        //找到这个li对应的td父元素
                        var parentTdLi = this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
                        //找到td对应要显示的文本
                        var p = parentTdLi.querySelector("p");
                        //找到这个li对应的h4的父元素
                        var liH4Parent = this.parentNode.parentNode;
                        //找到这个h4对应的h3的父元素
                        var liH4H3Parent = this.parentNode.parentNode.parentNode.parentNode.parentNode;
                        p.innerText = liH4H3Parent.querySelector("h3").innerText + liH4Parent.querySelector("h4").innerText + ">" + this.innerText;
                        //然后让报告内.menu-sub盒子隐藏
                        parentTdLi.querySelector(".menu-sub").style.display = "none";
                    }
                }
            } else if (!h4) {//如果没有h4 给第二层下的li注册点击事件
                var secondUls = lis[i].querySelectorAll(".menu-sub-second");
                var secondLis = [];
                for(var j=0; j<secondUls.length; j++) {
                    for(var m=0; m<secondUls[j].children.length; m++) {
                        secondLis.push( secondUls[j].children[m] );
                    }
                }
                //注册点击事件
                for(var j=0; j<secondLis.length; j++) {
                    secondLis[j].onclick = function (e) {
                        //阻止冒泡
                        var e = e || window.event;
                        stopBubble(e);
                        //找到这个li对应的td父元素
                        var parentTdLi = this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
                        //找到td对应要显示的文本
                        var p = parentTdLi.querySelector("p");
                        //找到这个li对应的h3的父元素
                        var liH3Parent = this.parentNode.parentNode.parentNode;
                        p.innerText = liH3Parent.querySelector("h3").innerText + this.innerText;
                        //然后让报告内.menu-sub盒子隐藏
                        parentTdLi.querySelector(".menu-sub").style.display = "none";
                    }
                }
            }

        }
    }
}
//文档的点击事件
document.onclick = function (e) {
    var e = e || window.event;
    //判断 如果点击的对象不是td 则让.menu-sub 都隐藏
    for (var i=1; i<trs.length-1; i++) {
        var td = trs[i].querySelector("td:last-of-type");
        if(e.target != td) {
            for(var j=0; j<seleMulBoxes.length; j++) {
                seleMulBoxes[j].style.display = "none";
            }
        }
    }
}


//阻止事件冒泡函数
function stopBubble(e) {
    if (e && e.stopPropagation)
        e.stopPropagation();
    else
        window.event.cancelBubble = true;
}