import React, { Component } from 'react'

import GPayButton from 'react-google-pay-button'

const paymentMethods = [
  {
    type: 'CARD',
    parameters: {
      allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
      allowedCardNetworks: ['AMEX', 'DISCOVER', 'INTERAC', 'JCB', 'MASTERCARD', 'VISA']
    },
    tokenizationSpecification: {
      type: 'PAYMENT_GATEWAY',
      parameters: {
        'gateway': 'stripe',
        'stripe:version': '2019-03-14',
        'stripe:publishableKey': 'pk_live_HvZMfApWVG62QaAwPdu8XezV00yRddWoZp'
      }
    }
  }
]

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
          merchantInfo={{
            merchantName: 'Example Merchant',
            merchantId: '<YOUR MERCHANT ID>'
          }}
          development={true}
          onLoadPaymentData={this.loadPaymentDataHandler}
          onPaymentAuthorized={this.paymentAuthorizedHandler}
          onUserCanceled={this.onUserCanceledHandler}
        />
      </div>
    )
  }
}
