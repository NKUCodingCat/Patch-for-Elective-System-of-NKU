var isStop = true;
var ClickTwice = false;
var kh_Array_pub = ["", "", "", ""];

function QK_loop(kh_Array) {
    if (kh_Array.length != 4) {
        return false;
    } else {
        isStop = false;
        function t(Arr) {
            if (!QiangKe(Arr[0], Arr[1], Arr[2], Arr[3])) {
                isStop = true;
                return false;
            }
            //===Waiting Loop====
            function _(times, len) {
                if (times > 0) {
                    if (ClickTwice) {
                        ClickTwice = false;
                        isStop = true;
                    }
                    if (isStop) return;
                    setTimeout(_, len, times - 1, len)
                } else {
                    t(Arr);
                }
            }
            _(20, 250);
            //=======
            kh_Array_pub = kh_Array;
            return true;
        }
        return t(kh_Array);
    }
}

function QiangKe(kh1, kh2, kh3, kh4) {
    try {
        F = document.getElementsByName('mainFrame')[0].contentDocument;
        F.getElementsByName('xkxh1')[0].value = kh1 || "";
        F.getElementsByName('xkxh2')[0].value = kh2 || "";
        F.getElementsByName('xkxh3')[0].value = kh3 || "";
        F.getElementsByName('xkxh4')[0].value = kh4 || "";
    } catch(e) {
        return false;
    }
    if (! (!kh1 && !kh2 && !kh3 && !kh4)) {
        setTimeout(function() {
            F.getElementsByName('xuanke')[0].click();
        },
        500);
        return true;
    } else {
        return false;
    }
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log("RUN");
    if (request['isStop'] !== undefined) {

        if (request['isStop']) {
            isStop = request['isStop'];
            sendResponse("Stopped");
        } else {
            if (!isStop) {
                isStop = true;
                ClickTwice = true;
                sendResponse("Stopped");
            } else {
                var G = QK_loop(request['kh_Array']);
                if (G) {
                    sendResponse("Started");
                } else {
                    sendResponse("Stopped");
                }
            }
        }
    } else {
        sendResponse(isStop ? ["Stopped", ""] : ["Started", kh_Array_pub])
    }
});

//==========下面的别动========
if (document.getElementsByName("userpwd_text")[0] !== undefined) {
    document.getElementsByName("userpwd_text")[0].id = "userpwd_text";
}

function Patch_web() {
    var aa = window.top.document.getElementsByName("leftFrame")[0];
    if (aa !== undefined) {
        aa = aa.contentDocument;
        var t = 110;
        for (var i = 0; i < 21; i++) {
            var tmp = aa.getElementById('MFX' + i);
            if (tmp) {
                tmp.style["visibility"] = 'visible';
                tmp.style["top"] = t + 'px';
                t = t + 12;
            }
        }
    }
}

function loadSidebar() {
    console.log("load sidebar");
    Patch_web();
}

if (navigator.platform == "MacIntel") {
    if (document.readyState != "complete") { 
        while (document.readyState !== "complete") { 
            setInterval(function() {}, 1500); 
        }
    } 
    else { loadSidebar(); }
} 
else if(false){
    //Other Platform may needs to change here.
}
else { //default way
    window.onload = loadSidebar;
}
