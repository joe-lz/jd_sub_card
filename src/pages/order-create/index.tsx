import React, { Component } from 'react'
import { View, Button, Text } from '@tarojs/components'

import './index.scss'

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      avatar: null,
      username: null,
      position: null,
      department: null,
      mobile: null,
      email: null,
      wechat: null,

      // user: null,
      // brand: null,
      bId: null,
    };
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='index'>
      </View>
    )
  }
}

export default Index
