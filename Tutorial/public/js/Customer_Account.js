/* RMIT University Vietnam
  Course: COSC2430 Web Programming
  Semester: 2023A
  Assessment: Assignment 2
  Author: Luong Thanh Trung, Lee Gayeong, Pham Hieu Dat, Le Dang Quang, Nguyen Huynh Trieu Thinh
  ID: Your student ids: S3679813, s3891958, s3979760, s3977794, s3977756
  Acknowledgement: Acknowledgement: the images used here were borrowed from other webpages. Their links could be found in the report */
const personal_detail = document.querySelector(".personal_detail")
const myOrder = document.querySelector(".myOrder")
const Personal_info = document.getElementById("Personal_info")
const my_Order = document.getElementById("my_Order")
const log_out = document.getElementById("log_out")

log_out.addEventListener("click", function(){
    localStorage.setItem("cart_web_DeVeLopment",'[]')
    localStorage.setItem("cart_image_web_DeVeLopment",'[]')
    localStorage.setItem("number_in_cart_application_web_Development",0)
    })

myOrder.addEventListener("click", function(){
    Personal_info.style.transform = "translateX(-100%)"
    my_Order.style.transform = "translateX(-100%)"
})

personal_detail.addEventListener("click", function(){
    Personal_info.style.transform = "translateX(0)"
    my_Order.style.transform = "translateX(0)"
})