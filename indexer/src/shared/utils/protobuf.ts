import { Registry, isTsProtoGeneratedType, GeneratedType } from "@cosmjs/proto-signing";
import { defaultRegistryTypes } from "@cosmjs/stargate";
import { MsgUnjail } from "cosmjs-types/cosmos/slashing/v1beta1/tx";

import * as v1beta1 from "../../proto/akash/v1beta1";
import * as v1beta2 from "../../proto/akash/v1beta2";
import * as v1beta3 from "../../proto/akash/v1beta3";

const akashTypes: ReadonlyArray<[string, GeneratedType]> = [...Object.values(v1beta1), ...Object.values(v1beta2), ...Object.values(v1beta3)].map((x) => [
  "/" + x.$type,
  x
]);
const missingTypes: ReadonlyArray<[string, GeneratedType]> = [["/cosmos.slashing.v1beta1.MsgUnjail", MsgUnjail]];

export function decodeMsg(type: string, msg: Uint8Array) {
  const myRegistry = new Registry([...defaultRegistryTypes, ...akashTypes, ...missingTypes]);

  const msgType = myRegistry.lookupType(type);

  if (!msgType) {
    throw new Error("Type not found: " + type);
  }

  if (!isTsProtoGeneratedType(msgType)) {
    throw new Error("Type is not generated by ts-protobuf: " + type);
  }

  return msgType.decode(msg);
}

export function uint8arrayToString(arr: Uint8Array) {
  return new TextDecoder().decode(arr);
}
