/* RMIT University Vietnam
  Course: COSC2430 Web Programming
  Semester: 2023A
  Assessment: Assignment 2
  Author: Luong Thanh Trung, Lee Gayeong, Pham Hieu Dat, Le Dang Quang, Nguyen Huynh Trieu Thinh
  ID: Your student ids: S3679813, s3891958, s3979760, s3977794, s3977756
  Acknowledgement: Acknowledgement: the images used here were borrowed from other webpages. Their links could be found in the report */
const showHide = document.querySelector(".hide-show")
const Password = document.getElementById("password")
const username = document.getElementById("username")
const email = document.querySelector('.email input')
const address = document.getElementById("address")
const number = document.getElementById('phone')
const error = document.getElementById('error')
const errorPassword = document.getElementById('errorPassword')
const valid = document.getElementById("valid")
const valid2 = document.getElementById("valid2")
const form = document.querySelector('form')
var state = false
const label = document.querySelectorAll(".label")
const input = document.querySelectorAll(".input")

for (let i=0; i<input.length; i++){
    input[i].addEventListener("click", function(){
        for (let i=0; i<input.length; i++){
            label[i].style.transform = "scale(1,1)"
        }
        label[i].style.transform = "scale(1.2, 1.2)"
    })
}



form.addEventListener('submit', (e)=>{
    let messages = []
    let messages2 = []
    let validMessage = []
    let validMessage2 = []
    

    if (email.value === ''){
        messages.push('Email is required')
    }
    else{
        validMessage.push("Email is valid")
    }
    
    if (username.value.length >= 8 && username.value.length <= 15 && username.value.search(/[a-z]/) >= 0 && username.value.search(/[A-Z]/) >= 0){
        validMessage.push("Username is valid")
    }
    else{
        e.preventDefault()
        messages2.push("Username need 1 uppercase, 1 lowercase and 1 number")
    } 
    if (Password.value.search(/[!@#$%^&*]/)>= 0 && Password.value.search(/[0-9]/) >= 0 && Password.value.search(/[a-z]/) >= 0 && Password.value.search(/[A-Z]/) >= 0 && Password.value.length >=8 && Password.value.length <=20){
        validMessage2.push("Password is valid")
    }
    else{
        e.preventDefault()
        messages.push("Password need 1 uppercase, 1 lowercase, 1 number and 1 special symbol" )
    } 

    if (address.value === ""){
        e.preventDefault()
    }
    else{
        validMessage2.push("Valid Address")
    }

    if (messages.length > 0 ){
        errorPassword.innerHTML = messages.join(' and ')
    }
    if (messages.length > 0 ){
        e.preventDefault()
        error.innerHTML = messages2.join(" and ")
    }  
    if (messages.length > 0 ){
        valid.innerHTML = validMessage.join(" and ")
    }  
    if (messages.length > 0 ){
        valid2.innerHTML = validMessage2.join(" and ")
    }  
})




function checkUsername(){
    let letter2 = document.getElementById("username")
    var lowercaseletters=/[a-z]/g
    if (username.value.match(lowercaseletters)){
      letter2.classList.add('valid')
         } else{
      letter2.classList.add('invalid')
      }
      var upcaseletters=/[A-Z]/g
    if (username.value.match(upcaseletters)){
      letter2.classList.add('invalid')
         }
     if (username.value.length >=8 && username.value.length <=15){
        letter2.classList.add('valid')
        letter2.classList.remove('invalid')
    }else{
        letter2.classList.remove('valid')
        letter2.classList.add('invalid') 
    } 
            
}

function checkPassword(){
    let letter = document.getElementById("password")
    if (Password.value.length >=8 && Password.value.length <=20){
        letter.classList.add('valid')
        letter.classList.remove('invalid')
    }else{
        letter.classList.remove('valid')
        letter.classList.add('invalid') 
    } 
    
}

const action = document.getElementById("action")
        const general_info = document.getElementById("general_info")
        const shipper_specific = document.getElementById("shipper_specific")
        const vendor_specific = document.getElementById("vendor_specific")

        action.addEventListener("change", function(){
        if (action.value === "Customer"){
            shipper_specific.style.display = "none"
            vendor_specific.style.display = "none"
        }
        else if (action.value === "Vendor"){
            vendor_specific.style.display = "block"
            shipper_specific.style.display = "none"
        }
        else {
            shipper_specific.style.display = "block"
            vendor_specific.style.display = "none"
        
    }
}) 





function toggle(){
    if (state){
        Password.setAttribute("type", "password");
        state = false
    }
    else{
        Password.setAttribute("type", "text")
        state = true
    }
}





