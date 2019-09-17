/* eslint-disable react/no-unused-prop-types */
/* eslint-disable padded-blocks */
/* eslint-disable no-multiple-empty-lines */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

const GOOGLE_PAY_BUTTON_SDK_URL = 'https://pay.google.com/gp/p/js/pay.js'

export default class GPayButton extends PureComponent {
  static propTypes = {
    style: PropTypes.object,
    className: PropTypes.string,
    color: PropTypes.oneOf(['black', 'white']),
    buttonType: PropTypes.oneOf(['long', 'short']),
    development: PropTypes.bool,
    // * Google Pay API
    currencyCode: PropTypes.string.isRequired,
    countryCode: PropTypes.string,
    totalPriceStatus: PropTypes.string.isRequired,
    totalPrice: (props, propName, componentName) => {
      if (props.totalPriceStatus !== 'NOT_CURRENTLY_KNOWN') {
        if (props[propName] === undefined || props[propName] === '') {
          return new Error(`${componentName}: the prop totalPrice is required unless the prop totalPriceStatus is set to NOT_CURRENTLY_KNOWN`)
        } else if (!/^[0-9]+(\.[0-9][0-9])?$/.exec(props[propName])) {
          return new Error(`${componentName}: the prop totalPrice should be either in a number format or a string of numbers. Should match ^[0-9]+(\\.[0-9][0-9])?$`)
        }
      }
    },
    displayItems: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['LINE_ITEM', 'SUBTOTAL']),
      price: PropTypes.string.isRequired,
      status: PropTypes.oneOf(['FINAL', 'PENDING'])
    })),
    totalPriceLabel: PropTypes.string,
    checkoutOption: PropTypes.string,
    merchantInfo: function (props, propName, componentName) {
      if (props.development === false && (props[propName].merchantId === undefined || props[propName].merchantId === '')) {
        return new Error(`${componentName}: merchantInfo -> merchantId is required in production environment!`)
      } else {
        const merchantInfoProps = props[propName]
        // merchantName, merchantOrigin
        for (let prop in merchantInfoProps) {
          if (typeof merchantInfoProps[prop] !== 'string') {
            return new Error(`${componentName}: merchantInfo -> ${prop} should be a string!`)
          }
        }
      }
    },
    baseRequest: PropTypes.shape({
      apiVersion: PropTypes.number,
      apiVersionMinor: PropTypes.number
    }),
    tokenizationSpecification: PropTypes.shape({
      type: PropTypes.oneOf(['PAYMENT_GATEWAY', 'DIRECT']).isRequired,
      parameters: PropTypes.oneOfType([
        PropTypes.shape({
          gateway: PropTypes.string,
          gatewayMerchantId: PropTypes.string
        }),
        PropTypes.shape({
          protocolVersion: PropTypes.string,
          publicKey: PropTypes.string
        })
      ]).isRequired
    }).isRequired,
    allowedCardNetworks: PropTypes.arrayOf(PropTypes.oneOf(['AMEX', 'DISCOVER', 'INTERAC', 'JCB', 'MASTERCARD', 'VISA'])),
    allowedAuthMethods: PropTypes.arrayOf(PropTypes.oneOf(['PAN_ONLY', 'CRYPTOGRAM_3DS'])),
    // ? Paypal support
    purchase_context: PropTypes.shape({
      purchase_units: PropTypes.array
    }),
    paymentMethodType: PropTypes.oneOf(['CARD', 'PAYPAL']).isRequired,
    onLoadPaymentData: PropTypes.func,
    onPaymentAuthorized: PropTypes.func,
    onPaymentDataChanged: PropTypes.func,
    onUserCanceled: PropTypes.func
  }

  static defaultProps = {
    development: false,
    color: 'black',
    buttonType: 'long',
    baseRequest: {
      apiVersion: 2,
      apiVersionMinor: 0
    },
    allowedCardNetworks: ['AMEX', 'DISCOVER', 'INTERAC', 'JCB', 'MASTERCARD', 'VISA'],
    allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
    paymentMethodType: 'CARD'
  }

  state = {
    paymentsClientInitialised: false,
    paymentsClient: undefined
  }

  componentDidMount() {
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
    const {
      development,
      onPaymentAuthorized,
      onPaymentDataChanged
    } = this.props

    let options = {
      environment: development ? 'TEST' : 'PRODUCTION'
    }
    if (typeof onPaymentAuthorized === 'function') {
      options = {
        ...options,
        paymentDataCallbacks: {
          onPaymentAuthorized
        }
      }
    }
    if (typeof onPaymentDataChanged === 'function') {
      options = {
        ...options,
        paymentDataCallbacks: {
          ...options.paymentDataCallbacks,
          onPaymentDataChanged
        }
      }
    }

    this.setState({
      paymentsClientInitialised: true,
      paymentsClient: new window.google.payments.api.PaymentsClient(options)
    })
  }

  payButtonClickListener = () => {
    const {
      currencyCode,
      countryCode,
      totalPriceStatus,
      totalPrice,
      displayItems,
      totalPriceLabel,
      checkoutOption,
      merchantInfo,
      baseRequest,
      paymentMethodType,
      allowedAuthMethods,
      allowedCardNetworks,
      tokenizationSpecification,
      onLoadPaymentData,
      onPaymentAuthorized,
      onPaymentDataChanged,
      onUserCanceled
    } = this.props

    const baseCardPaymentMethod = {
      type: paymentMethodType,
      parameters: {
        allowedAuthMethods,
        allowedCardNetworks
      },
      tokenizationSpecification
    }

    const paymentDataRequest = {
      ...baseRequest,
      allowedPaymentMethods: [baseCardPaymentMethod],
      transactionInfo: {
        currencyCode,
        countryCode,
        totalPriceStatus,
        totalPrice,
        displayItems,
        totalPriceLabel,
        checkoutOption
      },
      merchantInfo
    }

    const callbackIntents = []
    if (typeof onPaymentAuthorized === 'function') {
      callbackIntents.push('PAYMENT_AUTHORIZATION')
    }
    if (typeof onPaymentDataChanged === 'function') {
      callbackIntents.push('SHIPPING_ADDRESS', 'SHIPPING_OPTION')
    }
    if (callbackIntents.length) {
      paymentDataRequest.callbackIntents = [...callbackIntents]
    }

    this.state.paymentsClient.loadPaymentData(paymentDataRequest).then(function(paymentData) {
      onLoadPaymentData(paymentData)

    }).catch(function(error) {
      console.error('GPayButton.paymentsClient.loadPaymentData -> error', error)
      if (error.statusCode === 'CANCELED') {
        onUserCanceled(paymentDataRequest)
      }

    })
  }

  componentDidUpdate() {
    const {
      isReadyToPay,
      paymentsClientInitialised,
      paymentsClient
    } = this.state

    if (isReadyToPay || !paymentsClientInitialised) {
      return
    }

    const {
      paymentMethodType,
      allowedAuthMethods,
      allowedCardNetworks,
      tokenizationSpecification
    } = this.props
    const baseCardPaymentMethod = {
      type: paymentMethodType,
      parameters: {
        allowedAuthMethods,
        allowedCardNetworks
      },
      tokenizationSpecification
    }

    const isReadyToPayRequest = {
      ...this.props.baseRequest,
      allowedPaymentMethods: [baseCardPaymentMethod]
    }

    paymentsClient.isReadyToPay(isReadyToPayRequest)
      .then(response => {
        const isReadyToPay = response.result
        if (isReadyToPay) {
          // * this function is called only to initialise the button styling, the returned button element is NOT used
          paymentsClient.createButton({onClick: this.payButtonClickListener})
          this.setState({ isReadyToPay })
        }

      })
      .catch(error => {
        console.error('window.configureGPay -> error', error)

      })
  }

  render() {
    const {
      className,
      style,
      color,
      buttonType
    } = this.props

    return (
      <div className={className} style={style}>
        { this.state.isReadyToPay &&
          <button
            onClick={this.payButtonClickListener}
            type='button'
            aria-label='Google Pay'
            className={`gpay-button ${color} ${buttonType}`}
          />
        }
      </div>
    )
  }
}
