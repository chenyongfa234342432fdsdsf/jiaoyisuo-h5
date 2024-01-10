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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import React, { useRef, useImperativeHandle, useEffect } from 'react';
import cs from '../_util/classNames';
import omit from '../_util/omit';
import ResizeObserver from '../_util/resizeObserver';
import IconClose from '../../icon/react-icon/IconClose';
import IconHover from '../_class/icon-hover';
import { isObject } from '../_util/is';
import useComposition from './useComposition';
var InputComponent = React.forwardRef(function (props, ref) {
    var _a;
    var allowClear = props.allowClear, error = props.error, disabled = props.disabled, placeholder = props.placeholder, className = props.className, style = props.style, height = props.height, prefixCls = props.prefixCls, hasParent = props.hasParent, size = props.size, value = props.value, autoFitWidth = props.autoFitWidth, onClear = props.onClear, readOnly = props.readOnly, onChange = props.onChange, onKeyDown = props.onKeyDown, onPressEnter = props.onPressEnter, propMaxLength = props.maxLength, rest = __rest(props, ["allowClear", "error", "disabled", "placeholder", "className", "style", "height", "prefixCls", "hasParent", "size", "value", "autoFitWidth", "onClear", "readOnly", "onChange", "onKeyDown", "onPressEnter", "maxLength"]);
    var otherProps = omit(rest, [
        'showWordLimit',
        'className',
        'defaultValue',
        'addBefore',
        'addAfter',
        'afterStyle',
        'beforeStyle',
        'prefix',
        'suffix',
    ]);
    var refInput = useRef();
    var refInputMirror = useRef();
    var refPrevInputWidth = useRef(null);
    var maxLength = isObject(propMaxLength)
        ? propMaxLength.errorOnly
            ? undefined
            : propMaxLength.length
        : propMaxLength;
    var _b = useComposition({ value: value, maxLength: maxLength, onChange: onChange, onKeyDown: onKeyDown, onPressEnter: onPressEnter }), compositionValue = _b.compositionValue, valueChangeHandler = _b.valueChangeHandler, compositionHandler = _b.compositionHandler, keyDownHandler = _b.keyDownHandler, triggerValueChangeCallback = _b.triggerValueChangeCallback;
    var inputClassNames = cs(prefixCls, prefixCls && (_a = {},
        _a[prefixCls + "-size-" + size] = size,
        _a[prefixCls + "-error"] = error,
        _a[prefixCls + "-disabled"] = disabled,
        _a), hasParent ? undefined : className);
    useImperativeHandle(ref, function () {
        return {
            dom: refInput.current,
            focus: function () {
                refInput.current && refInput.current.focus && refInput.current.focus();
            },
            blur: function () {
                refInput.current && refInput.current.blur && refInput.current.blur();
            },
        };
    }, []);
    var updateInputWidth = function () {
        if (refInputMirror.current && refInput.current) {
            var width = refInputMirror.current.offsetWidth;
            refInput.current.style.width = width + (width ? 8 : 4) + "px";
        }
    };
    // 设定 <input> 初始宽度，之后的更新交由 ResizeObserver 触发
    useEffect(function () { return autoFitWidth && updateInputWidth(); }, []);
    var inputProps = __assign(__assign({ 'aria-invalid': error }, otherProps), { readOnly: readOnly, maxLength: maxLength, disabled: disabled, placeholder: placeholder, value: compositionValue || value || '', className: inputClassNames, onKeyDown: keyDownHandler, onChange: valueChangeHandler, onCompositionStart: compositionHandler, onCompositionUpdate: compositionHandler, onCompositionEnd: compositionHandler });
    var mirrorValue = inputProps.value || placeholder;
    return (React.createElement(React.Fragment, null,
        allowClear ? (React.createElement(React.Fragment, null,
            React.createElement("input", __assign({ ref: refInput }, inputProps)),
            !readOnly && !disabled && allowClear && value ? (React.createElement(IconHover, { className: prefixCls + "-clear-icon", onClick: function (e) {
                    e.stopPropagation();
                    if (refInput.current && refInput.current.focus) {
                        refInput.current.focus();
                    }
                    triggerValueChangeCallback('', e);
                    onClear && onClear();
                } },
                React.createElement(IconClose
                // keep focus status
                , { 
                    // keep focus status
                    onMouseDown: function (e) {
                        e.preventDefault();
                    } }))) : null)) : (React.createElement("input", __assign({ ref: refInput }, inputProps, { style: hasParent ? {} : __assign(__assign({}, style), ('height' in props ? { height: height } : {})) }))),
        autoFitWidth && (React.createElement(ResizeObserver, { onResize: function () {
                var inputWidth = refInputMirror.current.offsetWidth;
                if (typeof autoFitWidth === 'object') {
                    var delay = typeof autoFitWidth.delay === 'function'
                        ? autoFitWidth.delay(inputWidth, refPrevInputWidth.current)
                        : autoFitWidth.delay;
                    delay ? setTimeout(updateInputWidth, delay) : updateInputWidth();
                }
                else {
                    updateInputWidth();
                }
                refPrevInputWidth.current = inputWidth;
            } },
            React.createElement("span", { className: prefixCls + "-mirror", ref: refInputMirror }, mirrorValue && mirrorValue.replace(/\s/g, '\u00A0'))))));
});
InputComponent.displayName = 'InputComponent';
export default InputComponent;
