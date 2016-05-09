/******************************************************************************** 公共类 ********************************************************************************/
requestAnimationFrame = (function () {
    return window.requestAnimationFrame
        || window.webkitRequestAnimationFrame
        || window.mozRequestAnimationFrame
        || window.oRequestAnimationFrame
        || window.msRequestAnimationFrame
        || function (callback) { return setTimeout(callback, 1); };
})();
var Common = {
    isEmptyObject: function (o) {
        for (var property in o) {
            return false;
        }
        return true;
    },
    setTimeout: function (callback, time) {
        var endTime = +new Date() + time,
            ctrl = {};
        ctrl._clear = false;
        ctrl.clear = function () {
            ctrl._clear = true;
        }
        ctrl.run = function () {
            if (ctrl._clear) { return; }
            if (+new Date() >= endTime) {
                callback();
            } else {
                requestAnimationFrame(ctrl.run);
            }
        };
        ctrl.run();
        return ctrl;
    },
    setInterval: function (callback, time, count) {
        var ctrl = {};
        ctrl.count = 0;
        ctrl._clear = false;
        ctrl._childCtrl = {};
        if (arguments.length < 3) {
            ctrl.isOver = function () {
                return ctrl._clear;
            }
        } else {
            ctrl.isOver = function () {
                return (ctrl._clear || ctrl.count >= count) ? true : false;
            }
        }
        ctrl.clear = function () {
            ctrl._childCtrl.clear();
            ctrl._clear = true;
        }
        ctrl.run = function () {
            ctrl._childCtrl = Common.setTimeout(function () {
                if (ctrl.isOver()) { return; }
                ctrl.count++;
                callback(ctrl);
                ctrl.run();
            }, 1000);
        };
        ctrl.run();
        return ctrl;
    },
    shuffleArr: function (array) {
        var m = array.length,
            t, i;
        // 如果还剩有元素…
        while (m) {
            // 随机选取一个元素…
            i = Math.floor(Math.random() * m--);
            // 与当前元素进行交换
            t = array[m];
            array[m] = array[i];
            array[i] = t;
        }
        return array;
    }
}

/******************************************************************************** 公用函数 ********************************************************************************/
/* mCtrl */
var mCtrl = {}
/* 初始化页面 */
mCtrl.initPage = function (pageId) {
    $(".g_tool .up").click(function () {
        $("body").scrollTop(0);
    });
    switch (pageId) {
        case "index":
            mCtrl.initIndex();
            break;
        case "reg":
            mCtrl.initReg();
            break;
        case "userOrder":
            mCtrl.initUserOrder();
            break;
        case "order":
            mCtrl.initOrder();
            break;
        case "confirmationOrder":
            mCtrl.initConfirmationOrder();
            break;
        case "orderInput":
            mCtrl.initOrderInput();
            break;
        case "orderDetail":
            mCtrl.initorderDetail();
            break;
        case "editUserInfo":
            mCtrl.initEditUserInfo();
            break;
        case "login":
            mCtrl.initLogin();
            break;
        case "retrievePassword":
            mCtrl.initRetrievePassword();
            break;
        default:

    }
}
/* 处理input获取\失去焦点的行为 */
mCtrl.textInputFocus = function ($input, val, on,callback1,callback2) {
    $input.focusin(function () {
        if ($input.val() == val) {
            $input.val("");
        }
        $input.addClass(on);
        if (callback1) { callback1(); }
    }).focusout(function () {
        if ($input.val().length == 0) {
            $input.val(val);
        }
        $input.removeClass(on);
        if (callback2) { callback2(); }
    });
}
/* slider插件 */
mCtrl.sliderInit = function (id, callback) {
    var g_swiper = new Swiper(id, {
        pagination: id + ' .pagination',
        paginationClickable: true,
        loop: true,
        autoplay: 3000
    });
    if (callback) {
        callback(g_swiper);
    }
    return g_swiper;
}
/* carousel插件 */
mCtrl.carouselInit = function (id, perView, callback) {
    var g_carousel = new Swiper('id', {
        pagination: id + '.pagination',
        paginationClickable: true,
        slidesPerView: perView,
        loop: true
    });
    if (callback) {
        callback(g_carousel);
    }
    return g_carousel;
}
/*
 * 显示遮罩
 * off[bool]:关闭/显示遮罩
 * bdId[string\number]:显示指定的内容体[id\idx]
 */
mCtrl.mask = function (para) {
    var $mask = $(".ui_mask");
    var $maskBd = $mask.find(".ui_mask_bd");
    var $bd = null;
    //获取bdIdx
    if (para.id != null) {
        switch (typeof (para.id)) {
            case "string":
                for (var i = 0; i < $maskBd.length; i++) {
                    if ($($maskBd[i]).attr("class").indexOf(para.id) != -1 || $($maskBd[i]).attr("id").indexOf(para.id) != -1) {
                        $bd = $($maskBd[i]);
                        break;
                    }
                }
                break;
            case "number":
                if (0 <= para.id && para.id < $maskBd.length) {
                    $bd = $($maskBd[para.id]);
                }
                break;
            default:

        }
    }
    if (!para.off) {
        //显示遮罩
        if ($bd) {
            $maskBd.css("display", "block");
            $bd.css("display", "block");
            $mask.css("visibility", "visible").css("opacity", "1");
        }
    } else {
        //隐藏遮罩
        $mask.css("opacity", "0");
        Common.setTimeout(function () {
            $mask.css("visibility", "hidden");
        }, 500);

    }
}

/******************************************************************************** 页面初始化 ********************************************************************************/
/* 页面初始化:index */
mCtrl.initIndex = function () {
    $(".ui_textInput_date input").datepicker();
    mCtrl.sliderInit(".g_slider", function (slider) {
        $('.g_slider .prev').on('click', function (e) {
            e.preventDefault();
            slider.swipePrev();
        });
        $('.g_slider .next').on('click', function (e) {
            e.preventDefault();
            slider.swipeNext();
        });
    });
    $(".ui_dropList li").each(function (i,e) {
        $(e).click(function () {
            $(".ui_textInput_earth input").val($(e).html());
            $(".ui_dropList").removeClass("show");
        });
    });
    mCtrl.textInputFocus($(".ui_textInput_earth input"), "选择目的地", "on", function () {
        $(".ui_dropList").addClass("show");
    }, function () {
        //$(".ui_dropList").removeClass("show");
    });
    mCtrl.textInputFocus($(".ui_textInput_date input"), "选择日期", "on");
    //mCtrl.carouselInit(".g_carousel", 6);
    var g_carousel = new Swiper('.g_carousel', {
        slidesPerView: 5,
        loop: true,
        autoplay: 3000
    });
    $(".wb_friend .prev").on('click', function (e) {
        e.preventDefault();
        g_carousel.swipePrev();
    });
    $(".wb_friend .next").on('click', function (e) {
        e.preventDefault();
        g_carousel.swipeNext();
    });
}
/* 页面初始化:reg */
mCtrl.initReg = function () {
    $(function () {
        //输入框处理
        var arrVal = [];
        $(":text").each(function (i, e) {
            arrVal.push($(e).val());
            $(e).focusin(function () {
                $(e).val("");
                $(e).addClass("textIn");
            }).focusout(function () {
                if ($(e).val().length == 0) {
                    $(e).removeClass("textIn");
                    $(e).val(arrVal[i]);
                }
            });
        });

        $(".btnAgreement").click(function () {
            if ($(window).outerHeight() <= 768) {
                $(".wb_agreement .text").css("max-height", $(window).outerHeight() * 0.4);
            }
            $(".wb_agreement").css("margin-top", -1 * $(".wb_agreement").outerHeight() / 2 + "px");
            mCtrl.mask({
                off: false,
                id: "wb_agreement"
            });
        });
        $(".wb_agreement .btnClose,.wb_agreement .btnAgree").click(function () {
            mCtrl.mask({ off: true });
        });
    });
};
/* 页面初始化:userOrder */
mCtrl.initUserOrder = function () {
    $(".w_switch li").each(function (i, e) {
        //$(e).click(function () {
        //    $(".w_switch li").removeClass("on");
        //    $(e).addClass("on");
        //});
    });
}
/* 页面初始化:order */
mCtrl.initOrder = function () {
    (function () {
        $(".wb_trip .ui_title1 h3 a").each(function (i, e) {
            if ($(e).parent().parent().parent().find("table tr").length < 4) {
                $(e).parent().parent().hide();
            }
            $(e).parent().parent().parent().find("table tr").each(function (i2, e2) {
                if (i2 < 3) {
                    $(e2).css("display", "table-row");
                } else {
                    $(e2).css("display", "none");
                }
            });
            $(e).click(function () {
                if ($(e).html() == "更多") {
                    $(e).parent().parent().parent().find("table tr").css("display", "table-row");
                    $(e).html("收起");
                } else {
                    $(e).parent().parent().parent().find("table tr").each(function (i2, e2) {
                        if (i2 < 3) {
                            $(e2).css("display", "table-row");
                        } else {
                            $(e2).css("display", "none");
                        }
                    });
                    $(e).html("更多");
                }
            });
        });
    })();
    $(".ui_textInput_date input").datepicker();
    mCtrl.sliderInit(".g_slider", function (slider) {
        $('.g_slider .prev').on('click', function (e) {
            e.preventDefault();
            slider.swipePrev();
        });
        $('.g_slider .next').on('click', function (e) {
            e.preventDefault();
            slider.swipeNext();
        });
    });
    $(".wb_detail dd.w_pay .btnTag").hover(function (e) {
        e.preventDefault();
        e.stopPropagation();
        $(".wb_detail dd.w_pay .tagBox").toggleClass("show");
    });
    $(".wb_detail dd.w_pay .tagBox").click(function (e) {
        e.preventDefault();
        e.stopPropagation();
    });
    $(".wb_pay .w_fun a.btnDetail").click(function (e) {
        e.preventDefault();
        e.stopPropagation();
        $(".wb_payDetail").toggleClass("show");
    });
    $(".wb_payDetail").click(function (e) {
        e.preventDefault();
        e.stopPropagation();
    });
    $("body").click(function () {
        $(".wb_payDetail").removeClass("show");
        $(".wb_trip .wb_time label .tag").removeClass("show");
        $(".wb_detail dd.w_pay .tagBox").removeClass("show");
    });

    $(".wb_trip .wb_list").each(function (i, e) {
        $(e).find(".w_radio input").change(function () {
            $(e).find("li").removeClass("show");
            $($(e).find("li")[$.inArray(this, $(e).find(".w_radio input"))]).addClass("show");
        });
    });
    $(".wb_trip .wb_time label .tag").click(function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
    });
    $(".wb_trip .wb_time label a").each(function (i, e) {
        $(e).click(function (evt) {
            evt.preventDefault();
            evt.stopPropagation();
            $(".wb_trip .wb_time label .tag").removeClass("show");
            $(e).parent().find(".tag").toggleClass("show");
        });
    });
    //fixed trip
    var $wbPay = $(".wb_pay"),
        wbPay_top = $(".wb_pay").offset().top,
        $document = $(document),
        $wbSetOut = $(".wb_setOut");
    $(document).scroll(function (e) {
        var _t = $document.scrollTop();
        if (_t > wbPay_top) {
            $wbPay.addClass("fixed");
            $wbSetOut.css("margin-bottom", (20 + $wbPay.outerHeight()) + "px");
        } else {
            $wbPay.removeClass("fixed");
            $wbSetOut.css("margin-bottom", "20px");
        }

    });
}
/* 页面初始化:confirmationOrder */
mCtrl.initConfirmationOrder = function () {
    $("body").click(function (e) {
        $(".wb_order .wb_payDetail").removeClass("show");
    });
    $(".wb_order .w_hd .btnDetail").click(function (e) {
        e.preventDefault();
        e.stopPropagation();
        $(".wb_order .wb_payDetail").toggleClass("show");
    });
    $(".wb_order .wb_payDetail").click(function (e) {
        e.preventDefault();
        e.stopPropagation();
    });

}
/* 页面初始化:orderInput */
mCtrl.initOrderInput = function () {
    //输入框处理
    var arrVal = [];
    $(":text").each(function (i, e) {
        arrVal.push($(e).val());
        $(e).focusin(function () {
            $(e).val("");
            $(e).addClass("textIn");
        }).focusout(function () {
            if ($(e).val().length == 0) {
                $(e).removeClass("textIn");
                $(e).val(arrVal[i]);
            }
        });
    });
    $("body").click(function (e) {
        $(".wb_payDetail").removeClass("show");
    });
    $(".w_hd .btnDetail").click(function (e) {
        e.preventDefault();
        e.stopPropagation();
        $(".wb_payDetail").toggleClass("show");
    });
    $(".wb_payDetail").click(function (e) {
        e.preventDefault();
        e.stopPropagation();
    });
    $(".btnAgreement").click(function () {
        if ($(window).outerHeight() <= 768) {
            $(".wb_agreement .text").css("max-height", $(window).outerHeight() * 0.4);
        }
        $(".wb_agreement").css("margin-top", -1 * $(".wb_agreement").outerHeight() / 2 + "px");
        mCtrl.mask({
            off: false,
            id: "wb_agreement"
        });
    });
    $(".wb_agreement .btnClose,.wb_agreement .btnAgree").click(function () {
        mCtrl.mask({ off: true });
    });
}
/* 页面初始化:orderDetail */
mCtrl.initorderDetail = function () {
    $($(".wb_process label")[$(".wb_process label.ok").length]).find("span").addClass("show");
}
/* 页面初始化:EditUserInfo */
mCtrl.initEditUserInfo = function () {
    //输入框处理
    var arrVal = [];
    $(":text").each(function (i, e) {
        arrVal.push($(e).val());
        $(e).focusin(function () {
            $(e).val("");
            $(e).addClass("textIn");
        }).focusout(function () {
            if ($(e).val().length == 0) {
                $(e).removeClass("textIn");
                $(e).val(arrVal[i]);
            }
        });
    });
}
/* 页面初始化:login */
mCtrl.initLogin = function () {
    //输入框处理
    var arrVal = [];
    $(":text").each(function (i, e) {
        arrVal.push($(e).val());
        $(e).focusin(function () {
            $(e).val("");
            $(e).addClass("textIn");
        }).focusout(function () {
            if ($(e).val().length == 0) {
                $(e).removeClass("textIn");
                $(e).val(arrVal[i]);
            }
        });
    });
}
/* 页面初始化:retrievePassword */
mCtrl.initRetrievePassword = function () {
    //输入框处理
    var arrVal = [];
    $(":text").each(function (i, e) {
        arrVal.push($(e).val());
        $(e).focusin(function () {
            $(e).val("");
            $(e).addClass("textIn");
        }).focusout(function () {
            if ($(e).val().length == 0) {
                $(e).removeClass("textIn");
                $(e).val(arrVal[i]);
            }
        });
    });
}