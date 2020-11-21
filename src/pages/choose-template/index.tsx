import React, { Component } from "react";
import { View, Button, Text, Navigator, Swiper, SwiperItem } from "@tarojs/components";

import "./index.scss";
import getPath from "@_gen/utils/getPath";
import JX_Navigator from "@_gen/components/Navigator";
import JX_Button from "@_gen/components/Button";
import { getCardTemplate } from "@_gen/service/cardtemplate";

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      colorBg: "transparent",
      colorText: "white",
      borderBottom: false,
      title: "选择名片",
      list: null,
    };
  }

  componentWillMount() {}

  async componentDidMount() {
    // 获取名片模板列表
    const res = await getCardTemplate();
    this.setState({
      list: res.result,
    });
  }

  handleSubmit() {}

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
          {this.state.list && this.state.list.length > 0 ?(
            <Swiper className="cardChoose-body-swiper" vertical={false} previousMargin="50px" nextMargin="50px">
              {this.state.list.map((obj, index) => {
                return (
                  <SwiperItem className="cardChoose-body-swiper-item" key={`${index + 1}`}>
                    <View className="cardChoose-body-swiper-item-content">1</View>
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
