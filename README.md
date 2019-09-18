<p align="center">
  <img src="https://github.com/charisTheo/react-google-pay-button/blob/master/gpay-react.png?raw=true" alt="Google Pay React unofficial logo"/>
</p>

# react-google-pay-button

> A React Google Pay button component for the web

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

```jsx
import React, { Component } from 'react'

import GPayButton from 'react-google-pay-button'

class Example extends Component {
  render () {
    const tokenizationSpecification = {
      type: 'PAYMENT_GATEWAY',
      parameters: {
        'gateway': 'example',
        'gatewayMerchantId': 'exampleGatewayMerchantId'
      }
    }

    return (
      <GPayButton
        totalPriceStatus={'FINAL'}
        totalPrice={'14.45'}
        currencyCode={'GBP'}
        countryCode={'UK'}
        tokenizationSpecification={tokenizationSpecification}
        development={true}
        merchantInfo={{merchantName: 'Example Merchant'}}
        onLoadPaymentData={this.loadPaymentDataHandler}
        onPaymentAuthorized={this.paymentAuthorizedHandler}
        onUserCanceled={this.onUserCanceledHandler}
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
| [displayItems][1] | [DisplayItem][5][] | optional |
| [totalPriceLabel][1] | string | optional |
| [checkoutOption][1] | string | optional |
| [allowedAuthMethods][7] | string[] | `['PAN_ONLY', 'CRYPTOGRAM_3DS']` |
| [allowedCardNetworks][7] | string[] | `['AMEX', 'DISCOVER', 'INTERAC', 'JCB', 'MASTERCARD', 'VISA']` |
| [paymentMethodType][8] | string | `CARD` (`CARD` or `PAYPAL`) |
| [purchase_context][9] | object | **required** if `paymentMethodType` is set to `PAYPAL` |
| [onLoadPaymentData][10] | function | optional |
| [onPaymentAuthorized][11] | function | optional |
| [onPaymentDataChanged][12] | function | optional |
| onUserCanceled | function | optional |

---
## License

MIT © [charisTheo](https://github.com/charisTheo)

[1]: https://developers.google.com/pay/api/web/reference/object#TransactionInfo
[2]: https://developers.google.com/pay/api/web/reference/object#PaymentMethodTokenizationSpecification
[3]: https://developers.google.com/pay/api/web/reference/object#ButtonOptions
[4]: https://developers.google.com/pay/api/web/reference/object#IsReadyToPayRequest
[5]: https://developers.google.com/pay/api/web/reference/object#DisplayItem
[6]: https://developers.google.com/pay/api/web/reference/object#MerchantInfo
[7]: https://developers.google.com/pay/api/web/reference/object#CardParameters
[8]: https://developers.google.com/pay/api/web/reference/object#PaymentMethod
[9]: https://developers.google.com/pay/api/web/reference/object#PayPalParameters
[10]: https://developers.google.com/pay/api/web/reference/client#loadPaymentData
[11]: https://developers.google.com/pay/api/web/reference/client#onPaymentAuthorized
[12]: https://developers.google.com/pay/api/web/reference/client#onPaymentDataChanged
