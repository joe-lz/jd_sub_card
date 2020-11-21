/*
 * @Description: 用户名片（用户品牌信息）
 * @Author: bangdong.chen
 * @Date: 2020-05-20 22:17:11
 * @LastEditors: bangdong.chen
 * @LastEditTime: 2020-11-21 18:22:49
 * @FilePath: /fe-taro-jinxi/src/services/usercard.js
 */
import Taro from "@tarojs/taro";
import AV from "@_gen/utils/leancloud-storage/dist/av-weapp.js";

export async function getCardTemplate(params) {
  const queryCardTemplate = new AV.Query("CardTemplate");
  // queryCardTemplate.equalTo("status", 1);

  return new Promise(resolve => {
    queryCardTemplate.find().then(res => {
      console.log(res);
      resolve({
        result: res ? JSON.parse(JSON.stringify(res)) : null,
        code: 0,
        msg: "success",
      });
    });
  });
}
