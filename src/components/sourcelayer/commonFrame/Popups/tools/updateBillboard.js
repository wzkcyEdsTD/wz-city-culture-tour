const _LOWER_WIDTH_ = 30;
const _LOWER_HEIGHT_ = 30;
const _UPPER_WIDTH_ = 46;
const _UPPER_HEIGHT_ = 46;
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
    window.billboardMap[n.node.id].getById(n.billboardId).scale = 2
}

/**
 * 缩小图标
 * @param {*} o 
 */
export const lowerCaseIcon = (o) => {
    window.billboardMap[o.node.id].getById(o.billboardId).scale = 1
}