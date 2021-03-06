

function pathPrepare($el) {
    $el = $($el);

    $el.each((i, e) => {
        var lineLength = e.getTotalLength();
        // console.log(lineLength)
        $(e).css("stroke-dasharray", lineLength);
        $(e).css("stroke-dashoffset", lineLength);
    })

}
function replaceSvg(str) {
    let indexString = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.toLowerCase();
    let path = '';
    let $path = $('#svgpath path');
    for (let i = 0; i < str.length; i++) {
        console.log(indexString.indexOf(str[i]))
        path += $path[indexString.indexOf(str[i])].outerHTML
    }
    return path;
}

function scrollItem(index) {
    let _widthImg = $(`.section-2 .list:eq(${index}) .cover .wrap`).width() + 300,
        imgLen = $(`.section-2 .list:eq(${index}) .cover img`).length;


    let controller2 = new ScrollMagic.Controller();

    let name = $(`.section-2 .list:eq(${index}) .name`)[0],
        year = $(`.section-2 .list:eq(${index}) .year`)[0],
        num = $(`.section-2 .list:eq(${index}) .num`)[0],
        cover = $(`.section-2 .list:eq(${index}) .cover .wrap`)[0],
        list = $(`.section-2 .list:eq(${index})`)[0],
        skewEle = $(`.section-2 .list:eq(${index}) .cover`)[0]

    let numX = -window.innerWidth / 2 - num.offsetWidth / 2 + num.getBoundingClientRect().x;

    let nameX = - name.getBoundingClientRect().x - name.offsetWidth

    let wipeAnimation2 = new TimelineMax()

    $(name).css({ transform: `translate3d(${nameX}px,0,0)` })
    $(num).css({ transform: `translate3d(${numX}px,0,0)` })
    $(cover).css({ transform: `translate3d(${_widthImg}px,${window.innerHeight}px,0)`, })
    $(year).css({
        transform: `translate3d(0,-100px,0)`,
        opacity: 0
    })
    $(list).css({height: window.innerHeight + 'px'})
    let color = list.getAttribute('data-color')
    wipeAnimation2
        .to('.section-2 .dot ul', 1, { backgroundColor: color })
        .to('.section-2', 1, { backgroundColor: color, delay: -1 })
        .to(name, 2, { x: 0, ease: Expo.ease })
        .to(year, 2, { opacity: 1, y: 0, delay: -2, ease: Expo.ease })
        .to(num, 2, { x: 0, delay: -2, ease: Expo.ease })
        .to(cover, 2, { y: 0, delay: -2, ease: Expo.ease })
        .to(cover, imgLen, { x: 0, ease: Expo.linear })


    let listLastIndex = $('.section-2 .list').length - 1;


    new ScrollMagic.Scene({
        triggerElement: list,
        triggerHook: 1,
        duration: _widthImg,
        offset: window.innerHeight
    })
        .setPin(list)
        .setTween(wipeAnimation2)
        // .addIndicators(index)
        .addTo(controller2)

        .on('enter', (e) => {
            // console.log('enter', index)

            $(`.section-2 .dot li:eq(${index}) a`).addClass('current').trigger('mouseenter', { onInit: true })
            if ((index === 0 && e.scrollDirection === 'FORWARD') ||
                (index === listLastIndex && e.scrollDirection === 'REVERSE')) {
                // $('.section-2 .dot').show();
                openDot(true)
            }

            $('.scroll-text').show();
            // skewElement = skewEle

        })
        .on('leave', (e) => {
            // console.log('leave', index)

            setTimeout(() => {
                $(`.section-2 .dot li:eq(${index}) a`).removeClass('current').trigger('mouseleave')
            }, 0)
            if ((index === listLastIndex && e.state === 'AFTER') ||
                (index === 0 && e.scrollDirection === 'REVERSE')) {
                openDot(false)

                // $('.section-2 .dot').hide();
            }

            if ((index === listLastIndex && e.state === 'AFTER')) {
                $('.scroll-text').hide();
            }



            skewEle.style.transform = `skewX(0deg)`
            skewElement = false

        })
        .on('progress', (event) => {

            if (event.progress > (1 - (imgLen / (2 + imgLen)))) {
                skewElement = skewEle
            }

        })



    // let t1 = gsap.timeline({
    //     scrollTrigger: {
    //         trigger: list,
    //         scrub: true,
    //         start: 'top top',
    //         end: `+=${_widthImg + 2000}`,
    //         pin: true
    //     }
    // })
    // .to('.section-2 .dot ul', 2, { backgroundColor: color })
    // .to('.section-2', 2, { backgroundColor: color, delay: -2 })
    // .to(name, 3, { x: 0, ease: Expo.ease })
    // .to(year, 3, { opacity: 1, y: 0, delay: -3, ease: Expo.ease })
    // .to(num, 3, { x: 0, delay: -3, ease: Expo.ease })
    // .to(cover, 3, { y: 0, delay: -3, ease: Expo.ease })
    // .to(cover, imgLen, { x: 0, ease: Expo.ease })




    // $(`.section-2 .list:eq(${index}) .cover .img-wrap`).on('mousemove', function (e) {
    //     let xAxis = -(this.offsetWidth / 2 - e.offsetX) / 20
    //     let yAxis = -(this.offsetHeight / 2 - e.offsetY) / 20
    //     this.querySelector('img, video').style.transform = `rotateX(${yAxis}deg) rotateY(${xAxis}deg)`
    // })

    // $(`.section-2 .list:eq(${index}) .cover .img-wrap`).on('mouseenter', function () {
    //     this.querySelector('img, video').style.transition = undefined

    // })

    // $(`.section-2 .list:eq(${index}) .cover .img-wrap`).on('mouseleave', function () {
    //     this.querySelector('img, video').style.transition = 'all .3s ease-in-out'
    //     this.querySelector('img, video').style.transform = 'rotateX(0deg) rotateY(0deg)'

    // })

}


function drawSvg(elePath, options = { play: false, time: 1.5, duration: 200, delay: 0 }) {

    let { play, time, duration, delay } = options;

    var $word = $(elePath);
    // var $dot = $("path#dot");

    // prepare SVG
    pathPrepare($word);
    // pathPrepare($dot);

    // init controller
    var controller = new ScrollMagic.Controller();

    // build tween
    var tween = new TimelineMax()
        .add(TweenMax.to("path", 0, { stroke: "#fff", ease: Linear.easeNone }), 0)			// change color during the whole thing
        .add(TweenMax.to($word, time, { strokeDashoffset: 0, ease: Linear.easeNone, delay }), 0) // draw word for 0.9
    // .add(TweenMax.to($dot, 0.1, { strokeDashoffset: 0, ease: Linear.easeNone }))  // draw dot for 0.1

    if (play) {
        tween.play()
    } else {
        var scene = new ScrollMagic.Scene({ triggerElement: elePath, triggerHook: 0.5, duration, tweenChanges: true })
            .setTween(tween)
            // .addIndicators() // add indicators (requires plugin)
            .addTo(controller);
    }
    // build scene

}


function drawSvgWorkTogeTher() {

    let elePath = '.section-3 path'
    var $word = $(elePath);

    pathPrepare($word);

    var controller = new ScrollMagic.Controller();

    let tween = new TimelineMax()
        .to('.section-3 .main-title path', 1, { stroke: 'white', strokeDashoffset: 0, ease: Expo.linear })
        .from('.section-3 .arrow', 0.5, { opacity: 0, x: -100 })
        .from('.section-3 .contact', 1, { y: 100, opacity: 0 }, { y: 0, opacity: 1, delay: -1 })
        .to('.section-3 .signature path', 1, { stroke: 'white', strokeDashoffset: 0, ease: Expo.linear })
        .to('.section-3 .main-title path', 1, { fill: 'white', delay: -1 })



    new ScrollMagic.Scene({ triggerElement: elePath, triggerHook: 0.5 })
        .setTween(tween)
        // .addIndicators({ name: "GSAP" })
        .addTo(controller)

    tween.play()
}


function hoverMovement(element, movement = 40) {
    var hoverFollow = $(element);
    hoverFollow.mouseleave(function (e) {
        TweenMax.to($(this), 0.3, { x: 0, y: 0 });
    });
    hoverFollow.mousemove(function (e) {
        // followParallaxMouse(e, $(this));

        var $this = $(this);
        var relX = e.pageX - $this.offset().left;
        var relY = e.pageY - $this.offset().top;
        TweenMax.to(this, 0.3, {
            x: (relX - $this.width() / 2) / $this.width() * movement,
            y: (relY - $this.height() / 2) / $this.height() * movement
        });
    });

    function followParallaxMouse(e, target) {
        // parallaxMouse(e, target, 40);

        var $this = target;
        var relX = e.pageX - $this.offset().left;
        var relY = e.pageY - $this.offset().top;
        TweenMax.to(target, 0.3, {
            x: (relX - $this.width() / 2) / $this.width() * movement,
            y: (relY - $this.height() / 2) / $this.height() * movement
        });
    }

    // function parallaxMouse(e, target, movement) {
    //     var $this = target;
    //     var relX = e.pageX - $this.offset().left;
    //     var relY = e.pageY - $this.offset().top;
    //     TweenMax.to(target, 0.3, {
    //         x: (relX - $this.width() / 2) / $this.width() * movement,
    //         y: (relY - $this.height() / 2) / $this.height() * movement
    //     });
    // }
}


let data = {}

function svgHover(name, ele, flag) {

    if (data[name]) {
        data[name].reversed(!flag)
    } else {

        // var controller = new ScrollMagic.Controller();


        // build tween
        var tween = new TimelineMax()
            // .to(ele, 0, { stroke: 'white',ease: Linear.easeNone })
            .to(ele, 0.5, { strokeDashoffset: 0, ease: Linear.easeNone })

        // tween.play();

        data[name] = tween;
    }
}
let firstTime = JSON.parse(localStorage.getItem('first-time'));

firstTime = firstTime === false ? false : true;

function openDot(flag = true, init = false) {
    if (data.dotController) {
        data.dotController.reversed(!flag)

        if (firstTime) {
            $('.first-scroll').show(200);
            firstTime = false;
            localStorage.setItem('first-time', false)

            // setTimeout(() => {
            //     $('.first-scroll').hide(200, () => {
            //         $('.first-scroll').remove();
            //     });
            // }, 10000)
        }
    } else {
        var tween = new TimelineMax()
            .from('.section-2 .dot', 0.3, { xPercent: -150, ease: Linear.easeInOut })
        if (init) {
            tween.reversed(!tween.reversed());
        }
        data.dotController = tween;


    }


}


function initDot() {

    $('.section-2 .list').each((i, e) => {
        let id = 'item-id-' + i;
        $(e).attr('id', 'item-id-' + i)

        // let name = $(e).find('.name').text()
        let img = $(e).find('.cover img').first().attr('src');

        // let $ele = $(`<li><a class="mousecircle" href="#${id}">${i + 1}<h3>${name}</h3></a></li>`);
        let $ele = $(`<li><a class="mousecircle" href="#${id}">${i + 1}<div class="cover"><img src="${img}"/></div></a></li>`);
        // let $ele = $(`<li><a class="mousecircle link" href="#${id}">${i + 1}<img src="${img}"/></a></li>`);
        $('.section-2 .dot ul').append($ele)

        let tween = new TimelineMax()
            .to($ele.find('.cover'), 0.3, { width: 0, ease: Expo.easeInOut })
        // tween.reversed()
        addHoverCircle($ele.find('a'), 25)


        if(!isMobile()){
            $ele.find('a').on('mouseenter', function (event, params) {
                if (!isMobile() && !(params && params.onInit)) {
                    tween.reversed(true)
                }
            })
            $ele.find('a').on('mouseleave', function () {
                if(!isMobile()){
                    tween.reversed(false)
                }
            })
        }
        
    });



    // init controller
    var controller = new ScrollMagic.Controller();

    // change behaviour of controller to animate scroll instead of jump
    controller.scrollTo(function (newpos) {
        $('html').animate({
            scrollTop: newpos + 200
        }, 1000, 'swing')
        // $(window).scrollTop(36465)
        // TweenMax.to(window, 0.5, { scrollTo: { y: newpos } });
    });




    $('.section-2 .dot a').on('click', function (e) {
        var id = $(this).attr("href");
        e.preventDefault();
        if ($(id).length > 0) {
            e.preventDefault();

            // trigger scroll
            controller.scrollTo(id);

            // if supported by the browser we can even update the URL.
            // if (window.history && window.history.pushState) {
            //     history.pushState("", document.title, id);
            // }
        }
    })

    openDot(false, true)
}
function addHoverCircle(ele, movement = 40) {
    let $ele = $(ele);
    let id = Math.round(Math.random() * 10000)

    let rotate = Math.round(Math.random() * 360)
    $ele.append(`<svg style="transform: translate(-50%,-50%) rotateZ(${rotate}deg) " xmlns="http://www.w3.org/2000/svg" viewBox="-10 -10 67 65" class="circle svg replaced-svg">
        <path class="DrawCircle" d="M33.72 1.25A28.4 28.4 0 0012.43 4.7a22.6 22.6 0 00-7.77 7.75 21.33 21.33 0 00-1.81 16.69 22.75 22.75 0 0014.47 14.8 22.79 22.79 0 0020.42-3.41 22.79 22.79 0 008.89-18.7A20.86 20.86 0 0035.88 4.29C29.14.77 20.89 2 14.4 5.5 8.23 8.82 3.05 14.32 1.2 21.22a19.9 19.9 0 00-.46 2.14 15.44 15.44 0 001 8.93 19.1 19.1 0 001 1.92" fill="none" stroke="#231f20" stroke-linecap="round" stroke-linejoin="round" style="opacity: 1; stroke-dashoffset: 194px; stroke-dasharray: 194px; stroke: white;"></path>
    </svg>`)


    let $path = $ele.find('path')


    $ele.on('mouseenter', function () {
        svgHover(id, $path, true)
    })
    $ele.on('mouseleave', function () {
        if (!$(this).hasClass('current')) {
            svgHover(id, $path, false)
        }

    })
    if(!isMobile()){
        
    
        hoverMovement($ele, movement)
    }
    
}
function session1() {
    $('.section-1 .right').css({height: $('.section-1 .cover-wrap').height() + 'px'})

    let tween = new TimelineMax()
        .to('.section-1 .name path', 1, { strokeDashoffset: 0, ease: Expo.linear, delay: 0.5 })
        // .from('.section-1 .title', 1, { xPercent: -100, ease: Expo.easeInOut })
        // .from('.section-1 .des')
        .from('.section-1 .cover-wrap', 1,  { width: 0, ease: Expo.easeInOut })
        .staggerFrom('.section-1 .title .char', 0.5, { ease: 'Power3.easeIn', y: '-100%', opacity: 0 }, 0.014, 'start')
        .staggerFrom('.section-1 .des .char', 0.5, { ease: 'Power3.easeIn', y: '-100%', opacity: 0 }, 0.008, 'start')
        // .staggerFrom('.section-1 .bottom .char', 0.5, { ease: 'Power3.easeIn', y: '-100%', opacity: 0 }, 0.014, 'start')


        .to('.section-1 .signature path', 0.7, { strokeDashoffset: 0, ease: Expo.linear, delay: -0.3 })


    new ScrollMagic.Scene({
        triggerElement: '.session-1',
        triggerHook: 0,
        duration: isMobile() ? window.innerHeight : 500,
        // duration: window.outerHeight
    })
        // .addIndicators({ name: "GSAP" })
        .addTo(new ScrollMagic.Controller())
        .on('leave', () => {
            tween.reversed(true)
        })
        .on('enter', () => {
            tween.reversed(false)
        })

    tween.reversed(!tween.reversed())
}

function splitText(e) {
    let arr = e.textContent.replace(/[ ]{1,}/g, ' ').split(' ')
    let html = ''
    arr.forEach(e1 => {
        let html2 = ''
        for (let i = 0; i < e1.length; i++) {
            html2 += `<span class="char">${e1[i]}</span>`
        }
        html += `<div class="word" style="display: inline-block">${html2}</div> `
    })

    e.innerHTML = html
}

// function initSession2() {
//     new ScrollMagic.Scene({
//         triggerElement: '.section-2',
//         triggerHook: 1,
//         offset: window.outerHeight,
//         // duration: $('.section-3').position().top - window.outerHeight * 2
//     })
//         .setTween(new TimelineMax())
//         .addTo(new ScrollMagic.Controller())
//         .addIndicators({ name: "GSAP" })
//         .on('leave', () => {
//             $(`.section-2 .dot`).hide();
//             console.log('leave')
//         })
//         .on('enter', () => {
//             $(`.section-2 .dot`).show();
//             console.log('enter')

//         })


// }

function convertImgToSvg(img) {
    var $img = jQuery(img);
    var imgID = $img.attr('id');
    var imgClass = $img.attr('class');
    var imgURL = $img.attr('src');
    let style = $img.attr('style')

    jQuery.get(imgURL, function (data) {
        // Get the SVG tag, ignore the rest
        var $svg = jQuery(data).find('svg');

        // Add replaced image's ID to the new SVG
        if (typeof imgID !== 'undefined') {
            $svg = $svg.attr('id', imgID);
        }
        // Add replaced image's classes to the new SVG
        if (typeof imgClass !== 'undefined') {
            $svg = $svg.attr('class', imgClass + ' replaced-svg');
        }

        // Remove any invalid XML tags as per http://validator.w3.org
        $svg = $svg.removeAttr('xmlns:a');

        $svg.find('path').attr('style', style);

        // $svg.find('path').css({ stroke: 'white', strokeWidth: 2, fill: 'transparent' })

        let viewBox = $svg.attr('viewBox').split(' ')
        viewBox[0] = parseInt(viewBox[0]) - 10
        viewBox[1] = parseInt(viewBox[1]) - 10
        viewBox[2] = parseInt(viewBox[2]) + 20
        viewBox[3] = parseInt(viewBox[3]) + 20

        $svg.attr('viewBox', viewBox.join(' '))


        pathPrepare($($svg).find('path'))
        // Replace image with new SVG
        $img.replaceWith($svg);
    })
}

function menuAnimation() {
        const container = document.querySelector('#menu')
        const itemsWrapper = document.querySelector('#menu')

        // Preload images
        const preloadImages = () => {
            return new Promise((resolve, reject) => {
                imagesLoaded(document.querySelectorAll('img'), resolve);
            });
        };
        // And then..
        preloadImages().then(() => {
            // Remove the loader
            document.body.classList.remove('loading');
            const effect = new RGBShiftEffect(container, itemsWrapper, { strength: 0.25 })
        });


        $('#menu a').on('mouseenter', function(){
            $(this).parent().removeClass('opacity')
            .siblings().addClass('opacity')
        })
        $('#menu a').on('mouseleave', function(){
            $(this).parent().siblings().removeClass('opacity')
        })
}

async function delay(time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, time)
    })
}
let currentPixel = window.pageYOffset
let skewElement = null
function skew() {
    // let dragMe = Draggable.create('#main', {
    //     type: "y",
    //     edgeResistance: 1,
    //     // onDragEnd: slideAnim,
    //     // onDrag: tweenDot,
    //     // onThrowUpdate: tweenDot,
    //     // snap: offsets,
    //     inertia: true,
    //     zIndexBoost: false,
    //     // allowNativeTouchScrolling: false,
    //     bounds: "#main",
    //     onClick: () => {
    //         console.log('click')
    //     },
    //     onDragEnd: () => {
    //         console.log('drag ended')
    //     }
    // });

    let newPixel = window.pageYOffset
    if (skewElement) {

        let increment = newPixel - currentPixel
        if (increment < -50) increment = -50
        if (increment > 50) increment = 50
        let speed = increment * 0.3
        skewElement.style.transform = `skewX(${speed}deg)`
    }
    currentPixel = newPixel


    requestAnimationFrame(skew)
}

function scrollMagicHorizontal(element, trigger, position, time = 2, duration = 200) {
    let controller = new ScrollMagic.Controller();


    let wipeAnimation2 = new TimelineMax().from(element, time, { x: position, ease: Expo.ease })


    new ScrollMagic.Scene({
        triggerElement: trigger,
        triggerHook: 0,
        duration: duration
    })
        .setTween(wipeAnimation2)
        // .addIndicators()
        .addTo(controller)
}

function scrollMagicVertical(element, trigger, position, time = 2, duration = 200) {
    let controller = new ScrollMagic.Controller();


    let wipeAnimation2 = new TimelineMax().from(element, time, { y: position })


    new ScrollMagic.Scene({
        triggerElement: trigger,
        triggerHook: 0,
        duration: duration
    })
        .setTween(wipeAnimation2)
        // .addIndicators()
        .addTo(controller)
}



function init() {


    let controller = new ScrollMagic.Controller();

    let session2Title = new TimelineMax().from('.section-2 .main-sub-title', 1, { x: 700 })
        .from('.section-2 .main-title', 1, { x: 500, delay: -1 })
        .from('.section-2 .text-deco', 1, { x: -500, delay: -1 })


    new ScrollMagic.Scene({
        triggerElement: '.section-2 .top-title',
        triggerHook: 0.8,
        duration: 500,
        offset: -160
        // offset: window.innerHeight
    })
        .setPin('.sectin-2')
        .setTween(session2Title)
        // .addIndicators()
        .addTo(controller)



    if(isMobile()){

        $('.section-1  .text-deco').css('left', 0);
        scrollMagicHorizontal('.section-1  .text-deco', '.section-1', 300, 4, 300)


    }else{
        scrollMagicHorizontal('.section-1  .text-deco', '.section-1',  -1700, 4, 2000)

    }

    

    drawSvgWorkTogeTher()
    if(!isMobile()){
        skew()
        setTimeout(() => {
            menuAnimation()
        }, 5000)
    }

}


function isMobile(){
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}
let now = new Date();

$(async () => {

    document.querySelectorAll('[data-src]').forEach(e => {
        e.src = e.getAttribute('data-src')
    })

    jQuery('img.svg').each(function (i) {
        convertImgToSvg(this)
    });

    $('.split-text').each((i, e) => {
        splitText(e)
    })


    // Images loaded is zero because we're going to process a new set of images.
    var imagesLoaded = 0
    // Total images is still the total number of <img> elements on the page.
    var totalImages = $("img").length

    // Step through each image in the DOM, clone it, attach an onload event
    // listener, then set its source to the source of the original image. When
    // that new image has loaded, fire the imageLoaded() callback.
    $("img").each(function (idx, img) {
        $("<img>").on("load", imageLoaded).attr("src", $(img).attr("src"))
    })

    // Do exactly as we had before -- increment the loaded count and if all are
    // loaded, call the allImagesLoaded() function.
    function imageLoaded() {
        imagesLoaded++

        if (imagesLoaded == totalImages) {
            allImagesLoaded()
        }
    }


    var logo = new TimelineMax({ paused: true })

    logo.from('#header .logo', 1, {
        position: 'fixed',
        yPercent: -50,
        xPercent: -50,
        strokeWidth: 1,
        top: '50%',
        left: '50%',
        width: window.innerWidth > 768 ? 300 : window.innerWidth - 100
    })
        .from('#header .logo svg', 1, {
            strokeWidth: 2,
        })
        .to('.loadingpage', 0.5, {
            bottom: '100%',

            delay: -1
        })
    let hamburger = new TimelineMax({ paused: true })


    hamburger.to('.hamburger span:nth-child(1)', 0.2, {
        y: 6,
        rotation: 45,
        ease: Expo.easeInOut,
    })
    hamburger.to('.hamburger span:nth-child(2)', 0.2, {
        opacity: '0',
        delay: -0.2
    })
    hamburger.to('.hamburger span:nth-child(3)', 0.2, {
        y: -10,
        rotation: -45,
        ease: Expo.easeInOut,
        width: '100%',
        delay: -0.2

    })
    hamburger.to('#menu', 1, {
        bottom: -1,
        ease: Expo.easeInOut,
        delay: -0.5
    })
    hamburger.staggerFromTo('#menu .char', 0.5, {  y: '-100%', opacity: 0 }, { ease: 'Power3.easeIn', y: '0', opacity: 1, delay: -0.7 }, 0.014, 'start')
    hamburger.reverse();

    timeout = null
    document.querySelector('.hamburger').addEventListener('click', () => {
        $('body').toggleClass('overlay')
        
        clearTimeout(timeout)
        if($('body').hasClass('overlay')){
            $('#menu').addClass('active')
        }else{
            timeout = setTimeout(() => {
                $('#menu').removeClass('active')
            },2000)

        }

        hamburger.reversed(!$('body').hasClass('overlay'));

    })
    


    drawSvg(".logo path", { delay: 1, play: true, time: 4 });


    function allImagesLoaded() {

        $('.section-2 .list').each((i, e) => {
            scrollItem(i)
        })

        function logoAnimation() {
            var $word = $(".logo path");
            pathPrepare($word);

            var tween = new TimelineMax().add(TweenMax.to($word, 4, { strokeDashoffset: 0, ease: Linear.easeNone }), 0)
        }

        $(".logo path").on('mouseenter', logoAnimation)

        initDot()

        addHoverCircle('.hamburger')

        setInterval(logoAnimation, 10000)

        


        $('.section-3 a, .section-1 a, .section-2 .name a, #header .logo, #menu a').each((i, e) => {
            hoverMovement(e, 50)
        })


        var $circle = $('.circle-mouse');

        function moveCircle(e) {
            TweenLite.to($circle, 0.1, {
                css: {
                    x: e.clientX + $circle.width() / 2,
                    y: e.clientY + $circle.height() / 2
                }
            });
        }

        if(!isMobile()){
            $(window).on('mousemove', moveCircle);
            
        }else{
            console.log(window.pageYOffset)

            let currentScroll = 0
            $(window).on('scroll', () => {
                if(window.pageYOffset < currentScroll){
                    $('.section-2 .list').addClass('scroll-top')
                }else{
                    $('.section-2 .list').removeClass('scroll-top')
                }
                currentScroll = window.pageYOffset
            })
        }

        $('.logo').on('click', () => {
            $('html').animate({
                scrollTop: 0
            }, 1000, 'swing')
        })

        init();


        setTimeout(() => {
            logo.play();
            setTimeout(() => {
                session1()
            }, 1000)
            setTimeout(() => {
                let iframe = $('.section-1 .right iframe')
                iframe.attr('src', iframe.attr('data-src'))
            }, 2300)
        }, now.getTime() - (new Date()).getTime() + 3050)
    }
})