const _LOWER_SCALE_ = 1;
const _UPPER_SCALE_ = 2;
/**
 * 更新billboard
 * @param {*} key   window.billboardMap下标
 * @param {*} o     old
 * @param {*} n     new
 */
export const updateBillboard = (o, n) => {
    return new Promise((resolve, reject) => {
        try {
            o.node && lowerCaseIcon(o);
            n.node && upperCaseIcon(n);
            resolve(true)
        } catch (e) {
            reject(e)
        }
    })
}

/**
 * 放大图标
 * @param {*} n 
 */
const upperCaseIcon = (n) => {
    window.billboardMap[n.node.id].getById(n.billboardId).scale = _UPPER_SCALE_
}

/**
 * 缩小图标
 * @param {*} o 
 */
export const lowerCaseIcon = (o) => {
    o.node && (window.billboardMap[o.node.id].getById(o.billboardId).scale = _LOWER_SCALE_)
}