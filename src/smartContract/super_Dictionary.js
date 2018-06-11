'use strict'

var AddressDetail = function (text) {
  if (text) {
    var obj = JSON.parse(text)
    this.description = obj.description
    this.address = obj.address
    this.author = obj.author
  } else {
    this.description = ''
    this.address = ''
    this.author = ''
  }
}

AddressDetail.prototype = {
  toString: function () {
    return JSON.stringify(this)
  },
  setAuthor: function (str) {
    this.author = str
  }
}

var ResourceItem = function (text) {
  if (text) {
    var obj = JSON.parse(text)
    this.title = obj.title
    this.score = obj.score
    this.story = obj.story
    this.category = obj.category
    this.subcategory = obj.subcategory
    this.imgurl = obj.imgurl
    this.author = obj.author
  } else {
    this.title = ''
    this.score = ''
    this.story = ''
    this.category = ''
    this.subcategory = ''
    this.imgurl = ''
    this.author = []
  }
}

ResourceItem.prototype = {
  toString: function () {
    return JSON.stringify(this)
  },
  addAuthor: function (str) {
    if (this.author == null) {
      this.author = []
    }
    if (typeof str !== 'undefined') {
      this.author.push(str)
    }
  }
}

var SuperDictionary = function () {
  LocalContractStorage.defineMapProperties(this, {
    'address': {
      parse: function (text) {
        return new AddressDetail(text)
      },
      stringify: function (o) {
        return o.toString()
      }
    },
    'repo': {
      parse: function (text) {
        return new ResourceItem(text)
      },
      stringify: function (o) {
        return o.toString()
      }
    },
    'chmv': {
      parse: function (text) {
        return new ResourceItem(text)
      },
      stringify: function (o) {
        return o.toString()
      }
    },
    'eamv': {
      parse: function (text) {
        return new ResourceItem(text)
      },
      stringify: function (o) {
        return o.toString()
      }
    },
    'jkmv': {
      parse: function (text) {
        return new ResourceItem(text)
      },
      stringify: function (o) {
        return o.toString()
      }
    },
    'chtv': {
      parse: function (text) {
        return new ResourceItem(text)
      },
      stringify: function (o) {
        return o.toString()
      }
    },
    'eatv': {
      parse: function (text) {
        return new ResourceItem(text)
      },
      stringify: function (o) {
        return o.toString()
      }
    },
    'jktv': {
      parse: function (text) {
        return new ResourceItem(text)
      },
      stringify: function (o) {
        return o.toString()
      }
    }
  })
  LocalContractStorage.defineProperties(this, {
    'n_chmv': 0,
    'n_eamv': 0,
    'n_jkmv': 0,
    'n_chtv': 0,
    'n_eatv': 0,
    'n_jktv': 0
  })
}

SuperDictionary.prototype = {
  init: function () {

  },

  save: function (key, value) {
    key = key.trim()
    value = value.trim()

    if (key === '' || value === '') {
      throw new Error('empty key / value')
    }

    // 自动获取当前钱包检测到的登录钱包地址
    var from = Blockchain.transaction.from

    // 按作者储存地址对象
    var newAddress = new AddressDetail(value)
    var keyword = from + key
    newAddress.setAuthor(from)
    this.address.set(keyword, newAddress)

    // 按分类存储备份
    this.saveBycategory(value)

    // 先查找key对应的值是否已经存在
    var resource = this.repo.get(key)

    if (resource) {
      var arr = resource['author']
      if(from.indexOf(arr) < 0){
        // 添加新的作者到作者
        arr.push(from)
        resource['author'] = arr
      }
      // 更新一下图片
      var obj =JSON.parse(value)
      resource['imgurl'] = obj.imgurl
      this.repo.set(key, resource)
    } else {
      // 储存新资源对象到仓库
      var newresource = new ResourceItem(value)
      newresource.addAuthor(from)
      this.repo.set(key, newresource)
    }
  },
  saveBycategory: function (value) {
    var newItem = new ResourceItem(value)

    var val = JSON.parse(value)
    var key = val.subcategory + val.category

    switch (key) {
      case 'chmv': this.n_chmv += 1; this.chmv.set(this.n_chmv, newItem); break
      case 'eamv': this.n_eamv += 1; this.eamv.set(this.n_eamv, newItem); break
      case 'jkmv': this.n_jkmv += 1; this.jkmv.set(this.n_jkmv, newItem); break
      case 'chtv': this.n_chtv += 1; this.chtv.set(this.n_chtv, newItem); break
      case 'eatv': this.n_eatv += 1; this.eatv.set(this.n_eatv, newItem); break
      case 'jktv': this.n_jktv += 1; this.jktv.set(this.n_jktv, newItem); break
    }
  },
  // 查询
  get: function (key) {
    if (key === '') {
      throw new Error('empty key')
    } else {
      return this.repo.get(key)
    }
  },
  // 加载信息
  load: function (key) {
    return this.address.get(key)
  },
  // 获取首页列表
  loadList: function (key, num) {
    switch (key) {
      case 'chmv': return this.searchByOrder('chmv', num); break;
      case 'eamv': return this.searchByOrder('eamv', num); break;
      case 'jkmv': return this.searchByOrder('jkmv', num); break;
      case 'chtv': return this.searchByOrder('chtv', num); break;
      case 'eatv': return this.searchByOrder('eatv', num); break;
      case 'jktv': return this.searchByOrder('jktv', num); break;
    }
  },
  searchByOrder: function (key, num) {
    var arr = []
    for (var i = num; i < num + 20; i++) {
      switch (key) {
        case 'chmv':
          if(this.chmv.get(i.toString()) != null){
            arr.push(this.chmv.get(i.toString()));
          };
          break;
        case 'eamv':
          if(this.eamv.get(i.toString()) != null){
            arr.push(this.eamv.get(i.toString()));
          };
          break;
        case 'jkmv':
          if(this.jkmv.get(i.toString()) != null){
            arr.push(this.jkmv.get(i.toString()));
          };
          break;
        case 'chtv':
          if(this.chtv.get(i.toString()) != null){
            arr.push(this.chtv.get(i.toString()));
          };
          break;
        case 'eatv':
          if(this.eatv.get(i.toString()) != null){
            arr.push(this.eatv.get(i.toString()));
          };
          break;
        case 'jktv':
          if(this.jktv.get(i.toString()) != null){
            arr.push(this.jktv.get(i.toString()));
          };
          break;
      }
    }
    return arr;
  }
}
module.exports = SuperDictionary
