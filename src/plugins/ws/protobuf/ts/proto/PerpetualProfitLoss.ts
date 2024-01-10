// @generated by protobuf-ts 2.9.1 with parameter long_type_string
// @generated from protobuf file "proto/PerpetualProfitLoss.proto" (syntax proto3)
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
 * @generated from protobuf message PerpetualProfitLoss
 */
export interface PerpetualProfitLoss {
    /**
     * @generated from protobuf field: sint64 uid = 1;
     */
    uid: string;
    /**
     * @generated from protobuf field: sint64 groupId = 2;
     */
    groupId: string;
    /**
     * @generated from protobuf field: sint64 orderId = 3;
     */
    orderId: string;
    /**
     * @generated from protobuf field: int32 businessId = 4;
     */
    businessId: number;
    /**
     * @generated from protobuf field: string orderState = 5;
     */
    orderState: string;
    /**
     * @generated from protobuf field: int32 tradeId = 6;
     */
    tradeId: number;
    /**
     * @generated from protobuf field: string symbol = 7;
     */
    symbol: string;
    /**
     * @generated from protobuf field: string reason = 8;
     */
    reason: string;
}
// @generated message type with reflection information, may provide speed optimized methods
class PerpetualProfitLoss$Type extends MessageType<PerpetualProfitLoss> {
    constructor() {
        super("PerpetualProfitLoss", [
            { no: 1, name: "uid", kind: "scalar", T: 18 /*ScalarType.SINT64*/ },
            { no: 2, name: "groupId", kind: "scalar", T: 18 /*ScalarType.SINT64*/ },
            { no: 3, name: "orderId", kind: "scalar", T: 18 /*ScalarType.SINT64*/ },
            { no: 4, name: "businessId", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 5, name: "orderState", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 6, name: "tradeId", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 7, name: "symbol", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 8, name: "reason", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value?: PartialMessage<PerpetualProfitLoss>): PerpetualProfitLoss {
        const message = { uid: "0", groupId: "0", orderId: "0", businessId: 0, orderState: "", tradeId: 0, symbol: "", reason: "" };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<PerpetualProfitLoss>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: PerpetualProfitLoss): PerpetualProfitLoss {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* sint64 uid */ 1:
                    message.uid = reader.sint64().toString();
                    break;
                case /* sint64 groupId */ 2:
                    message.groupId = reader.sint64().toString();
                    break;
                case /* sint64 orderId */ 3:
                    message.orderId = reader.sint64().toString();
                    break;
                case /* int32 businessId */ 4:
                    message.businessId = reader.int32();
                    break;
                case /* string orderState */ 5:
                    message.orderState = reader.string();
                    break;
                case /* int32 tradeId */ 6:
                    message.tradeId = reader.int32();
                    break;
                case /* string symbol */ 7:
                    message.symbol = reader.string();
                    break;
                case /* string reason */ 8:
                    message.reason = reader.string();
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
    internalBinaryWrite(message: PerpetualProfitLoss, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* sint64 uid = 1; */
        if (message.uid !== "0")
            writer.tag(1, WireType.Varint).sint64(message.uid);
        /* sint64 groupId = 2; */
        if (message.groupId !== "0")
            writer.tag(2, WireType.Varint).sint64(message.groupId);
        /* sint64 orderId = 3; */
        if (message.orderId !== "0")
            writer.tag(3, WireType.Varint).sint64(message.orderId);
        /* int32 businessId = 4; */
        if (message.businessId !== 0)
            writer.tag(4, WireType.Varint).int32(message.businessId);
        /* string orderState = 5; */
        if (message.orderState !== "")
            writer.tag(5, WireType.LengthDelimited).string(message.orderState);
        /* int32 tradeId = 6; */
        if (message.tradeId !== 0)
            writer.tag(6, WireType.Varint).int32(message.tradeId);
        /* string symbol = 7; */
        if (message.symbol !== "")
            writer.tag(7, WireType.LengthDelimited).string(message.symbol);
        /* string reason = 8; */
        if (message.reason !== "")
            writer.tag(8, WireType.LengthDelimited).string(message.reason);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message PerpetualProfitLoss
 */
export const PerpetualProfitLoss = new PerpetualProfitLoss$Type();
