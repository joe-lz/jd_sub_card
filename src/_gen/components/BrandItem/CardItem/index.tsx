import Taro, { getCurrentInstance } from "@tarojs/taro";
import React, { Component } from "react";
import { View, Button, Text, Navigator, Image } from "@tarojs/components";
import { AtIcon } from "taro-ui";

import "./index.scss";
import Logo from "../Logo";
import AV from "@_gen/utils/leancloud-storage/dist/av-weapp.js";
import getPath from "@_gen/utils/getPath";
import checkAuth from "@_gen/utils/checkAuth";
import makeImgLink from "@_gen/utils/makeImgLink";
import CardItem from "./CardItem";

function Index(props) {
  const { brandItem, mybrand } = props;
  return (
    <Navigator
      className="com-brandItem-card"
      url={getPath({
        moduleName: "card",
        url: `/pages/index/index`,
        params: {
          bId: brandItem.jxId,
        },
      })}
    >
      <View className="com-brandItem-card-left">
        <View
          className="com-brandItem-card-left-avatar"
          style={
            mybrand.userbrand_id && mybrand.userbrand_id.avatar
              ? {
                  backgroundImage: `url(${makeImgLink({
                    url: mybrand.userbrand_id.avatar,
                    type: "jpg",
                  })})`,
                }
              : {}
          }
        >
          {(!mybrand || !mybrand.userbrand_id || !mybrand.userbrand_id.avatar) && (
            <AtIcon prefixClass="icon" value="camera" size="24" color="#6C7D95"></AtIcon>
          )}
        </View>
      </View>
      <View className="com-brandItem-card-middle">
        <Text className="">
          {mybrand.userbrand_id && mybrand.userbrand_id.username ? mybrand.userbrand_id.username : "专属个人电子名片"}
        </Text>
        <Text className="com-brandItem-card-middle-desc">
          {mybrand.userbrand_id && mybrand.userbrand_id.position ? mybrand.userbrand_id.position : "信息传递更便捷"}
        </Text>
      </View>
      <View className="com-brandItem-card-right">
        <Text className="com-brandItem-right-desc">
          {mybrand.userbrand_id && mybrand.userbrand_id.username && mybrand.userbrand_id.position ? "查看名片" : "去完善"}
        </Text>
        <AtIcon prefixClass="icon" value="jichu_you_line" size="14" color="#6C7D95"></AtIcon>
      </View>
    </Navigator>
  );
}

export default Index;
