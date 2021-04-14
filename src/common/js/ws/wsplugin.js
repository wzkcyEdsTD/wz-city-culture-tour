let waitVerifyCallback = false;
let port = 14320;
let verifyResult = false; //连接验证码

function StartNewPoint() {
    port += 1;
    initPlugin();
}

function SendMethod(method, paras) {
    let jobj = {
        method: method,
        paramArray: paras
    };
    let jStr = JSON.stringify(jobj);
    ws.send(jStr);
}

function excuteFucOfPlugin(method, paras) {
    if (verifyResult && ws.readyState === WebSocket.OPEN) {
        SendMethod(method, paras);
    } else {
        console.error(ws.readyState);
    }
}

function callbackInfo(msg) {
    msg = msg.replace(/\n/g, "");
    // console.info("Callback msg:" + msg);
    // console.info("Callback msg length:" + msg.length);
    try {
        var obj = JSON.parse(msg);
        // console.info("transfer json object!");
        // console.info(obj);
        var cmd = obj.cmd + "\n";
        var type = obj.type + "\n";
        var msgid = obj.msgid + "\n";
        var code = obj.code + "\n";
        var date = obj.date + "\n";
        var msgstr = obj.msg;

        switch (obj.cmd) {
            case "Init":
                break;
            case "Login":
                if (obj.type == "LoginSuc") {
                    console.log('loginSuccess')
                } else if (obj.type == "Loginfail") {
                    console.error('登录错误：'.concat("\n", msgstr, "\n", date))
                }
                break;
            case "SingleCall":
                if (obj.type == "SCallMCfm") {
                    let jsonObj = obj.msg;
                    var callType = "普通呼叫";
                    if (jsonObj.flag == 1) {
                        //视频呼叫
                        videoCall = true;
                        ocxKq.ShowVideoCallWindow(jsonObj.pcCfmDn);
                        callType = "视频呼叫";
                    }
                    scallHandler = jsonObj.hUserCall;
                    $("#CallState").html(
                        callType +
                        jsonObj.pcCfmDn +
                        "(" +
                        scallHandler +
                        ')已接通 <button id="btnHungUp" onclick="CloseSingleCall()">挂断</button>'
                    );
                } else if (obj.type == "SCalled") {
                    videoCall = false;
                    //var calledArray=msgstr.split('|');
                    //let jsonObj=JSON.parse(msgstr);
                    let jsonObj = obj.msg;
                    var callType = "普通呼叫";
                    if (jsonObj.flag == 1) {
                        //视频呼叫
                        callType = "视频呼叫";
                        videoCall = true;
                    } else if (jsonObj.flag == 2) callType = "紧急呼叫";
                    var msg = jsonObj.pcCalling + "(" + jsonObj.pcDn + ")发来" + callType;
                    scallHandler = jsonObj.hUserCall;

                    var confirmRet = confirm(msg);
                    if (confirmRet) {
                        if (jsonObj.flag == 1) {
                            var openCallWindow = ocxKq.ShowVideoCallWindow(jsonObj.pcDn); //视频呼叫打开视频面板
                        }
                        var AceeptRet = ocxKq.AcceptCall(scallHandler);

                        if (!AceeptRet) alert("接听失败！");
                        else {
                            $("#CallState").html(
                                callType +
                                jsonObj.pcCalling +
                                "(" +
                                jsonObj.pcDn +
                                " 业务句柄" +
                                scallHandler +
                                ')已接通 <button id="btnHungUp" onclick="CloseSingleCall()">挂断</button>'
                            );
                        }
                    } else {
                        CloseSingleCall();
                    }
                } else if (obj.type == "SCallFreed") {
                    //var callFreeArray=msgstr.split('|');
                    //let jsonObj=JSON.parse(msgstr);
                    let jsonObj = obj.msg;
                    if (jsonObj.usCause == 0) {
                        if (videoCall) ocxKq.CloseVideoCall();
                        $("#CallState").html(jsonObj.hUserCall + "默认挂断！");
                    } else {
                        $("#CallState").html(
                            jsonObj.hUserCall + "其他原因挂断：" + jsonObj.usCause
                        );
                    }
                }
                break;
            case "GroupCall":
                // var gcallArray=msgstr.split('|');
                //let gcallobj=JSON.parse(msgstr);
                let gcallobj = obj.msg;
                if (obj.type == "GCallMoCfm") {
                    if (gcallobj.ret == 0) {
                        $("#GCallMsg").html(gcallNo + "组呼主叫已通");
                        $("#GCallOperate").html(
                            '<br><button id="btnGCallSpeak" onclick="GCallSpeak()">释放话权</button><button id="btnGCallHungUp" onclick="CloseGCall()">挂断</button>'
                        );
                        gcallHandler = gcallobj.hUserCall;
                    } else if (gcallobj.ret == -1)
                        $("#GCallMsg").html("组呼主叫未通：参数错误");
                    else if (gcallobj.ret == -2)
                        $("#GCallMsg").html("组呼主叫未通：未注册");
                    else if (gcallobj.ret == -3)
                        $("#GCallMsg").html("组呼主叫未通：系统错误");
                } else if (obj.type == "GCallMtInd") {
                    var type = gcallobj.type;
                    var ret = gcallobj.ret;
                    var cGid = gcallobj.cGid;
                    var cTalkingGID = gcallobj.cTalkingGID;
                    var pcName = gcallobj.pcName;
                    var CallRefID = gcallobj.CallRefID;
                    var hUserCall = gcallobj.hUserCall;
                    var typeStr =
                        type == 21 ? "临时组会话" : type == 22 ? "组呼" : "广播";
                    var retstr = ret == 0 ? "正常介入" : "低优先级介入";

                    gcallNo = cGid;
                    gcallHandler = hUserCall;
                    $("#GCallMsg").html(
                        cTalkingGID +
                        "(" +
                        pcName +
                        ")发起的" +
                        cGid +
                        "的" +
                        retstr +
                        typeStr
                    );
                    $("#GCallOperate").html(
                        '<br><button id="btnGCallSpeak" onclick="GCallSpeak()">申请话权</button><button id="btnGCallHungUp" onclick="CloseGCall()">挂断</button>'
                    );
                } else if (obj.type == "GCallReqCfm") {
                    switch (gcallobj.ret) {
                        case 0:
                            $("#GCallMsg").html("话权申请成功，我讲话中...");
                            $("#btnGCallSpeak").html("释放话权");
                            break;
                        case 1:
                            $("#GCallMsg").html("排队中...");
                            break;
                        case 2:
                            $("#GCallMsg").html("排队失败...");
                            break;
                        case 3:
                            $("#GCallMsg").html("排队终止...");
                            break;
                        case 4:
                            $("#GCallMsg").html("话权终止...");
                            break;
                        case 5:
                            $("#GCallMsg").html("系统错误...");
                            break;
                        default:
                            $("#GCallMsg").html("其他失败原因：" + gcallobj.ret);
                            break;
                    }
                } else if (obj.type == "GCallRelCfm") {
                    $("#GCallMsg").html("话权释放成功");
                } else if (obj.type == "GCallChagInd") {
                    $("#GCallMsg").html(
                        gcallobj.cTalkingGID + "(" + gcallobj.cTalkingName + ")讲话中..."
                    );
                } else if (obj.type == "GCallRelInd") {
                    $("#GCallMsg").html(
                        gcallobj.gid +
                        "(" +
                        gcallobj.hUserCall +
                        ")组呼释放，原因值：" +
                        gcallobj.ret
                    );
                    $("#GCallOperate").html("");
                }
                break;
            case "Video":
                //var VideoArray=msgstr.split('|');
                //let videoObje=JSON.parse(msgstr);
                let videoObje = obj.msg;
                if (obj.type == "SVideoMtInd") {
                    var pcCalling = videoObje.pcCalling;
                    var pcDn = videoObje.pcDn;
                    var pcName = videoObje.pcName;
                    var iDirection = videoObje.iDirection;
                    var hUserCall = videoObje.hUserCall;
                    var videoDir = "下载";
                    if (iDirection == "1") videoDir = "下载";
                    else if (iDirection == "2") videoDir = "上传";
                    else if (iDirection == "3") videoDir = "收发";
                    var ret = confirm(
                        pcCalling +
                        "(" +
                        pcDn +
                        ")发来视频" +
                        videoDir +
                        "请求，您确定同意请求吗？"
                    );

                    if (ret) {
                        //接受视频
                        ocxKq.AcceptVideo(pcDn, parseInt(iDirection), hUserCall);
                    } else {
                        //挂断视频
                        alert("挂断视频:" + hUserCall);
                        ocxKq.CloseVideo(hUserCall);
                    }
                }
                break;
            case "Msg":
                if (obj.type == "MsgSendResult") {
                    var ret = obj.msg.result;
                    if (ret == 0) {
                        var chsmsid = obj.msg.smsid;
                        $("#msgdiv_" + chsmsid).css("background-color", "lightgreen");
                    }
                } else if (obj.type == "MsgReceive") {
                    if (obj.msg.content.infoType == 0x31) {
                        $("#div_Setting_Content").append(
                            "<div style='text-left:right;width:95%;background-color: burlywood'>发来的设置信息：<br> " +
                            JSON.stringify(obj.msg.content.exContent) +
                            "</div>"
                        );
                    } else {
                        $("#div_ShowRevMSG").append(
                            "<div style='text-align:left;width:95%;background-color: burlywood'>发来的：<br> " +
                            obj.msg.content.msgContent +
                            "</div>"
                        );
                    }

                    //ConfirmMSG(0,pcDst,chSmsId,InfoSeq);
                } else if ((obj.type = "FileUpload")) {
                    $("#div_ShowMSG").append(
                        "<div style='width=95%'>文件上传 ：<br> " + msgstr + " </div>"
                    );
                } else if ((obj.type = "FileDownload")) {
                    $("#div_ShowMSG").append(
                        "<div style='width=95%'>文件下载 ：<br> " + msgstr + " </div>"
                    );
                }
                break;
            case "Error":
                break;
            case "Wsoket":
                if (obj.type == "WsoketResult") {
                    switch (obj.msg.method) {
                        case "VerifyWebSoket":
                            //验证唯一ID，不变
                            if (obj.msg.result === "34c61afbc8b6470f9b349a1e1c2986be") {
                                $("#connStatus").css("background-color", "green");
                                verifyResult = true;
                            }
                            AcitvexInit();
                            break;
                        case "SingleCallByNo":
                            if (obj.msg.result) {
                                $("#CallState").html("发起呼叫成功！");
                                videoCall = false;
                            } else {
                                $("#CallState").html("发起呼叫失败！");
                            }
                            break;
                        case "CloseSingleCall":
                            if (obj.msg.result) $("#CallState").html("挂断呼叫执行成功！");
                            else $("#CallState").html("挂断呼叫执行失败！");
                            break;
                        case "GroupCallByNo":
                            if (obj.msg.result)
                                $("#GCallMsg").html("发起组呼成功".concat(callNO));
                            else $("#GCallMsg").html("发起呼叫失败".concat(callNO));
                            break;
                        case "GroupBroadcast":
                            if (obj.msg.result)
                                $("#GCallMsg").html("发起广播成功".concat(callNO));
                            else $("#GCallMsg").html("发起广播失败".concat(callNO));
                            break;
                        case "GetSpeakOfGroupCall":
                            if (!obj.msg.result) console.error("申请话权失败！");
                            break;
                        case "FreedSpeakOfGroupCall":
                            if (!obj.msg.result) console.error("释放话权失败！");
                            break;
                        case "CloseGroupCall":
                            if (!obj.msg.result)
                                $("#GCallMsg").html("组呼主动释放失败：" + ret);
                            else {
                                $("#GCallMsg").html("组呼主动释放成功");
                                $("#GCallOperate").html("");
                            }
                            break;
                        case "SendMSGForJSonString":
                            if (obj.msg.result != 0) {
                                $("#msgContent").val("");
                                $("#div_ShowMSG").append(
                                    "<div id='msgdiv_" +
                                    excutRet +
                                    "' style='width=95%'>发送结果为：" +
                                    excutRet +
                                    " </div>"
                                );
                            } else {
                                alert("信息发送失败！");
                            }
                            break;
                        case "SendMSGForV5":
                            if (obj.msg.result != 0) {
                                $("#msgContent").val("");
                                $("#div_ShowMSG").append(
                                    "<div id='msgdiv_" +
                                    excutRet +
                                    "' style='width=95%'>发送结果为：" +
                                    excutRet +
                                    " </div>"
                                );
                            } else alert("信息发送失败！");
                            break;
                        case "SendMSG":
                            if (obj.msg.result != 0) {
                                $("#msgContent").val("");
                                $("#div_ShowMSG").append(
                                    "<div id='msgdiv_" +
                                    excutRet +
                                    "' style='width=95%'>发送结果为：" +
                                    excutRet +
                                    " </div>"
                                );
                            } else alert("信息发送失败！");
                            break;
                        case "ReceivedMSG":
                            if (obj.msg.result != 0) alert("确认消息失败！");
                            break;
                        case "UploadFile":
                            if (obj.msg.result != 0) alert("上传操作失败：" + UploadFileRet);
                            else
                                alert(
                                    "文件上传成功:pcDst-" +
                                    pcDst +
                                    " fileName-" +
                                    fileName +
                                    " chSmsId-" +
                                    fileChSmsId
                                );
                            break;
                        case "DownLoadFiel":
                            if (obj.msg.result != 0) alert("下载操作失败：" + obj.msg.result);
                            break;
                    }
                }
                break;
            default:
                break;
        }
    } catch (error) {
        console.log(error);
    }
}

var ocxKq;
function Load() {
    if (BrowserIsIE()) {
        try {
            ocxKq = document.getElementById("csocx");
            if (ocxKq.object == null) alert("还没有注册控件");
            else alert("已经注册控件");
        } catch (e) {
            alert("e:" + e.description);
        }
    } else {
        console.log(document.cookie);
        initPlugin();
    }
}

/**
 * 与扩展通信
 **/
function createCustomEvent(msg) {
    var evt = document.createEvent("CustomEvent");
    evt.initCustomEvent("excuteActiveX", true, false, msg);
    document.dispatchEvent(evt);
}
/**
 * 判断浏览器类别
 **/
function BrowserIsIE() {
    var explorer = navigator.userAgent;
    if (explorer.indexOf("Trident") >= 0) {
        return true;
    } else {
        // console.info("IS Not IE");
        return false;
    }
}

/**
 * 组装发送命令json
 * @param {方法名称} methodName
 */
function BuildJson(methodName) {
    var paras = "[";
    var length = arguments.length;
    for (var i = 1; i < length; i++) {
        paras += arguments[i];
        if (i < length - 1) paras += ",";
    }
    paras += "]";
    var buildResult =
        '{"MethodName":"' + methodName + '","Parameters":' + paras + "}";
    return buildResult;
}

/**
 * 组装变量
 * @param {变量名称} key
 * @param {变量值} value
 */
function BuildParamJson(key, value) {
    var paraJson =
        '{"ParameterName":"' + key + '","ParameterKey":"' + value + '"}';
    return paraJson;
}

//调度操作操作
/**
 * 初始化uct控件
 * 并登录
 */
function AcitvexInit() {
    try {
        var name = '57702';
        var pwd = '57702';
        var ip = '183.136.147.222';
        if (BrowserIsIE()) {
            ocxKq.RegistCallBack(window, "callbackInfo", "msg");
            console.log("RegistCallBack finish!");
            var loginRet = parent.ocxKq.Login(name, pwd, ip);
            if (!loginRet) alert("Login fail!");
        } else {
            excuteFucOfPlugin("Login", [name, pwd, ip]);
        }
    } catch (ex) {
        alert("AcitvexInit:" + ex);
    }
}

var videoCall = false;
var scallHandler;
/**
 * 单呼
 * 参数：号码
 */
function SingleCall() {
    try {
        var callNO = document.getElementById("teminalNo").value;

        if (BrowserIsIE()) {
            var sCallShow = ocxKq.SingleCallByNo(callNO, 0);
            gcallNo = callNO;
            if (sCallShow) {
                $("#CallState").html("发起呼叫成功！");
                videoCall = false;
            } else $("#CallState").html("发起呼叫失败！");
        } else {
            // var callNOparam=BuildParamJson('no',callNO);
            // var callTypeparam=BuildParamJson('type',0);
            // var jsonParameter=BuildJson("SingleCallByNo",callNOparam,callTypeparam);
            // createCustomEvent(jsonParameter);

            excuteFucOfPlugin("SingleCallByNo", [callNO, 0]);
        }
    } catch (error) {
        alert(error);
    }
}
function CloseSingleCall() {
    try {
        if (BrowserIsIE()) {
            var exRet = ocxKq.CloseSingleCall(scallHandler);
            if (exRet) $("#CallState").html("挂断呼叫执行成功！");
            else $("#CallState").html("挂断呼叫执行失败！");
            if (videoCall) ocxKq.CloseVideoCall();
        } else {
            // var param=BuildParamJson('hUserCall',scallHandler);
            // var jsonParameter=BuildJson("CloseSingleCall",param);
            // createCustomEvent(jsonParameter);

            excuteFucOfPlugin("CloseSingleCall", [scallHandler]);
            if (videoCall) {
                // var vcJsonParameter = BuildJson("CloseVideoCall");
                // createCustomEvent(vcJsonParameter);
                excuteFucOfPlugin("CloseVideoCall", []);
            }
        }
    } catch (error) {
        alert(error);
    }
}
/**
 * 视频呼叫
 * 参数：号码
 */
export const SingleVideoCall = (number) => {
    try {
        var callNO = number;
        if (BrowserIsIE()) {
            ocxKq.SingleCallByNo(callNO, 1);
        } else {

            excuteFucOfPlugin("SingleCallByNo", [callNO, 1]);
        }
        videoCall = true;
    } catch (error) {
        alert(error);
    }
}

var gcallHandler = -1; //组呼句柄
var gcallNo; //组呼号码
/**
 * 组呼
 * 参数：组号码
 */
function GroupCall() {
    try {
        var callNO = document.getElementById("groupNo").value;
        gcallNo = callNO;
        if (BrowserIsIE()) {
            var sCallShow = ocxKq.GroupCallByNo(callNO);
            if (sCallShow) {
                $("#GCallMsg").html("发起组呼成功".concat(callNO));
            } else $("#GCallMsg").html("发起呼叫失败".concat(callNO));
        } else {
            // var param = BuildParamJson("no", callNO);
            // var jsonParameter = BuildJson("GroupCallByNo", param);
            // createCustomEvent(jsonParameter);
            excuteFucOfPlugin("GroupCallByNo", [callNO]);
        }
    } catch (error) {
        alert(error);
    }
}
/**
 * 组呼
 * 参数：组号码
 */
function GroupBroadcast() {
    try {
        var callNO = document.getElementById("groupNo").value;
        gcallNo = callNO;
        if (BrowserIsIE()) {
            var sCallShow = ocxKq.GroupBroadcast(callNO);
            if (sCallShow) {
                $("#GCallMsg").html("发起广播成功".concat(callNO));
            } else $("#GCallMsg").html("发起广播失败".concat(callNO));
        } else {
            // var param = BuildParamJson("no", callNO);
            // var jsonParameter = BuildJson("GroupBroadcast", param);
            // createCustomEvent(jsonParameter);
            excuteFucOfPlugin("GroupBroadcast", [callNO]);
        }
    } catch (error) {
        alert(error);
    }
}
/**
 * 话权申请释放
 *
 */
function GCallSpeak() {
    try {
        var speakText = $("#btnGCallSpeak").html();
        if (speakText == "申请话权") {
            if (BrowserIsIE()) {
                var ret = ocxKq.GetSpeakOfGroupCall(gcallHandler);
                if (!ret) console.error("申请话权失败！");
            } else {
                // var param = BuildParamJson("hUserCall", gcallHandler);
                // var jsonParameter = BuildJson("GetSpeakOfGroupCall", param);
                // createCustomEvent(jsonParameter);
                excuteFucOfPlugin("GetSpeakOfGroupCall", [gcallHandler]);
            }
        } else {
            $("#btnGCallSpeak").html("申请话权");
            if (BrowserIsIE()) {
                var ret = ocxKq.FreedSpeakOfGroupCall(gcallHandler);
                if (!ret) console.error("释放话权失败！");
            } else {
                // var param = BuildParamJson("hUserCall", gcallHandler);
                // var jsonParameter = BuildJson("FreedSpeakOfGroupCall", param);
                // createCustomEvent(jsonParameter);
                excuteFucOfPlugin("FreedSpeakOfGroupCall", [gcallHandler]);
            }
        }
    } catch (error) {
        alert(error);
    }
}
function CloseGCall() {
    try {
        if (BrowserIsIE()) {
            var ret = ocxKq.CloseGroupCall(gcallNo, gcallHandler);
            if (!ret) $("#GCallMsg").html("组呼主动释放失败：" + ret);
            else {
                $("#GCallMsg").html("组呼主动释放成功");
                $("#GCallOperate").html("");
            }
        } else {
            // var gcallNoparam = BuildParamJson("no", gcallNo);
            // var gcallHandlerparam = BuildParamJson("hUserCall", gcallHandler);
            // var jsonParameter = BuildJson(
            //   "CloseGroupCall",
            //   gcallNoparam,
            //   gcallHandlerparam
            // );
            // createCustomEvent(jsonParameter);
            excuteFucOfPlugin("CloseGroupCall", [gcallNo, gcallHandler]);
        }
    } catch (error) {
        alert(error);
    }
}

/**
 * 修改呼叫窗口位置
 * 参数：窗口左上角的X，Y
 */
function MoveCallFrm() {
    try {
        var x = document.getElementById("CallFrmLocationX").value;
        var y = document.getElementById("CallFrmLocationY").value;
        x = parseInt(x);
        y = parseInt(y);
        if (BrowserIsIE()) {
            ocxKq.SetCallPanelLocation(x, y);
        } else {
            // var xparam = BuildParamJson("x", x);
            // var yparam = BuildParamJson("y", y);
            // var jsonParameter = BuildJson("SetCallPanelLocation", xparam, yparam);
            // createCustomEvent(jsonParameter);
            excuteFucOfPlugin("SetCallPanelLocation", [x, y]);
        }
    } catch (error) {
        alert(error);
    }
}


function InitMQ() {
    try {
        var ip = document.getElementById("txt_MQIP").value;
        var port = document.getElementById("txt_MQPort").value;
        var name = document.getElementById("txt_MQName").value;
        var key = document.getElementById("txt_MQFilterkey").value;
        var value = document.getElementById("txt_MQFilterValue").value;

        if (BrowserIsIE()) {
            var ret = ocxKq.InitMQ(ip, port, name, key, value);
            alert("InitMQ：" + ret);
        } else {
            var ipParam = BuildParamJson("ip", ip);
            var portParam = BuildParamJson("port", port);
            var nameParam = BuildParamJson("name", name);
            var keyParam = BuildParamJson("key", key);
            var valueParam = BuildParamJson("value", value);

            var jsonParameter = BuildJson(
                "InitMQ",
                ipParam,
                portParam,
                nameParam,
                keyParam,
                valueParam
            );
            createCustomEvent(jsonParameter);
        }
    } catch (error) {
        alert(error);
    }
}
/**
 * 退出登录并释放插件
 * 参数：无
 */
function DestrUct() {
    try {
        console.log(document.cookie);
        if (BrowserIsIE()) {
            if (ocxKq == "" || ocxKq == null || ocxKq == undefined) {
                return;
            }

            ocxKq.LoginOut();
            ocxKq.DestroyCtrl();
            // delete ocxKq;
        } else {
            excuteFucOfPlugin("LoginOut", []);
            excuteFucOfPlugin("DestroyCtrl", []);
        }
    } catch (error) {
        alert(error);
    }
    $("#div_Operate").css("display", "none");
}

function Logout() {
    try {
        if (BrowserIsIE()) {
            if (ocxKq == "" || ocxKq == null || ocxKq == undefined) {
                console.info("ocxKq is null");
                return;
            }
            ocxKq.LoginOut();
        } else {
            excuteFucOfPlugin("LoginOut", []);
        }
        $("#div_Operate").css("display", "none");
    } catch (error) {
        alert(error);
    }
}


export const initPlugin = () => {
    try {
        let wsImpl = window.WebSocket || window.MozWebSocket;
        if (port > 65535) port = 1024;
        window.ws = new wsImpl("ws://localhost:" + port);
        ws.onopen = function () {
            ws.onmessage = function (evt) {
                callbackInfo(evt.data);
            };
            SendMethod("VerifyWebSoket", []);
            waitVerifyCallback = true;
            setTimeout(() => {
                if (!verifyResult) {
                    ws.onmessage = null;
                    ws.close();
                    waitVerifyCallback = false;
                    StartNewPoint();
                }
            }, 10000);
        };
        ws.onclose = function () {
            $("#connStatus").css("background-color", "red");
        };
        ws.onerror = function (event) {
            console.log(event);
            if (!waitVerifyCallback) setTimeout(StartNewPoint, 500);
        };
    } catch (error) {
        console.error(error);
        StartNewPoint();
        return;
    }
}