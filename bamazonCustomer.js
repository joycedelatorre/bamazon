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
  afterConnection(); 
});

function afterConnection() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    //console.log(res);
    for(var i = 0; i <res.length; i++){
      console.log("-----------------------------------------------");
      console.log(res[i].item_id+"|Item: "+res[i].product_name +" |Department: "+res[i].depart_name +" |Price: "+res[i].price + " |QTY: " + res[i].stock_quantity); 
    }
    //connection.end();
    userInput();
  });
}
var order;
var inputId;
function userInput(){

    inquirer.prompt({
      name:"action",
      type:"input",
      message:"Enter the ID of the item you would like to purchase"
    }).then(answers => {
      console.log(answers);
      inputId = answers.action;
      connection.query("SELECT * FROM products WHERE item_id=" + answers.action+";", function(err,res){
        console.log("Item: " + res[0].product_name + "Price " + res[0].price);
        order = res;
        console.log(order[0].stock_quantity);
        inquirer.prompt({
          name:"action",
          type:"confirm",
          message:"Place order?: (y/N)"
        }).then(answers => {
          console.log(answers);
          console.log(order[0].stock_quantity);

          if((answers.action) && (order[0].stock_quantity == 0 || order[0].stock_quantity==null)){
            console.log("We don't have stock of the item you want to buy");
          } else{
            inquirer.prompt({
              name:"action",
              type:"input",
              message:"How many would you like to buy?"
            }).then(answers => {
              //console.log(answers);
              var placeholder = answers.action
              var numOfItems = parseInt(placeholder);
              //console.log(numOfItems);
              //console.log(order[0].stock_quantity);
              var updateStock = order[0].stock_quantity - numOfItems;
              console.log("Quantity in Stock:" + updateStock);
              var total = order[0].price * numOfItems;
              console.log("TOTAL:" + total);

              connection.query("UPDATE products SET stock_quantity="+updateStock+" WHERE item_id="+inputId+";", function(err, res){
                console.log(err);
              });

            });
          }

        });

      });
    });
}
