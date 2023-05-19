/* RMIT University Vietnam
  Course: COSC2430 Web Programming
  Semester: 2023A
  Assessment: Assignment 2
  Author: Luong Thanh Trung, Lee Gayeong, Pham Hieu Dat, Le Dang Quang, Nguyen Huynh Trieu Thinh
  ID: Your student ids: S3679813, s3891958, s3979760, s3977794, s3977756
  Acknowledgement: Acknowledgement: the images used here were borrowed from other webpages. Their links could be found in the report   */

const express = require("express");
const app = express();
app.set("view engine", "ejs")
app.use(express.static('public'))
const mongoose = require('mongoose');
const multer = require('multer');
const session = require('express-session')
var bodyParser = require('body-parser')
const bcrypt = require("bcrypt")
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/photo/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage }); 

app.use(express.urlencoded({ extended: true }));
app.use('/photo', express.static('public/photo')); 

app.listen(3500, function (err) {
    if (err) console.log(err);
    console.log("Server listening on PORT 3500");
});




const { response, request } = require("express");



app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())
app.use(session({
    secret: "this is a secret",
    saveUninitialized: false

}))





mongoose.connect("mongodb+srv://trungluong0806:Lacussaber080699@cluster0.w8zcmxn.mongodb.net/?retryWrites=true&w=majority")
.then(() =>{
    console.log("Connection Established")
})
.catch((error)=>{
    console.log(error.message)
})



const productsSchema = new mongoose.Schema({
    productName: String,
    productPrice: Number,
    imagePath: String,
    image1Path: String,
    image2Path: String,
    image3Path: String,
    productDescription: String,
    productBrand: String,
    productLocation: String,
    productCFO: String,
    Inventory: Number,
    vendorId: String
}) 

const orderSchema = new mongoose.Schema({
    recipientName: String,
    recipientAddress: String,
    recipientPhone: String,
    Date_Created: Date,
    city: String,
    totalPrice: Number,
    Delivery_man_id: String,
    Date_Delivered: Date,
    Customer_id: String,
    orderStatus: {type: String, default: "Active"}
    

})

const orderDetailSchema = new mongoose.Schema({
    productName: String,
    productQuantity: Number,
    Order_id: String
    
    
})
const Product_info = mongoose.model("Product_info", productsSchema);
const Order = mongoose.model("Order", orderSchema);
const Order_info = mongoose.model("Order_info", orderDetailSchema)



const userSchema = new mongoose.Schema({
    Full_name: String,
    username: {
        type: String,
        unique: true
    },
    address: String,
    Phone_Number: Number,
    email: String ,
    password: String,
    profileImagePath: String
})
const shipperSchema = new mongoose.Schema({
    Full_name: String,
    email: String,
    username: {
        type: String,
        unique: true
    },
    address: String,
    Phone_Number: Number,
    password: String,
    Role: {
        type: String,
        default: "Shipper"
    },
    Hub: String,
    profileImagePath: String
})
const vendorSchema = new mongoose.Schema({
    Full_name: String,
    email: String,
    username: {
        type: String,
        unique: true
    },
    address: String,
    national_id: Number,
    Phone_Number: Number,
    Business_name: String, 
    baddress: String, 
    password: String,
    profileImagePath: String
})

const User = mongoose.model('User', userSchema)
const Vendor = mongoose.model('Vendor', vendorSchema)
const Shipper = mongoose.model('Shipper', shipperSchema)









app.get('/register', (req, res) =>{
    res.render('register.ejs')
})

app.get('/', (req, res) =>{
    req.session.destroy()
     res.render('login.ejs')
 }) 
app.get("/register_error", (request, response) =>{
    response.render("register_error.ejs", {error: "Username already exists"})
    
})



app.post('/register', upload.single("image"), async(request, response) =>{
    const public = "public"
    const salt = await bcrypt.genSalt()
    imgPath=request.file.filename
    const register_info = request.body
    const hashedPassword = await bcrypt.hash(register_info.password, salt)
    if (register_info.action === "Customer"){
        imgPath = imgPath.replace(public,"")
        const user = new User({
            username: register_info.username,
            address: register_info.address,
            email: register_info.email,
            Phone_number : register_info.phone,
            password: hashedPassword,
            profileImagePath: imgPath.replace(public, "")
        }) 
        user.save()
        .then(() => response.redirect("/"))
        .catch((error) => {
            
            response.redirect("/register_error")

        })
        
    }
    else if (register_info.action === "Shipper"){
        imgPath = imgPath.replace(public,"")
        Shipper.create({Full_name: register_info.Full_name, email: register_info.email, username: register_info.username, address: register_info.address, Phone_Number: register_info.phone, password: hashedPassword, Hub: register_info.hub, profileImagePath: imgPath })
        .then(() =>{response.redirect("/")})
        .catch((error)=>{
            response.redirect("/register_error")
        })
        
    }
    
    else {
        imgPath = imgPath.replace(public,"")
        Vendor.create({Full_name: register_info.Full_name, email: register_info.email, username: register_info.username, address: register_info.address, Phone_Number: register_info.phone, password: hashedPassword, Business_name: register_info.business, baddress: register_info.baddress, national_id: register_info.National_id, profileImagePath: imgPath})
        .then(() => {response.redirect("/")})
        .catch(
            (error)=>{
                response.redirect("/register_error")
            }
        )
        
    } 
    

})
/* Vendor Pages Start */

app.get("/add", async(request,response)=>{
    if(request.session.authorized){
        const check = await Vendor.findOne({_id: request.session.user._id})
        console.log(check)
        if (check){
            response.render("add.ejs")
        }

        else{
            response.redirect("/")
        }

        
    }
    else {
        response.redirect("/")
    }
   
})

app.post("/myVendorAccount", upload.single("image"), async (request, response) =>{
    try{
        const update_body = request.body
        const filter = {username: update_body.username}
        if (request.file){
            const profileimgPath = request.file.filename
            const update = {Full_name: update_body.fullname, address: update_body.address, email: update_body.email, Phone_Number: update_body.phone, national_id: update_body.national_id, Business_name: update_body.business_name, baddress: update_body.business_address, profileImagePath: profileimgPath }
            const doc = await Vendor.findOneAndUpdate(filter,update)
            
        }
        else {
            const update = {Full_name: update_body.fullname, address: update_body.address, email: update_body.email, Phone_Number: update_body.phone, national_id: update_body.national_id, Business_name: update_body.business_name, baddress: update_body.business_address}
            const doc = await Vendor.findOneAndUpdate(filter,update)
            
        }
        response.redirect("/myVendorAccount")
        
        
    }
    catch(err){
        console.log(err)
        response.status(404).send("An Error Occurred")
    }
})


app.get("/myVendorAccount", async (request, response)=>{
    
    if (request.session.authorized){
        const check = await Vendor.findOne({_id: request.session.user._id})
        if (check){
            await Vendor.findOne({_id: request.session.user._id}).then((vendor)=>{
            response.render("Vendor_Account.ejs", {info: vendor})
        })
        }
        else{
            response.render("login.ejs")  
        }
        
        
    }
    else{
        response.render("login.ejs")
    }
})




app.get("/viewmyproduct", async (request, response) =>{
    if (request.session.authorized){
        const check = await Vendor.findOne({_id: request.session.user._id})
        if (check){
            const docs = await Product_info.find({vendorId: request.session.user._id});
            response.render('viewmyproduct.ejs', { products: docs });
        }
        else{
            response.redirect("/")  
        }

        
    }
    else{
        response.redirect("/")
    }
   
})


app.post("/viewmyproduct", upload.array('image',4), async (request, response)=>{
    try{
        
        const update_body = request.body
        const filter = {_id: update_body.product_id}
        if (update_body.action === "update"){
            const update ={_id: update_body.product_id, productName: update_body.product_name, vendorId: update_body.Vendor_id, productPrice: update_body.product_price, productBrand: update_body.product_brand, productLocation: update_body.product_location, productCFO: update_body.CFO, Inventory: update_body.inventory, productDescription: update_body.product_description}
            const doc = await Product_info.findOneAndUpdate(filter, update, {new: true})
        }
        else if (update_body.action === "delete") {
            const rem= await Product_info.findOneAndRemove(filter)
        }
        else {
            let imageArray = request.files
            console.log(imageArray)
            const public_string = 'public'
            let imagePath = imageArray[0].path
            imagePath = imagePath.replace(public_string, "")
            let image1Path = imageArray[1].path
            image1Path = image1Path.replace(public_string, "")
            let image2Path = imageArray[2].path
            image2Path = image2Path.replace(public_string, "")
            let image3Path = imageArray[0].path
            image3Path = image3Path.replace(public_string, "")
            Product_info.create({productName: update_body.product_name, productPrice: update_body.product_price, productBrand: update_body.product_brand, productLocation: update_body.product_location, productCFO: update_body.CFO, Inventory: update_body.inventory, productDescription: update_body.product_description, imagePath: imagePath, image1Path: image1Path, image2Path: image2Path, image3Path: image3Path, vendorId: request.session.user._id})
    }

    response.redirect("/viewmyproduct")
    }

    catch(err){
        console.log(err)
        response.status(404).send("An Error Occured")
    }
    
  })
/* 
  Vendor page ends */








/* Shipper Page Start */
app.post("/myShipperAccount", upload.single("image"), async (request, response) =>{
    try{
        const update_body = request.body
        const filter = {username: update_body.username}
        if (request.file){
            const profileimgPath = request.file.filename
            const update = {Full_name: update_body.fullname, address: update_body.address, email: update_body.email, Phone_Number: update_body.phone, profileImagePath: profileimgPath }
            const doc = await Shipper.findOneAndUpdate(filter,update)
        }
        else { 
            const update = {Full_name: update_body.fullname, address: update_body.address, email: update_body.email, Phone_Number: update_body.phone}
            const doc = await Shipper.findOneAndUpdate(filter,update)
            
            
            
            
        } 
        response.redirect("/myShipperAccount")
    }

    catch(err){
        console.log(err)
        response.status(404).send("An Error Occurred")
}})

app.get("/myShipperAccount", async (request, response)=>{
    
    if (request.session.authorized){
        const check = await Shipper.findOne({_id: request.session.user._id})
        if (check){
                await Shipper.findOne({_id: request.session.user._id}).then((shipper)=>{
                response.render("Shipper_Account.ejs", {info: shipper})
            })
        }
        else{
            response.redirect("/")
        }
       
        
    }
    else{
        response.redirect("/")
    }
})





app.get("/shipping_management", async (request,response)=>{
    if (request.session.authorized){
        const check = await Shipper.findOne({_id: request.session.user._id})
        console.log(check)
        if (check){
            if (check.Role === "Admin"){
                console.log("true")
                const Orders = await Order.find({city: request.session.user.Hub, orderStatus: "Active"})
                const Shippers = await Shipper.find({Role: "Shipper", Hub: request.session.user.Hub})
                response.render("Shipper_administration.ejs", {result: Orders, Shippers: Shippers})
                
            }
            else {
                Order.find({Delivery_man_id: request.session.user._id, orderStatus: "Assigned"}).then((Orders)=>{
                    response.render("shipper.ejs", {result: Orders})  
                })
            }
        }
        else{
            response.redirect("/")
        }
        
    }
    else{response.redirect("/")}
    
})

app.post("/Order_detail", async (request, response)=>{
                                    
    try{
        const update_request = request.body
        const filter = {_id: update_request.Order_id}
        const update = {orderStatus: update_request.status}
        const doc = await Order.findOneAndUpdate(filter,update, {new: true})
        response.redirect("/shipping_management")
    }
        
    catch{
        response.status(404).send("An Error Occurred")
    }

       
        })  
app.post("/AdminDelivery", async (request, response)=>{
     try{
        const request_body = request.body
        const filter= {_id: request_body.Order_id}
        const update = {Delivery_man_id: request_body.Shipper_id, orderStatus: "Assigned"}
        const doc = await Order.findOneAndUpdate(filter,update, {new: true})
        response.redirect("/shipping_management")
        }

    catch{
        response.status(404).send("An Error Occurred")
        }
    })

    app.get("/Order_detail/:id", async (request, response)=>{
        Order.findOne({_id: request.params.id}).then((Orders)=>{
            Order_info.find({Order_id: request.params.id }).then(async (details)=>{
                if (request.session.authorized){
                    const check = await Shipper.findOne({_id: request.session.user._id})
                    if (check){
                        response.render("Order_detail.ejs", {Orders: Orders, details: details})
                    }
                    else{
                        response.redirect("/")
                    }
                    
                }
                else{
                    response.redirect("/")
                }
                
            })
        }
        )
        
    })

       

/* Shipper Page End */

/* Customer Page Starts  */

app.post("/myCustomerAccount", upload.single("image"), async (request, response) =>{
    try{
        const update_body = request.body
        const filter = {username: update_body.username}
        if (request.file){
            const profileimgPath = request.file.filename
            const update = {Full_name: update_body.fullname, address: update_body.address, email: update_body.email, Phone_Number: update_body.phone, profileImagePath: profileimgPath }
            const doc = await User.findOneAndUpdate(filter,update)

        }
        else {
            const update = {Full_name: update_body.fullname, address: update_body.address, email: update_body.email, Phone_Number: update_body.phone}
            const doc = await User.findOneAndUpdate(filter,update)
            console.log(doc)
            
        }
        response.redirect("/myCustomerAccount")
    }
    catch(err){
        console.log(err)

    }
})
app.get("/myCustomerAccount", async (request, response)=>{
    
    try{
        if (request.session.authorized){
            const check = await User.findOne({_id: request.session.user._id})
            if (check){
                const Users = await User.findOne({_id: request.session.user._id})
                const Orders = await Order.find({Customer_id: request.session.user._id})
                console.log(Users)
                response.render("Customer_Account.ejs", {Users: Users, Orders: Orders})  
            }
            else{
                response.redirect("/")
            }
               
            
    }
    else {
        response.redirect("/")
    }
    }

    catch(err){
        console.log(err)
    }
        


})




app.get(`/shoppingCart`, async (request, response) => {
    if (request.session.authorized){
        const check = await User.findOne({_id: request.session.user._id})
            if (check){
                response.render("shoppingCart.ejs")
            }
            else{
                response.redirect("/")
            }
        
    }
    else{
        response.redirect("/")
    }
    })
app.post(`/shoppingCart`,async (request, response)=>{
    try{
        var create_at = new Date()
        let reqbody = request.body
        let o_length = Object.values(reqbody).length
        let Total_amount =0
        for (let i=5; i < o_length; i++){
            let allValues = JSON.parse(Object.values(reqbody)[i])
            Total_amount = Total_amount + parseInt(allValues.Total)
            const filter = {_id: allValues.Item_id}
            const product_inventory = Product_info.findOne(filter).then(async (product)=>{
                let Stock_inventory = product.Inventory
                const update = {Inventory: Stock_inventory - allValues.Quantity}
                const doc = await Product_info.findOneAndUpdate(filter, update, {new: true})
                })
                Product_info.findOne(filter).then( async(product) =>{
                    let Stock_inventory = product.Inventory
                    const update = {Inventory: Stock_inventory - allValues.Quantity}
                    const doc = await Product_info.findOneAndUpdate(filter, update, {new: true})
                })
               
              
        
            }
            
        
        await Order.create({
            recipientName: reqbody.Recipient_Name,
            recipientAddress: reqbody.Recipient_Address,
            recipientPhone: reqbody.Recipient_phone_number,
            totalPrice: Total_amount,
            city: reqbody.City,
            Customer_id: request.session.user._id,
            Date_Created: create_at

            })
        Order.find().sort({Date_Created: -1}).limit(1).then((Orders) => {    
            console.log(Orders[0]._id)
            var latest_order_id = Orders[0]._id;
            for (let i=5; i < o_length; i++){
                let allValues = JSON.parse(Object.values(reqbody)[i])
                Order_info.create({productName: allValues.Item_name, productQuantity: allValues.Quantity, Order_id: latest_order_id})}}) 
        response.redirect(`/main_page`)
    }
    catch{
        response.status(404).send("An Error Occurred")
    }
   
        
           
            }
)


app.post("/",(request,response)=>{
    const incorrect_username = 'Incorrect Username. Please enter again'
    const Incorrect_password = 'Incorrect Password. Please enter again'
    const input_info = request.body
    if (input_info.action === "Vendor"){
        Vendor.findOne({username: input_info.username}).then(async (check) =>{
            if (check) {
                if (await bcrypt.compare(input_info.password, check.password)){
                    request.session.user = check;
                    request.session.authorized = true;
                    response.render("Vendor_Account.ejs", {info: check})
                }

                else{
                    
                    response.render("log_in_error.ejs", {error: Incorrect_password})
                        
                    
                }
            }
            else {
                
                response.render("log_in_error.ejs", {error: incorrect_username})
                    
                
            }
            
            
            
            })}
        
        else if (input_info.action === "Shipper") {
            Shipper.findOne({username: input_info.username}).then(async (check) =>{

                if (check) {
                    if (await bcrypt.compare(input_info.password, check.password)){
                        console.log(true)
                        request.session.user = check;
                        request.session.authorized = true;
                        response.render("Shipper_Account.ejs", {info: check})
                    }

                    else{
                        
                        response.render("log_in_error.ejs", {error: Incorrect_password})
                            
                        
                    }
                }
                else{
                    
                    response.render("log_in_error.ejs", {error: incorrect_username})
                        
                    
                }
                })
            }
                
                
        

        else{
            User.findOne({username: input_info.username}).then(async (check) =>{
                if (check) {
                    
                    if (await bcrypt.compare(input_info.password, check.password)){
                        request.session.user = check;
                        request.session.authorized = true;
                        Order.find({Customer_id: check._id}).then((Order)=>{
                            for (let i=0; i<Order.length; i++){
                                order_code = Order[i].Customer_id;
                                order_code = order_code.substring(0,4)
                                Order[i].Customer_id = order_code
                            }
                        response.render("Customer_Account.ejs", {Users: check , Orders: Order}) 
                        })
                    }
    
                    else{
                      
                        response.render("log_in_error.ejs", {error: Incorrect_password})
                           
                    
                    }
                }
                else{
                
                    response.render("log_in_error.ejs", {error: incorrect_username})
                        
                
                }
                })
            }
        })





            app.get(`/main_page`, (request, response)=>{
                Product_info.find().then(async (product_infos)=>{
                    query_result = product_infos;
                    
                    var location = [];
                    var brand = [];
                    var CFO = [];
                    var UniqueLocation=[];
                    var UniqueBrand=[];
                    var UniqueCFO = [];
                    for (let i=0; i < query_result.length; i++){
                        location.push(query_result[i].productLocation);
                        brand.push(query_result[i].productBrand);
                        CFO.push(query_result[i].productCFO)};
                
                    for (let i =0; i< location.length; i++){
                        if (!(UniqueLocation.includes(location[i]))) {
                            UniqueLocation.push(location[i]);
                        }
                        if (!(UniqueBrand.includes(brand[i]))) {
                            UniqueBrand.push(brand[i])
                        }
                
                        if (!(UniqueCFO.includes(CFO[i]))) {
                            UniqueCFO.push(CFO[i])
                        }
                
                    }
                    
                    if (request.session.authorized){
                        const check = await User.findOne({_id: request.session.user._id})
                        if (check){
                            response.render("main_page_logged_in.ejs", {result: query_result, result_loc: UniqueLocation, result_brand: UniqueBrand, result_CFO: UniqueCFO})
                        }
                        else{
                            response.render("lazada_customer_main_page.ejs", {result: query_result, result_loc: UniqueLocation, result_brand: UniqueBrand, result_CFO: UniqueCFO})
                        }
                        
                    }
                    else {
                        response.render("lazada_customer_main_page.ejs", {result: query_result, result_loc: UniqueLocation, result_brand: UniqueBrand, result_CFO: UniqueCFO})
                    }
                    
                })})

                app.get("/search", async (request, response)=>{
                    const query_result = await Product_info.find()
                    var name = request.query.search_bar;
                    var regEx = new RegExp(`${name}`);
                    var data = query_result.filter(function(item){
                        return (regEx.test(item.productName) || regEx.test(item.productDescription))
                    });
                    var location = [];
                    var brand = [];
                    var CFO = [];
                    var UniqueLocation=[];
                    var UniqueBrand=[];
                    var UniqueCFO = [];
                    for (let i=0; i < data.length; i++){
                        location.push(data[i].productLocation);
                        brand.push(data[i].productBrand);
                        CFO.push(data[i].productCFO)};
                
                    for (let i =0; i< location.length; i++){
                        if (!(UniqueLocation.includes(location[i]))) {
                            UniqueLocation.push(location[i]);
                        }
                        if (!(UniqueBrand.includes(brand[i]))) {
                            UniqueBrand.push(brand[i])
                        }
                
                        if (!(UniqueCFO.includes(CFO[i]))) {
                            UniqueCFO.push(CFO[i])
                        }
                
                    }
                    if (request.session.authorized){
                        const check = await User.findOne({_id: request.session.user._id})
                        if (check){
                            response.render("main_page_logged_in.ejs", {result: data, result_loc: UniqueLocation, result_brand: UniqueBrand, result_CFO: UniqueCFO})
                        }
                        else{
                            response.render("lazada_customer_main_page.ejs", {result: data, result_loc: UniqueLocation, result_brand: UniqueBrand, result_CFO: UniqueCFO})
                        }
                        
                    }
                    else{
                        response.render("lazada_customer_main_page.ejs", {result: data, result_loc: UniqueLocation, result_brand: UniqueBrand, result_CFO: UniqueCFO})
                    }
                    
        
                })
        





app.get("/filter", async (request, response)=>{
    query_result = await Product_info.find()
    console.log(query_result)
    var max_price = parseInt(request.query.max_price)
    var min_price = parseInt(request.query.min_price)
    var brands = request.query.product_brand
    var locations = request.query.product_location
    var CFOs = request.query.product_CFO
    var  items_after_max_price = query_result.filter((item) =>{return (max_price ===0 || item.productPrice <= max_price)})
    var item_after_min_price = items_after_max_price.filter((item) =>{
    return parseInt(item.productPrice) >= min_price
})
    var brand_item = item_after_min_price.filter((item)=>{
        var typecheck = typeof brands;
        if (typecheck==="string"){
            return item.productBrand === brands}
        else if (typecheck ==="object" || typecheck ==="array") {
            if (brands.includes(item.productBrand)){
                return true}
            else{
                return false
                            }
                        }
        else {
            return true
                        }
                    }) 
                    
    var location_item = brand_item.filter((item)=>{
        var typecheck = typeof locations;
        if (typecheck==="string"){
            return item.productLocation === locations
        }
        else if (typecheck ==="object" || typecheck ==="array") {
            if (locations.includes(item.productLocation)){
                return true
                            }
            else{
                return false}}
        else{
            return true}})   
            
    var data = location_item.filter((item)=>{
        var typecheck = typeof CFOs;
        if (typecheck==="string"){
            return item.productCFO === CFOs}
        else if (typecheck ==="object" || typecheck ==="array") {
            if (CFOs.includes(item.productCFO)){
                return true}
            else{
                return false}}
        else{
            return true}})   
            
    var location = [];
    var brand = [];
    var CFO = [];
    var UniqueLocation=[];
    var UniqueBrand=[];
    var UniqueCFO = [];
    for (let i=0; i < data.length; i++){
        location.push(data[i].productLocation);
        brand.push(data[i].productBrand);
        CFO.push(data[i].productCFO)};
                
        for (let i =0; i< location.length; i++){
            if (!(UniqueLocation.includes(location[i]))) {
                UniqueLocation.push(location[i]);
                            }
            if (!(UniqueBrand.includes(brand[i]))) {
                UniqueBrand.push(brand[i])
                            }
                    
            if (!(UniqueCFO.includes(CFO[i]))) {
                UniqueCFO.push(CFO[i])
                            }
            
                    
                        }
                    
            
                    
    if (request.session.authorized){
        const check = await User.findOne({_id: request.session.user._id})
        if (check){
            response.render("main_page_logged_in.ejs", {result: data, result_loc: UniqueLocation, result_brand: UniqueBrand, result_CFO: UniqueCFO})}
        else{
            response.render("lazada_customer_main_page.ejs", {result: data, result_loc: UniqueLocation, result_brand: UniqueBrand, result_CFO: UniqueCFO})}}
    else{
        response.render("lazada_customer_main_page.ejs", {result: data, result_loc: UniqueLocation, result_brand: UniqueBrand, result_CFO: UniqueCFO})}})




app.get("/:id", async (request,response)=>{
    const query_result = await Product_info.findOne({_id: request.params.id})
    if (request.session.authorized){
    const check = await User.findOne({_id: request.session.user._id})
        if (check){                        
            response.render("product_detail_logged_in.ejs", {result: query_result})}
        else{
            response.render("product_detail_new.ejs",{result: query_result})
                            }
                        }
    else{
        response.render("product_detail_new.ejs",{result: query_result})
                        }
                        
                        
                    })

            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            app.get("/aboutus", async (request,response)=>{
                const check = await User.findOne({_id: request.session.user._id})
                    if (check){
                        if (request.session.authorized){
                            response.render("aboutUs.ejs")
                        }
                        else {
                            response.render("aboutUslogin.ejs")
                        }
                    }
                    else{
                        response.render("aboutUslogin.ejs")
                    }
                
                
            })

        










        
                    
                    
                    
                  
                       
                    




