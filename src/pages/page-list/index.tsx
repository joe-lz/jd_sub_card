import React, { Component } from "react";
import { View, Button, Text, Navigator } from "@tarojs/components";

import "./index.scss";
import getPath from "@_gen/utils/getPath";

class Index extends Component {
  componentWillMount() {}

  componentDidMount() {}

  render() {
    return (
      <View className="index">
        <Navigator
          url={getPath({
            url: "/pages/intro/index",
            moduleName: "public",
          })}
        >
          <Button type="primary">关于鲸典</Button>
        </Navigator>
        <Text>/pages/intro/index</Text>

        <Navigator
          url={getPath({
            url: "/pages/index/index",
            moduleName: "card",
            params: {
              bId: 16,
            },
          })}
        >
          <Button type="primary">名片首页</Button>
        </Navigator>
        <Text>/pages/index/index</Text>

        <Navigator
          url={getPath({
            url: "/pages/index/index",
            moduleName: "card",
            params: {
              scene: 22,
            },
          })}
        >
          <Button type="primary">名片首页(来自二维码--转载)</Button>
        </Navigator>
        <Text>/pages/index/index</Text>

        <Navigator
          url={getPath({
            url: "/pages/index/index",
            moduleName: "card",
            params: {
              scene: ",16",
            },
          })}
        >
          <Button type="primary">名片首页(来自二维码--官网)</Button>
        </Navigator>
        <Text>/pages/index/index</Text>

        <Navigator
          url={getPath({
            url: "/pages/shop/index",
            moduleName: "card",
            params: {
              userbrandId: "5f3794f2ce811700060a76ba",
            },
          })}
        >
          <Button type="primary">商品详情</Button>
        </Navigator>
        <Text>/pages/shop/index</Text>

        <Navigator
          url={getPath({
            url: "/pages/edit/index",
            moduleName: "card",
            params: {
              bId: 16,
            },
          })}
        >
          <Button type="primary">名片编辑</Button>
        </Navigator>
        <Text>/pages/edit/index</Text>
        <Navigator
          url={getPath({
            url: "/pages/order-create/index",
            moduleName: "card",
          })}
        >
          <Button type="primary">创建订单</Button>
        </Navigator>
        <Text>/pages/order-create/index</Text>

        <Navigator
          url={getPath({
            url: "/pages/my/index",
            moduleName: "card",
            params: {},
          })}
        >
          <Button type="primary">我的私人名片</Button>
        </Navigator>
        <Text>/pages/my/index</Text>

        <Navigator
          url={getPath({
            url: "/pages/my/index",
            moduleName: "card",
            params: {
              mycardId: "5fb8d3d62623ab370baf4b5c",
            },
          })}
        >
          <Button type="primary">他人 私人名片</Button>
        </Navigator>
        <Text>/pages/my/index</Text>

        <Navigator
          url={getPath({
            url: "/pages/my-edit/index",
            moduleName: "card",
            params: {},
          })}
        >
          <Button type="primary">我的私人名片-edit</Button>
        </Navigator>
        <Text>/pages/my-edit/index</Text>

        <Navigator
          url={getPath({
            url: "/pages/choose-template/index",
            moduleName: "card",
            params: {},
          })}
        >
          <Button type="primary">选择名片</Button>
        </Navigator>
        <Text>/pages/choose-template/index</Text>
      </View>
    );
  }
}

export default Index;
