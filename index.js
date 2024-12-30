const express = require("express");
const cors = require("cors");
const {conection} = require("./database/conection");
const UserRoutes = require("./routes/user");

conection();

const app = express();
const port = 3900;

app.use(cors());
app.use(express.json());

app.use("/api/users", UserRoutes);

app.listen(port, () => {
    console.log("Serve on: ", port)
})
