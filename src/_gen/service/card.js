/*
 * @Description: 用户名片（用户品牌信息）
 * @Author: bangdong.chen
 * @Date: 2020-05-20 22:17:11
 * @LastEditors: bangdong.chen
 * @LastEditTime: 2020-11-22 12:20:30
 * @FilePath: /fe-taro-jinxi/src/services/usercard.js
 */
import Taro from "@tarojs/taro";
import AV from "@_gen/utils/leancloud-storage/dist/av-weapp.js";

export async function getCard(params) {
  const queryCard = new AV.Query("Card");
  // queryCard.equalTo("status", 1);

  return new Promise(resolve => {
    queryCard.find().then(res => {
      console.log(res);
      resolve({
        result: res ? JSON.parse(JSON.stringify(res)) : null,
        code: 0,
        msg: "success",
      });
    });
  });
}
