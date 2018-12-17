window.config = {
    articles: {
        parent: {
            exam: [],
            health: [],
            institution: [],
            communication: [],
            future: []
        }
    },
    currentParentTab: '',
    currentPage: 0,
    currentDeptTab: '',
    pageHeight: document.body.clientHeight,
    pagePosition: [],
    components: {
        main: null,
        wrap: null,
        menu: null,
        parentPage: null,
    },
    initializeFirebase: function () {
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
        this.db = db  
    },
    initializeSetting: function () {
        this.pagePosition = [0, this.pageHeight, this.pageHeight * 2, this.pageHeight * 3, this.pageHeight * 4, this.pageHeight * 5, this.pageHeight * 5 + 350]
        this.components.wrap = $('#wrap')
        this.components.main = $('#main')
        this.components.menu = $('.menu__main_menu')
        this.components.parentPage = $('#parent')
    },
    initializeFullScroll: function () {
        const totalHeight = config.pageHeight * 5 + 350
        config.components.wrap[0].style.height = config.pageHeight + "px"
        // select all page div and reset height
        let obj = document.getElementsByTagName("div")
        for(let i = 0; i < obj.length; i++) {
            if(obj[i].className.includes(' page')) {
                obj[i].style.height = window.config.pageHeight + "px"
            }
        }
        let startTime = 0
        let endTime = 0
        // config scroll event
        if ((navigator.userAgent.toLowerCase().indexOf("firefox") != -1)){   
            document.addEventListener("DOMMouseScroll", scrollFun, false)
        } 
        else if (document.addEventListener) {  
            document.addEventListener("mousewheel", scrollFun, false)
        }  
        else if (document.attachEvent) {  
            document.attachEvent("onmousewheel", scrollFun)
        }  
        else{  
            document.onmousewheel = scrollFun
        }
        function scrollFun(event) {
            if ($('.parent')[0].className.includes('on')) {
                return
            }
            startTime = new Date().getTime()
            var delta = event.detail || (-event.wheelDelta)
            if ((endTime - startTime) < -1000) {
                if(delta > 0 && parseInt(main.offsetTop) > -totalHeight && config.currentPage < 7) {
                    config.currentPage++
                    config.toPage(-config.pagePosition[config.currentPage])
                }
                if(delta < 0 && parseInt(main.offsetTop) < 0 && config.currentPage > 0) {
                    config.currentPage--
                    config.toPage(-config.pagePosition[config.currentPage])
                }
                endTime = new Date().getTime()
                nowPage(config.currentPage)
            }
            else{  
                event.preventDefault()
                event.stopPropagation()
            }    
        }
        function nowPage ( num ) {
            if ( num == 5 )
                $(".intro__scroll").fadeOut(500);         
            else
                $(".intro__scroll").fadeIn(500);
        }
    },
    initializeMenuAction: function () {
        // global config default easing function
        jQuery.easing.def = 'easeInOutQuart'
        // global click animation config
        function clickEffect (e) {
            const d = document.createElement("div")
            d.className = "clickEffect"
            d.style.top = `${e.clientY - 100}px`
            d.style.left = `${e.clientX - 100}px`
            document.body.appendChild(d)
            d.addEventListener('animationend',function () { 
                d.parentElement.removeChild(d)
            }.bind(this))
        }
        document.addEventListener('click', clickEffect);

        $('.menu__burger').click(function () {
            config.components.menu.fadeIn(200)
            $(this).fadeOut(200)
        })
       
        /* Department page */

        // config department button click event
        $('.dept__college').click(function () {
            const allType = Array.from($('.dept__college'))
            allType.forEach(target => {
                $(target).removeClass('active')
                // $(`.${$(target).data('key')}`).removeClass(`rotate-${$(target).data('key')}-disappear`)
                if ($(`.${$(target).data('key')}`).hasClass(`rotate-${config.currentDeptTab}`)) {
                    $(`.${$(target).data('key')}`).removeClass(`rotate-${config.currentDeptTab}`)
                    $(`.${$(target).data('key')}`).addClass(`rotate-${config.currentDeptTab}-disappear`)
                }
                
            })
            $(this).addClass('active')
            console.log(this)
            config.currentDeptTab = $(this).data('key')
            $(`.${$(this).data('key')}`).addClass(`rotate-${$(this).data('key')}`)
            if ($(`.${$(this).data('key')}`).hasClass(`rotate-${$(this).data('key')}-disappear`)) {
                $(`.${$(this).data('key')}`).removeClass(`rotate-${$(this).data('key')}-disappear`)
            }
            anime({
                targets: '#chain_path > path',
                strokeDashoffset: [anime.setDashoffset, 0],
                easing: 'easeInOutCubic',
                duration: 400
            })
            $('.dept__chain1').animate({
                transform: {
                    rotate: 60
                }
            }, 400, 'linear')
            $('.dept__chain2').animate({
                transform: {
                    rotate: 60
                }
            }, 400, 'linear')
        })


        $("#news").click(function () {
            config.currentPage = 1
            config.toPage(-config.pagePosition[config.currentPage])
        } )
        $("#dep_intro").click(function () {
            config.currentPage = 2
            config.toPage(-config.pagePosition[config.currentPage])
        } )
        $("#abstract").click(function () {
            config.currentPage = 4
            config.toPage(-config.pagePosition[config.currentPage])
        } )
        // parent button click event
        $("#parent").click( function () {
            window.config.components.menu.removeClass("off");
            $(".parent").removeClass("off").addClass("on");
            $(".parent_page_btn").removeClass("off").addClass("on");
            $(".parent_subpage").removeClass("on").addClass("off");
            $('.subpage_title').css('background', "none no-repeat")
            $("body").addClass("no_scroll");
            $('.parent_page_btn').css('z-index', '505')
            $('#parent_article_list').css('z-index', '500')
            // animate on type button
            for (let [index, iter] of (Array.from($('.parent_page_btn input'))).entries()) {
                $(iter).delay(index * 100).animate({
                    opacity: 1,
                    transform: {
                        x: 80
                    }
                }, 200)
            }
        });

        $(".parent__close").click(function(){
            page ("parentClose");
            $(".parent__return").removeClass("on").addClass("off");
            $('#parent_article_list').hide()
            // reset animate property
            // animate on type button
            for (iter of $('.parent_page_btn input')) {
                $(iter).css({ opacity: 0, transform: "translateX(0)" })
            }
            $('#parent_article_button1').hide()
            $('#parent_article_button2').hide()
            $('#parent_article_visit_icon').hide()
            $('#parent_article_content').html('')
            $('#parent_article_list ul').html('')
        })
        $(".parent__return").click(function(){
            $(".parent_page_btn").removeClass("off").addClass("on");
            $(".parent_subpage").removeClass("off").addClass("on");
            $('.parent_page_btn').css('z-index', '505')
            $('#parent_article_list').css('z-index', '500')
            $('#parent_article_list').hide()
            $('.subpage_title').css('background', "none")
            $(".parent__return").removeClass("on").addClass("off");
            $('#parent_article_content').html('')
            $('#parent_article_list ul').html('')
            $('#parent_article_scrollbar').hide()
            $('#parent_article_button1').hide()
            $('#parent_article_button2').hide()
            $('#parent_article_visit_icon').hide()
        })

        // parent_page listener

        $("#parent_exam").click(function(){
            $(".parent_page_btn").removeClass("on").addClass("off");
            $(".parent_subpage").removeClass("off").addClass("on");
            $('.parent_page_btn').css('z-index', '500')
            $('#parent_article_list').css('z-index', '505')
            $('.subpage_title').css('background', "url('./img/parent_exam.svg') no-repeat")
            $(".parent__return").removeClass("off").addClass("on");
            config.currentParentTab = 'exam'
            refreshParentList()
        })

        $("#parent_rule").click(function(){
            $(".parent_page_btn").removeClass("on").addClass("off");
            $(".parent_subpage").removeClass("off").addClass("on");
            $('.parent_page_btn').css('z-index', '500')
            $('#parent_article_list').css('z-index', '505')
            $('.subpage_title').css('background', "url('./img/parent_rule.svg') no-repeat")
            $(".parent__return").removeClass("off").addClass("on");
            config.currentParentTab = 'institution'
            refreshParentList()
        });

        $("#parent_relationship").click(function(){
            $(".parent_page_btn").removeClass("on").addClass("off");
            $(".parent_subpage").removeClass("off").addClass("on");
            $('.parent_page_btn').css('z-index', '500')
            $('#parent_article_list').css('z-index', '505')
            $('.subpage_title').css('background', "url('./img/parent_relationship.svg') no-repeat")
            $(".parent__return").removeClass("off").addClass("on");
            config.currentParentTab = 'communication'
            refreshParentList()
        });

        $("#parent_kidHealth").click(function(){
            $(".parent_page_btn").removeClass("on").addClass("off");
            $(".parent_subpage").removeClass("off").addClass("on");
            $('.parent_page_btn').css('z-index', '500')
            $('#parent_article_list').css('z-index', '505')
            $('.subpage_title').css('background', "url('./img/parent_kidHealth.svg') no-repeat")
            $(".parent__return").removeClass("off").addClass("on");
            config.currentParentTab = 'health'
            refreshParentList()
        });

        $("#parent_trend").click(function(){
            $(".parent_page_btn").removeClass("on").addClass("off");
            $(".parent_subpage").removeClass("off").addClass("on");
            $('.parent_page_btn').css('z-index', '500')
            $('#parent_article_list').css('z-index', '505')
            $('.subpage_title').css('background', "url('./img/parent_trend.svg') no-repeat")
            $(".parent__return").removeClass("off").addClass("on");
            config.currentParentTab = 'future'
            refreshParentList()
        });

        $("#parent_article_button1").click(function(){
            $('#parent_article_list').hide()
            // clean list child
            $('#parent_article_list ul').empty()
            // sort the articles according to timestamp
            config.articles.parent[config.currentParentTab].sort((a, b) => a.Timestamp.seconds - b.Timestamp.seconds)
            console.log(config.articles.parent[config.currentParentTab])
            refreshParentList()
        });
        $("#parent_article_button2").click(function(){
            $('#parent_article_list').hide()
            // clean list child
            $('#parent_article_list ul').empty()
            // sort the articles according to visitor
            config.articles.parent[config.currentParentTab].sort((a, b) => b.Count - a.Count)
            refreshParentList()
        });

        // parent article scrollbar listener
        function scrollbarRefresh () {
            const viewportRatio = $('#parent_article_content').height() / ($('#parent_article_content').prop("scrollHeight"))
            // reset scrollbar thumbs
            $('#parent_article_scrollbar span').css({
                transform: `translateY(0px) skewX(7.5deg)`
            })
            $('#parent_article_content').scrollTop(0)
            if (viewportRatio < 0.9357615262321145) {
                $('#parent_article_scrollbar').show()
                let _prerventEvent = false
                // config scroll event
                $('#parent_article_content').scroll(function () {
                    if (_prerventEvent) {
                        return
                    }
                    const newPercent = Math.min(1, ($('#parent_article_content').scrollTop() / ($('#parent_article_content').prop("scrollHeight") - $('#parent_article_content').height() - 40)))
                    
                    const currentPosition = Math.floor($('#parent_article_content').height() * newPercent * ($('#parent_article_content').height() - 70) / $('#parent_article_content').height())
                    console.log(`scroll: newPercent ${newPercent}`)
                    console.log(`scroll: currentPosition ${currentPosition}`)
                    $('#parent_article_scrollbar span').css({
                        transform: `translateY(${Math.floor(currentPosition)}px) skewX(7.5deg)`
                    })
                })
                // config scrollbar thumbs drag event
                $('#parent_article_scrollbar span').on('mousedown', function (event) {
                    event.preventDefault()
                    event.stopPropagation()
                    _prerventEvent = true
                    const previous_y = event.pageY
                    const percent = ($('#parent_article_content').scrollTop() / ($('#parent_article_content').prop("scrollHeight") - $('#parent_article_content').height() - 40))
                    $(document).on('mousemove.scrollbar', function (event) {
                        const dif = event.pageY - previous_y
                        const newPercent = Math.min(1, Math.max(percent + dif / ($('#parent_article_content').height()), 0))
                        const currentPosition = Math.floor(1 / Math.sin(82.5 / 180 * Math.PI) * $('#parent_article_content').height() * newPercent * ($('#parent_article_content').height() - 70) / $('#parent_article_content').height())
                        console.log(1 / Math.sin(82.5 / 180 * Math.PI))
                        console.log(`scroll with thumbs: newPercent ${newPercent}`)
                        console.log(`scroll with thumbs: currentPosition ${currentPosition}`)

                        $('#parent_article_content').scrollTop(newPercent * ($('#parent_article_content').prop("scrollHeight") - $('#parent_article_content').height()))
                        $('#parent_article_scrollbar span').css({
                            transform: `translateY(${Math.floor(currentPosition)}px) skewX(7.5deg)`
                        })
                        
                    })
                    $(document).on('mouseup', function () {
                        _prerventEvent = false
                        $(document).off('mousemove.scrollbar')
                        $(document).off('mouseup')
                    })
                })
            } else {
                $('#parent_article_scrollbar').hide()
            }
        }
        
        

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


        function page ( command ) {
            if ( command == 'parentClose' ) {
                $(".menu").addClass("off");
                $(".parent").removeClass("on").addClass("off");
                $("body").removeClass("no_scroll");
            }
        }
        function refreshParentList() {
            if (config.articles.parent[config.currentParentTab].length > 0) {
                // display first articles
                $('#parent_article_content').html(config.articles.parent[config.currentParentTab][0].Content)
                $('#parent_article_button1').fadeIn(200)
                $('#parent_article_button2').fadeIn(200)
                $('#parent_article_visit_icon').fadeIn(200)
                scrollbarRefresh()
                // list the title of the articles
                let str = ''
                for (let [index, iter] of config.articles.parent[config.currentParentTab].entries()) {
                    str += `<li data-key=${index}><label>${iter.Title}</label><span>${iter.Count}</span></li>`
                }
                $('#parent_article_list ul').append(str)
                // slide down the list
                $('#parent_article_list').slideDown(1000, function () {
                    
                })
                // config click event to count visit number
                $('#parent_article_list ul').children().each(function(iter, ele) {
                    $(ele).on(`click.visit${iter}`, function () {

                        let index = this.dataset.key
                        // add visit number
                        const targetId = config.articles.parent[config.currentParentTab][index].Id
                        const target = window.config.db.collection('articles').doc(targetId)
                        console.log(window.config.db)
                        target.get().then(result => {
                            const newValue = result.data()
                            newValue.Count = newValue.Count + 1
                            console.log(result)
                            window.config.db.runTransaction(t => {
                                return target.update(newValue)
                            })
                        })
                        $(ele).off(`click.visit${iter}`)
                    })
                })
            }
            $('#parent_article_list ul li').click(function () {
                let index = this.dataset.key
                $('#parent_article_content').html(config.articles.parent[config.currentParentTab][index].Content)
                scrollbarRefresh()
            })
        }
        
    },
    fetchArticles: function () {
        const parentArticlesRef = this.articles.parent
        this.db.collection("articles").get()
        .then(function (result) {
            for (doc of result.docs) {
                const data = doc.data()
                data.Id = doc.id
                if (data.Type) {
                    parentArticlesRef[data.Type].push(data)
                }
            }
            // order the array by timestamp
            for (iter of Object.keys(parentArticlesRef)) {
                parentArticlesRef[iter].sort((a, b) => a.Timestamp.seconds - b.Timestamp.seconds)
            }
            // console.log(result.docs[0].data())
        })
    },
    toPage: function toPage(now){
        console.log(now)
        config.components.menu.fadeOut(200, function () {
            $('.menu__burger').fadeIn(200)
            config.components.main.animate({ top: (now+'px') }, 600, function () {
                /* if (config.currentPage !== 6) {
                    config.components.menu.fadeIn(200, function () {
                
                    })
                }
                */
            })
        })
    }
}


$(document).ready(function() {
    
    $("#logo")[0].style.height = config.pageHeight + "px"
    $("#logo svg").each(function () { $(this)[0].setAttribute('viewBox', '0 0 913 600') });
    // initialize firebase
    config.initializeFirebase()
    // initialize setting
    config.initializeSetting()
    // fetch all articles from firestore
    config.fetchArticles()
    // initialize logo animation
    anime({
        targets: 'svg path, svg circle',
        strokeDashoffset: [anime.setDashoffset, 0],
        easing: 'easeInOutCubic',
        duration: 3000,
        delay: function(el, i) { return 0 },
        begin: function(anim) {
            $('.cls-1').addClass('fill_logo')
            $('.cls-2').addClass('fill_logo')
            $('.cls-3').addClass('fill_logo')
            $('.cls-4').addClass('fill_logo')
        },
        update: function (anim) {
            console.log($("#logo")[0].style.height)
        },
        complete: function(anim) {
            // initialize full screen scroll
            config.initializeFullScroll()
            // initialize menu action
            config.initializeMenuAction()
            $('#logo').delay(500).slideUp(1000, function () {
                this.remove()
            })
        }
    })




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