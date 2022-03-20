'use strict';

import React from 'react';
import ReactDom from 'react-dom';
import './search.less';
import bg from './assets/bg.png';

import '../../commons/common.js';
// import { a } from './tree-shaking.js'

import largeNumber from 'large-num-f119';

class Search extends React.Component {
  // 动态import
  constructor() {
    super(...arguments);
    this.state = {
      Text: null
    };
  }
  loadComponent() {
    import('./text.js').then((Text) => {
      this.setState({
        Text: Text.default
      });
    });
  }
  render() {
    // const funcA = a();
    const result = largeNumber(100, 899);
    const { Text } = this.state;
    return <div className="search-text">
      搜索文件的内容
      <span>span元素</span>
      {
        Text ? <Text /> : null
      }
      {result}
      <img src={bg} onClick={this.loadComponent.bind(this)} />
    </div>;
  }
}

ReactDom.render(
  <Search />,
  document.getElementById('root'),
);