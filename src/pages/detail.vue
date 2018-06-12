<template>
  <div class="detail-wrap">
    <div class="detail-left">
      <div class="picture-board">
        <img :src="item.imgurl">
      </div>
    </div>
    <div class="detail-right">
      <div class="infoPanel">
        <h1>{{item.title}}</h1>
        <h2>评分：{{item.score}}</h2>
        <h2>故事简介：</h2>
        <h2>{{item.story}}</h2>
      </div>
      <div class="sales-board">
          <addressList :addrAuth = "addrAuthors" :keyword = "thisTitle"></addressList>
      </div>
    </div>
  </div>
</template>

<script>
import addressList from '../components/addressList'

var NebPay = require("../dist/nebpay")
var nebPay = new NebPay()
var Nebulas = require('nebulas')
var Neb = Nebulas.Neb; // Neb

// 创建星云链的远程访问
var neb = new Neb(new Nebulas.HttpRequest("https://testnet.nebulas.io"));
//var neb = new Neb(new Nebulas.HttpRequest("http://127.0.0.1:8685"))

// 创建account对象，用来接受当前用户的钱包地址
var Account = Nebulas.Account;
var api = neb.api;

const dappAddress = "n1yfDX6QDVA1Hv4PYboCjbv39NZakviZdH3"

export default {
  components: {
    addressList
  },
  mounted () {
    this.loadInfo()
  },
  data () {
    return {
      item: {},
      addrAuthors:[],
      thisTitle:''
    }
  },
  methods:{
    loadInfo: function(){
       console.log("搜索")
       var key = this.$route.params.id
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
                var data = resp["result"]
                var obj = JSON.parse(data)
                this.item = obj
                this.addrAuthors = obj.author
                this.thisTitle = obj.title
                console.log(this.addrAuthors)
            } else {
                console.log("-------------------------")
                console.log("no result")
            }
        }).catch(function (err) {
            console.log("error:" + err.message)
        })
    }
  }
}
</script>

<style>
.detail-wrap {
  width: 1200px;
  margin: 0 auto;
  padding-top: 20px;
  overflow: hidden;
}
.detail-left {
  float: left;
  width: 300px;
  text-align: center;
}
.detail-right {
  float: left;
  width: 880px;
  margin-left: 20px;
}
.pixture-board {
  background: #fff;
  padding: 20px 0;
}
.picture-board img{
  width:280px;
  height:280px;
}
.infoPanel{
  width:880px;
  min-height:100px;
}
.infoPanel h1{
  font-size:30px;
  margin-bottom:20px;
}
.infoPanel h2{
  font-size:14px;
  margin-bottom:20px;
}
</style>
