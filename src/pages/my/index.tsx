import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Button, Text, Navigator, Image } from "@tarojs/components";
import { AtIcon } from "taro-ui";

import "./index.scss";
import getPath from "@_gen/utils/getPath";
import JX_Navigator from "@_gen/components/Navigator";
import JX_Button from "@_gen/components/Button";
import { getMyCard } from "@_gen/service/mycard";
import AV from "@_gen/utils/leancloud-storage/dist/av-weapp.js";
import CardItemSimple from "@_gen/components/CardItemSimple";

import iconWrite from "@src/images/icon-write.png";
import iconSkin from "@src/images/icon-skin.png";
import iconPrint from "@src/images/icon-print.png";
import iconFly from "@src/images/icon-fly.png";

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollTop: 0,
      colorBg: "transparent",
      colorText: "white",
      borderBottom: false,
      title: "我的名片",
      curMyCard: null,
    };
  }

  componentWillMount() {}

  async componentDidMount() {
    let curUser = AV.User.current();
    curUser = curUser ? curUser.toJSON() : null;
    Taro.showLoading({ title: "加载中..." });
    let res_mycard = null;
    if (curUser) {
      res_mycard = await getMyCard();
    } else {
      res_mycard = await getMyCardByUser(curUser.objectId);
    }
    this.setState({
      curMyCard: res_mycard.result,
    });
    Taro.hideLoading();
  }

  render() {
    const { curMyCard } = this.state;
    return (
      <>
        {curMyCard && (
          <View className="cardmy">
            <JX_Navigator
              my-class="cardmy-navigator"
              ref={e => {
                this.navigator = e;
              }}
              title={this.state.title}
              colorBg={this.state.colorBg}
              colorText={this.state.colorText}
              borderBottom={this.state.borderBottom}
            />
            <View className="cardmy-body">
              <View className="cardmy-body-card">
                <CardItemSimple
                  cardItem={{
                    card_width: curMyCard.isVertical ? 270 : 450,
                    card_height: curMyCard.isVertical ? 450 : 270,
                    front_img: curMyCard.front_img,
                    back_img: curMyCard.back_img,
                  }}
                ></CardItemSimple>
              </View>
              <View className="cardmy-body-content">
                <View className="cardmy-body-menu">
                  <Navigator
                    className="cardmy-body-menu-item"
                    url={getPath({
                      moduleName: "card",
                      url: `/pages/my-edit/index`,
                      params: {},
                    })}
                  >
                    <Image className="cardmy-body-menu-item-icon" src={iconWrite} mode="aspectFit" />
                    <Text className="cardmy-body-menu-item-title">编辑名片信息</Text>
                    <AtIcon prefixClass="icon" value="jichu_you_line" size="14" color="white"></AtIcon>
                  </Navigator>
                  <Navigator
                    className="cardmy-body-menu-item"
                    url={getPath({
                      moduleName: "card",
                      url: `/pages/choose-template/index`,
                      params: {},
                    })}
                  >
                    <Image className="cardmy-body-menu-item-icon" src={iconSkin} mode="aspectFit" />
                    <Text className="cardmy-body-menu-item-title">名片模板</Text>
                    <AtIcon prefixClass="icon" value="jichu_you_line" size="14" color="white"></AtIcon>
                  </Navigator>
                  <Navigator
                    className="cardmy-body-menu-item"
                    url={getPath({
                      moduleName: "card",
                      url: `/pages/shop/index`,
                      params: {
                        mycard_id: curMyCard.objectId,
                      },
                    })}
                  >
                    <Image className="cardmy-body-menu-item-icon" src={iconPrint} mode="aspectFit" />
                    <Text className="cardmy-body-menu-item-title">在线印刷</Text>
                    <Text className="cardmy-body-menu-item-desc">同城速达</Text>
                    <AtIcon prefixClass="icon" value="jichu_you_line" size="14" color="white"></AtIcon>
                  </Navigator>
                </View>
                <View className="cardmy-body-menu">
                  <Navigator
                    className="cardmy-body-menu-item"
                    url={getPath({
                      moduleName: "card",
                      url: `/pages/buy-intro/index`,
                      params: {},
                    })}
                  >
                    <Image className="cardmy-body-menu-item-icon" src={iconFly} mode="aspectFit" />
                    <Text className="cardmy-body-menu-item-title">邀请同事加入</Text>
                    <AtIcon prefixClass="icon" value="jichu_you_line" size="14" color="white"></AtIcon>
                  </Navigator>
                </View>
              </View>
              <View className="cardmy-body-footer">
                <JX_Button my-class="cardmyEdit-submit-btn" title="分享名片" type="primary" onClick={() => {}} />
                <View className="cardmy-body-link">
                  <Navigator
                    className="cardmy-body-link-title"
                    url={getPath({
                      moduleName: "card",
                      url: `/pages/buy-intro/index`,
                      params: {},
                    })}
                  >
                    专属品牌资产管理
                  </Navigator>
                  <Navigator
                    className="cardmy-body-link-tag"
                    url={getPath({
                      moduleName: "card",
                      url: `/pages/buy-intro/index`,
                      params: {},
                    })}
                  >
                    4999元特惠
                  </Navigator>
                </View>
              </View>
            </View>
          </View>
        )}
      </>
    );
  }
}

export default Index;
