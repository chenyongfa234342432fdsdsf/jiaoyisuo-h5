import {
  addFavList,
  removeFavList,
  getUserFavList,
  addFavListFutures,
  removeFavListFutures,
  getUserFavListFutures,
  editFavList,
  editFavListFutures,
} from '@/apis/market/market-list/market-favourites'
import { getFavouriteListCache, setFavouriteListCache } from '@/helper/cache'
import { partial } from 'lodash'
import {
  getV1OptionFavouriteTradePairListApiRequest,
  postV1OptionFavouriteTradePairAddApiRequest,
  postV1OptionFavouriteTradePairDeleteApiRequest,
} from '@/apis/market/ternary-option'
import { FavCacheTypeEnum } from '@/constants/market/market-list/favorite-module'
import { commonActionFn, commonCacheFn } from './common'

/** Spot favorite helper Functions */
const spotFavCacheFn = commonCacheFn(
  partial(getFavouriteListCache, FavCacheTypeEnum.spot),
  partial(setFavouriteListCache, FavCacheTypeEnum.spot)
)
const spotFavFn = commonActionFn(addFavList, removeFavList, getUserFavList, editFavList, spotFavCacheFn)

/** Contract favorite helper Functions */
const contractFavCacheFn = commonCacheFn(
  partial(getFavouriteListCache, FavCacheTypeEnum.futures),
  partial(setFavouriteListCache, FavCacheTypeEnum.futures)
)
const contractFavFn = commonActionFn(
  addFavListFutures,
  removeFavListFutures,
  getUserFavListFutures,
  editFavListFutures,
  contractFavCacheFn
)

/** to be synced with futures  */
const ternaryOptionFavCacheFn = commonCacheFn(
  partial(getFavouriteListCache, FavCacheTypeEnum['ternary-option']),
  partial(setFavouriteListCache, FavCacheTypeEnum['ternary-option'])
)

const ternaryOptionFavFn = commonActionFn(
  postV1OptionFavouriteTradePairAddApiRequest,
  postV1OptionFavouriteTradePairDeleteApiRequest,
  getV1OptionFavouriteTradePairListApiRequest,
  () => {},
  ternaryOptionFavCacheFn,
  'tradeId'
)

export { spotFavFn, contractFavFn, ternaryOptionFavFn }
