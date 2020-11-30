import Taro, { getCurrentInstance } from "@tarojs/taro";
import React, { Component } from "react";
import { View, Button, Text, Image } from "@tarojs/components";
import { AtInput, AtForm, AtIcon } from "taro-ui";

import "./index.scss";
import Upload from "@_gen/components/Upload";
import JX_Button from "@_gen/components/Button";
import { getUserBrandByJxId, getUserBrand, updateUserBrand } from "@_gen/service/userbrand";
import { getUserBrandOrCreate } from "@src/utils/getUserBrandOrCreate";
import getPath from "@_gen/utils/getPath";
import checkAuth from "@_gen/utils/checkAuth";
import makeImgLink from "@_gen/utils/makeImgLink";
import updateCurUser from "@_gen/utils/updateCurUser";
import MenuWrapper from "@_gen/components/MenuWrapper";
import MenuItem from "@_gen/components/MenuItem";

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      avatar: null,
      username: null,
      position: null,
      department: null,
      mobile: null,
      email: null,
      wechat: null,

      // user: null,
      // brand: null,
      bId: null,
      curUserBrand: null,
      curUser: null,
    };
  }

  componentWillMount() {}

  async componentDidMount() {
    const res = await updateCurUser();
    this.setState({ curUser: res.curUser });
    await this.getUserBrandOrCreate();
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  async getUserBrandOrCreate() {
    const { bId } = getCurrentInstance().router.params;
    const res = (await getUserBrandOrCreate({ bId }, true)).result;
    const curUserBrand = res && res.length > 0 ? res[0] : {};

    this.setState({
      curUserBrand,
      avatar: curUserBrand.avatar,
      username: curUserBrand.username,
      position: curUserBrand.position,
      department: curUserBrand.department,
      mobile: curUserBrand.mobile,
      email: curUserBrand.email,
      wechat: curUserBrand.wechat,
      bId,
    });
  }

  _handleInput({ key, value }) {
    this.setState({
      [`${key}`]: value,
    });
  }

  async handleAvatarChange(urlkey) {
    // 更新
    await updateUserBrand({
      params: { avatar: urlkey },
      curUserBrand: this.state.curUserBrand, //
    });
    await this.getUserBrandOrCreate();
  }

  async handleSubmit() {
    const { curUserBrand, curUser } = this.state;
    console.log({
      curUserBrand,
      curUser,
    });

    // 更新userbrand
    Taro.showLoading({
      title: "保存中",
    });
    try {
      await updateUserBrand({
        params: {
          avatar: this.state.avatar,
          username: this.state.username,
          position: this.state.position,
          department: this.state.department,
          mobile: this.state.mobile,
          email: this.state.email,
          wechat: this.state.wechat,
        },
        curUserBrand: this.state.curUserBrand,
      });
      await this.getUserBrandOrCreate();
      // 生成两张默认名片
      await Taro.request({
        method: "POST",
        url: `${REACT_APP_LEAN_CLOUD_SERVER}/card/generate`,
        data: {
          cardwidth: 270,
          cardheight: 450,
          cardid: DEFAULT_CARD_ID_VERTICAL,
          userbrandid: curUserBrand.objectId,
          userid: curUser.objectId,
        },
      });
      await Taro.request({
        method: "POST",
        url: `${REACT_APP_LEAN_CLOUD_SERVER}/card/generate`,
        data: {
          cardwidth: 450,
          cardheight: 270,
          cardid: DEFAULT_CARD_ID_HORIZONTAL,
          userbrandid: curUserBrand.objectId,
          userid: curUser.objectId,
        },
      });
      const pages = Taro.getCurrentPages();
      if (pages.length > 1) {
        Taro.navigateBack({ delta: 1 });
      } else {
        const { bId } = getCurrentInstance().router.params;
        Taro.redirectTo({
          url: getPath({
            moduleName: "card",
            url: `/pages/index/index`,
            params: { bId },
          }),
        });
      }
    } catch (error) {
      console.log({ error });
    } finally {
      Taro.hideLoading();
      Taro.showToast({ title: "更新成功", icon: "success", duration: 1000 });
    }
  }

  render() {
    return (
      <View className="cardEdit">
        <View className="cardEdit-formbody">
          <MenuWrapper title="个人信息">
            <MenuItem
              title="头像"
              height={80}
              type="image"
              value={this.state.avatar}
              name="avatar"
              onChange={e => {
                this.handleAvatarChange(e);
              }}
            />
            <MenuItem
              title="姓名"
              value={this.state.username}
              name="username"
              onChange={e => {
                this._handleInput({ value: e, key: "username" });
              }}
            />
            <MenuItem
              title="职位"
              value={this.state.position}
              name="position"
              onChange={e => {
                this._handleInput({ value: e, key: "position" });
              }}
            />
            <MenuItem
              title="部门"
              value={this.state.department}
              name="department"
              onChange={e => {
                this._handleInput({ value: e, key: "department" });
              }}
            />
          </MenuWrapper>
          <MenuWrapper title="联系信息">
            <MenuItem
              title="手机号码"
              value={this.state.mobile}
              name="mobile"
              type="number"
              onChange={e => {
                this._handleInput({ value: e, key: "mobile" });
              }}
            />
            <MenuItem
              title="邮箱"
              value={this.state.email}
              name="email"
              onChange={e => {
                this._handleInput({ value: e, key: "email" });
              }}
            />
            <MenuItem
              title="微信号"
              value={this.state.wechat}
              name="wechat"
              onChange={e => {
                this._handleInput({ value: e, key: "wechat" });
              }}
            />
          </MenuWrapper>
        </View>
        <View className="cardEdit-submit">
          <JX_Button
            className="cardEdit-btn"
            title="生成电子名片"
            size="large"
            type="primary"
            disabled={!(this.state.username && this.state.mobile)}
            onClick={this.handleSubmit.bind(this)}
          />
        </View>
      </View>
    );
  }
}

export default Index;
