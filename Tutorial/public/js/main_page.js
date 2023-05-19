/* RMIT University Vietnam
  Course: COSC2430 Web Programming
  Semester: 2023A
  Assessment: Assignment 2
  Author: Luong Thanh Trung, Lee Gayeong, Pham Hieu Dat, Le Dang Quang, Nguyen Huynh Trieu Thinh
  ID: Your student ids: S3679813, s3891958, s3979760, s3977794, s3977756
  Acknowledgement: Acknowledgement: the images used here were borrowed from other webpages. Their links could be found in the report */
const element = document.querySelector(".element")
const button = document.querySelectorAll(".link_container")
const vertical_navigation = document.getElementById("vertical_navigation")
const main_container = document.getElementById("main_container")
const menu_icon = document.getElementById("menu_icon")
const overlay = document.getElementById("overlay")
const filter_icon = document.getElementById("filter_icon")
const Close = document.getElementById("Close")
const search_icon = document.getElementById("search_icon")
const collapsed_content = document.getElementById("collapsed_content")
const collapsed_content_styles = window.getComputedStyle(collapsed_content)
const main_image = document.querySelectorAll("#main_image")
console.log(main_image)
const number_in_cart = document.getElementById("number_in_cart")




for (let i=0; i<main_image.length; i++){
    if (main_image[i].naturalHeight < main_image[i].naturalWidth){
        main_image[i].style.width="100%"
        main_image[i].style.height="auto"
    }
    else {
        main_image[i].style.width="auto"
        main_image[i].style.height="100%"
    }
}



if (!(localStorage.getItem("number_in_cart_application_web_Development"))){
    localStorage.setItem("number_in_cart_application_web_Development",0)
    number_in_cart.textContent = localStorage.getItem("number_in_cart_application_web_Development")
}
else{
    localStorage.setItem("number_in_cart_application_web_Development", JSON.parse(localStorage.getItem("cart_web_DeVeLopment")).length)
    number_in_cart.textContent = localStorage.getItem("number_in_cart_application_web_Development")
}









Close.addEventListener("click",function(){
    vertical_navigation.style.display="none"
    overlay.style.display="none"
})

menu_icon.addEventListener("click",function(){
    vertical_navigation.style.display="block"
    overlay.style.display="block"

    

})

search_icon.addEventListener("click",function(){
    if (collapsed_content_styles.getPropertyValue("display") === 'none'){
        collapsed_content.style.display="block"
    }
    else {
        collapsed_content.style.display="none"
    }
    
})

for (let i = 0; i<button.length; i++){
    button[i].addEventListener("click",function(){
        button[0].style.background="rgb(204, 200, 200)"
        button[1].style.background="rgb(204, 200, 200)"
        button[2].style.background="rgb(204, 200, 200)"
        button[3].style.background="rgb(204, 200, 200)"
        button[i].style.backgroundImage="linear-gradient(108.5deg, rgba(231, 69, 54, 0.82) 11.2%, rgba(255, 181, 17, 0.82) 68%)"
    })
    
} 