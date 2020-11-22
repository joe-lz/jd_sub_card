import Taro, { getCurrentInstance } from "@tarojs/taro";
import React, { Component } from "react";
import { View, Text, Swiper, SwiperItem, Image, Button } from "@tarojs/components";
import AV from "@_gen/utils/leancloud-storage/dist/av-weapp.js";
import { AtActionSheet, AtActionSheetItem, AtForm, AtIcon, AtButton } from "taro-ui";

import "./index.scss";
import { getUserCard } from "@_gen/service/usercard";
import FixedBottom from "@_gen/components/FixedBottom";
import CardItem from "@_gen/components/CardItem";
import Price from "@_gen/components/Price";
import Touchable from "@_gen/components/Touchable";
import Counter from "@_gen/components/Counter";
import JX_Button from "@_gen/components/Button";
import getPath from "@_gen/utils/getPath";
import { getMyCard } from "@_gen/service/mycard";

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      cardlist: null,
      isOpened: false,
      curTexture: null,
      startup: 2,
      number: 0,
    };
  }

  componentWillMount() {}

  async componentDidMount() {
    Taro.showLoading({ title: "加载中" });
    const { userbrandId, mycard_id } = getCurrentInstance().router.params;
    if (userbrandId) {
      // 获取名片列表
      const cardlistResult = (
        await getUserCard({
          userbrandid: userbrandId,
          userid: AV.User.current().id,
        })
      ).result;
      this.setState({ cardlist: cardlistResult });
    } else if (mycard_id) {
      // 获取我的名片
      const res_mycard = await getMyCard();
      this.setState({
        cardlist: [
          {
            ...res_mycard.result,
            card_width: res_mycard.result.isVertical ? 270 : 450,
            card_height: res_mycard.result.isVertical ? 450 : 270,
          },
        ],
      });
    }
    Taro.hideLoading();
  }

  reset() {
    this.setState({
      isOpened: false,
    });
  }

  handleSubmit() {
    const { current, cardlist, isOpened, startup, number, curTexture } = this.state;
    const curCard = cardlist ? cardlist[current] : {};
    if (!curTexture) {
      Taro.showToast({ title: "请选择规格", icon: "none", duration: 1000 });
      return;
    }
    const orderProducts = {
      price: curCard.card.price,
      number: number || startup,
      curUserCard: curCard,
      texture: curTexture,
    };
    Taro.setStorageSync("orderProducts", orderProducts);

    Taro.navigateTo({
      url: getPath({
        moduleName: "card",
        url: "/pages/order-create/index",
      }),
    });
  }

  render() {
    const { current, cardlist, isOpened, startup } = this.state;
    const curCard = cardlist ? cardlist[current] : {};

    return (
      <>
        {cardlist && cardlist.length > 0 && (
          <View>
            <AtActionSheet isOpened={isOpened} cancelText="取消" onCancel={this.reset.bind(this)} onClose={this.reset.bind(this)}>
              {curCard.card.texture.map((obj, index) => {
                return (
                  <AtActionSheetItem
                    key={`${index + 1}`}
                    onClick={() => {
                      this.setState({ curTexture: obj });
                      this.reset();
                    }}
                  >
                    {obj}
                  </AtActionSheetItem>
                );
              })}
            </AtActionSheet>
            <View className="cardshop">
              <View className="cardshop-swiper">
                <Swiper
                  style={{ width: "100%", height: "100%" }}
                  duration={300}
                  current={this.state.current}
                  onChange={e => {
                    this.setState({ current: e.currentTarget.current });
                  }}
                >
                  {cardlist.map((obj, index) => {
                    return (
                      <SwiperItem key={`${index + 1}`}>
                        <View className="cardshop-SwiperItem">
                          <CardItem cardItem={obj}></CardItem>
                        </View>
                      </SwiperItem>
                    );
                  })}
                </Swiper>
                {cardlist && cardlist.length > 1 && (
                  <View className="cardshop-swiper-dots">
                    {cardlist.map((obj, index) => {
                      return (
                        <View
                          key={`${index + 1}`}
                          className={`cardshop-swiper-dot ${current === index && "cardshop-swiper-dot-active"}`}
                        ></View>
                      );
                    })}
                  </View>
                )}
              </View>
              <View className="cardshop-body">
                <View className="cardshop-body-info">
                  <Text className="cardshop-body-info-title">{curCard.card && curCard.card.name}</Text>
                  <Text className="cardshop-body-info-tag">优选</Text>
                  <Text className="cardshop-body-info-desc" style={{ display: "block" }}>
                    2盒起订，每盒100张，2工作日内发货
                  </Text>
                  <Price size="large" value={curCard.card && curCard.card.price / 100} />
                </View>
                <Touchable
                  onClick={() => {
                    this.setState({ isOpened: true });
                  }}
                >
                  <View className="cardshop-body-choose">
                    <Text className="" style={{ minWidth: "55px" }}>
                      规格
                    </Text>
                    <Text className="" style={{ flex: 1 }}>
                      {this.state.curTexture ? `材质：${this.state.curTexture}` : "请选择：材质"}
                    </Text>
                    <AtIcon prefixClass="icon" value="jichu_you_line" size="14" color="#6C7D95"></AtIcon>
                  </View>
                </Touchable>
                <View className="cardshop-body-choose">
                  <Text className="" style={{ minWidth: "55px" }}>
                    数量
                  </Text>
                  <View className="cardshop-body-startup">
                    <Text className="" style={{ flex: 1 }}>
                      {startup}件起购
                    </Text>
                    <Counter
                      value={this.state.number || startup}
                      min={startup}
                      onChange={value => {
                        this.setState({ number: value });
                      }}
                    />
                  </View>
                </View>
              </View>
            </View>
            <FixedBottom height={55} style={{}}>
              <View className="cardshop-btn">
                <JX_Button
                  className="cardshop-btn-submit"
                  title="提交订单"
                  size="normal"
                  type="error"
                  onClick={this.handleSubmit.bind(this)}
                />
              </View>
            </FixedBottom>
          </View>
        )}
      </>
    );
  }
}

export default Index;
