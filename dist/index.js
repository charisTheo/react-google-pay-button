'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
require('prop-types');

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css = "/* add css styles here (optional) */\n\n.styles_test__32Qsm {\n  display: inline-block;\n  margin: 2em auto;\n  border: 2px solid #000;\n  font-size: 2em;\n}\n";
styleInject(css);

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

/* eslint-disable padded-blocks */

var GOOGLE_PAY_BUTTON_SDK_URL = 'https://pay.google.com/gp/p/js/pay.js';
var baseRequest = {
  apiVersion: 2,
  apiVersionMinor: 0
};
var tokenizationSpecification = {
  type: 'PAYMENT_GATEWAY',
  parameters: {
    'gateway': 'example',
    'gatewayMerchantId': 'exampleGatewayMerchantId'
  }
};
var allowedCardNetworks = ['AMEX', 'DISCOVER', 'INTERAC', 'JCB', 'MASTERCARD', 'VISA'];
var allowedAuthMethods = ['PAN_ONLY', 'CRYPTOGRAM_3DS'];
var baseCardPaymentMethod = {
  type: 'CARD',
  parameters: {
    allowedAuthMethods: allowedAuthMethods,
    allowedCardNetworks: allowedCardNetworks
  },
  tokenizationSpecification: tokenizationSpecification
};

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
      _this.setState({
        paymentsClientInitialised: true,
        paymentsClient: new window.google.payments.api.PaymentsClient({ environment: 'TEST' })
      });
    }, _this.payButtonClickListener = function () {
      var paymentDataRequest = _extends({}, baseRequest, {
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
      });

      _this.state.paymentsClient.loadPaymentData(paymentDataRequest).then(function (paymentData) {
        // if using gateway tokenization, pass this token without modification
        var paymentToken = paymentData.paymentMethodData.tokenizationData.token;
        console.log('TCL: GPayButton -> payButtonClickListener -> paymentToken', paymentToken);
      }).catch(function (err) {
        console.error('payButtonClickListener -> err', err);
      });
    }, _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(GPayButton, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      console.log('GPayButton.componentDidMount: this.state.paymentsClientInitialised', this.state.paymentsClientInitialised);
      if (!this.state.paymentsClientInitialised) {
        this.loadSDK();
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      var _this2 = this;

      if (this.state.isReadyToPay) return;
      console.log('TCL: GPayButton -> componentDidUpdate -> this.state.paymentsClientInitialised', this.state.paymentsClientInitialised);

      var isReadyToPayRequest = _extends({}, baseRequest, {
        allowedPaymentMethods: [baseCardPaymentMethod]
      });

      this.state.paymentsClient.isReadyToPay(isReadyToPayRequest).then(function (response) {
        var isReadyToPay = response.result;
        if (isReadyToPay) {
          // * this function is called only to initialise the button styling, the returned button element is NOT used
          _this2.state.paymentsClient.createButton({ onClick: _this2.payButtonClickListener });
          _this2.setState({ isReadyToPay: isReadyToPay });
        }
      }).catch(function (error) {
        console.error('window.configureGPay -> error', error);
      });
    }
  }, {
    key: 'render',
    value: function render() {
      // const {

      // } = this.props

      return React__default.createElement(
        'div',
        null,
        this.state.isReadyToPay && React__default.createElement('button', {
          onClick: this.payButtonClickListener,
          type: 'button',
          'aria-label': 'Google Pay',
          className: 'gpay-button black long'
        })
      );
    }
  }]);
  return GPayButton;
}(React.PureComponent);

GPayButton.propTypes = {};
GPayButton.defaultProps = {
  text: 'Button'
};

module.exports = GPayButton;
//# sourceMappingURL=index.js.map
