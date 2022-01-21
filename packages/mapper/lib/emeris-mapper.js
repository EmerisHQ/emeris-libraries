/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/long/src/long.js":
/*!***************************************!*\
  !*** ./node_modules/long/src/long.js ***!
  \***************************************/
/***/ ((module) => {

module.exports = Long;

/**
 * wasm optimizations, to do native i64 multiplication and divide
 */
var wasm = null;

try {
  wasm = new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array([
    0, 97, 115, 109, 1, 0, 0, 0, 1, 13, 2, 96, 0, 1, 127, 96, 4, 127, 127, 127, 127, 1, 127, 3, 7, 6, 0, 1, 1, 1, 1, 1, 6, 6, 1, 127, 1, 65, 0, 11, 7, 50, 6, 3, 109, 117, 108, 0, 1, 5, 100, 105, 118, 95, 115, 0, 2, 5, 100, 105, 118, 95, 117, 0, 3, 5, 114, 101, 109, 95, 115, 0, 4, 5, 114, 101, 109, 95, 117, 0, 5, 8, 103, 101, 116, 95, 104, 105, 103, 104, 0, 0, 10, 191, 1, 6, 4, 0, 35, 0, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 126, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 127, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 128, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 129, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 130, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11
  ])), {}).exports;
} catch (e) {
  // no wasm support :(
}

/**
 * Constructs a 64 bit two's-complement integer, given its low and high 32 bit values as *signed* integers.
 *  See the from* functions below for more convenient ways of constructing Longs.
 * @exports Long
 * @class A Long class for representing a 64 bit two's-complement integer value.
 * @param {number} low The low (signed) 32 bits of the long
 * @param {number} high The high (signed) 32 bits of the long
 * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
 * @constructor
 */
function Long(low, high, unsigned) {

    /**
     * The low 32 bits as a signed value.
     * @type {number}
     */
    this.low = low | 0;

    /**
     * The high 32 bits as a signed value.
     * @type {number}
     */
    this.high = high | 0;

    /**
     * Whether unsigned or not.
     * @type {boolean}
     */
    this.unsigned = !!unsigned;
}

// The internal representation of a long is the two given signed, 32-bit values.
// We use 32-bit pieces because these are the size of integers on which
// Javascript performs bit-operations.  For operations like addition and
// multiplication, we split each number into 16 bit pieces, which can easily be
// multiplied within Javascript's floating-point representation without overflow
// or change in sign.
//
// In the algorithms below, we frequently reduce the negative case to the
// positive case by negating the input(s) and then post-processing the result.
// Note that we must ALWAYS check specially whether those values are MIN_VALUE
// (-2^63) because -MIN_VALUE == MIN_VALUE (since 2^63 cannot be represented as
// a positive number, it overflows back into a negative).  Not handling this
// case would often result in infinite recursion.
//
// Common constant values ZERO, ONE, NEG_ONE, etc. are defined below the from*
// methods on which they depend.

/**
 * An indicator used to reliably determine if an object is a Long or not.
 * @type {boolean}
 * @const
 * @private
 */
Long.prototype.__isLong__;

Object.defineProperty(Long.prototype, "__isLong__", { value: true });

/**
 * @function
 * @param {*} obj Object
 * @returns {boolean}
 * @inner
 */
function isLong(obj) {
    return (obj && obj["__isLong__"]) === true;
}

/**
 * Tests if the specified object is a Long.
 * @function
 * @param {*} obj Object
 * @returns {boolean}
 */
Long.isLong = isLong;

/**
 * A cache of the Long representations of small integer values.
 * @type {!Object}
 * @inner
 */
var INT_CACHE = {};

/**
 * A cache of the Long representations of small unsigned integer values.
 * @type {!Object}
 * @inner
 */
var UINT_CACHE = {};

/**
 * @param {number} value
 * @param {boolean=} unsigned
 * @returns {!Long}
 * @inner
 */
function fromInt(value, unsigned) {
    var obj, cachedObj, cache;
    if (unsigned) {
        value >>>= 0;
        if (cache = (0 <= value && value < 256)) {
            cachedObj = UINT_CACHE[value];
            if (cachedObj)
                return cachedObj;
        }
        obj = fromBits(value, (value | 0) < 0 ? -1 : 0, true);
        if (cache)
            UINT_CACHE[value] = obj;
        return obj;
    } else {
        value |= 0;
        if (cache = (-128 <= value && value < 128)) {
            cachedObj = INT_CACHE[value];
            if (cachedObj)
                return cachedObj;
        }
        obj = fromBits(value, value < 0 ? -1 : 0, false);
        if (cache)
            INT_CACHE[value] = obj;
        return obj;
    }
}

/**
 * Returns a Long representing the given 32 bit integer value.
 * @function
 * @param {number} value The 32 bit integer in question
 * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
 * @returns {!Long} The corresponding Long value
 */
Long.fromInt = fromInt;

/**
 * @param {number} value
 * @param {boolean=} unsigned
 * @returns {!Long}
 * @inner
 */
function fromNumber(value, unsigned) {
    if (isNaN(value))
        return unsigned ? UZERO : ZERO;
    if (unsigned) {
        if (value < 0)
            return UZERO;
        if (value >= TWO_PWR_64_DBL)
            return MAX_UNSIGNED_VALUE;
    } else {
        if (value <= -TWO_PWR_63_DBL)
            return MIN_VALUE;
        if (value + 1 >= TWO_PWR_63_DBL)
            return MAX_VALUE;
    }
    if (value < 0)
        return fromNumber(-value, unsigned).neg();
    return fromBits((value % TWO_PWR_32_DBL) | 0, (value / TWO_PWR_32_DBL) | 0, unsigned);
}

/**
 * Returns a Long representing the given value, provided that it is a finite number. Otherwise, zero is returned.
 * @function
 * @param {number} value The number in question
 * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
 * @returns {!Long} The corresponding Long value
 */
Long.fromNumber = fromNumber;

/**
 * @param {number} lowBits
 * @param {number} highBits
 * @param {boolean=} unsigned
 * @returns {!Long}
 * @inner
 */
function fromBits(lowBits, highBits, unsigned) {
    return new Long(lowBits, highBits, unsigned);
}

/**
 * Returns a Long representing the 64 bit integer that comes by concatenating the given low and high bits. Each is
 *  assumed to use 32 bits.
 * @function
 * @param {number} lowBits The low 32 bits
 * @param {number} highBits The high 32 bits
 * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
 * @returns {!Long} The corresponding Long value
 */
Long.fromBits = fromBits;

/**
 * @function
 * @param {number} base
 * @param {number} exponent
 * @returns {number}
 * @inner
 */
var pow_dbl = Math.pow; // Used 4 times (4*8 to 15+4)

/**
 * @param {string} str
 * @param {(boolean|number)=} unsigned
 * @param {number=} radix
 * @returns {!Long}
 * @inner
 */
function fromString(str, unsigned, radix) {
    if (str.length === 0)
        throw Error('empty string');
    if (str === "NaN" || str === "Infinity" || str === "+Infinity" || str === "-Infinity")
        return ZERO;
    if (typeof unsigned === 'number') {
        // For goog.math.long compatibility
        radix = unsigned,
        unsigned = false;
    } else {
        unsigned = !! unsigned;
    }
    radix = radix || 10;
    if (radix < 2 || 36 < radix)
        throw RangeError('radix');

    var p;
    if ((p = str.indexOf('-')) > 0)
        throw Error('interior hyphen');
    else if (p === 0) {
        return fromString(str.substring(1), unsigned, radix).neg();
    }

    // Do several (8) digits each time through the loop, so as to
    // minimize the calls to the very expensive emulated div.
    var radixToPower = fromNumber(pow_dbl(radix, 8));

    var result = ZERO;
    for (var i = 0; i < str.length; i += 8) {
        var size = Math.min(8, str.length - i),
            value = parseInt(str.substring(i, i + size), radix);
        if (size < 8) {
            var power = fromNumber(pow_dbl(radix, size));
            result = result.mul(power).add(fromNumber(value));
        } else {
            result = result.mul(radixToPower);
            result = result.add(fromNumber(value));
        }
    }
    result.unsigned = unsigned;
    return result;
}

/**
 * Returns a Long representation of the given string, written using the specified radix.
 * @function
 * @param {string} str The textual representation of the Long
 * @param {(boolean|number)=} unsigned Whether unsigned or not, defaults to signed
 * @param {number=} radix The radix in which the text is written (2-36), defaults to 10
 * @returns {!Long} The corresponding Long value
 */
Long.fromString = fromString;

/**
 * @function
 * @param {!Long|number|string|!{low: number, high: number, unsigned: boolean}} val
 * @param {boolean=} unsigned
 * @returns {!Long}
 * @inner
 */
function fromValue(val, unsigned) {
    if (typeof val === 'number')
        return fromNumber(val, unsigned);
    if (typeof val === 'string')
        return fromString(val, unsigned);
    // Throws for non-objects, converts non-instanceof Long:
    return fromBits(val.low, val.high, typeof unsigned === 'boolean' ? unsigned : val.unsigned);
}

/**
 * Converts the specified value to a Long using the appropriate from* function for its type.
 * @function
 * @param {!Long|number|string|!{low: number, high: number, unsigned: boolean}} val Value
 * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
 * @returns {!Long}
 */
Long.fromValue = fromValue;

// NOTE: the compiler should inline these constant values below and then remove these variables, so there should be
// no runtime penalty for these.

/**
 * @type {number}
 * @const
 * @inner
 */
var TWO_PWR_16_DBL = 1 << 16;

/**
 * @type {number}
 * @const
 * @inner
 */
var TWO_PWR_24_DBL = 1 << 24;

/**
 * @type {number}
 * @const
 * @inner
 */
var TWO_PWR_32_DBL = TWO_PWR_16_DBL * TWO_PWR_16_DBL;

/**
 * @type {number}
 * @const
 * @inner
 */
var TWO_PWR_64_DBL = TWO_PWR_32_DBL * TWO_PWR_32_DBL;

/**
 * @type {number}
 * @const
 * @inner
 */
var TWO_PWR_63_DBL = TWO_PWR_64_DBL / 2;

/**
 * @type {!Long}
 * @const
 * @inner
 */
var TWO_PWR_24 = fromInt(TWO_PWR_24_DBL);

/**
 * @type {!Long}
 * @inner
 */
var ZERO = fromInt(0);

/**
 * Signed zero.
 * @type {!Long}
 */
Long.ZERO = ZERO;

/**
 * @type {!Long}
 * @inner
 */
var UZERO = fromInt(0, true);

/**
 * Unsigned zero.
 * @type {!Long}
 */
Long.UZERO = UZERO;

/**
 * @type {!Long}
 * @inner
 */
var ONE = fromInt(1);

/**
 * Signed one.
 * @type {!Long}
 */
Long.ONE = ONE;

/**
 * @type {!Long}
 * @inner
 */
var UONE = fromInt(1, true);

/**
 * Unsigned one.
 * @type {!Long}
 */
Long.UONE = UONE;

/**
 * @type {!Long}
 * @inner
 */
var NEG_ONE = fromInt(-1);

/**
 * Signed negative one.
 * @type {!Long}
 */
Long.NEG_ONE = NEG_ONE;

/**
 * @type {!Long}
 * @inner
 */
var MAX_VALUE = fromBits(0xFFFFFFFF|0, 0x7FFFFFFF|0, false);

/**
 * Maximum signed value.
 * @type {!Long}
 */
Long.MAX_VALUE = MAX_VALUE;

/**
 * @type {!Long}
 * @inner
 */
var MAX_UNSIGNED_VALUE = fromBits(0xFFFFFFFF|0, 0xFFFFFFFF|0, true);

/**
 * Maximum unsigned value.
 * @type {!Long}
 */
Long.MAX_UNSIGNED_VALUE = MAX_UNSIGNED_VALUE;

/**
 * @type {!Long}
 * @inner
 */
var MIN_VALUE = fromBits(0, 0x80000000|0, false);

/**
 * Minimum signed value.
 * @type {!Long}
 */
Long.MIN_VALUE = MIN_VALUE;

/**
 * @alias Long.prototype
 * @inner
 */
var LongPrototype = Long.prototype;

/**
 * Converts the Long to a 32 bit integer, assuming it is a 32 bit integer.
 * @returns {number}
 */
LongPrototype.toInt = function toInt() {
    return this.unsigned ? this.low >>> 0 : this.low;
};

/**
 * Converts the Long to a the nearest floating-point representation of this value (double, 53 bit mantissa).
 * @returns {number}
 */
LongPrototype.toNumber = function toNumber() {
    if (this.unsigned)
        return ((this.high >>> 0) * TWO_PWR_32_DBL) + (this.low >>> 0);
    return this.high * TWO_PWR_32_DBL + (this.low >>> 0);
};

/**
 * Converts the Long to a string written in the specified radix.
 * @param {number=} radix Radix (2-36), defaults to 10
 * @returns {string}
 * @override
 * @throws {RangeError} If `radix` is out of range
 */
LongPrototype.toString = function toString(radix) {
    radix = radix || 10;
    if (radix < 2 || 36 < radix)
        throw RangeError('radix');
    if (this.isZero())
        return '0';
    if (this.isNegative()) { // Unsigned Longs are never negative
        if (this.eq(MIN_VALUE)) {
            // We need to change the Long value before it can be negated, so we remove
            // the bottom-most digit in this base and then recurse to do the rest.
            var radixLong = fromNumber(radix),
                div = this.div(radixLong),
                rem1 = div.mul(radixLong).sub(this);
            return div.toString(radix) + rem1.toInt().toString(radix);
        } else
            return '-' + this.neg().toString(radix);
    }

    // Do several (6) digits each time through the loop, so as to
    // minimize the calls to the very expensive emulated div.
    var radixToPower = fromNumber(pow_dbl(radix, 6), this.unsigned),
        rem = this;
    var result = '';
    while (true) {
        var remDiv = rem.div(radixToPower),
            intval = rem.sub(remDiv.mul(radixToPower)).toInt() >>> 0,
            digits = intval.toString(radix);
        rem = remDiv;
        if (rem.isZero())
            return digits + result;
        else {
            while (digits.length < 6)
                digits = '0' + digits;
            result = '' + digits + result;
        }
    }
};

/**
 * Gets the high 32 bits as a signed integer.
 * @returns {number} Signed high bits
 */
LongPrototype.getHighBits = function getHighBits() {
    return this.high;
};

/**
 * Gets the high 32 bits as an unsigned integer.
 * @returns {number} Unsigned high bits
 */
LongPrototype.getHighBitsUnsigned = function getHighBitsUnsigned() {
    return this.high >>> 0;
};

/**
 * Gets the low 32 bits as a signed integer.
 * @returns {number} Signed low bits
 */
LongPrototype.getLowBits = function getLowBits() {
    return this.low;
};

/**
 * Gets the low 32 bits as an unsigned integer.
 * @returns {number} Unsigned low bits
 */
LongPrototype.getLowBitsUnsigned = function getLowBitsUnsigned() {
    return this.low >>> 0;
};

/**
 * Gets the number of bits needed to represent the absolute value of this Long.
 * @returns {number}
 */
LongPrototype.getNumBitsAbs = function getNumBitsAbs() {
    if (this.isNegative()) // Unsigned Longs are never negative
        return this.eq(MIN_VALUE) ? 64 : this.neg().getNumBitsAbs();
    var val = this.high != 0 ? this.high : this.low;
    for (var bit = 31; bit > 0; bit--)
        if ((val & (1 << bit)) != 0)
            break;
    return this.high != 0 ? bit + 33 : bit + 1;
};

/**
 * Tests if this Long's value equals zero.
 * @returns {boolean}
 */
LongPrototype.isZero = function isZero() {
    return this.high === 0 && this.low === 0;
};

/**
 * Tests if this Long's value equals zero. This is an alias of {@link Long#isZero}.
 * @returns {boolean}
 */
LongPrototype.eqz = LongPrototype.isZero;

/**
 * Tests if this Long's value is negative.
 * @returns {boolean}
 */
LongPrototype.isNegative = function isNegative() {
    return !this.unsigned && this.high < 0;
};

/**
 * Tests if this Long's value is positive.
 * @returns {boolean}
 */
LongPrototype.isPositive = function isPositive() {
    return this.unsigned || this.high >= 0;
};

/**
 * Tests if this Long's value is odd.
 * @returns {boolean}
 */
LongPrototype.isOdd = function isOdd() {
    return (this.low & 1) === 1;
};

/**
 * Tests if this Long's value is even.
 * @returns {boolean}
 */
LongPrototype.isEven = function isEven() {
    return (this.low & 1) === 0;
};

/**
 * Tests if this Long's value equals the specified's.
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.equals = function equals(other) {
    if (!isLong(other))
        other = fromValue(other);
    if (this.unsigned !== other.unsigned && (this.high >>> 31) === 1 && (other.high >>> 31) === 1)
        return false;
    return this.high === other.high && this.low === other.low;
};

/**
 * Tests if this Long's value equals the specified's. This is an alias of {@link Long#equals}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.eq = LongPrototype.equals;

/**
 * Tests if this Long's value differs from the specified's.
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.notEquals = function notEquals(other) {
    return !this.eq(/* validates */ other);
};

/**
 * Tests if this Long's value differs from the specified's. This is an alias of {@link Long#notEquals}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.neq = LongPrototype.notEquals;

/**
 * Tests if this Long's value differs from the specified's. This is an alias of {@link Long#notEquals}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.ne = LongPrototype.notEquals;

/**
 * Tests if this Long's value is less than the specified's.
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.lessThan = function lessThan(other) {
    return this.comp(/* validates */ other) < 0;
};

/**
 * Tests if this Long's value is less than the specified's. This is an alias of {@link Long#lessThan}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.lt = LongPrototype.lessThan;

/**
 * Tests if this Long's value is less than or equal the specified's.
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.lessThanOrEqual = function lessThanOrEqual(other) {
    return this.comp(/* validates */ other) <= 0;
};

/**
 * Tests if this Long's value is less than or equal the specified's. This is an alias of {@link Long#lessThanOrEqual}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.lte = LongPrototype.lessThanOrEqual;

/**
 * Tests if this Long's value is less than or equal the specified's. This is an alias of {@link Long#lessThanOrEqual}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.le = LongPrototype.lessThanOrEqual;

/**
 * Tests if this Long's value is greater than the specified's.
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.greaterThan = function greaterThan(other) {
    return this.comp(/* validates */ other) > 0;
};

/**
 * Tests if this Long's value is greater than the specified's. This is an alias of {@link Long#greaterThan}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.gt = LongPrototype.greaterThan;

/**
 * Tests if this Long's value is greater than or equal the specified's.
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.greaterThanOrEqual = function greaterThanOrEqual(other) {
    return this.comp(/* validates */ other) >= 0;
};

/**
 * Tests if this Long's value is greater than or equal the specified's. This is an alias of {@link Long#greaterThanOrEqual}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.gte = LongPrototype.greaterThanOrEqual;

/**
 * Tests if this Long's value is greater than or equal the specified's. This is an alias of {@link Long#greaterThanOrEqual}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {boolean}
 */
LongPrototype.ge = LongPrototype.greaterThanOrEqual;

/**
 * Compares this Long's value with the specified's.
 * @param {!Long|number|string} other Other value
 * @returns {number} 0 if they are the same, 1 if the this is greater and -1
 *  if the given one is greater
 */
LongPrototype.compare = function compare(other) {
    if (!isLong(other))
        other = fromValue(other);
    if (this.eq(other))
        return 0;
    var thisNeg = this.isNegative(),
        otherNeg = other.isNegative();
    if (thisNeg && !otherNeg)
        return -1;
    if (!thisNeg && otherNeg)
        return 1;
    // At this point the sign bits are the same
    if (!this.unsigned)
        return this.sub(other).isNegative() ? -1 : 1;
    // Both are positive if at least one is unsigned
    return (other.high >>> 0) > (this.high >>> 0) || (other.high === this.high && (other.low >>> 0) > (this.low >>> 0)) ? -1 : 1;
};

/**
 * Compares this Long's value with the specified's. This is an alias of {@link Long#compare}.
 * @function
 * @param {!Long|number|string} other Other value
 * @returns {number} 0 if they are the same, 1 if the this is greater and -1
 *  if the given one is greater
 */
LongPrototype.comp = LongPrototype.compare;

/**
 * Negates this Long's value.
 * @returns {!Long} Negated Long
 */
LongPrototype.negate = function negate() {
    if (!this.unsigned && this.eq(MIN_VALUE))
        return MIN_VALUE;
    return this.not().add(ONE);
};

/**
 * Negates this Long's value. This is an alias of {@link Long#negate}.
 * @function
 * @returns {!Long} Negated Long
 */
LongPrototype.neg = LongPrototype.negate;

/**
 * Returns the sum of this and the specified Long.
 * @param {!Long|number|string} addend Addend
 * @returns {!Long} Sum
 */
LongPrototype.add = function add(addend) {
    if (!isLong(addend))
        addend = fromValue(addend);

    // Divide each number into 4 chunks of 16 bits, and then sum the chunks.

    var a48 = this.high >>> 16;
    var a32 = this.high & 0xFFFF;
    var a16 = this.low >>> 16;
    var a00 = this.low & 0xFFFF;

    var b48 = addend.high >>> 16;
    var b32 = addend.high & 0xFFFF;
    var b16 = addend.low >>> 16;
    var b00 = addend.low & 0xFFFF;

    var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
    c00 += a00 + b00;
    c16 += c00 >>> 16;
    c00 &= 0xFFFF;
    c16 += a16 + b16;
    c32 += c16 >>> 16;
    c16 &= 0xFFFF;
    c32 += a32 + b32;
    c48 += c32 >>> 16;
    c32 &= 0xFFFF;
    c48 += a48 + b48;
    c48 &= 0xFFFF;
    return fromBits((c16 << 16) | c00, (c48 << 16) | c32, this.unsigned);
};

/**
 * Returns the difference of this and the specified Long.
 * @param {!Long|number|string} subtrahend Subtrahend
 * @returns {!Long} Difference
 */
LongPrototype.subtract = function subtract(subtrahend) {
    if (!isLong(subtrahend))
        subtrahend = fromValue(subtrahend);
    return this.add(subtrahend.neg());
};

/**
 * Returns the difference of this and the specified Long. This is an alias of {@link Long#subtract}.
 * @function
 * @param {!Long|number|string} subtrahend Subtrahend
 * @returns {!Long} Difference
 */
LongPrototype.sub = LongPrototype.subtract;

/**
 * Returns the product of this and the specified Long.
 * @param {!Long|number|string} multiplier Multiplier
 * @returns {!Long} Product
 */
LongPrototype.multiply = function multiply(multiplier) {
    if (this.isZero())
        return ZERO;
    if (!isLong(multiplier))
        multiplier = fromValue(multiplier);

    // use wasm support if present
    if (wasm) {
        var low = wasm.mul(this.low,
                           this.high,
                           multiplier.low,
                           multiplier.high);
        return fromBits(low, wasm.get_high(), this.unsigned);
    }

    if (multiplier.isZero())
        return ZERO;
    if (this.eq(MIN_VALUE))
        return multiplier.isOdd() ? MIN_VALUE : ZERO;
    if (multiplier.eq(MIN_VALUE))
        return this.isOdd() ? MIN_VALUE : ZERO;

    if (this.isNegative()) {
        if (multiplier.isNegative())
            return this.neg().mul(multiplier.neg());
        else
            return this.neg().mul(multiplier).neg();
    } else if (multiplier.isNegative())
        return this.mul(multiplier.neg()).neg();

    // If both longs are small, use float multiplication
    if (this.lt(TWO_PWR_24) && multiplier.lt(TWO_PWR_24))
        return fromNumber(this.toNumber() * multiplier.toNumber(), this.unsigned);

    // Divide each long into 4 chunks of 16 bits, and then add up 4x4 products.
    // We can skip products that would overflow.

    var a48 = this.high >>> 16;
    var a32 = this.high & 0xFFFF;
    var a16 = this.low >>> 16;
    var a00 = this.low & 0xFFFF;

    var b48 = multiplier.high >>> 16;
    var b32 = multiplier.high & 0xFFFF;
    var b16 = multiplier.low >>> 16;
    var b00 = multiplier.low & 0xFFFF;

    var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
    c00 += a00 * b00;
    c16 += c00 >>> 16;
    c00 &= 0xFFFF;
    c16 += a16 * b00;
    c32 += c16 >>> 16;
    c16 &= 0xFFFF;
    c16 += a00 * b16;
    c32 += c16 >>> 16;
    c16 &= 0xFFFF;
    c32 += a32 * b00;
    c48 += c32 >>> 16;
    c32 &= 0xFFFF;
    c32 += a16 * b16;
    c48 += c32 >>> 16;
    c32 &= 0xFFFF;
    c32 += a00 * b32;
    c48 += c32 >>> 16;
    c32 &= 0xFFFF;
    c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48;
    c48 &= 0xFFFF;
    return fromBits((c16 << 16) | c00, (c48 << 16) | c32, this.unsigned);
};

/**
 * Returns the product of this and the specified Long. This is an alias of {@link Long#multiply}.
 * @function
 * @param {!Long|number|string} multiplier Multiplier
 * @returns {!Long} Product
 */
LongPrototype.mul = LongPrototype.multiply;

/**
 * Returns this Long divided by the specified. The result is signed if this Long is signed or
 *  unsigned if this Long is unsigned.
 * @param {!Long|number|string} divisor Divisor
 * @returns {!Long} Quotient
 */
LongPrototype.divide = function divide(divisor) {
    if (!isLong(divisor))
        divisor = fromValue(divisor);
    if (divisor.isZero())
        throw Error('division by zero');

    // use wasm support if present
    if (wasm) {
        // guard against signed division overflow: the largest
        // negative number / -1 would be 1 larger than the largest
        // positive number, due to two's complement.
        if (!this.unsigned &&
            this.high === -0x80000000 &&
            divisor.low === -1 && divisor.high === -1) {
            // be consistent with non-wasm code path
            return this;
        }
        var low = (this.unsigned ? wasm.div_u : wasm.div_s)(
            this.low,
            this.high,
            divisor.low,
            divisor.high
        );
        return fromBits(low, wasm.get_high(), this.unsigned);
    }

    if (this.isZero())
        return this.unsigned ? UZERO : ZERO;
    var approx, rem, res;
    if (!this.unsigned) {
        // This section is only relevant for signed longs and is derived from the
        // closure library as a whole.
        if (this.eq(MIN_VALUE)) {
            if (divisor.eq(ONE) || divisor.eq(NEG_ONE))
                return MIN_VALUE;  // recall that -MIN_VALUE == MIN_VALUE
            else if (divisor.eq(MIN_VALUE))
                return ONE;
            else {
                // At this point, we have |other| >= 2, so |this/other| < |MIN_VALUE|.
                var halfThis = this.shr(1);
                approx = halfThis.div(divisor).shl(1);
                if (approx.eq(ZERO)) {
                    return divisor.isNegative() ? ONE : NEG_ONE;
                } else {
                    rem = this.sub(divisor.mul(approx));
                    res = approx.add(rem.div(divisor));
                    return res;
                }
            }
        } else if (divisor.eq(MIN_VALUE))
            return this.unsigned ? UZERO : ZERO;
        if (this.isNegative()) {
            if (divisor.isNegative())
                return this.neg().div(divisor.neg());
            return this.neg().div(divisor).neg();
        } else if (divisor.isNegative())
            return this.div(divisor.neg()).neg();
        res = ZERO;
    } else {
        // The algorithm below has not been made for unsigned longs. It's therefore
        // required to take special care of the MSB prior to running it.
        if (!divisor.unsigned)
            divisor = divisor.toUnsigned();
        if (divisor.gt(this))
            return UZERO;
        if (divisor.gt(this.shru(1))) // 15 >>> 1 = 7 ; with divisor = 8 ; true
            return UONE;
        res = UZERO;
    }

    // Repeat the following until the remainder is less than other:  find a
    // floating-point that approximates remainder / other *from below*, add this
    // into the result, and subtract it from the remainder.  It is critical that
    // the approximate value is less than or equal to the real value so that the
    // remainder never becomes negative.
    rem = this;
    while (rem.gte(divisor)) {
        // Approximate the result of division. This may be a little greater or
        // smaller than the actual value.
        approx = Math.max(1, Math.floor(rem.toNumber() / divisor.toNumber()));

        // We will tweak the approximate result by changing it in the 48-th digit or
        // the smallest non-fractional digit, whichever is larger.
        var log2 = Math.ceil(Math.log(approx) / Math.LN2),
            delta = (log2 <= 48) ? 1 : pow_dbl(2, log2 - 48),

        // Decrease the approximation until it is smaller than the remainder.  Note
        // that if it is too large, the product overflows and is negative.
            approxRes = fromNumber(approx),
            approxRem = approxRes.mul(divisor);
        while (approxRem.isNegative() || approxRem.gt(rem)) {
            approx -= delta;
            approxRes = fromNumber(approx, this.unsigned);
            approxRem = approxRes.mul(divisor);
        }

        // We know the answer can't be zero... and actually, zero would cause
        // infinite recursion since we would make no progress.
        if (approxRes.isZero())
            approxRes = ONE;

        res = res.add(approxRes);
        rem = rem.sub(approxRem);
    }
    return res;
};

/**
 * Returns this Long divided by the specified. This is an alias of {@link Long#divide}.
 * @function
 * @param {!Long|number|string} divisor Divisor
 * @returns {!Long} Quotient
 */
LongPrototype.div = LongPrototype.divide;

/**
 * Returns this Long modulo the specified.
 * @param {!Long|number|string} divisor Divisor
 * @returns {!Long} Remainder
 */
LongPrototype.modulo = function modulo(divisor) {
    if (!isLong(divisor))
        divisor = fromValue(divisor);

    // use wasm support if present
    if (wasm) {
        var low = (this.unsigned ? wasm.rem_u : wasm.rem_s)(
            this.low,
            this.high,
            divisor.low,
            divisor.high
        );
        return fromBits(low, wasm.get_high(), this.unsigned);
    }

    return this.sub(this.div(divisor).mul(divisor));
};

/**
 * Returns this Long modulo the specified. This is an alias of {@link Long#modulo}.
 * @function
 * @param {!Long|number|string} divisor Divisor
 * @returns {!Long} Remainder
 */
LongPrototype.mod = LongPrototype.modulo;

/**
 * Returns this Long modulo the specified. This is an alias of {@link Long#modulo}.
 * @function
 * @param {!Long|number|string} divisor Divisor
 * @returns {!Long} Remainder
 */
LongPrototype.rem = LongPrototype.modulo;

/**
 * Returns the bitwise NOT of this Long.
 * @returns {!Long}
 */
LongPrototype.not = function not() {
    return fromBits(~this.low, ~this.high, this.unsigned);
};

/**
 * Returns the bitwise AND of this Long and the specified.
 * @param {!Long|number|string} other Other Long
 * @returns {!Long}
 */
LongPrototype.and = function and(other) {
    if (!isLong(other))
        other = fromValue(other);
    return fromBits(this.low & other.low, this.high & other.high, this.unsigned);
};

/**
 * Returns the bitwise OR of this Long and the specified.
 * @param {!Long|number|string} other Other Long
 * @returns {!Long}
 */
LongPrototype.or = function or(other) {
    if (!isLong(other))
        other = fromValue(other);
    return fromBits(this.low | other.low, this.high | other.high, this.unsigned);
};

/**
 * Returns the bitwise XOR of this Long and the given one.
 * @param {!Long|number|string} other Other Long
 * @returns {!Long}
 */
LongPrototype.xor = function xor(other) {
    if (!isLong(other))
        other = fromValue(other);
    return fromBits(this.low ^ other.low, this.high ^ other.high, this.unsigned);
};

/**
 * Returns this Long with bits shifted to the left by the given amount.
 * @param {number|!Long} numBits Number of bits
 * @returns {!Long} Shifted Long
 */
LongPrototype.shiftLeft = function shiftLeft(numBits) {
    if (isLong(numBits))
        numBits = numBits.toInt();
    if ((numBits &= 63) === 0)
        return this;
    else if (numBits < 32)
        return fromBits(this.low << numBits, (this.high << numBits) | (this.low >>> (32 - numBits)), this.unsigned);
    else
        return fromBits(0, this.low << (numBits - 32), this.unsigned);
};

/**
 * Returns this Long with bits shifted to the left by the given amount. This is an alias of {@link Long#shiftLeft}.
 * @function
 * @param {number|!Long} numBits Number of bits
 * @returns {!Long} Shifted Long
 */
LongPrototype.shl = LongPrototype.shiftLeft;

/**
 * Returns this Long with bits arithmetically shifted to the right by the given amount.
 * @param {number|!Long} numBits Number of bits
 * @returns {!Long} Shifted Long
 */
LongPrototype.shiftRight = function shiftRight(numBits) {
    if (isLong(numBits))
        numBits = numBits.toInt();
    if ((numBits &= 63) === 0)
        return this;
    else if (numBits < 32)
        return fromBits((this.low >>> numBits) | (this.high << (32 - numBits)), this.high >> numBits, this.unsigned);
    else
        return fromBits(this.high >> (numBits - 32), this.high >= 0 ? 0 : -1, this.unsigned);
};

/**
 * Returns this Long with bits arithmetically shifted to the right by the given amount. This is an alias of {@link Long#shiftRight}.
 * @function
 * @param {number|!Long} numBits Number of bits
 * @returns {!Long} Shifted Long
 */
LongPrototype.shr = LongPrototype.shiftRight;

/**
 * Returns this Long with bits logically shifted to the right by the given amount.
 * @param {number|!Long} numBits Number of bits
 * @returns {!Long} Shifted Long
 */
LongPrototype.shiftRightUnsigned = function shiftRightUnsigned(numBits) {
    if (isLong(numBits))
        numBits = numBits.toInt();
    numBits &= 63;
    if (numBits === 0)
        return this;
    else {
        var high = this.high;
        if (numBits < 32) {
            var low = this.low;
            return fromBits((low >>> numBits) | (high << (32 - numBits)), high >>> numBits, this.unsigned);
        } else if (numBits === 32)
            return fromBits(high, 0, this.unsigned);
        else
            return fromBits(high >>> (numBits - 32), 0, this.unsigned);
    }
};

/**
 * Returns this Long with bits logically shifted to the right by the given amount. This is an alias of {@link Long#shiftRightUnsigned}.
 * @function
 * @param {number|!Long} numBits Number of bits
 * @returns {!Long} Shifted Long
 */
LongPrototype.shru = LongPrototype.shiftRightUnsigned;

/**
 * Returns this Long with bits logically shifted to the right by the given amount. This is an alias of {@link Long#shiftRightUnsigned}.
 * @function
 * @param {number|!Long} numBits Number of bits
 * @returns {!Long} Shifted Long
 */
LongPrototype.shr_u = LongPrototype.shiftRightUnsigned;

/**
 * Converts this Long to signed.
 * @returns {!Long} Signed long
 */
LongPrototype.toSigned = function toSigned() {
    if (!this.unsigned)
        return this;
    return fromBits(this.low, this.high, false);
};

/**
 * Converts this Long to unsigned.
 * @returns {!Long} Unsigned long
 */
LongPrototype.toUnsigned = function toUnsigned() {
    if (this.unsigned)
        return this;
    return fromBits(this.low, this.high, true);
};

/**
 * Converts this Long to its byte representation.
 * @param {boolean=} le Whether little or big endian, defaults to big endian
 * @returns {!Array.<number>} Byte representation
 */
LongPrototype.toBytes = function toBytes(le) {
    return le ? this.toBytesLE() : this.toBytesBE();
};

/**
 * Converts this Long to its little endian byte representation.
 * @returns {!Array.<number>} Little endian byte representation
 */
LongPrototype.toBytesLE = function toBytesLE() {
    var hi = this.high,
        lo = this.low;
    return [
        lo        & 0xff,
        lo >>>  8 & 0xff,
        lo >>> 16 & 0xff,
        lo >>> 24       ,
        hi        & 0xff,
        hi >>>  8 & 0xff,
        hi >>> 16 & 0xff,
        hi >>> 24
    ];
};

/**
 * Converts this Long to its big endian byte representation.
 * @returns {!Array.<number>} Big endian byte representation
 */
LongPrototype.toBytesBE = function toBytesBE() {
    var hi = this.high,
        lo = this.low;
    return [
        hi >>> 24       ,
        hi >>> 16 & 0xff,
        hi >>>  8 & 0xff,
        hi        & 0xff,
        lo >>> 24       ,
        lo >>> 16 & 0xff,
        lo >>>  8 & 0xff,
        lo        & 0xff
    ];
};

/**
 * Creates a Long from its byte representation.
 * @param {!Array.<number>} bytes Byte representation
 * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
 * @param {boolean=} le Whether little or big endian, defaults to big endian
 * @returns {Long} The corresponding Long value
 */
Long.fromBytes = function fromBytes(bytes, unsigned, le) {
    return le ? Long.fromBytesLE(bytes, unsigned) : Long.fromBytesBE(bytes, unsigned);
};

/**
 * Creates a Long from its little endian byte representation.
 * @param {!Array.<number>} bytes Little endian byte representation
 * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
 * @returns {Long} The corresponding Long value
 */
Long.fromBytesLE = function fromBytesLE(bytes, unsigned) {
    return new Long(
        bytes[0]       |
        bytes[1] <<  8 |
        bytes[2] << 16 |
        bytes[3] << 24,
        bytes[4]       |
        bytes[5] <<  8 |
        bytes[6] << 16 |
        bytes[7] << 24,
        unsigned
    );
};

/**
 * Creates a Long from its big endian byte representation.
 * @param {!Array.<number>} bytes Big endian byte representation
 * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
 * @returns {Long} The corresponding Long value
 */
Long.fromBytesBE = function fromBytesBE(bytes, unsigned) {
    return new Long(
        bytes[4] << 24 |
        bytes[5] << 16 |
        bytes[6] <<  8 |
        bytes[7],
        bytes[0] << 24 |
        bytes[1] << 16 |
        bytes[2] <<  8 |
        bytes[3],
        unsigned
    );
};


/***/ }),

/***/ "./src/base.ts":
/*!*********************!*\
  !*** ./src/base.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

exports.__esModule = true;
exports.EmerisMessageMapper = void 0;
var EmerisMessageMapper = /** @class */ (function () {
    function EmerisMessageMapper(chain_id) {
        this.chain_id = undefined;
        this.chain_id = chain_id;
    }
    EmerisMessageMapper.prototype.map = function (transaction, signing_address) {
        // @ts-expect-error
        return this[transaction.type](transaction.data, signing_address);
    };
    EmerisMessageMapper.prototype.transfer = function (transaction, signing_address) {
        throw new Error("This method is not implemented for " + this.chain_id);
    };
    EmerisMessageMapper.prototype.ibcTransfer = function (transaction, signing_address) {
        throw new Error("This method is not implemented for " + this.chain_id);
    };
    EmerisMessageMapper.prototype.swap = function (transaction, signing_address) {
        throw new Error("This method is not implemented for " + this.chain_id);
    };
    EmerisMessageMapper.prototype.addliquidity = function (transaction, signing_address) {
        throw new Error("This method is not implemented for " + this.chain_id);
    };
    EmerisMessageMapper.prototype.withdrawliquidity = function (transaction, signing_address) {
        throw new Error("This method is not implemented for " + this.chain_id);
    };
    EmerisMessageMapper.prototype.createpool = function (transaction, signing_address) {
        throw new Error("This method is not implemented for " + this.chain_id);
    };
    return EmerisMessageMapper;
}());
exports.EmerisMessageMapper = EmerisMessageMapper;


/***/ }),

/***/ "./src/cosmos_amino.ts":
/*!*****************************!*\
  !*** ./src/cosmos_amino.ts ***!
  \*****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var base_1 = __webpack_require__(/*! ./base */ "./src/base.ts");
var Long = __webpack_require__(/*! long */ "./node_modules/long/src/long.js");
var CosmosAminoMessageMapper = /** @class */ (function (_super) {
    __extends(CosmosAminoMessageMapper, _super);
    function CosmosAminoMessageMapper() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CosmosAminoMessageMapper.prototype.transfer = function (transaction, signing_address) {
        return [{
                type: "cosmos-sdk/MsgSend",
                value: {
                    amount: [transaction.amount],
                    to_address: transaction.to_address,
                    from_address: signing_address,
                },
            }];
    };
    CosmosAminoMessageMapper.prototype.ibcTransfer = function (transaction, signing_address) {
        return [{
                type: "cosmos-sdk/MsgTransfer",
                value: {
                    source_port: 'transfer',
                    source_channel: transaction.through,
                    sender: signing_address,
                    receiver: transaction.to_address,
                    timeout_timestamp: Long.fromString(new Date().getTime() + 300000 + '000000'),
                    //timeoutHeight: { revisionHeight: "10000000000",revisionNumber:"0"},
                    token: __assign({}, transaction.amount),
                }
            }];
    };
    CosmosAminoMessageMapper.prototype.swap = function (transaction, signing_address) {
        var isReverse = false;
        if (transaction.from.denom !== transaction.pool.reserve_coin_denoms[0]) {
            isReverse = true;
        }
        var price = [transaction.from, transaction.to].sort(function (a, b) {
            if (a.denom < b.denom)
                return -1;
            if (a.denom > b.denom)
                return 1;
            return 0;
        });
        return [{
                type: "liquidity/MsgSwapWithinBatch",
                value: {
                    swap_requester_address: signing_address,
                    pool_id: parseInt(transaction.pool.id),
                    swap_type_id: transaction.pool.type_id,
                    offer_coin: { amount: transaction.from.amount, denom: transaction.from.denom },
                    demand_coin_denom: transaction.to.denom,
                    offer_coin_dee: transaction.offerFee,
                    order_price: transaction.orderPrice
                }
            }];
    };
    CosmosAminoMessageMapper.prototype.addliquidity = function (transaction, signing_address) {
        var depositCoins;
        if (transaction.coinA.denom > transaction.coinB.denom) {
            depositCoins = [transaction.coinB, transaction.coinA];
        }
        else {
            depositCoins = [transaction.coinA, transaction.coinB];
        }
        return [{
                type: 'liquidity/MsgDepositWithinBatch',
                value: {
                    depositor_address: signing_address,
                    pool_id: transaction.pool.id,
                    deposit_coins: depositCoins
                }
            }];
    };
    CosmosAminoMessageMapper.prototype.withdrawliquidity = function (transaction, signing_address) {
        return [{
                type: 'liquidity/MsgWithdrawWithinBatch',
                value: {
                    withdrawer_address: signing_address,
                    pool_id: transaction.pool.id,
                    pool_coin: __assign({}, transaction.poolCoin),
                },
            }];
    };
    CosmosAminoMessageMapper.prototype.createpool = function (transaction, signing_address) {
        var depositCoins;
        if (transaction.coinA.denom > transaction.coinB.denom) {
            depositCoins = [transaction.coinB, transaction.coinA];
        }
        else {
            depositCoins = [transaction.coinA, transaction.coinB];
        }
        return [{
                type: 'liquidity/MsgCreatePool',
                value: {
                    pool_creator_address: signing_address,
                    pool_type_id: 1,
                    deposit_coins: depositCoins,
                },
            }];
    };
    return CosmosAminoMessageMapper;
}(base_1.EmerisMessageMapper));
exports["default"] = CosmosAminoMessageMapper;


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((module, exports, __webpack_require__) => {

"use strict";

exports.__esModule = true;
var cosmos_amino_1 = __webpack_require__(/*! ./cosmos_amino */ "./src/cosmos_amino.ts");
var emerisMapper = {
    CosmosAminoMessageMapper: cosmos_amino_1["default"]
};
module.exports = emerisMapper;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxTQUFTO0FBQ3BCLGFBQWE7QUFDYjtBQUNBLFlBQVksWUFBWTtBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QjtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLFNBQVM7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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Q2I7QUFDQTtBQUNBLENBQUM7QUFDRCxrQkFBa0I7Ozs7Ozs7Ozs7OztBQ2xJTDtBQUNiLGtCQUFrQjtBQUNsQixxQkFBcUIsbUJBQU8sQ0FBQyw2Q0FBZ0I7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7VUNOQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7O1VFdEJBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vQGVtZXJpcy9tYXBwZXIvLi9ub2RlX21vZHVsZXMvbG9uZy9zcmMvbG9uZy5qcyIsIndlYnBhY2s6Ly9AZW1lcmlzL21hcHBlci8uL3NyYy9iYXNlLnRzIiwid2VicGFjazovL0BlbWVyaXMvbWFwcGVyLy4vc3JjL2Nvc21vc19hbWluby50cyIsIndlYnBhY2s6Ly9AZW1lcmlzL21hcHBlci8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly9AZW1lcmlzL21hcHBlci93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9AZW1lcmlzL21hcHBlci93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL0BlbWVyaXMvbWFwcGVyL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9AZW1lcmlzL21hcHBlci93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBMb25nO1xyXG5cclxuLyoqXHJcbiAqIHdhc20gb3B0aW1pemF0aW9ucywgdG8gZG8gbmF0aXZlIGk2NCBtdWx0aXBsaWNhdGlvbiBhbmQgZGl2aWRlXHJcbiAqL1xyXG52YXIgd2FzbSA9IG51bGw7XHJcblxyXG50cnkge1xyXG4gIHdhc20gPSBuZXcgV2ViQXNzZW1ibHkuSW5zdGFuY2UobmV3IFdlYkFzc2VtYmx5Lk1vZHVsZShuZXcgVWludDhBcnJheShbXHJcbiAgICAwLCA5NywgMTE1LCAxMDksIDEsIDAsIDAsIDAsIDEsIDEzLCAyLCA5NiwgMCwgMSwgMTI3LCA5NiwgNCwgMTI3LCAxMjcsIDEyNywgMTI3LCAxLCAxMjcsIDMsIDcsIDYsIDAsIDEsIDEsIDEsIDEsIDEsIDYsIDYsIDEsIDEyNywgMSwgNjUsIDAsIDExLCA3LCA1MCwgNiwgMywgMTA5LCAxMTcsIDEwOCwgMCwgMSwgNSwgMTAwLCAxMDUsIDExOCwgOTUsIDExNSwgMCwgMiwgNSwgMTAwLCAxMDUsIDExOCwgOTUsIDExNywgMCwgMywgNSwgMTE0LCAxMDEsIDEwOSwgOTUsIDExNSwgMCwgNCwgNSwgMTE0LCAxMDEsIDEwOSwgOTUsIDExNywgMCwgNSwgOCwgMTAzLCAxMDEsIDExNiwgOTUsIDEwNCwgMTA1LCAxMDMsIDEwNCwgMCwgMCwgMTAsIDE5MSwgMSwgNiwgNCwgMCwgMzUsIDAsIDExLCAzNiwgMSwgMSwgMTI2LCAzMiwgMCwgMTczLCAzMiwgMSwgMTczLCA2NiwgMzIsIDEzNCwgMTMyLCAzMiwgMiwgMTczLCAzMiwgMywgMTczLCA2NiwgMzIsIDEzNCwgMTMyLCAxMjYsIDM0LCA0LCA2NiwgMzIsIDEzNSwgMTY3LCAzNiwgMCwgMzIsIDQsIDE2NywgMTEsIDM2LCAxLCAxLCAxMjYsIDMyLCAwLCAxNzMsIDMyLCAxLCAxNzMsIDY2LCAzMiwgMTM0LCAxMzIsIDMyLCAyLCAxNzMsIDMyLCAzLCAxNzMsIDY2LCAzMiwgMTM0LCAxMzIsIDEyNywgMzQsIDQsIDY2LCAzMiwgMTM1LCAxNjcsIDM2LCAwLCAzMiwgNCwgMTY3LCAxMSwgMzYsIDEsIDEsIDEyNiwgMzIsIDAsIDE3MywgMzIsIDEsIDE3MywgNjYsIDMyLCAxMzQsIDEzMiwgMzIsIDIsIDE3MywgMzIsIDMsIDE3MywgNjYsIDMyLCAxMzQsIDEzMiwgMTI4LCAzNCwgNCwgNjYsIDMyLCAxMzUsIDE2NywgMzYsIDAsIDMyLCA0LCAxNjcsIDExLCAzNiwgMSwgMSwgMTI2LCAzMiwgMCwgMTczLCAzMiwgMSwgMTczLCA2NiwgMzIsIDEzNCwgMTMyLCAzMiwgMiwgMTczLCAzMiwgMywgMTczLCA2NiwgMzIsIDEzNCwgMTMyLCAxMjksIDM0LCA0LCA2NiwgMzIsIDEzNSwgMTY3LCAzNiwgMCwgMzIsIDQsIDE2NywgMTEsIDM2LCAxLCAxLCAxMjYsIDMyLCAwLCAxNzMsIDMyLCAxLCAxNzMsIDY2LCAzMiwgMTM0LCAxMzIsIDMyLCAyLCAxNzMsIDMyLCAzLCAxNzMsIDY2LCAzMiwgMTM0LCAxMzIsIDEzMCwgMzQsIDQsIDY2LCAzMiwgMTM1LCAxNjcsIDM2LCAwLCAzMiwgNCwgMTY3LCAxMVxyXG4gIF0pKSwge30pLmV4cG9ydHM7XHJcbn0gY2F0Y2ggKGUpIHtcclxuICAvLyBubyB3YXNtIHN1cHBvcnQgOihcclxufVxyXG5cclxuLyoqXHJcbiAqIENvbnN0cnVjdHMgYSA2NCBiaXQgdHdvJ3MtY29tcGxlbWVudCBpbnRlZ2VyLCBnaXZlbiBpdHMgbG93IGFuZCBoaWdoIDMyIGJpdCB2YWx1ZXMgYXMgKnNpZ25lZCogaW50ZWdlcnMuXHJcbiAqICBTZWUgdGhlIGZyb20qIGZ1bmN0aW9ucyBiZWxvdyBmb3IgbW9yZSBjb252ZW5pZW50IHdheXMgb2YgY29uc3RydWN0aW5nIExvbmdzLlxyXG4gKiBAZXhwb3J0cyBMb25nXHJcbiAqIEBjbGFzcyBBIExvbmcgY2xhc3MgZm9yIHJlcHJlc2VudGluZyBhIDY0IGJpdCB0d28ncy1jb21wbGVtZW50IGludGVnZXIgdmFsdWUuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBsb3cgVGhlIGxvdyAoc2lnbmVkKSAzMiBiaXRzIG9mIHRoZSBsb25nXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBoaWdoIFRoZSBoaWdoIChzaWduZWQpIDMyIGJpdHMgb2YgdGhlIGxvbmdcclxuICogQHBhcmFtIHtib29sZWFuPX0gdW5zaWduZWQgV2hldGhlciB1bnNpZ25lZCBvciBub3QsIGRlZmF1bHRzIHRvIHNpZ25lZFxyXG4gKiBAY29uc3RydWN0b3JcclxuICovXHJcbmZ1bmN0aW9uIExvbmcobG93LCBoaWdoLCB1bnNpZ25lZCkge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGhlIGxvdyAzMiBiaXRzIGFzIGEgc2lnbmVkIHZhbHVlLlxyXG4gICAgICogQHR5cGUge251bWJlcn1cclxuICAgICAqL1xyXG4gICAgdGhpcy5sb3cgPSBsb3cgfCAwO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGhlIGhpZ2ggMzIgYml0cyBhcyBhIHNpZ25lZCB2YWx1ZS5cclxuICAgICAqIEB0eXBlIHtudW1iZXJ9XHJcbiAgICAgKi9cclxuICAgIHRoaXMuaGlnaCA9IGhpZ2ggfCAwO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogV2hldGhlciB1bnNpZ25lZCBvciBub3QuXHJcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cclxuICAgICAqL1xyXG4gICAgdGhpcy51bnNpZ25lZCA9ICEhdW5zaWduZWQ7XHJcbn1cclxuXHJcbi8vIFRoZSBpbnRlcm5hbCByZXByZXNlbnRhdGlvbiBvZiBhIGxvbmcgaXMgdGhlIHR3byBnaXZlbiBzaWduZWQsIDMyLWJpdCB2YWx1ZXMuXHJcbi8vIFdlIHVzZSAzMi1iaXQgcGllY2VzIGJlY2F1c2UgdGhlc2UgYXJlIHRoZSBzaXplIG9mIGludGVnZXJzIG9uIHdoaWNoXHJcbi8vIEphdmFzY3JpcHQgcGVyZm9ybXMgYml0LW9wZXJhdGlvbnMuICBGb3Igb3BlcmF0aW9ucyBsaWtlIGFkZGl0aW9uIGFuZFxyXG4vLyBtdWx0aXBsaWNhdGlvbiwgd2Ugc3BsaXQgZWFjaCBudW1iZXIgaW50byAxNiBiaXQgcGllY2VzLCB3aGljaCBjYW4gZWFzaWx5IGJlXHJcbi8vIG11bHRpcGxpZWQgd2l0aGluIEphdmFzY3JpcHQncyBmbG9hdGluZy1wb2ludCByZXByZXNlbnRhdGlvbiB3aXRob3V0IG92ZXJmbG93XHJcbi8vIG9yIGNoYW5nZSBpbiBzaWduLlxyXG4vL1xyXG4vLyBJbiB0aGUgYWxnb3JpdGhtcyBiZWxvdywgd2UgZnJlcXVlbnRseSByZWR1Y2UgdGhlIG5lZ2F0aXZlIGNhc2UgdG8gdGhlXHJcbi8vIHBvc2l0aXZlIGNhc2UgYnkgbmVnYXRpbmcgdGhlIGlucHV0KHMpIGFuZCB0aGVuIHBvc3QtcHJvY2Vzc2luZyB0aGUgcmVzdWx0LlxyXG4vLyBOb3RlIHRoYXQgd2UgbXVzdCBBTFdBWVMgY2hlY2sgc3BlY2lhbGx5IHdoZXRoZXIgdGhvc2UgdmFsdWVzIGFyZSBNSU5fVkFMVUVcclxuLy8gKC0yXjYzKSBiZWNhdXNlIC1NSU5fVkFMVUUgPT0gTUlOX1ZBTFVFIChzaW5jZSAyXjYzIGNhbm5vdCBiZSByZXByZXNlbnRlZCBhc1xyXG4vLyBhIHBvc2l0aXZlIG51bWJlciwgaXQgb3ZlcmZsb3dzIGJhY2sgaW50byBhIG5lZ2F0aXZlKS4gIE5vdCBoYW5kbGluZyB0aGlzXHJcbi8vIGNhc2Ugd291bGQgb2Z0ZW4gcmVzdWx0IGluIGluZmluaXRlIHJlY3Vyc2lvbi5cclxuLy9cclxuLy8gQ29tbW9uIGNvbnN0YW50IHZhbHVlcyBaRVJPLCBPTkUsIE5FR19PTkUsIGV0Yy4gYXJlIGRlZmluZWQgYmVsb3cgdGhlIGZyb20qXHJcbi8vIG1ldGhvZHMgb24gd2hpY2ggdGhleSBkZXBlbmQuXHJcblxyXG4vKipcclxuICogQW4gaW5kaWNhdG9yIHVzZWQgdG8gcmVsaWFibHkgZGV0ZXJtaW5lIGlmIGFuIG9iamVjdCBpcyBhIExvbmcgb3Igbm90LlxyXG4gKiBAdHlwZSB7Ym9vbGVhbn1cclxuICogQGNvbnN0XHJcbiAqIEBwcml2YXRlXHJcbiAqL1xyXG5Mb25nLnByb3RvdHlwZS5fX2lzTG9uZ19fO1xyXG5cclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KExvbmcucHJvdG90eXBlLCBcIl9faXNMb25nX19cIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQHBhcmFtIHsqfSBvYmogT2JqZWN0XHJcbiAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gKiBAaW5uZXJcclxuICovXHJcbmZ1bmN0aW9uIGlzTG9uZyhvYmopIHtcclxuICAgIHJldHVybiAob2JqICYmIG9ialtcIl9faXNMb25nX19cIl0pID09PSB0cnVlO1xyXG59XHJcblxyXG4vKipcclxuICogVGVzdHMgaWYgdGhlIHNwZWNpZmllZCBvYmplY3QgaXMgYSBMb25nLlxyXG4gKiBAZnVuY3Rpb25cclxuICogQHBhcmFtIHsqfSBvYmogT2JqZWN0XHJcbiAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gKi9cclxuTG9uZy5pc0xvbmcgPSBpc0xvbmc7XHJcblxyXG4vKipcclxuICogQSBjYWNoZSBvZiB0aGUgTG9uZyByZXByZXNlbnRhdGlvbnMgb2Ygc21hbGwgaW50ZWdlciB2YWx1ZXMuXHJcbiAqIEB0eXBlIHshT2JqZWN0fVxyXG4gKiBAaW5uZXJcclxuICovXHJcbnZhciBJTlRfQ0FDSEUgPSB7fTtcclxuXHJcbi8qKlxyXG4gKiBBIGNhY2hlIG9mIHRoZSBMb25nIHJlcHJlc2VudGF0aW9ucyBvZiBzbWFsbCB1bnNpZ25lZCBpbnRlZ2VyIHZhbHVlcy5cclxuICogQHR5cGUgeyFPYmplY3R9XHJcbiAqIEBpbm5lclxyXG4gKi9cclxudmFyIFVJTlRfQ0FDSEUgPSB7fTtcclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0ge251bWJlcn0gdmFsdWVcclxuICogQHBhcmFtIHtib29sZWFuPX0gdW5zaWduZWRcclxuICogQHJldHVybnMgeyFMb25nfVxyXG4gKiBAaW5uZXJcclxuICovXHJcbmZ1bmN0aW9uIGZyb21JbnQodmFsdWUsIHVuc2lnbmVkKSB7XHJcbiAgICB2YXIgb2JqLCBjYWNoZWRPYmosIGNhY2hlO1xyXG4gICAgaWYgKHVuc2lnbmVkKSB7XHJcbiAgICAgICAgdmFsdWUgPj4+PSAwO1xyXG4gICAgICAgIGlmIChjYWNoZSA9ICgwIDw9IHZhbHVlICYmIHZhbHVlIDwgMjU2KSkge1xyXG4gICAgICAgICAgICBjYWNoZWRPYmogPSBVSU5UX0NBQ0hFW3ZhbHVlXTtcclxuICAgICAgICAgICAgaWYgKGNhY2hlZE9iailcclxuICAgICAgICAgICAgICAgIHJldHVybiBjYWNoZWRPYmo7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG9iaiA9IGZyb21CaXRzKHZhbHVlLCAodmFsdWUgfCAwKSA8IDAgPyAtMSA6IDAsIHRydWUpO1xyXG4gICAgICAgIGlmIChjYWNoZSlcclxuICAgICAgICAgICAgVUlOVF9DQUNIRVt2YWx1ZV0gPSBvYmo7XHJcbiAgICAgICAgcmV0dXJuIG9iajtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdmFsdWUgfD0gMDtcclxuICAgICAgICBpZiAoY2FjaGUgPSAoLTEyOCA8PSB2YWx1ZSAmJiB2YWx1ZSA8IDEyOCkpIHtcclxuICAgICAgICAgICAgY2FjaGVkT2JqID0gSU5UX0NBQ0hFW3ZhbHVlXTtcclxuICAgICAgICAgICAgaWYgKGNhY2hlZE9iailcclxuICAgICAgICAgICAgICAgIHJldHVybiBjYWNoZWRPYmo7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG9iaiA9IGZyb21CaXRzKHZhbHVlLCB2YWx1ZSA8IDAgPyAtMSA6IDAsIGZhbHNlKTtcclxuICAgICAgICBpZiAoY2FjaGUpXHJcbiAgICAgICAgICAgIElOVF9DQUNIRVt2YWx1ZV0gPSBvYmo7XHJcbiAgICAgICAgcmV0dXJuIG9iajtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIFJldHVybnMgYSBMb25nIHJlcHJlc2VudGluZyB0aGUgZ2l2ZW4gMzIgYml0IGludGVnZXIgdmFsdWUuXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAcGFyYW0ge251bWJlcn0gdmFsdWUgVGhlIDMyIGJpdCBpbnRlZ2VyIGluIHF1ZXN0aW9uXHJcbiAqIEBwYXJhbSB7Ym9vbGVhbj19IHVuc2lnbmVkIFdoZXRoZXIgdW5zaWduZWQgb3Igbm90LCBkZWZhdWx0cyB0byBzaWduZWRcclxuICogQHJldHVybnMgeyFMb25nfSBUaGUgY29ycmVzcG9uZGluZyBMb25nIHZhbHVlXHJcbiAqL1xyXG5Mb25nLmZyb21JbnQgPSBmcm9tSW50O1xyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB2YWx1ZVxyXG4gKiBAcGFyYW0ge2Jvb2xlYW49fSB1bnNpZ25lZFxyXG4gKiBAcmV0dXJucyB7IUxvbmd9XHJcbiAqIEBpbm5lclxyXG4gKi9cclxuZnVuY3Rpb24gZnJvbU51bWJlcih2YWx1ZSwgdW5zaWduZWQpIHtcclxuICAgIGlmIChpc05hTih2YWx1ZSkpXHJcbiAgICAgICAgcmV0dXJuIHVuc2lnbmVkID8gVVpFUk8gOiBaRVJPO1xyXG4gICAgaWYgKHVuc2lnbmVkKSB7XHJcbiAgICAgICAgaWYgKHZhbHVlIDwgMClcclxuICAgICAgICAgICAgcmV0dXJuIFVaRVJPO1xyXG4gICAgICAgIGlmICh2YWx1ZSA+PSBUV09fUFdSXzY0X0RCTClcclxuICAgICAgICAgICAgcmV0dXJuIE1BWF9VTlNJR05FRF9WQUxVRTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHZhbHVlIDw9IC1UV09fUFdSXzYzX0RCTClcclxuICAgICAgICAgICAgcmV0dXJuIE1JTl9WQUxVRTtcclxuICAgICAgICBpZiAodmFsdWUgKyAxID49IFRXT19QV1JfNjNfREJMKVxyXG4gICAgICAgICAgICByZXR1cm4gTUFYX1ZBTFVFO1xyXG4gICAgfVxyXG4gICAgaWYgKHZhbHVlIDwgMClcclxuICAgICAgICByZXR1cm4gZnJvbU51bWJlcigtdmFsdWUsIHVuc2lnbmVkKS5uZWcoKTtcclxuICAgIHJldHVybiBmcm9tQml0cygodmFsdWUgJSBUV09fUFdSXzMyX0RCTCkgfCAwLCAodmFsdWUgLyBUV09fUFdSXzMyX0RCTCkgfCAwLCB1bnNpZ25lZCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZXR1cm5zIGEgTG9uZyByZXByZXNlbnRpbmcgdGhlIGdpdmVuIHZhbHVlLCBwcm92aWRlZCB0aGF0IGl0IGlzIGEgZmluaXRlIG51bWJlci4gT3RoZXJ3aXNlLCB6ZXJvIGlzIHJldHVybmVkLlxyXG4gKiBAZnVuY3Rpb25cclxuICogQHBhcmFtIHtudW1iZXJ9IHZhbHVlIFRoZSBudW1iZXIgaW4gcXVlc3Rpb25cclxuICogQHBhcmFtIHtib29sZWFuPX0gdW5zaWduZWQgV2hldGhlciB1bnNpZ25lZCBvciBub3QsIGRlZmF1bHRzIHRvIHNpZ25lZFxyXG4gKiBAcmV0dXJucyB7IUxvbmd9IFRoZSBjb3JyZXNwb25kaW5nIExvbmcgdmFsdWVcclxuICovXHJcbkxvbmcuZnJvbU51bWJlciA9IGZyb21OdW1iZXI7XHJcblxyXG4vKipcclxuICogQHBhcmFtIHtudW1iZXJ9IGxvd0JpdHNcclxuICogQHBhcmFtIHtudW1iZXJ9IGhpZ2hCaXRzXHJcbiAqIEBwYXJhbSB7Ym9vbGVhbj19IHVuc2lnbmVkXHJcbiAqIEByZXR1cm5zIHshTG9uZ31cclxuICogQGlubmVyXHJcbiAqL1xyXG5mdW5jdGlvbiBmcm9tQml0cyhsb3dCaXRzLCBoaWdoQml0cywgdW5zaWduZWQpIHtcclxuICAgIHJldHVybiBuZXcgTG9uZyhsb3dCaXRzLCBoaWdoQml0cywgdW5zaWduZWQpO1xyXG59XHJcblxyXG4vKipcclxuICogUmV0dXJucyBhIExvbmcgcmVwcmVzZW50aW5nIHRoZSA2NCBiaXQgaW50ZWdlciB0aGF0IGNvbWVzIGJ5IGNvbmNhdGVuYXRpbmcgdGhlIGdpdmVuIGxvdyBhbmQgaGlnaCBiaXRzLiBFYWNoIGlzXHJcbiAqICBhc3N1bWVkIHRvIHVzZSAzMiBiaXRzLlxyXG4gKiBAZnVuY3Rpb25cclxuICogQHBhcmFtIHtudW1iZXJ9IGxvd0JpdHMgVGhlIGxvdyAzMiBiaXRzXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBoaWdoQml0cyBUaGUgaGlnaCAzMiBiaXRzXHJcbiAqIEBwYXJhbSB7Ym9vbGVhbj19IHVuc2lnbmVkIFdoZXRoZXIgdW5zaWduZWQgb3Igbm90LCBkZWZhdWx0cyB0byBzaWduZWRcclxuICogQHJldHVybnMgeyFMb25nfSBUaGUgY29ycmVzcG9uZGluZyBMb25nIHZhbHVlXHJcbiAqL1xyXG5Mb25nLmZyb21CaXRzID0gZnJvbUJpdHM7XHJcblxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBiYXNlXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBleHBvbmVudFxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfVxyXG4gKiBAaW5uZXJcclxuICovXHJcbnZhciBwb3dfZGJsID0gTWF0aC5wb3c7IC8vIFVzZWQgNCB0aW1lcyAoNCo4IHRvIDE1KzQpXHJcblxyXG4vKipcclxuICogQHBhcmFtIHtzdHJpbmd9IHN0clxyXG4gKiBAcGFyYW0geyhib29sZWFufG51bWJlcik9fSB1bnNpZ25lZFxyXG4gKiBAcGFyYW0ge251bWJlcj19IHJhZGl4XHJcbiAqIEByZXR1cm5zIHshTG9uZ31cclxuICogQGlubmVyXHJcbiAqL1xyXG5mdW5jdGlvbiBmcm9tU3RyaW5nKHN0ciwgdW5zaWduZWQsIHJhZGl4KSB7XHJcbiAgICBpZiAoc3RyLmxlbmd0aCA9PT0gMClcclxuICAgICAgICB0aHJvdyBFcnJvcignZW1wdHkgc3RyaW5nJyk7XHJcbiAgICBpZiAoc3RyID09PSBcIk5hTlwiIHx8IHN0ciA9PT0gXCJJbmZpbml0eVwiIHx8IHN0ciA9PT0gXCIrSW5maW5pdHlcIiB8fCBzdHIgPT09IFwiLUluZmluaXR5XCIpXHJcbiAgICAgICAgcmV0dXJuIFpFUk87XHJcbiAgICBpZiAodHlwZW9mIHVuc2lnbmVkID09PSAnbnVtYmVyJykge1xyXG4gICAgICAgIC8vIEZvciBnb29nLm1hdGgubG9uZyBjb21wYXRpYmlsaXR5XHJcbiAgICAgICAgcmFkaXggPSB1bnNpZ25lZCxcclxuICAgICAgICB1bnNpZ25lZCA9IGZhbHNlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB1bnNpZ25lZCA9ICEhIHVuc2lnbmVkO1xyXG4gICAgfVxyXG4gICAgcmFkaXggPSByYWRpeCB8fCAxMDtcclxuICAgIGlmIChyYWRpeCA8IDIgfHwgMzYgPCByYWRpeClcclxuICAgICAgICB0aHJvdyBSYW5nZUVycm9yKCdyYWRpeCcpO1xyXG5cclxuICAgIHZhciBwO1xyXG4gICAgaWYgKChwID0gc3RyLmluZGV4T2YoJy0nKSkgPiAwKVxyXG4gICAgICAgIHRocm93IEVycm9yKCdpbnRlcmlvciBoeXBoZW4nKTtcclxuICAgIGVsc2UgaWYgKHAgPT09IDApIHtcclxuICAgICAgICByZXR1cm4gZnJvbVN0cmluZyhzdHIuc3Vic3RyaW5nKDEpLCB1bnNpZ25lZCwgcmFkaXgpLm5lZygpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIERvIHNldmVyYWwgKDgpIGRpZ2l0cyBlYWNoIHRpbWUgdGhyb3VnaCB0aGUgbG9vcCwgc28gYXMgdG9cclxuICAgIC8vIG1pbmltaXplIHRoZSBjYWxscyB0byB0aGUgdmVyeSBleHBlbnNpdmUgZW11bGF0ZWQgZGl2LlxyXG4gICAgdmFyIHJhZGl4VG9Qb3dlciA9IGZyb21OdW1iZXIocG93X2RibChyYWRpeCwgOCkpO1xyXG5cclxuICAgIHZhciByZXN1bHQgPSBaRVJPO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpICs9IDgpIHtcclxuICAgICAgICB2YXIgc2l6ZSA9IE1hdGgubWluKDgsIHN0ci5sZW5ndGggLSBpKSxcclxuICAgICAgICAgICAgdmFsdWUgPSBwYXJzZUludChzdHIuc3Vic3RyaW5nKGksIGkgKyBzaXplKSwgcmFkaXgpO1xyXG4gICAgICAgIGlmIChzaXplIDwgOCkge1xyXG4gICAgICAgICAgICB2YXIgcG93ZXIgPSBmcm9tTnVtYmVyKHBvd19kYmwocmFkaXgsIHNpemUpKTtcclxuICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0Lm11bChwb3dlcikuYWRkKGZyb21OdW1iZXIodmFsdWUpKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXN1bHQgPSByZXN1bHQubXVsKHJhZGl4VG9Qb3dlcik7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdC5hZGQoZnJvbU51bWJlcih2YWx1ZSkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJlc3VsdC51bnNpZ25lZCA9IHVuc2lnbmVkO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuLyoqXHJcbiAqIFJldHVybnMgYSBMb25nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBnaXZlbiBzdHJpbmcsIHdyaXR0ZW4gdXNpbmcgdGhlIHNwZWNpZmllZCByYWRpeC5cclxuICogQGZ1bmN0aW9uXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHIgVGhlIHRleHR1YWwgcmVwcmVzZW50YXRpb24gb2YgdGhlIExvbmdcclxuICogQHBhcmFtIHsoYm9vbGVhbnxudW1iZXIpPX0gdW5zaWduZWQgV2hldGhlciB1bnNpZ25lZCBvciBub3QsIGRlZmF1bHRzIHRvIHNpZ25lZFxyXG4gKiBAcGFyYW0ge251bWJlcj19IHJhZGl4IFRoZSByYWRpeCBpbiB3aGljaCB0aGUgdGV4dCBpcyB3cml0dGVuICgyLTM2KSwgZGVmYXVsdHMgdG8gMTBcclxuICogQHJldHVybnMgeyFMb25nfSBUaGUgY29ycmVzcG9uZGluZyBMb25nIHZhbHVlXHJcbiAqL1xyXG5Mb25nLmZyb21TdHJpbmcgPSBmcm9tU3RyaW5nO1xyXG5cclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAcGFyYW0geyFMb25nfG51bWJlcnxzdHJpbmd8IXtsb3c6IG51bWJlciwgaGlnaDogbnVtYmVyLCB1bnNpZ25lZDogYm9vbGVhbn19IHZhbFxyXG4gKiBAcGFyYW0ge2Jvb2xlYW49fSB1bnNpZ25lZFxyXG4gKiBAcmV0dXJucyB7IUxvbmd9XHJcbiAqIEBpbm5lclxyXG4gKi9cclxuZnVuY3Rpb24gZnJvbVZhbHVlKHZhbCwgdW5zaWduZWQpIHtcclxuICAgIGlmICh0eXBlb2YgdmFsID09PSAnbnVtYmVyJylcclxuICAgICAgICByZXR1cm4gZnJvbU51bWJlcih2YWwsIHVuc2lnbmVkKTtcclxuICAgIGlmICh0eXBlb2YgdmFsID09PSAnc3RyaW5nJylcclxuICAgICAgICByZXR1cm4gZnJvbVN0cmluZyh2YWwsIHVuc2lnbmVkKTtcclxuICAgIC8vIFRocm93cyBmb3Igbm9uLW9iamVjdHMsIGNvbnZlcnRzIG5vbi1pbnN0YW5jZW9mIExvbmc6XHJcbiAgICByZXR1cm4gZnJvbUJpdHModmFsLmxvdywgdmFsLmhpZ2gsIHR5cGVvZiB1bnNpZ25lZCA9PT0gJ2Jvb2xlYW4nID8gdW5zaWduZWQgOiB2YWwudW5zaWduZWQpO1xyXG59XHJcblxyXG4vKipcclxuICogQ29udmVydHMgdGhlIHNwZWNpZmllZCB2YWx1ZSB0byBhIExvbmcgdXNpbmcgdGhlIGFwcHJvcHJpYXRlIGZyb20qIGZ1bmN0aW9uIGZvciBpdHMgdHlwZS5cclxuICogQGZ1bmN0aW9uXHJcbiAqIEBwYXJhbSB7IUxvbmd8bnVtYmVyfHN0cmluZ3whe2xvdzogbnVtYmVyLCBoaWdoOiBudW1iZXIsIHVuc2lnbmVkOiBib29sZWFufX0gdmFsIFZhbHVlXHJcbiAqIEBwYXJhbSB7Ym9vbGVhbj19IHVuc2lnbmVkIFdoZXRoZXIgdW5zaWduZWQgb3Igbm90LCBkZWZhdWx0cyB0byBzaWduZWRcclxuICogQHJldHVybnMgeyFMb25nfVxyXG4gKi9cclxuTG9uZy5mcm9tVmFsdWUgPSBmcm9tVmFsdWU7XHJcblxyXG4vLyBOT1RFOiB0aGUgY29tcGlsZXIgc2hvdWxkIGlubGluZSB0aGVzZSBjb25zdGFudCB2YWx1ZXMgYmVsb3cgYW5kIHRoZW4gcmVtb3ZlIHRoZXNlIHZhcmlhYmxlcywgc28gdGhlcmUgc2hvdWxkIGJlXHJcbi8vIG5vIHJ1bnRpbWUgcGVuYWx0eSBmb3IgdGhlc2UuXHJcblxyXG4vKipcclxuICogQHR5cGUge251bWJlcn1cclxuICogQGNvbnN0XHJcbiAqIEBpbm5lclxyXG4gKi9cclxudmFyIFRXT19QV1JfMTZfREJMID0gMSA8PCAxNjtcclxuXHJcbi8qKlxyXG4gKiBAdHlwZSB7bnVtYmVyfVxyXG4gKiBAY29uc3RcclxuICogQGlubmVyXHJcbiAqL1xyXG52YXIgVFdPX1BXUl8yNF9EQkwgPSAxIDw8IDI0O1xyXG5cclxuLyoqXHJcbiAqIEB0eXBlIHtudW1iZXJ9XHJcbiAqIEBjb25zdFxyXG4gKiBAaW5uZXJcclxuICovXHJcbnZhciBUV09fUFdSXzMyX0RCTCA9IFRXT19QV1JfMTZfREJMICogVFdPX1BXUl8xNl9EQkw7XHJcblxyXG4vKipcclxuICogQHR5cGUge251bWJlcn1cclxuICogQGNvbnN0XHJcbiAqIEBpbm5lclxyXG4gKi9cclxudmFyIFRXT19QV1JfNjRfREJMID0gVFdPX1BXUl8zMl9EQkwgKiBUV09fUFdSXzMyX0RCTDtcclxuXHJcbi8qKlxyXG4gKiBAdHlwZSB7bnVtYmVyfVxyXG4gKiBAY29uc3RcclxuICogQGlubmVyXHJcbiAqL1xyXG52YXIgVFdPX1BXUl82M19EQkwgPSBUV09fUFdSXzY0X0RCTCAvIDI7XHJcblxyXG4vKipcclxuICogQHR5cGUgeyFMb25nfVxyXG4gKiBAY29uc3RcclxuICogQGlubmVyXHJcbiAqL1xyXG52YXIgVFdPX1BXUl8yNCA9IGZyb21JbnQoVFdPX1BXUl8yNF9EQkwpO1xyXG5cclxuLyoqXHJcbiAqIEB0eXBlIHshTG9uZ31cclxuICogQGlubmVyXHJcbiAqL1xyXG52YXIgWkVSTyA9IGZyb21JbnQoMCk7XHJcblxyXG4vKipcclxuICogU2lnbmVkIHplcm8uXHJcbiAqIEB0eXBlIHshTG9uZ31cclxuICovXHJcbkxvbmcuWkVSTyA9IFpFUk87XHJcblxyXG4vKipcclxuICogQHR5cGUgeyFMb25nfVxyXG4gKiBAaW5uZXJcclxuICovXHJcbnZhciBVWkVSTyA9IGZyb21JbnQoMCwgdHJ1ZSk7XHJcblxyXG4vKipcclxuICogVW5zaWduZWQgemVyby5cclxuICogQHR5cGUgeyFMb25nfVxyXG4gKi9cclxuTG9uZy5VWkVSTyA9IFVaRVJPO1xyXG5cclxuLyoqXHJcbiAqIEB0eXBlIHshTG9uZ31cclxuICogQGlubmVyXHJcbiAqL1xyXG52YXIgT05FID0gZnJvbUludCgxKTtcclxuXHJcbi8qKlxyXG4gKiBTaWduZWQgb25lLlxyXG4gKiBAdHlwZSB7IUxvbmd9XHJcbiAqL1xyXG5Mb25nLk9ORSA9IE9ORTtcclxuXHJcbi8qKlxyXG4gKiBAdHlwZSB7IUxvbmd9XHJcbiAqIEBpbm5lclxyXG4gKi9cclxudmFyIFVPTkUgPSBmcm9tSW50KDEsIHRydWUpO1xyXG5cclxuLyoqXHJcbiAqIFVuc2lnbmVkIG9uZS5cclxuICogQHR5cGUgeyFMb25nfVxyXG4gKi9cclxuTG9uZy5VT05FID0gVU9ORTtcclxuXHJcbi8qKlxyXG4gKiBAdHlwZSB7IUxvbmd9XHJcbiAqIEBpbm5lclxyXG4gKi9cclxudmFyIE5FR19PTkUgPSBmcm9tSW50KC0xKTtcclxuXHJcbi8qKlxyXG4gKiBTaWduZWQgbmVnYXRpdmUgb25lLlxyXG4gKiBAdHlwZSB7IUxvbmd9XHJcbiAqL1xyXG5Mb25nLk5FR19PTkUgPSBORUdfT05FO1xyXG5cclxuLyoqXHJcbiAqIEB0eXBlIHshTG9uZ31cclxuICogQGlubmVyXHJcbiAqL1xyXG52YXIgTUFYX1ZBTFVFID0gZnJvbUJpdHMoMHhGRkZGRkZGRnwwLCAweDdGRkZGRkZGfDAsIGZhbHNlKTtcclxuXHJcbi8qKlxyXG4gKiBNYXhpbXVtIHNpZ25lZCB2YWx1ZS5cclxuICogQHR5cGUgeyFMb25nfVxyXG4gKi9cclxuTG9uZy5NQVhfVkFMVUUgPSBNQVhfVkFMVUU7XHJcblxyXG4vKipcclxuICogQHR5cGUgeyFMb25nfVxyXG4gKiBAaW5uZXJcclxuICovXHJcbnZhciBNQVhfVU5TSUdORURfVkFMVUUgPSBmcm9tQml0cygweEZGRkZGRkZGfDAsIDB4RkZGRkZGRkZ8MCwgdHJ1ZSk7XHJcblxyXG4vKipcclxuICogTWF4aW11bSB1bnNpZ25lZCB2YWx1ZS5cclxuICogQHR5cGUgeyFMb25nfVxyXG4gKi9cclxuTG9uZy5NQVhfVU5TSUdORURfVkFMVUUgPSBNQVhfVU5TSUdORURfVkFMVUU7XHJcblxyXG4vKipcclxuICogQHR5cGUgeyFMb25nfVxyXG4gKiBAaW5uZXJcclxuICovXHJcbnZhciBNSU5fVkFMVUUgPSBmcm9tQml0cygwLCAweDgwMDAwMDAwfDAsIGZhbHNlKTtcclxuXHJcbi8qKlxyXG4gKiBNaW5pbXVtIHNpZ25lZCB2YWx1ZS5cclxuICogQHR5cGUgeyFMb25nfVxyXG4gKi9cclxuTG9uZy5NSU5fVkFMVUUgPSBNSU5fVkFMVUU7XHJcblxyXG4vKipcclxuICogQGFsaWFzIExvbmcucHJvdG90eXBlXHJcbiAqIEBpbm5lclxyXG4gKi9cclxudmFyIExvbmdQcm90b3R5cGUgPSBMb25nLnByb3RvdHlwZTtcclxuXHJcbi8qKlxyXG4gKiBDb252ZXJ0cyB0aGUgTG9uZyB0byBhIDMyIGJpdCBpbnRlZ2VyLCBhc3N1bWluZyBpdCBpcyBhIDMyIGJpdCBpbnRlZ2VyLlxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfVxyXG4gKi9cclxuTG9uZ1Byb3RvdHlwZS50b0ludCA9IGZ1bmN0aW9uIHRvSW50KCkge1xyXG4gICAgcmV0dXJuIHRoaXMudW5zaWduZWQgPyB0aGlzLmxvdyA+Pj4gMCA6IHRoaXMubG93O1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIENvbnZlcnRzIHRoZSBMb25nIHRvIGEgdGhlIG5lYXJlc3QgZmxvYXRpbmctcG9pbnQgcmVwcmVzZW50YXRpb24gb2YgdGhpcyB2YWx1ZSAoZG91YmxlLCA1MyBiaXQgbWFudGlzc2EpLlxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfVxyXG4gKi9cclxuTG9uZ1Byb3RvdHlwZS50b051bWJlciA9IGZ1bmN0aW9uIHRvTnVtYmVyKCkge1xyXG4gICAgaWYgKHRoaXMudW5zaWduZWQpXHJcbiAgICAgICAgcmV0dXJuICgodGhpcy5oaWdoID4+PiAwKSAqIFRXT19QV1JfMzJfREJMKSArICh0aGlzLmxvdyA+Pj4gMCk7XHJcbiAgICByZXR1cm4gdGhpcy5oaWdoICogVFdPX1BXUl8zMl9EQkwgKyAodGhpcy5sb3cgPj4+IDApO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIENvbnZlcnRzIHRoZSBMb25nIHRvIGEgc3RyaW5nIHdyaXR0ZW4gaW4gdGhlIHNwZWNpZmllZCByYWRpeC5cclxuICogQHBhcmFtIHtudW1iZXI9fSByYWRpeCBSYWRpeCAoMi0zNiksIGRlZmF1bHRzIHRvIDEwXHJcbiAqIEByZXR1cm5zIHtzdHJpbmd9XHJcbiAqIEBvdmVycmlkZVxyXG4gKiBAdGhyb3dzIHtSYW5nZUVycm9yfSBJZiBgcmFkaXhgIGlzIG91dCBvZiByYW5nZVxyXG4gKi9cclxuTG9uZ1Byb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKHJhZGl4KSB7XHJcbiAgICByYWRpeCA9IHJhZGl4IHx8IDEwO1xyXG4gICAgaWYgKHJhZGl4IDwgMiB8fCAzNiA8IHJhZGl4KVxyXG4gICAgICAgIHRocm93IFJhbmdlRXJyb3IoJ3JhZGl4Jyk7XHJcbiAgICBpZiAodGhpcy5pc1plcm8oKSlcclxuICAgICAgICByZXR1cm4gJzAnO1xyXG4gICAgaWYgKHRoaXMuaXNOZWdhdGl2ZSgpKSB7IC8vIFVuc2lnbmVkIExvbmdzIGFyZSBuZXZlciBuZWdhdGl2ZVxyXG4gICAgICAgIGlmICh0aGlzLmVxKE1JTl9WQUxVRSkpIHtcclxuICAgICAgICAgICAgLy8gV2UgbmVlZCB0byBjaGFuZ2UgdGhlIExvbmcgdmFsdWUgYmVmb3JlIGl0IGNhbiBiZSBuZWdhdGVkLCBzbyB3ZSByZW1vdmVcclxuICAgICAgICAgICAgLy8gdGhlIGJvdHRvbS1tb3N0IGRpZ2l0IGluIHRoaXMgYmFzZSBhbmQgdGhlbiByZWN1cnNlIHRvIGRvIHRoZSByZXN0LlxyXG4gICAgICAgICAgICB2YXIgcmFkaXhMb25nID0gZnJvbU51bWJlcihyYWRpeCksXHJcbiAgICAgICAgICAgICAgICBkaXYgPSB0aGlzLmRpdihyYWRpeExvbmcpLFxyXG4gICAgICAgICAgICAgICAgcmVtMSA9IGRpdi5tdWwocmFkaXhMb25nKS5zdWIodGhpcyk7XHJcbiAgICAgICAgICAgIHJldHVybiBkaXYudG9TdHJpbmcocmFkaXgpICsgcmVtMS50b0ludCgpLnRvU3RyaW5nKHJhZGl4KTtcclxuICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgcmV0dXJuICctJyArIHRoaXMubmVnKCkudG9TdHJpbmcocmFkaXgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIERvIHNldmVyYWwgKDYpIGRpZ2l0cyBlYWNoIHRpbWUgdGhyb3VnaCB0aGUgbG9vcCwgc28gYXMgdG9cclxuICAgIC8vIG1pbmltaXplIHRoZSBjYWxscyB0byB0aGUgdmVyeSBleHBlbnNpdmUgZW11bGF0ZWQgZGl2LlxyXG4gICAgdmFyIHJhZGl4VG9Qb3dlciA9IGZyb21OdW1iZXIocG93X2RibChyYWRpeCwgNiksIHRoaXMudW5zaWduZWQpLFxyXG4gICAgICAgIHJlbSA9IHRoaXM7XHJcbiAgICB2YXIgcmVzdWx0ID0gJyc7XHJcbiAgICB3aGlsZSAodHJ1ZSkge1xyXG4gICAgICAgIHZhciByZW1EaXYgPSByZW0uZGl2KHJhZGl4VG9Qb3dlciksXHJcbiAgICAgICAgICAgIGludHZhbCA9IHJlbS5zdWIocmVtRGl2Lm11bChyYWRpeFRvUG93ZXIpKS50b0ludCgpID4+PiAwLFxyXG4gICAgICAgICAgICBkaWdpdHMgPSBpbnR2YWwudG9TdHJpbmcocmFkaXgpO1xyXG4gICAgICAgIHJlbSA9IHJlbURpdjtcclxuICAgICAgICBpZiAocmVtLmlzWmVybygpKVxyXG4gICAgICAgICAgICByZXR1cm4gZGlnaXRzICsgcmVzdWx0O1xyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB3aGlsZSAoZGlnaXRzLmxlbmd0aCA8IDYpXHJcbiAgICAgICAgICAgICAgICBkaWdpdHMgPSAnMCcgKyBkaWdpdHM7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9ICcnICsgZGlnaXRzICsgcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBHZXRzIHRoZSBoaWdoIDMyIGJpdHMgYXMgYSBzaWduZWQgaW50ZWdlci5cclxuICogQHJldHVybnMge251bWJlcn0gU2lnbmVkIGhpZ2ggYml0c1xyXG4gKi9cclxuTG9uZ1Byb3RvdHlwZS5nZXRIaWdoQml0cyA9IGZ1bmN0aW9uIGdldEhpZ2hCaXRzKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaGlnaDtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBHZXRzIHRoZSBoaWdoIDMyIGJpdHMgYXMgYW4gdW5zaWduZWQgaW50ZWdlci5cclxuICogQHJldHVybnMge251bWJlcn0gVW5zaWduZWQgaGlnaCBiaXRzXHJcbiAqL1xyXG5Mb25nUHJvdG90eXBlLmdldEhpZ2hCaXRzVW5zaWduZWQgPSBmdW5jdGlvbiBnZXRIaWdoQml0c1Vuc2lnbmVkKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaGlnaCA+Pj4gMDtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBHZXRzIHRoZSBsb3cgMzIgYml0cyBhcyBhIHNpZ25lZCBpbnRlZ2VyLlxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBTaWduZWQgbG93IGJpdHNcclxuICovXHJcbkxvbmdQcm90b3R5cGUuZ2V0TG93Qml0cyA9IGZ1bmN0aW9uIGdldExvd0JpdHMoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5sb3c7XHJcbn07XHJcblxyXG4vKipcclxuICogR2V0cyB0aGUgbG93IDMyIGJpdHMgYXMgYW4gdW5zaWduZWQgaW50ZWdlci5cclxuICogQHJldHVybnMge251bWJlcn0gVW5zaWduZWQgbG93IGJpdHNcclxuICovXHJcbkxvbmdQcm90b3R5cGUuZ2V0TG93Qml0c1Vuc2lnbmVkID0gZnVuY3Rpb24gZ2V0TG93Qml0c1Vuc2lnbmVkKCkge1xyXG4gICAgcmV0dXJuIHRoaXMubG93ID4+PiAwO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEdldHMgdGhlIG51bWJlciBvZiBiaXRzIG5lZWRlZCB0byByZXByZXNlbnQgdGhlIGFic29sdXRlIHZhbHVlIG9mIHRoaXMgTG9uZy5cclxuICogQHJldHVybnMge251bWJlcn1cclxuICovXHJcbkxvbmdQcm90b3R5cGUuZ2V0TnVtQml0c0FicyA9IGZ1bmN0aW9uIGdldE51bUJpdHNBYnMoKSB7XHJcbiAgICBpZiAodGhpcy5pc05lZ2F0aXZlKCkpIC8vIFVuc2lnbmVkIExvbmdzIGFyZSBuZXZlciBuZWdhdGl2ZVxyXG4gICAgICAgIHJldHVybiB0aGlzLmVxKE1JTl9WQUxVRSkgPyA2NCA6IHRoaXMubmVnKCkuZ2V0TnVtQml0c0FicygpO1xyXG4gICAgdmFyIHZhbCA9IHRoaXMuaGlnaCAhPSAwID8gdGhpcy5oaWdoIDogdGhpcy5sb3c7XHJcbiAgICBmb3IgKHZhciBiaXQgPSAzMTsgYml0ID4gMDsgYml0LS0pXHJcbiAgICAgICAgaWYgKCh2YWwgJiAoMSA8PCBiaXQpKSAhPSAwKVxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgIHJldHVybiB0aGlzLmhpZ2ggIT0gMCA/IGJpdCArIDMzIDogYml0ICsgMTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBUZXN0cyBpZiB0aGlzIExvbmcncyB2YWx1ZSBlcXVhbHMgemVyby5cclxuICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAqL1xyXG5Mb25nUHJvdG90eXBlLmlzWmVybyA9IGZ1bmN0aW9uIGlzWmVybygpIHtcclxuICAgIHJldHVybiB0aGlzLmhpZ2ggPT09IDAgJiYgdGhpcy5sb3cgPT09IDA7XHJcbn07XHJcblxyXG4vKipcclxuICogVGVzdHMgaWYgdGhpcyBMb25nJ3MgdmFsdWUgZXF1YWxzIHplcm8uIFRoaXMgaXMgYW4gYWxpYXMgb2Yge0BsaW5rIExvbmcjaXNaZXJvfS5cclxuICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAqL1xyXG5Mb25nUHJvdG90eXBlLmVxeiA9IExvbmdQcm90b3R5cGUuaXNaZXJvO1xyXG5cclxuLyoqXHJcbiAqIFRlc3RzIGlmIHRoaXMgTG9uZydzIHZhbHVlIGlzIG5lZ2F0aXZlLlxyXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICovXHJcbkxvbmdQcm90b3R5cGUuaXNOZWdhdGl2ZSA9IGZ1bmN0aW9uIGlzTmVnYXRpdmUoKSB7XHJcbiAgICByZXR1cm4gIXRoaXMudW5zaWduZWQgJiYgdGhpcy5oaWdoIDwgMDtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBUZXN0cyBpZiB0aGlzIExvbmcncyB2YWx1ZSBpcyBwb3NpdGl2ZS5cclxuICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAqL1xyXG5Mb25nUHJvdG90eXBlLmlzUG9zaXRpdmUgPSBmdW5jdGlvbiBpc1Bvc2l0aXZlKCkge1xyXG4gICAgcmV0dXJuIHRoaXMudW5zaWduZWQgfHwgdGhpcy5oaWdoID49IDA7XHJcbn07XHJcblxyXG4vKipcclxuICogVGVzdHMgaWYgdGhpcyBMb25nJ3MgdmFsdWUgaXMgb2RkLlxyXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICovXHJcbkxvbmdQcm90b3R5cGUuaXNPZGQgPSBmdW5jdGlvbiBpc09kZCgpIHtcclxuICAgIHJldHVybiAodGhpcy5sb3cgJiAxKSA9PT0gMTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBUZXN0cyBpZiB0aGlzIExvbmcncyB2YWx1ZSBpcyBldmVuLlxyXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICovXHJcbkxvbmdQcm90b3R5cGUuaXNFdmVuID0gZnVuY3Rpb24gaXNFdmVuKCkge1xyXG4gICAgcmV0dXJuICh0aGlzLmxvdyAmIDEpID09PSAwO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFRlc3RzIGlmIHRoaXMgTG9uZydzIHZhbHVlIGVxdWFscyB0aGUgc3BlY2lmaWVkJ3MuXHJcbiAqIEBwYXJhbSB7IUxvbmd8bnVtYmVyfHN0cmluZ30gb3RoZXIgT3RoZXIgdmFsdWVcclxuICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAqL1xyXG5Mb25nUHJvdG90eXBlLmVxdWFscyA9IGZ1bmN0aW9uIGVxdWFscyhvdGhlcikge1xyXG4gICAgaWYgKCFpc0xvbmcob3RoZXIpKVxyXG4gICAgICAgIG90aGVyID0gZnJvbVZhbHVlKG90aGVyKTtcclxuICAgIGlmICh0aGlzLnVuc2lnbmVkICE9PSBvdGhlci51bnNpZ25lZCAmJiAodGhpcy5oaWdoID4+PiAzMSkgPT09IDEgJiYgKG90aGVyLmhpZ2ggPj4+IDMxKSA9PT0gMSlcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICByZXR1cm4gdGhpcy5oaWdoID09PSBvdGhlci5oaWdoICYmIHRoaXMubG93ID09PSBvdGhlci5sb3c7XHJcbn07XHJcblxyXG4vKipcclxuICogVGVzdHMgaWYgdGhpcyBMb25nJ3MgdmFsdWUgZXF1YWxzIHRoZSBzcGVjaWZpZWQncy4gVGhpcyBpcyBhbiBhbGlhcyBvZiB7QGxpbmsgTG9uZyNlcXVhbHN9LlxyXG4gKiBAZnVuY3Rpb25cclxuICogQHBhcmFtIHshTG9uZ3xudW1iZXJ8c3RyaW5nfSBvdGhlciBPdGhlciB2YWx1ZVxyXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICovXHJcbkxvbmdQcm90b3R5cGUuZXEgPSBMb25nUHJvdG90eXBlLmVxdWFscztcclxuXHJcbi8qKlxyXG4gKiBUZXN0cyBpZiB0aGlzIExvbmcncyB2YWx1ZSBkaWZmZXJzIGZyb20gdGhlIHNwZWNpZmllZCdzLlxyXG4gKiBAcGFyYW0geyFMb25nfG51bWJlcnxzdHJpbmd9IG90aGVyIE90aGVyIHZhbHVlXHJcbiAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gKi9cclxuTG9uZ1Byb3RvdHlwZS5ub3RFcXVhbHMgPSBmdW5jdGlvbiBub3RFcXVhbHMob3RoZXIpIHtcclxuICAgIHJldHVybiAhdGhpcy5lcSgvKiB2YWxpZGF0ZXMgKi8gb3RoZXIpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFRlc3RzIGlmIHRoaXMgTG9uZydzIHZhbHVlIGRpZmZlcnMgZnJvbSB0aGUgc3BlY2lmaWVkJ3MuIFRoaXMgaXMgYW4gYWxpYXMgb2Yge0BsaW5rIExvbmcjbm90RXF1YWxzfS5cclxuICogQGZ1bmN0aW9uXHJcbiAqIEBwYXJhbSB7IUxvbmd8bnVtYmVyfHN0cmluZ30gb3RoZXIgT3RoZXIgdmFsdWVcclxuICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAqL1xyXG5Mb25nUHJvdG90eXBlLm5lcSA9IExvbmdQcm90b3R5cGUubm90RXF1YWxzO1xyXG5cclxuLyoqXHJcbiAqIFRlc3RzIGlmIHRoaXMgTG9uZydzIHZhbHVlIGRpZmZlcnMgZnJvbSB0aGUgc3BlY2lmaWVkJ3MuIFRoaXMgaXMgYW4gYWxpYXMgb2Yge0BsaW5rIExvbmcjbm90RXF1YWxzfS5cclxuICogQGZ1bmN0aW9uXHJcbiAqIEBwYXJhbSB7IUxvbmd8bnVtYmVyfHN0cmluZ30gb3RoZXIgT3RoZXIgdmFsdWVcclxuICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAqL1xyXG5Mb25nUHJvdG90eXBlLm5lID0gTG9uZ1Byb3RvdHlwZS5ub3RFcXVhbHM7XHJcblxyXG4vKipcclxuICogVGVzdHMgaWYgdGhpcyBMb25nJ3MgdmFsdWUgaXMgbGVzcyB0aGFuIHRoZSBzcGVjaWZpZWQncy5cclxuICogQHBhcmFtIHshTG9uZ3xudW1iZXJ8c3RyaW5nfSBvdGhlciBPdGhlciB2YWx1ZVxyXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICovXHJcbkxvbmdQcm90b3R5cGUubGVzc1RoYW4gPSBmdW5jdGlvbiBsZXNzVGhhbihvdGhlcikge1xyXG4gICAgcmV0dXJuIHRoaXMuY29tcCgvKiB2YWxpZGF0ZXMgKi8gb3RoZXIpIDwgMDtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBUZXN0cyBpZiB0aGlzIExvbmcncyB2YWx1ZSBpcyBsZXNzIHRoYW4gdGhlIHNwZWNpZmllZCdzLiBUaGlzIGlzIGFuIGFsaWFzIG9mIHtAbGluayBMb25nI2xlc3NUaGFufS5cclxuICogQGZ1bmN0aW9uXHJcbiAqIEBwYXJhbSB7IUxvbmd8bnVtYmVyfHN0cmluZ30gb3RoZXIgT3RoZXIgdmFsdWVcclxuICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAqL1xyXG5Mb25nUHJvdG90eXBlLmx0ID0gTG9uZ1Byb3RvdHlwZS5sZXNzVGhhbjtcclxuXHJcbi8qKlxyXG4gKiBUZXN0cyBpZiB0aGlzIExvbmcncyB2YWx1ZSBpcyBsZXNzIHRoYW4gb3IgZXF1YWwgdGhlIHNwZWNpZmllZCdzLlxyXG4gKiBAcGFyYW0geyFMb25nfG51bWJlcnxzdHJpbmd9IG90aGVyIE90aGVyIHZhbHVlXHJcbiAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gKi9cclxuTG9uZ1Byb3RvdHlwZS5sZXNzVGhhbk9yRXF1YWwgPSBmdW5jdGlvbiBsZXNzVGhhbk9yRXF1YWwob3RoZXIpIHtcclxuICAgIHJldHVybiB0aGlzLmNvbXAoLyogdmFsaWRhdGVzICovIG90aGVyKSA8PSAwO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFRlc3RzIGlmIHRoaXMgTG9uZydzIHZhbHVlIGlzIGxlc3MgdGhhbiBvciBlcXVhbCB0aGUgc3BlY2lmaWVkJ3MuIFRoaXMgaXMgYW4gYWxpYXMgb2Yge0BsaW5rIExvbmcjbGVzc1RoYW5PckVxdWFsfS5cclxuICogQGZ1bmN0aW9uXHJcbiAqIEBwYXJhbSB7IUxvbmd8bnVtYmVyfHN0cmluZ30gb3RoZXIgT3RoZXIgdmFsdWVcclxuICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAqL1xyXG5Mb25nUHJvdG90eXBlLmx0ZSA9IExvbmdQcm90b3R5cGUubGVzc1RoYW5PckVxdWFsO1xyXG5cclxuLyoqXHJcbiAqIFRlc3RzIGlmIHRoaXMgTG9uZydzIHZhbHVlIGlzIGxlc3MgdGhhbiBvciBlcXVhbCB0aGUgc3BlY2lmaWVkJ3MuIFRoaXMgaXMgYW4gYWxpYXMgb2Yge0BsaW5rIExvbmcjbGVzc1RoYW5PckVxdWFsfS5cclxuICogQGZ1bmN0aW9uXHJcbiAqIEBwYXJhbSB7IUxvbmd8bnVtYmVyfHN0cmluZ30gb3RoZXIgT3RoZXIgdmFsdWVcclxuICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAqL1xyXG5Mb25nUHJvdG90eXBlLmxlID0gTG9uZ1Byb3RvdHlwZS5sZXNzVGhhbk9yRXF1YWw7XHJcblxyXG4vKipcclxuICogVGVzdHMgaWYgdGhpcyBMb25nJ3MgdmFsdWUgaXMgZ3JlYXRlciB0aGFuIHRoZSBzcGVjaWZpZWQncy5cclxuICogQHBhcmFtIHshTG9uZ3xudW1iZXJ8c3RyaW5nfSBvdGhlciBPdGhlciB2YWx1ZVxyXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICovXHJcbkxvbmdQcm90b3R5cGUuZ3JlYXRlclRoYW4gPSBmdW5jdGlvbiBncmVhdGVyVGhhbihvdGhlcikge1xyXG4gICAgcmV0dXJuIHRoaXMuY29tcCgvKiB2YWxpZGF0ZXMgKi8gb3RoZXIpID4gMDtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBUZXN0cyBpZiB0aGlzIExvbmcncyB2YWx1ZSBpcyBncmVhdGVyIHRoYW4gdGhlIHNwZWNpZmllZCdzLiBUaGlzIGlzIGFuIGFsaWFzIG9mIHtAbGluayBMb25nI2dyZWF0ZXJUaGFufS5cclxuICogQGZ1bmN0aW9uXHJcbiAqIEBwYXJhbSB7IUxvbmd8bnVtYmVyfHN0cmluZ30gb3RoZXIgT3RoZXIgdmFsdWVcclxuICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAqL1xyXG5Mb25nUHJvdG90eXBlLmd0ID0gTG9uZ1Byb3RvdHlwZS5ncmVhdGVyVGhhbjtcclxuXHJcbi8qKlxyXG4gKiBUZXN0cyBpZiB0aGlzIExvbmcncyB2YWx1ZSBpcyBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdGhlIHNwZWNpZmllZCdzLlxyXG4gKiBAcGFyYW0geyFMb25nfG51bWJlcnxzdHJpbmd9IG90aGVyIE90aGVyIHZhbHVlXHJcbiAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gKi9cclxuTG9uZ1Byb3RvdHlwZS5ncmVhdGVyVGhhbk9yRXF1YWwgPSBmdW5jdGlvbiBncmVhdGVyVGhhbk9yRXF1YWwob3RoZXIpIHtcclxuICAgIHJldHVybiB0aGlzLmNvbXAoLyogdmFsaWRhdGVzICovIG90aGVyKSA+PSAwO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFRlc3RzIGlmIHRoaXMgTG9uZydzIHZhbHVlIGlzIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0aGUgc3BlY2lmaWVkJ3MuIFRoaXMgaXMgYW4gYWxpYXMgb2Yge0BsaW5rIExvbmcjZ3JlYXRlclRoYW5PckVxdWFsfS5cclxuICogQGZ1bmN0aW9uXHJcbiAqIEBwYXJhbSB7IUxvbmd8bnVtYmVyfHN0cmluZ30gb3RoZXIgT3RoZXIgdmFsdWVcclxuICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAqL1xyXG5Mb25nUHJvdG90eXBlLmd0ZSA9IExvbmdQcm90b3R5cGUuZ3JlYXRlclRoYW5PckVxdWFsO1xyXG5cclxuLyoqXHJcbiAqIFRlc3RzIGlmIHRoaXMgTG9uZydzIHZhbHVlIGlzIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0aGUgc3BlY2lmaWVkJ3MuIFRoaXMgaXMgYW4gYWxpYXMgb2Yge0BsaW5rIExvbmcjZ3JlYXRlclRoYW5PckVxdWFsfS5cclxuICogQGZ1bmN0aW9uXHJcbiAqIEBwYXJhbSB7IUxvbmd8bnVtYmVyfHN0cmluZ30gb3RoZXIgT3RoZXIgdmFsdWVcclxuICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAqL1xyXG5Mb25nUHJvdG90eXBlLmdlID0gTG9uZ1Byb3RvdHlwZS5ncmVhdGVyVGhhbk9yRXF1YWw7XHJcblxyXG4vKipcclxuICogQ29tcGFyZXMgdGhpcyBMb25nJ3MgdmFsdWUgd2l0aCB0aGUgc3BlY2lmaWVkJ3MuXHJcbiAqIEBwYXJhbSB7IUxvbmd8bnVtYmVyfHN0cmluZ30gb3RoZXIgT3RoZXIgdmFsdWVcclxuICogQHJldHVybnMge251bWJlcn0gMCBpZiB0aGV5IGFyZSB0aGUgc2FtZSwgMSBpZiB0aGUgdGhpcyBpcyBncmVhdGVyIGFuZCAtMVxyXG4gKiAgaWYgdGhlIGdpdmVuIG9uZSBpcyBncmVhdGVyXHJcbiAqL1xyXG5Mb25nUHJvdG90eXBlLmNvbXBhcmUgPSBmdW5jdGlvbiBjb21wYXJlKG90aGVyKSB7XHJcbiAgICBpZiAoIWlzTG9uZyhvdGhlcikpXHJcbiAgICAgICAgb3RoZXIgPSBmcm9tVmFsdWUob3RoZXIpO1xyXG4gICAgaWYgKHRoaXMuZXEob3RoZXIpKVxyXG4gICAgICAgIHJldHVybiAwO1xyXG4gICAgdmFyIHRoaXNOZWcgPSB0aGlzLmlzTmVnYXRpdmUoKSxcclxuICAgICAgICBvdGhlck5lZyA9IG90aGVyLmlzTmVnYXRpdmUoKTtcclxuICAgIGlmICh0aGlzTmVnICYmICFvdGhlck5lZylcclxuICAgICAgICByZXR1cm4gLTE7XHJcbiAgICBpZiAoIXRoaXNOZWcgJiYgb3RoZXJOZWcpXHJcbiAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAvLyBBdCB0aGlzIHBvaW50IHRoZSBzaWduIGJpdHMgYXJlIHRoZSBzYW1lXHJcbiAgICBpZiAoIXRoaXMudW5zaWduZWQpXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc3ViKG90aGVyKS5pc05lZ2F0aXZlKCkgPyAtMSA6IDE7XHJcbiAgICAvLyBCb3RoIGFyZSBwb3NpdGl2ZSBpZiBhdCBsZWFzdCBvbmUgaXMgdW5zaWduZWRcclxuICAgIHJldHVybiAob3RoZXIuaGlnaCA+Pj4gMCkgPiAodGhpcy5oaWdoID4+PiAwKSB8fCAob3RoZXIuaGlnaCA9PT0gdGhpcy5oaWdoICYmIChvdGhlci5sb3cgPj4+IDApID4gKHRoaXMubG93ID4+PiAwKSkgPyAtMSA6IDE7XHJcbn07XHJcblxyXG4vKipcclxuICogQ29tcGFyZXMgdGhpcyBMb25nJ3MgdmFsdWUgd2l0aCB0aGUgc3BlY2lmaWVkJ3MuIFRoaXMgaXMgYW4gYWxpYXMgb2Yge0BsaW5rIExvbmcjY29tcGFyZX0uXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAcGFyYW0geyFMb25nfG51bWJlcnxzdHJpbmd9IG90aGVyIE90aGVyIHZhbHVlXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IDAgaWYgdGhleSBhcmUgdGhlIHNhbWUsIDEgaWYgdGhlIHRoaXMgaXMgZ3JlYXRlciBhbmQgLTFcclxuICogIGlmIHRoZSBnaXZlbiBvbmUgaXMgZ3JlYXRlclxyXG4gKi9cclxuTG9uZ1Byb3RvdHlwZS5jb21wID0gTG9uZ1Byb3RvdHlwZS5jb21wYXJlO1xyXG5cclxuLyoqXHJcbiAqIE5lZ2F0ZXMgdGhpcyBMb25nJ3MgdmFsdWUuXHJcbiAqIEByZXR1cm5zIHshTG9uZ30gTmVnYXRlZCBMb25nXHJcbiAqL1xyXG5Mb25nUHJvdG90eXBlLm5lZ2F0ZSA9IGZ1bmN0aW9uIG5lZ2F0ZSgpIHtcclxuICAgIGlmICghdGhpcy51bnNpZ25lZCAmJiB0aGlzLmVxKE1JTl9WQUxVRSkpXHJcbiAgICAgICAgcmV0dXJuIE1JTl9WQUxVRTtcclxuICAgIHJldHVybiB0aGlzLm5vdCgpLmFkZChPTkUpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIE5lZ2F0ZXMgdGhpcyBMb25nJ3MgdmFsdWUuIFRoaXMgaXMgYW4gYWxpYXMgb2Yge0BsaW5rIExvbmcjbmVnYXRlfS5cclxuICogQGZ1bmN0aW9uXHJcbiAqIEByZXR1cm5zIHshTG9uZ30gTmVnYXRlZCBMb25nXHJcbiAqL1xyXG5Mb25nUHJvdG90eXBlLm5lZyA9IExvbmdQcm90b3R5cGUubmVnYXRlO1xyXG5cclxuLyoqXHJcbiAqIFJldHVybnMgdGhlIHN1bSBvZiB0aGlzIGFuZCB0aGUgc3BlY2lmaWVkIExvbmcuXHJcbiAqIEBwYXJhbSB7IUxvbmd8bnVtYmVyfHN0cmluZ30gYWRkZW5kIEFkZGVuZFxyXG4gKiBAcmV0dXJucyB7IUxvbmd9IFN1bVxyXG4gKi9cclxuTG9uZ1Byb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiBhZGQoYWRkZW5kKSB7XHJcbiAgICBpZiAoIWlzTG9uZyhhZGRlbmQpKVxyXG4gICAgICAgIGFkZGVuZCA9IGZyb21WYWx1ZShhZGRlbmQpO1xyXG5cclxuICAgIC8vIERpdmlkZSBlYWNoIG51bWJlciBpbnRvIDQgY2h1bmtzIG9mIDE2IGJpdHMsIGFuZCB0aGVuIHN1bSB0aGUgY2h1bmtzLlxyXG5cclxuICAgIHZhciBhNDggPSB0aGlzLmhpZ2ggPj4+IDE2O1xyXG4gICAgdmFyIGEzMiA9IHRoaXMuaGlnaCAmIDB4RkZGRjtcclxuICAgIHZhciBhMTYgPSB0aGlzLmxvdyA+Pj4gMTY7XHJcbiAgICB2YXIgYTAwID0gdGhpcy5sb3cgJiAweEZGRkY7XHJcblxyXG4gICAgdmFyIGI0OCA9IGFkZGVuZC5oaWdoID4+PiAxNjtcclxuICAgIHZhciBiMzIgPSBhZGRlbmQuaGlnaCAmIDB4RkZGRjtcclxuICAgIHZhciBiMTYgPSBhZGRlbmQubG93ID4+PiAxNjtcclxuICAgIHZhciBiMDAgPSBhZGRlbmQubG93ICYgMHhGRkZGO1xyXG5cclxuICAgIHZhciBjNDggPSAwLCBjMzIgPSAwLCBjMTYgPSAwLCBjMDAgPSAwO1xyXG4gICAgYzAwICs9IGEwMCArIGIwMDtcclxuICAgIGMxNiArPSBjMDAgPj4+IDE2O1xyXG4gICAgYzAwICY9IDB4RkZGRjtcclxuICAgIGMxNiArPSBhMTYgKyBiMTY7XHJcbiAgICBjMzIgKz0gYzE2ID4+PiAxNjtcclxuICAgIGMxNiAmPSAweEZGRkY7XHJcbiAgICBjMzIgKz0gYTMyICsgYjMyO1xyXG4gICAgYzQ4ICs9IGMzMiA+Pj4gMTY7XHJcbiAgICBjMzIgJj0gMHhGRkZGO1xyXG4gICAgYzQ4ICs9IGE0OCArIGI0ODtcclxuICAgIGM0OCAmPSAweEZGRkY7XHJcbiAgICByZXR1cm4gZnJvbUJpdHMoKGMxNiA8PCAxNikgfCBjMDAsIChjNDggPDwgMTYpIHwgYzMyLCB0aGlzLnVuc2lnbmVkKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBSZXR1cm5zIHRoZSBkaWZmZXJlbmNlIG9mIHRoaXMgYW5kIHRoZSBzcGVjaWZpZWQgTG9uZy5cclxuICogQHBhcmFtIHshTG9uZ3xudW1iZXJ8c3RyaW5nfSBzdWJ0cmFoZW5kIFN1YnRyYWhlbmRcclxuICogQHJldHVybnMgeyFMb25nfSBEaWZmZXJlbmNlXHJcbiAqL1xyXG5Mb25nUHJvdG90eXBlLnN1YnRyYWN0ID0gZnVuY3Rpb24gc3VidHJhY3Qoc3VidHJhaGVuZCkge1xyXG4gICAgaWYgKCFpc0xvbmcoc3VidHJhaGVuZCkpXHJcbiAgICAgICAgc3VidHJhaGVuZCA9IGZyb21WYWx1ZShzdWJ0cmFoZW5kKTtcclxuICAgIHJldHVybiB0aGlzLmFkZChzdWJ0cmFoZW5kLm5lZygpKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBSZXR1cm5zIHRoZSBkaWZmZXJlbmNlIG9mIHRoaXMgYW5kIHRoZSBzcGVjaWZpZWQgTG9uZy4gVGhpcyBpcyBhbiBhbGlhcyBvZiB7QGxpbmsgTG9uZyNzdWJ0cmFjdH0uXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAcGFyYW0geyFMb25nfG51bWJlcnxzdHJpbmd9IHN1YnRyYWhlbmQgU3VidHJhaGVuZFxyXG4gKiBAcmV0dXJucyB7IUxvbmd9IERpZmZlcmVuY2VcclxuICovXHJcbkxvbmdQcm90b3R5cGUuc3ViID0gTG9uZ1Byb3RvdHlwZS5zdWJ0cmFjdDtcclxuXHJcbi8qKlxyXG4gKiBSZXR1cm5zIHRoZSBwcm9kdWN0IG9mIHRoaXMgYW5kIHRoZSBzcGVjaWZpZWQgTG9uZy5cclxuICogQHBhcmFtIHshTG9uZ3xudW1iZXJ8c3RyaW5nfSBtdWx0aXBsaWVyIE11bHRpcGxpZXJcclxuICogQHJldHVybnMgeyFMb25nfSBQcm9kdWN0XHJcbiAqL1xyXG5Mb25nUHJvdG90eXBlLm11bHRpcGx5ID0gZnVuY3Rpb24gbXVsdGlwbHkobXVsdGlwbGllcikge1xyXG4gICAgaWYgKHRoaXMuaXNaZXJvKCkpXHJcbiAgICAgICAgcmV0dXJuIFpFUk87XHJcbiAgICBpZiAoIWlzTG9uZyhtdWx0aXBsaWVyKSlcclxuICAgICAgICBtdWx0aXBsaWVyID0gZnJvbVZhbHVlKG11bHRpcGxpZXIpO1xyXG5cclxuICAgIC8vIHVzZSB3YXNtIHN1cHBvcnQgaWYgcHJlc2VudFxyXG4gICAgaWYgKHdhc20pIHtcclxuICAgICAgICB2YXIgbG93ID0gd2FzbS5tdWwodGhpcy5sb3csXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGlnaCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgbXVsdGlwbGllci5sb3csXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIG11bHRpcGxpZXIuaGlnaCk7XHJcbiAgICAgICAgcmV0dXJuIGZyb21CaXRzKGxvdywgd2FzbS5nZXRfaGlnaCgpLCB0aGlzLnVuc2lnbmVkKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAobXVsdGlwbGllci5pc1plcm8oKSlcclxuICAgICAgICByZXR1cm4gWkVSTztcclxuICAgIGlmICh0aGlzLmVxKE1JTl9WQUxVRSkpXHJcbiAgICAgICAgcmV0dXJuIG11bHRpcGxpZXIuaXNPZGQoKSA/IE1JTl9WQUxVRSA6IFpFUk87XHJcbiAgICBpZiAobXVsdGlwbGllci5lcShNSU5fVkFMVUUpKVxyXG4gICAgICAgIHJldHVybiB0aGlzLmlzT2RkKCkgPyBNSU5fVkFMVUUgOiBaRVJPO1xyXG5cclxuICAgIGlmICh0aGlzLmlzTmVnYXRpdmUoKSkge1xyXG4gICAgICAgIGlmIChtdWx0aXBsaWVyLmlzTmVnYXRpdmUoKSlcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubmVnKCkubXVsKG11bHRpcGxpZXIubmVnKCkpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubmVnKCkubXVsKG11bHRpcGxpZXIpLm5lZygpO1xyXG4gICAgfSBlbHNlIGlmIChtdWx0aXBsaWVyLmlzTmVnYXRpdmUoKSlcclxuICAgICAgICByZXR1cm4gdGhpcy5tdWwobXVsdGlwbGllci5uZWcoKSkubmVnKCk7XHJcblxyXG4gICAgLy8gSWYgYm90aCBsb25ncyBhcmUgc21hbGwsIHVzZSBmbG9hdCBtdWx0aXBsaWNhdGlvblxyXG4gICAgaWYgKHRoaXMubHQoVFdPX1BXUl8yNCkgJiYgbXVsdGlwbGllci5sdChUV09fUFdSXzI0KSlcclxuICAgICAgICByZXR1cm4gZnJvbU51bWJlcih0aGlzLnRvTnVtYmVyKCkgKiBtdWx0aXBsaWVyLnRvTnVtYmVyKCksIHRoaXMudW5zaWduZWQpO1xyXG5cclxuICAgIC8vIERpdmlkZSBlYWNoIGxvbmcgaW50byA0IGNodW5rcyBvZiAxNiBiaXRzLCBhbmQgdGhlbiBhZGQgdXAgNHg0IHByb2R1Y3RzLlxyXG4gICAgLy8gV2UgY2FuIHNraXAgcHJvZHVjdHMgdGhhdCB3b3VsZCBvdmVyZmxvdy5cclxuXHJcbiAgICB2YXIgYTQ4ID0gdGhpcy5oaWdoID4+PiAxNjtcclxuICAgIHZhciBhMzIgPSB0aGlzLmhpZ2ggJiAweEZGRkY7XHJcbiAgICB2YXIgYTE2ID0gdGhpcy5sb3cgPj4+IDE2O1xyXG4gICAgdmFyIGEwMCA9IHRoaXMubG93ICYgMHhGRkZGO1xyXG5cclxuICAgIHZhciBiNDggPSBtdWx0aXBsaWVyLmhpZ2ggPj4+IDE2O1xyXG4gICAgdmFyIGIzMiA9IG11bHRpcGxpZXIuaGlnaCAmIDB4RkZGRjtcclxuICAgIHZhciBiMTYgPSBtdWx0aXBsaWVyLmxvdyA+Pj4gMTY7XHJcbiAgICB2YXIgYjAwID0gbXVsdGlwbGllci5sb3cgJiAweEZGRkY7XHJcblxyXG4gICAgdmFyIGM0OCA9IDAsIGMzMiA9IDAsIGMxNiA9IDAsIGMwMCA9IDA7XHJcbiAgICBjMDAgKz0gYTAwICogYjAwO1xyXG4gICAgYzE2ICs9IGMwMCA+Pj4gMTY7XHJcbiAgICBjMDAgJj0gMHhGRkZGO1xyXG4gICAgYzE2ICs9IGExNiAqIGIwMDtcclxuICAgIGMzMiArPSBjMTYgPj4+IDE2O1xyXG4gICAgYzE2ICY9IDB4RkZGRjtcclxuICAgIGMxNiArPSBhMDAgKiBiMTY7XHJcbiAgICBjMzIgKz0gYzE2ID4+PiAxNjtcclxuICAgIGMxNiAmPSAweEZGRkY7XHJcbiAgICBjMzIgKz0gYTMyICogYjAwO1xyXG4gICAgYzQ4ICs9IGMzMiA+Pj4gMTY7XHJcbiAgICBjMzIgJj0gMHhGRkZGO1xyXG4gICAgYzMyICs9IGExNiAqIGIxNjtcclxuICAgIGM0OCArPSBjMzIgPj4+IDE2O1xyXG4gICAgYzMyICY9IDB4RkZGRjtcclxuICAgIGMzMiArPSBhMDAgKiBiMzI7XHJcbiAgICBjNDggKz0gYzMyID4+PiAxNjtcclxuICAgIGMzMiAmPSAweEZGRkY7XHJcbiAgICBjNDggKz0gYTQ4ICogYjAwICsgYTMyICogYjE2ICsgYTE2ICogYjMyICsgYTAwICogYjQ4O1xyXG4gICAgYzQ4ICY9IDB4RkZGRjtcclxuICAgIHJldHVybiBmcm9tQml0cygoYzE2IDw8IDE2KSB8IGMwMCwgKGM0OCA8PCAxNikgfCBjMzIsIHRoaXMudW5zaWduZWQpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFJldHVybnMgdGhlIHByb2R1Y3Qgb2YgdGhpcyBhbmQgdGhlIHNwZWNpZmllZCBMb25nLiBUaGlzIGlzIGFuIGFsaWFzIG9mIHtAbGluayBMb25nI211bHRpcGx5fS5cclxuICogQGZ1bmN0aW9uXHJcbiAqIEBwYXJhbSB7IUxvbmd8bnVtYmVyfHN0cmluZ30gbXVsdGlwbGllciBNdWx0aXBsaWVyXHJcbiAqIEByZXR1cm5zIHshTG9uZ30gUHJvZHVjdFxyXG4gKi9cclxuTG9uZ1Byb3RvdHlwZS5tdWwgPSBMb25nUHJvdG90eXBlLm11bHRpcGx5O1xyXG5cclxuLyoqXHJcbiAqIFJldHVybnMgdGhpcyBMb25nIGRpdmlkZWQgYnkgdGhlIHNwZWNpZmllZC4gVGhlIHJlc3VsdCBpcyBzaWduZWQgaWYgdGhpcyBMb25nIGlzIHNpZ25lZCBvclxyXG4gKiAgdW5zaWduZWQgaWYgdGhpcyBMb25nIGlzIHVuc2lnbmVkLlxyXG4gKiBAcGFyYW0geyFMb25nfG51bWJlcnxzdHJpbmd9IGRpdmlzb3IgRGl2aXNvclxyXG4gKiBAcmV0dXJucyB7IUxvbmd9IFF1b3RpZW50XHJcbiAqL1xyXG5Mb25nUHJvdG90eXBlLmRpdmlkZSA9IGZ1bmN0aW9uIGRpdmlkZShkaXZpc29yKSB7XHJcbiAgICBpZiAoIWlzTG9uZyhkaXZpc29yKSlcclxuICAgICAgICBkaXZpc29yID0gZnJvbVZhbHVlKGRpdmlzb3IpO1xyXG4gICAgaWYgKGRpdmlzb3IuaXNaZXJvKCkpXHJcbiAgICAgICAgdGhyb3cgRXJyb3IoJ2RpdmlzaW9uIGJ5IHplcm8nKTtcclxuXHJcbiAgICAvLyB1c2Ugd2FzbSBzdXBwb3J0IGlmIHByZXNlbnRcclxuICAgIGlmICh3YXNtKSB7XHJcbiAgICAgICAgLy8gZ3VhcmQgYWdhaW5zdCBzaWduZWQgZGl2aXNpb24gb3ZlcmZsb3c6IHRoZSBsYXJnZXN0XHJcbiAgICAgICAgLy8gbmVnYXRpdmUgbnVtYmVyIC8gLTEgd291bGQgYmUgMSBsYXJnZXIgdGhhbiB0aGUgbGFyZ2VzdFxyXG4gICAgICAgIC8vIHBvc2l0aXZlIG51bWJlciwgZHVlIHRvIHR3bydzIGNvbXBsZW1lbnQuXHJcbiAgICAgICAgaWYgKCF0aGlzLnVuc2lnbmVkICYmXHJcbiAgICAgICAgICAgIHRoaXMuaGlnaCA9PT0gLTB4ODAwMDAwMDAgJiZcclxuICAgICAgICAgICAgZGl2aXNvci5sb3cgPT09IC0xICYmIGRpdmlzb3IuaGlnaCA9PT0gLTEpIHtcclxuICAgICAgICAgICAgLy8gYmUgY29uc2lzdGVudCB3aXRoIG5vbi13YXNtIGNvZGUgcGF0aFxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGxvdyA9ICh0aGlzLnVuc2lnbmVkID8gd2FzbS5kaXZfdSA6IHdhc20uZGl2X3MpKFxyXG4gICAgICAgICAgICB0aGlzLmxvdyxcclxuICAgICAgICAgICAgdGhpcy5oaWdoLFxyXG4gICAgICAgICAgICBkaXZpc29yLmxvdyxcclxuICAgICAgICAgICAgZGl2aXNvci5oaWdoXHJcbiAgICAgICAgKTtcclxuICAgICAgICByZXR1cm4gZnJvbUJpdHMobG93LCB3YXNtLmdldF9oaWdoKCksIHRoaXMudW5zaWduZWQpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmlzWmVybygpKVxyXG4gICAgICAgIHJldHVybiB0aGlzLnVuc2lnbmVkID8gVVpFUk8gOiBaRVJPO1xyXG4gICAgdmFyIGFwcHJveCwgcmVtLCByZXM7XHJcbiAgICBpZiAoIXRoaXMudW5zaWduZWQpIHtcclxuICAgICAgICAvLyBUaGlzIHNlY3Rpb24gaXMgb25seSByZWxldmFudCBmb3Igc2lnbmVkIGxvbmdzIGFuZCBpcyBkZXJpdmVkIGZyb20gdGhlXHJcbiAgICAgICAgLy8gY2xvc3VyZSBsaWJyYXJ5IGFzIGEgd2hvbGUuXHJcbiAgICAgICAgaWYgKHRoaXMuZXEoTUlOX1ZBTFVFKSkge1xyXG4gICAgICAgICAgICBpZiAoZGl2aXNvci5lcShPTkUpIHx8IGRpdmlzb3IuZXEoTkVHX09ORSkpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gTUlOX1ZBTFVFOyAgLy8gcmVjYWxsIHRoYXQgLU1JTl9WQUxVRSA9PSBNSU5fVkFMVUVcclxuICAgICAgICAgICAgZWxzZSBpZiAoZGl2aXNvci5lcShNSU5fVkFMVUUpKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIE9ORTtcclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBBdCB0aGlzIHBvaW50LCB3ZSBoYXZlIHxvdGhlcnwgPj0gMiwgc28gfHRoaXMvb3RoZXJ8IDwgfE1JTl9WQUxVRXwuXHJcbiAgICAgICAgICAgICAgICB2YXIgaGFsZlRoaXMgPSB0aGlzLnNocigxKTtcclxuICAgICAgICAgICAgICAgIGFwcHJveCA9IGhhbGZUaGlzLmRpdihkaXZpc29yKS5zaGwoMSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoYXBwcm94LmVxKFpFUk8pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRpdmlzb3IuaXNOZWdhdGl2ZSgpID8gT05FIDogTkVHX09ORTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVtID0gdGhpcy5zdWIoZGl2aXNvci5tdWwoYXBwcm94KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzID0gYXBwcm94LmFkZChyZW0uZGl2KGRpdmlzb3IpKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmIChkaXZpc29yLmVxKE1JTl9WQUxVRSkpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnVuc2lnbmVkID8gVVpFUk8gOiBaRVJPO1xyXG4gICAgICAgIGlmICh0aGlzLmlzTmVnYXRpdmUoKSkge1xyXG4gICAgICAgICAgICBpZiAoZGl2aXNvci5pc05lZ2F0aXZlKCkpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5uZWcoKS5kaXYoZGl2aXNvci5uZWcoKSk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm5lZygpLmRpdihkaXZpc29yKS5uZWcoKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGRpdmlzb3IuaXNOZWdhdGl2ZSgpKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kaXYoZGl2aXNvci5uZWcoKSkubmVnKCk7XHJcbiAgICAgICAgcmVzID0gWkVSTztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gVGhlIGFsZ29yaXRobSBiZWxvdyBoYXMgbm90IGJlZW4gbWFkZSBmb3IgdW5zaWduZWQgbG9uZ3MuIEl0J3MgdGhlcmVmb3JlXHJcbiAgICAgICAgLy8gcmVxdWlyZWQgdG8gdGFrZSBzcGVjaWFsIGNhcmUgb2YgdGhlIE1TQiBwcmlvciB0byBydW5uaW5nIGl0LlxyXG4gICAgICAgIGlmICghZGl2aXNvci51bnNpZ25lZClcclxuICAgICAgICAgICAgZGl2aXNvciA9IGRpdmlzb3IudG9VbnNpZ25lZCgpO1xyXG4gICAgICAgIGlmIChkaXZpc29yLmd0KHRoaXMpKVxyXG4gICAgICAgICAgICByZXR1cm4gVVpFUk87XHJcbiAgICAgICAgaWYgKGRpdmlzb3IuZ3QodGhpcy5zaHJ1KDEpKSkgLy8gMTUgPj4+IDEgPSA3IDsgd2l0aCBkaXZpc29yID0gOCA7IHRydWVcclxuICAgICAgICAgICAgcmV0dXJuIFVPTkU7XHJcbiAgICAgICAgcmVzID0gVVpFUk87XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUmVwZWF0IHRoZSBmb2xsb3dpbmcgdW50aWwgdGhlIHJlbWFpbmRlciBpcyBsZXNzIHRoYW4gb3RoZXI6ICBmaW5kIGFcclxuICAgIC8vIGZsb2F0aW5nLXBvaW50IHRoYXQgYXBwcm94aW1hdGVzIHJlbWFpbmRlciAvIG90aGVyICpmcm9tIGJlbG93KiwgYWRkIHRoaXNcclxuICAgIC8vIGludG8gdGhlIHJlc3VsdCwgYW5kIHN1YnRyYWN0IGl0IGZyb20gdGhlIHJlbWFpbmRlci4gIEl0IGlzIGNyaXRpY2FsIHRoYXRcclxuICAgIC8vIHRoZSBhcHByb3hpbWF0ZSB2YWx1ZSBpcyBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gdGhlIHJlYWwgdmFsdWUgc28gdGhhdCB0aGVcclxuICAgIC8vIHJlbWFpbmRlciBuZXZlciBiZWNvbWVzIG5lZ2F0aXZlLlxyXG4gICAgcmVtID0gdGhpcztcclxuICAgIHdoaWxlIChyZW0uZ3RlKGRpdmlzb3IpKSB7XHJcbiAgICAgICAgLy8gQXBwcm94aW1hdGUgdGhlIHJlc3VsdCBvZiBkaXZpc2lvbi4gVGhpcyBtYXkgYmUgYSBsaXR0bGUgZ3JlYXRlciBvclxyXG4gICAgICAgIC8vIHNtYWxsZXIgdGhhbiB0aGUgYWN0dWFsIHZhbHVlLlxyXG4gICAgICAgIGFwcHJveCA9IE1hdGgubWF4KDEsIE1hdGguZmxvb3IocmVtLnRvTnVtYmVyKCkgLyBkaXZpc29yLnRvTnVtYmVyKCkpKTtcclxuXHJcbiAgICAgICAgLy8gV2Ugd2lsbCB0d2VhayB0aGUgYXBwcm94aW1hdGUgcmVzdWx0IGJ5IGNoYW5naW5nIGl0IGluIHRoZSA0OC10aCBkaWdpdCBvclxyXG4gICAgICAgIC8vIHRoZSBzbWFsbGVzdCBub24tZnJhY3Rpb25hbCBkaWdpdCwgd2hpY2hldmVyIGlzIGxhcmdlci5cclxuICAgICAgICB2YXIgbG9nMiA9IE1hdGguY2VpbChNYXRoLmxvZyhhcHByb3gpIC8gTWF0aC5MTjIpLFxyXG4gICAgICAgICAgICBkZWx0YSA9IChsb2cyIDw9IDQ4KSA/IDEgOiBwb3dfZGJsKDIsIGxvZzIgLSA0OCksXHJcblxyXG4gICAgICAgIC8vIERlY3JlYXNlIHRoZSBhcHByb3hpbWF0aW9uIHVudGlsIGl0IGlzIHNtYWxsZXIgdGhhbiB0aGUgcmVtYWluZGVyLiAgTm90ZVxyXG4gICAgICAgIC8vIHRoYXQgaWYgaXQgaXMgdG9vIGxhcmdlLCB0aGUgcHJvZHVjdCBvdmVyZmxvd3MgYW5kIGlzIG5lZ2F0aXZlLlxyXG4gICAgICAgICAgICBhcHByb3hSZXMgPSBmcm9tTnVtYmVyKGFwcHJveCksXHJcbiAgICAgICAgICAgIGFwcHJveFJlbSA9IGFwcHJveFJlcy5tdWwoZGl2aXNvcik7XHJcbiAgICAgICAgd2hpbGUgKGFwcHJveFJlbS5pc05lZ2F0aXZlKCkgfHwgYXBwcm94UmVtLmd0KHJlbSkpIHtcclxuICAgICAgICAgICAgYXBwcm94IC09IGRlbHRhO1xyXG4gICAgICAgICAgICBhcHByb3hSZXMgPSBmcm9tTnVtYmVyKGFwcHJveCwgdGhpcy51bnNpZ25lZCk7XHJcbiAgICAgICAgICAgIGFwcHJveFJlbSA9IGFwcHJveFJlcy5tdWwoZGl2aXNvcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBXZSBrbm93IHRoZSBhbnN3ZXIgY2FuJ3QgYmUgemVyby4uLiBhbmQgYWN0dWFsbHksIHplcm8gd291bGQgY2F1c2VcclxuICAgICAgICAvLyBpbmZpbml0ZSByZWN1cnNpb24gc2luY2Ugd2Ugd291bGQgbWFrZSBubyBwcm9ncmVzcy5cclxuICAgICAgICBpZiAoYXBwcm94UmVzLmlzWmVybygpKVxyXG4gICAgICAgICAgICBhcHByb3hSZXMgPSBPTkU7XHJcblxyXG4gICAgICAgIHJlcyA9IHJlcy5hZGQoYXBwcm94UmVzKTtcclxuICAgICAgICByZW0gPSByZW0uc3ViKGFwcHJveFJlbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFJldHVybnMgdGhpcyBMb25nIGRpdmlkZWQgYnkgdGhlIHNwZWNpZmllZC4gVGhpcyBpcyBhbiBhbGlhcyBvZiB7QGxpbmsgTG9uZyNkaXZpZGV9LlxyXG4gKiBAZnVuY3Rpb25cclxuICogQHBhcmFtIHshTG9uZ3xudW1iZXJ8c3RyaW5nfSBkaXZpc29yIERpdmlzb3JcclxuICogQHJldHVybnMgeyFMb25nfSBRdW90aWVudFxyXG4gKi9cclxuTG9uZ1Byb3RvdHlwZS5kaXYgPSBMb25nUHJvdG90eXBlLmRpdmlkZTtcclxuXHJcbi8qKlxyXG4gKiBSZXR1cm5zIHRoaXMgTG9uZyBtb2R1bG8gdGhlIHNwZWNpZmllZC5cclxuICogQHBhcmFtIHshTG9uZ3xudW1iZXJ8c3RyaW5nfSBkaXZpc29yIERpdmlzb3JcclxuICogQHJldHVybnMgeyFMb25nfSBSZW1haW5kZXJcclxuICovXHJcbkxvbmdQcm90b3R5cGUubW9kdWxvID0gZnVuY3Rpb24gbW9kdWxvKGRpdmlzb3IpIHtcclxuICAgIGlmICghaXNMb25nKGRpdmlzb3IpKVxyXG4gICAgICAgIGRpdmlzb3IgPSBmcm9tVmFsdWUoZGl2aXNvcik7XHJcblxyXG4gICAgLy8gdXNlIHdhc20gc3VwcG9ydCBpZiBwcmVzZW50XHJcbiAgICBpZiAod2FzbSkge1xyXG4gICAgICAgIHZhciBsb3cgPSAodGhpcy51bnNpZ25lZCA/IHdhc20ucmVtX3UgOiB3YXNtLnJlbV9zKShcclxuICAgICAgICAgICAgdGhpcy5sb3csXHJcbiAgICAgICAgICAgIHRoaXMuaGlnaCxcclxuICAgICAgICAgICAgZGl2aXNvci5sb3csXHJcbiAgICAgICAgICAgIGRpdmlzb3IuaGlnaFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgcmV0dXJuIGZyb21CaXRzKGxvdywgd2FzbS5nZXRfaGlnaCgpLCB0aGlzLnVuc2lnbmVkKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5zdWIodGhpcy5kaXYoZGl2aXNvcikubXVsKGRpdmlzb3IpKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBSZXR1cm5zIHRoaXMgTG9uZyBtb2R1bG8gdGhlIHNwZWNpZmllZC4gVGhpcyBpcyBhbiBhbGlhcyBvZiB7QGxpbmsgTG9uZyNtb2R1bG99LlxyXG4gKiBAZnVuY3Rpb25cclxuICogQHBhcmFtIHshTG9uZ3xudW1iZXJ8c3RyaW5nfSBkaXZpc29yIERpdmlzb3JcclxuICogQHJldHVybnMgeyFMb25nfSBSZW1haW5kZXJcclxuICovXHJcbkxvbmdQcm90b3R5cGUubW9kID0gTG9uZ1Byb3RvdHlwZS5tb2R1bG87XHJcblxyXG4vKipcclxuICogUmV0dXJucyB0aGlzIExvbmcgbW9kdWxvIHRoZSBzcGVjaWZpZWQuIFRoaXMgaXMgYW4gYWxpYXMgb2Yge0BsaW5rIExvbmcjbW9kdWxvfS5cclxuICogQGZ1bmN0aW9uXHJcbiAqIEBwYXJhbSB7IUxvbmd8bnVtYmVyfHN0cmluZ30gZGl2aXNvciBEaXZpc29yXHJcbiAqIEByZXR1cm5zIHshTG9uZ30gUmVtYWluZGVyXHJcbiAqL1xyXG5Mb25nUHJvdG90eXBlLnJlbSA9IExvbmdQcm90b3R5cGUubW9kdWxvO1xyXG5cclxuLyoqXHJcbiAqIFJldHVybnMgdGhlIGJpdHdpc2UgTk9UIG9mIHRoaXMgTG9uZy5cclxuICogQHJldHVybnMgeyFMb25nfVxyXG4gKi9cclxuTG9uZ1Byb3RvdHlwZS5ub3QgPSBmdW5jdGlvbiBub3QoKSB7XHJcbiAgICByZXR1cm4gZnJvbUJpdHMofnRoaXMubG93LCB+dGhpcy5oaWdoLCB0aGlzLnVuc2lnbmVkKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBSZXR1cm5zIHRoZSBiaXR3aXNlIEFORCBvZiB0aGlzIExvbmcgYW5kIHRoZSBzcGVjaWZpZWQuXHJcbiAqIEBwYXJhbSB7IUxvbmd8bnVtYmVyfHN0cmluZ30gb3RoZXIgT3RoZXIgTG9uZ1xyXG4gKiBAcmV0dXJucyB7IUxvbmd9XHJcbiAqL1xyXG5Mb25nUHJvdG90eXBlLmFuZCA9IGZ1bmN0aW9uIGFuZChvdGhlcikge1xyXG4gICAgaWYgKCFpc0xvbmcob3RoZXIpKVxyXG4gICAgICAgIG90aGVyID0gZnJvbVZhbHVlKG90aGVyKTtcclxuICAgIHJldHVybiBmcm9tQml0cyh0aGlzLmxvdyAmIG90aGVyLmxvdywgdGhpcy5oaWdoICYgb3RoZXIuaGlnaCwgdGhpcy51bnNpZ25lZCk7XHJcbn07XHJcblxyXG4vKipcclxuICogUmV0dXJucyB0aGUgYml0d2lzZSBPUiBvZiB0aGlzIExvbmcgYW5kIHRoZSBzcGVjaWZpZWQuXHJcbiAqIEBwYXJhbSB7IUxvbmd8bnVtYmVyfHN0cmluZ30gb3RoZXIgT3RoZXIgTG9uZ1xyXG4gKiBAcmV0dXJucyB7IUxvbmd9XHJcbiAqL1xyXG5Mb25nUHJvdG90eXBlLm9yID0gZnVuY3Rpb24gb3Iob3RoZXIpIHtcclxuICAgIGlmICghaXNMb25nKG90aGVyKSlcclxuICAgICAgICBvdGhlciA9IGZyb21WYWx1ZShvdGhlcik7XHJcbiAgICByZXR1cm4gZnJvbUJpdHModGhpcy5sb3cgfCBvdGhlci5sb3csIHRoaXMuaGlnaCB8IG90aGVyLmhpZ2gsIHRoaXMudW5zaWduZWQpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFJldHVybnMgdGhlIGJpdHdpc2UgWE9SIG9mIHRoaXMgTG9uZyBhbmQgdGhlIGdpdmVuIG9uZS5cclxuICogQHBhcmFtIHshTG9uZ3xudW1iZXJ8c3RyaW5nfSBvdGhlciBPdGhlciBMb25nXHJcbiAqIEByZXR1cm5zIHshTG9uZ31cclxuICovXHJcbkxvbmdQcm90b3R5cGUueG9yID0gZnVuY3Rpb24geG9yKG90aGVyKSB7XHJcbiAgICBpZiAoIWlzTG9uZyhvdGhlcikpXHJcbiAgICAgICAgb3RoZXIgPSBmcm9tVmFsdWUob3RoZXIpO1xyXG4gICAgcmV0dXJuIGZyb21CaXRzKHRoaXMubG93IF4gb3RoZXIubG93LCB0aGlzLmhpZ2ggXiBvdGhlci5oaWdoLCB0aGlzLnVuc2lnbmVkKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBSZXR1cm5zIHRoaXMgTG9uZyB3aXRoIGJpdHMgc2hpZnRlZCB0byB0aGUgbGVmdCBieSB0aGUgZ2l2ZW4gYW1vdW50LlxyXG4gKiBAcGFyYW0ge251bWJlcnwhTG9uZ30gbnVtQml0cyBOdW1iZXIgb2YgYml0c1xyXG4gKiBAcmV0dXJucyB7IUxvbmd9IFNoaWZ0ZWQgTG9uZ1xyXG4gKi9cclxuTG9uZ1Byb3RvdHlwZS5zaGlmdExlZnQgPSBmdW5jdGlvbiBzaGlmdExlZnQobnVtQml0cykge1xyXG4gICAgaWYgKGlzTG9uZyhudW1CaXRzKSlcclxuICAgICAgICBudW1CaXRzID0gbnVtQml0cy50b0ludCgpO1xyXG4gICAgaWYgKChudW1CaXRzICY9IDYzKSA9PT0gMClcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIGVsc2UgaWYgKG51bUJpdHMgPCAzMilcclxuICAgICAgICByZXR1cm4gZnJvbUJpdHModGhpcy5sb3cgPDwgbnVtQml0cywgKHRoaXMuaGlnaCA8PCBudW1CaXRzKSB8ICh0aGlzLmxvdyA+Pj4gKDMyIC0gbnVtQml0cykpLCB0aGlzLnVuc2lnbmVkKTtcclxuICAgIGVsc2VcclxuICAgICAgICByZXR1cm4gZnJvbUJpdHMoMCwgdGhpcy5sb3cgPDwgKG51bUJpdHMgLSAzMiksIHRoaXMudW5zaWduZWQpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFJldHVybnMgdGhpcyBMb25nIHdpdGggYml0cyBzaGlmdGVkIHRvIHRoZSBsZWZ0IGJ5IHRoZSBnaXZlbiBhbW91bnQuIFRoaXMgaXMgYW4gYWxpYXMgb2Yge0BsaW5rIExvbmcjc2hpZnRMZWZ0fS5cclxuICogQGZ1bmN0aW9uXHJcbiAqIEBwYXJhbSB7bnVtYmVyfCFMb25nfSBudW1CaXRzIE51bWJlciBvZiBiaXRzXHJcbiAqIEByZXR1cm5zIHshTG9uZ30gU2hpZnRlZCBMb25nXHJcbiAqL1xyXG5Mb25nUHJvdG90eXBlLnNobCA9IExvbmdQcm90b3R5cGUuc2hpZnRMZWZ0O1xyXG5cclxuLyoqXHJcbiAqIFJldHVybnMgdGhpcyBMb25nIHdpdGggYml0cyBhcml0aG1ldGljYWxseSBzaGlmdGVkIHRvIHRoZSByaWdodCBieSB0aGUgZ2l2ZW4gYW1vdW50LlxyXG4gKiBAcGFyYW0ge251bWJlcnwhTG9uZ30gbnVtQml0cyBOdW1iZXIgb2YgYml0c1xyXG4gKiBAcmV0dXJucyB7IUxvbmd9IFNoaWZ0ZWQgTG9uZ1xyXG4gKi9cclxuTG9uZ1Byb3RvdHlwZS5zaGlmdFJpZ2h0ID0gZnVuY3Rpb24gc2hpZnRSaWdodChudW1CaXRzKSB7XHJcbiAgICBpZiAoaXNMb25nKG51bUJpdHMpKVxyXG4gICAgICAgIG51bUJpdHMgPSBudW1CaXRzLnRvSW50KCk7XHJcbiAgICBpZiAoKG51bUJpdHMgJj0gNjMpID09PSAwKVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgZWxzZSBpZiAobnVtQml0cyA8IDMyKVxyXG4gICAgICAgIHJldHVybiBmcm9tQml0cygodGhpcy5sb3cgPj4+IG51bUJpdHMpIHwgKHRoaXMuaGlnaCA8PCAoMzIgLSBudW1CaXRzKSksIHRoaXMuaGlnaCA+PiBudW1CaXRzLCB0aGlzLnVuc2lnbmVkKTtcclxuICAgIGVsc2VcclxuICAgICAgICByZXR1cm4gZnJvbUJpdHModGhpcy5oaWdoID4+IChudW1CaXRzIC0gMzIpLCB0aGlzLmhpZ2ggPj0gMCA/IDAgOiAtMSwgdGhpcy51bnNpZ25lZCk7XHJcbn07XHJcblxyXG4vKipcclxuICogUmV0dXJucyB0aGlzIExvbmcgd2l0aCBiaXRzIGFyaXRobWV0aWNhbGx5IHNoaWZ0ZWQgdG8gdGhlIHJpZ2h0IGJ5IHRoZSBnaXZlbiBhbW91bnQuIFRoaXMgaXMgYW4gYWxpYXMgb2Yge0BsaW5rIExvbmcjc2hpZnRSaWdodH0uXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAcGFyYW0ge251bWJlcnwhTG9uZ30gbnVtQml0cyBOdW1iZXIgb2YgYml0c1xyXG4gKiBAcmV0dXJucyB7IUxvbmd9IFNoaWZ0ZWQgTG9uZ1xyXG4gKi9cclxuTG9uZ1Byb3RvdHlwZS5zaHIgPSBMb25nUHJvdG90eXBlLnNoaWZ0UmlnaHQ7XHJcblxyXG4vKipcclxuICogUmV0dXJucyB0aGlzIExvbmcgd2l0aCBiaXRzIGxvZ2ljYWxseSBzaGlmdGVkIHRvIHRoZSByaWdodCBieSB0aGUgZ2l2ZW4gYW1vdW50LlxyXG4gKiBAcGFyYW0ge251bWJlcnwhTG9uZ30gbnVtQml0cyBOdW1iZXIgb2YgYml0c1xyXG4gKiBAcmV0dXJucyB7IUxvbmd9IFNoaWZ0ZWQgTG9uZ1xyXG4gKi9cclxuTG9uZ1Byb3RvdHlwZS5zaGlmdFJpZ2h0VW5zaWduZWQgPSBmdW5jdGlvbiBzaGlmdFJpZ2h0VW5zaWduZWQobnVtQml0cykge1xyXG4gICAgaWYgKGlzTG9uZyhudW1CaXRzKSlcclxuICAgICAgICBudW1CaXRzID0gbnVtQml0cy50b0ludCgpO1xyXG4gICAgbnVtQml0cyAmPSA2MztcclxuICAgIGlmIChudW1CaXRzID09PSAwKVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgdmFyIGhpZ2ggPSB0aGlzLmhpZ2g7XHJcbiAgICAgICAgaWYgKG51bUJpdHMgPCAzMikge1xyXG4gICAgICAgICAgICB2YXIgbG93ID0gdGhpcy5sb3c7XHJcbiAgICAgICAgICAgIHJldHVybiBmcm9tQml0cygobG93ID4+PiBudW1CaXRzKSB8IChoaWdoIDw8ICgzMiAtIG51bUJpdHMpKSwgaGlnaCA+Pj4gbnVtQml0cywgdGhpcy51bnNpZ25lZCk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChudW1CaXRzID09PSAzMilcclxuICAgICAgICAgICAgcmV0dXJuIGZyb21CaXRzKGhpZ2gsIDAsIHRoaXMudW5zaWduZWQpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgcmV0dXJuIGZyb21CaXRzKGhpZ2ggPj4+IChudW1CaXRzIC0gMzIpLCAwLCB0aGlzLnVuc2lnbmVkKTtcclxuICAgIH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBSZXR1cm5zIHRoaXMgTG9uZyB3aXRoIGJpdHMgbG9naWNhbGx5IHNoaWZ0ZWQgdG8gdGhlIHJpZ2h0IGJ5IHRoZSBnaXZlbiBhbW91bnQuIFRoaXMgaXMgYW4gYWxpYXMgb2Yge0BsaW5rIExvbmcjc2hpZnRSaWdodFVuc2lnbmVkfS5cclxuICogQGZ1bmN0aW9uXHJcbiAqIEBwYXJhbSB7bnVtYmVyfCFMb25nfSBudW1CaXRzIE51bWJlciBvZiBiaXRzXHJcbiAqIEByZXR1cm5zIHshTG9uZ30gU2hpZnRlZCBMb25nXHJcbiAqL1xyXG5Mb25nUHJvdG90eXBlLnNocnUgPSBMb25nUHJvdG90eXBlLnNoaWZ0UmlnaHRVbnNpZ25lZDtcclxuXHJcbi8qKlxyXG4gKiBSZXR1cm5zIHRoaXMgTG9uZyB3aXRoIGJpdHMgbG9naWNhbGx5IHNoaWZ0ZWQgdG8gdGhlIHJpZ2h0IGJ5IHRoZSBnaXZlbiBhbW91bnQuIFRoaXMgaXMgYW4gYWxpYXMgb2Yge0BsaW5rIExvbmcjc2hpZnRSaWdodFVuc2lnbmVkfS5cclxuICogQGZ1bmN0aW9uXHJcbiAqIEBwYXJhbSB7bnVtYmVyfCFMb25nfSBudW1CaXRzIE51bWJlciBvZiBiaXRzXHJcbiAqIEByZXR1cm5zIHshTG9uZ30gU2hpZnRlZCBMb25nXHJcbiAqL1xyXG5Mb25nUHJvdG90eXBlLnNocl91ID0gTG9uZ1Byb3RvdHlwZS5zaGlmdFJpZ2h0VW5zaWduZWQ7XHJcblxyXG4vKipcclxuICogQ29udmVydHMgdGhpcyBMb25nIHRvIHNpZ25lZC5cclxuICogQHJldHVybnMgeyFMb25nfSBTaWduZWQgbG9uZ1xyXG4gKi9cclxuTG9uZ1Byb3RvdHlwZS50b1NpZ25lZCA9IGZ1bmN0aW9uIHRvU2lnbmVkKCkge1xyXG4gICAgaWYgKCF0aGlzLnVuc2lnbmVkKVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgcmV0dXJuIGZyb21CaXRzKHRoaXMubG93LCB0aGlzLmhpZ2gsIGZhbHNlKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDb252ZXJ0cyB0aGlzIExvbmcgdG8gdW5zaWduZWQuXHJcbiAqIEByZXR1cm5zIHshTG9uZ30gVW5zaWduZWQgbG9uZ1xyXG4gKi9cclxuTG9uZ1Byb3RvdHlwZS50b1Vuc2lnbmVkID0gZnVuY3Rpb24gdG9VbnNpZ25lZCgpIHtcclxuICAgIGlmICh0aGlzLnVuc2lnbmVkKVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgcmV0dXJuIGZyb21CaXRzKHRoaXMubG93LCB0aGlzLmhpZ2gsIHRydWUpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIENvbnZlcnRzIHRoaXMgTG9uZyB0byBpdHMgYnl0ZSByZXByZXNlbnRhdGlvbi5cclxuICogQHBhcmFtIHtib29sZWFuPX0gbGUgV2hldGhlciBsaXR0bGUgb3IgYmlnIGVuZGlhbiwgZGVmYXVsdHMgdG8gYmlnIGVuZGlhblxyXG4gKiBAcmV0dXJucyB7IUFycmF5LjxudW1iZXI+fSBCeXRlIHJlcHJlc2VudGF0aW9uXHJcbiAqL1xyXG5Mb25nUHJvdG90eXBlLnRvQnl0ZXMgPSBmdW5jdGlvbiB0b0J5dGVzKGxlKSB7XHJcbiAgICByZXR1cm4gbGUgPyB0aGlzLnRvQnl0ZXNMRSgpIDogdGhpcy50b0J5dGVzQkUoKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDb252ZXJ0cyB0aGlzIExvbmcgdG8gaXRzIGxpdHRsZSBlbmRpYW4gYnl0ZSByZXByZXNlbnRhdGlvbi5cclxuICogQHJldHVybnMgeyFBcnJheS48bnVtYmVyPn0gTGl0dGxlIGVuZGlhbiBieXRlIHJlcHJlc2VudGF0aW9uXHJcbiAqL1xyXG5Mb25nUHJvdG90eXBlLnRvQnl0ZXNMRSA9IGZ1bmN0aW9uIHRvQnl0ZXNMRSgpIHtcclxuICAgIHZhciBoaSA9IHRoaXMuaGlnaCxcclxuICAgICAgICBsbyA9IHRoaXMubG93O1xyXG4gICAgcmV0dXJuIFtcclxuICAgICAgICBsbyAgICAgICAgJiAweGZmLFxyXG4gICAgICAgIGxvID4+PiAgOCAmIDB4ZmYsXHJcbiAgICAgICAgbG8gPj4+IDE2ICYgMHhmZixcclxuICAgICAgICBsbyA+Pj4gMjQgICAgICAgLFxyXG4gICAgICAgIGhpICAgICAgICAmIDB4ZmYsXHJcbiAgICAgICAgaGkgPj4+ICA4ICYgMHhmZixcclxuICAgICAgICBoaSA+Pj4gMTYgJiAweGZmLFxyXG4gICAgICAgIGhpID4+PiAyNFxyXG4gICAgXTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDb252ZXJ0cyB0aGlzIExvbmcgdG8gaXRzIGJpZyBlbmRpYW4gYnl0ZSByZXByZXNlbnRhdGlvbi5cclxuICogQHJldHVybnMgeyFBcnJheS48bnVtYmVyPn0gQmlnIGVuZGlhbiBieXRlIHJlcHJlc2VudGF0aW9uXHJcbiAqL1xyXG5Mb25nUHJvdG90eXBlLnRvQnl0ZXNCRSA9IGZ1bmN0aW9uIHRvQnl0ZXNCRSgpIHtcclxuICAgIHZhciBoaSA9IHRoaXMuaGlnaCxcclxuICAgICAgICBsbyA9IHRoaXMubG93O1xyXG4gICAgcmV0dXJuIFtcclxuICAgICAgICBoaSA+Pj4gMjQgICAgICAgLFxyXG4gICAgICAgIGhpID4+PiAxNiAmIDB4ZmYsXHJcbiAgICAgICAgaGkgPj4+ICA4ICYgMHhmZixcclxuICAgICAgICBoaSAgICAgICAgJiAweGZmLFxyXG4gICAgICAgIGxvID4+PiAyNCAgICAgICAsXHJcbiAgICAgICAgbG8gPj4+IDE2ICYgMHhmZixcclxuICAgICAgICBsbyA+Pj4gIDggJiAweGZmLFxyXG4gICAgICAgIGxvICAgICAgICAmIDB4ZmZcclxuICAgIF07XHJcbn07XHJcblxyXG4vKipcclxuICogQ3JlYXRlcyBhIExvbmcgZnJvbSBpdHMgYnl0ZSByZXByZXNlbnRhdGlvbi5cclxuICogQHBhcmFtIHshQXJyYXkuPG51bWJlcj59IGJ5dGVzIEJ5dGUgcmVwcmVzZW50YXRpb25cclxuICogQHBhcmFtIHtib29sZWFuPX0gdW5zaWduZWQgV2hldGhlciB1bnNpZ25lZCBvciBub3QsIGRlZmF1bHRzIHRvIHNpZ25lZFxyXG4gKiBAcGFyYW0ge2Jvb2xlYW49fSBsZSBXaGV0aGVyIGxpdHRsZSBvciBiaWcgZW5kaWFuLCBkZWZhdWx0cyB0byBiaWcgZW5kaWFuXHJcbiAqIEByZXR1cm5zIHtMb25nfSBUaGUgY29ycmVzcG9uZGluZyBMb25nIHZhbHVlXHJcbiAqL1xyXG5Mb25nLmZyb21CeXRlcyA9IGZ1bmN0aW9uIGZyb21CeXRlcyhieXRlcywgdW5zaWduZWQsIGxlKSB7XHJcbiAgICByZXR1cm4gbGUgPyBMb25nLmZyb21CeXRlc0xFKGJ5dGVzLCB1bnNpZ25lZCkgOiBMb25nLmZyb21CeXRlc0JFKGJ5dGVzLCB1bnNpZ25lZCk7XHJcbn07XHJcblxyXG4vKipcclxuICogQ3JlYXRlcyBhIExvbmcgZnJvbSBpdHMgbGl0dGxlIGVuZGlhbiBieXRlIHJlcHJlc2VudGF0aW9uLlxyXG4gKiBAcGFyYW0geyFBcnJheS48bnVtYmVyPn0gYnl0ZXMgTGl0dGxlIGVuZGlhbiBieXRlIHJlcHJlc2VudGF0aW9uXHJcbiAqIEBwYXJhbSB7Ym9vbGVhbj19IHVuc2lnbmVkIFdoZXRoZXIgdW5zaWduZWQgb3Igbm90LCBkZWZhdWx0cyB0byBzaWduZWRcclxuICogQHJldHVybnMge0xvbmd9IFRoZSBjb3JyZXNwb25kaW5nIExvbmcgdmFsdWVcclxuICovXHJcbkxvbmcuZnJvbUJ5dGVzTEUgPSBmdW5jdGlvbiBmcm9tQnl0ZXNMRShieXRlcywgdW5zaWduZWQpIHtcclxuICAgIHJldHVybiBuZXcgTG9uZyhcclxuICAgICAgICBieXRlc1swXSAgICAgICB8XHJcbiAgICAgICAgYnl0ZXNbMV0gPDwgIDggfFxyXG4gICAgICAgIGJ5dGVzWzJdIDw8IDE2IHxcclxuICAgICAgICBieXRlc1szXSA8PCAyNCxcclxuICAgICAgICBieXRlc1s0XSAgICAgICB8XHJcbiAgICAgICAgYnl0ZXNbNV0gPDwgIDggfFxyXG4gICAgICAgIGJ5dGVzWzZdIDw8IDE2IHxcclxuICAgICAgICBieXRlc1s3XSA8PCAyNCxcclxuICAgICAgICB1bnNpZ25lZFxyXG4gICAgKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDcmVhdGVzIGEgTG9uZyBmcm9tIGl0cyBiaWcgZW5kaWFuIGJ5dGUgcmVwcmVzZW50YXRpb24uXHJcbiAqIEBwYXJhbSB7IUFycmF5LjxudW1iZXI+fSBieXRlcyBCaWcgZW5kaWFuIGJ5dGUgcmVwcmVzZW50YXRpb25cclxuICogQHBhcmFtIHtib29sZWFuPX0gdW5zaWduZWQgV2hldGhlciB1bnNpZ25lZCBvciBub3QsIGRlZmF1bHRzIHRvIHNpZ25lZFxyXG4gKiBAcmV0dXJucyB7TG9uZ30gVGhlIGNvcnJlc3BvbmRpbmcgTG9uZyB2YWx1ZVxyXG4gKi9cclxuTG9uZy5mcm9tQnl0ZXNCRSA9IGZ1bmN0aW9uIGZyb21CeXRlc0JFKGJ5dGVzLCB1bnNpZ25lZCkge1xyXG4gICAgcmV0dXJuIG5ldyBMb25nKFxyXG4gICAgICAgIGJ5dGVzWzRdIDw8IDI0IHxcclxuICAgICAgICBieXRlc1s1XSA8PCAxNiB8XHJcbiAgICAgICAgYnl0ZXNbNl0gPDwgIDggfFxyXG4gICAgICAgIGJ5dGVzWzddLFxyXG4gICAgICAgIGJ5dGVzWzBdIDw8IDI0IHxcclxuICAgICAgICBieXRlc1sxXSA8PCAxNiB8XHJcbiAgICAgICAgYnl0ZXNbMl0gPDwgIDggfFxyXG4gICAgICAgIGJ5dGVzWzNdLFxyXG4gICAgICAgIHVuc2lnbmVkXHJcbiAgICApO1xyXG59O1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLkVtZXJpc01lc3NhZ2VNYXBwZXIgPSB2b2lkIDA7XG52YXIgRW1lcmlzTWVzc2FnZU1hcHBlciA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBFbWVyaXNNZXNzYWdlTWFwcGVyKGNoYWluX2lkKSB7XG4gICAgICAgIHRoaXMuY2hhaW5faWQgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMuY2hhaW5faWQgPSBjaGFpbl9pZDtcbiAgICB9XG4gICAgRW1lcmlzTWVzc2FnZU1hcHBlci5wcm90b3R5cGUubWFwID0gZnVuY3Rpb24gKHRyYW5zYWN0aW9uLCBzaWduaW5nX2FkZHJlc3MpIHtcbiAgICAgICAgLy8gQHRzLWV4cGVjdC1lcnJvclxuICAgICAgICByZXR1cm4gdGhpc1t0cmFuc2FjdGlvbi50eXBlXSh0cmFuc2FjdGlvbi5kYXRhLCBzaWduaW5nX2FkZHJlc3MpO1xuICAgIH07XG4gICAgRW1lcmlzTWVzc2FnZU1hcHBlci5wcm90b3R5cGUudHJhbnNmZXIgPSBmdW5jdGlvbiAodHJhbnNhY3Rpb24sIHNpZ25pbmdfYWRkcmVzcykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGlzIG1ldGhvZCBpcyBub3QgaW1wbGVtZW50ZWQgZm9yIFwiICsgdGhpcy5jaGFpbl9pZCk7XG4gICAgfTtcbiAgICBFbWVyaXNNZXNzYWdlTWFwcGVyLnByb3RvdHlwZS5pYmNUcmFuc2ZlciA9IGZ1bmN0aW9uICh0cmFuc2FjdGlvbiwgc2lnbmluZ19hZGRyZXNzKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoaXMgbWV0aG9kIGlzIG5vdCBpbXBsZW1lbnRlZCBmb3IgXCIgKyB0aGlzLmNoYWluX2lkKTtcbiAgICB9O1xuICAgIEVtZXJpc01lc3NhZ2VNYXBwZXIucHJvdG90eXBlLnN3YXAgPSBmdW5jdGlvbiAodHJhbnNhY3Rpb24sIHNpZ25pbmdfYWRkcmVzcykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGlzIG1ldGhvZCBpcyBub3QgaW1wbGVtZW50ZWQgZm9yIFwiICsgdGhpcy5jaGFpbl9pZCk7XG4gICAgfTtcbiAgICBFbWVyaXNNZXNzYWdlTWFwcGVyLnByb3RvdHlwZS5hZGRsaXF1aWRpdHkgPSBmdW5jdGlvbiAodHJhbnNhY3Rpb24sIHNpZ25pbmdfYWRkcmVzcykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGlzIG1ldGhvZCBpcyBub3QgaW1wbGVtZW50ZWQgZm9yIFwiICsgdGhpcy5jaGFpbl9pZCk7XG4gICAgfTtcbiAgICBFbWVyaXNNZXNzYWdlTWFwcGVyLnByb3RvdHlwZS53aXRoZHJhd2xpcXVpZGl0eSA9IGZ1bmN0aW9uICh0cmFuc2FjdGlvbiwgc2lnbmluZ19hZGRyZXNzKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoaXMgbWV0aG9kIGlzIG5vdCBpbXBsZW1lbnRlZCBmb3IgXCIgKyB0aGlzLmNoYWluX2lkKTtcbiAgICB9O1xuICAgIEVtZXJpc01lc3NhZ2VNYXBwZXIucHJvdG90eXBlLmNyZWF0ZXBvb2wgPSBmdW5jdGlvbiAodHJhbnNhY3Rpb24sIHNpZ25pbmdfYWRkcmVzcykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGlzIG1ldGhvZCBpcyBub3QgaW1wbGVtZW50ZWQgZm9yIFwiICsgdGhpcy5jaGFpbl9pZCk7XG4gICAgfTtcbiAgICByZXR1cm4gRW1lcmlzTWVzc2FnZU1hcHBlcjtcbn0oKSk7XG5leHBvcnRzLkVtZXJpc01lc3NhZ2VNYXBwZXIgPSBFbWVyaXNNZXNzYWdlTWFwcGVyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XG4gICAgICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XG4gICAgICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYiwgcCkpIGRbcF0gPSBiW3BdOyB9O1xuICAgICAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICB9O1xuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBpZiAodHlwZW9mIGIgIT09IFwiZnVuY3Rpb25cIiAmJiBiICE9PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNsYXNzIGV4dGVuZHMgdmFsdWUgXCIgKyBTdHJpbmcoYikgKyBcIiBpcyBub3QgYSBjb25zdHJ1Y3RvciBvciBudWxsXCIpO1xuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xuICAgIH07XG59KSgpO1xudmFyIF9fYXNzaWduID0gKHRoaXMgJiYgdGhpcy5fX2Fzc2lnbikgfHwgZnVuY3Rpb24gKCkge1xuICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbih0KSB7XG4gICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSlcbiAgICAgICAgICAgICAgICB0W3BdID0gc1twXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdDtcbiAgICB9O1xuICAgIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufTtcbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG52YXIgYmFzZV8xID0gcmVxdWlyZShcIi4vYmFzZVwiKTtcbnZhciBMb25nID0gcmVxdWlyZShcImxvbmdcIik7XG52YXIgQ29zbW9zQW1pbm9NZXNzYWdlTWFwcGVyID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhDb3Ntb3NBbWlub01lc3NhZ2VNYXBwZXIsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gQ29zbW9zQW1pbm9NZXNzYWdlTWFwcGVyKCkge1xuICAgICAgICByZXR1cm4gX3N1cGVyICE9PSBudWxsICYmIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XG4gICAgfVxuICAgIENvc21vc0FtaW5vTWVzc2FnZU1hcHBlci5wcm90b3R5cGUudHJhbnNmZXIgPSBmdW5jdGlvbiAodHJhbnNhY3Rpb24sIHNpZ25pbmdfYWRkcmVzcykge1xuICAgICAgICByZXR1cm4gW3tcbiAgICAgICAgICAgICAgICB0eXBlOiBcImNvc21vcy1zZGsvTXNnU2VuZFwiLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB7XG4gICAgICAgICAgICAgICAgICAgIGFtb3VudDogW3RyYW5zYWN0aW9uLmFtb3VudF0sXG4gICAgICAgICAgICAgICAgICAgIHRvX2FkZHJlc3M6IHRyYW5zYWN0aW9uLnRvX2FkZHJlc3MsXG4gICAgICAgICAgICAgICAgICAgIGZyb21fYWRkcmVzczogc2lnbmluZ19hZGRyZXNzLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9XTtcbiAgICB9O1xuICAgIENvc21vc0FtaW5vTWVzc2FnZU1hcHBlci5wcm90b3R5cGUuaWJjVHJhbnNmZXIgPSBmdW5jdGlvbiAodHJhbnNhY3Rpb24sIHNpZ25pbmdfYWRkcmVzcykge1xuICAgICAgICByZXR1cm4gW3tcbiAgICAgICAgICAgICAgICB0eXBlOiBcImNvc21vcy1zZGsvTXNnVHJhbnNmZXJcIixcbiAgICAgICAgICAgICAgICB2YWx1ZToge1xuICAgICAgICAgICAgICAgICAgICBzb3VyY2VfcG9ydDogJ3RyYW5zZmVyJyxcbiAgICAgICAgICAgICAgICAgICAgc291cmNlX2NoYW5uZWw6IHRyYW5zYWN0aW9uLnRocm91Z2gsXG4gICAgICAgICAgICAgICAgICAgIHNlbmRlcjogc2lnbmluZ19hZGRyZXNzLFxuICAgICAgICAgICAgICAgICAgICByZWNlaXZlcjogdHJhbnNhY3Rpb24udG9fYWRkcmVzcyxcbiAgICAgICAgICAgICAgICAgICAgdGltZW91dF90aW1lc3RhbXA6IExvbmcuZnJvbVN0cmluZyhuZXcgRGF0ZSgpLmdldFRpbWUoKSArIDMwMDAwMCArICcwMDAwMDAnKSxcbiAgICAgICAgICAgICAgICAgICAgLy90aW1lb3V0SGVpZ2h0OiB7IHJldmlzaW9uSGVpZ2h0OiBcIjEwMDAwMDAwMDAwXCIscmV2aXNpb25OdW1iZXI6XCIwXCJ9LFxuICAgICAgICAgICAgICAgICAgICB0b2tlbjogX19hc3NpZ24oe30sIHRyYW5zYWN0aW9uLmFtb3VudCksXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfV07XG4gICAgfTtcbiAgICBDb3Ntb3NBbWlub01lc3NhZ2VNYXBwZXIucHJvdG90eXBlLnN3YXAgPSBmdW5jdGlvbiAodHJhbnNhY3Rpb24sIHNpZ25pbmdfYWRkcmVzcykge1xuICAgICAgICB2YXIgaXNSZXZlcnNlID0gZmFsc2U7XG4gICAgICAgIGlmICh0cmFuc2FjdGlvbi5mcm9tLmRlbm9tICE9PSB0cmFuc2FjdGlvbi5wb29sLnJlc2VydmVfY29pbl9kZW5vbXNbMF0pIHtcbiAgICAgICAgICAgIGlzUmV2ZXJzZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHByaWNlID0gW3RyYW5zYWN0aW9uLmZyb20sIHRyYW5zYWN0aW9uLnRvXS5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICBpZiAoYS5kZW5vbSA8IGIuZGVub20pXG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgaWYgKGEuZGVub20gPiBiLmRlbm9tKVxuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gW3tcbiAgICAgICAgICAgICAgICB0eXBlOiBcImxpcXVpZGl0eS9Nc2dTd2FwV2l0aGluQmF0Y2hcIixcbiAgICAgICAgICAgICAgICB2YWx1ZToge1xuICAgICAgICAgICAgICAgICAgICBzd2FwX3JlcXVlc3Rlcl9hZGRyZXNzOiBzaWduaW5nX2FkZHJlc3MsXG4gICAgICAgICAgICAgICAgICAgIHBvb2xfaWQ6IHBhcnNlSW50KHRyYW5zYWN0aW9uLnBvb2wuaWQpLFxuICAgICAgICAgICAgICAgICAgICBzd2FwX3R5cGVfaWQ6IHRyYW5zYWN0aW9uLnBvb2wudHlwZV9pZCxcbiAgICAgICAgICAgICAgICAgICAgb2ZmZXJfY29pbjogeyBhbW91bnQ6IHRyYW5zYWN0aW9uLmZyb20uYW1vdW50LCBkZW5vbTogdHJhbnNhY3Rpb24uZnJvbS5kZW5vbSB9LFxuICAgICAgICAgICAgICAgICAgICBkZW1hbmRfY29pbl9kZW5vbTogdHJhbnNhY3Rpb24udG8uZGVub20sXG4gICAgICAgICAgICAgICAgICAgIG9mZmVyX2NvaW5fZGVlOiB0cmFuc2FjdGlvbi5vZmZlckZlZSxcbiAgICAgICAgICAgICAgICAgICAgb3JkZXJfcHJpY2U6IHRyYW5zYWN0aW9uLm9yZGVyUHJpY2VcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XTtcbiAgICB9O1xuICAgIENvc21vc0FtaW5vTWVzc2FnZU1hcHBlci5wcm90b3R5cGUuYWRkbGlxdWlkaXR5ID0gZnVuY3Rpb24gKHRyYW5zYWN0aW9uLCBzaWduaW5nX2FkZHJlc3MpIHtcbiAgICAgICAgdmFyIGRlcG9zaXRDb2lucztcbiAgICAgICAgaWYgKHRyYW5zYWN0aW9uLmNvaW5BLmRlbm9tID4gdHJhbnNhY3Rpb24uY29pbkIuZGVub20pIHtcbiAgICAgICAgICAgIGRlcG9zaXRDb2lucyA9IFt0cmFuc2FjdGlvbi5jb2luQiwgdHJhbnNhY3Rpb24uY29pbkFdO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZGVwb3NpdENvaW5zID0gW3RyYW5zYWN0aW9uLmNvaW5BLCB0cmFuc2FjdGlvbi5jb2luQl07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFt7XG4gICAgICAgICAgICAgICAgdHlwZTogJ2xpcXVpZGl0eS9Nc2dEZXBvc2l0V2l0aGluQmF0Y2gnLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB7XG4gICAgICAgICAgICAgICAgICAgIGRlcG9zaXRvcl9hZGRyZXNzOiBzaWduaW5nX2FkZHJlc3MsXG4gICAgICAgICAgICAgICAgICAgIHBvb2xfaWQ6IHRyYW5zYWN0aW9uLnBvb2wuaWQsXG4gICAgICAgICAgICAgICAgICAgIGRlcG9zaXRfY29pbnM6IGRlcG9zaXRDb2luc1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1dO1xuICAgIH07XG4gICAgQ29zbW9zQW1pbm9NZXNzYWdlTWFwcGVyLnByb3RvdHlwZS53aXRoZHJhd2xpcXVpZGl0eSA9IGZ1bmN0aW9uICh0cmFuc2FjdGlvbiwgc2lnbmluZ19hZGRyZXNzKSB7XG4gICAgICAgIHJldHVybiBbe1xuICAgICAgICAgICAgICAgIHR5cGU6ICdsaXF1aWRpdHkvTXNnV2l0aGRyYXdXaXRoaW5CYXRjaCcsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICAgICAgICAgICAgd2l0aGRyYXdlcl9hZGRyZXNzOiBzaWduaW5nX2FkZHJlc3MsXG4gICAgICAgICAgICAgICAgICAgIHBvb2xfaWQ6IHRyYW5zYWN0aW9uLnBvb2wuaWQsXG4gICAgICAgICAgICAgICAgICAgIHBvb2xfY29pbjogX19hc3NpZ24oe30sIHRyYW5zYWN0aW9uLnBvb2xDb2luKSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfV07XG4gICAgfTtcbiAgICBDb3Ntb3NBbWlub01lc3NhZ2VNYXBwZXIucHJvdG90eXBlLmNyZWF0ZXBvb2wgPSBmdW5jdGlvbiAodHJhbnNhY3Rpb24sIHNpZ25pbmdfYWRkcmVzcykge1xuICAgICAgICB2YXIgZGVwb3NpdENvaW5zO1xuICAgICAgICBpZiAodHJhbnNhY3Rpb24uY29pbkEuZGVub20gPiB0cmFuc2FjdGlvbi5jb2luQi5kZW5vbSkge1xuICAgICAgICAgICAgZGVwb3NpdENvaW5zID0gW3RyYW5zYWN0aW9uLmNvaW5CLCB0cmFuc2FjdGlvbi5jb2luQV07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBkZXBvc2l0Q29pbnMgPSBbdHJhbnNhY3Rpb24uY29pbkEsIHRyYW5zYWN0aW9uLmNvaW5CXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW3tcbiAgICAgICAgICAgICAgICB0eXBlOiAnbGlxdWlkaXR5L01zZ0NyZWF0ZVBvb2wnLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB7XG4gICAgICAgICAgICAgICAgICAgIHBvb2xfY3JlYXRvcl9hZGRyZXNzOiBzaWduaW5nX2FkZHJlc3MsXG4gICAgICAgICAgICAgICAgICAgIHBvb2xfdHlwZV9pZDogMSxcbiAgICAgICAgICAgICAgICAgICAgZGVwb3NpdF9jb2luczogZGVwb3NpdENvaW5zLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9XTtcbiAgICB9O1xuICAgIHJldHVybiBDb3Ntb3NBbWlub01lc3NhZ2VNYXBwZXI7XG59KGJhc2VfMS5FbWVyaXNNZXNzYWdlTWFwcGVyKSk7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IENvc21vc0FtaW5vTWVzc2FnZU1hcHBlcjtcbiIsIid1c2Ugc3RyaWN0JztcbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG52YXIgY29zbW9zX2FtaW5vXzEgPSByZXF1aXJlKFwiLi9jb3Ntb3NfYW1pbm9cIik7XG52YXIgZW1lcmlzTWFwcGVyID0ge1xuICAgIENvc21vc0FtaW5vTWVzc2FnZU1hcHBlcjogY29zbW9zX2FtaW5vXzFbXCJkZWZhdWx0XCJdXG59O1xubW9kdWxlLmV4cG9ydHMgPSBlbWVyaXNNYXBwZXI7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvaW5kZXgudHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=