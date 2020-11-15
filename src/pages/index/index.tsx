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
import makeImgLink from "@_gen/utils/makeImgLink";

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
    const currentUser = AV.User.current();
    if (currentUser) {
      await updateCurUser({ needLogin: true });
    }
    let curUserBrand = null;
    if (scene) {
      // 从分享进来，或从二维码进来
      const newScene = decodeURIComponent(scene).split(",");
      // let [userbrandId, bId] = newScene
      let userbrandId = newScene[0];
      console.log(newScene);
      if (newScene[1]) {
        // 从官网 名片二维码过来
        bId = newScene[1];
        this.bId = bId;
        if (!currentUser) {
          await updateCurUser({ needLogin: true });
          return;
        }
        curUserBrand = await this.getUserBrand(bId);
        this.setState({ curUserBrand });
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
      isSelf: curUserBrand && curUserBrand.user.objectId === (currentUser ? currentUser.id : ""),
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

  handleSaveLocal() {
    const that = this;
    Taro.showActionSheet({
      itemList: ["保存至相册", "添加至通讯录"],
      success(res) {
        if (res.tapIndex === 0) {
          that.handleSaveImg(that);
        } else if (res.tapIndex === 1) {
          that.addPhoneContact(that);
        }
      },
      fail(res) {
        console.log(res.errMsg);
      },
    });
  }

  addPhoneContact(that) {
    const { mode, isSelf, curUserBrand, cardlist } = that.state;
    Taro.addPhoneContact({
      firstName: curUserBrand.username,
      lastName: curUserBrand.username,
      // photoFilePath: curUserBrand.username,
      organization: curUserBrand.brand.title,
      title: curUserBrand.position,
      mobilePhoneNumber: curUserBrand.mobile,
      weChatNumber: curUserBrand.wechat,
      success: () => {
        Taro.showToast({
          title: "保存成功",
          icon: "success",
          duration: 2000,
        });
      },
      fail(err) {
        Taro.showToast({
          title: "保存失败",
          icon: "none",
          duration: 2000,
        });
      },
      complete() {},
    });
  }

  handleSaveImg(that) {
    Taro.getSetting({
      success(res) {
        if (!res.authSetting["scope.writePhotosAlbum"]) {
          Taro.authorize({
            scope: "scope.writePhotosAlbum",
            success() {
              console.log("授权成功");
              that.handleSave(that);
            },
            fail() {
              Taro.showModal({
                title: "提示",
                content: "需要开启保存到相册的权限",
                confirmText: "好",
                cancelText: "暂不开启",
                success(res) {
                  if (res.confirm) {
                    Taro.openSetting({
                      success(resp) {
                        console.log(resp.authSetting);
                      },
                      fail(err) {
                        console.log({ err });
                      },
                    });
                  } else if (res.cancel) {
                    console.log("用户点击取消");
                  }
                },
              });
            },
          });
        } else {
          // 有权限
          that.handleSave(that);
        }
      },
    });
  }

  handleSave(that) {
    Taro.showLoading({
      title: "保存中...",
    });
    const { mode, isSelf, cardlist } = that.state;
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

    const curCard = mode === 1 ? card_ver : card_ho;
    const imgSrc = makeImgLink({
      url: curCard && curCard.front_img,
      type: "jpg_contain",
    });
    Taro.downloadFile({
      url: imgSrc,
      success(res) {
        //图片保存到本地
        Taro.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(data) {
            Taro.showToast({
              title: "保存成功",
              icon: "success",
              duration: 2000,
            });
          },
          fail(err) {
            Taro.showToast({
              title: "保存失败",
              icon: "none",
              duration: 2000,
            });
          },
          complete() {
            Taro.hideLoading();
          },
        });
      },
      complete() {
        Taro.hideLoading();
      },
    });
  }

  onShareAppMessage(res) {
    const { mode, isSelf, curUserBrand, cardlist } = this.state;
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
    const curCard = mode === 1 ? card_ver : card_ho;
    const imgSrc = makeImgLink({
      url: curCard && curCard.back_img,
      type: "jpg_share",
    });
    const path = getPath({
      moduleName: "card",
      url: `/pages/index/index`,
      params: {
        scene: curUserBrand.jxId,
      },
    });
    console.log({ path });
    return {
      title: `${curUserBrand.username}的名片`,
      path, // `packages/card/pages/index/index?scene=${curUserBrand.jxId}`
      imageUrl: imgSrc,
    };
  }

  onShareTimeline(res) {
    return {
      title: "我的名片",
    };
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
                          bId: this.bId,
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
