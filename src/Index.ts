import express from 'express';
import { json, urlencoded } from 'body-parser';
import { connectDatabase } from './dataBase'; 

import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

import login from './routes/controller/login.controller';
import signup from './routes/controller/signup.controller';
import profile from './routes/controller/user.controller';
import news from './routes/controller/new.controller';
import post from './routes/controller/post.controller';
import global_day from './routes/controller/global_day.controller';
import challenge from './routes/controller/challenge.controller';
import like from './routes/controller/like.controller';

const app = express();
const PORT = process.env.PORT || 8000;
const swaggerYaml = YAML.load(path.join(__dirname, './swagger/swagger.yaml'));


app.use(json());
app.use(urlencoded({ extended: true }));


app.use('/auth', login);
app.use('/auth', signup);
app.use(profile);
app.use(news);
app.use('/post', post);
app.use('/globalday', global_day);
app.use('/challenge', challenge);
app.use( like);


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerYaml));


const startServer = async () => {
  try {
    await connectDatabase(); 
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1); 
  }
};

startServer();

export default app; 
