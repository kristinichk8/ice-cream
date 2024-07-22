const express = require('express');
const { body, validationResult } = require('express-validator');
const fs = require('fs');
const app = express();
const cors = require("cors");
const jwt = require('jsonwebtoken');
const path = require('path')
const Cart = require('./cart');
const bcrypt = require('bcrypt');


app.use(express.static(
  path.join(__dirname, 'public'))
)


app.use(express.json());

app.use(cors());
const shoppingCart = new Cart();

const validateUserData = [
  body('name')
    .isString()
    .isLength({ min: 1 })
    .matches(/^[\p{L}\s-]+$/u)
    .withMessage('Имя обязательно и должно содержать только кириллицу, пробел и тире'),
  body('surname')
    .isString()
    .isLength({ min: 1 })
    .matches(/^[\p{L}\s-]+$/u)
    .withMessage('Фамилия обязательна и должна содержать только кириллицу, пробел и тире'),
  body('patronymic')
    .optional()
    .isString()
    .matches(/^[\p{L}\s-]+$/u)
    .withMessage('Отчество должно содержать только кириллицу, пробел и тире'),
  body('login')
    .isString()
    .isLength({ min: 1 })
    .matches(/^[A-Za-z0-9-]+$/)
    .withMessage('Логин обязателен и должен содержать только латинские буквы, цифры и тире'),
  body('email')
    .isEmail()
    .withMessage('Некорректный email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Пароль должен содержать не менее 6 символов'),
  body('password_repeat')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Пароли не совпадают');
      }
      return true;
    })
];


const dataFilePathUsers = './users.json';
const dataFilePathProducts = './products.json';
const dataFilePathOrders = './orders.json';
const dataFilePathCategories = './categories.json';

if (!fs.existsSync(dataFilePathOrders)) {
  fs.writeFileSync(dataFilePathOrders, '[]');
}

if (!fs.existsSync(dataFilePathUsers)) {
  fs.writeFileSync(dataFilePathUsers, '[]');
}

if (!fs.existsSync(dataFilePathProducts)) {
  fs.writeFileSync(dataFilePathProducts, '[]');
}
if (!fs.existsSync(dataFilePathCategories)) {
  fs.writeFileSync(dataFilePathCategories, '[]');
}

// Получение всех пользователей
app.get('/users', (req, res) => {
  const rawData = fs.readFileSync(dataFilePathUsers);
  const users = JSON.parse(rawData);
  res.json(users);
});

app.get('/users/:userId', (req, res) => {
  try {
    const rawData = fs.readFileSync(dataFilePathUsers);
    const users = JSON.parse(rawData);

    const userId = parseInt(req.params.userId);
    const user = users.find((user) => user.id === userId);

    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error reading users data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.get('/usersIsAdmin/:token', (req, res) => {
  try {
    const rawData = fs.readFileSync(dataFilePathUsers);
    const users = JSON.parse(rawData);
    const token = req.params.token;
    const decodedToken = jwt.decode(token);

    if (!decodedToken || !decodedToken.userId) {
      return res.status(400).json({ error: 'Неверный токен' });
    }

    const userId = decodedToken.userId;
    const user = users.find((user) => user.id === userId);

    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    const isAdmin = user.role === 'admin';

    // Возвращаем результат в ответе на запрос
    res.json({ isAdmin });
  } catch (error) {
    console.error('Error reading users data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/users', validateUserData, (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, surname, patronymic, login, email, password, password_repeat, rules } = req.body;

  const rawData = fs.readFileSync(dataFilePathUsers);
  const users = JSON.parse(rawData);

  const newUser = { id: users.length + 1, name, surname, patronymic, login, email, password, password_repeat, rules, role: 'user' };
  users.push(newUser);

  fs.writeFileSync(dataFilePathUsers, JSON.stringify(users, null, 2));
  res.json(newUser);
});

app.post('/login', (req, res) => {
  const { login, password } = req.body;

  // Здесь вы должны загрузить данные из вашего хранилища (users.json) и проверить учетные данные
  const rawData = fs.readFileSync(dataFilePathUsers);
  const users = JSON.parse(rawData);

  // Проверяем, есть ли пользователь с таким логином и паролем
  const user = users.find((user) => user.login === login && user.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Авторизация не удалась. Неправильный логин или пароль.' });
  }
  const token = jwt.sign({ login, userId: user.id }, 'your-secret-key', { expiresIn: '1h' });
  // В данном случае, просто возвращаем успешный ответ и какой-то токен
  res.status(200).json({ message: 'Авторизация успешна', token });
});

app.get('/products', (req, res) => {
  const rawData = fs.readFileSync(dataFilePathProducts);
  const products = JSON.parse(rawData);
  res.json(products);
});
app.get('/products/:id', (req, res) => {
  const rawData = fs.readFileSync(dataFilePathProducts);
  const products = JSON.parse(rawData);
  const productId = parseInt(req.params.id);
  const product = products.find((product) => product.id === productId);

  if (!product) {
    res.status(404).json({ error: 'Товар не найден' });
  } else {
    res.json(product);
  }
});

app.post('/products', (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, price, amount, img, category, country, year, recept } = req.body;

  const rawData = fs.readFileSync(dataFilePathProducts);
  const products = JSON.parse(rawData);

  const newProduct = { id: products.length + 1, name, price, amount, img, category, country, year, recept };
  products.push(newProduct);

  fs.writeFileSync(dataFilePathProducts, JSON.stringify(products, null, 2));
  res.json(newProduct);
});

app.put('/productsupdate/:id', (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, price, amount, img, category, country, year, recept } = req.body;
  const productId = parseInt(req.params.id); // Идентификатор товара

  try {
    const rawData = fs.readFileSync(dataFilePathProducts);
    let products = JSON.parse(rawData);

    // Находим индекс товара в массиве по его идентификатору
    const productIndex = products.findIndex((product) => product.id === productId);

    if (productIndex === -1) {
      return res.status(404).json({ error: 'Товар не найден' });
    }

    // Обновляем данные товара
    products[productIndex] = {
      id: productId,
      name,
      price,
      amount,
      img,
      category,
      country,
      year,
      recept,
    };

    // Записываем обновленные данные обратно в файл
    fs.writeFileSync(dataFilePathProducts, JSON.stringify(products, null, 2));

    // Возвращаем обновленные данные в ответе
    res.json(products[productIndex]);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/productsdelete/:id', (req, res) => {
  try {
    const productId = parseInt(req.params.id);

    // Read existing products data
    const rawData = fs.readFileSync(dataFilePathProducts);
    let products = JSON.parse(rawData);

    // Find the index of the product with the given ID
    const productIndex = products.findIndex((product) => product.id === productId);

    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Remove the product from the array
    products.splice(productIndex, 1);

    // Save the updated products data back to the file
    fs.writeFileSync(dataFilePathProducts, JSON.stringify(products, null, 2));

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




app.get('/images/:imageName', (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = `C:/Users/ТТТ/Desktop/колледж/icecream_по_УП_ПМ.05.01_ИСПсп-120_КозловаКА/server/src/img/${imageName}`;
  res.sendFile(imagePath);
});

app.post('/cart', (req, res) => {
  const productId = req.body.productId;
  const rawData = fs.readFileSync(dataFilePathProducts);
  const products = JSON.parse(rawData);
  const product = products.find((product) => product.id === parseInt(productId));

  if (!product) {
    return res.status(404).json({ error: 'Продукт не найден' });
  }
  shoppingCart.addItem(product);
  res.json({ message: 'Продукт добавлен в корзину', cart: shoppingCart.getItems() });

  app.get('/cart', (req, res) => {
    const cartItems = shoppingCart.getItems();
    res.json(cartItems);
  });
  app.delete('/cart', (req, res) => {
    shoppingCart.clearCart();

    res.json({ message: 'Корзина очищена' });
  });
  app.put('/cart/:productId', (req, res) => {
    const productId = req.params.productId;
    const { quantity } = req.body;
    shoppingCart.updateQuantity(productId, quantity);
    res.json({ message: 'Количество товара в корзине обновлено' });
  });
});
app.post('/orders', (req, res) => {
  try {
    const { cart, token } = req.body;
    const decodedToken = jwt.decode(token);
    const userId = decodedToken.userId;
    const order = {
      orderId: Math.floor(Math.random() * 1000),
      userId,
      status: "Оформлен",
      cart,
      date: new Date().toISOString(),
    };

    // Читаем данные из файла
    const rawData = fs.readFileSync(dataFilePathOrders);
    const orders = rawData.length > 0 ? JSON.parse(rawData) : [];

    // Добавляем новый заказ
    orders.push(order);

    // Записываем обновленные данные обратно в файл
    fs.writeFileSync(dataFilePathOrders, JSON.stringify(orders, null, 2));

    // Отправляем созданный заказ в ответе
    res.json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.get('/orders', (req, res) => {
  const rawData = fs.readFileSync(dataFilePathOrders);
  const orders = JSON.parse(rawData);
  res.json(orders);
});



app.post('/check-password', async (req, res) => {
  try {
    const { password, token } = req.body;
    const decodedToken = jwt.decode(token);
    const userId = decodedToken.userId;
    const rawData = fs.readFileSync(dataFilePathUsers);
    const users = JSON.parse(rawData);
    const user = users.find((user) => user.id === userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'Пользователь не найден' });
    }
    if (!password || !user.password) {
      return res.status(400).json({ success: false, error: 'Некорректные данные для сравнения пароля' });
    }

    if (password === user.password) {
      res.json({ success: true });
    }


    else {
      res.json({ success: false, error: 'Неправильный пароль' });
    }
  } catch (error) {
    console.error('Error checking password:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.get('/orders/:token', (req, res) => {
  try {
    const rawData = fs.readFileSync(dataFilePathOrders);
    const orders = JSON.parse(rawData);

    const token = req.params.token;
    const decodedToken = jwt.decode(token);
    const userId = decodedToken.userId;

    const userOrders = orders.filter(order => order.userId == userId);

    console.log('User Orders:', userOrders);

    res.json(userOrders);
  } catch (error) {
    console.error('Error reading data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/delorder/:orderId/:token', (req, res) => {
  try {
    const rawData = fs.readFileSync(dataFilePathOrders);
    let orders = JSON.parse(rawData);

    const orderIdToDelete = parseInt(req.params.orderId);
    const token = req.params.token;
    const decodedToken = jwt.decode(token);
    const userId = decodedToken.userId;

    const orderToDelete = orders.find(order => order.orderId === orderIdToDelete && order.userId == userId);

    if (!orderToDelete) {
      return res.status(404).json({ error: 'Order not found or does not belong to the user' });
    }

    orders = orders.filter(order => order.orderId !== orderIdToDelete);

    fs.writeFileSync(dataFilePathOrders, JSON.stringify(orders, null, 2));

    console.log('Order deleted:', orderIdToDelete);

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

app.get('/admin/orders/:status', (req, res) => {
  const { status } = req.params;
  const rawData = fs.readFileSync(dataFilePathOrders);
  const orders = JSON.parse(rawData);

  // Фильтрация заказов по статусу
  const filteredOrders = orders.filter(order => order.status === status);

  // Отправка отфильтрованных заказов
  res.json(filteredOrders);
});

app.put('/admin/orders/:orderId/confirm', (req, res) => {
  const { orderId } = req.params;
  const rawData = fs.readFileSync(dataFilePathOrders);
  let orders = JSON.parse(rawData);

  // Находим заказ по ID и обновляем статус
  const orderToConfirm = orders.find(order => order.orderId === parseInt(orderId));
  if (orderToConfirm) {
    orderToConfirm.status = 'Подтвержден';
    fs.writeFileSync(dataFilePathOrders, JSON.stringify(orders, null, 2));
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Order not found' });
  }
});

app.put('/admin/orders/:orderId/cancel', (req, res) => {
  const { orderId } = req.params;
  const { reason } = req.body;
  const rawData = fs.readFileSync(dataFilePathOrders);
  let orders = JSON.parse(rawData);

  // Находим заказ по ID и обновляем статус и причину отмены
  const orderToCancel = orders.find(order => order.orderId === parseInt(orderId));
  if (orderToCancel) {
    orderToCancel.status = 'Отменен';
    orderToCancel.cancelReason = reason;
    fs.writeFileSync(dataFilePathOrders, JSON.stringify(orders, null, 2));
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Order not found' });
  }
});

// Получение списка товаров
app.get('/admin/products', (req, res) => {
  const rawData = fs.readFileSync(dataFilePathProducts);
  const products = JSON.parse(rawData);
  res.json(products);
});

// Удаление товара
app.delete('/admin/products/:productId', (req, res) => {
  const { productId } = req.params;
  const rawData = fs.readFileSync(dataFilePathProducts);
  let products = JSON.parse(rawData);

  // Фильтрация товаров, оставляя только тот, который нужно удалить
  products = products.filter(product => product.id !== parseInt(productId));

  fs.writeFileSync(dataFilePathProducts, JSON.stringify(products, null, 2));
  res.json({ success: true });
});

// Редактирование товара
app.put('/admin/products/:productId', (req, res) => {
  const { productId } = req.params;
  const { name, price, amount, img, category, country, year, recept } = req.body;
  const rawData = fs.readFileSync(dataFilePathProducts);
  let products = JSON.parse(rawData);

  // Находим товар по ID и обновляем информацию о нем
  const productToUpdate = products.find(product => product.id === parseInt(productId));
  if (productToUpdate) {
    productToUpdate.name = name;
    productToUpdate.price = price;
    productToUpdate.amount = amount;
    productToUpdate.img = img;
    productToUpdate.category = category;
    productToUpdate.country = country;
    productToUpdate.year = year;
    productToUpdate.recept = recept;

    fs.writeFileSync(dataFilePathProducts, JSON.stringify(products, null, 2));
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

// Добавление новой категории
app.post('/admin/categories', (req, res) => {
  const { category } = req.body;
  const rawData = fs.readFileSync(dataFilePathProducts);
  let products = JSON.parse(rawData);

  // Получаем уникальные категории из товаров
  const categories = Array.from(new Set(products.map(product => product.category)));

  // Проверяем, существует ли уже такая категория
  if (categories.includes(category)) {
    res.status(400).json({ error: 'Category already exists' });
  } else {
    // Добавляем категорию в массив уникальных категорий
    categories.push(category);
    // Возвращаем обновленный список категорий
    res.json(categories);
  }
});

app.get('/categories', (req, res) => {
  try {
    const rawData = fs.readFileSync(dataFilePathCategories);
    const categories = JSON.parse(rawData);
    res.json(categories);
  } catch (error) {
    console.error('Error reading categories data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/categories/add', (req, res) => {
  try {
    const rawData = fs.readFileSync(dataFilePathCategories);
    const categories = JSON.parse(rawData);

    const { name } = req.body;
    const newCategory = { id: categories.length + 1, name };
    categories.push(newCategory);

    fs.writeFileSync(dataFilePathCategories, JSON.stringify(categories, null, 2));
    res.json(newCategory);
  } catch (error) {
    console.error('Error adding category:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/categories/delete/:id', (req, res) => {
  try {
    const rawData = fs.readFileSync(dataFilePathCategories);
    let categories = JSON.parse(rawData);

    const categoryId = parseInt(req.params.id);
    categories = categories.filter((category) => category.id !== categoryId);

    fs.writeFileSync(dataFilePathCategories, JSON.stringify(categories, null, 2));
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const port = 8081;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


