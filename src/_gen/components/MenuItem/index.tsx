import Taro, { getCurrentInstance } from "@tarojs/taro";
import React, { Component } from "react";
import { View, Button, Text, Navigator, Image, Input } from "@tarojs/components";
import { AtIcon } from "taro-ui";

import "./index.scss";
import AV from "@_gen/utils/leancloud-storage/dist/av-weapp.js";
import getPath from "@_gen/utils/getPath";
import checkAuth from "@_gen/utils/checkAuth";
import makeImgLink from "@_gen/utils/makeImgLink";
import Upload from "@_gen/components/Upload";

function Index(props) {
  const { title, type = "text", height = 50, value, onChange } = props;

  return (
    <View className="com-menuItem" style={{ height: height }}>
      <Text className="com-menuItem-title">{title}</Text>
      <View className="com-menuItem-body">
        {type === "image" ? (
          <Upload
            onChange={urlkey => {
              onChange(urlkey);
            }}
            renderContent={
              <View className="com-menuItem-body-image">
                {value ? (
                  <Image
                    style={{ position: "relative" }}
                    src={makeImgLink({
                      url: value,
                      type: "jpg",
                    })}
                    mode="aspectFill"
                    className="com-menuItem-body-image-content"
                  ></Image>
                ) : (
                  <View className="com-menuItem-body-image-content">
                    <AtIcon prefixClass="icon" value="camera" size="24" color="white"></AtIcon>
                  </View>
                )}
              </View>
            }
          />
        ) : (
          <Input
            placeholder="请输入"
            placeholder-style="color: #A7B6C9"
            type={type || "text"}
            value={value}
            onInput={e => {
              onChange(e.detail.value);
            }}
            //
          />
        )}
      </View>
    </View>
  );
}

export default Index;
