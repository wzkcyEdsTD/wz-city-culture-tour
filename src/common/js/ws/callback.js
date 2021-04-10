export default function (msg) {
    // alert("js页面的回调信息："+msg);
    // msg=msg.replace(/\n/g,"");
    // alert("js页面处理后的回调信息："+msg);
    msg = msg.replace(/\n/g, "");
    console.info("Callback msg:" + msg);
    console.info("Callback msg length:" + msg.length);
    try {
        // var order = msg.substr(0, 1);
        // var msgInfo = msg.substr(1);
        // if (order !== "0") {
        //   return;
        // }
        //var obj = strToJson(msg);
        //var obj =$.parseJSON(msg);
        var obj = JSON.parse(msg);
        console.info("transfer json object!");
        console.info(obj);
        var cmd = obj.cmd + "\n";
        var type = obj.type + "\n";
        var msgid = obj.msgid + "\n";
        var code = obj.code + "\n";
        var date = obj.date + "\n";
        var msgstr = obj.msg;
        //alert(cmd.concat(type,msgid,code,msgstr,date));
        //console.info(cmd.concat(type,msgid,code,msgstr,date));
        switch (obj.cmd) {
            case "Init":
                break;
            case "Login":
                if (obj.type == "LoginSuc") {
                    $("#div_Operate").css("display", "block");
                } else if (obj.type == "Loginfail") {
                    var logFailStr = "登录错误：";
                    $("#div_Operate").css("display", "none");
                    alert(logFailStr.concat("\n", msgstr, "\n", date));
                }
                break;
            case "SingleCall":
                if (obj.type == "SCallMCfm") {
                    //var callArray=msgstr.split('|');
                    //let jsonObj=JSON.parse(msgstr);
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
