<template>
  <div class="index-wrap">
    <div class="index-left">
      <div class="index-left-block">
        <h2>影视分类</h2>
        <div v-for="movie in movieList">
          <h3>{{ movie.title }}</h3>
          <ul>
            <li class="hovering" v-for="item in movie.list">
              <span @click ="searchForList(item.id+movie.key,0)">{{ item.name }}</span>
              <span v-if="item.hot" class="hot-tag">HOT</span>
            </li>
          </ul>
          <div v-if="!movie.last" class="hr"></div>
        </div>

        <h2>影片搜索</h2>
        <div class="searchPanel">
          <input type="text" v-model="keyword"/>
          <button @click="searchForItem(keyword)">确认</button>
        </div>

        <h2>资源上传</h2>
        <div class="searchPanel">
          <input type="text" placeholder="欢迎分享您的资源" readonly/>
          <button  @click="checkShow()">上传</button>
        </div>
        <h2>FAQ</h2>
        <div class = "faqStyle">
          <span class="tip"><img src="../assets/tip.png"></span><h1>关于本站</h1>
          <p>本站是一个基于星云链构建的影视资源共享平台，您可以在这里上传您拥有的各种视频资源链接。</p>
          <span class="tip"><img src="../assets/tip.png"></span><h1>如何使用</h1>
          <p>只需要通过你的 Nas 钱包上传视频信息和地址，并将钱包地址分享给他人，即可达到分享的目的。</p>
          <p>如果您上传的资源名称已经存在，那么通过搜索得到的资源中会包含您提供的地址，以列表的形式展示出来。</p>
          <p>想要获取地址详情，只需要0.01Nas即可获得地址</p>
          <span class="tip"><img src="../assets/tip.png"></span><h1>如何获取 Nas 钱包</h1>
          <p>点击<a target="_blank" href="http://github.com/ChengOrangeJu/WebExtensionWallet">WebExtensionWallet</a>链接， 根据使用说明，在chrome浏览器中安装 NAS 钱包插件，并生成你的个人钱包。</p>
        </div>
      </div>
    </div>

    <div class="index-right">
      <slide-show :slides="showSlides" :inv="invTime"></slide-show>
      <div class="index-board-list">
        <div class="index-board-item" v-for="(item, index) in restSlides">
          <div class="index-board-item-inner" >
            <img :src="item.imgurl">
            <h2>{{ item.title }}</h2>
            <p>评分：{{ item.score }}</p>
            <div class="index-board-button">
              <router-link class="button" :to="{path: 'detail/'+item.title}">立即查看</router-link>
            </div>
          </div>
        </div>
      </div>
      <div class="changePages">
        <button class="firstPage"  @click ="FirstPage">首页</button>
        <button class="nextPage" @click ="NextPage">Next</button>
        <button class="lastPage" @click ="LastPage">Last</button>
      </div>
    </div>

    <div class="index-float" v-if="isShow">
      <div class="uploadField">
        <h2>标题</h2>
        <input type="text" v-model="curInfo.title"/>
        <h2>评分</h2>
        <input type="text" v-model="curInfo.score"/>
        <h2>剧情</h2>
        <textarea type="text" v-model="curInfo.story"/>
        <h2>图片地址</h2>
        <input type="text" v-model="curInfo.imgurl"/>
        <h2>类别</h2>
        <span>请选择</span>
        <select v-model="curInfo.category" @change="categorySelect">
          <option v-for="item in movieList" v-bind:value="item.key">{{item.title}}</option>
        </select>
        <select v-model="curInfo.subcategory">
          <option v-for="item in subcategoryList" v-bind:value="item.id">{{item.name}}</option>
        </select>
        <h2>资源说明</h2>
        <input type="text" v-model="curInfo.description"/>
        <h2>地址</h2>
        <input type="text" v-model="curInfo.address"/>
        <h1 @click="uploadNewSrc">上传</h1>
        <button class="close" @click="checkShow">关闭</button>
      </div>
    </div>
  </div>
</template>

<script>
import slideShow from '../components/slideShow'

var NebPay = require("../dist/nebpay")
var nebPay = new NebPay()
var Nebulas = require('nebulas')
var Neb = Nebulas.Neb; // Neb

// 创建星云链的远程访问
var neb = new Neb(new Nebulas.HttpRequest("https://testnet.nebulas.io"));
// var neb = new Neb(new Nebulas.HttpRequest("http://127.0.0.1:8685"))

// 创建account对象，用来接受当前用户的钱包地址
var Account = Nebulas.Account;
var api = neb.api;

const dappAddress = "n1yfDX6QDVA1Hv4PYboCjbv39NZakviZdH3"

export default {
  components: {
    slideShow
  },
  mounted () {
    this.searchForList("eamv", 0)
  },
  data () {
    return {
      invTime: 2000,
      isShow: false,
      curNum: 0,
      curCategory: 'eamv',
      subcategoryList:[],
      keyword:'',
      curInfo:{
        title:'',
        score:'',
        story:'',
        description:'',
        category:'',
        subcategory:'',
        imgurl:'',
        address:'',
        author: []
      },
      slides: [{ imgurl: require('../assets/noresource.jpg'), title: ''}],
      movieList: {
        "tv": {
          title: '剧集',
          key:'tv',
          list: [
          { name: '国产', id:'ch', url: '', hot: true},
          { name: '欧美', id:'ea', url: '', hot: true},
          { name: '日韩', id:'jk', url: ''}]
        },
        "mv": {
          title: '电影',
          key:'mv',
          last: true,
          list: [
          { name: '国产', id:'ch', url: '', hot: true},
          { name: '欧美', id:'ea', url: '', hot: true},
          { name: '日韩', id:'jk', url: ''}]
        }
      }
    }
  },
  methods:{
    checkShow:function () {
      this.isShow = !this.isShow
      this.curInfo = {}
    },
    categorySelect: function(){
      for (var x in this.movieList) {
        if (this.curInfo.category == this.movieList[x].key){
            this.subcategoryList = this.movieList[x].list
        }
      }
    },
    cbPush: function (resp) {
      console.log("response of push: " + JSON.stringify(resp))
      var intervalQuery = setInterval(() => {
        api.getTransactionReceipt({hash: resp["txhash"]}).then((receipt) => {
            console.log("判断数据提交到区块链的状态")
            // console.log(receipt)
            if (receipt["status"] === 2) {
                console.log("pending.....")
            } else if (receipt["status"] === 1){
                console.log("交易成功......")
                this.isShow = false
                this.searchForList('eamv', 0)
                //清除定时器
                clearInterval(intervalQuery)
            }else {
                console.log("交易失败......")
                //清除定时器
                clearInterval(intervalQuery)
            }
        });
      }, 5000);
    },
    uploadNewSrc:function (){
      console.log("调用合约的save方法!")
      var value = "0";
      var callFunction = "save"
      var valueArg = {
				title: this.curInfo.title,
				score: this.curInfo.score,
        story: this.curInfo.story,
				category: this.curInfo.category,
				subcategory: this.curInfo.subcategory,
				imgurl: this.curInfo.imgurl,
        description: this.curInfo.description,
				address: this.curInfo.address,
        author: this.curInfo.author
			}

      var callArgs = []
      callArgs.push(this.curInfo.title)
      callArgs.push(JSON.stringify(valueArg))

      nebPay.call(dappAddress, value, callFunction, JSON.stringify(callArgs), {
          listener: this.cbPush        //设置listener, 处理交易返回信息
      });
    },
    searchForItem: function(key){
      this.curCategory = key
      console.log("搜索")
      console.log(key)
      var from = "n1FF1nz6tarkDVwWQkMnnwFPuPKUaQTdptE"
      var value = "0";
      var nonce = "0"
      var gas_price = "1000000"
      var gas_limit = "2000000"
      var callFunction = "get";
      var callArgs = "[\"" + key + "\"]";
      var contract = {
            "function": callFunction,
            "args": callArgs
      }
      neb.api.call(from,dappAddress,value,nonce,gas_price,gas_limit,contract).then( (resp) => {
            console.log("数据查询完成\n")
            console.log(resp)
            console.log(resp["result"])
            if (resp["result"] !== "null") {
                console.log("========================")
                // "Error: empty key"
                if ( resp["result"] == "Error: empty key") {
                  alert("请输入关键词")
                } else {
                  var data = resp["result"];
                  var slideArr = []
                  slideArr.push(JSON.parse(data))
                  this.slides = slideArr
                  console.log(this.slides)
                }
            } else {
                console.log("-------------------------")
                console.log("no result")
                this.slides=[{
                  imgurl: require('../assets/noresource.jpg'),
                  title: ''
                }]
            }
        }).catch(function (err) {
            console.log("error:" + err.message)
        })
    },
    searchForList:function(key,num){
      console.log("搜索")
      console.log(key)
      this.curCategory = key

      var from = "n1FF1nz6tarkDVwWQkMnnwFPuPKUaQTdptE"
      var value = "0";
      var nonce = "0"
      var gas_price = "1000000"
      var gas_limit = "2000000"
      var callFunction = "loadList";
      var callArgs = "[\"" + key + "\"," + num + "]";
      var contract = {
           "function": callFunction,
           "args": callArgs
      }
      neb.api.call(from,dappAddress,value,nonce,gas_price,gas_limit,contract).then( (resp) => {
           console.log("数据查询完成\n")
           console.log(resp)
           console.log(resp["result"])
           if (resp["result"] !== "null" && resp["result"] !== "[]") {
              this.slides = JSON.parse(resp["result"])
           } else {
              console.log("-------------------------")
              console.log("no result")
              this.curNum = 0
              this.slides=[{
                imgurl: require('../assets/noresource.jpg'),
                title: ''
              }]
           }
       }).catch(function (err) {
           console.log("error:" + err.message)
       })
    },
    FirstPage: function(){
      this.searchForList(this.curCategory, 0)
      this.curNum = 0
    },
    NextPage: function(){
      this.curNum += 20
      this.searchForList(this.curCategory, this.curNum)
    },
    LastPage: function(){
      if(this.curNum >= 20){
        this.curNum -= 20
        this.searchForList(this.curCategory, this.curNum)
      }
    }
  },
  computed:{
    showSlides:function(){
      if(this.slides.length <= 4 && this.slides.length>1){
        return this.slides
      }else {
        return this.slides.slice(0,4)
      }
    },
    restSlides:function(){
      if(this.slides.length <= 4){
        return
      }else{
        return this.slides.slice(4, this.slides.length)
      }
    }
  }
}
</script>

<style scoped>
.hovering:hover{
  cursor:pointer;
  background-color:#4fc08d;
  color:#fff;
}
select{
  width:90px;
  height:20px;
  line-height:20px;
  background-color:#fff;
  border:none;
  margin:5px;
}
.index-float{
  width:1200px;
  height:600px;
  display:flex;
  align-items:center;
  background-color:rgba(0,0,0,0.8);
  position:fixed;
  z-index:+10;
}
.close{
  width:50px;
  height:50px;
  position:absolute;
  top:0;
  right:0;
  border:none;
  background-color:rgba(0,0,0,0.9);
  color:#fff;
}
.uploadField{
  width:500px;
  margin:0 auto;
  background-color:#fff;
}
.uploadField h2{
  display:block;
  width:495px;
  height:25px;
  padding-left:5px;
  line-height:25px;
  color:#fff;
  background-color:#4fc08d;
}
.uploadField span{
  font-size:12px;
  margin:0 5px;
}
.uploadField h1{
  display:block;
  width:500px;
  height:30px;
  font-weight:bold;
  font-size:18px;
  text-align:center;
  line-height:30px;
  color:#fff;
  background-color:#4fc08d;
}
.uploadField h1:hover{
  cursor:pointer;
  background-color:#4f6099;
}
.uploadField input{
  width:495px;
  height:30px;
  line-height:30px;
  padding:5px 0px 5px 5px;
  border:none;
}
.uploadField textarea{
  width:495px;
  height:100px;
  line-height:30px;
  padding:5px 0px 5px 5px;
  border:none;
}
.index-wrap {
  width: 1200px;
  margin: 0 auto;
  overflow: hidden;
}
.index-left {
  float: left;
  width: 300px;
  text-align: left;
}
.index-left-block {
  margin: 15px;
  background: #fff;
  box-shadow: 0 0 1px #ddd;
}
.index-left-block .hr {
  margin-bottom: 20px;
}
.index-left-block h2 {
  background: #4fc08d;
  color: #fff;
  padding: 10px 15px;
  margin-bottom: 20px;
}
.index-left-block h3 {
  padding: 0 15px 5px 15px;
  font-weight: bold;
  color: #222;
}
.index-left-block ul {
  padding: 10px 15px;
}
.index-left-block li {
  padding: 5px;
}
.index-board-list {
  overflow: hidden;
}
.index-board-item {
  float: left;
  width: 410px;
  background: #fff;
  box-shadow: 0 0 1px #ddd;
  padding: 20px;
  margin-right: 0px;
  margin-bottom: 20px;
}
.index-board-item-inner {
  height: 125px;
  width: 360px;
  position:relative;
}
.index-board-item-inner img{
  width:125px;
  height:125px;
  margin-right:20px;
  float:left;
}
.index-board-item h2 {
  font-size: 20px;
  font-weight: bold;
  color: #000;
  margin-bottom: 15px;
}
.index-board-button {
  margin-top: 20px;
  position:absolute;
  bottom:0;
  right:120px;
}
.hot-tag{
  background:red;
  color:#fff;
}
.searchPanel input{
  width:200px;
  height:20px;
  border:1px solid #f0f2f5;
  margin:0 5px 20px 5px;
}
.searchPanel button{
  height:25px;
  width:45px;
  border:1px solid #f0f2f5;
}
.index-right {
  float: left;
  width: 900px;
}
.changePages{
  position:fixed;
  top:50%;
  right:0%;
  width:60px;
}
.changePages button{
  width:50px;
  height:50px;
  border:none;
  border-radius:50%;
  margin: 10px 0px;
  background-color:rgba(0,0,0,0.6);
  color:#fff;
  outline:none;
}
.changePages button:hover{
  cursor:pointer;
  background-color:rgba(0,0,0,0.4);

}
.faqStyle{
	padding:0px 10px 10px 10px;
}
.faqStyle a{
	color:#4fc08d;
}
.faqStyle p{
	margin:10px 0px 10px 0px;
}
.faqStyle h1{
	font-size:16px;
	font-weight:bold;
	display:inline-block;
	margin:10px 0px 10px 0px;
	color:#4fc08d;
}
.tip img{
	width:15px;
	height:15px;
	margin-right:5px;
}
</style>
