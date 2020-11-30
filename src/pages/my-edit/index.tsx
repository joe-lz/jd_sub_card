import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Button, Text, Navigator, Canvas } from "@tarojs/components";
import colorThief from "miniapp-color-thief";

import "./index.scss";
import getPath from "@_gen/utils/getPath";
import JX_Navigator from "@_gen/components/Navigator";
import MenuWrapper from "@_gen/components/MenuWrapper";
import MenuItem from "@_gen/components/MenuItem";
import JX_Button from "@_gen/components/Button";
import { getMyCard, createMyCard, updateMyCard } from "@_gen/service/mycard";
import ColorPicker from "./ColorPicker";

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      avatar: null,
      name: null,
      position: null,
      department: null,
      co_name: null,
      co_name_short: null,
      co_logo: null,
      co_color: null,
      co_palette: [],
      co_address: null,
      co_site: null,
      email: null,
      mobile: null,
      wechat: null,
    };
  }

  componentWillMount() {}

  async componentDidMount() {
    Taro.showLoading({ title: "加载中..." });
    const res = await getMyCard();
    if (res.result) {
      this.setState({
        id: res.result.objectId,
        avatar: res.result.avatar,
        name: res.result.name,
        position: res.result.position,
        department: res.result.department,
        co_name: res.result.co_name,
        co_name_short: res.result.co_name_short,
        co_logo: res.result.co_logo,
        co_color: res.result.co_color,
        co_palette: res.result.co_palette,
        co_address: res.result.co_address,
        co_site: res.result.co_site,
        email: res.result.email,
        mobile: res.result.mobile,
        wechat: res.result.wechat,
      });
    }
    Taro.hideLoading();
  }

  _handleInput({ key, value, temppath }) {
    let that = this;
    this.setState({
      [`${key}`]: value,
    });
    if (key === "co_logo") {
      const ctx = Taro.createCanvasContext("myCanvas");
      ctx.drawImage(temppath.tempFilePaths[0], 0, 0, 100, 100);
      ctx.draw(false, () => {
        Taro.canvasGetImageData({
          canvasId: "myCanvas",
          x: 0,
          y: 0,
          width: 100,
          height: 100,
          success: res => {
            let palette = colorThief(res.data)
              .palette()
              .getHex();
            that.setState({ co_palette: Array.from(new Set(palette)) });
          },
        });
      });
    }
  }

  async _handleSubmit() {
    console.log(this.state);
    const {
      avatar,
      name,
      position,
      department,
      co_name,
      co_name_short,
      co_logo,
      co_color,
      co_palette,
      co_address,
      co_site,
      email,
      mobile,
      wechat,
    } = this.state;
    // if (!name) {
    //   Taro.showToast({ title: "请填写完整信息", icon: "none", duration: 1000 });
    //   return;
    // }
    Taro.showLoading({ title: "加载中..." });
    if (this.state.id) {
      await updateMyCard(this.state);
    } else {
      await createMyCard(this.state);
    }
    Taro.hideLoading();
    Taro.redirectTo({
      url: getPath({
        moduleName: "card",
        url: `/pages/choose-template/index`,
        params: {},
      }),
    });
  }

  render() {
    const {
      avatar,
      name,
      position,
      department,
      co_name,
      co_name_short,
      co_logo,
      co_color,
      co_palette,
      co_address,
      co_site,
      email,
      mobile,
      wechat,
    } = this.state;
    return (
      <View className="cardmyEdit">
        <MenuWrapper title="个人信息">
          <MenuItem
            title="头像"
            height={80}
            type="image"
            value={avatar}
            name="avatar"
            onChange={e => {
              this._handleInput({ value: e, key: "avatar" });
            }}
          ></MenuItem>
          <MenuItem
            title="姓名"
            value={name}
            name="name"
            onChange={e => {
              this._handleInput({ value: e, key: "name" });
            }}
          ></MenuItem>
          <MenuItem
            title="部门"
            value={department}
            name="department"
            onChange={e => {
              this._handleInput({ value: e, key: "department" });
            }}
          ></MenuItem>
          <MenuItem
            title="职位"
            value={position}
            name="position"
            onChange={e => {
              this._handleInput({ value: e, key: "position" });
            }}
          ></MenuItem>
        </MenuWrapper>
        <MenuWrapper title="组织信息">
          <MenuItem
            title="组织名称"
            value={co_name}
            name="co_name"
            onChange={e => {
              this._handleInput({ value: e, key: "co_name" });
            }}
          ></MenuItem>
          <MenuItem
            title="简称"
            value={co_name_short}
            name="co_name_short"
            onChange={e => {
              this._handleInput({ value: e, key: "co_name_short" });
            }}
          ></MenuItem>
          <MenuItem
            title="标志"
            height={80}
            type="image"
            value={co_logo}
            name="co_logo"
            onChange={(path, temppath) => {
              this._handleInput({ value: path, key: "co_logo", temppath });
            }}
          ></MenuItem>
          {co_palette.length > 0 && (
            <MenuItem
              title="主题色"
              type="actionsheet"
              value={co_color}
              name="co_color"
              actionsheetArr={co_palette}
              onChange={e => {
                this._handleInput({ value: e, key: "co_color" });
              }}
            ></MenuItem>
          )}
          <MenuItem
            title="地址"
            value={co_address}
            name="co_address"
            onChange={e => {
              this._handleInput({ value: e, key: "co_address" });
            }}
          ></MenuItem>
          <MenuItem
            title="官网地址"
            value={co_site}
            name="co_site"
            onChange={e => {
              this._handleInput({ value: e, key: "co_site" });
            }}
          ></MenuItem>
        </MenuWrapper>
        <MenuWrapper title="联系信息">
          <MenuItem
            title="手机号"
            type="number"
            value={mobile}
            name="mobile"
            onChange={e => {
              this._handleInput({ value: e, key: "mobile" });
            }}
          ></MenuItem>
          <MenuItem
            title="邮箱"
            value={email}
            name="email"
            onChange={e => {
              this._handleInput({ value: e, key: "email" });
            }}
          ></MenuItem>
          <MenuItem
            title="微信号"
            value={wechat}
            name="wechat"
            onChange={e => {
              this._handleInput({ value: e, key: "wechat" });
            }}
          ></MenuItem>
        </MenuWrapper>
        <JX_Button
          my-class="cardmyEdit-submit-btn"
          title="生成电子名片"
          type="primary"
          size="large"
          onClick={this._handleSubmit.bind(this)} //
        />
        {/* <View className="cardmyEdit-link">
          <Text>嫌麻烦？</Text>
          <Navigator
            className="cardmyEdit-link-title"
            url={getPath({
              moduleName: "card",
              url: `/pages/buy-intro/index`,
              params: {},
            })}
          >
            专属设计师贴身定制
          </Navigator>
          <Navigator
            className="cardmyEdit-link-tag"
            url={getPath({
              moduleName: "card",
              url: `/pages/buy-intro/index`,
              params: {},
            })}
          >
            99元特惠
          </Navigator>
        </View> */}
        <View className="cardmyEdit-canvas">
          <Canvas canvas-id="myCanvas"></Canvas>
        </View>
      </View>
    );
  }
}

export default Index;
