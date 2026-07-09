import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { C as require_get, S as require_isNil, T as require_isFunction, m as require_isEqual, n as require_maxBy, t as require_minBy } from "../_libs/lodash.mjs";
import { t as es6_default } from "../_libs/react-smooth.mjs";
import { A as getTickClassName, C as findAllByType, E as generateCategoricalChart, F as mathSign, I as polarToCartesian, L as uniqueId, N as interpolateNumber, O as getMaxRadius, P as isNumber, R as warn, S as filterProps, T as formatAxisMap$1, _ as Text, c as Dot, d as Label, f as LabelList, g as Shape, j as getValueByDataKey, k as getPercentValue, o as Cell, p as Layer, s as Curve, u as Global, x as adaptEventsOfChild } from "./AreaChart-C6cfyCFc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/PieChart-BPOdMDxm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_isFunction = /* @__PURE__ */ __toESM(require_isFunction());
var import_get = /* @__PURE__ */ __toESM(require_get());
var import_isNil = /* @__PURE__ */ __toESM(require_isNil());
var import_isEqual = /* @__PURE__ */ __toESM(require_isEqual());
var import_maxBy = /* @__PURE__ */ __toESM(require_maxBy());
var import_minBy = /* @__PURE__ */ __toESM(require_minBy());
/**
* @fileOverview Render sectors of a pie
*/
var _Pie;
function _typeof$2(o) {
	"@babel/helpers - typeof";
	return _typeof$2 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
		return typeof o;
	} : function(o) {
		return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	}, _typeof$2(o);
}
function _extends$3() {
	_extends$3 = Object.assign ? Object.assign.bind() : function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$3.apply(this, arguments);
}
function ownKeys$2(e, r) {
	var t = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var o = Object.getOwnPropertySymbols(e);
		r && (o = o.filter(function(r) {
			return Object.getOwnPropertyDescriptor(e, r).enumerable;
		})), t.push.apply(t, o);
	}
	return t;
}
function _objectSpread$2(e) {
	for (var r = 1; r < arguments.length; r++) {
		var t = null != arguments[r] ? arguments[r] : {};
		r % 2 ? ownKeys$2(Object(t), !0).forEach(function(r) {
			_defineProperty$2(e, r, t[r]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$2(Object(t)).forEach(function(r) {
			Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
		});
	}
	return e;
}
function _classCallCheck$2(instance, Constructor) {
	if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties$2(target, props) {
	for (var i = 0; i < props.length; i++) {
		var descriptor = props[i];
		descriptor.enumerable = descriptor.enumerable || false;
		descriptor.configurable = true;
		if ("value" in descriptor) descriptor.writable = true;
		Object.defineProperty(target, _toPropertyKey$2(descriptor.key), descriptor);
	}
}
function _createClass$2(Constructor, protoProps, staticProps) {
	if (protoProps) _defineProperties$2(Constructor.prototype, protoProps);
	if (staticProps) _defineProperties$2(Constructor, staticProps);
	Object.defineProperty(Constructor, "prototype", { writable: false });
	return Constructor;
}
function _callSuper$2(t, o, e) {
	return o = _getPrototypeOf$2(o), _possibleConstructorReturn$2(t, _isNativeReflectConstruct$2() ? Reflect.construct(o, e || [], _getPrototypeOf$2(t).constructor) : o.apply(t, e));
}
function _possibleConstructorReturn$2(self, call) {
	if (call && (_typeof$2(call) === "object" || typeof call === "function")) return call;
	else if (call !== void 0) throw new TypeError("Derived constructors may only return object or undefined");
	return _assertThisInitialized$2(self);
}
function _assertThisInitialized$2(self) {
	if (self === void 0) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	return self;
}
function _isNativeReflectConstruct$2() {
	try {
		var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
	} catch (t) {}
	return (_isNativeReflectConstruct$2 = function _isNativeReflectConstruct() {
		return !!t;
	})();
}
function _getPrototypeOf$2(o) {
	_getPrototypeOf$2 = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
		return o.__proto__ || Object.getPrototypeOf(o);
	};
	return _getPrototypeOf$2(o);
}
function _inherits$2(subClass, superClass) {
	if (typeof superClass !== "function" && superClass !== null) throw new TypeError("Super expression must either be null or a function");
	subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: {
		value: subClass,
		writable: true,
		configurable: true
	} });
	Object.defineProperty(subClass, "prototype", { writable: false });
	if (superClass) _setPrototypeOf$2(subClass, superClass);
}
function _setPrototypeOf$2(o, p) {
	_setPrototypeOf$2 = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
		o.__proto__ = p;
		return o;
	};
	return _setPrototypeOf$2(o, p);
}
function _defineProperty$2(obj, key, value) {
	key = _toPropertyKey$2(key);
	if (key in obj) Object.defineProperty(obj, key, {
		value,
		enumerable: true,
		configurable: true,
		writable: true
	});
	else obj[key] = value;
	return obj;
}
function _toPropertyKey$2(t) {
	var i = _toPrimitive$2(t, "string");
	return "symbol" == _typeof$2(i) ? i : i + "";
}
function _toPrimitive$2(t, r) {
	if ("object" != _typeof$2(t) || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != _typeof$2(i)) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
var Pie = /*#__PURE__*/ function(_PureComponent) {
	function Pie(props) {
		var _this;
		_classCallCheck$2(this, Pie);
		_this = _callSuper$2(this, Pie, [props]);
		_defineProperty$2(_this, "pieRef", null);
		_defineProperty$2(_this, "sectorRefs", []);
		_defineProperty$2(_this, "id", uniqueId("recharts-pie-"));
		_defineProperty$2(_this, "handleAnimationEnd", function() {
			var onAnimationEnd = _this.props.onAnimationEnd;
			_this.setState({ isAnimationFinished: true });
			if ((0, import_isFunction.default)(onAnimationEnd)) onAnimationEnd();
		});
		_defineProperty$2(_this, "handleAnimationStart", function() {
			var onAnimationStart = _this.props.onAnimationStart;
			_this.setState({ isAnimationFinished: false });
			if ((0, import_isFunction.default)(onAnimationStart)) onAnimationStart();
		});
		_this.state = {
			isAnimationFinished: !props.isAnimationActive,
			prevIsAnimationActive: props.isAnimationActive,
			prevAnimationId: props.animationId,
			sectorToFocus: 0
		};
		return _this;
	}
	_inherits$2(Pie, _PureComponent);
	return _createClass$2(Pie, [
		{
			key: "isActiveIndex",
			value: function isActiveIndex(i) {
				var activeIndex = this.props.activeIndex;
				if (Array.isArray(activeIndex)) return activeIndex.indexOf(i) !== -1;
				return i === activeIndex;
			}
		},
		{
			key: "hasActiveIndex",
			value: function hasActiveIndex() {
				var activeIndex = this.props.activeIndex;
				return Array.isArray(activeIndex) ? activeIndex.length !== 0 : activeIndex || activeIndex === 0;
			}
		},
		{
			key: "renderLabels",
			value: function renderLabels(sectors) {
				if (this.props.isAnimationActive && !this.state.isAnimationFinished) return null;
				var _this$props = this.props, label = _this$props.label, labelLine = _this$props.labelLine, dataKey = _this$props.dataKey, valueKey = _this$props.valueKey;
				var pieProps = filterProps(this.props, false);
				var customLabelProps = filterProps(label, false);
				var customLabelLineProps = filterProps(labelLine, false);
				var offsetRadius = label && label.offsetRadius || 20;
				var labels = sectors.map(function(entry, i) {
					var midAngle = (entry.startAngle + entry.endAngle) / 2;
					var endPoint = polarToCartesian(entry.cx, entry.cy, entry.outerRadius + offsetRadius, midAngle);
					var labelProps = _objectSpread$2(_objectSpread$2(_objectSpread$2(_objectSpread$2({}, pieProps), entry), {}, { stroke: "none" }, customLabelProps), {}, {
						index: i,
						textAnchor: Pie.getTextAnchor(endPoint.x, entry.cx)
					}, endPoint);
					var lineProps = _objectSpread$2(_objectSpread$2(_objectSpread$2(_objectSpread$2({}, pieProps), entry), {}, {
						fill: "none",
						stroke: entry.fill
					}, customLabelLineProps), {}, {
						index: i,
						points: [polarToCartesian(entry.cx, entry.cy, entry.outerRadius, midAngle), endPoint]
					});
					var realDataKey = dataKey;
					if ((0, import_isNil.default)(dataKey) && (0, import_isNil.default)(valueKey)) realDataKey = "value";
					else if ((0, import_isNil.default)(dataKey)) realDataKey = valueKey;
					return /*#__PURE__*/ import_react.createElement(Layer, { key: "label-".concat(entry.startAngle, "-").concat(entry.endAngle, "-").concat(entry.midAngle, "-").concat(i) }, labelLine && Pie.renderLabelLineItem(labelLine, lineProps, "line"), Pie.renderLabelItem(label, labelProps, getValueByDataKey(entry, realDataKey)));
				});
				return /*#__PURE__*/ import_react.createElement(Layer, { className: "recharts-pie-labels" }, labels);
			}
		},
		{
			key: "renderSectorsStatically",
			value: function renderSectorsStatically(sectors) {
				var _this2 = this;
				var _this$props2 = this.props, activeShape = _this$props2.activeShape, blendStroke = _this$props2.blendStroke, inactiveShapeProp = _this$props2.inactiveShape;
				return sectors.map(function(entry, i) {
					if ((entry === null || entry === void 0 ? void 0 : entry.startAngle) === 0 && (entry === null || entry === void 0 ? void 0 : entry.endAngle) === 0 && sectors.length !== 1) return null;
					var isActive = _this2.isActiveIndex(i);
					var inactiveShape = inactiveShapeProp && _this2.hasActiveIndex() ? inactiveShapeProp : null;
					var sectorOptions = isActive ? activeShape : inactiveShape;
					var sectorProps = _objectSpread$2(_objectSpread$2({}, entry), {}, {
						stroke: blendStroke ? entry.fill : entry.stroke,
						tabIndex: -1
					});
					return /*#__PURE__*/ import_react.createElement(Layer, _extends$3({
						ref: function ref(_ref) {
							if (_ref && !_this2.sectorRefs.includes(_ref)) _this2.sectorRefs.push(_ref);
						},
						tabIndex: -1,
						className: "recharts-pie-sector"
					}, adaptEventsOfChild(_this2.props, entry, i), { key: "sector-".concat(entry === null || entry === void 0 ? void 0 : entry.startAngle, "-").concat(entry === null || entry === void 0 ? void 0 : entry.endAngle, "-").concat(entry.midAngle, "-").concat(i) }), /*#__PURE__*/ import_react.createElement(Shape, _extends$3({
						option: sectorOptions,
						isActive,
						shapeType: "sector"
					}, sectorProps)));
				});
			}
		},
		{
			key: "renderSectorsWithAnimation",
			value: function renderSectorsWithAnimation() {
				var _this3 = this;
				var _this$props3 = this.props, sectors = _this$props3.sectors, isAnimationActive = _this$props3.isAnimationActive, animationBegin = _this$props3.animationBegin, animationDuration = _this$props3.animationDuration, animationEasing = _this$props3.animationEasing, animationId = _this$props3.animationId;
				var _this$state = this.state, prevSectors = _this$state.prevSectors, prevIsAnimationActive = _this$state.prevIsAnimationActive;
				return /*#__PURE__*/ import_react.createElement(es6_default, {
					begin: animationBegin,
					duration: animationDuration,
					isActive: isAnimationActive,
					easing: animationEasing,
					from: { t: 0 },
					to: { t: 1 },
					key: "pie-".concat(animationId, "-").concat(prevIsAnimationActive),
					onAnimationStart: this.handleAnimationStart,
					onAnimationEnd: this.handleAnimationEnd
				}, function(_ref2) {
					var t = _ref2.t;
					var stepData = [];
					var curAngle = (sectors && sectors[0]).startAngle;
					sectors.forEach(function(entry, index) {
						var prev = prevSectors && prevSectors[index];
						var paddingAngle = index > 0 ? (0, import_get.default)(entry, "paddingAngle", 0) : 0;
						if (prev) {
							var angleIp = interpolateNumber(prev.endAngle - prev.startAngle, entry.endAngle - entry.startAngle);
							var latest = _objectSpread$2(_objectSpread$2({}, entry), {}, {
								startAngle: curAngle + paddingAngle,
								endAngle: curAngle + angleIp(t) + paddingAngle
							});
							stepData.push(latest);
							curAngle = latest.endAngle;
						} else {
							var endAngle = entry.endAngle, startAngle = entry.startAngle;
							var deltaAngle = interpolateNumber(0, endAngle - startAngle)(t);
							var _latest = _objectSpread$2(_objectSpread$2({}, entry), {}, {
								startAngle: curAngle + paddingAngle,
								endAngle: curAngle + deltaAngle + paddingAngle
							});
							stepData.push(_latest);
							curAngle = _latest.endAngle;
						}
					});
					return /*#__PURE__*/ import_react.createElement(Layer, null, _this3.renderSectorsStatically(stepData));
				});
			}
		},
		{
			key: "attachKeyboardHandlers",
			value: function attachKeyboardHandlers(pieRef) {
				var _this4 = this;
				pieRef.onkeydown = function(e) {
					if (!e.altKey) switch (e.key) {
						case "ArrowLeft":
							var next = ++_this4.state.sectorToFocus % _this4.sectorRefs.length;
							_this4.sectorRefs[next].focus();
							_this4.setState({ sectorToFocus: next });
							break;
						case "ArrowRight":
							var _next = --_this4.state.sectorToFocus < 0 ? _this4.sectorRefs.length - 1 : _this4.state.sectorToFocus % _this4.sectorRefs.length;
							_this4.sectorRefs[_next].focus();
							_this4.setState({ sectorToFocus: _next });
							break;
						case "Escape":
							_this4.sectorRefs[_this4.state.sectorToFocus].blur();
							_this4.setState({ sectorToFocus: 0 });
							break;
						default:
					}
				};
			}
		},
		{
			key: "renderSectors",
			value: function renderSectors() {
				var _this$props4 = this.props, sectors = _this$props4.sectors, isAnimationActive = _this$props4.isAnimationActive;
				var prevSectors = this.state.prevSectors;
				if (isAnimationActive && sectors && sectors.length && (!prevSectors || !(0, import_isEqual.default)(prevSectors, sectors))) return this.renderSectorsWithAnimation();
				return this.renderSectorsStatically(sectors);
			}
		},
		{
			key: "componentDidMount",
			value: function componentDidMount() {
				if (this.pieRef) this.attachKeyboardHandlers(this.pieRef);
			}
		},
		{
			key: "render",
			value: function render() {
				var _this5 = this;
				var _this$props5 = this.props, hide = _this$props5.hide, sectors = _this$props5.sectors, className = _this$props5.className, label = _this$props5.label, cx = _this$props5.cx, cy = _this$props5.cy, innerRadius = _this$props5.innerRadius, outerRadius = _this$props5.outerRadius, isAnimationActive = _this$props5.isAnimationActive;
				var isAnimationFinished = this.state.isAnimationFinished;
				if (hide || !sectors || !sectors.length || !isNumber(cx) || !isNumber(cy) || !isNumber(innerRadius) || !isNumber(outerRadius)) return null;
				var layerClass = clsx("recharts-pie", className);
				return /*#__PURE__*/ import_react.createElement(Layer, {
					tabIndex: this.props.rootTabIndex,
					className: layerClass,
					ref: function ref(_ref3) {
						_this5.pieRef = _ref3;
					}
				}, this.renderSectors(), label && this.renderLabels(sectors), Label.renderCallByParent(this.props, null, false), (!isAnimationActive || isAnimationFinished) && LabelList.renderCallByParent(this.props, sectors, false));
			}
		}
	], [
		{
			key: "getDerivedStateFromProps",
			value: function getDerivedStateFromProps(nextProps, prevState) {
				if (prevState.prevIsAnimationActive !== nextProps.isAnimationActive) return {
					prevIsAnimationActive: nextProps.isAnimationActive,
					prevAnimationId: nextProps.animationId,
					curSectors: nextProps.sectors,
					prevSectors: [],
					isAnimationFinished: true
				};
				if (nextProps.isAnimationActive && nextProps.animationId !== prevState.prevAnimationId) return {
					prevAnimationId: nextProps.animationId,
					curSectors: nextProps.sectors,
					prevSectors: prevState.curSectors,
					isAnimationFinished: true
				};
				if (nextProps.sectors !== prevState.curSectors) return {
					curSectors: nextProps.sectors,
					isAnimationFinished: true
				};
				return null;
			}
		},
		{
			key: "getTextAnchor",
			value: function getTextAnchor(x, cx) {
				if (x > cx) return "start";
				if (x < cx) return "end";
				return "middle";
			}
		},
		{
			key: "renderLabelLineItem",
			value: function renderLabelLineItem(option, props, key) {
				if (/*#__PURE__*/ import_react.isValidElement(option)) return /*#__PURE__*/ import_react.cloneElement(option, props);
				if ((0, import_isFunction.default)(option)) return option(props);
				var className = clsx("recharts-pie-label-line", typeof option !== "boolean" ? option.className : "");
				return /*#__PURE__*/ import_react.createElement(Curve, _extends$3({}, props, {
					key,
					type: "linear",
					className
				}));
			}
		},
		{
			key: "renderLabelItem",
			value: function renderLabelItem(option, props, value) {
				if (/*#__PURE__*/ import_react.isValidElement(option)) return /*#__PURE__*/ import_react.cloneElement(option, props);
				var label = value;
				if ((0, import_isFunction.default)(option)) {
					label = option(props);
					if (/*#__PURE__*/ import_react.isValidElement(label)) return label;
				}
				var className = clsx("recharts-pie-label-text", typeof option !== "boolean" && !(0, import_isFunction.default)(option) ? option.className : "");
				return /*#__PURE__*/ import_react.createElement(Text, _extends$3({}, props, {
					alignmentBaseline: "middle",
					className
				}), label);
			}
		}
	]);
}(import_react.PureComponent);
_Pie = Pie;
_defineProperty$2(Pie, "displayName", "Pie");
_defineProperty$2(Pie, "defaultProps", {
	stroke: "#fff",
	fill: "#808080",
	legendType: "rect",
	cx: "50%",
	cy: "50%",
	startAngle: 0,
	endAngle: 360,
	innerRadius: 0,
	outerRadius: "80%",
	paddingAngle: 0,
	labelLine: true,
	hide: false,
	minAngle: 0,
	isAnimationActive: !Global.isSsr,
	animationBegin: 400,
	animationDuration: 1500,
	animationEasing: "ease",
	nameKey: "name",
	blendStroke: false,
	rootTabIndex: 0
});
_defineProperty$2(Pie, "parseDeltaAngle", function(startAngle, endAngle) {
	return mathSign(endAngle - startAngle) * Math.min(Math.abs(endAngle - startAngle), 360);
});
_defineProperty$2(Pie, "getRealPieData", function(itemProps) {
	var data = itemProps.data, children = itemProps.children;
	var presentationProps = filterProps(itemProps, false);
	var cells = findAllByType(children, Cell);
	if (data && data.length) return data.map(function(entry, index) {
		return _objectSpread$2(_objectSpread$2(_objectSpread$2({ payload: entry }, presentationProps), entry), cells && cells[index] && cells[index].props);
	});
	if (cells && cells.length) return cells.map(function(cell) {
		return _objectSpread$2(_objectSpread$2({}, presentationProps), cell.props);
	});
	return [];
});
_defineProperty$2(Pie, "parseCoordinateOfPie", function(itemProps, offset) {
	var top = offset.top, left = offset.left, width = offset.width, height = offset.height;
	var maxPieRadius = getMaxRadius(width, height);
	return {
		cx: left + getPercentValue(itemProps.cx, width, width / 2),
		cy: top + getPercentValue(itemProps.cy, height, height / 2),
		innerRadius: getPercentValue(itemProps.innerRadius, maxPieRadius, 0),
		outerRadius: getPercentValue(itemProps.outerRadius, maxPieRadius, maxPieRadius * .8),
		maxRadius: itemProps.maxRadius || Math.sqrt(width * width + height * height) / 2
	};
});
_defineProperty$2(Pie, "getComposedData", function(_ref4) {
	var item = _ref4.item, offset = _ref4.offset;
	var itemProps = item.type.defaultProps !== void 0 ? _objectSpread$2(_objectSpread$2({}, item.type.defaultProps), item.props) : item.props;
	var pieData = _Pie.getRealPieData(itemProps);
	if (!pieData || !pieData.length) return null;
	var cornerRadius = itemProps.cornerRadius, startAngle = itemProps.startAngle, endAngle = itemProps.endAngle, paddingAngle = itemProps.paddingAngle, dataKey = itemProps.dataKey, nameKey = itemProps.nameKey, valueKey = itemProps.valueKey, tooltipType = itemProps.tooltipType;
	var minAngle = Math.abs(itemProps.minAngle);
	var coordinate = _Pie.parseCoordinateOfPie(itemProps, offset);
	var deltaAngle = _Pie.parseDeltaAngle(startAngle, endAngle);
	var absDeltaAngle = Math.abs(deltaAngle);
	var realDataKey = dataKey;
	if ((0, import_isNil.default)(dataKey) && (0, import_isNil.default)(valueKey)) {
		warn(false, "Use \"dataKey\" to specify the value of pie,\n      the props \"valueKey\" will be deprecated in 1.1.0");
		realDataKey = "value";
	} else if ((0, import_isNil.default)(dataKey)) {
		warn(false, "Use \"dataKey\" to specify the value of pie,\n      the props \"valueKey\" will be deprecated in 1.1.0");
		realDataKey = valueKey;
	}
	var notZeroItemCount = pieData.filter(function(entry) {
		return getValueByDataKey(entry, realDataKey, 0) !== 0;
	}).length;
	var totalPadingAngle = (absDeltaAngle >= 360 ? notZeroItemCount : notZeroItemCount - 1) * paddingAngle;
	var realTotalAngle = absDeltaAngle - notZeroItemCount * minAngle - totalPadingAngle;
	var sum = pieData.reduce(function(result, entry) {
		var val = getValueByDataKey(entry, realDataKey, 0);
		return result + (isNumber(val) ? val : 0);
	}, 0);
	var sectors;
	if (sum > 0) {
		var prev;
		sectors = pieData.map(function(entry, i) {
			var val = getValueByDataKey(entry, realDataKey, 0);
			var name = getValueByDataKey(entry, nameKey, i);
			var percent = (isNumber(val) ? val : 0) / sum;
			var tempStartAngle;
			if (i) tempStartAngle = prev.endAngle + mathSign(deltaAngle) * paddingAngle * (val !== 0 ? 1 : 0);
			else tempStartAngle = startAngle;
			var tempEndAngle = tempStartAngle + mathSign(deltaAngle) * ((val !== 0 ? minAngle : 0) + percent * realTotalAngle);
			var midAngle = (tempStartAngle + tempEndAngle) / 2;
			var middleRadius = (coordinate.innerRadius + coordinate.outerRadius) / 2;
			prev = _objectSpread$2(_objectSpread$2(_objectSpread$2({
				percent,
				cornerRadius,
				name,
				tooltipPayload: [{
					name,
					value: val,
					payload: entry,
					dataKey: realDataKey,
					type: tooltipType
				}],
				midAngle,
				middleRadius,
				tooltipPosition: polarToCartesian(coordinate.cx, coordinate.cy, middleRadius, midAngle)
			}, entry), coordinate), {}, {
				value: getValueByDataKey(entry, realDataKey),
				startAngle: tempStartAngle,
				endAngle: tempEndAngle,
				payload: entry,
				paddingAngle: mathSign(deltaAngle) * paddingAngle
			});
			return prev;
		});
	}
	return _objectSpread$2(_objectSpread$2({}, coordinate), {}, {
		sectors,
		data: pieData
	});
});
/**
* @fileOverview Polygon
*/
var _excluded$1 = [
	"points",
	"className",
	"baseLinePoints",
	"connectNulls"
];
function _extends$2() {
	_extends$2 = Object.assign ? Object.assign.bind() : function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$2.apply(this, arguments);
}
function _objectWithoutProperties$1(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$1(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$1(source, excluded) {
	if (source == null) return {};
	var target = {};
	for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) {
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
function _toConsumableArray(arr) {
	return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
function _nonIterableSpread() {
	throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray(o, minLen) {
	if (!o) return;
	if (typeof o === "string") return _arrayLikeToArray(o, minLen);
	var n = Object.prototype.toString.call(o).slice(8, -1);
	if (n === "Object" && o.constructor) n = o.constructor.name;
	if (n === "Map" || n === "Set") return Array.from(o);
	if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _iterableToArray(iter) {
	if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _arrayWithoutHoles(arr) {
	if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}
function _arrayLikeToArray(arr, len) {
	if (len == null || len > arr.length) len = arr.length;
	for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
	return arr2;
}
var isValidatePoint = function isValidatePoint(point) {
	return point && point.x === +point.x && point.y === +point.y;
};
var getParsedPoints = function getParsedPoints() {
	var points = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
	var segmentPoints = [[]];
	points.forEach(function(entry) {
		if (isValidatePoint(entry)) segmentPoints[segmentPoints.length - 1].push(entry);
		else if (segmentPoints[segmentPoints.length - 1].length > 0) segmentPoints.push([]);
	});
	if (isValidatePoint(points[0])) segmentPoints[segmentPoints.length - 1].push(points[0]);
	if (segmentPoints[segmentPoints.length - 1].length <= 0) segmentPoints = segmentPoints.slice(0, -1);
	return segmentPoints;
};
var getSinglePolygonPath = function getSinglePolygonPath(points, connectNulls) {
	var segmentPoints = getParsedPoints(points);
	if (connectNulls) segmentPoints = [segmentPoints.reduce(function(res, segPoints) {
		return [].concat(_toConsumableArray(res), _toConsumableArray(segPoints));
	}, [])];
	var polygonPath = segmentPoints.map(function(segPoints) {
		return segPoints.reduce(function(path, point, index) {
			return "".concat(path).concat(index === 0 ? "M" : "L").concat(point.x, ",").concat(point.y);
		}, "");
	}).join("");
	return segmentPoints.length === 1 ? "".concat(polygonPath, "Z") : polygonPath;
};
var getRanglePath = function getRanglePath(points, baseLinePoints, connectNulls) {
	var outerPath = getSinglePolygonPath(points, connectNulls);
	return "".concat(outerPath.slice(-1) === "Z" ? outerPath.slice(0, -1) : outerPath, "L").concat(getSinglePolygonPath(baseLinePoints.reverse(), connectNulls).slice(1));
};
var Polygon = function Polygon(props) {
	var points = props.points, className = props.className, baseLinePoints = props.baseLinePoints, connectNulls = props.connectNulls, others = _objectWithoutProperties$1(props, _excluded$1);
	if (!points || !points.length) return null;
	var layerClass = clsx("recharts-polygon", className);
	if (baseLinePoints && baseLinePoints.length) {
		var hasStroke = others.stroke && others.stroke !== "none";
		var rangePath = getRanglePath(points, baseLinePoints, connectNulls);
		return /*#__PURE__*/ import_react.createElement("g", { className: layerClass }, /*#__PURE__*/ import_react.createElement("path", _extends$2({}, filterProps(others, true), {
			fill: rangePath.slice(-1) === "Z" ? others.fill : "none",
			stroke: "none",
			d: rangePath
		})), hasStroke ? /*#__PURE__*/ import_react.createElement("path", _extends$2({}, filterProps(others, true), {
			fill: "none",
			d: getSinglePolygonPath(points, connectNulls)
		})) : null, hasStroke ? /*#__PURE__*/ import_react.createElement("path", _extends$2({}, filterProps(others, true), {
			fill: "none",
			d: getSinglePolygonPath(baseLinePoints, connectNulls)
		})) : null);
	}
	var singlePath = getSinglePolygonPath(points, connectNulls);
	return /*#__PURE__*/ import_react.createElement("path", _extends$2({}, filterProps(others, true), {
		fill: singlePath.slice(-1) === "Z" ? others.fill : "none",
		className: layerClass,
		d: singlePath
	}));
};
/**
* @fileOverview Axis of radial direction
*/
function _typeof$1(o) {
	"@babel/helpers - typeof";
	return _typeof$1 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
		return typeof o;
	} : function(o) {
		return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	}, _typeof$1(o);
}
function _extends$1() {
	_extends$1 = Object.assign ? Object.assign.bind() : function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$1.apply(this, arguments);
}
function ownKeys$1(e, r) {
	var t = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var o = Object.getOwnPropertySymbols(e);
		r && (o = o.filter(function(r) {
			return Object.getOwnPropertyDescriptor(e, r).enumerable;
		})), t.push.apply(t, o);
	}
	return t;
}
function _objectSpread$1(e) {
	for (var r = 1; r < arguments.length; r++) {
		var t = null != arguments[r] ? arguments[r] : {};
		r % 2 ? ownKeys$1(Object(t), !0).forEach(function(r) {
			_defineProperty$1(e, r, t[r]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$1(Object(t)).forEach(function(r) {
			Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
		});
	}
	return e;
}
function _classCallCheck$1(instance, Constructor) {
	if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties$1(target, props) {
	for (var i = 0; i < props.length; i++) {
		var descriptor = props[i];
		descriptor.enumerable = descriptor.enumerable || false;
		descriptor.configurable = true;
		if ("value" in descriptor) descriptor.writable = true;
		Object.defineProperty(target, _toPropertyKey$1(descriptor.key), descriptor);
	}
}
function _createClass$1(Constructor, protoProps, staticProps) {
	if (protoProps) _defineProperties$1(Constructor.prototype, protoProps);
	if (staticProps) _defineProperties$1(Constructor, staticProps);
	Object.defineProperty(Constructor, "prototype", { writable: false });
	return Constructor;
}
function _callSuper$1(t, o, e) {
	return o = _getPrototypeOf$1(o), _possibleConstructorReturn$1(t, _isNativeReflectConstruct$1() ? Reflect.construct(o, e || [], _getPrototypeOf$1(t).constructor) : o.apply(t, e));
}
function _possibleConstructorReturn$1(self, call) {
	if (call && (_typeof$1(call) === "object" || typeof call === "function")) return call;
	else if (call !== void 0) throw new TypeError("Derived constructors may only return object or undefined");
	return _assertThisInitialized$1(self);
}
function _assertThisInitialized$1(self) {
	if (self === void 0) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	return self;
}
function _isNativeReflectConstruct$1() {
	try {
		var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
	} catch (t) {}
	return (_isNativeReflectConstruct$1 = function _isNativeReflectConstruct() {
		return !!t;
	})();
}
function _getPrototypeOf$1(o) {
	_getPrototypeOf$1 = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
		return o.__proto__ || Object.getPrototypeOf(o);
	};
	return _getPrototypeOf$1(o);
}
function _inherits$1(subClass, superClass) {
	if (typeof superClass !== "function" && superClass !== null) throw new TypeError("Super expression must either be null or a function");
	subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: {
		value: subClass,
		writable: true,
		configurable: true
	} });
	Object.defineProperty(subClass, "prototype", { writable: false });
	if (superClass) _setPrototypeOf$1(subClass, superClass);
}
function _setPrototypeOf$1(o, p) {
	_setPrototypeOf$1 = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
		o.__proto__ = p;
		return o;
	};
	return _setPrototypeOf$1(o, p);
}
function _defineProperty$1(obj, key, value) {
	key = _toPropertyKey$1(key);
	if (key in obj) Object.defineProperty(obj, key, {
		value,
		enumerable: true,
		configurable: true,
		writable: true
	});
	else obj[key] = value;
	return obj;
}
function _toPropertyKey$1(t) {
	var i = _toPrimitive$1(t, "string");
	return "symbol" == _typeof$1(i) ? i : i + "";
}
function _toPrimitive$1(t, r) {
	if ("object" != _typeof$1(t) || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != _typeof$1(i)) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
var RADIAN = Math.PI / 180;
var eps = 1e-5;
var PolarAngleAxis = /*#__PURE__*/ function(_PureComponent) {
	function PolarAngleAxis() {
		_classCallCheck$1(this, PolarAngleAxis);
		return _callSuper$1(this, PolarAngleAxis, arguments);
	}
	_inherits$1(PolarAngleAxis, _PureComponent);
	return _createClass$1(PolarAngleAxis, [
		{
			key: "getTickLineCoord",
			value: function getTickLineCoord(data) {
				var _this$props = this.props, cx = _this$props.cx, cy = _this$props.cy, radius = _this$props.radius, orientation = _this$props.orientation;
				var tickLineSize = _this$props.tickSize || 8;
				var p1 = polarToCartesian(cx, cy, radius, data.coordinate);
				var p2 = polarToCartesian(cx, cy, radius + (orientation === "inner" ? -1 : 1) * tickLineSize, data.coordinate);
				return {
					x1: p1.x,
					y1: p1.y,
					x2: p2.x,
					y2: p2.y
				};
			}
		},
		{
			key: "getTickTextAnchor",
			value: function getTickTextAnchor(data) {
				var orientation = this.props.orientation;
				var cos = Math.cos(-data.coordinate * RADIAN);
				var textAnchor;
				if (cos > eps) textAnchor = orientation === "outer" ? "start" : "end";
				else if (cos < -eps) textAnchor = orientation === "outer" ? "end" : "start";
				else textAnchor = "middle";
				return textAnchor;
			}
		},
		{
			key: "renderAxisLine",
			value: function renderAxisLine() {
				var _this$props2 = this.props, cx = _this$props2.cx, cy = _this$props2.cy, radius = _this$props2.radius, axisLine = _this$props2.axisLine, axisLineType = _this$props2.axisLineType;
				var props = _objectSpread$1(_objectSpread$1({}, filterProps(this.props, false)), {}, { fill: "none" }, filterProps(axisLine, false));
				if (axisLineType === "circle") return /*#__PURE__*/ import_react.createElement(Dot, _extends$1({ className: "recharts-polar-angle-axis-line" }, props, {
					cx,
					cy,
					r: radius
				}));
				var points = this.props.ticks.map(function(entry) {
					return polarToCartesian(cx, cy, radius, entry.coordinate);
				});
				return /*#__PURE__*/ import_react.createElement(Polygon, _extends$1({ className: "recharts-polar-angle-axis-line" }, props, { points }));
			}
		},
		{
			key: "renderTicks",
			value: function renderTicks() {
				var _this = this;
				var _this$props3 = this.props, ticks = _this$props3.ticks, tick = _this$props3.tick, tickLine = _this$props3.tickLine, tickFormatter = _this$props3.tickFormatter, stroke = _this$props3.stroke;
				var axisProps = filterProps(this.props, false);
				var customTickProps = filterProps(tick, false);
				var tickLineProps = _objectSpread$1(_objectSpread$1({}, axisProps), {}, { fill: "none" }, filterProps(tickLine, false));
				var items = ticks.map(function(entry, i) {
					var lineCoord = _this.getTickLineCoord(entry);
					var tickProps = _objectSpread$1(_objectSpread$1(_objectSpread$1({ textAnchor: _this.getTickTextAnchor(entry) }, axisProps), {}, {
						stroke: "none",
						fill: stroke
					}, customTickProps), {}, {
						index: i,
						payload: entry,
						x: lineCoord.x2,
						y: lineCoord.y2
					});
					return /*#__PURE__*/ import_react.createElement(Layer, _extends$1({
						className: clsx("recharts-polar-angle-axis-tick", getTickClassName(tick)),
						key: "tick-".concat(entry.coordinate)
					}, adaptEventsOfChild(_this.props, entry, i)), tickLine && /*#__PURE__*/ import_react.createElement("line", _extends$1({ className: "recharts-polar-angle-axis-tick-line" }, tickLineProps, lineCoord)), tick && PolarAngleAxis.renderTickItem(tick, tickProps, tickFormatter ? tickFormatter(entry.value, i) : entry.value));
				});
				return /*#__PURE__*/ import_react.createElement(Layer, { className: "recharts-polar-angle-axis-ticks" }, items);
			}
		},
		{
			key: "render",
			value: function render() {
				var _this$props4 = this.props, ticks = _this$props4.ticks, radius = _this$props4.radius, axisLine = _this$props4.axisLine;
				if (radius <= 0 || !ticks || !ticks.length) return null;
				return /*#__PURE__*/ import_react.createElement(Layer, { className: clsx("recharts-polar-angle-axis", this.props.className) }, axisLine && this.renderAxisLine(), this.renderTicks());
			}
		}
	], [{
		key: "renderTickItem",
		value: function renderTickItem(option, props, value) {
			var tickItem;
			if (/*#__PURE__*/ import_react.isValidElement(option)) tickItem = /*#__PURE__*/ import_react.cloneElement(option, props);
			else if ((0, import_isFunction.default)(option)) tickItem = option(props);
			else tickItem = /*#__PURE__*/ import_react.createElement(Text, _extends$1({}, props, { className: "recharts-polar-angle-axis-tick-value" }), value);
			return tickItem;
		}
	}]);
}(import_react.PureComponent);
_defineProperty$1(PolarAngleAxis, "displayName", "PolarAngleAxis");
_defineProperty$1(PolarAngleAxis, "axisType", "angleAxis");
_defineProperty$1(PolarAngleAxis, "defaultProps", {
	type: "category",
	angleAxisId: 0,
	scale: "auto",
	cx: 0,
	cy: 0,
	orientation: "outer",
	axisLine: true,
	tickLine: true,
	tickSize: 8,
	tick: true,
	hide: false,
	allowDuplicatedCategory: true
});
/**
* @fileOverview The axis of polar coordinate system
*/
var _excluded = [
	"cx",
	"cy",
	"angle",
	"ticks",
	"axisLine"
], _excluded2 = [
	"ticks",
	"tick",
	"angle",
	"tickFormatter",
	"stroke"
];
function _typeof(o) {
	"@babel/helpers - typeof";
	return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
		return typeof o;
	} : function(o) {
		return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	}, _typeof(o);
}
function _extends() {
	_extends = Object.assign ? Object.assign.bind() : function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends.apply(this, arguments);
}
function ownKeys(e, r) {
	var t = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var o = Object.getOwnPropertySymbols(e);
		r && (o = o.filter(function(r) {
			return Object.getOwnPropertyDescriptor(e, r).enumerable;
		})), t.push.apply(t, o);
	}
	return t;
}
function _objectSpread(e) {
	for (var r = 1; r < arguments.length; r++) {
		var t = null != arguments[r] ? arguments[r] : {};
		r % 2 ? ownKeys(Object(t), !0).forEach(function(r) {
			_defineProperty(e, r, t[r]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r) {
			Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
		});
	}
	return e;
}
function _objectWithoutProperties(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose(source, excluded) {
	if (source == null) return {};
	var target = {};
	for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) {
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(target, props) {
	for (var i = 0; i < props.length; i++) {
		var descriptor = props[i];
		descriptor.enumerable = descriptor.enumerable || false;
		descriptor.configurable = true;
		if ("value" in descriptor) descriptor.writable = true;
		Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
	}
}
function _createClass(Constructor, protoProps, staticProps) {
	if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	if (staticProps) _defineProperties(Constructor, staticProps);
	Object.defineProperty(Constructor, "prototype", { writable: false });
	return Constructor;
}
function _callSuper(t, o, e) {
	return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
}
function _possibleConstructorReturn(self, call) {
	if (call && (_typeof(call) === "object" || typeof call === "function")) return call;
	else if (call !== void 0) throw new TypeError("Derived constructors may only return object or undefined");
	return _assertThisInitialized(self);
}
function _assertThisInitialized(self) {
	if (self === void 0) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	return self;
}
function _isNativeReflectConstruct() {
	try {
		var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
	} catch (t) {}
	return (_isNativeReflectConstruct = function _isNativeReflectConstruct() {
		return !!t;
	})();
}
function _getPrototypeOf(o) {
	_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
		return o.__proto__ || Object.getPrototypeOf(o);
	};
	return _getPrototypeOf(o);
}
function _inherits(subClass, superClass) {
	if (typeof superClass !== "function" && superClass !== null) throw new TypeError("Super expression must either be null or a function");
	subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: {
		value: subClass,
		writable: true,
		configurable: true
	} });
	Object.defineProperty(subClass, "prototype", { writable: false });
	if (superClass) _setPrototypeOf(subClass, superClass);
}
function _setPrototypeOf(o, p) {
	_setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
		o.__proto__ = p;
		return o;
	};
	return _setPrototypeOf(o, p);
}
function _defineProperty(obj, key, value) {
	key = _toPropertyKey(key);
	if (key in obj) Object.defineProperty(obj, key, {
		value,
		enumerable: true,
		configurable: true,
		writable: true
	});
	else obj[key] = value;
	return obj;
}
function _toPropertyKey(t) {
	var i = _toPrimitive(t, "string");
	return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
	if ("object" != _typeof(t) || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != _typeof(i)) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
var PolarRadiusAxis = /*#__PURE__*/ function(_PureComponent) {
	function PolarRadiusAxis() {
		_classCallCheck(this, PolarRadiusAxis);
		return _callSuper(this, PolarRadiusAxis, arguments);
	}
	_inherits(PolarRadiusAxis, _PureComponent);
	return _createClass(PolarRadiusAxis, [
		{
			key: "getTickValueCoord",
			value: function getTickValueCoord(_ref) {
				var coordinate = _ref.coordinate;
				var _this$props = this.props, angle = _this$props.angle, cx = _this$props.cx, cy = _this$props.cy;
				return polarToCartesian(cx, cy, coordinate, angle);
			}
		},
		{
			key: "getTickTextAnchor",
			value: function getTickTextAnchor() {
				var orientation = this.props.orientation;
				var textAnchor;
				switch (orientation) {
					case "left":
						textAnchor = "end";
						break;
					case "right":
						textAnchor = "start";
						break;
					default:
						textAnchor = "middle";
						break;
				}
				return textAnchor;
			}
		},
		{
			key: "getViewBox",
			value: function getViewBox() {
				var _this$props2 = this.props, cx = _this$props2.cx, cy = _this$props2.cy, angle = _this$props2.angle, ticks = _this$props2.ticks;
				var maxRadiusTick = (0, import_maxBy.default)(ticks, function(entry) {
					return entry.coordinate || 0;
				});
				return {
					cx,
					cy,
					startAngle: angle,
					endAngle: angle,
					innerRadius: (0, import_minBy.default)(ticks, function(entry) {
						return entry.coordinate || 0;
					}).coordinate || 0,
					outerRadius: maxRadiusTick.coordinate || 0
				};
			}
		},
		{
			key: "renderAxisLine",
			value: function renderAxisLine() {
				var _this$props3 = this.props, cx = _this$props3.cx, cy = _this$props3.cy, angle = _this$props3.angle, ticks = _this$props3.ticks, axisLine = _this$props3.axisLine, others = _objectWithoutProperties(_this$props3, _excluded);
				var extent = ticks.reduce(function(result, entry) {
					return [Math.min(result[0], entry.coordinate), Math.max(result[1], entry.coordinate)];
				}, [Infinity, -Infinity]);
				var point0 = polarToCartesian(cx, cy, extent[0], angle);
				var point1 = polarToCartesian(cx, cy, extent[1], angle);
				var props = _objectSpread(_objectSpread(_objectSpread({}, filterProps(others, false)), {}, { fill: "none" }, filterProps(axisLine, false)), {}, {
					x1: point0.x,
					y1: point0.y,
					x2: point1.x,
					y2: point1.y
				});
				return /*#__PURE__*/ import_react.createElement("line", _extends({ className: "recharts-polar-radius-axis-line" }, props));
			}
		},
		{
			key: "renderTicks",
			value: function renderTicks() {
				var _this = this;
				var _this$props4 = this.props, ticks = _this$props4.ticks, tick = _this$props4.tick, angle = _this$props4.angle, tickFormatter = _this$props4.tickFormatter, stroke = _this$props4.stroke, others = _objectWithoutProperties(_this$props4, _excluded2);
				var textAnchor = this.getTickTextAnchor();
				var axisProps = filterProps(others, false);
				var customTickProps = filterProps(tick, false);
				var items = ticks.map(function(entry, i) {
					var coord = _this.getTickValueCoord(entry);
					var tickProps = _objectSpread(_objectSpread(_objectSpread(_objectSpread({
						textAnchor,
						transform: "rotate(".concat(90 - angle, ", ").concat(coord.x, ", ").concat(coord.y, ")")
					}, axisProps), {}, {
						stroke: "none",
						fill: stroke
					}, customTickProps), {}, { index: i }, coord), {}, { payload: entry });
					return /*#__PURE__*/ import_react.createElement(Layer, _extends({
						className: clsx("recharts-polar-radius-axis-tick", getTickClassName(tick)),
						key: "tick-".concat(entry.coordinate)
					}, adaptEventsOfChild(_this.props, entry, i)), PolarRadiusAxis.renderTickItem(tick, tickProps, tickFormatter ? tickFormatter(entry.value, i) : entry.value));
				});
				return /*#__PURE__*/ import_react.createElement(Layer, { className: "recharts-polar-radius-axis-ticks" }, items);
			}
		},
		{
			key: "render",
			value: function render() {
				var _this$props5 = this.props, ticks = _this$props5.ticks, axisLine = _this$props5.axisLine, tick = _this$props5.tick;
				if (!ticks || !ticks.length) return null;
				return /*#__PURE__*/ import_react.createElement(Layer, { className: clsx("recharts-polar-radius-axis", this.props.className) }, axisLine && this.renderAxisLine(), tick && this.renderTicks(), Label.renderCallByParent(this.props, this.getViewBox()));
			}
		}
	], [{
		key: "renderTickItem",
		value: function renderTickItem(option, props, value) {
			var tickItem;
			if (/*#__PURE__*/ import_react.isValidElement(option)) tickItem = /*#__PURE__*/ import_react.cloneElement(option, props);
			else if ((0, import_isFunction.default)(option)) tickItem = option(props);
			else tickItem = /*#__PURE__*/ import_react.createElement(Text, _extends({}, props, { className: "recharts-polar-radius-axis-tick-value" }), value);
			return tickItem;
		}
	}]);
}(import_react.PureComponent);
_defineProperty(PolarRadiusAxis, "displayName", "PolarRadiusAxis");
_defineProperty(PolarRadiusAxis, "axisType", "radiusAxis");
_defineProperty(PolarRadiusAxis, "defaultProps", {
	type: "number",
	radiusAxisId: 0,
	cx: 0,
	cy: 0,
	angle: 0,
	orientation: "right",
	stroke: "#ccc",
	axisLine: true,
	tick: true,
	tickCount: 5,
	allowDataOverflow: false,
	scale: "auto",
	allowDuplicatedCategory: true
});
/**
* @fileOverview Pie Chart
*/
var PieChart = generateCategoricalChart({
	chartName: "PieChart",
	GraphicalChild: Pie,
	validateTooltipEventTypes: ["item"],
	defaultTooltipEventType: "item",
	legendContent: "children",
	axisComponents: [{
		axisType: "angleAxis",
		AxisComp: PolarAngleAxis
	}, {
		axisType: "radiusAxis",
		AxisComp: PolarRadiusAxis
	}],
	formatAxisMap: formatAxisMap$1,
	defaultProps: {
		layout: "centric",
		startAngle: 0,
		endAngle: 360,
		cx: "50%",
		cy: "50%",
		innerRadius: 0,
		outerRadius: "80%"
	}
});
//#endregion
export { PieChart as n, Pie as t };
