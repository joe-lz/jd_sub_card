import React, { Component } from "react";
import { View, Button, Text, Navigator } from "@tarojs/components";

import "./index.scss";
import getPath from "@_gen/utils/getPath";
import JX_Navigator from "@_gen/components/Navigator";
import MenuWrapper from "@_gen/components/MenuWrapper";
import MenuItem from "@_gen/components/MenuItem";
import JX_Button from "@_gen/components/Button";

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {}

  componentDidMount() {}

  render() {
    return (
      <View className="cardmyEdit">
        <MenuWrapper title="个人信息">
          <MenuItem title="姓名"></MenuItem>
          <MenuItem title="职位"></MenuItem>
          <MenuItem title="岗位"></MenuItem>
        </MenuWrapper>
        <MenuWrapper title="组织信息">
          <MenuItem title="组织名称"></MenuItem>
          <MenuItem title="简称"></MenuItem>
          <MenuItem title="标志"></MenuItem>
          <MenuItem title="地址"></MenuItem>
          <MenuItem title="官网地址"></MenuItem>
        </MenuWrapper>
        <MenuWrapper title="联系信息">
          <MenuItem title="手机号"></MenuItem>
          <MenuItem title="邮箱"></MenuItem>
          <MenuItem title="微信号"></MenuItem>
        </MenuWrapper>
        <JX_Button
          my-class="cardmyEdit-submit-btn"
          title="生成电子名片"
          type="primary"
          // style={{ borderRadius: 4 }}
          onClick={() => {}} //
        />
        <View className="cardmyEdit-link">
          <Text>嫌麻烦？</Text>
          <Navigator className="cardmyEdit-link-title">专属设计师贴身定制</Navigator>
          <Navigator className="cardmyEdit-link-tag">99元特惠</Navigator>
        </View>
      </View>
    );
  }
}

export default Index;
