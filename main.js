var PRODUCT_TYPES = {};
PRODUCT_TYPES.BURGER = "burger";
PRODUCT_TYPES.SALAD = "salad";
PRODUCT_TYPES.DRINK = "drink";

var BURGER_TYPES = {};
BURGER_TYPES.SMALL = "small";
BURGER_TYPES.LARGE = "large";

var BURGER_STUFFING = {};
BURGER_STUFFING.CHEESE = "cheese";
BURGER_STUFFING.SALAD = "salad";
BURGER_STUFFING.POTATO = "potato";

var SALAD_TYPES = {};
SALAD_TYPES.CAESAR = "caesar";

SALAD_TYPES.OLIVIER = "olivier";
var DRINK_TYPES = {};
DRINK_TYPES.COLA = "cola";
DRINK_TYPES.COFFEE = "coffee";

var DRINK_SIZES = {};
DRINK_SIZES.SMALL = "small";
DRINK_SIZES.LARGE = "large";

// It's only for readability. Also it allows me to practice in inheritance in JS
var BaseCharacteristicsFactory = {
  getCharacteristic: function(type) {
    return this.characteristics[type];
  }
};

// This class contains characteristics of all burger's
var DefaultBurgerTypeCharacteristicsFactory = Object.create(
  BaseCharacteristicsFactory
);

// I don't know how to enumerate object's member's keys and I found only this way
DefaultBurgerTypeCharacteristicsFactory.characteristics = {};
DefaultBurgerTypeCharacteristicsFactory.characteristics[BURGER_TYPES.SMALL] = {
  name: "small burger",
  price: 50,
  calories: 20
};
DefaultBurgerTypeCharacteristicsFactory.characteristics[BURGER_TYPES.LARGE] = {
  name: "large burger",
  price: 100,
  calories: 40
};

var DefaultBurgerStuffingCharacteristicsFactory = Object.create(
  BaseCharacteristicsFactory
);
DefaultBurgerStuffingCharacteristicsFactory.characteristics = {};
DefaultBurgerStuffingCharacteristicsFactory.characteristics[
  BURGER_STUFFING.CHEESE
] = { name: "cheese", price: 10, calories: 20 };
DefaultBurgerStuffingCharacteristicsFactory.characteristics[
  BURGER_STUFFING.SALAD
] = { name: "salad", price: 20, calories: 5 };
DefaultBurgerStuffingCharacteristicsFactory.characteristics[
  BURGER_STUFFING.POTATO
] = { name: "potato", price: 15, calories: 10 };

var DefaultSaladTypeCharacteristicsFactory = Object.create(
  BaseCharacteristicsFactory
);
DefaultSaladTypeCharacteristicsFactory.characteristics = {};
DefaultSaladTypeCharacteristicsFactory.characteristics[SALAD_TYPES.CAESAR] = {
  name: "salad caesar",
  price: 100,
  calories: 20
};
DefaultSaladTypeCharacteristicsFactory.characteristics[SALAD_TYPES.OLIVIER] = {
  name: "salad olivier",
  price: 50,
  calories: 80
};
var DefaultDrinkTypeCharacteristicsFactory = Object.create(
  BaseCharacteristicsFactory
);
DefaultDrinkTypeCharacteristicsFactory.characteristics = {};
DefaultDrinkTypeCharacteristicsFactory.characteristics[DRINK_TYPES.COLA] = {
  name: "cola",
  price: 50,
  calories: 40
};
DefaultDrinkTypeCharacteristicsFactory.characteristics[DRINK_TYPES.COFFEE] = {
  name: "coffee",
  price: 80,
  calories: 20
};
var DefaultDrinkSizeCharacteristicsFactory = Object.create(
  BaseCharacteristicsFactory
);
DefaultDrinkSizeCharacteristicsFactory.characteristics = {};
DefaultDrinkSizeCharacteristicsFactory.characteristics[DRINK_SIZES.SMALL] = {
  name: "small",
  price: 0,
  calories: 0
};
DefaultDrinkSizeCharacteristicsFactory.characteristics[DRINK_SIZES.LARGE] = {
  name: "large",
  price: 20,
  calories: 20
};

function BaseProduct() {
  this.name = "";
  this.price = 0;
  this.calories = 0;
  this.updateCharacteristics.apply(this, arguments);
  this.updateName.apply(this, arguments);
}
BaseProduct.prototype.getPrice = function() {
  return this.price;
};
BaseProduct.prototype.getCalories = function() {
  return this.calories;
};
BaseProduct.prototype.getName = function() {
  return this.name;
};
BaseProduct.prototype.updateCharacteristics = function() {
  this.price = 0;
  this.calories = 0;
  for (var i in arguments) {
    this.price += arguments[i].price;
    this.calories += arguments[i].calories;
  }
};

BaseProduct.prototype.updateName = function() {
  this.name = arguments[0].name;
};

// HAMBURGER
function Hamburger(type, stuffing) {
  BaseProduct.apply(this, arguments);
}
Hamburger.prototype = Object.create(BaseProduct.prototype);
Hamburger.prototype.updateName = function(type, stuffing) {
  this.name = type.name + " with " + stuffing.name;
};

// SALAD
function Salad(type, weight) {
  BaseProduct.apply(this, arguments);
}
Salad.prototype = Object.create(BaseProduct.prototype);
Salad.prototype.updateCharacteristics = function(type, weight) {
  this.price = (type.price * weight) / 100;
  this.calories = (type.calories * weight) / 100;
};

// DRINK
function Drink(type, size) {
  BaseProduct.apply(this, arguments);
}
Drink.prototype = Object.create(BaseProduct.prototype);
Drink.prototype.updateName = function(type, size) {
  this.name = size.name + " " + type.name;
};

// MENU
function Menu() {
  productBuildInstructions = {};
  productBuildInstructions[PRODUCT_TYPES.BURGER] = {
    factories: [
      DefaultBurgerTypeCharacteristicsFactory,
      DefaultBurgerStuffingCharacteristicsFactory
    ],
    baseClass: Hamburger
  };
  productBuildInstructions[PRODUCT_TYPES.SALAD] = {
    factories: [DefaultSaladTypeCharacteristicsFactory],
    baseClass: Salad
  };
  productBuildInstructions[PRODUCT_TYPES.DRINK] = {
    factories: [
      DefaultDrinkTypeCharacteristicsFactory,
      DefaultDrinkSizeCharacteristicsFactory
    ],
    baseClass: Drink
  };
  this.giveMe = function(type) {
    var factories = productBuildInstructions[type].factories;
    var baseClass = productBuildInstructions[type].baseClass;
    // Without this null bind.apply doesn't work :(
    var characteristics = [null];
    for (var i = 0; i < factories.length; ++i) {
      characteristics.push(factories[i].getCharacteristic(arguments[i + 1]));
    }
    for (var i = 1 + factories.length; i < arguments.length; ++i) {
      characteristics.push(arguments[i]);
    }
    var factory = baseClass.bind.apply(baseClass, characteristics);
    return new factory();
  };
}

// ORDER
function Order(items) {
  this.items = items;
}

Order.prototype.getPrice = function() {
  return this.items.reduce(function(sum, item) {
    return sum + item.getPrice();
  }, 0);
};

Order.prototype.getCalories = function() {
  return this.items.reduce(function(sum, item) {
    return sum + item.getCalories();
  }, 0);
};

function OrderBuilder() {
  this.items = [];
}

OrderBuilder.prototype.addItem = function(position, product) {
  this.items[position] = product;
};

OrderBuilder.prototype.deleteItem = function(position) {
  this.items.splice(position, 1);
};

OrderBuilder.prototype.pay = function() {
  var order = new Order(this.items);
  this.items = [];
  return order;
};

var menu = new Menu();
var largeBurger = menu.giveMe(
  PRODUCT_TYPES.BURGER,
  BURGER_TYPES.LARGE,
  BURGER_STUFFING.POTATO
);
var smallBurger = menu.giveMe(
  PRODUCT_TYPES.BURGER,
  BURGER_TYPES.SMALL,
  BURGER_STUFFING.CHEESE
);
var salad = menu.giveMe(PRODUCT_TYPES.SALAD, SALAD_TYPES.OLIVIER, 123);
var drink = menu.giveMe(
  PRODUCT_TYPES.DRINK,
  DRINK_TYPES.COLA,
  DRINK_SIZES.LARGE
);
var orderBuilder = new OrderBuilder();
orderBuilder.addItem(0, largeBurger);
orderBuilder.addItem(1, salad);
orderBuilder.addItem(2, drink);
orderBuilder.addItem(3, smallBurger);
orderBuilder.deleteItem(0);
var order = orderBuilder.pay();
console.log(order.items);
console.log("total: ", order.getPrice());
