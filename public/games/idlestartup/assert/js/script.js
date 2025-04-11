//===================================== ~fullscreen.php <script> ===========================================
$("#expand").on('click', function () {
    $("#iframehtml5").addClass("force_full_screen"); // css
    $("#_exit_full_screen").removeClass('hidden'); // display: hidden;

    //function: requestFullScreen(document.body);
    // $(".header").removeClass("fixed");

    requestFullScreen(document.body);
});

$("#_exit_full_screen").on('click', cancelFullScreen);

function requestFullScreen(element) {
    //theater mode
    $(".header-game").removeClass("header_game_enable_half_full_screen");
    $("#iframehtml5").removeClass("force_half_full_screen");

    // Supports most browsers and their versions.
    var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;
    if (requestMethod) { // Native full screen. 
        requestMethod.call(element);
    } else if (typeof window.ActiveXObject !== "undefined") { // Older IE
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
            wscript.SendKeys("{F11}");
        }
    }
}

function cancelFullScreen() {
    //add fixed header
    // $(".header").addClass('fixed');
    // .fixed {
    //     position: fixed;
    //     top: 0;
    //     left: 0;
    //     z-index: 4;
    // }

    $("#_exit_full_screen").addClass('hidden');
    $("#iframehtml5").removeClass("force_full_screen");

    //theater mode
    $(".header-game").removeClass("force_full_screen header_game_enable_half_full_screen");
    $("#iframehtml5").removeClass("force_half_full_screen");

    var requestMethod = document.cancelFullScreen || document.webkitCancelFullScreen || document.mozCancelFullScreen || document.exitFullScreenBtn;
    if (requestMethod) { // cancel full screen.
        requestMethod.call(document);
    } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
            wscript.SendKeys("{F11}");
        }
    }
}

// check exit
if (document.addEventListener) {
    document.addEventListener('webkitfullscreenchange', exitHandler, false);
    document.addEventListener('mozfullscreenchange', exitHandler, false);
    document.addEventListener('fullscreenchange', exitHandler, false);
    document.addEventListener('MSFullscreenChange', exitHandler, false);
}
function exitHandler() {
    if (document.webkitIsFullScreen === false ||
        document.mozFullScreen === false ||
        document.msFullscreenElement === false) {
        cancelFullScreen();
    }
}

//============================== theater Mode  =========================================
function theaterMode() {
    //function: requestFullScreen(document.body);
    // if($(".header").hasClass("fixed")) {
    //     $(".header").removeClass("fixed");
    // } else {
    //     $(".header").addClass("fixed");
    // }

    //  CSS: body::-webkit-scrollbar {display: none;} set  class 'scroll'
    // if($("body").hasClass("scroll")) {
    //     $("body").removeClass("scroll");
    // } else {
    //     $("body").addClass("scroll");
    // }

    // if($("#back-to-top").hasClass("hidden-scroll")) {
    //     $("#back-to-top").removeClass("hidden-scroll");
    // } 
    // else {
    //     $("#back-to-top").addClass("hidden-scroll");
    // }

    let iframe = document.querySelector("#iframehtml5");
    if (iframe.classList.contains("force_half_full_screen")) {

        iframe.classList.remove("force_half_full_screen")
        document.querySelector(".header-game").classList.remove("header_game_enable_half_full_screen")
        return;
    }
    let above = 0;
    let left = 0;
    let below = $(".header-game").outerHeight();
    let right = 0;
    // let width = window.innerWidth;
    // let height = window.innerHeight;
    if (!document.querySelector("#style-append")) {
        let styleElement = document.createElement("style");
        styleElement.type = "text/css";
        styleElement.setAttribute('id', "style-append");
        let cssCode = `
    .force_half_full_screen{
    position: fixed!important;
    top: 0!important;
    left: 0!important;
    z-index: 887!important;
    top:${above}px!important;
    left:${left}px!important;
    width:calc(100% - ${left}px)!important;
    height:calc(100% - ${above + below}px)!important;
    background-color:#000;
    }
    .header_game_enable_half_full_screen{
        position:fixed;
        left:${left}px!important;
        bottom:0!important;
        right:0!important;
        z-index:887!important;
        width:calc(100% - ${left}px)!important;
        padding-left:10px;
        padding-right:10px;
        border-radius:0!important;
    }
    @media (max-width: 1364px){
        .force_half_full_screen{
            left:0!important;
            width:100%!important;
        }
        .header_game_enable_half_full_screen{
            width:100%!important;
            left:0!important;
        }
    }`
        styleElement.innerHTML = cssCode;
        document.querySelector('head').appendChild(styleElement);
    }
    iframe.classList.add("force_half_full_screen")
    document.querySelector(".header-game").classList.add("header_game_enable_half_full_screen")
}


/*============================== dark mode ==============================*/
//click light-off => save light-off vs (localStorage);
$(".light-on").on('click', function () {
    $("body").addClass("lightmode");
    $(this).hide();
    $(".light-off").attr('style', "display:flex!important");
    setLocalStorage("theme_mode", "lightmode");
})

$(".light-off").on('click', function () {
    $("body").removeClass("lightmode")
    $(this).attr('style', "display:none!important");
    $(".light-on").show();
    setLocalStorage("theme_mode", "darkmode");
})

/*============================== Header ==============================*/
if (document.querySelector('.header')) {
    $('.header__btn').on('click', function () {
        // $('.header').toggleClass("fixed");
        $('.nav-right').slideToggle("fast");
    })
}

// ============================ search ================================= 

$('#game-search').on('input', function (e) {
    let keywords = $(this).val();
    var rex_rule = /[ \-\.?:\\\/\_\'\*]+/g;
    var value1 = keywords.replace(rex_rule, " ").trim().toLowerCase();
    value1 = value1.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    //t.h1: 
    if (value1) {
        $('.search-more').removeClass('hidden-search', { duration: 1000 });
        $('.search-more').addClass('border-top2');
        $('.search-term').addClass('border-bottom');
        // searchGame(value1);

        let arr_games = [];
        searchGameNew(value1, arr_games)
    } else {
        // console.log("else");
        $('.search-more').addClass('hidden-search', { duration: 1000 });
        $('.search-term').removeClass('border-bottom', { duration: 1000 });
    }
    e.stopPropagation();
});

//th3 
$('#game-search').on('keydown', function (event) {
    var key = event.keyCode || event.charCode;
    // console.log(key)
    if (key == 8 || key == 46) {
        $('.search-more').addClass('hidden-search', { duration: 1000 });
        $('.search-term').removeClass('border-bottom', { duration: 1000 });
    }
})

// th4
$(document).click(function () {
    $('.search-more').addClass('hidden-search', { duration: 1000 });
    $('.search-term').removeClass('border-bottom', { duration: 1000 });
});

// th5:
$("#game-search").click(function (e) {
    let keywords = $(this).val();
    if (keywords) {
        $('.search-more').removeClass('hidden-search', { duration: 1000 });
        $('.search-more').addClass('border-top2');
        $('.search-term').addClass('border-bottom');
    }
    e.stopPropagation();
});

// th6: 
$("#search-ajax").click(function (e) {
    e.stopPropagation();
});
$(".btn-search").click(function (e) {
    e.stopPropagation();
});


function searchGameNew(value, arr_games) {
    var allTagA = $(".search-more").children();
    for (var i = 0; i < allTagA.length; i++) {
        allTagA[i].remove();
    }

    for (let i = 0; i < search_data.length; i++) {
        let name = search_data[i].name;
        let aTag = search_data[i].aTag;
        if (name.includes(value)) {
            arr_games.push(aTag);
        }
    }

    if (arr_games.length <= 0) {
        $('.search-more').append('<div class="search-end">Not found!</div>');
    } else {
        for (let a of arr_games) {
            $('.search-more').append(a);
        }
    }
}

// ***
let search_data = [];
document.addEventListener("DOMContentLoaded", function (event) {

    function get_search_data() {
        const uniqueNames = new Set();
        for (let a of $("div.card-masonry .item")) {
            let name = a.title;
            name = name.trim().toLowerCase();

            if (!uniqueNames.has(name)) {
                uniqueNames.add(name);

                let img = a.querySelector("img");
                img = img.getAttribute("src");

                let aTag = a.href;
                aTag = '<a class="games-show-item" href="' + aTag + '" title="' + name + '">';
                aTag += '<img class="games-show-img" src="' + img + '" width="45" height="45" alt="' + name + '" title="' + name + '">';
                aTag += '<span class="games-show-title">' + name + '</span>' + '</a>';

                search_data.push({ name: name, aTag: aTag });
            }
        }
        return search_data;
    }
    get_search_data();
    // console.log(search_data.length)
});


// ============================ form select category ================================= 
$(document).on('change', '.category-input', function (e) {
    e.preventDefault();

    console.log('vao day')

    window.location = $(this).find('option:selected').val();
});

// ========================================= total-like ============================
$(".total-like").one("click", function () {
    $(".emojis-img").css({
        fill: "#1abc9c",
    })
    $(".total-like").css({
        cursor: "unset",
    })

    $(".total-like .count").css({
        color: "#1abc9c",
    })
})

// ================================= back-to-top ============================
$(document).ready(function () {
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('#back-to-top').fadeIn();
        } else {
            $('#back-to-top').fadeOut();
        }
    });
    $("#back-to-top").click(function () {
        $("html, body").animate({
            scrollTop: 0
        }, 300);
    });
})


let resizeTimer;
$(window).resize(function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
        let displayValue = $('.header__btn').css('display');
        if (displayValue === 'none') {
            $('.nav-right').css('display', 'flex');
        } else {
            $('.nav-right').css('display', 'none');
        }
    }, 100); // Adjust the delay as needed (e.g., 100ms)
});


// .header {transition: transform .3s;}  ==> .is-hide {transform: translate3d(0, -76px, 0);}
function hideHeaderAfterScrollDown() {
    var e,
        t = document.documentElement,
        a = document.querySelector("header"),
        s = "is-hide",
        o = window.scrollY || t.scrollTop,
        n = 0,
        i = 0;
    window.addEventListener("scroll", function l() {
        var r, c;
        (e = window.scrollY || t.scrollTop) > o ? (n = "down") : e < o && (n = "up"),
            n !== i &&
            ((r = n),
                (c = e),
                "down" === r && c > 104 ? (a.classList.add(s), (i = r)) : "up" === r && (a.classList.remove(s), (i = r))),
            (o = e);
    });
}
hideHeaderAfterScrollDown()