import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

/* eslint-disable react/no-unused-prop-types */

var GOOGLE_PAY_BUTTON_SDK_URL = 'https://pay.google.com/gp/p/js/pay.js';

var GPayButton = function (_PureComponent) {
  inherits(GPayButton, _PureComponent);

  function GPayButton() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, GPayButton);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = GPayButton.__proto__ || Object.getPrototypeOf(GPayButton)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      paymentsClientInitialised: false,
      paymentsClient: undefined
    }, _this.loadSDK = function () {
      var script = document.createElement('script');
      script.src = GOOGLE_PAY_BUTTON_SDK_URL;
      script.onload = _this.setPaymentsClient;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }, _this.setPaymentsClient = function () {
      var _this$props = _this.props,
          development = _this$props.development,
          onPaymentAuthorized = _this$props.onPaymentAuthorized,
          onPaymentDataChanged = _this$props.onPaymentDataChanged;


      var options = {
        environment: development ? 'TEST' : 'PRODUCTION'
      };
      if (typeof onPaymentAuthorized === 'function') {
        options = _extends({}, options, {
          paymentDataCallbacks: {
            onPaymentAuthorized: onPaymentAuthorized
          }
        });
      }
      if (typeof onPaymentDataChanged === 'function') {
        options = _extends({}, options, {
          paymentDataCallbacks: _extends({}, options.paymentDataCallbacks, {
            onPaymentDataChanged: onPaymentDataChanged
          })
        });
      }

      _this.setState({
        paymentsClientInitialised: true,
        paymentsClient: new window.google.payments.api.PaymentsClient(options)
      });
    }, _this.payButtonClickListener = function () {
      var _this$props2 = _this.props,
          currencyCode = _this$props2.currencyCode,
          countryCode = _this$props2.countryCode,
          totalPriceStatus = _this$props2.totalPriceStatus,
          totalPrice = _this$props2.totalPrice,
          displayItems = _this$props2.displayItems,
          totalPriceLabel = _this$props2.totalPriceLabel,
          checkoutOption = _this$props2.checkoutOption,
          merchantInfo = _this$props2.merchantInfo,
          apiVersion = _this$props2.apiVersion,
          apiVersionMinor = _this$props2.apiVersionMinor,
          allowedPaymentMethods = _this$props2.allowedPaymentMethods,
          onLoadPaymentData = _this$props2.onLoadPaymentData,
          onPaymentAuthorized = _this$props2.onPaymentAuthorized,
          onPaymentDataChanged = _this$props2.onPaymentDataChanged,
          onUserCanceled = _this$props2.onUserCanceled;


      var paymentDataRequest = {
        apiVersion: apiVersion,
        apiVersionMinor: apiVersionMinor,
        allowedPaymentMethods: allowedPaymentMethods,
        transactionInfo: {
          currencyCode: currencyCode,
          countryCode: countryCode,
          totalPriceStatus: totalPriceStatus,
          totalPrice: totalPrice,
          displayItems: displayItems,
          totalPriceLabel: totalPriceLabel,
          checkoutOption: checkoutOption
        },
        merchantInfo: merchantInfo
      };

      var callbackIntents = [];
      if (typeof onPaymentAuthorized === 'function') {
        callbackIntents.push('PAYMENT_AUTHORIZATION');
      }
      if (typeof onPaymentDataChanged === 'function') {
        callbackIntents.push('SHIPPING_ADDRESS', 'SHIPPING_OPTION');
      }
      if (callbackIntents.length) {
        paymentDataRequest.callbackIntents = [].concat(callbackIntents);
      }

      _this.state.paymentsClient.loadPaymentData(paymentDataRequest).then(function (paymentData) {
        onLoadPaymentData(paymentData);
      }).catch(function (error) {
        console.error('GPayButton.paymentsClient.loadPaymentData -> error', error);
        if (error.statusCode === 'CANCELED') {
          onUserCanceled(paymentDataRequest);
        }
      });
    }, _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(GPayButton, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (!this.state.paymentsClientInitialised) {
        this.loadSDK();
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      var _this2 = this;

      var _state = this.state,
          isReadyToPay = _state.isReadyToPay,
          paymentsClientInitialised = _state.paymentsClientInitialised,
          paymentsClient = _state.paymentsClient;


      if (isReadyToPay || !paymentsClientInitialised) {
        return;
      }

      var _props = this.props,
          apiVersion = _props.apiVersion,
          apiVersionMinor = _props.apiVersionMinor,
          allowedPaymentMethods = _props.allowedPaymentMethods;


      var isReadyToPayRequest = {
        apiVersion: apiVersion,
        apiVersionMinor: apiVersionMinor,
        allowedPaymentMethods: allowedPaymentMethods
      };

      paymentsClient.isReadyToPay(isReadyToPayRequest).then(function (response) {
        var isReadyToPay = response.result;
        if (isReadyToPay) {
          // * this function is called only to initialise the button styling, the returned button element is NOT used
          paymentsClient.createButton({ onClick: _this2.payButtonClickListener });
          _this2.setState({ isReadyToPay: isReadyToPay });
        }
      }).catch(function (error) {
        console.error('window.configureGPay -> error', error);
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          className = _props2.className,
          style = _props2.style,
          color = _props2.color,
          type = _props2.type;


      return React.createElement(
        'div',
        { className: className, style: style },
        this.state.isReadyToPay && React.createElement('button', {
          onClick: this.payButtonClickListener,
          type: 'button',
          'aria-label': 'Google Pay',
          className: 'gpay-button ' + color + ' ' + type
        })
      );
    }
  }]);
  return GPayButton;
}(PureComponent);

GPayButton.propTypes = {
  style: PropTypes.object,
  className: PropTypes.string,
  development: PropTypes.bool,
  color: PropTypes.oneOf(['black', 'white']),
  type: PropTypes.oneOf(['long', 'short']),
  // * Google Pay API
  apiVersion: PropTypes.number,
  apiVersionMinor: PropTypes.number,
  currencyCode: PropTypes.string.isRequired,
  countryCode: PropTypes.string,
  totalPriceStatus: PropTypes.string.isRequired,
  totalPrice: function totalPrice(props, propName, componentName) {
    if (props.totalPriceStatus !== 'NOT_CURRENTLY_KNOWN') {
      if (props[propName] === undefined || props[propName] === '') {
        return new Error(componentName + ': the prop totalPrice is required unless the prop totalPriceStatus is set to NOT_CURRENTLY_KNOWN');
      } else if (!/^[0-9]+(\.[0-9][0-9])?$/.exec(props[propName])) {
        return new Error(componentName + ': the prop totalPrice should be either in a number format or a string of numbers. Should match ^[0-9]+(\\.[0-9][0-9])?$');
      }
    }
  },
  displayItems: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['LINE_ITEM', 'SUBTOTAL']).isRequired,
    price: PropTypes.string.isRequired,
    status: PropTypes.oneOf(['FINAL', 'PENDING'])
  })),
  totalPriceLabel: PropTypes.string,
  checkoutOption: PropTypes.string,
  merchantInfo: function merchantInfo(props, propName, componentName) {
    if (props.development === false && (props[propName].merchantId === undefined || props[propName].merchantId === '')) {
      return new Error(componentName + ': merchantInfo -> merchantId is required in production environment!');
    } else {
      var merchantInfoProps = props[propName];
      // merchantName, merchantOrigin
      for (var prop in merchantInfoProps) {
        if (typeof merchantInfoProps[prop] !== 'string') {
          return new Error(componentName + ': merchantInfo -> ' + prop + ' should be a string!');
        }
      }
    }
  },
  allowedPaymentMethods: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.oneOf(['CARD', 'PAYPAL']),
    parameters: PropTypes.oneOfType([PropTypes.shape({
      allowedAuthMethods: PropTypes.arrayOf(PropTypes.oneOf(['PAN_ONLY', 'CRYPTOGRAM_3DS'])),
      allowedCardNetworks: PropTypes.arrayOf(PropTypes.oneOf(['AMEX', 'DISCOVER', 'INTERAC', 'JCB', 'MASTERCARD', 'VISA']))
    }), PropTypes.shape({
      purchase_context: PropTypes.shape({
        purchase_units: PropTypes.array
      })
    })]),
    tokenizationSpecification: PropTypes.shape({
      type: PropTypes.oneOf(['PAYMENT_GATEWAY', 'DIRECT']),
      parameters: PropTypes.oneOfType([PropTypes.shape({
        gateway: PropTypes.string,
        gatewayMerchantId: PropTypes.string
      }), PropTypes.shape({
        protocolVersion: PropTypes.string,
        publicKey: PropTypes.string
      })])
    })
  })),
  onLoadPaymentData: PropTypes.func,
  onPaymentAuthorized: PropTypes.func,
  onPaymentDataChanged: PropTypes.func,
  onUserCanceled: PropTypes.func
};
GPayButton.defaultProps = {
  style: {},
  development: false,
  color: 'black',
  type: 'long',
  apiVersion: 2,
  apiVersionMinor: 0,
  allowedPaymentMethods: [{
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
  }],
  onLoadPaymentData: function onLoadPaymentData(paymentData) {
    console.warn('GPayButton: Provide an onLoadPaymentData function to capture this paymentData', paymentData);
  },
  onPaymentAuthorized: function onPaymentAuthorized(paymentData) {
    console.warn('GPayButton: Provide an onPaymentAuthorized function to capture this paymentData', paymentData);
  },
  onUserCanceled: function onUserCanceled(paymentDataRequest) {
    console.warn('GPayButton: User has cancelled the transaction -> paymentDataRequest ', paymentDataRequest);
  }
};

export default GPayButton;
//# sourceMappingURL=index.es.js.map
