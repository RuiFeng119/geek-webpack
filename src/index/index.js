import React from 'react';
import ReactDom from 'react-dom';
import { helloworld } from './helloworld';

import '../../commons/common.js'

document.write(helloworld())

class Index extends React.Component {
  render() {
    return <div >Index页面</div>
  }
}

ReactDom.render(
  <Index />,
  document.getElementById('root'),
)