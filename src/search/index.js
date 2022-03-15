'use strict'

import React from 'react';
import ReactDom from 'react-dom';
import './search.less'
import bg from './assets/bg.jpg'


class Search extends React.Component {
  render() {
    return <div className="search-text">
      搜索文件的内容
      <img src={bg} />
    </div>
  }
}

ReactDom.render(
  <Search />,
  document.getElementById('root'),
)