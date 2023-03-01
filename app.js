const express = require("express");
const bodyPraser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");
const isAuth = require("./middleware/middleware");
var cors = require("cors");

const graphiQlSchema = require("./graphql/schema/index");
const graphiQlResolvers = require("./graphql/resolvers/index");

// require("dotenv").config();

const app = express();

app.use(cors());

app.use(bodyPraser.json());

app.use(isAuth);

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphiQlSchema,
    rootValue: graphiQlResolvers,
    graphiql: true,
  })
);

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(8000, () => console.log("8000"));
  })
  .catch((err) => {
    console.log(err);
  });
