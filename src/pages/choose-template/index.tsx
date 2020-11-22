import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Button, Text, Navigator, Swiper, SwiperItem } from "@tarojs/components";

import "./index.scss";
import getPath from "@_gen/utils/getPath";
import JX_Navigator from "@_gen/components/Navigator";
import JX_Button from "@_gen/components/Button";
import CardItem from "@_gen/components/CardItem";
import { getCard } from "@_gen/service/card";
import { getMyCard } from "@_gen/service/mycard";
import AV from "@_gen/utils/leancloud-storage/dist/av-weapp.js";

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      curUser: null,
      colorBg: "transparent",
      colorText: "white",
      borderBottom: false,
      title: "选择名片",
      list: null,
      current: 0,
    };
  }

  componentWillMount() {}

  async componentDidMount() {
    // 获取名片模板列表
    const curUser = AV.User.current();
    const res = await getCard();
    this.setState({
      list: res.result,
      curUser: curUser ? curUser.toJSON() : null,
    });
  }

  async handleSubmit() {
    const { list, current, curUser } = this.state;
    if (!curUser) {
      return;
    }
    Taro.showLoading({ title: "加载中..." });
    const card = list[current];
    const res_mycard = await getMyCard();
    // 生成图片，
    await Taro.request({
      method: "POST",
      url: `${REACT_APP_LEAN_CLOUD_SERVER}/cardmy/generate`,
      data: {
        isVertical: card.isVertical,
        cardid: card.objectId,
        mycardid: res_mycard.result.objectId,
        userid: curUser.objectId,
      },
    });
    Taro.hideLoading();
    // Taro.redirectTo({
    //   url: getPath({
    //     moduleName: "card",
    //     url: `/pages/my/index`,
    //     params: {},
    //   }),
    // });
    wx.navigateBack({
      delta: 1,
    });
  }

  render() {
    return (
      <View className="cardChoose">
        <JX_Navigator
          my-class="cardChoose-navigator"
          ref={e => {
            this.navigator = e;
          }}
          title={this.state.title}
          colorBg={this.state.colorBg}
          colorText={this.state.colorText}
          borderBottom={this.state.borderBottom}
        />
        <View className="cardChoose-body">
          {this.state.list && this.state.list.length > 0 ? (
            <Swiper
              className="cardChoose-body-swiper"
              vertical={false}
              previousMargin="40px"
              nextMargin="40px"
              current={this.state.current}
              onChange={e => {
                console.log(e);
                this.setState({
                  current: e.detail.current,
                });
              }}
            >
              {this.state.list.map((obj, index) => {
                return (
                  <SwiperItem className="cardChoose-body-swiper-item" key={`${index + 1}`}>
                    <View className="cardChoose-body-swiper-item-content">
                      <CardItem
                        cardItem={{
                          card_width: obj.isVertical ? 270 : 450,
                          card_height: obj.isVertical ? 450 : 270,
                          front_img: obj.demo,
                          back_img: obj.demo_back,
                        }}
                      ></CardItem>
                    </View>
                  </SwiperItem>
                );
              })}
            </Swiper>
          ) : null}
        </View>
        <View className="cardChoose-bottom">
          <View className="cardChoose-bottom-content">
            <JX_Button
              my-class="cardChoose-bottom-content-btn"
              title="完成"
              size="normal"
              type="primary"
              onClick={this.handleSubmit.bind(this)}
            />
          </View>
        </View>
      </View>
    );
  }
}

export default Index;
