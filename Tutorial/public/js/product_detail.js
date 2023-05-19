/* RMIT University Vietnam
  Course: COSC2430 Web Programming
  Semester: 2023A
  Assessment: Assignment 2
  Author: Luong Thanh Trung, Lee Gayeong, Pham Hieu Dat, Le Dang Quang, Nguyen Huynh Trieu Thinh
  ID: Your student ids: S3679813, s3891958, s3979760, s3977794, s3977756
  Acknowledgement: Acknowledgement: the images used here were borrowed from other webpages. Their links could be found in the report */
const Pname = document.getElementById("name")
const Pprice = document.getElementById("price")
const vertical_navigation = document.getElementById("vertical_navigation")
const menu_icon = document.getElementById("menu_icon")
const overlay = document.getElementById("overlay")
const Close = document.getElementById("Close")
const search_icon = document.getElementById("search_icon")
const collapsed_content = document.getElementById("collapsed_content")
const collapsed_content_styles = window.getComputedStyle(collapsed_content)
const secondary_image = document.querySelectorAll(".secondary_image")
const main_image = document.getElementById("main_image")
const quantity_selector = document.getElementById("quantity_selector")
const main = document.getElementById("main")
const Order_id = Pname.getAttribute("class")
const inventory =document.getElementById("inventory")
const checkout_buttons = document.querySelectorAll(".addtocart")
const number_in_cart = document.getElementById("number_in_cart")
const addCart = document.getElementById("addCart")
const image_navigation = document.getElementById("image_navigation")

    


if (!(localStorage.getItem("number_in_cart_application_web_Development"))){
    localStorage.setItem("number_in_cart_application_web_Development",0)
    number_in_cart.textContent = localStorage.getItem("number_in_cart_application_web_Development")
}
else{
    number_in_cart.textContent = localStorage.getItem("number_in_cart_application_web_Development")
}

addCart.addEventListener("click", function(){
    let item_number = parseInt(localStorage.getItem("number_in_cart_application_web_Development"))
    item_number = item_number +1
    localStorage.setItem("number_in_cart_application_web_Development", item_number)
    number_in_cart.textContent = localStorage.getItem("number_in_cart_application_web_Development")
})

if (inventory.textContent==='0'){
    for (let i=0; i < checkout_buttons.length; i++ ){
        checkout_buttons[i].disabled = true
        checkout_buttons[i].style.backgroundColor = "grey"
        checkout_buttons[i].style.color = "black"
    }
}

if (main_image.naturalHeight < main_image.naturalWidth){
    main_image.style.width="100%"
    main_image.style.height="auto"
    image_navigation.style.justifyContent="center"

}
else {
    main_image.style.width="auto"
    main_image.style.height="100%"
}




for (let i=0; i<secondary_image.length; i++){
    secondary_image[i].addEventListener("click", function(){
        main_image.setAttribute('src',secondary_image[i].getAttribute('src'))
    if (secondary_image[i].naturalWidth > secondary_image[i].naturalHeight){
        main_image.style.width="100%"
        main_image.style.height="auto"
    } 
    else{
        main_image.style.width="auto"
        main_image.style.height="100%"
    }
    })
    
}



Close.addEventListener("click",function(){
    vertical_navigation.style.display="none"
    overlay.style.display="none"
})

search_icon.addEventListener("click",function(){
    if (collapsed_content_styles.getPropertyValue("display") === 'none'){
        collapsed_content.style.display="block"
    }
    else {
        collapsed_content.style.display="none"
    }
    
})

menu_icon.addEventListener("click",function(){
    vertical_navigation.style.display="block"
    overlay.style.display="block"

    

})


addCart.addEventListener("click", function(){
    var item_info = {
        Item_id: Order_id,
        Item_name: Pname.textContent,
        Item_price: parseInt(Pprice.textContent),
        Quantity: parseInt(quantity_selector.value),
        Total: parseInt(Pprice.textContent) * parseInt(quantity_selector.value)}
    var image_path = {
        path: main.getAttribute("src")
    }



    


    if (!(localStorage.cart_web_DeVeLopment)){
        item= `[${JSON.stringify(item_info)}]`
        localStorage.setItem("cart_web_DeVeLopment", item)
        path_array =`[${JSON.stringify(image_path)}]`
        localStorage.setItem("cart_image_web_DeVeLopment",path_array)
    }
    else{
        item= JSON.parse(localStorage.getItem("cart_web_DeVeLopment"))
        item.push(item_info)
        path_array = JSON.parse(localStorage.getItem("cart_image_web_DeVeLopment"))
        path_array.push(image_path)
        for (let i =0; i< item.length; i++){
            item[i]=JSON.stringify(item[i])
            path_array[i] = JSON.stringify(path_array[i])
    } 
        
        localStorage.setItem("cart_web_DeVeLopment", `[${item}]`);
        localStorage.setItem("cart_image_web_DeVeLopment",`[${path_array}]`)
    }
    
})


   







