import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Button, Text } from "@tarojs/components";
import AV from "@_gen/utils/leancloud-storage/dist/av-weapp.js";

import "./index.scss";
import FixedBottom from "@_gen/components/FixedBottom";
import CardItem from "@_gen/components/CardItem";
import Price from "@_gen/components/Price";
import Touchable from "@_gen/components/Touchable";
import Counter from "@_gen/components/Counter";
import JX_Button from "@_gen/components/Button";
import getPath from "@_gen/utils/getPath";
import ProductCard from "@_gen/components/ProductCard";
import RenderPrice from "@_gen/components/RenderPrice";
import RenderAddress from "@_gen/components/RenderAddress";
import RenderInvoice from "@_gen/components/RenderInvoice";

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: null, // {userName, postalCode, provinceName, cityName, countyName, detailInfo, telNumber}
      invoiceInfo: null, // {type, taxNumber, title, telephone, companyAddress, bankName, bankAccount}
      orderProducts: null,
    };
  }

  componentDidMount() {
    const orderProducts = Taro.getStorageSync("orderProducts");
    this.setState({ orderProducts });
  }

  _onSubmit() {
    const { address, invoiceInfo } = this.state;

    if (!address) {
      Taro.showToast({ title: "请选择收货地址", icon: "none", duration: 1000 });
      return;
    }
    const orderProducts = Taro.getStorageSync("orderProducts");

    let price_product = 0;
    if (orderProducts && orderProducts.number) {
      price_product = orderProducts.number * orderProducts.price;
    }
    const price_transportation = 0;
    const price_total = price_product + price_transportation;

    const params = {
      // brand_id: AV.Object.createWithoutData("Brand", curBrand.objectId),
      // user_id: AV.User.current(),
      // username: AV.User.current().attributes.username,
      // brand_id: curBrand.objectId,
      status: 1,
      products: [orderProducts],
      address,
      invoice: invoiceInfo,
      price_product, // 商品价格
      price_transportation, // 运费
      price_total,
      // pay_time: null,
      // pay_way: 1,
      // pay_way_id: null,
      // trade_id: null,
      // trade_type: "微信"
    };
    // 创建订单
    // orderStore.createOrder(params).then((res) => {});
    AV.Cloud.run("orderCardCreate", params)
      .then(data => {
        const payparams = {
          appId: data.appId,
          nonceStr: data.nonceStr,
          package: data.package,
          paySign: data.paySign,
          signType: data.signType,
          timeStamp: data.timeStamp,
        };
        // 去支付
        wx.requestPayment({
          ...payparams,
          success: payResult => {
            // 支付成功
            console.log({ payResult });
            Taro.showToast({ title: "支付成功", icon: "success", duration: 1000 });
            // 跳转订单详情
            Taro.requestSubscribeMessage({
              tmplIds: [
                // 'QG0tahkh0Kpp8n2Pm5a8b6y_hMIaCrPTsd7wFiZ_OGE', // 下单成功
                "c3EP5ri3Z8l2CGH1Fp3GNFnYG70mzjpbT3OcH053dqE", // 发货提醒
                "hLqYQbiMgVxZnmuiU_xJO6tBEyn3TWqRSIULZINMxp8", // 确认收货提醒
              ],
              complete() {
                // Taro.redirectTo({ url: `/packages/brand/pages/order-detail/index?orderId=${data.orderId}` });
                Taro.redirectTo({
                  url: getPath({
                    moduleName: "brand",
                    url: `/pages/order-detail/index`,
                    params: {
                      orderId: data.orderId,
                    },
                  }),
                });
              },
            });
          },
          fail: payError => {
            console.log({ payError });
            Taro.showToast({ title: "支付失败", icon: "none", duration: 1000 });
            // 跳转订单详情
            // Taro.redirectTo({ url: `/packages/brand/pages/order-detail/index?orderId=${data.orderId}` });
            Taro.redirectTo({
              url: getPath({
                moduleName: "brand",
                url: `/pages/order-detail/index`,
                params: {
                  orderId: data.orderId,
                },
              }),
            });
          },
        });
      })
      .catch(error => {
        console.warn({ error });
        // 错误处理
        Taro.showToast({ title: "支付失败", icon: "none", duration: 1000 });
      });
  }

  render() {
    const { orderProducts } = this.state;
    let price_product = 0;
    if (orderProducts && orderProducts.number) {
      price_product = orderProducts.number * orderProducts.price;
    }

    return (
      <>
        {orderProducts && (
          <>
            <View className="ordercreate">
              <RenderAddress
                onChange={res => {
                  this.setState({ address: res });
                }}
              />
              <View className="ordercreate-section">
                <ProductCard productData={orderProducts} />
              </View>
              <View className="ordercreate-section">
                <Touchable my-class="ordercreate-menu-item">
                  <Text className="" style={{ flex: 1 }}>
                    配送方式
                  </Text>
                  <Text className="ordercreate-menu-item-desc">快递免邮</Text>
                </Touchable>
              </View>
              <RenderInvoice
                onChange={res => {
                  this.setState({ invoiceInfo: res });
                }}
              />
              <RenderPrice price_product={price_product} />
            </View>
            <FixedBottom className="ordercreate-fixedbottom">
              <View style={{ width: "100%", padding: "0 15px" }}>
                <JX_Button
                  my-class=""
                  title={`微信支付：${price_product / 100}元`}
                  type="wechat"
                  style={{ width: "100%" }}
                  onClick={() => {
                    this._onSubmit();
                  }}
                />
              </View>
            </FixedBottom>
          </>
        )}
      </>
    );
  }
}

export default Index;
