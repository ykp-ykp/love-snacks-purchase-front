// components/Tabs/Tabs.js
Component({
  /**
   * 组件的属性列表，里面存放的是要从父组件中获取的数据
   */
  properties: {
    //这里面的属性需要和父组件中demo3.wxml中的标签属性相同
    //<Tabs tabs="{{tabs}}" catch:itemChange="handleItemChange">
    //其中下面的tabs和上面第一个tabs对应。{{tabs}}是从demo3.js中的data取出来的数据
    tabs:{
      type: Array,
      value:[]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },

  /**
   * 组件的方法列表
   * 1.页面.js文件中，存放事件的函数时，需存放在和data同层级下！！！
   * 2.组件.js文件中，存放事件的函数时，必须存放在methods中！！！
   */
  
  methods: {
    bandleItemTap: function(e){
      /*
      1.在methods中绑定点击事件
      2.获取被点击的索引
      3.获取原数组
      4.对数组中的isActive进行改变 */
      
      const {index} = e.currentTarget.dataset;
      //解构：对复杂类型进行解构的时候 复制了一份变两个引用而已
      //let {tabs} = this.data;
      //let tabs = this.data.tabs;  这种写法和上面是一样的
      
      // let {tabs} = this.data;
      // this.data.tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
      // this.setData({
      //   tabs
      // })
      //上面的代码都挪到了父组件

      //下面这种写法也可以修改tabs
      // var tabs = this.data.tabs;
      // for(var idx = 0;idx<=3;idx++){
      //   if(idx == index)
      //     tabs[idx].isActive = true;
      //   else
      //     tabs[idx].isActive = false;
      // }
      // this.setData({
      //   tabs
      // })

      this.triggerEvent("itemChange",index)//changeItem是触发事件的名称，并不是触发执行的函数
    }
  }
})
