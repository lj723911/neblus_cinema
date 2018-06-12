<template>
  <div>
    <template v-for="(item, index) in address" class= "addr-board">
      <div class="address">
        <div class="description">描述：{{item.description}}</div>
        <span>作者：</span>
        <p>{{item.author}}</p>
        <span>地址：</span>
        <p v-if="showAddress">{{item.address}}</p>
        <button v-if="!showAddress" class="show-me-addr" @click="showAddr(item)">0.01Nas购买地址</button>
      </div>
    </template>
    <button class="show-me-addr" v-if="isShowAddrBoard" @click="showAddrBoard()">点击查看地址</button>
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
      address:[],
      showAddress: false,
      isShowAddrBoard: true
    }
  },
  methods: {
    cbCheck: function(resp){
      console.log("response of push: " + JSON.stringify(resp))
      var intervalQuery = setInterval(() => {
        api.getTransactionReceipt({hash: resp["txhash"]}).then((receipt) => {
            console.log("判断数据提交到区块链的状态")
            // console.log(receipt)
            if (receipt["status"] === 2) {
                console.log("pending.....")
            } else if (receipt["status"] === 1){
                console.log("交易成功......")
                this.showAddress = true
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
    showAddr: function(item){
      var to = item.author
      var value = "0.001"
      nebPay.pay(to, value, {
        listener: this.cbCheck
      })
    },
    showAddrBoard:function(){
      for (var i in this.addrAuth) {
        this.getAddr(this.addrAuth[i]+this.keyword)
      }
      this.isShowAddrBoard = false
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
            if (resp["result"] !== "null") {
                console.log("========================")
                var data = resp["result"]
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
