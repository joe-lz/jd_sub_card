/*
 * @Description: 用户名片（用户品牌信息）
 * @Author: bangdong.chen
 * @Date: 2020-05-20 22:17:11
 * @LastEditors: bangdong.chen
 * @LastEditTime: 2020-11-21 16:49:59
 * @FilePath: /fe-taro-jinxi/src/services/usercard.js
 */
import Taro from "@tarojs/taro";
import AV from "@_gen/utils/leancloud-storage/dist/av-weapp.js";

export async function getMyCard(params) {
  const queryMyCard = new AV.Query("MyCard");
  queryMyCard.equalTo("user", AV.User.current());
  return new Promise(resolve => {
    queryMyCard.first().then(res => {
      resolve({
        result: res ? res.toJSON() : null,
        code: 0,
        msg: "success",
      });
    });
  });
}

export async function createMyCard(params) {
  // 构建对象
  const MyCard = AV.Object.extend("MyCard");
  const mycard = new MyCard();

  mycard.set("user", AV.User.current());
  Object.keys(params).map(keyname => {
    const value = params[keyname];
    if (value) {
      mycard.set(keyname, value);
    }
  });

  return new Promise((resolve, reject) => {
    mycard.save().then(
      res => {
        // 成功保存之后，执行其他逻辑
        resolve({
          result: res,
          code: 0,
          msg: "success",
        });
      },
      error => {
        // 异常处理
        reject({
          result: error,
          code: -1,
          msg: "failed",
        });
      }
    );
  });
}

export async function updateMyCard(params) {
  // 构建对象
  const mycard = AV.Object.createWithoutData("MyCard", params.id);
  mycard.set("user", AV.User.current());
  Object.keys(params).map(keyname => {
    const value = params[keyname];
    if (value) {
      mycard.set(keyname, value);
    }
  });

  return new Promise((resolve, reject) => {
    mycard.save().then(
      res => {
        // 成功保存之后，执行其他逻辑
        resolve({
          result: res,
          code: 0,
          msg: "success",
        });
      },
      error => {
        // 异常处理
        reject({
          result: error,
          code: -1,
          msg: "failed",
        });
      }
    );
  });
}
