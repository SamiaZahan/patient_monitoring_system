const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const app = express();
app.use(cors())
const port = 5000;
app.use(express.json());

let cart = []; // Cart array

// Routes
app.post('/api/cart', addToCart);
app.get('/api/cart', getCart);
app.put('/api/cart/:id', updateCartItem);
app.delete('/api/cart/:id', deleteCartItem);
app.get('/api/menu', getMenu);

app.get('/api/patients', getPatients);
app.get('/api/patient/:id', getPatientById);

app.post('/api/order', placeOrder);
app.delete('/api/order/:id', deleteOrder);

// Functions
async function addToCart(req, res) {
    const newItem = {
      id: req.body.id,
      name: req.body.name,
      price: req.body.price,
      quantity: 1
  };    
  cart.push(newItem);
  res.sendStatus(200);
}

async function getCart(req, res) {
    res.json(cart);
}

async function updateCartItem(req, res) {
    const itemId = parseInt(req.params.id);
    const shouldAdd = req.body.shouldAdd;
    const itemIndex = cart.findIndex(item => item.id === itemId);
    if (itemIndex == -1) {
        res.status(404).json({ success: false, message: 'Item not found in cart' });
    } else {
        if(shouldAdd)
            cart[itemIndex].quantity = cart[itemIndex].quantity+1;
          else
            if(cart[itemIndex].quantity > 1)
                cart[itemIndex].quantity = cart[itemIndex].quantity-1;
          res.json({ success: true, message: 'Quantity updated successfully' });
    }
}

async function deleteCartItem(req, res) {
  const itemId = parseInt(req.params.id);
  const index =  cart.findIndex(item => item.id === itemId);
  if (index !== -1) {
      cart.splice(index, 1);
      res.status(200).json({ message: 'Item deleted successfully' });
  } else {
      res.status(404).json({ message: 'Item not found' });
    }
}

async function getMenu(req, res) {
  const menuPath = path.join(__dirname, 'menu.json');
  fs.readFile(menuPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading menu.json file:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(JSON.parse(data));
  });
}

async function getPatients(req, res) {
  const patientsPath = path.join(__dirname, 'patients.json');
  fs.readFile(patientsPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading order.json file:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(JSON.parse(data));
  });
}

async function getPatientById(req, res) {
  const patientId = req.params.id; // No need to parseInt

  // Read the patients.json file
  fs.readFile('./patients.json', 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading patient data' });
    }
    // Parse the JSON data
    const patients = JSON.parse(data);
    const patient = patients.find(p => p.patientId === patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json(patient);
  });
}

async function placeOrder(req, res) {
    const ordersFilePath = path.join(__dirname, 'order.json');
    fs.readFile(ordersFilePath, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error reading orders file');
      }
      let orders = [];
      try {
        orders = JSON.parse(data);
      } catch (parseErr) {
        console.error(parseErr);
        return res.status(500).send('Error parsing orders file');
      }
      // Get the last order ID
      const lastOrder = orders[orders.length - 1];
      const lastOrderId = lastOrder ? lastOrder.id : 3000;
  
      // Create the new order
      const newOrder = {
        id: lastOrderId + 1,
        order_date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
        order_items: req.body
      };
  
      orders.push(newOrder);
      fs.writeFile(ordersFilePath, JSON.stringify(orders, null, 2), (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Error writing to orders file');
        }
        // Clear the cart after successful order placement
        fs.writeFileSync('cart.json', JSON.stringify([]));
        res.status(200).send('Order added successfully');
        cart=[]
      });
    });
}

async function deleteOrder(req, res) {
  const orderId = parseInt(req.params.id);
  const ordersFilePath = path.join(__dirname, 'order.json');
  fs.readFile(ordersFilePath, 'utf8', (err, data) => {
      if (err) {
          console.error(err);
          console.log("scope1")
          return res.status(500).send('Error reading orders file');
      }

      let orders = JSON.parse(data);
      const orderIndex = orders.findIndex(order => order.id === orderId);
      console.log("orderIndex", orderIndex)

      if (orderIndex === -1) {
        console.log("scope2")

          return res.status(404).send('Order not found');
      }

      orders.splice(orderIndex, 1);
      fs.writeFile(ordersFilePath, JSON.stringify(orders, null, 2), (err) => {
          if (err) {
              console.error(err);
              console.log("scope3")

              return res.status(500).send('Error writing to orders file');
          }

          res.status(200).send('Order deleted successfully');
      });
  });
}

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
