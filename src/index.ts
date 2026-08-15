// Node 半：纯客户端插件的 node 半边是一个空 apply，
// 它的存在只是为了让它能出现在 host 的 cordis.yml 与 Loader 中，
// 真正的浏览器半边经 `exports["./client"]` 出货。
export default {
  apply() {},
}
