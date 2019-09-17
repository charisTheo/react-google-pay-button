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
  render () {
    return (
      <div style={{display: 'grid', alignContent: 'center', justifyContent: 'center', height: '100%'}}>
        <GPayButton
          totalPriceStatus={'FINAL'}
          totalPrice={'123.45'}
          currencyCode={'USD'}
          countryCode={'US'}
          tokenizationSpecification={tokenizationSpecification}
          development={true}
          merchantInfo={{merchantName: 'Example Merchant'}}
        />
      </div>
    )
  }
}
