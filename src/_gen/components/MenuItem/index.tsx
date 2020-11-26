import Taro, { getCurrentInstance } from "@tarojs/taro";
import React, { Component, useState, useEffect } from "react";
import { View, Button, Text, Navigator, Image, Input } from "@tarojs/components";
import { AtActionSheet, AtActionSheetItem, AtIcon } from "taro-ui";

import "./index.scss";
import AV from "@_gen/utils/leancloud-storage/dist/av-weapp.js";
import getPath from "@_gen/utils/getPath";
import checkAuth from "@_gen/utils/checkAuth";
import makeImgLink from "@_gen/utils/makeImgLink";
import Upload from "@_gen/components/Upload";

function Index(props) {
  const { title, type = "text", height = 50, value, onChange, name } = props;
  const [showActionSheet, setshowActionSheet] = useState(false);

  const renderRight = type => {
    if (type === "image") {
      return (
        <Upload
          onChange={(urlkey, temppath) => {
            onChange(urlkey, temppath);
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
                // <View className="com-menuItem-body-image-content">
                //   <AtIcon prefixClass="icon" value="camera" size="24" color="white"></AtIcon>
                // </View>
                <View className="com-menuItem-body-image-empty">
                  <Text className="com-menuItem-body-image-content-uploadtext">上传</Text>
                  <AtIcon prefixClass="icon" value="jichu_you_line" size="14" color="#A7B6C9"></AtIcon>
                </View>
              )}
            </View>
          }
        />
      );
    } else if (type === "actionsheet") {
      return (
        <View className="com-menuItem-body">
          <View
            className="com-menuItem-palette"
            onClick={() => {
              setshowActionSheet(true);
            }}
          >
            <View className="com-menuItem-palette-color" style={{ backgroundColor: value }}></View>
            <Text className="com-menuItem-palette">{value || "请选择主题色"}</Text>
          </View>
        </View>
      );
    } else {
      return (
        <Input
          placeholder="请输入"
          placeholder-style="color: #A7B6C9"
          type={type || "text"}
          value={value}
          name={name}
          onInput={e => {
            onChange(e.detail.value);
          }}
          //
        />
      );
    }
  };
  return (
    <View className="com-menuItem" style={{ height: height }}>
      <Text className="com-menuItem-title">{title}</Text>
      <View className="com-menuItem-body">{renderRight(type)}</View>
      {type === "actionsheet" && (
        <AtActionSheet
          isOpened={showActionSheet}
          title="请选择名片主题色，由logo图片提取"
          cancelText="取消"
          onCancel={() => {
            setshowActionSheet(false);
          }}
        >
          {props.actionsheetArr.map(obj => {
            return (
              <AtActionSheetItem
                onClick={() => {
                  onChange(obj);
                  setshowActionSheet(false);
                }}
              >
                <View className="com-menuItem-palette">
                  <View className="com-menuItem-palette-color" style={{ backgroundColor: obj }}></View>
                  <Text className="com-menuItem-palette-desc">{obj}</Text>
                </View>
              </AtActionSheetItem>
            );
          })}
        </AtActionSheet>
      )}
    </View>
  );
}

export default Index;
