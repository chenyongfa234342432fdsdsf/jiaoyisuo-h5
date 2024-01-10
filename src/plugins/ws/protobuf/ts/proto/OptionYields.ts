// @generated by protobuf-ts 2.9.1 with parameter long_type_string
// @generated from protobuf file "proto/OptionYields.proto" (syntax proto3)
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
 * @generated from protobuf message OptionYields
 */
export interface OptionYields {
    /**
     * @generated from protobuf field: int64 time = 1;
     */
    time: string;
    /**
     * @generated from protobuf field: repeated OptionYields.Yield list = 2;
     */
    list: OptionYields_Yield[];
}
/**
 * @generated from protobuf message OptionYields.Yield
 */
export interface OptionYields_Yield {
    /**
     * @generated from protobuf field: int64 optionId = 1;
     */
    optionId: string;
    /**
     * @generated from protobuf field: int64 periodId = 2;
     */
    periodId: string;
    /**
     * @generated from protobuf field: string sideInd = 3;
     */
    sideInd: string;
    /**
     * @generated from protobuf field: string amplitude = 4;
     */
    amplitude: string;
    /**
     * @generated from protobuf field: string yieldRate = 5;
     */
    yieldRate: string;
}
// @generated message type with reflection information, may provide speed optimized methods
class OptionYields$Type extends MessageType<OptionYields> {
    constructor() {
        super("OptionYields", [
            { no: 1, name: "time", kind: "scalar", T: 3 /*ScalarType.INT64*/ },
            { no: 2, name: "list", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => OptionYields_Yield }
        ]);
    }
    create(value?: PartialMessage<OptionYields>): OptionYields {
        const message = { time: "0", list: [] };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<OptionYields>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: OptionYields): OptionYields {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int64 time */ 1:
                    message.time = reader.int64().toString();
                    break;
                case /* repeated OptionYields.Yield list */ 2:
                    message.list.push(OptionYields_Yield.internalBinaryRead(reader, reader.uint32(), options));
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
    internalBinaryWrite(message: OptionYields, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* int64 time = 1; */
        if (message.time !== "0")
            writer.tag(1, WireType.Varint).int64(message.time);
        /* repeated OptionYields.Yield list = 2; */
        for (let i = 0; i < message.list.length; i++)
            OptionYields_Yield.internalBinaryWrite(message.list[i], writer.tag(2, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message OptionYields
 */
export const OptionYields = new OptionYields$Type();
// @generated message type with reflection information, may provide speed optimized methods
class OptionYields_Yield$Type extends MessageType<OptionYields_Yield> {
    constructor() {
        super("OptionYields.Yield", [
            { no: 1, name: "optionId", kind: "scalar", T: 3 /*ScalarType.INT64*/ },
            { no: 2, name: "periodId", kind: "scalar", T: 3 /*ScalarType.INT64*/ },
            { no: 3, name: "sideInd", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 4, name: "amplitude", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 5, name: "yieldRate", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value?: PartialMessage<OptionYields_Yield>): OptionYields_Yield {
        const message = { optionId: "0", periodId: "0", sideInd: "", amplitude: "", yieldRate: "" };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<OptionYields_Yield>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: OptionYields_Yield): OptionYields_Yield {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int64 optionId */ 1:
                    message.optionId = reader.int64().toString();
                    break;
                case /* int64 periodId */ 2:
                    message.periodId = reader.int64().toString();
                    break;
                case /* string sideInd */ 3:
                    message.sideInd = reader.string();
                    break;
                case /* string amplitude */ 4:
                    message.amplitude = reader.string();
                    break;
                case /* string yieldRate */ 5:
                    message.yieldRate = reader.string();
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
    internalBinaryWrite(message: OptionYields_Yield, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* int64 optionId = 1; */
        if (message.optionId !== "0")
            writer.tag(1, WireType.Varint).int64(message.optionId);
        /* int64 periodId = 2; */
        if (message.periodId !== "0")
            writer.tag(2, WireType.Varint).int64(message.periodId);
        /* string sideInd = 3; */
        if (message.sideInd !== "")
            writer.tag(3, WireType.LengthDelimited).string(message.sideInd);
        /* string amplitude = 4; */
        if (message.amplitude !== "")
            writer.tag(4, WireType.LengthDelimited).string(message.amplitude);
        /* string yieldRate = 5; */
        if (message.yieldRate !== "")
            writer.tag(5, WireType.LengthDelimited).string(message.yieldRate);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message OptionYields.Yield
 */
export const OptionYields_Yield = new OptionYields_Yield$Type();