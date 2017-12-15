var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 8889,
  // Your username
  user: "root",
  // Your password
  password: "root",
  database: "bamazonDB"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  menu();
});

function menu(){
  inquirer.prompt({
    name:"action",
    type:"list",
    message:"What would you like to do?",
    choices:[
      "view product sale",
      "view low inventory",
      "inventory",
      "new product"
    ]
  }).then(answers => {
    switch(answers.action){
      case "view product sale":
        viewProductSale();
        break;
      case "view low inventory":
        viewLowInventory();
        break;
      case "inventory":
        inventory();
        break;
      case "new product":
        newProduct();
        break;
    }
  });

}

function viewProductSale(){
  console.log("view product sale");
  connection.query("SELECT * FROM products WHERE stock_quantity != 0 AND stock_quantity IS NOT NULL", function(err, res){
    for(var i = 0; i < res.length; i++){
      console.log("id: " + res[i].item_id + " || item: " + res[i].product_name +" || Price: " + res[i].price + " || Stock: " + res[i].stock_quantity);   
    }
  });

}

function viewLowInventory(){
  console.log("view low inventory");
  connection.query ("SELECT * FROM products WHERE stock_quantity < 5 OR stock_quantity IS NULL", function(err,res){ // IS NULL --- doesn't work for stock_quantity != null
    for(var i = 0; i < res.length; i++){
      console.log("id: " + res[i].item_id + " || item: " + res[i].product_name + " || Stock: " + res[i].stock_quantity);
    }
  });

}

function inventory(){
  console.log("inventory");

}

function newProduct(){
  console.log("view new product");

}