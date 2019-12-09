// 返回一个布尔值，指示对象是否具有指定的属性作为自身（不继承）属性
function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key)
}


/**
 * @class 双向绑定类 Mvvm
 */
function Mvvm(options) {
  const vm = this;
  vm.$options = options || {};
  vm.data = vm.$options.data;

  Object.keys(vm.data).forEach(key => {
    vm.proxyData(key);
  });
  observe(vm.data, vm);
  new Compile(options.el || document.body, vm);
}

Mvvm.prototype = {
  proxyData(key) { // 通过defineProperty进行数据劫持
    const vm = this;
    Object.defineProperty(vm, key, {
      configurable: false,
      enumerable: true,
      get: () => vm.data[key],
      set: newVal => vm.data[key] = newVal
    })
  }
};

/**
 *  @class 发布类 Observer
 */
function Observer(value) {
  const self = this;
  this.value = value;
  this.dep = new Dep();
  Object.defineProperty(value, '__ob__', {
    value: self,
    enumerable: false,
    configurable: true,
    writable: true
  });
  this.walk(value);
}

Observer.prototype = {
  walk(obj) {
    let self = this;
    Object.keys(obj).forEach(key => {
      self.observeProperty(obj, key, obj[key]);
    });
  },
  observeProperty: (obj, key, val) => {
    let dep = new Dep();
    let childOb = observe(val);
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get: function () {
        if ( Dep.target ) {
          dep.depend();
          if ( childOb ) {
            childOb.dep.depend();
          }
        }

        return val;
      },
      set: function (newVal) {
        if ( val === newVal || (newVal !== newVal && val !== val) ) {
          return;
        }
        val = newVal;
        // 监听子属性
        childOb = observe(newVal);
        // 通知数据变更
        dep.notify();
      }
    })
  }
};

function observe(value) {
  if ( !value || typeof value !== 'object' ) {
    return;
  }
  let ob;
  if ( hasOwn(value, '__ob__') && value.__ob__ instanceof Observer ) {
    ob = value.__ob__;
  } else {
    ob = new Observer(value);
  }
  return ob
}

/**
 * @class 依赖类 Dep
 */
function Dep() {
  this.id = new Date().getTime();
  this.subs = [];
}

Dep.prototype = {
  target: null,
  // 添加订阅者
  addSub(sub) {
    this.subs.push(sub);
  },
  // 移除订阅者
  removeSub(sub) {
    let index = this.subs.indexOf(sub);
    if ( index !== -1 ) {
      this.subs.splice(index, 1);
    }
  },
  // 通知数据变更
  notify() {
    this.subs.forEach(sub => {
      sub.update();
    });
  },
  // 添加Watcher
  depend() {
    Dep.target.addDep(this);
  }
};

/**
 * @class 指令解析类 Compile
 */
function Compile(el, vm) {
  this.$vm = vm;
  this.$el = this.isElementNode(el) ? el : document.querySelector(el);

  if ( this.$el ) {
    this.$fragment = this.nodeFragment(this.$el);
    this.compileElement(this.$fragment);
    // 将文档碎片放回真实dom
    this.$el.appendChild(this.$fragment)
  }
}

Compile.prototype = {
  compileElement(el) {
    let self = this;
    let childNodes = el.childNodes;
    [].slice.call(childNodes).forEach(node => {
      let text = node.textContent;
      let reg = /\{\{((?:.|\n)+?)\}\}/;

      // 如果是element节点
      if ( self.isElementNode(node) ) {
        self.compile(node);
      }
      // 如果是text节点
      else if ( self.isTextNode(node) && reg.test(text) ) {
        // 匹配第一个选项
        self.compileText(node, RegExp.$1);
      }
      // 解析子节点包含的指令
      if ( node.childNodes && node.childNodes.length ) {
        self.compileElement(node);
      }
    });
  },
  // 文档碎片，遍历过程中会有多次的dom操作，为提高性能我们会将el节点转化为fragment文档碎片进行解析操作
  // 解析操作完成，将其添加回真实dom节点中
  nodeFragment(el) {
    let fragment = document.createDocumentFragment();
    let child;

    while( child = el.firstChild ) {
      fragment.appendChild(child);
    }
    return fragment;
  },
  // 指令解析
  compile(node) {
    let nodeAttrs = node.attributes;
    let self = this;

    [].slice.call(nodeAttrs).forEach(attr => {
      let attrName = attr.name;
      if ( self.isDirective(attrName) ) {
        let exp = attr.value;
        let dir = attrName.substring(2);
        // 事件指令
        if ( self.isEventDirective(dir) ) {
          compileUtil.eventHandler(node, self.$vm, exp, dir);
        }
        // 普通指令
        else {
          compileUtil[dir] && compileUtil[dir](node, self.$vm, exp);
        }

        node.removeAttribute(attrName);
      }
    });
  },
  // {{ test }} 匹配变量 test
  compileText(node, exp) {
    compileUtil.text(node, this.$vm, exp);
  },
  // element节点
  isElementNode(node) {
    return node.nodeType === 1;
  },
  // text纯文本
  isTextNode(node) {
    return node.nodeType === 3
  },
  // x-XXX指令判定
  isDirective(attr) {
    return attr.indexOf('x-') === 0;
  },
  // 事件指令判定
  isEventDirective(dir) {
    return dir.indexOf('on') === 0;
  }
};
// 定义$elm，缓存当前执行input事件的input dom对象
let $elm;
let timer = null;
// 指令处理集合
const compileUtil = {
  html(node, vm, exp) {
    this.bind(node, vm, exp, 'html');
  },
  text(node, vm, exp) {
    this.bind(node, vm, exp, 'text');
  },
  model(node, vm, exp) {
    this.bind(node, vm, exp, 'model');

    let self = this;
    let val = this._getVmVal(vm, exp);
    // 监听input事件
    node.addEventListener('input', function (e) {
      let newVal = e.target.value;
      $elm = e.target;
      if ( val === newVal ) {
        return;
      }
      // 设置定时器  完成ui js的异步渲染
      clearTimeout(timer);
      timer = setTimeout(function () {
        self._setVmVal(vm, exp, newVal);
        val = newVal;
      })
    });
  },
  bind(node, vm, exp, dir) {
    let updaterFn = updater[dir + 'Updater'];

    updaterFn && updaterFn(node, this._getVmVal(vm, exp));

    new Watcher(vm, exp, function (value, oldValue) {
      updaterFn && updaterFn(node, value, oldValue);
    });
  },
  // 事件处理
  eventHandler(node, vm, exp, dir) {
    let eventType = dir.split(':')[1];
    let fn = vm.$options.methods && vm.$options.methods[exp];

    if ( eventType && fn ) {
      node.addEventListener(eventType, fn.bind(vm), false);
    }
  },
  // 获取挂载在vm实例上的value]
  _getVmVal(vm, exp) {
    let val = vm;
    exp = exp.split('.');
    exp.forEach(key => {
      key = key.trim();
      val = val[key];
    });
    return val;
  },
  // 设置挂载在vm实例上的value值
  _setVmVal(vm, exp, value) {
    let val = vm;
    exps = exp.split('.');
    exps.forEach((key, index) => {
      key = key.trim();
      if ( index < exps.length - 1 ) {
        val = val[key];
      }
      else {
        val[key] = value;
      }
    });
  }
};
// 指令渲染集合
const updater = {
  htmlUpdater(node, value) {
    node.innerHTML = typeof value === 'undefined' ? '' : value;
  },
  textUpdater(node, value) {
    node.textContent = typeof value === 'undefined' ? '' : value;
  },
  modelUpdater(node, value, oldValue) {
    if ( $elm === node ) {
      return false;
    }
    $elm = undefined;
    node.value = typeof value === 'undefined' ? '' : value;
  }
};

/**
 * @class 观察类
 * @param {[type]}   vm      [vm对象]
 * @param {[type]}   expOrFn [属性表达式]
 * @param {Function} cb      [回调函数(一半用来做view动态更新)]
 */
function Watcher(vm, expOrFn, cb) {
  this.vm = vm;
  expOrFn = expOrFn.trim();
  this.expOrFn = expOrFn;
  this.cb = cb;
  this.depIds = {};

  if ( typeof expOrFn === 'function' ) {
    this.getter = expOrFn
  }
  else {
    this.getter = this.parseGetter(expOrFn);
  }
  this.value = this.get();
}

Watcher.prototype = {
  update() {
    this.run();
  },
  run() {
    let newVal = this.get();
    let oldVal = this.value;
    if ( newVal === oldVal ) {
      return;
    }
    this.value = newVal;
    // 将newVal, oldVal挂载到MVVM实例上
    this.cb.call(this.vm, newVal, oldVal);
  },
  get() {
    Dep.target = this;  // 将当前订阅者指向自己
    let value = this.getter.call(this.vm, this.vm); // 触发getter，将自身添加到dep中
    Dep.target = null;  // 添加完成 重置
    return value;
  },
  // 添加Watcher to Dep.subs[]
  addDep(dep) {
    if ( !this.depIds.hasOwnProperty(dep.id) ) {
      dep.addSub(this);
      this.depIds[dep.id] = dep;
    }
  },
  parseGetter(exp) {
    if ( /[^\w.$]/.test(exp) ) return;

    let exps = exp.split('.');

    // 简易的循环依赖处理
    return function (obj) {
      for( let i = 0, len = exps.length; i < len; i++ ) {
        if ( !obj ) return;
        obj = obj[exps[i]];
      }
      return obj;
    }
  }
};
// trim() 对于各浏览器兼容的处理
if ( !String.prototype.trim ) {
  String.prototype.trim = function () {
    return this.replace(/(^\s+)|(\s+$)/g, "");
  };
}
