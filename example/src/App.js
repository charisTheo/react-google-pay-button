import React, { Component } from 'react'

import GPayButton from 'react-google-pay-button'

export default class App extends Component {
  render () {
    return (
      <div style={{display: 'grid', alignContent: 'center', justifyContent: 'center', height: '100%'}}>
        <GPayButton />
      </div>
    )
  }
}
