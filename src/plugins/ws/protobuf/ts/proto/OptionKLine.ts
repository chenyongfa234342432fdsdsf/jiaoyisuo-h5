// @generated by protobuf-ts 2.9.1 with parameter long_type_string
// @generated from protobuf file "proto/OptionKLine.proto" (syntax proto3)
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
 * @generated from protobuf message OptionKLine
 */
export interface OptionKLine {
    /**
     * @generated from protobuf field: int64 time = 1;
     */
    time: string;
    /**
     * @generated from protobuf field: string high = 2;
     */
    high: string;
    /**
     * @generated from protobuf field: string low = 3;
     */
    low: string;
    /**
     * @generated from protobuf field: string close = 4;
     */
    close: string;
    /**
     * @generated from protobuf field: string volume = 5;
     */
    volume: string;
    /**
     * @generated from protobuf field: string period = 6;
     */
    period: string;
    /**
     * @generated from protobuf field: string open = 7;
     */
    open: string;
    /**
     * @generated from protobuf field: string symbol = 8;
     */
    symbol: string;
    /**
     * @generated from protobuf field: string quoteVolume = 9;
     */
    quoteVolume: string;
    /**
     * @generated from protobuf field: string chg = 10;
     */
    chg: string;
    /**
     * @generated from protobuf field: string optionId = 11;
     */
    optionId: string;
}
// @generated message type with reflection information, may provide speed optimized methods
class OptionKLine$Type extends MessageType<OptionKLine> {
    constructor() {
        super("OptionKLine", [
            { no: 1, name: "time", kind: "scalar", T: 3 /*ScalarType.INT64*/ },
            { no: 2, name: "high", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "low", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 4, name: "close", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 5, name: "volume", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 6, name: "period", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 7, name: "open", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 8, name: "symbol", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 9, name: "quoteVolume", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 10, name: "chg", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 11, name: "optionId", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value?: PartialMessage<OptionKLine>): OptionKLine {
        const message = { time: "0", high: "", low: "", close: "", volume: "", period: "", open: "", symbol: "", quoteVolume: "", chg: "", optionId: "" };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<OptionKLine>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: OptionKLine): OptionKLine {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int64 time */ 1:
                    message.time = reader.int64().toString();
                    break;
                case /* string high */ 2:
                    message.high = reader.string();
                    break;
                case /* string low */ 3:
                    message.low = reader.string();
                    break;
                case /* string close */ 4:
                    message.close = reader.string();
                    break;
                case /* string volume */ 5:
                    message.volume = reader.string();
                    break;
                case /* string period */ 6:
                    message.period = reader.string();
                    break;
                case /* string open */ 7:
                    message.open = reader.string();
                    break;
                case /* string symbol */ 8:
                    message.symbol = reader.string();
                    break;
                case /* string quoteVolume */ 9:
                    message.quoteVolume = reader.string();
                    break;
                case /* string chg */ 10:
                    message.chg = reader.string();
                    break;
                case /* string optionId */ 11:
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
    internalBinaryWrite(message: OptionKLine, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* int64 time = 1; */
        if (message.time !== "0")
            writer.tag(1, WireType.Varint).int64(message.time);
        /* string high = 2; */
        if (message.high !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.high);
        /* string low = 3; */
        if (message.low !== "")
            writer.tag(3, WireType.LengthDelimited).string(message.low);
        /* string close = 4; */
        if (message.close !== "")
            writer.tag(4, WireType.LengthDelimited).string(message.close);
        /* string volume = 5; */
        if (message.volume !== "")
            writer.tag(5, WireType.LengthDelimited).string(message.volume);
        /* string period = 6; */
        if (message.period !== "")
            writer.tag(6, WireType.LengthDelimited).string(message.period);
        /* string open = 7; */
        if (message.open !== "")
            writer.tag(7, WireType.LengthDelimited).string(message.open);
        /* string symbol = 8; */
        if (message.symbol !== "")
            writer.tag(8, WireType.LengthDelimited).string(message.symbol);
        /* string quoteVolume = 9; */
        if (message.quoteVolume !== "")
            writer.tag(9, WireType.LengthDelimited).string(message.quoteVolume);
        /* string chg = 10; */
        if (message.chg !== "")
            writer.tag(10, WireType.LengthDelimited).string(message.chg);
        /* string optionId = 11; */
        if (message.optionId !== "")
            writer.tag(11, WireType.LengthDelimited).string(message.optionId);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message OptionKLine
 */
export const OptionKLine = new OptionKLine$Type();
