import Taro, { getCurrentInstance } from "@tarojs/taro";
import React, { Component } from "react";
import { View, Button, Text, Image } from "@tarojs/components";
import { AtInput, AtForm, AtIcon } from "taro-ui";

import "./index.scss";
import Upload from "@_gen/components/Upload";
import JX_Button from "@_gen/components/Button";
import { getUserBrandByJxId, getUserBrand, updateUserBrand } from "@_gen/service/userbrand";
import getPath from "@_gen/utils/getPath";
import checkAuth from "@_gen/utils/checkAuth";
import makeImgLink from "@_gen/utils/makeImgLink";
import updateCurUser from "@_gen/utils/updateCurUser";

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
    await this.getUserBrand();
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  async getUserBrand() {
    const { bId } = getCurrentInstance().router.params;
    const res = (await getUserBrand({ bId }, true)).result;
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
      [key]: value,
    });
  }

  async handleAvatarChange(urlkey) {
    // 更新
    await updateUserBrand({
      params: { avatar: urlkey },
      curUserBrand: this.state.curUserBrand, //
    });
    await this.getUserBrand();
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
      await this.getUserBrand();
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
    const { avatar } = this.state;
    return (
      <View className="cardEdit">
        <Text className="cardEdit-title">请先完善你的名片信息</Text>
        <Upload
          onChange={urlkey => {
            this.handleAvatarChange(urlkey);
          }}
          renderContent={
            <View className="cardEdit-avatar">
              {this.state.avatar ? (
                <Image
                  style={{ position: "relative" }}
                  src={makeImgLink({
                    url: this.state.avatar,
                    type: "jpg",
                  })}
                  mode="aspectFill"
                  className="cardEdit-avatar-content"
                ></Image>
              ) : (
                <Text className="cardEdit-avatar-title">上传头像</Text>
              )}
              <View className="cardEdit-avatar-icon">
                <AtIcon prefixClass="icon" value="camera" size="16" color="white"></AtIcon>
              </View>
            </View>
          }
        />
        <Text className="cardEdit-section-title">个人信息</Text>
        <AtForm>
          <AtInput
            placeholderClass="cardEdit-input-placeholder"
            required={false}
            border
            title="姓名"
            type="text"
            placeholder="请输入"
            value={this.state.username}
            onChange={e => {
              this._handleInput({ value: e, key: "username" });
            }}
          />
          <AtInput
            placeholderClass="cardEdit-input-placeholder"
            border
            title="职位"
            type="text"
            placeholder="请输入"
            value={this.state.position}
            onChange={e => {
              this._handleInput({ value: e, key: "position" });
            }}
          />
          <AtInput
            placeholderClass="cardEdit-input-placeholder"
            border={false}
            title="部门"
            type="text"
            placeholder="请输入"
            value={this.state.department}
            onChange={e => {
              this._handleInput({ value: e, key: "department" });
            }}
          />
        </AtForm>
        <Text className="cardEdit-section-title">联系信息</Text>
        <AtForm>
          <AtInput
            placeholderClass="cardEdit-input-placeholder"
            required={false}
            border
            title="手机号码"
            type="number"
            placeholder="请输入"
            value={this.state.mobile}
            onChange={e => {
              this._handleInput({ value: e, key: "mobile" });
            }}
          />
          <AtInput
            placeholderClass="cardEdit-input-placeholder"
            border
            title="邮箱"
            type="text"
            placeholder="请输入"
            value={this.state.email}
            onChange={e => {
              this._handleInput({ value: e, key: "email" });
            }}
          />
          <AtInput
            placeholderClass="cardEdit-input-placeholder"
            border={false}
            title="微信号"
            type="text"
            placeholder="请输入"
            value={this.state.wechat}
            onChange={e => {
              this._handleInput({ value: e, key: "wechat" });
            }}
          />
        </AtForm>
        <View className="cardEdit-submit">
          <JX_Button
            className="cardEdit-btn"
            title="保存"
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
