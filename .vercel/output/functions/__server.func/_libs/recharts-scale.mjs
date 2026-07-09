import { t as decimal_default } from "./decimal.js-light.mjs";
//#region node_modules/recharts-scale/es6/util/utils.js
function _toConsumableArray$1(arr) {
	return _arrayWithoutHoles$1(arr) || _iterableToArray$1(arr) || _unsupportedIterableToArray$1(arr) || _nonIterableSpread$1();
}
function _nonIterableSpread$1() {
	throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$1(o, minLen) {
	if (!o) return;
	if (typeof o === "string") return _arrayLikeToArray$1(o, minLen);
	var n = Object.prototype.toString.call(o).slice(8, -1);
	if (n === "Object" && o.constructor) n = o.constructor.name;
	if (n === "Map" || n === "Set") return Array.from(o);
	if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$1(o, minLen);
}
function _iterableToArray$1(iter) {
	if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}
function _arrayWithoutHoles$1(arr) {
	if (Array.isArray(arr)) return _arrayLikeToArray$1(arr);
}
function _arrayLikeToArray$1(arr, len) {
	if (len == null || len > arr.length) len = arr.length;
	for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
	return arr2;
}
var identity = function identity(i) {
	return i;
};
var PLACE_HOLDER = { "@@functional/placeholder": true };
var isPlaceHolder = function isPlaceHolder(val) {
	return val === PLACE_HOLDER;
};
var curry0 = function curry0(fn) {
	return function _curried() {
		if (arguments.length === 0 || arguments.length === 1 && isPlaceHolder(arguments.length <= 0 ? void 0 : arguments[0])) return _curried;
		return fn.apply(void 0, arguments);
	};
};
var curryN = function curryN(n, fn) {
	if (n === 1) return fn;
	return curry0(function() {
		for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
		var argsLength = args.filter(function(arg) {
			return arg !== PLACE_HOLDER;
		}).length;
		if (argsLength >= n) return fn.apply(void 0, args);
		return curryN(n - argsLength, curry0(function() {
			for (var _len2 = arguments.length, restArgs = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) restArgs[_key2] = arguments[_key2];
			var newArgs = args.map(function(arg) {
				return isPlaceHolder(arg) ? restArgs.shift() : arg;
			});
			return fn.apply(void 0, _toConsumableArray$1(newArgs).concat(restArgs));
		}));
	});
};
var curry = function curry(fn) {
	return curryN(fn.length, fn);
};
var range = function range(begin, end) {
	var arr = [];
	for (var i = begin; i < end; ++i) arr[i - begin] = i;
	return arr;
};
var map = curry(function(fn, arr) {
	if (Array.isArray(arr)) return arr.map(fn);
	return Object.keys(arr).map(function(key) {
		return arr[key];
	}).map(fn);
});
var compose = function compose() {
	for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) args[_key3] = arguments[_key3];
	if (!args.length) return identity;
	var fns = args.reverse();
	var firstFn = fns[0];
	var tailsFn = fns.slice(1);
	return function() {
		return tailsFn.reduce(function(res, fn) {
			return fn(res);
		}, firstFn.apply(void 0, arguments));
	};
};
var reverse = function reverse(arr) {
	if (Array.isArray(arr)) return arr.reverse();
	return arr.split("").reverse.join("");
};
var memoize = function memoize(fn) {
	var lastArgs = null;
	var lastResult = null;
	return function() {
		for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) args[_key4] = arguments[_key4];
		if (lastArgs && args.every(function(val, i) {
			return val === lastArgs[i];
		})) return lastResult;
		lastArgs = args;
		lastResult = fn.apply(void 0, args);
		return lastResult;
	};
};
//#endregion
//#region node_modules/recharts-scale/es6/util/arithmetic.js
/**
* @fileOverview 一些公用的运算方法
* @author xile611
* @date 2015-09-17
*/
/**
* 获取数值的位数
* 其中绝对值属于区间[0.1, 1)， 得到的值为0
* 绝对值属于区间[0.01, 0.1)，得到的位数为 -1
* 绝对值属于区间[0.001, 0.01)，得到的位数为 -2
*
* @param  {Number} value 数值
* @return {Integer} 位数
*/
function getDigitCount(value) {
	var result;
	if (value === 0) result = 1;
	else result = Math.floor(new decimal_default(value).abs().log(10).toNumber()) + 1;
	return result;
}
/**
* 按照固定的步长获取[start, end)这个区间的数据
* 并且需要处理js计算精度的问题
*
* @param  {Decimal} start 起点
* @param  {Decimal} end   终点，不包含该值
* @param  {Decimal} step  步长
* @return {Array}         若干数值
*/
function rangeStep(start, end, step) {
	var num = new decimal_default(start);
	var i = 0;
	var result = [];
	while (num.lt(end) && i < 1e5) {
		result.push(num.toNumber());
		num = num.add(step);
		i++;
	}
	return result;
}
var arithmetic_default = {
	rangeStep,
	getDigitCount,
	interpolateNumber: curry(function(a, b, t) {
		var newA = +a;
		return newA + t * (+b - newA);
	}),
	uninterpolateNumber: curry(function(a, b, x) {
		var diff = b - +a;
		diff = diff || Infinity;
		return (x - a) / diff;
	}),
	uninterpolateTruncation: curry(function(a, b, x) {
		var diff = b - +a;
		diff = diff || Infinity;
		return Math.max(0, Math.min(1, (x - a) / diff));
	})
};
//#endregion
//#region node_modules/recharts-scale/es6/getNiceTickValues.js
/**
* @fileOverview calculate tick values of scale
* @author xile611, arcthur
* @date 2015-09-17
*/
function _toConsumableArray(arr) {
	return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
function _nonIterableSpread() {
	throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _iterableToArray(iter) {
	if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}
function _arrayWithoutHoles(arr) {
	if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}
function _slicedToArray(arr, i) {
	return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
function _nonIterableRest() {
	throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray(o, minLen) {
	if (!o) return;
	if (typeof o === "string") return _arrayLikeToArray(o, minLen);
	var n = Object.prototype.toString.call(o).slice(8, -1);
	if (n === "Object" && o.constructor) n = o.constructor.name;
	if (n === "Map" || n === "Set") return Array.from(o);
	if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
	if (len == null || len > arr.length) len = arr.length;
	for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
	return arr2;
}
function _iterableToArrayLimit(arr, i) {
	if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
	var _arr = [];
	var _n = true;
	var _d = false;
	var _e = void 0;
	try {
		for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
			_arr.push(_s.value);
			if (i && _arr.length === i) break;
		}
	} catch (err) {
		_d = true;
		_e = err;
	} finally {
		try {
			if (!_n && _i["return"] != null) _i["return"]();
		} finally {
			if (_d) throw _e;
		}
	}
	return _arr;
}
function _arrayWithHoles(arr) {
	if (Array.isArray(arr)) return arr;
}
/**
* Calculate a interval of a minimum value and a maximum value
*
* @param  {Number} min       The minimum value
* @param  {Number} max       The maximum value
* @return {Array} An interval
*/
function getValidInterval(_ref) {
	var _ref2 = _slicedToArray(_ref, 2), min = _ref2[0], max = _ref2[1];
	var validMin = min, validMax = max;
	if (min > max) {
		validMin = max;
		validMax = min;
	}
	return [validMin, validMax];
}
/**
* Calculate the step which is easy to understand between ticks, like 10, 20, 25
*
* @param  {Decimal} roughStep        The rough step calculated by deviding the
* difference by the tickCount
* @param  {Boolean} allowDecimals    Allow the ticks to be decimals or not
* @param  {Integer} correctionFactor A correction factor
* @return {Decimal} The step which is easy to understand between two ticks
*/
function getFormatStep(roughStep, allowDecimals, correctionFactor) {
	if (roughStep.lte(0)) return new decimal_default(0);
	var digitCount = arithmetic_default.getDigitCount(roughStep.toNumber());
	var digitCountValue = new decimal_default(10).pow(digitCount);
	var stepRatio = roughStep.div(digitCountValue);
	var stepRatioScale = digitCount !== 1 ? .05 : .1;
	var formatStep = new decimal_default(Math.ceil(stepRatio.div(stepRatioScale).toNumber())).add(correctionFactor).mul(stepRatioScale).mul(digitCountValue);
	return allowDecimals ? formatStep : new decimal_default(Math.ceil(formatStep));
}
/**
* calculate the ticks when the minimum value equals to the maximum value
*
* @param  {Number}  value         The minimum valuue which is also the maximum value
* @param  {Integer} tickCount     The count of ticks
* @param  {Boolean} allowDecimals Allow the ticks to be decimals or not
* @return {Array}                 ticks
*/
function getTickOfSingleValue(value, tickCount, allowDecimals) {
	var step = 1;
	var middle = new decimal_default(value);
	if (!middle.isint() && allowDecimals) {
		var absVal = Math.abs(value);
		if (absVal < 1) {
			step = new decimal_default(10).pow(arithmetic_default.getDigitCount(value) - 1);
			middle = new decimal_default(Math.floor(middle.div(step).toNumber())).mul(step);
		} else if (absVal > 1) middle = new decimal_default(Math.floor(value));
	} else if (value === 0) middle = new decimal_default(Math.floor((tickCount - 1) / 2));
	else if (!allowDecimals) middle = new decimal_default(Math.floor(value));
	var middleIndex = Math.floor((tickCount - 1) / 2);
	return compose(map(function(n) {
		return middle.add(new decimal_default(n - middleIndex).mul(step)).toNumber();
	}), range)(0, tickCount);
}
/**
* Calculate the step
*
* @param  {Number}  min              The minimum value of an interval
* @param  {Number}  max              The maximum value of an interval
* @param  {Integer} tickCount        The count of ticks
* @param  {Boolean} allowDecimals    Allow the ticks to be decimals or not
* @param  {Number}  correctionFactor A correction factor
* @return {Object}  The step, minimum value of ticks, maximum value of ticks
*/
function calculateStep(min, max, tickCount, allowDecimals) {
	var correctionFactor = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : 0;
	if (!Number.isFinite((max - min) / (tickCount - 1))) return {
		step: new decimal_default(0),
		tickMin: new decimal_default(0),
		tickMax: new decimal_default(0)
	};
	var step = getFormatStep(new decimal_default(max).sub(min).div(tickCount - 1), allowDecimals, correctionFactor);
	var middle;
	if (min <= 0 && max >= 0) middle = new decimal_default(0);
	else {
		middle = new decimal_default(min).add(max).div(2);
		middle = middle.sub(new decimal_default(middle).mod(step));
	}
	var belowCount = Math.ceil(middle.sub(min).div(step).toNumber());
	var upCount = Math.ceil(new decimal_default(max).sub(middle).div(step).toNumber());
	var scaleCount = belowCount + upCount + 1;
	if (scaleCount > tickCount) return calculateStep(min, max, tickCount, allowDecimals, correctionFactor + 1);
	if (scaleCount < tickCount) {
		upCount = max > 0 ? upCount + (tickCount - scaleCount) : upCount;
		belowCount = max > 0 ? belowCount : belowCount + (tickCount - scaleCount);
	}
	return {
		step,
		tickMin: middle.sub(new decimal_default(belowCount).mul(step)),
		tickMax: middle.add(new decimal_default(upCount).mul(step))
	};
}
/**
* Calculate the ticks of an interval, the count of ticks will be guraranteed
*
* @param  {Number}  min, max      min: The minimum value, max: The maximum value
* @param  {Integer} tickCount     The count of ticks
* @param  {Boolean} allowDecimals Allow the ticks to be decimals or not
* @return {Array}   ticks
*/
function getNiceTickValuesFn(_ref3) {
	var _ref4 = _slicedToArray(_ref3, 2), min = _ref4[0], max = _ref4[1];
	var tickCount = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 6;
	var allowDecimals = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : true;
	var count = Math.max(tickCount, 2);
	var _getValidInterval2 = _slicedToArray(getValidInterval([min, max]), 2), cormin = _getValidInterval2[0], cormax = _getValidInterval2[1];
	if (cormin === -Infinity || cormax === Infinity) {
		var _values = cormax === Infinity ? [cormin].concat(_toConsumableArray(range(0, tickCount - 1).map(function() {
			return Infinity;
		}))) : [].concat(_toConsumableArray(range(0, tickCount - 1).map(function() {
			return -Infinity;
		})), [cormax]);
		return min > max ? reverse(_values) : _values;
	}
	if (cormin === cormax) return getTickOfSingleValue(cormin, tickCount, allowDecimals);
	var _calculateStep = calculateStep(cormin, cormax, count, allowDecimals), step = _calculateStep.step, tickMin = _calculateStep.tickMin, tickMax = _calculateStep.tickMax;
	var values = arithmetic_default.rangeStep(tickMin, tickMax.add(new decimal_default(.1).mul(step)), step);
	return min > max ? reverse(values) : values;
}
/**
* Calculate the ticks of an interval, the count of ticks won't be guraranteed,
* but the domain will be guaranteed
*
* @param  {Number}  min, max      min: The minimum value, max: The maximum value
* @param  {Integer} tickCount     The count of ticks
* @param  {Boolean} allowDecimals Allow the ticks to be decimals or not
* @return {Array}   ticks
*/
function getTickValuesFixedDomainFn(_ref7, tickCount) {
	var _ref8 = _slicedToArray(_ref7, 2), min = _ref8[0], max = _ref8[1];
	var allowDecimals = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : true;
	var _getValidInterval6 = _slicedToArray(getValidInterval([min, max]), 2), cormin = _getValidInterval6[0], cormax = _getValidInterval6[1];
	if (cormin === -Infinity || cormax === Infinity) return [min, max];
	if (cormin === cormax) return [cormin];
	var count = Math.max(tickCount, 2);
	var step = getFormatStep(new decimal_default(cormax).sub(cormin).div(count - 1), allowDecimals, 0);
	var values = [].concat(_toConsumableArray(arithmetic_default.rangeStep(new decimal_default(cormin), new decimal_default(cormax).sub(new decimal_default(.99).mul(step)), step)), [cormax]);
	return min > max ? reverse(values) : values;
}
var getNiceTickValues = memoize(getNiceTickValuesFn);
var getTickValuesFixedDomain = memoize(getTickValuesFixedDomainFn);
//#endregion
export { getTickValuesFixedDomain as n, getNiceTickValues as t };
