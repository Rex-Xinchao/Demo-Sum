<template>
  <div>123</div>
</template>

<script>
const { LimitPromise } = require("../lib/limitRequest/index");
const limitP = new LimitPromise(3);
const get = (func, url, params) => {
  return limitP.call(func, url, params);
};
const handleEvent = number =>
  new Promise((res, rej) => {
    setTimeout(() => {
      if (number <= 5) {
        res("success number " + number);
      }
      rej("error number " + number);
    }, 1000);
  })
    .then(res => console.log(res))
    .catch(e => console.log(e));
const api = "../../static/a.json";
export default {
  name: "test",
  components: {},
  mounted() {
    let num = 1;
    for (num; num <= 10; num++) {
      get(handleEvent, num);
    }
  }
};
</script>
