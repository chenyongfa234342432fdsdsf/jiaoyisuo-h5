// @generated by protobuf-ts 2.9.1 with parameter long_type_string
// @generated from protobuf file "proto/OptionPlanOrder.proto" (syntax proto3)
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
 * @generated from protobuf message OptionPlanOrder
 */
export interface OptionPlanOrder {
    /**
     * @generated from protobuf field: repeated OptionPlanOrder.Body optionPlanOrder = 1;
     */
    optionPlanOrder: OptionPlanOrder_Body[];
}
/**
 * @generated from protobuf message OptionPlanOrder.Body
 */
export interface OptionPlanOrder_Body {
    /**
     * @generated from protobuf field: sint64 uid = 1;
     */
    uid: string;
    /**
     * @generated from protobuf field: sint64 orderId = 2;
     */
    orderId: string;
    /**
     * @generated from protobuf field: sint64 businessId = 3;
     */
    businessId: string;
    /**
     * @generated from protobuf field: string orderState = 4;
     */
    orderState: string;
    /**
     * @generated from protobuf field: sint64 optionId = 5;
     */
    optionId: string;
    /**
     * @generated from protobuf field: string symbol = 6;
     */
    symbol: string;
}
// @generated message type with reflection information, may provide speed optimized methods
class OptionPlanOrder$Type extends MessageType<OptionPlanOrder> {
    constructor() {
        super("OptionPlanOrder", [
            { no: 1, name: "optionPlanOrder", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => OptionPlanOrder_Body }
        ]);
    }
    create(value?: PartialMessage<OptionPlanOrder>): OptionPlanOrder {
        const message = { optionPlanOrder: [] };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<OptionPlanOrder>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: OptionPlanOrder): OptionPlanOrder {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* repeated OptionPlanOrder.Body optionPlanOrder */ 1:
                    message.optionPlanOrder.push(OptionPlanOrder_Body.internalBinaryRead(reader, reader.uint32(), options));
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
    internalBinaryWrite(message: OptionPlanOrder, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* repeated OptionPlanOrder.Body optionPlanOrder = 1; */
        for (let i = 0; i < message.optionPlanOrder.length; i++)
            OptionPlanOrder_Body.internalBinaryWrite(message.optionPlanOrder[i], writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message OptionPlanOrder
 */
export const OptionPlanOrder = new OptionPlanOrder$Type();
// @generated message type with reflection information, may provide speed optimized methods
class OptionPlanOrder_Body$Type extends MessageType<OptionPlanOrder_Body> {
    constructor() {
        super("OptionPlanOrder.Body", [
            { no: 1, name: "uid", kind: "scalar", T: 18 /*ScalarType.SINT64*/ },
            { no: 2, name: "orderId", kind: "scalar", T: 18 /*ScalarType.SINT64*/ },
            { no: 3, name: "businessId", kind: "scalar", T: 18 /*ScalarType.SINT64*/ },
            { no: 4, name: "orderState", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 5, name: "optionId", kind: "scalar", T: 18 /*ScalarType.SINT64*/ },
            { no: 6, name: "symbol", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value?: PartialMessage<OptionPlanOrder_Body>): OptionPlanOrder_Body {
        const message = { uid: "0", orderId: "0", businessId: "0", orderState: "", optionId: "0", symbol: "" };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<OptionPlanOrder_Body>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: OptionPlanOrder_Body): OptionPlanOrder_Body {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* sint64 uid */ 1:
                    message.uid = reader.sint64().toString();
                    break;
                case /* sint64 orderId */ 2:
                    message.orderId = reader.sint64().toString();
                    break;
                case /* sint64 businessId */ 3:
                    message.businessId = reader.sint64().toString();
                    break;
                case /* string orderState */ 4:
                    message.orderState = reader.string();
                    break;
                case /* sint64 optionId */ 5:
                    message.optionId = reader.sint64().toString();
                    break;
                case /* string symbol */ 6:
                    message.symbol = reader.string();
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
    internalBinaryWrite(message: OptionPlanOrder_Body, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* sint64 uid = 1; */
        if (message.uid !== "0")
            writer.tag(1, WireType.Varint).sint64(message.uid);
        /* sint64 orderId = 2; */
        if (message.orderId !== "0")
            writer.tag(2, WireType.Varint).sint64(message.orderId);
        /* sint64 businessId = 3; */
        if (message.businessId !== "0")
            writer.tag(3, WireType.Varint).sint64(message.businessId);
        /* string orderState = 4; */
        if (message.orderState !== "")
            writer.tag(4, WireType.LengthDelimited).string(message.orderState);
        /* sint64 optionId = 5; */
        if (message.optionId !== "0")
            writer.tag(5, WireType.Varint).sint64(message.optionId);
        /* string symbol = 6; */
        if (message.symbol !== "")
            writer.tag(6, WireType.LengthDelimited).string(message.symbol);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message OptionPlanOrder.Body
 */
export const OptionPlanOrder_Body = new OptionPlanOrder_Body$Type();
