// components/SearchInput/SearchInput.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
 
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },


  /**
   * 组件的方法列表
   */
  ready(){

  },

  methods: {

    getInput(e){
      var content = e.detail.value
      //传递输入的搜索内容
      this.triggerEvent("getContent",content)
    }
  }
})
