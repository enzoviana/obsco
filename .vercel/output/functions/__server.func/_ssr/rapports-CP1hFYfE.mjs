import { i as __toESM } from "../_runtime.mjs";
import { t as API_ENABLED } from "./api-DFrqE02A.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as getUser } from "./auth-09JE-lnI.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { D as salesByUnit, E as salesByRevenue, F as stockSituation, O as salesObjectivesANF, _ as evolutionByUnits, g as evolutionByRevenue, k as salesObjectivesByCountry, t as COUNTRIES, v as getAgencies } from "./agencies-BIm1ZU-s.mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as Button } from "./button-B46ZAK34.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { $ as Earth, F as Download, N as FileSpreadsheet, T as MapPin, W as Building2 } from "../_libs/lucide-react.mjs";
import { n as AppShell } from "./AppShell-vbo9zXyM.mjs";
import { n as exportXLSX, t as exportCSV } from "./export-B7MgEGmo.mjs";
import { S as require_isNil, T as require_isFunction, m as require_isEqual } from "../_libs/lodash.mjs";
import { t as es6_default } from "../_libs/react-smooth.mjs";
import { C as findAllByType, D as getCateCoordinateOfLine, E as generateCategoricalChart, L as uniqueId, M as hasClipDot, N as interpolateNumber, S as filterProps, a as CartesianGrid, b as YAxis, c as Dot, f as LabelList, h as ResponsiveContainer, i as BarChart, j as getValueByDataKey, l as ErrorBar, m as Legend, n as AreaChart, o as Cell, p as Layer, r as Bar, s as Curve, t as Area, u as Global, v as Tooltip, w as formatAxisMap, y as XAxis } from "./AreaChart-C6cfyCFc.mjs";
import { n as PieChart, t as Pie } from "./PieChart-BPOdMDxm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/rapports-CP1hFYfE.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_isFunction = /* @__PURE__ */ __toESM(require_isFunction());
var import_isNil = /* @__PURE__ */ __toESM(require_isNil());
var import_isEqual = /* @__PURE__ */ __toESM(require_isEqual());
/**
* @fileOverview Line
*/
var _excluded = [
	"type",
	"layout",
	"connectNulls",
	"ref"
], _excluded2 = ["key"];
function _typeof(o) {
	"@babel/helpers - typeof";
	return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
		return typeof o;
	} : function(o) {
		return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	}, _typeof(o);
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
var Line = /*#__PURE__*/ function(_PureComponent) {
	function Line() {
		var _this;
		_classCallCheck(this, Line);
		for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
		_this = _callSuper(this, Line, [].concat(args));
		_defineProperty(_this, "state", {
			isAnimationFinished: true,
			totalLength: 0
		});
		_defineProperty(_this, "generateSimpleStrokeDasharray", function(totalLength, length) {
			return "".concat(length, "px ").concat(totalLength - length, "px");
		});
		_defineProperty(_this, "getStrokeDasharray", function(length, totalLength, lines) {
			var lineLength = lines.reduce(function(pre, next) {
				return pre + next;
			});
			if (!lineLength) return _this.generateSimpleStrokeDasharray(totalLength, length);
			var count = Math.floor(length / lineLength);
			var remainLength = length % lineLength;
			var restLength = totalLength - length;
			var remainLines = [];
			for (var i = 0, sum = 0; i < lines.length; sum += lines[i], ++i) if (sum + lines[i] > remainLength) {
				remainLines = [].concat(_toConsumableArray(lines.slice(0, i)), [remainLength - sum]);
				break;
			}
			var emptyLines = remainLines.length % 2 === 0 ? [0, restLength] : [restLength];
			return [].concat(_toConsumableArray(Line.repeat(lines, count)), _toConsumableArray(remainLines), emptyLines).map(function(line) {
				return "".concat(line, "px");
			}).join(", ");
		});
		_defineProperty(_this, "id", uniqueId("recharts-line-"));
		_defineProperty(_this, "pathRef", function(node) {
			_this.mainCurve = node;
		});
		_defineProperty(_this, "handleAnimationEnd", function() {
			_this.setState({ isAnimationFinished: true });
			if (_this.props.onAnimationEnd) _this.props.onAnimationEnd();
		});
		_defineProperty(_this, "handleAnimationStart", function() {
			_this.setState({ isAnimationFinished: false });
			if (_this.props.onAnimationStart) _this.props.onAnimationStart();
		});
		return _this;
	}
	_inherits(Line, _PureComponent);
	return _createClass(Line, [
		{
			key: "componentDidMount",
			value: function componentDidMount() {
				if (!this.props.isAnimationActive) return;
				var totalLength = this.getTotalLength();
				this.setState({ totalLength });
			}
		},
		{
			key: "componentDidUpdate",
			value: function componentDidUpdate() {
				if (!this.props.isAnimationActive) return;
				var totalLength = this.getTotalLength();
				if (totalLength !== this.state.totalLength) this.setState({ totalLength });
			}
		},
		{
			key: "getTotalLength",
			value: function getTotalLength() {
				var curveDom = this.mainCurve;
				try {
					return curveDom && curveDom.getTotalLength && curveDom.getTotalLength() || 0;
				} catch (err) {
					return 0;
				}
			}
		},
		{
			key: "renderErrorBar",
			value: function renderErrorBar(needClip, clipPathId) {
				if (this.props.isAnimationActive && !this.state.isAnimationFinished) return null;
				var _this$props = this.props, points = _this$props.points, xAxis = _this$props.xAxis, yAxis = _this$props.yAxis, layout = _this$props.layout, children = _this$props.children;
				var errorBarItems = findAllByType(children, ErrorBar);
				if (!errorBarItems) return null;
				var dataPointFormatter = function dataPointFormatter(dataPoint, dataKey) {
					return {
						x: dataPoint.x,
						y: dataPoint.y,
						value: dataPoint.value,
						errorVal: getValueByDataKey(dataPoint.payload, dataKey)
					};
				};
				var errorBarProps = { clipPath: needClip ? "url(#clipPath-".concat(clipPathId, ")") : null };
				return /*#__PURE__*/ import_react.createElement(Layer, errorBarProps, errorBarItems.map(function(item) {
					return /*#__PURE__*/ import_react.cloneElement(item, {
						key: "bar-".concat(item.props.dataKey),
						data: points,
						xAxis,
						yAxis,
						layout,
						dataPointFormatter
					});
				}));
			}
		},
		{
			key: "renderDots",
			value: function renderDots(needClip, clipDot, clipPathId) {
				if (this.props.isAnimationActive && !this.state.isAnimationFinished) return null;
				var _this$props2 = this.props, dot = _this$props2.dot, points = _this$props2.points, dataKey = _this$props2.dataKey;
				var lineProps = filterProps(this.props, false);
				var customDotProps = filterProps(dot, true);
				var dots = points.map(function(entry, i) {
					var dotProps = _objectSpread(_objectSpread(_objectSpread({
						key: "dot-".concat(i),
						r: 3
					}, lineProps), customDotProps), {}, {
						index: i,
						cx: entry.x,
						cy: entry.y,
						value: entry.value,
						dataKey,
						payload: entry.payload,
						points
					});
					return Line.renderDotItem(dot, dotProps);
				});
				var dotsProps = { clipPath: needClip ? "url(#clipPath-".concat(clipDot ? "" : "dots-").concat(clipPathId, ")") : null };
				return /*#__PURE__*/ import_react.createElement(Layer, _extends({
					className: "recharts-line-dots",
					key: "dots"
				}, dotsProps), dots);
			}
		},
		{
			key: "renderCurveStatically",
			value: function renderCurveStatically(points, needClip, clipPathId, props) {
				var _this$props3 = this.props, type = _this$props3.type, layout = _this$props3.layout, connectNulls = _this$props3.connectNulls;
				_this$props3.ref;
				var curveProps = _objectSpread(_objectSpread(_objectSpread({}, filterProps(_objectWithoutProperties(_this$props3, _excluded), true)), {}, {
					fill: "none",
					className: "recharts-line-curve",
					clipPath: needClip ? "url(#clipPath-".concat(clipPathId, ")") : null,
					points
				}, props), {}, {
					type,
					layout,
					connectNulls
				});
				return /*#__PURE__*/ import_react.createElement(Curve, _extends({}, curveProps, { pathRef: this.pathRef }));
			}
		},
		{
			key: "renderCurveWithAnimation",
			value: function renderCurveWithAnimation(needClip, clipPathId) {
				var _this2 = this;
				var _this$props4 = this.props, points = _this$props4.points, strokeDasharray = _this$props4.strokeDasharray, isAnimationActive = _this$props4.isAnimationActive, animationBegin = _this$props4.animationBegin, animationDuration = _this$props4.animationDuration, animationEasing = _this$props4.animationEasing, animationId = _this$props4.animationId, animateNewValues = _this$props4.animateNewValues, width = _this$props4.width, height = _this$props4.height;
				var _this$state = this.state, prevPoints = _this$state.prevPoints, totalLength = _this$state.totalLength;
				return /*#__PURE__*/ import_react.createElement(es6_default, {
					begin: animationBegin,
					duration: animationDuration,
					isActive: isAnimationActive,
					easing: animationEasing,
					from: { t: 0 },
					to: { t: 1 },
					key: "line-".concat(animationId),
					onAnimationEnd: this.handleAnimationEnd,
					onAnimationStart: this.handleAnimationStart
				}, function(_ref) {
					var t = _ref.t;
					if (prevPoints) {
						var prevPointsDiffFactor = prevPoints.length / points.length;
						var stepData = points.map(function(entry, index) {
							var prevPointIndex = Math.floor(index * prevPointsDiffFactor);
							if (prevPoints[prevPointIndex]) {
								var prev = prevPoints[prevPointIndex];
								var interpolatorX = interpolateNumber(prev.x, entry.x);
								var interpolatorY = interpolateNumber(prev.y, entry.y);
								return _objectSpread(_objectSpread({}, entry), {}, {
									x: interpolatorX(t),
									y: interpolatorY(t)
								});
							}
							if (animateNewValues) {
								var _interpolatorX = interpolateNumber(width * 2, entry.x);
								var _interpolatorY = interpolateNumber(height / 2, entry.y);
								return _objectSpread(_objectSpread({}, entry), {}, {
									x: _interpolatorX(t),
									y: _interpolatorY(t)
								});
							}
							return _objectSpread(_objectSpread({}, entry), {}, {
								x: entry.x,
								y: entry.y
							});
						});
						return _this2.renderCurveStatically(stepData, needClip, clipPathId);
					}
					var curLength = interpolateNumber(0, totalLength)(t);
					var currentStrokeDasharray;
					if (strokeDasharray) {
						var lines = "".concat(strokeDasharray).split(/[,\s]+/gim).map(function(num) {
							return parseFloat(num);
						});
						currentStrokeDasharray = _this2.getStrokeDasharray(curLength, totalLength, lines);
					} else currentStrokeDasharray = _this2.generateSimpleStrokeDasharray(totalLength, curLength);
					return _this2.renderCurveStatically(points, needClip, clipPathId, { strokeDasharray: currentStrokeDasharray });
				});
			}
		},
		{
			key: "renderCurve",
			value: function renderCurve(needClip, clipPathId) {
				var _this$props5 = this.props, points = _this$props5.points, isAnimationActive = _this$props5.isAnimationActive;
				var _this$state2 = this.state, prevPoints = _this$state2.prevPoints, totalLength = _this$state2.totalLength;
				if (isAnimationActive && points && points.length && (!prevPoints && totalLength > 0 || !(0, import_isEqual.default)(prevPoints, points))) return this.renderCurveWithAnimation(needClip, clipPathId);
				return this.renderCurveStatically(points, needClip, clipPathId);
			}
		},
		{
			key: "render",
			value: function render() {
				var _filterProps;
				var _this$props6 = this.props, hide = _this$props6.hide, dot = _this$props6.dot, points = _this$props6.points, className = _this$props6.className, xAxis = _this$props6.xAxis, yAxis = _this$props6.yAxis, top = _this$props6.top, left = _this$props6.left, width = _this$props6.width, height = _this$props6.height, isAnimationActive = _this$props6.isAnimationActive, id = _this$props6.id;
				if (hide || !points || !points.length) return null;
				var isAnimationFinished = this.state.isAnimationFinished;
				var hasSinglePoint = points.length === 1;
				var layerClass = clsx("recharts-line", className);
				var needClipX = xAxis && xAxis.allowDataOverflow;
				var needClipY = yAxis && yAxis.allowDataOverflow;
				var needClip = needClipX || needClipY;
				var clipPathId = (0, import_isNil.default)(id) ? this.id : id;
				var _ref2 = (_filterProps = filterProps(dot, false)) !== null && _filterProps !== void 0 ? _filterProps : {
					r: 3,
					strokeWidth: 2
				}, _ref2$r = _ref2.r, r = _ref2$r === void 0 ? 3 : _ref2$r, _ref2$strokeWidth = _ref2.strokeWidth, strokeWidth = _ref2$strokeWidth === void 0 ? 2 : _ref2$strokeWidth;
				var _ref3$clipDot = (hasClipDot(dot) ? dot : {}).clipDot, clipDot = _ref3$clipDot === void 0 ? true : _ref3$clipDot;
				var dotSize = r * 2 + strokeWidth;
				return /*#__PURE__*/ import_react.createElement(Layer, { className: layerClass }, needClipX || needClipY ? /*#__PURE__*/ import_react.createElement("defs", null, /*#__PURE__*/ import_react.createElement("clipPath", { id: "clipPath-".concat(clipPathId) }, /*#__PURE__*/ import_react.createElement("rect", {
					x: needClipX ? left : left - width / 2,
					y: needClipY ? top : top - height / 2,
					width: needClipX ? width : width * 2,
					height: needClipY ? height : height * 2
				})), !clipDot && /*#__PURE__*/ import_react.createElement("clipPath", { id: "clipPath-dots-".concat(clipPathId) }, /*#__PURE__*/ import_react.createElement("rect", {
					x: left - dotSize / 2,
					y: top - dotSize / 2,
					width: width + dotSize,
					height: height + dotSize
				}))) : null, !hasSinglePoint && this.renderCurve(needClip, clipPathId), this.renderErrorBar(needClip, clipPathId), (hasSinglePoint || dot) && this.renderDots(needClip, clipDot, clipPathId), (!isAnimationActive || isAnimationFinished) && LabelList.renderCallByParent(this.props, points));
			}
		}
	], [
		{
			key: "getDerivedStateFromProps",
			value: function getDerivedStateFromProps(nextProps, prevState) {
				if (nextProps.animationId !== prevState.prevAnimationId) return {
					prevAnimationId: nextProps.animationId,
					curPoints: nextProps.points,
					prevPoints: prevState.curPoints
				};
				if (nextProps.points !== prevState.curPoints) return { curPoints: nextProps.points };
				return null;
			}
		},
		{
			key: "repeat",
			value: function repeat(lines, count) {
				var linesUnit = lines.length % 2 !== 0 ? [].concat(_toConsumableArray(lines), [0]) : lines;
				var result = [];
				for (var i = 0; i < count; ++i) result = [].concat(_toConsumableArray(result), _toConsumableArray(linesUnit));
				return result;
			}
		},
		{
			key: "renderDotItem",
			value: function renderDotItem(option, props) {
				var dotItem;
				if (/*#__PURE__*/ import_react.isValidElement(option)) dotItem = /*#__PURE__*/ import_react.cloneElement(option, props);
				else if ((0, import_isFunction.default)(option)) dotItem = option(props);
				else {
					var key = props.key, dotProps = _objectWithoutProperties(props, _excluded2);
					var className = clsx("recharts-line-dot", typeof option !== "boolean" ? option.className : "");
					dotItem = /*#__PURE__*/ import_react.createElement(Dot, _extends({ key }, dotProps, { className }));
				}
				return dotItem;
			}
		}
	]);
}(import_react.PureComponent);
_defineProperty(Line, "displayName", "Line");
_defineProperty(Line, "defaultProps", {
	xAxisId: 0,
	yAxisId: 0,
	connectNulls: false,
	activeDot: true,
	dot: true,
	legendType: "line",
	stroke: "#3182bd",
	strokeWidth: 1,
	fill: "#fff",
	points: [],
	isAnimationActive: !Global.isSsr,
	animateNewValues: true,
	animationBegin: 0,
	animationDuration: 1500,
	animationEasing: "ease",
	hide: false,
	label: false
});
/**
* Compose the data of each group
* @param {Object} props The props from the component
* @param  {Object} xAxis   The configuration of x-axis
* @param  {Object} yAxis   The configuration of y-axis
* @param  {String} dataKey The unique key of a group
* @return {Array}  Composed data
*/
_defineProperty(Line, "getComposedData", function(_ref4) {
	var props = _ref4.props, xAxis = _ref4.xAxis, yAxis = _ref4.yAxis, xAxisTicks = _ref4.xAxisTicks, yAxisTicks = _ref4.yAxisTicks, dataKey = _ref4.dataKey, bandSize = _ref4.bandSize, displayedData = _ref4.displayedData, offset = _ref4.offset;
	var layout = props.layout;
	return _objectSpread({
		points: displayedData.map(function(entry, index) {
			var value = getValueByDataKey(entry, dataKey);
			if (layout === "horizontal") return {
				x: getCateCoordinateOfLine({
					axis: xAxis,
					ticks: xAxisTicks,
					bandSize,
					entry,
					index
				}),
				y: (0, import_isNil.default)(value) ? null : yAxis.scale(value),
				value,
				payload: entry
			};
			return {
				x: (0, import_isNil.default)(value) ? null : xAxis.scale(value),
				y: getCateCoordinateOfLine({
					axis: yAxis,
					ticks: yAxisTicks,
					bandSize,
					entry,
					index
				}),
				value,
				payload: entry
			};
		}),
		layout
	}, offset);
});
/**
* @fileOverview Line Chart
*/
var LineChart = generateCategoricalChart({
	chartName: "LineChart",
	GraphicalChild: Line,
	axisComponents: [{
		axisType: "xAxis",
		AxisComp: XAxis
	}, {
		axisType: "yAxis",
		AxisComp: YAxis
	}],
	formatAxisMap
});
var PALETTE = [
	"#10b981",
	"#0ea5e9",
	"#f59e0b",
	"#ef4444",
	"#8b5cf6",
	"#ec4899",
	"#22d3ee",
	"#84cc16"
];
function agencyShare(agency, agencies) {
	return 1 / (agencies.filter((a) => a.country === agency.country).length || 1);
}
function scaleNum(n, f) {
	return Math.round(n * f);
}
function useScopedData(scope, countryCode, agencyId) {
	return (0, import_react.useMemo)(() => {
		const agencies = getAgencies();
		const agency = agencies.find((a) => a.id === agencyId);
		const codeFilter = scope === "country" ? countryCode : scope === "agency" ? agency?.country ?? "" : "";
		const factor = scope === "agency" && agency ? agencyShare(agency, agencies) : 1;
		const keepCountry = (code) => !codeFilter || code === codeFilter;
		const objPays = salesObjectivesByCountry().filter((r) => keepCountry(r.code)).map((r) => ({
			...r,
			objectif: scaleNum(r.objectif, factor),
			realise: scaleNum(r.realise, factor)
		}));
		const objAnf = salesObjectivesANF().map((r) => ({
			...r,
			objectif: scaleNum(r.objectif, factor * (codeFilter ? 1 / COUNTRIES.length : 1)),
			realise: scaleNum(r.realise, factor * (codeFilter ? 1 / COUNTRIES.length : 1))
		}));
		const vUn = salesByUnit().filter((r) => keepCountry(r.code)).map((r) => ({
			...r,
			unites: scaleNum(r.unites, factor)
		}));
		const vCa = salesByRevenue().filter((r) => keepCountry(r.code)).map((r) => ({
			...r,
			ca: scaleNum(r.ca, factor)
		}));
		const shapeMonth = (rows) => rows.map((row) => {
			const out = { mois: row.mois };
			let total = 0;
			for (const c of COUNTRIES) {
				if (!keepCountry(c.code)) continue;
				const v = scaleNum(Number(row[c.code] ?? 0), factor);
				out[c.code] = v;
				total += v;
			}
			out.total = total;
			return out;
		});
		return {
			objPays,
			objAnf,
			vUn,
			vCa,
			evCa: shapeMonth(evolutionByRevenue()),
			evUn: shapeMonth(evolutionByUnits()),
			stocks: stockSituation().filter((r) => keepCountry(r.code)).map((r) => ({
				...r,
				stock: scaleNum(r.stock, factor),
				enCours: scaleNum(r.enCours, factor),
				total: scaleNum(r.total, factor),
				seuil: scaleNum(r.seuil, factor)
			})),
			visibleCountries: COUNTRIES.filter((c) => keepCountry(c.code)),
			agency
		};
	}, [
		scope,
		countryCode,
		agencyId
	]);
}
function RapportsPage() {
	const navigate = useNavigate();
	const [agencies, setAgencies] = (0, import_react.useState)([]);
	const [scope, setScope] = (0, import_react.useState)("all");
	const [countryCode, setCountryCode] = (0, import_react.useState)("");
	const [agencyId, setAgencyId] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined") return;
		if (!getUser()) {
			navigate({ to: "/login" });
			return;
		}
		const list = getAgencies();
		setAgencies(list);
		if (!countryCode && list[0]) setCountryCode(list[0].country);
		if (!agencyId && list[0]) setAgencyId(list[0].id);
	}, [
		navigate,
		countryCode,
		agencyId
	]);
	const data = useScopedData(scope, countryCode, agencyId);
	const scopeLabel = scope === "all" ? "Tous pays · toutes agences" : scope === "country" ? `Pays : ${COUNTRIES.find((c) => c.code === countryCode)?.name ?? countryCode}` : `Agence : ${data.agency?.name ?? agencyId}`;
	const fileSuffix = scope === "all" ? "global" : scope === "country" ? `pays-${countryCode}` : `agence-${agencyId}`;
	const exportAll = () => {
		exportXLSX(`rapports-anf-${fileSuffix}`, {
			"Obj. Pays": data.objPays,
			"Obj. ANF": data.objAnf,
			"Ventes UN": data.vUn,
			"Ventes CA": data.vCa,
			"Evol. CA": data.evCa,
			"Evol. UN": data.evUn,
			"Stocks": data.stocks,
			"_Filtre": [{
				scope,
				pays: countryCode,
				agence: agencyId,
				libelle: scopeLabel
			}]
		});
		toast.success("Rapport complet XLSX téléchargé");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Rapports SuperAdmin",
		subtitle: `Vision globale · ${scopeLabel}`,
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			size: "sm",
			onClick: exportAll,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "mr-2 h-4 w-4" }), "Exporter tout (XLSX)"]
		}),
		children: [
			API_ENABLED && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-6 rounded-2xl border-2 border-primary/20 bg-primary/5 p-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-lg bg-primary/10 p-2 shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "h-5 w-5 text-primary" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-semibold text-primary mb-1",
							children: "📊 Aucune donnée disponible"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground mb-3",
							children: "Les rapports affichent actuellement des données vides car les agences n'ont pas encore importé leurs fichiers Excel."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted-foreground",
							children: [
								"Pour voir les données réelles : les agences doivent se connecter et utiliser le module",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-foreground",
									children: "Import données"
								}),
								" pour uploader leurs fichiers Excel mensuels."
							]
						})
					] })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "mb-6 rounded-2xl border border-border bg-card p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex rounded-lg border border-border bg-surface p-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScopeBtn, {
									active: scope === "all",
									onClick: () => setScope("all"),
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Earth, { className: "h-3.5 w-3.5" }),
									label: "Tous confondus"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScopeBtn, {
									active: scope === "country",
									onClick: () => setScope("country"),
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3.5 w-3.5" }),
									label: "Par pays"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScopeBtn, {
									active: scope === "agency",
									onClick: () => setScope("agency"),
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-3.5 w-3.5" }),
									label: "Par agence"
								})
							]
						}),
						scope === "country" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: countryCode,
							onChange: (e) => setCountryCode(e.target.value),
							className: "h-9 rounded-lg border border-border bg-surface px-3 text-sm",
							children: COUNTRIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: c.code,
								children: [
									c.name,
									" (",
									c.code,
									")"
								]
							}, c.code))
						}),
						scope === "agency" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: agencyId,
							onChange: (e) => setAgencyId(e.target.value),
							className: "h-9 rounded-lg border border-border bg-surface px-3 text-sm",
							children: agencies.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: a.id,
								children: [
									a.name,
									" — ",
									a.country
								]
							}, a.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ml-auto text-xs text-muted-foreground",
							children: "Filtre appliqué à tous les rapports & exports ci-dessous"
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						id: "r1",
						className: "scroll-mt-24",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportObjectifsPays, {
							data: data.objPays,
							suffix: fileSuffix
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						id: "r2",
						className: "scroll-mt-24",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportObjectifsANF, {
							data: data.objAnf,
							suffix: fileSuffix
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						id: "r3",
						className: "scroll-mt-24",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportVentesUnits, {
							data: data.vUn,
							suffix: fileSuffix
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						id: "r4",
						className: "scroll-mt-24",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportVentesCA, {
							data: data.vCa,
							suffix: fileSuffix
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						id: "r5",
						className: "scroll-mt-24",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportEvolutionCA, {
							data: data.evCa,
							countries: data.visibleCountries,
							suffix: fileSuffix
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						id: "r6",
						className: "scroll-mt-24",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportEvolutionUN, {
							data: data.evUn,
							countries: data.visibleCountries,
							suffix: fileSuffix
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						id: "r7",
						className: "scroll-mt-24",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportStocks, {
							data: data.stocks,
							suffix: fileSuffix
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						id: "r8",
						className: "scroll-mt-24",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportStocksEnCours, {
							data: data.stocks,
							suffix: fileSuffix
						})
					})
				]
			})
		]
	});
}
function ScopeBtn({ active, onClick, icon, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		onClick,
		className: `inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`,
		children: [icon, label]
	});
}
function ReportCard({ title, subtitle, rows, filename, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-2xl border border-border bg-card p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-start justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-display text-xl",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground mt-0.5",
				children: subtitle
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					size: "sm",
					onClick: () => {
						exportCSV(filename, rows);
						toast.success("CSV téléchargé");
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-2 h-3.5 w-3.5" }), "CSV"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					onClick: () => {
						exportXLSX(filename, { Rapport: rows });
						toast.success("XLSX téléchargé");
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "mr-2 h-3.5 w-3.5" }), "XLSX"]
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-5",
			children
		})]
	});
}
var tooltipStyle = {
	background: "var(--color-card)",
	border: "1px solid var(--color-border)",
	borderRadius: 12,
	fontSize: 12
};
function ReportObjectifsPays({ data, suffix }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportCard, {
		title: "1 · Suivi objectifs ventes mensuelles par pays",
		subtitle: "Objectif vs réalisé",
		rows: data,
		filename: `suivi-objectifs-mensuels-pays-${suffix}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 lg:grid-cols-3 gap-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "lg:col-span-2 h-72",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
					data,
					margin: {
						left: -10,
						right: 8,
						top: 8
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
							strokeDasharray: "3 3",
							stroke: "var(--color-border)",
							vertical: false
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
							dataKey: "code",
							fontSize: 11,
							stroke: "var(--color-muted-foreground)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
							fontSize: 11,
							stroke: "var(--color-muted-foreground)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: tooltipStyle }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: 11 } }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
							dataKey: "objectif",
							name: "Objectif",
							fill: "#94a3b8",
							radius: [
								4,
								4,
								0,
								0
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
							dataKey: "realise",
							name: "Réalisé",
							fill: "#10b981",
							radius: [
								4,
								4,
								0,
								0
							]
						})
					]
				}) })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
				headers: [
					"Pays",
					"Objectif",
					"Réalisé",
					"Taux %"
				],
				rows: data.map((d) => [
					d.pays,
					fmt(d.objectif),
					fmt(d.realise),
					`${d.taux}%`
				])
			})]
		})
	});
}
function ReportObjectifsANF({ data, suffix }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportCard, {
		title: "2 · Suivi objectifs ventes mensuelles ANF",
		subtitle: "Performance globale · 12 mois",
		rows: data,
		filename: `suivi-objectifs-mensuels-anf-${suffix}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-72",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
				data,
				margin: {
					left: -10,
					right: 8,
					top: 8
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
						id: "anf-g",
						x1: "0",
						y1: "0",
						x2: "0",
						y2: "1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
							offset: "0%",
							stopColor: "#10b981",
							stopOpacity: .4
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
							offset: "100%",
							stopColor: "#10b981",
							stopOpacity: 0
						})]
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
						strokeDasharray: "3 3",
						stroke: "var(--color-border)",
						vertical: false
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
						dataKey: "mois",
						fontSize: 11,
						stroke: "var(--color-muted-foreground)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
						fontSize: 11,
						stroke: "var(--color-muted-foreground)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: tooltipStyle }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: 11 } }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
						type: "monotone",
						dataKey: "objectif",
						name: "Objectif",
						stroke: "#94a3b8",
						strokeDasharray: "4 4",
						fill: "transparent"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
						type: "monotone",
						dataKey: "realise",
						name: "Réalisé",
						stroke: "#10b981",
						fill: "url(#anf-g)",
						strokeWidth: 2.5
					})
				]
			}) })
		})
	});
}
function ReportVentesUnits({ data, suffix }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportCard, {
		title: "3 · Suivi ventes par unité",
		subtitle: "Volume d'unités vendues",
		rows: data,
		filename: `ventes-unites-${suffix}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 lg:grid-cols-3 gap-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "lg:col-span-2 h-72",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
					data,
					layout: "vertical",
					margin: {
						left: 60,
						right: 8
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
							strokeDasharray: "3 3",
							stroke: "var(--color-border)",
							horizontal: false
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
							type: "number",
							fontSize: 11,
							stroke: "var(--color-muted-foreground)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
							dataKey: "pays",
							type: "category",
							fontSize: 11,
							stroke: "var(--color-muted-foreground)",
							width: 100
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: tooltipStyle }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
							dataKey: "unites",
							name: "Unités",
							fill: "#0ea5e9",
							radius: [
								0,
								6,
								6,
								0
							]
						})
					]
				}) })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
				headers: ["Pays", "Unités"],
				rows: data.map((d) => [d.pays, fmt(d.unites)])
			})]
		})
	});
}
function ReportVentesCA({ data, suffix }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportCard, {
		title: "4 · Suivi ventes par chiffre d'affaires",
		subtitle: "CA généré",
		rows: data,
		filename: `ventes-ca-${suffix}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 lg:grid-cols-2 gap-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-72",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
						data,
						dataKey: "ca",
						nameKey: "pays",
						outerRadius: 100,
						label: (e) => e.code,
						children: data.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: PALETTE[i % PALETTE.length] }, i))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: tooltipStyle }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: 11 } })
				] }) })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
				headers: ["Pays", "CA"],
				rows: data.map((d) => [d.pays, `€${fmt(d.ca)}`])
			})]
		})
	});
}
function ReportEvolutionCA({ data, countries, suffix }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportCard, {
		title: "5 · Évolution ventes mois par mois — CA",
		subtitle: "CA cumulé sur 12 mois",
		rows: data,
		filename: `evolution-ca-${suffix}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-80",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
				data,
				margin: {
					left: -10,
					right: 8,
					top: 8
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
						strokeDasharray: "3 3",
						stroke: "var(--color-border)",
						vertical: false
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
						dataKey: "mois",
						fontSize: 11,
						stroke: "var(--color-muted-foreground)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
						fontSize: 11,
						stroke: "var(--color-muted-foreground)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: tooltipStyle }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: 11 } }),
					countries.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
						type: "monotone",
						dataKey: c.code,
						stroke: PALETTE[i % PALETTE.length],
						strokeWidth: 2,
						dot: false
					}, c.code))
				]
			}) })
		})
	});
}
function ReportEvolutionUN({ data, countries, suffix }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportCard, {
		title: "6 · Évolution ventes mois par mois — Unités",
		subtitle: "Volumes sur 12 mois",
		rows: data,
		filename: `evolution-unites-${suffix}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-80",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
				data,
				margin: {
					left: -10,
					right: 8,
					top: 8
				},
				stackOffset: "expand",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
						strokeDasharray: "3 3",
						stroke: "var(--color-border)",
						vertical: false
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
						dataKey: "mois",
						fontSize: 11,
						stroke: "var(--color-muted-foreground)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
						fontSize: 11,
						stroke: "var(--color-muted-foreground)",
						tickFormatter: (v) => `${Math.round(v * 100)}%`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: tooltipStyle }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: 11 } }),
					countries.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
						type: "monotone",
						dataKey: c.code,
						stackId: "1",
						stroke: PALETTE[i % PALETTE.length],
						fill: PALETTE[i % PALETTE.length]
					}, c.code))
				]
			}) })
		})
	});
}
function ReportStocks({ data, suffix }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportCard, {
		title: "7 · Situation stocks locaux",
		subtitle: "Stocks disponibles vs seuil",
		rows: data,
		filename: `situation-stocks-${suffix}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 lg:grid-cols-3 gap-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "lg:col-span-2 h-72",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
					data,
					margin: {
						left: -10,
						right: 8,
						top: 8
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
							strokeDasharray: "3 3",
							stroke: "var(--color-border)",
							vertical: false
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
							dataKey: "code",
							fontSize: 11,
							stroke: "var(--color-muted-foreground)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
							fontSize: 11,
							stroke: "var(--color-muted-foreground)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: tooltipStyle }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: 11 } }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
							dataKey: "stock",
							name: "Stock",
							fill: "#10b981",
							radius: [
								4,
								4,
								0,
								0
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
							dataKey: "seuil",
							name: "Seuil",
							fill: "#94a3b8",
							radius: [
								4,
								4,
								0,
								0
							]
						})
					]
				}) })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
				headers: [
					"Pays",
					"Stock",
					"Seuil",
					"Couv."
				],
				rows: data.map((d) => [
					d.pays,
					fmt(d.stock),
					fmt(d.seuil),
					`${d.couverture}j`
				])
			})]
		})
	});
}
function ReportStocksEnCours({ data, suffix }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportCard, {
		title: "8 · Situation stocks + commandes en cours",
		subtitle: "Stocks disponibles + produits en commande",
		rows: data,
		filename: `stocks-avec-en-cours-${suffix}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 lg:grid-cols-3 gap-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "lg:col-span-2 h-72",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
					data,
					margin: {
						left: -10,
						right: 8,
						top: 8
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
							strokeDasharray: "3 3",
							stroke: "var(--color-border)",
							vertical: false
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
							dataKey: "code",
							fontSize: 11,
							stroke: "var(--color-muted-foreground)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
							fontSize: 11,
							stroke: "var(--color-muted-foreground)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: tooltipStyle }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: 11 } }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
							dataKey: "stock",
							stackId: "a",
							name: "Stock disponible",
							fill: "#10b981"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
							dataKey: "enCours",
							stackId: "a",
							name: "En cours",
							fill: "#f59e0b",
							radius: [
								4,
								4,
								0,
								0
							]
						})
					]
				}) })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
				headers: [
					"Pays",
					"Stock",
					"En cours",
					"Total"
				],
				rows: data.map((d) => [
					d.pays,
					fmt(d.stock),
					fmt(d.enCours),
					fmt(d.total)
				])
			})]
		})
	});
}
function DataTable({ headers, rows }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-hidden rounded-xl border border-border bg-surface/40",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "w-full text-xs",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
				className: "bg-surface",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: headers.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
					className: "px-3 py-2 text-left font-medium text-muted-foreground uppercase tracking-wider text-[10px]",
					children: h
				}, h)) })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "px-3 py-4 text-center text-muted-foreground",
				colSpan: headers.length,
				children: "Aucune donnée"
			}) }) : rows.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
				className: "border-t border-border/60",
				children: r.map((c, j) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: `px-3 py-2 tabular-nums ${j === 0 ? "font-medium" : "text-muted-foreground"}`,
					children: c
				}, j))
			}, i)) })]
		})
	});
}
function fmt(n) {
	return n.toLocaleString("fr-FR");
}
//#endregion
export { RapportsPage as component };
