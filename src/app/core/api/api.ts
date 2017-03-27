// Generated by node-private-tools
export function apis(apiOrigin: string, ext?: string) {
    ext = ext || '';
    return {

        GetProfile: `${apiOrigin}/profile${ext}`,
        GetUserResources: `${apiOrigin}/resources${ext}`,
        GetUserResource: (id: any) => `${apiOrigin}/resource/${id}${ext}`,
        GetUserSites: `${apiOrigin}/sites${ext}`,
        GetUserSite: (id: any) => `${apiOrigin}/site/${id}${ext}`,
        PostUserSite: `${apiOrigin}/site${ext}`,
        DeleteUserSite: (id: any) => `${apiOrigin}/site/${id}${ext}`,
        GetCaptcha: `${apiOrigin}/captcha${ext}`,
        GetRefreshToken: (refreshToken: any) => `${apiOrigin}/refresh_token/${refreshToken}${ext}`,
        GetFakeToken: `${apiOrigin}/faketoken${ext}`,
        GetFans: `${apiOrigin}/fans${ext}`,
        PostSetUserInfo: `${apiOrigin}/user${ext}`,
        PostPrebindPhone: `${apiOrigin}/phone/prebind${ext}`,
        PostBindPhone: `${apiOrigin}/phone/bind${ext}`,
        PostPresetPaykey: `${apiOrigin}/paykey/preset${ext}`,
        PostSetPaykey: `${apiOrigin}/paykey/set${ext}`,
        PostWithdraw: `${apiOrigin}/withdraw${ext}`,
        GetUserCash: `${apiOrigin}/cash${ext}`,
        GetUserCashFrozen: `${apiOrigin}/cash/frozen${ext}`,
        GetUserCashRebate: `${apiOrigin}/cash/rebate${ext}`,
        GetUserPoints: `${apiOrigin}/points${ext}`,
        GetOrder: (id: any) => `${apiOrigin}/order/${id}${ext}`,
        GetOrders: `${apiOrigin}/orders${ext}`,
        PostCheckout: `${apiOrigin}/checkout${ext}`,
        PostOrderPay: `${apiOrigin}/order/pay${ext}`,
        PostOrderWxPay: `${apiOrigin}/order/wx_pay${ext}`,
        PostOrderPaied: (id: any) => `${apiOrigin}/order/paied/${id}${ext}`,
        PostOrderState: `${apiOrigin}/order/state${ext}`,
        PostOrderEval: (id: any) => `${apiOrigin}/order/eval/${id}${ext}`,
        GetProductAttrGroups: `${apiOrigin}/product/ags${ext}`,
        GetProduct: (id: any) => `${apiOrigin}/product/${id}${ext}`,
        GetProducts: `${apiOrigin}/products${ext}`,
        GetProductsEvals: `${apiOrigin}/products/evals${ext}`,

        GetQiniuCommon: `${apiOrigin}/qiniu/commons${ext}`,

        // GetQiniuHeadToken only upload with key: h/[userid]. Token should be got early.
        GetQiniuHeadToken: (life: any) => `${apiOrigin}/qiniu/headtoken/${life}${ext}`,

        // GetQiniuUptoken only upload with key. It will check site's owner.
        // Called when upload action indeed happens.
        // name = base64('s/:siteid/2017/01/abc.png')
        GetQiniuUptoken: (key: any, life: any) => `${apiOrigin}/qiniu/uptoken/${key}/${life}${ext}`,

        // PostQiniuList only list with prefix. It will check site's owner.
        // prefix = base64('s/:siteid/2017/01/')
        PostQiniuList: (prefix: any) => `${apiOrigin}/qiniu/${prefix}${ext}`,

        // GetQiniuList only delete with key. It will check site's owner.
        // name = base64('s/:siteid/2017/01/abc.png')
        DeleteQiniu: (key: any) => `${apiOrigin}/qiniu/${key}${ext}`,
        PostBatchDeleteQiniu: `${apiOrigin}/qiniu/batch${ext}`,

        PostAuthWx: `${apiOrigin}/auth/wx${ext}`,  // weixin only

    };
}
