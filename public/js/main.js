window.addEventListener('load', function() {
    // UI Tabs
    if(window.location.href.indexOf("admin") > -1){
        let hash = document.location.hash;
        var tabPane = document.querySelectorAll(".tab-content > .tab-pane");
        var tabNav = document.querySelectorAll(".nav-tabs > li");
        if(hash){
            for (let i = 0; i < tabPane.length; i++){
                if(tabPane[i].getAttribute("id") == hash.slice(1)){
                    tabPane[i].classList.add("active");
                }else{
                    tabPane[i].classList.remove("active");
                }
            }
            for (let i = 0; i < tabNav.length; i++){    
                if(tabNav[i].children[0].hash == hash){
                    tabNav[i].children[0].classList.add("active");
                }else{
                    tabNav[i].children[0].classList.remove("active");
                }
            }
        }

    }else{
        // Scroll to Element
        scrollTo(document.getElementsByClassName("contact-button")[0]);
        scrollTo(document.getElementsByClassName("works-button")[0]);
        document.querySelectorAll(".nav .nav-link").forEach(anchor => { scrollTo(anchor) });
        function scrollTo(fromTo){
            let toEl = fromTo.getAttribute("data-click");
            fromTo.addEventListener("click",function(){
                document.getElementById(toEl).scrollIntoView({ behavior: "smooth" });
            }, false);
        } 

        // Slider
        let slideIndex = 0;
        showSlides(slideIndex);

        function showSlides(index) {
            let slides = document.querySelectorAll("#u-slider > div.static"),
                dots = document.querySelectorAll(".choseproject li"),
                lastItem = document.getElementsByClassName("last")[0],
                firstItem = document.getElementsByClassName("first")[0];

            for (let i = 0; i < slides.length; i++) {
                slides[i].classList.remove("col-md-8", "d-md-block");
                slides[i].classList.add( "col-md-2", "d-none");
                dots[i].children[0].classList.remove("active");
            }
            dots[slideIndex].children[0].classList.add("active"); 
            slides[slideIndex].classList.remove("col-md-2", "d-none");
            slides[slideIndex].classList.add("col-md-8");

            if(slideIndex == slides.length - 1){
                lastItem.classList.add("d-md-block");
                firstItem.classList.remove("d-md-block");
                slides[slideIndex - 1].classList.add("col-md-2", "d-md-block", "d-none");  
            }else if(slideIndex == 0){
                firstItem.classList.add("d-md-block");
                slides[slideIndex + 1].classList.add("col-md-2", "d-md-block", "d-none");
            }else{
                firstItem.classList.remove("d-md-block");
                lastItem.classList.remove("d-md-block");
                slides[slideIndex - 1].classList.add("col-md-2", "d-md-block", "d-none");   
                slides[slideIndex + 1].classList.add("col-md-2", "d-md-block", "d-none");
            } 
        }
        document.querySelectorAll(".choseproject li").forEach((elem) => {
            elem.addEventListener("click", function(){
            let temp = parseInt(this.children[0].innerText);
                showSlides(slideIndex = temp - 1);
            });
        });
    }
});