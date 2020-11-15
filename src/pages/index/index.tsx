import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Button, Text, Navigator } from "@tarojs/components";
import AV from "@_gen/utils/leancloud-storage/dist/av-weapp.js";
import { AtIcon } from "taro-ui";

import "./index.scss";
import { getBrandByJxId, addToMyBrands } from "@_gen/service/brand";
import { getUserBrandByJxId, getUserBrand } from "@_gen/service/userbrand";
import { getOrderCount } from "@_gen/service/order";
import { getUserCard } from "@_gen/service/usercard";
import getPath from "@_gen/utils/getPath";
import updateCurUser from "@_gen/utils/updateCurUser";
import Touchable from "@_gen/components/Touchable";
import Logo from "@_gen/components/Logo";
import JX_Navigator from "@_gen/components/Navigator";
import CardItem from "@_gen/components/CardItem";

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 1,
      isSelf: false, // 是否是自己
      curUserBrand: null,
      cardlist: [],
    };
    this.bId = null;
  }

  componentDidMount() {
    Taro.showShareMenu({
      withShareTicket: true,
      menus: ["shareAppMessage", "shareTimeline"],
    });
    Taro.setNavigationBarTitle({
      title: "我的名片",
    });
  }

  async componentDidShow() {
    Taro.showLoading({ title: "加载中" });
    this.setState({ cardlist: null });
    let {
      params: { scene, bId },
    } = getCurrentInstance().router;
    let userbrandId = null; // card id
    // 更新用户信息
    if (AV.User.current()) {
      await updateCurUser({ needLogin: true });
    }
    let curUserBrand = null;
    if (scene) {
      // 从分享进来，或从二维码进来
      const newScene = decodeURIComponent(scene).split(",");
      // let [userbrandId, bId] = newScene
      let userbrandId = newScene[0];
      if (newScene[1]) {
        // 从官网 名片二维码过来
        bId = newScene[1];
        this.bId = bId;
        await this.getUserBrand(bId);
        this.addToMyBrand(bId, 1);
      } else {
        // 从名片二维码分享过来
        // 获取curUserBrand
        curUserBrand = (await getUserBrandByJxId({ id: userbrandId }, true)).result;
        bId = curUserBrand.bId;
        this.bId = bId;
        this.addToMyBrand(bId, 2);
      }
    } else {
      // 从首页进来
      // 获取curUserBrand
      curUserBrand = await this.getUserBrand(bId);
      this.setState({ curUserBrand });
      this.addToMyBrand(bId, 1);
    }
    this.bId = bId;
    // 获取名片列表
    console.log(curUserBrand);

    if (curUserBrand && curUserBrand.username && curUserBrand.mobile && curUserBrand.avatar && curUserBrand.position) {
      const cardlistResult = await getUserCard({
        userbrandid: curUserBrand.objectId,
        userid: curUserBrand.user.objectId,
      });
      this.setState({ cardlist: cardlistResult.result });
    } else {
      this.gotoEdit();
    }
    // // 获取brand
    // await this.props.brandStore.getBrandByJxId({ id: bId })
    // const { userbrandStore: { curUserBrand }, brandStore: { curBrand } } = this.props

    this.setState({
      curUserBrand,
      isSelf: curUserBrand && curUserBrand.user.objectId === (AV.User.current() ? AV.User.current().id : ""),
    });
    Taro.hideLoading();
  }

  async addToMyBrand(bId, type = 2) {
    console.log(bId, type);
    // 获取当前品牌
    const curBrand = (await getBrandByJxId({ id: bId })).result;
    this.setState({ curBrand });
    // 添加到我的品牌
    await addToMyBrands({
      brand_id: curBrand.objectId,
      type,
    });
  }

  async getUserBrand(bId) {
    const res = (await getUserBrand({ bId }, false)).result;
    if (res.length === 0) {
      this.gotoEdit();
    } else {
      return res[0];
    }
  }

  gotoEdit() {
    Taro.redirectTo({
      url: getPath({
        moduleName: "card",
        url: `/pages/edit/index`,
        params: {
          bId: this.bId,
        },
      }),
    });
  }

  render() {
    const { curUserBrand, mode, isSelf, cardlist } = this.state;
    let card_ho = null;
    let card_ver = null;
    if (cardlist && cardlist.length > 0) {
      cardlist.map(obj => {
        if (obj.card_width > obj.card_height) {
          card_ho = obj;
        } else {
          card_ver = obj;
        }
        return obj;
      });
    }
    return (
      <>
        {curUserBrand && (
          <View className="carddetail">
            <View className="carddetail-nav">
              <View
                className={`carddetail-nav-item ${mode === 1 && "carddetail-nav-item-active"}`}
                onClick={() => {
                  this.setState({ mode: 1 });
                }}
              >
                竖版
              </View>
              <View
                className={`carddetail-nav-item ${mode === 2 && "carddetail-nav-item-active"}`}
                onClick={() => {
                  this.setState({ mode: 2 });
                }}
              >
                横版
              </View>
            </View>
            {cardlist && cardlist.length > 0 && (
              <View className="carddetail-content">
                {mode === 1 && <CardItem cardItem={card_ver} />}
                {mode === 2 && <CardItem cardItem={card_ho} />}
              </View>
            )}
            {isSelf ? (
              <View className="carddetail-operations">
                <View
                  className="carddetail-operations-item"
                  onClick={() => {
                    Taro.navigateTo({
                      url: getPath({
                        moduleName: "card",
                        url: `/pages/shop/index`,
                        params: {
                          userbrandId: curUserBrand ? curUserBrand.objectId : "",
                        },
                      }),
                    });
                  }}
                >
                  <View className="carddetail-operations-item-body">
                    <AtIcon prefixClass="icon" value="dayin" size="22" color="black"></AtIcon>
                  </View>
                  <View className="carddetail-operations-item-title">印制</View>
                </View>
                <View
                  className="carddetail-operations-item"
                  onClick={() => {
                    Taro.navigateTo({
                      url: getPath({
                        moduleName: "card",
                        url: `/pages/edit/index`,
                        params: {
                          bId: this.$router.params.bId,
                        },
                      }),
                    });
                  }}
                >
                  <View className="carddetail-operations-item-body">
                    <AtIcon prefixClass="icon" value="bianji" size="22" color="black"></AtIcon>
                  </View>
                  <View className="carddetail-operations-item-title">编辑</View>
                </View>
                <Button open-type="share" className="carddetail-operations-item">
                  <View className="carddetail-operations-item-body">
                    <AtIcon prefixClass="icon" value="fenxiang_2" size="22" color="black"></AtIcon>
                  </View>
                  <View className="carddetail-operations-item-title">分享</View>
                </Button>
                <Button
                  className="carddetail-operations-item"
                  onClick={() => {
                    this.handleSaveLocal();
                  }}
                >
                  <View className="carddetail-operations-item-body">
                    <AtIcon prefixClass="icon" value="xiazai1" size="22" color="black"></AtIcon>
                  </View>
                  <View className="carddetail-operations-item-title">保存</View>
                </Button>
              </View>
            ) : (
              <View className="carddetail-operations">
                <Button
                  className="carddetail-operations-item"
                  onClick={() => {
                    Taro.navigateTo({
                      url: getPath({
                        url: `/pages/website/index`,
                        moduleName: "brand",
                        params: {
                          bId: curUserBrand.brand.jxId,
                        },
                      }),
                    });
                  }}
                >
                  {curUserBrand.brand.logo_atom_icon_pure ? (
                    <View
                      className="carddetail-operations-item-body-icon"
                      style={{ backgroundColor: curUserBrand.brand.color_brand_dark || curUserBrand.brand.color_brand }}
                    >
                      <Logo
                        style={{
                          width: "40px",
                          height: "40px",
                          margin: "0 auto",
                        }}
                        iconSrc={curUserBrand.brand.logo_atom_icon_pure}
                        iconColor="white"
                      />
                    </View>
                  ) : (
                    <View className="carddetail-operations-item-body">
                      <AtIcon prefixClass="icon" value="company" size="24" color="black"></AtIcon>
                    </View>
                  )}

                  <View className="carddetail-operations-item-title">{curUserBrand.brand.title_short || "公司介绍"}</View>
                </Button>
                <Button
                  className="carddetail-operations-item"
                  onClick={() => {
                    Taro.makePhoneCall({
                      phoneNumber: curUserBrand.mobile, //仅为示例，并非真实的电话号码
                    });
                  }}
                >
                  <View className="carddetail-operations-item-body">
                    <AtIcon prefixClass="icon" value="telephone" size="24" color="black"></AtIcon>
                  </View>
                  <View className="carddetail-operations-item-title">立即联系</View>
                </Button>
                <Button open-type="share" className="carddetail-operations-item">
                  <View className="carddetail-operations-item-body">
                    <AtIcon prefixClass="icon" value="fenxiang_2" size="22" color="black"></AtIcon>
                  </View>
                  <View className="carddetail-operations-item-title">分享</View>
                </Button>
                <Button
                  className="carddetail-operations-item"
                  onClick={() => {
                    this.handleSaveLocal();
                  }}
                >
                  <View className="carddetail-operations-item-body">
                    <AtIcon prefixClass="icon" value="xiazai1" size="22" color="black"></AtIcon>
                  </View>
                  <View className="carddetail-operations-item-title">保存</View>
                </Button>
              </View>
            )}
          </View>
        )}
      </>
    );
  }
}

export default Index;
