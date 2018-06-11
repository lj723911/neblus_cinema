<template>
  <div>
    <template v-for="(item, index) in address" class= "addr-board" v-if="showAddress">
      <div class="address">
        <div class="description">描述：{{item.description}}</div>
        <span>地址：</span>
        <p>{{item.address}}</p>
        <span>作者：</span>
        <p>{{item.author}}</p>
      </div>
    </template>
    <button class="show-me-addr" @click="showAddrBoard">我要看资源</button>
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

const dappAddress = "n1kUiUVMW3EJsv5aP6S1xwMeCdS52WfoAL8"

export default {
  props: {
    addrAuth: {
      type: Array,
      default: []
    },
    keyword:{
      type: String,
      default:''
    }
  },
  data () {
    return {
      showAddress: false,
      address:[]
    }
  },
  methods: {
    showAddrBoard: function(){
      this.showAddress = true
      for (var i in this.addrAuth) {
      console.log(this.addrAuth[i]+this.keyword)
         this.getAddr(this.addrAuth[i]+this.keyword)
      }
    },
    getAddr: function(key){
       console.log("搜索")
       console.log(key)
       var result
       var from = "n1FF1nz6tarkDVwWQkMnnwFPuPKUaQTdptE"
       var value = "0";
       var nonce = "0"
       var gas_price = "1000000"
       var gas_limit = "2000000"
       var callFunction = "load";
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
                var data = resp["result"];
                var slideArr = this.address
                slideArr.push(JSON.parse(data))
                this.address = slideArr
            } else {
                console.log("-------------------------")
                console.log("no result")
                result = ''
                this.slides=[{
                  src: require('../assets/noresource.jpg'),
                  title: ''
                }]
            }
        }).catch(function (err) {
            console.log("error:" + err.message)
        })
    },
  }

}
</script>

<style scoped>
.addr-board{
  width:880px;
  line-height:40px;
}
.addr-board span{
  font-size:20px;
  font-weight:bold;
}
.description {
  font-size:16px;
  font-weight:bold;
  margin-bottom:5px;
}
.address{
  float: left;
  width: 880px;
  background: #fff;
  box-shadow: 0 0 1px #ddd;
  padding: 5px;
  margin-right: 0px;
  margin-bottom: 5px;
}
.address span{
  display:inline-block;
  font-size:16px;
  width:840px;
  margin:10px 0px 0px 0px;
}
.address p{
  word-wrap:break-word;
  padding:2px 5px 0px 0px;
}
.show-me-addr{
  width:880px;
  height:28px;
  border:0px;
  background-color:#4fc08d;
  color:#fff;
  font-weight:bold;
}
.show-me-addr:hover{
  cursor:pointer;
  background-color:#4f6099;
}
</style>
