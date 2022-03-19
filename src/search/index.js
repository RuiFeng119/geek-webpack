'use strict'

import React from 'react';
import ReactDom from 'react-dom';
import './search.less'
import bg from './assets/bg.png'

import '../../commons/common.js'

class Search extends React.Component {
  render() {
    return <div className="search-text">
      搜索文件的内容
      <span>span元素</span>
      <img src={bg} />
    </div>
  }
}

ReactDom.render(
  <Search />,
  document.getElementById('root'),
)