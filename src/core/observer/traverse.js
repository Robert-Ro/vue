/* @flow */

import { _Set as Set, isObject } from '../util/index'
import type { SimpleSet } from '../util/index'
import VNode from '../vdom/vnode'

const seenObjects = new Set()

/**
 * 递归遍历Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
export function traverse (val: any) {
  _traverse(val, seenObjects)
  seenObjects.clear()
}
/**
 * 实际的递归操作
 * @param {*} val
 * @param {*} seen
 * @returns
 */
function _traverse (val: any, seen: SimpleSet) {
  let index, keys
  const isA = Array.isArray(val)
  // 先处理数据有效性
  if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
    return
  }
  // 判断数据是否为响应式数据
  if (val.__ob__) {
    const depId = val.__ob__.dep.id
    if (seen.has(depId)) { // 去重判断
      return
    }
    seen.add(depId)
  }
  // 区分数组和对象
  if (isA) {
    index = val.length
    while (index--) _traverse(val[index], seen)
  } else {
    keys = Object.keys(val)
    index = keys.length
    while (index--) _traverse(val[keys[index]], seen)
  }
}
