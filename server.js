require('dotenv').config();
const express = require('express');
const app = express();
const db = require('./models');
const authRouter = require('./routes/authRoutes');
const postRouter = require('./routes/postRoutes');
const commentRouter = require('./routes/commentRoutes');
const userRouter = require('./routes/userRoutes');
const cors = require('cors');
const bodyParser = require('body-parser');
const { verifyToken } = require('./auth/auth');

app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({
    origin: 'http://localhost:3000',
  optionsSuccessStatus: 200
}));

app.use('/auth', authRouter);
app.use(verifyToken);
app.use('/post', postRouter);
app.use('/comment', commentRouter);
app.use('/user', userRouter);

const PORT = 8000
db.sequelize.sync().then(() => {
  console.log('Baza podataka je uspešno povezana.');
  app.listen(PORT, () => {
    console.log(`Server pokrenut na portu ${PORT}`);
  });
}).catch((error) => {
  console.error('Greška prilikom povezivanja sa bazom podataka:', error);
});