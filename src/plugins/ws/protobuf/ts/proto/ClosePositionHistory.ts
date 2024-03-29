// @generated by protobuf-ts 2.9.1 with parameter long_type_string
// @generated from protobuf file "proto/ClosePositionHistory.proto" (syntax proto3)
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
 * @generated from protobuf message ClosePositionHistory
 */
export interface ClosePositionHistory {
    /**
     * @generated from protobuf field: string uid = 1;
     */
    uid: string; // 用户 uid
    /**
     * @generated from protobuf field: string symbol = 2;
     */
    symbol: string; // 交易对
    /**
     * @generated from protobuf field: string type = 3;
     */
    type: string; // 类型
    /**
     * @generated from protobuf field: string closePositionTime = 4;
     */
    closePositionTime: string; // 平仓时间
}
// @generated message type with reflection information, may provide speed optimized methods
class ClosePositionHistory$Type extends MessageType<ClosePositionHistory> {
    constructor() {
        super("ClosePositionHistory", [
            { no: 1, name: "uid", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "symbol", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "type", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 4, name: "closePositionTime", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value?: PartialMessage<ClosePositionHistory>): ClosePositionHistory {
        const message = { uid: "", symbol: "", type: "", closePositionTime: "" };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<ClosePositionHistory>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ClosePositionHistory): ClosePositionHistory {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string uid */ 1:
                    message.uid = reader.string();
                    break;
                case /* string symbol */ 2:
                    message.symbol = reader.string();
                    break;
                case /* string type */ 3:
                    message.type = reader.string();
                    break;
                case /* string closePositionTime */ 4:
                    message.closePositionTime = reader.string();
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
    internalBinaryWrite(message: ClosePositionHistory, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* string uid = 1; */
        if (message.uid !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.uid);
        /* string symbol = 2; */
        if (message.symbol !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.symbol);
        /* string type = 3; */
        if (message.type !== "")
            writer.tag(3, WireType.LengthDelimited).string(message.type);
        /* string closePositionTime = 4; */
        if (message.closePositionTime !== "")
            writer.tag(4, WireType.LengthDelimited).string(message.closePositionTime);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message ClosePositionHistory
 */
export const ClosePositionHistory = new ClosePositionHistory$Type();
