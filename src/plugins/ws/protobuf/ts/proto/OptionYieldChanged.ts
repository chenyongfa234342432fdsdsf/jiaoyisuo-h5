// @generated by protobuf-ts 2.9.1 with parameter long_type_string
// @generated from protobuf file "proto/OptionYieldChanged.proto" (syntax proto3)
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
 * @generated from protobuf message OptionYieldChanged
 */
export interface OptionYieldChanged {
    /**
     * @generated from protobuf field: int64 time = 1;
     */
    time: string;
    /**
     * @generated from protobuf field: int64 optionId = 2;
     */
    optionId: string;
    /**
     * @generated from protobuf field: int64 periodId = 3;
     */
    periodId: string;
}
// @generated message type with reflection information, may provide speed optimized methods
class OptionYieldChanged$Type extends MessageType<OptionYieldChanged> {
    constructor() {
        super("OptionYieldChanged", [
            { no: 1, name: "time", kind: "scalar", T: 3 /*ScalarType.INT64*/ },
            { no: 2, name: "optionId", kind: "scalar", T: 3 /*ScalarType.INT64*/ },
            { no: 3, name: "periodId", kind: "scalar", T: 3 /*ScalarType.INT64*/ }
        ]);
    }
    create(value?: PartialMessage<OptionYieldChanged>): OptionYieldChanged {
        const message = { time: "0", optionId: "0", periodId: "0" };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<OptionYieldChanged>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: OptionYieldChanged): OptionYieldChanged {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int64 time */ 1:
                    message.time = reader.int64().toString();
                    break;
                case /* int64 optionId */ 2:
                    message.optionId = reader.int64().toString();
                    break;
                case /* int64 periodId */ 3:
                    message.periodId = reader.int64().toString();
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
    internalBinaryWrite(message: OptionYieldChanged, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* int64 time = 1; */
        if (message.time !== "0")
            writer.tag(1, WireType.Varint).int64(message.time);
        /* int64 optionId = 2; */
        if (message.optionId !== "0")
            writer.tag(2, WireType.Varint).int64(message.optionId);
        /* int64 periodId = 3; */
        if (message.periodId !== "0")
            writer.tag(3, WireType.Varint).int64(message.periodId);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message OptionYieldChanged
 */
export const OptionYieldChanged = new OptionYieldChanged$Type();
