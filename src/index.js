/* eslint-disable padded-blocks */
/* eslint-disable no-multiple-empty-lines */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import styles from './styles.css'

const GOOGLE_PAY_BUTTON_SDK_URL = 'https://pay.google.com/gp/p/js/pay.js'
const baseRequest = {
  apiVersion: 2,
  apiVersionMinor: 0
}
const tokenizationSpecification = {
  type: 'PAYMENT_GATEWAY',
  parameters: {
    'gateway': 'example',
    'gatewayMerchantId': 'exampleGatewayMerchantId'
  }
}
const allowedCardNetworks = ['AMEX', 'DISCOVER', 'INTERAC', 'JCB', 'MASTERCARD', 'VISA']
const allowedAuthMethods = ['PAN_ONLY', 'CRYPTOGRAM_3DS']
const baseCardPaymentMethod = {
  type: 'CARD',
  parameters: {
    allowedAuthMethods,
    allowedCardNetworks
  },
  tokenizationSpecification
}

export default class GPayButton extends PureComponent {
  static propTypes = {

  }

  static defaultProps = {
    text: 'Button'
  }

  state = {
    paymentsClientInitialised: false,
    paymentsClient: undefined
  }

  componentDidMount() {
    console.log('GPayButton.componentDidMount: this.state.paymentsClientInitialised', this.state.paymentsClientInitialised)
    if (!this.state.paymentsClientInitialised) {
      this.loadSDK()
    }
  }

  loadSDK = () => {
    const script = document.createElement('script')
    script.src = GOOGLE_PAY_BUTTON_SDK_URL
    script.onload = this.setPaymentsClient
    script.async = true
    script.defer = true
    document.body.appendChild(script)
  }

  setPaymentsClient = () => {
    this.setState({
      paymentsClientInitialised: true,
      paymentsClient: new window.google.payments.api.PaymentsClient({environment: 'TEST'})
    })
  }

  payButtonClickListener = () => {
    const paymentDataRequest = {
      ...baseRequest,
      allowedPaymentMethods: [baseCardPaymentMethod],
      transactionInfo: {
        totalPriceStatus: 'FINAL',
        totalPrice: '123.45',
        currencyCode: 'USD',
        countryCode: 'US'
      },
      merchantInfo: {
        merchantName: 'Example Merchant'
      }
    }

    this.state.paymentsClient.loadPaymentData(paymentDataRequest).then(function(paymentData) {
      // if using gateway tokenization, pass this token without modification
      const paymentToken = paymentData.paymentMethodData.tokenizationData.token
      console.log('TCL: GPayButton -> payButtonClickListener -> paymentToken', paymentToken)

    }).catch(function(err) {
      console.error('payButtonClickListener -> err', err)
    })
  }

  componentDidUpdate() {
    if (this.state.isReadyToPay) return
    console.log('TCL: GPayButton -> componentDidUpdate -> this.state.paymentsClientInitialised', this.state.paymentsClientInitialised)

    const isReadyToPayRequest = {
      ...baseRequest,
      allowedPaymentMethods: [baseCardPaymentMethod]
    }

    this.state.paymentsClient.isReadyToPay(isReadyToPayRequest)
      .then(response => {
        const isReadyToPay = response.result
        if (isReadyToPay) {
          // * this function is called only to initialise the button styling, the returned button element is NOT used
          this.state.paymentsClient.createButton({onClick: this.payButtonClickListener})
          this.setState({ isReadyToPay })
        }

      })
      .catch(error => {
        console.error('window.configureGPay -> error', error)

      })
  }

  render() {
    // const {

    // } = this.props

    return (
      <div>
        { this.state.isReadyToPay &&
          <button
            onClick={this.payButtonClickListener}
            type='button'
            aria-label='Google Pay'
            className='gpay-button black long'
          />
        }
      </div>
    )
  }
}
