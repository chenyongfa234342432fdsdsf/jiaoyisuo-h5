import { YapiGetV1OptionFavouriteTradePairListData } from "@/typings/yapi/OptionFavouriteTradePairListV1GetApi";
import { YapiGetV1OptionTradePairListApiRequest } from "@/typings/yapi/OptionTradePairListV1GetApi";


export type TernaryTradePair = YapiGetV1OptionFavouriteTradePairListData

export type TernaryOptionItemBasic = {id?: string, symbol?: string}

export type YapiGetV1OptionTradePairListApiRequestReal = Partial<YapiGetV1OptionTradePairListApiRequest>