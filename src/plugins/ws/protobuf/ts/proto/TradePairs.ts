// @generated by protobuf-ts 2.9.1 with parameter long_type_string
// @generated from protobuf file "proto/TradePairs.proto" (syntax proto3)
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
 * @generated from protobuf message TradePairs
 */
export interface TradePairs {
    /**
     * @generated from protobuf field: repeated TradePairs.TradePair list = 1;
     */
    list: TradePairs_TradePair[];
}
/**
 * @generated from protobuf message TradePairs.TradePair
 */
export interface TradePairs_TradePair {
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
    time: string; // 时间    /**
     * @generated from protobuf field: string quoteVolume = 8;
     */
    quoteVolume: string;
    /**
     * @generated from protobuf field: string symbolWassName = 9;
     */
    symbolWassName: string;
}
// @generated message type with reflection information, may provide speed optimized methods
class TradePairs$Type extends MessageType<TradePairs> {
    constructor() {
        super("TradePairs", [
            { no: 1, name: "list", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => TradePairs_TradePair }
        ]);
    }
    create(value?: PartialMessage<TradePairs>): TradePairs {
        const message = { list: [] };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<TradePairs>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TradePairs): TradePairs {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* repeated TradePairs.TradePair list */ 1:
                    message.list.push(TradePairs_TradePair.internalBinaryRead(reader, reader.uint32(), options));
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
    internalBinaryWrite(message: TradePairs, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* repeated TradePairs.TradePair list = 1; */
        for (let i = 0; i < message.list.length; i++)
            TradePairs_TradePair.internalBinaryWrite(message.list[i], writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message TradePairs
 */
export const TradePairs = new TradePairs$Type();
// @generated message type with reflection information, may provide speed optimized methods
class TradePairs_TradePair$Type extends MessageType<TradePairs_TradePair> {
    constructor() {
        super("TradePairs.TradePair", [
            { no: 1, name: "high", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "low", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "volume", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 4, name: "last", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 5, name: "open", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 6, name: "chg", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 7, name: "time", kind: "scalar", T: 3 /*ScalarType.INT64*/ },
            { no: 8, name: "quoteVolume", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 9, name: "symbolWassName", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value?: PartialMessage<TradePairs_TradePair>): TradePairs_TradePair {
        const message = { high: "", low: "", volume: "", last: "", open: "", chg: "", time: "0", quoteVolume: "", symbolWassName: "" };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<TradePairs_TradePair>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TradePairs_TradePair): TradePairs_TradePair {
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
                case /* string symbolWassName */ 9:
                    message.symbolWassName = reader.string();
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
    internalBinaryWrite(message: TradePairs_TradePair, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
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
        /* string symbolWassName = 9; */
        if (message.symbolWassName !== "")
            writer.tag(9, WireType.LengthDelimited).string(message.symbolWassName);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message TradePairs.TradePair
 */
export const TradePairs_TradePair = new TradePairs_TradePair$Type();
