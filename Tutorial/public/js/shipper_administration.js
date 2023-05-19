/* RMIT University Vietnam
  Course: COSC2430 Web Programming
  Semester: 2023A
  Assessment: Assignment 2
  Author: Luong Thanh Trung, Lee Gayeong, Pham Hieu Dat, Le Dang Quang, Nguyen Huynh Trieu Thinh
  ID: Your student ids: S3679813, s3891958, s3979760, s3977794, s3977756
  Acknowledgement: Acknowledgement: the images used here were borrowed from other webpages. Their links could be found in the report */
const rows = document.querySelectorAll(".row")
const result_id = document.querySelectorAll(".result_id")
const Order_id = document.getElementById("Order_id")
for (let i=0; i<rows.length; i++){
    result_id[i].addEventListener("click", function(){
        Order_id.value = rows[i].getAttribute("id")
    }
    )}
   
