/*
 * @Author: eds
 * @Date: 2020-08-21 18:30:30
 * @LastEditTime: 2020-09-04 15:08:51
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\store\modules\map\actions.js
 */
import * as types from "./mutation-types";
import { getAreaCodeList } from "api/getuiAPI"


/**
 * 获取区县街道列表
 * @param {*} param0 
 */
export const SetAreaCodeList = async ({ commit }) => {
  const res = await getAreaCodeList();
  const data = res.data.children.map(v => {
    return {
      label: v.name, value: v.code, ...v, children: v.children.map(d => {
        return { label: d.name, value: d.code, ...d }
      })
    };
  });
  commit(types.SET_AREA_CODE_LIST, data);
};