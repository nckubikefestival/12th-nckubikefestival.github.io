$(document).ready(function(){

    // initialize firebase setting.
    const config = {
        apiKey: "AIzaSyC23x9CwP2TuVmXh90R3Xg55AcfL6h_jII",
        authDomain: "ncku-bikefestival-12th.firebaseapp.com",
        databaseURL: "https://ncku-bikefestival-12th.firebaseio.com",
        projectId: "ncku-bikefestival-12th",
        storageBucket: "ncku-bikefestival-12th.appspot.com",
        messagingSenderId: "309069279460"
    }
    firebase.initializeApp(config)
    const db = firebase.firestore()
    // Disable deprecated features
    db.settings({
        timestampsInSnapshots: true
    })
    // articles fetch
    const articles = {
        exam: [],
        health: [],
        institution: [],
        communication: [],
        future: []
    }
    db.collection("articles").get()
    .then(function (result) {
        for (doc of result.docs) {
            const data = doc.data()
            if (data.Type) {
                articles[data.Type].push(data)
            }
        }
        // order the array by timestamp
        for (iter of Object.keys(articles)) {
            articles[iter].sort((a, b) => a.Timestamp - b.Timestamp)
        }
        // console.log(result.docs[0].data())
        console.log(articles)
    })
    let currentParentTab = ''

  

    // full screen scroll
    const wrap = document.getElementById("wrap");
    const main = document.getElementById("main");
    const hei = document.body.clientHeight;
    wrap.style.height = hei + "px";
    let obj = document.getElementsByTagName("div");
    for(let i = 0; i < obj.length; i++) {
        if(obj[i].className.includes(' page')) {
            obj[i].style.height = hei + "px";
        }
    }
    let startTime = 0
    let endTime = 0
    let now = 0
    if ((navigator.userAgent.toLowerCase().indexOf("firefox") != -1)){   
        document.addEventListener("DOMMouseScroll", scrollFun, false);        
    }  
    else if (document.addEventListener) {  
        document.addEventListener("mousewheel", scrollFun, false);  
    }  
    else if (document.attachEvent) {  
        document.attachEvent("onmousewheel", scrollFun);   
    }  
    else{  
        document.onmousewheel = scrollFun;  
    }  

    function scrollFun(event) {
        startTime = new Date().getTime();
        var delta = event.detail || (-event.wheelDelta);  
        if ((endTime - startTime) < -1000) {
            if(delta > 0 && parseInt(main.offsetTop) > -(hei * 5)) {
                now = now - hei;
                console.log(now)
                toPage(now);
            }
            if(delta < 0 && parseInt(main.offsetTop) < 0) {
                now = now + hei;
                toPage(now);
            }
            endTime = new Date().getTime();  
        }
        else{  
            event.preventDefault();    
        }    
    }

    function toPage(now){        
        $("#main").animate({top:(now+'px')}, 1000);
        console.log(now)
    }

    // Menu Listeners
    /*
    $(".menu.off").find(".menu__wheel--self").click(function(){
        menu ("open");
    })

    $(".menu__burger").click(function(){
        menu ("open");
    })

    $(".menu__close").click(function(){
        menu ("close");
    })
    */

    // main_menu listener

    $("#parent").click(function(){
        $(".menu").removeClass("off");
        $(".parent").removeClass("off").addClass("on");
        $(".parent_page_btn").removeClass("off").addClass("on");
        $(".parent_subpage").removeClass("on").addClass("off");
        $('.subpage_title').css('background', "none no-repeat")
        $("body").addClass("no_scroll");
        $('.parent_page_btn').css('z-index', '505')
        $('#parent_article_list').css('z-index', '500')
    });

    $(".parent__close").click(function(){
        page ("parentClose");
        $(".parent__return").removeClass("on").addClass("off");
        $('#parent_article_title').html('')
        $('#parent_article_content').html('')
        $('#parent_article_time').text('')
        $('#parent_article_list ul').html('')
    })
    $(".parent__return").click(function(){
        $(".parent_page_btn").removeClass("off").addClass("on");
        $(".parent_subpage").removeClass("off").addClass("on");
        $('.parent_page_btn').css('z-index', '505')
        $('#parent_article_list').css('z-index', '500')
        $('.subpage_title').css('background', "none")
        $(".parent__return").removeClass("on").addClass("off");
        $('#parent_article_title').html('')
        $('#parent_article_content').html('')
        $('#parent_article_time').text('')
        $('#parent_article_list ul').html('')
    })

    // parent_page listener

    $("#parent_exam").click(function(){
        $(".parent_page_btn").removeClass("on").addClass("off");
        $(".parent_subpage").removeClass("off").addClass("on");
        $('.parent_page_btn').css('z-index', '500')
        $('#parent_article_list').css('z-index', '505')
        $('.subpage_title').css('background', "url('./img/parent_exam.svg') no-repeat")
        $(".parent__return").removeClass("off").addClass("on");
        currentParentTab = 'exam'
        refreshParentList()
    })

    $("#parent_rule").click(function(){
        $(".parent_page_btn").removeClass("on").addClass("off");
        $(".parent_subpage").removeClass("off").addClass("on");
        $('.parent_page_btn').css('z-index', '500')
        $('#parent_article_list').css('z-index', '505')
        $('.subpage_title').css('background', "url('./img/parent_rule.svg') no-repeat")
        $(".parent__return").removeClass("off").addClass("on");
        currentParentTab = 'institution'
        refreshParentList()
    });

    $("#parent_relationship").click(function(){
        $(".parent_page_btn").removeClass("on").addClass("off");
        $(".parent_subpage").removeClass("off").addClass("on");
        $('.parent_page_btn').css('z-index', '500')
        $('#parent_article_list').css('z-index', '505')
        $('.subpage_title').css('background', "url('./img/parent_relationship.svg') no-repeat")
        $(".parent__return").removeClass("off").addClass("on");
        currentParentTab = 'communication'
        refreshParentList()
    });

    $("#parent_kidHealth").click(function(){
        $(".parent_page_btn").removeClass("on").addClass("off");
        $(".parent_subpage").removeClass("off").addClass("on");
        $('.parent_page_btn').css('z-index', '500')
        $('#parent_article_list').css('z-index', '505')
        $('.subpage_title').css('background', "url('./img/parent_kidHealth.svg') no-repeat")
        $(".parent__return").removeClass("off").addClass("on");
        currentParentTab = 'health'
        refreshParentList()
    });

    $("#parent_trend").click(function(){
        $(".parent_page_btn").removeClass("on").addClass("off");
        $(".parent_subpage").removeClass("off").addClass("on");
        $('.parent_page_btn').css('z-index', '500')
        $('#parent_article_list').css('z-index', '505')
        $('.subpage_title').css('background', "url('./img/parent_trend.svg') no-repeat")
        $(".parent__return").removeClass("off").addClass("on");
        currentParentTab = 'future'
        refreshParentList()
    });


    // Swiper Initialize

    var dept_swiper = new Swiper('#dept__class--list', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        shortSwipes: false,
        longSwipes: false,
        followFinger: false,
        allowTouchMove: false,
        pagination: {
            el: '.swiper-pagination',
            clickable: false,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });

    var event_swiper = new Swiper('#event__class--list', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        shortSwipes: false,
        longSwipes: false,
        followFinger: false,
        allowTouchMove: false,
        pagination: {
            el: '.swiper-pagination',
            clickable: false,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });

    $("#dept__class--list").find(".swiper-button-next, .swiper-button-prev, .swiper-pagination").click(function(){
        updateSlideNo("dept");
    })

    $("#event__class--list").find(".swiper-button-next, .swiper-button-prev, .swiper-pagination").click(function(){
        updateSlideNo("event");        
    })

    function updateSlideNo ( type ) {
        setTimeout (function() {
            var slide_no = $("."+type+"_.swiper-slide-active").data("swiper-slide-index") + 1 ;
            $("."+type+"__description--cont--text."+type+"_"+slide_no).siblings().removeClass("now");
            $("."+type+"__description--cont--text."+type+"_"+slide_no).addClass("now");
            // $("."+type+"__description--cont."+type+"_"+slide_no).siblings().removeClass("now");
            // $("."+type+"__description--cont."+type+"_"+slide_no).addClass("now");
            $("."+type+"__description--title").text( $("."+type+"_.swiper-slide-active").text() );
            if ( slide_no < 10 ) 
                $("."+type+"__description--no").text( "0"+ slide_no );
            else
                $("."+type+"__description--no").text( slide_no );
        }, 10);
    }
    /*  
    // side bar listener
    $(".goto_page").click(function(){  
        var page_no = this.className.replace( "goto_page goto_" ,"" ).replace( "now", "" );        
        $(window).scrollTo( "#page_" + page_no , 300);
        nowPage( page_no );
        if ( $(".menu").hasClass("on") ) {
            menu ("close");
        }
        Waypoint.disableAll()
        setTimeout(function(){ Waypoint.enableAll() }, 300);
    })

    $(".menu__totop").click(function(){
        $(window).scrollTo( "#page_1", 300);        
    })
    // Waypoint Listeners

    var waypoint_p1_top = new Waypoint({
        element: document.getElementById('page_1_top'),
        handler: function(direction) { 
            nowPage(1);
        }, 
        offset: 0
    })

    var waypoint_p2_top = new Waypoint({
        element: document.getElementById('page_2_top'),
        handler: function(direction) { 
            nowPage(2); 
        },
        offset: '20%'
    })

    var waypoint_p2_bottom = new Waypoint({
        element: document.getElementById('page_2_bottom'),
        handler: function(direction) { 
            nowPage(2); 
        },
        offset: '20%'  
    })

    var waypoint_p3_top = new Waypoint({
        element: document.getElementById('page_3_top'),
        handler: function(direction) { 
            nowPage(3); 
        },
        offset: '20%'  
    })

    var waypoint_p3_bottom = new Waypoint({
        element: document.getElementById('page_3_bottom'),
        handler: function(direction) { 
            nowPage(3);
        },
        offset: '20%'  
    })

    var waypoint_p4_top = new Waypoint({
        element: document.getElementById('page_4_top'),
        handler: function(direction) { 
            nowPage(4); 
        },
        offset: '20%'  
    })

    var waypoint_p4_bottom = new Waypoint({
        element: document.getElementById('page_4_bottom'),
        handler: function(direction) { 
            nowPage(4); 
        },
        offset: 'bottom-in-view'        
    })

    var waypoint_p5_top = new Waypoint({
        element: document.getElementById('page_5_top'),
        handler: function(direction) { 
            nowPage(5); 
        },
        offset: '50%'
    })

    
    // Other Listeners

    
    $(".register__wheel--self").click(function(){
        window.open( "https://docs.google.com/forms/d/e/1FAIpQLSffgri9t91F6dgQVp0QRv3iii_ouQy8bMSbCLLCGOcGPZ9dDg/viewform" );
    })

    $(".video").click(function(){
        window.open( "https://www.facebook.com/NCKUbikefestival/videos/1451397264988430/" );
    })


    // Event List (Mobile)

    $(".schedule__cont--list").click(function(){
        if ( $( this ).hasClass("on") ) {
            $( this ).removeClass("on").addClass("off");
        }
        else if ( $( this ).hasClass("off") ) {
            $( this ).removeClass("off").addClass("on");
        }
    })

    // Functions

    function menu ( command ) {
        if ( command == 'open' ) {
            $(".menu").removeClass("off").addClass("on");
            $("body").addClass("no_scroll");
        }
        else if ( command == 'close' ) {
            $(".menu").removeClass("on").addClass("off");
            $("body").removeClass("no_scroll");      
        }
    }

    function page ( command ) {
        if ( command == 'parentClose' ) {
            $(".menu").addClass("off");
            $(".parent").removeClass("on").addClass("off");
            $("body").removeClass("no_scroll");
        }
    }
    
    function nowPage ( num ) {
        $(".goto_"+ num ).siblings().removeClass("now");
        $(".goto_" +num ).addClass("now");
        if ( num == 1 )
            $(".menu__sidebar").fadeOut(500);
        else
            $(".menu__sidebar").fadeIn(500);
        if ( num == 5 )
            $(".intro__scroll").fadeOut(500);            
        else
            $(".intro__scroll").fadeIn(500);
    }
    
     
    function updateSlideNo ( type ) {
        setTimeout (function() {
            var slide_no = $("."+type+"_.swiper-slide-active").data("swiper-slide-index") + 1 ;
            $("."+type+"__description--cont--text."+type+"_"+slide_no).siblings().removeClass("now");
            $("."+type+"__description--cont--text."+type+"_"+slide_no).addClass("now");
            // $("."+type+"__description--cont."+type+"_"+slide_no).siblings().removeClass("now");
            // $("."+type+"__description--cont."+type+"_"+slide_no).addClass("now");
            $("."+type+"__description--title").text( $("."+type+"_.swiper-slide-active").text() );
            if ( slide_no < 10 ) 
                $("."+type+"__description--no").text( "0"+ slide_no );
            else
                $("."+type+"__description--no").text( slide_no );
        }, 10);
    }
    */

   function refreshParentList() {
    if (articles[currentParentTab].length > 0) {
        // display first articles
        $('#parent_article_title').html(articles[currentParentTab][0].Title)
        $('#parent_article_content').html(articles[currentParentTab][0].Content)
        $('#parent_article_time').text(articles[currentParentTab][0].Timestamp.toDate().toDateString())
        // list the title of the articles
        for (let [index, iter] of articles[currentParentTab].entries()) {
            $('#parent_article_list ul').append(`<li data-key=${index}>${iter.Title}</li>`)
        }
    }
    $('#parent_article_list ul li').click(function () {
        let index = this.dataset.key
        $('#parent_article_title').html(articles[currentParentTab][index].Title)
        $('#parent_article_content').html(articles[currentParentTab][index].Content)
        $('#parent_article_time').text(articles[currentParentTab][index].Timestamp.toDate().toDateString())
    })
}

   function page ( command ) {
        if ( command == 'parentClose' ) {
            $(".menu").addClass("off");
            $(".parent").removeClass("on").addClass("off");
            $("body").removeClass("no_scroll");
        }
    }
    
    // activity date
    function getTimes() {
        let startDate = new Date()
        let endDateExam = new Date('2019/1/26 00:00')
        let endDateActivity = new Date('2019/3/2 00:00')
        let spantimeExam = (endDateExam - startDate) / 1000
        let spantimeActivity = (endDateActivity - startDate) / 1000
        const dayExam = Math.floor(spantimeExam / (24 * 3600))
        const dayActivity = Math.floor(spantimeActivity / (24 * 3600))
        if (spantimeExam > 0) {
            $('.intro__num.num1').css('background', "url('./img/number_" + Math.floor(dayExam / 10) +  ".svg')")
            $('.intro__num.num2').css('background', "url('./img/number_" + dayExam % 10 +  ".svg')")
        } else { // 避免倒數變成負的
            $('.intro__num.num1').css('background', url(`./img/number_0.svg`))
            $('.intro__num.num2').css('background', url(`./img/number_0.svg`))
        }
        if (spantimeActivity > 0) {
            $('.menu__activity__num.num1').css('background', "url('./img/number_" + Math.floor(dayActivity / 10) +  ".svg')")
            $('.menu__activity__num.num2').css('background', "url('./img/number_" + dayActivity % 10 +  ".svg')")
        } else { // 避免倒數變成負的
            $('.menu__activity__num.num1').css('background', url(`./img/number_0.svg`))
            $('.menu__activity__num.num2').css('background', url(`./img/number_0.svg`))
        }

    }
    setInterval(getTimes, 0)
});