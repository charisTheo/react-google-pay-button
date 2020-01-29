<p align="center">
  <img src="https://github.com/charisTheo/react-google-pay-button/blob/master/gpay-react.png?raw=true" alt="Google Pay React unofficial logo"/>
</p>

# react-google-pay-button

A React Google Pay button component for the web.

### [Example](https://www.charistheo.io/react-google-pay-button/)

[![NPM](https://img.shields.io/npm/v/react-google-pay-button.svg)](https://www.npmjs.com/package/react-google-pay-button) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Googe Pay Button API
> Make sure you have read and understood the official docs before implementing

[Object Reference Docs](https://developers.google.com/pay/api/web/reference/object)

[Google Developers Tutorial](https://developers.google.com/pay/api/web/guides/tutorial)

## Install

```bash
npm install --save react-google-pay-button
```

## Usage

### Development example

```jsx
class Example extends Component {
  render () {
    return (
      <GPayButton
        totalPriceStatus={'FINAL'}
        totalPrice={'14.45'}
        currencyCode={'GBP'}
        countryCode={'GB'}
        development={true}
      />
    )
  }
}
```

### Production example

> To get a `merchantId`, follow [this checklist](https://developers.google.com/pay/api/web/guides/test-and-deploy/integration-checklist)

```jsx
import React, { Component } from 'react'

import GPayButton from 'react-google-pay-button'

// allowed user payment methods 💰
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
        'stripe:publishableKey': '<YOUR_PUBLIC_STRIPE_KEY>'
      }
    }
  },
  {
    type: 'PAYPAL',
    parameters: {
      'purchase_context': {
        'purchase_units': [{
          'payee': {
            'merchant_id': '<YOUR PAYPAL_ACCOUNT_ID>'
          }
        }]
      }
    },
    tokenizationSpecification: {
      type: 'DIRECT'
    }
  }
]

class Example extends Component {
  loadPaymentDataHandler = paymentData => {
    const paymentToken = paymentData.paymentMethodData.tokenizationData.token
  }

  render () {
    return (
      <GPayButton
        totalPriceStatus={'FINAL'}
        totalPrice={'14.45'}
        currencyCode={'GBP'}
        countryCode={'GB'}
        allowedPaymentMethods={paymentMethods}
        development={true}
        merchantInfo={{
          merchantName: '<YOUR MERCHANT NAME>',
          // A Google merchant identifier issued after your website is approved by Google ✅
          merchantId: '<YOUR MERCHANT ID>'
        }}
        onLoadPaymentData={this.loadPaymentDataHandler}
      />
    )
  }
}
```

## Props
|    Prop      |     Type            |                default value                                   |
|:------------:|:-------------------:|:--------------------------------------------------------------:|
| style | object | *For wrapper div element* |
| className | string | *For wrapper div element* |
| development | boolean | false |
| [color][3] | string | 'black' |
| [type][3] | string | 'long' |
| [apiVersion][4] | number | 2 |
| [apiVersionMinor][4] | number | 0 |
| [currencyCode][1]       |     string      |                   **required**                          |
| [totalPriceStatus][1]   |     string      |                   **required**                          |
| [tokenizationSpecification][2] |  object  |                   **required**                          |
| [countryCode][1]    |     string      |    **required** for merchants based in EEA countries    |
| [totalPrice][1] | string \| number | **required** unless `totalPriceStatus` is set to `NOT_CURRENTLY_KNOWN` |
| [merchantInfo][6] | object | `merchantId` is **required** in *production* |
| [allowedPaymentMethods][14] | [PaymentMethod][8] | optional ([default](#allowedPaymentMethods))
| [displayItems][1] | [DisplayItem][5][] | optional |
| [totalPriceLabel][1] | string | optional |
| [checkoutOption][1] | string | optional |
| [onLoadPaymentData][9] | function | optional |
| [onPaymentAuthorized][10] | function | optional |
| [onPaymentDataChanged][11] | function | optional |
| onUserCanceled | function | optional |
---

### allowedPaymentMethods

#### Default value
```JavaScript
[
  {
    type: 'CARD',
    parameters: {
      allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
      allowedCardNetworks: ['AMEX', 'DISCOVER', 'INTERAC', 'JCB', 'MASTERCARD', 'VISA']
    },
    tokenizationSpecification: {
      type: 'PAYMENT_GATEWAY',
      parameters: {
        gateway: 'example',
        gatewayMerchantId: 'exampleGatewayMerchantId'
      }
    }
  }
]
```

 * [CardParameters][12]
 * [PayPalParameters][13]

[1]: https://developers.google.com/pay/api/web/reference/object#TransactionInfo
[2]: https://developers.google.com/pay/api/web/reference/object#PaymentMethodTokenizationSpecification
[3]: https://developers.google.com/pay/api/web/reference/object#ButtonOptions
[4]: https://developers.google.com/pay/api/web/reference/object#IsReadyToPayRequest
[5]: https://developers.google.com/pay/api/web/reference/object#DisplayItem
[6]: https://developers.google.com/pay/api/web/reference/object#MerchantInfo
[8]: https://developers.google.com/pay/api/web/reference/object#PaymentMethod
[9]: https://developers.google.com/pay/api/web/reference/client#loadPaymentData
[10]: https://developers.google.com/pay/api/web/reference/client#onPaymentAuthorized
[11]: https://developers.google.com/pay/api/web/reference/client#onPaymentDataChanged
[12]: https://developers.google.com/pay/api/web/reference/object#CardParameters
[13]: https://developers.google.com/pay/api/web/reference/object#PayPalParameters
[14]: https://developers.google.com/pay/api/web/reference/object#PaymentDataRequest
