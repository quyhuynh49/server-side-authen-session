const express = require("express");
const morgan = require("morgan");
const uuidv4 = require("uuid").v4;
const app = express();

const sessions = {};

app.use(express.json());
app.use(morgan("dev"));

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username !== "admin" || password !== "admin") {
    return res.status(401).send("invalid username or password");
  }
  const sessionId = uuidv4();
  sessions[sessionId] = { username, userId: 1 };
  res.set("Set-Cookie", `session=${sessionId}`);
  res.send("success");
});

app.post("/logout", (req, res) => {
  const sessionId = req.headers.cookie?.split("=")[1];
  delete sessions[sessionId];
  res.set("Set-Cookie", `session=null`);
  res.send("success");
});

app.get("/todos", (req, res) => {
  const sessionId = req.headers.cookie?.split("=")[1];
  const userSession = sessions[sessionId];
  if (!userSession) {
    return res.status(401).send("invalid session");
  }
  const userId = userSession.userId;
  res.send([
    {
      id: 1,
      title: "learn nodejs",
      userId,
    },
  ]);
});

app.listen(8080);
