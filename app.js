const express = require('express')
const app = express();
const path = require('path');
const userModel = require('./models/user')


app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req,res)=> {
    res.render("index");
})

app.get('/read', async (req,res)=> {
    let users = await userModel.find()
    res.render("read", {users});
})

app.post('/create',  async (req,res)=> {
    let {name, email, image} = req.body;
    let createdUser = await userModel.create({
        name,
        email,
        image 
    });

    res.redirect('/read');
})

app.get('/delete/:id', async (req,res)=> {
    const cleanId = req.params.id.trim();
await userModel.findOneAndDelete(cleanId)
    res.redirect("/read");
})

app.get('/edit/:id', async (req, res) => {
  const user = await userModel.findById(req.params.id.trim());
  res.render('edit', { user }); // Renders views/edit.ejs
});

app.post('/update/:id', async (req, res) => {
  let { image, name, email } = req.body;

  const updatedUser = await userModel.findOneAndUpdate(
    { _id: req.params.id.trim() },
    { image, name, email },
    { new: true }
  );

  res.redirect('/read'); // or res.render('read', { users: [...] }) if you want to re-render directly
});




app.listen(3000);