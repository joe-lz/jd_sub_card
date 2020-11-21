import React, { Component } from "react";
import { View, Button, Text, Navigator } from "@tarojs/components";

import "./index.scss";
import getPath from "@_gen/utils/getPath";
import JX_Navigator from "@_gen/components/Navigator";

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      curBrand: null,
      scrollTop: 0,
      colorBg: "transparent",
      colorText: "white",
      borderBottom: false,
      title: "我的名片",
    };
  }

  componentWillMount() {}

  componentDidMount() {}

  render() {
    return (
      <View className="cardmy">
        <JX_Navigator
          my-class="brandWeb-navigator"
          ref={e => {
            this.navigator = e;
          }}
          title={this.state.title}
          colorBg={this.state.colorBg}
          colorText={this.state.colorText}
          borderBottom={this.state.borderBottom}
        />
      </View>
    );
  }
}

export default Index;
