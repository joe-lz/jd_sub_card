import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Button, Text, Navigator, Image } from "@tarojs/components";
import { AtIcon } from "taro-ui";

import "./index.scss";
import getPath from "@_gen/utils/getPath";
import JX_Navigator from "@_gen/components/Navigator";
import JX_Button from "@_gen/components/Button";
import { getMyCard, getMyCardById } from "@_gen/service/mycard";
import AV from "@_gen/utils/leancloud-storage/dist/av-weapp.js";
import CardItemSimple from "@_gen/components/CardItemSimple";
import Touchable from "@_gen/components/Touchable";
import makeImgLink from "@_gen/utils/makeImgLink";

import iconWrite from "@src/images/icon-write.png";
import iconSkin from "@src/images/icon-skin.png";
import iconPrint from "@src/images/icon-print.png";
import iconFly from "@src/images/icon-fly.png";
import iconShare from "@src/images/icon-share.png";
import iconDownload from "@src/images/icon-download.png";

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollTop: 0,
      colorBg: "transparent",
      colorText: "white",
      borderBottom: false,
      title: "",
      curMyCard: null,
    };
  }

  componentWillMount() {
    Taro.showShareMenu({
      withShareTicket: true,
      menus: ["shareAppMessage", "shareTimeline"],
    });
  }

  async componentDidMount() {
    const { mycardId } = getCurrentInstance().router.params;

    let curUser = AV.User.current();
    curUser = curUser ? curUser.toJSON() : null;
    Taro.showLoading({ title: "加载中..." });
    let res_mycard = null;
    if (mycardId) {
      res_mycard = await getMyCardById({ id: mycardId });
      this.setState({ mycardId });
    } else {
      res_mycard = await getMyCard();
    }
    this.setState({
      curMyCard: res_mycard.result,
      title: mycardId ? "TA的名片" : "我的名片",
    });
    Taro.hideLoading();
  }

  onShareAppMessage(res) {
    const { curMyCard } = this.state;
    let imageUrl = makeImgLink({
      url: curMyCard.back_img,
      type: "jpg_share",
    });
    let title = "";
    let path = "";
    if (res.from === "button") {
      // 来自页面内转发按钮
      if (res.target.dataset.name === "invite-worker") {
        title = `${curMyCard.name}邀请你使用鲸典智能名片~`;
        imageUrl = "https://static.ccrgt.com/images/961f60f7-a8aa-4eca-8df7-2f71ff945b5e.jpg";
        path = "/page/index/index";
      } else if (res.target.dataset.name === "share-othersCard") {
        title = `${curMyCard.name}的智能名片`;
        imageUrl = imageUrl;
        path = getPath({
          moduleName: "card",
          url: `/pages/my/index`,
          params: {
            mycardId: curMyCard.objectId,
          },
        });
      } else {
        title = `${curMyCard.name}的智能名片`;
        imageUrl = imageUrl;
        path = getPath({
          moduleName: "card",
          url: `/pages/my/index`,
          params: {
            mycardId: curMyCard.objectId,
          },
        });
      }
    }
    return { title, imageUrl, path };
  }

  onShareTimeline(res) {
    return {
      title: "鲸典设计-激活千万品牌价值",
      imageUrl: "../../images/share/logo_round.png",
    };
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
    const { curMyCard } = that.state;
    Taro.addPhoneContact({
      firstName: curMyCard.nname,
      lastName: curMyCard.nname,
      // photoFilePath: curUserBrand.username,
      organization: curMyCard.co_name,
      title: curMyCard.position,
      mobilePhoneNumber: curMyCard.mobile,
      weChatNumber: curMyCard.wechat,
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
    const { curMyCard } = this.state;
    const imgSrc = makeImgLink({
      url: curMyCard && curMyCard.front_img,
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
              {this.state.mycardId ? (
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
                      <Text className="cardmy-body-menu-item-title">企业介绍</Text>
                      <AtIcon prefixClass="icon" value="jichu_you_line" size="14" color="white"></AtIcon>
                    </Navigator>
                  </View>
                  <View className="cardmy-body-menu">
                    <Touchable my-class="cardmy-body-menu-item" opentype="share" data-name="share-othersCard">
                      <Image className="cardmy-body-menu-item-icon" src={iconShare} mode="aspectFit" />
                      <Text className="cardmy-body-menu-item-title">介绍TA给朋友</Text>
                      <AtIcon prefixClass="icon" value="jichu_you_line" size="14" color="white"></AtIcon>
                    </Touchable>
                    <Touchable
                      my-class="cardmy-body-menu-item"
                      onClick={() => {
                        this.handleSaveLocal();
                      }}
                    >
                      <Image className="cardmy-body-menu-item-icon" src={iconDownload} mode="aspectFit" />
                      <Text className="cardmy-body-menu-item-title">保存名片到手机</Text>
                      <AtIcon prefixClass="icon" value="jichu_you_line" size="14" color="white"></AtIcon>
                    </Touchable>
                  </View>
                  <Navigator
                    className="cardmy-body-toMyBtn"
                    url={getPath({
                      moduleName: "card",
                      url: `/pages/my/index`,
                      params: {},
                    })}
                  >
                    我也要制作电子名片
                  </Navigator>
                </View>
              ) : (
                <>
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
                      <Touchable my-class="cardmy-body-menu-item" opentype="share" data-name="invite-worker">
                        <Image className="cardmy-body-menu-item-icon" src={iconFly} mode="aspectFit" />
                        <Text className="cardmy-body-menu-item-title">邀请同事加入</Text>
                        <AtIcon prefixClass="icon" value="jichu_you_line" size="14" color="white"></AtIcon>
                      </Touchable>
                    </View>
                  </View>
                  <View className="cardmy-body-footer">
                    {/* <JX_Button
                  my-class="cardmyEdit-submit-btn"
                  title="分享名片"
                  type="primary"
                  onClick={() => {}}
                  opentype="share"
                  //
                /> */}
                    <Touchable my-class="cardmy-body-footer-share" opentype="share" data-name="share-card">
                      <AtIcon prefixClass="icon" value="share" size="16" color="white"></AtIcon>
                      <Text className="cardmy-body-footer-share-title">分享名片</Text>
                    </Touchable>
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
                </>
              )}
            </View>
          </View>
        )}
      </>
    );
  }
}

export default Index;
