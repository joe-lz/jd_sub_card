import Taro, { getCurrentInstance } from "@tarojs/taro";
import React, { Component } from "react";
import { View, Button, Text, Navigator, Image, Input } from "@tarojs/components";
import { AtIcon } from "taro-ui";

import "./index.scss";
import AV from "@_gen/utils/leancloud-storage/dist/av-weapp.js";
import getPath from "@_gen/utils/getPath";
import checkAuth from "@_gen/utils/checkAuth";
import makeImgLink from "@_gen/utils/makeImgLink";

function Index(props) {
  const { title } = props;
  return (
    <View className="com-menuItem">
      <Text className="com-menuItem-title">{title}</Text>
      <View className="com-menuItem-body">
        <Input placeholder="请输入" placeholder-style="color: #A7B6C9"/>
      </View>
    </View>
  );
}

export default Index;
