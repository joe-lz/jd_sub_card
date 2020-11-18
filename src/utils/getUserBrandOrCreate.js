import { getUserBrand, createUserBrand } from "@_gen/service/userbrand";
import { getBrandByJxId, updateCurMyBrands } from "@_gen/service/brand";

export const getUserBrandOrCreate = async (params, shouldCreate = true) => {
  // shouldCreate 是否没有就创建;
  let curUserBrand = null;
  let response = await getUserBrand(params);
  if (response.result && response.result.length > 0) {
    curUserBrand = response.result[0];
  } else {
    if (shouldCreate) {
      const curBrand = (await getBrandByJxId({ id: params.bId })).result;
      // 创建userbrand
      await createUserBrand({
        ...params,
        brand: curBrand.objectId,
      });
      response = await getUserBrand(params);
      curUserBrand = response.result[0];
      // 添加userbrandid = > mybrands
      await updateCurMyBrands({
        brand_id: curBrand.objectId,
        userbrand_id: curUserBrand.objectId,
      });
    } else {
      curUserBrand = null;
    }
  }
  return response;
};
