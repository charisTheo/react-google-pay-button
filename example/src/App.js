import React, { Component } from 'react'

import GPayButton from 'react-google-pay-button'

const tokenizationSpecification = {
  type: 'PAYMENT_GATEWAY',
  parameters: {
    'gateway': 'example',
    'gatewayMerchantId': 'exampleGatewayMerchantId'
  }
}

export default class App extends Component {
  loadPaymentDataHandler = paymentData => {
    console.log('App.loadPaymentDataHandler: paymentData', paymentData)
    // const paymentToken = paymentData.paymentMethodData.tokenizationData.token
  }

  paymentAuthorizedHandler = paymentData => {
    console.log('App.paymentAuthorizedHandler: paymentData', paymentData)
    // const paymentToken = paymentData.paymentMethodData.tokenizationData.token
    // TODO execute payment
  }

  onUserCanceledHandler = paymentRequest => {
    console.log('App.onUserCanceled: paymentRequest', paymentRequest)
  }

  paymentDataChangedHandler = paymentData => {
    console.log('App.paymentDataChangedHandler: paymentData', paymentData)
  }

  render () {
    return (
      <div style={{display: 'grid', alignContent: 'center', justifyContent: 'center', height: '100%'}}>
        <GPayButton
          totalPriceStatus={'FINAL'}
          totalPrice={'1.45'}
          currencyCode={'GBP'}
          countryCode={'UK'}
          tokenizationSpecification={tokenizationSpecification}
          development={true}
          merchantInfo={{merchantName: 'Example Merchant'}}
          onLoadPaymentData={this.loadPaymentDataHandler}
          onPaymentAuthorized={this.paymentAuthorizedHandler}
          onUserCanceled={this.onUserCanceledHandler}
        />
      </div>
    )
  }
}
