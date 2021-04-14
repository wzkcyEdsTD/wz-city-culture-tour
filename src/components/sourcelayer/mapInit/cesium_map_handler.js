/**
 * 句柄
 * @param {*} context 实例 
 */
export const initHandler = (context) => {
    const handler = new Cesium.ScreenSpaceEventHandler(window.earth.scene.canvas);
    // 监听左键点击事件
    handler.setInputAction((e) => {
        const pick = window.earth.scene.pick(e.position);
        if (!pick && !pick.primitive && !pick.id) return;
        if (typeof pick.id == "object") {
            //  *****[videoCircle]  监控视频点*****
            if (pick.id.id && ~pick.id.id.indexOf("videopoint_")) {
                context.$bus.$emit("cesium-3d-videoPointClick", {
                    mp_id: pick.id.id,
                    mp_name: pick.id.name,
                });
            }
            if (pick.id.id && ~pick.id.id.indexOf("normalpoint_")) {
                context.$bus.$emit("cesium-3d-normalPointClick", {
                    mp_id: pick.id.id,
                    mp_name: pick.id.name,
                });
            }
        } else if (typeof pick.id == "string") {
            const [_TYPE_, _SMID_, _NODEID_, _LOCATION_] = pick.id.split("@");
            if (_TYPE_.includes("eventLayer_")) {
                context.$bus.$emit("cesium-3d-pick-to-event", {
                    ...window.featureMap[_NODEID_][_SMID_],
                    position: pick.primitive.position,
                });
            } else {
                //  *****[detailPopup]  资源详情点*****
                if (~["label", "billboard"].indexOf(_TYPE_)) {
                    const isLocated = ~["location"].indexOf(_LOCATION_);
                    context.$bus.$emit(`cesium-3d-pick-to-${isLocated ? "locate" : "detail"}`, {
                        ...window.featureMap[_NODEID_][_SMID_],
                        position: pick.primitive.position,
                        isLocated,
                    });
                }
            }
        }
        //  网格分析点击
        if (
            pick.primitive &&
            pick.primitive._instanceIds &&
            pick.primitive._instanceIds.length &&
            typeof pick.primitive._instanceIds[0] == 'string'
        ) {
            const [BUS_EVENT_TAG_CLICK, x, y, count, id] = pick.primitive._instanceIds[0].split(
                "@"
            );
            BUS_EVENT_TAG_CLICK && context.$bus.$emit(BUS_EVENT_TAG_CLICK, { x, y, count, id });
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}