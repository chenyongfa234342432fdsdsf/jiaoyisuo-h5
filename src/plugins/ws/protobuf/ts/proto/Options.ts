// @generated by protobuf-ts 2.9.1 with parameter long_type_string
// @generated from protobuf file "proto/Options.proto" (syntax proto3)
// tslint:disable
import type { BinaryWriteOptions } from "@protobuf-ts/runtime";
import type { IBinaryWriter } from "@protobuf-ts/runtime";
import { WireType } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MESSAGE_TYPE } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";
/**
 * @generated from protobuf message Options
 */
export interface Options {
    /**
     * @generated from protobuf field: repeated Options.Option list = 1;
     */
    list: Options_Option[];
}
/**
 * @generated from protobuf message Options.Option
 */
export interface Options_Option {
    /**
     * @generated from protobuf field: string high = 1;
     */
    high: string;
    /**
     * @generated from protobuf field: string low = 2;
     */
    low: string;
    /**
     * @generated from protobuf field: string volume = 3;
     */
    volume: string;
    /**
     * @generated from protobuf field: string last = 4;
     */
    last: string;
    /**
     * @generated from protobuf field: string open = 5;
     */
    open: string;
    /**
     * @generated from protobuf field: string chg = 6;
     */
    chg: string;
    /**
     * @generated from protobuf field: int64 time = 7;
     */
    time: string; // 时间
    /**
     * @generated from protobuf field: string quoteVolume = 8;
     */
    quoteVolume: string;
    /**
     * @generated from protobuf field: string symbol = 9;
     */
    symbol: string;
    /**
     * @generated from protobuf field: string optionId = 10;
     */
    optionId: string;
}
// @generated message type with reflection information, may provide speed optimized methods
class Options$Type extends MessageType<Options> {
    constructor() {
        super("Options", [
            { no: 1, name: "list", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => Options_Option }
        ]);
    }
    create(value?: PartialMessage<Options>): Options {
        const message = { list: [] };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<Options>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Options): Options {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* repeated Options.Option list */ 1:
                    message.list.push(Options_Option.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: Options, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* repeated Options.Option list = 1; */
        for (let i = 0; i < message.list.length; i++)
            Options_Option.internalBinaryWrite(message.list[i], writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message Options
 */
export const Options = new Options$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Options_Option$Type extends MessageType<Options_Option> {
    constructor() {
        super("Options.Option", [
            { no: 1, name: "high", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "low", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "volume", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 4, name: "last", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 5, name: "open", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 6, name: "chg", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 7, name: "time", kind: "scalar", T: 3 /*ScalarType.INT64*/ },
            { no: 8, name: "quoteVolume", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 9, name: "symbol", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 10, name: "optionId", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value?: PartialMessage<Options_Option>): Options_Option {
        const message = { high: "", low: "", volume: "", last: "", open: "", chg: "", time: "0", quoteVolume: "", symbol: "", optionId: "" };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<Options_Option>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Options_Option): Options_Option {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string high */ 1:
                    message.high = reader.string();
                    break;
                case /* string low */ 2:
                    message.low = reader.string();
                    break;
                case /* string volume */ 3:
                    message.volume = reader.string();
                    break;
                case /* string last */ 4:
                    message.last = reader.string();
                    break;
                case /* string open */ 5:
                    message.open = reader.string();
                    break;
                case /* string chg */ 6:
                    message.chg = reader.string();
                    break;
                case /* int64 time */ 7:
                    message.time = reader.int64().toString();
                    break;
                case /* string quoteVolume */ 8:
                    message.quoteVolume = reader.string();
                    break;
                case /* string symbol */ 9:
                    message.symbol = reader.string();
                    break;
                case /* string optionId */ 10:
                    message.optionId = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: Options_Option, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* string high = 1; */
        if (message.high !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.high);
        /* string low = 2; */
        if (message.low !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.low);
        /* string volume = 3; */
        if (message.volume !== "")
            writer.tag(3, WireType.LengthDelimited).string(message.volume);
        /* string last = 4; */
        if (message.last !== "")
            writer.tag(4, WireType.LengthDelimited).string(message.last);
        /* string open = 5; */
        if (message.open !== "")
            writer.tag(5, WireType.LengthDelimited).string(message.open);
        /* string chg = 6; */
        if (message.chg !== "")
            writer.tag(6, WireType.LengthDelimited).string(message.chg);
        /* int64 time = 7; */
        if (message.time !== "0")
            writer.tag(7, WireType.Varint).int64(message.time);
        /* string quoteVolume = 8; */
        if (message.quoteVolume !== "")
            writer.tag(8, WireType.LengthDelimited).string(message.quoteVolume);
        /* string symbol = 9; */
        if (message.symbol !== "")
            writer.tag(9, WireType.LengthDelimited).string(message.symbol);
        /* string optionId = 10; */
        if (message.optionId !== "")
            writer.tag(10, WireType.LengthDelimited).string(message.optionId);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message Options.Option
 */
export const Options_Option = new Options_Option$Type();
