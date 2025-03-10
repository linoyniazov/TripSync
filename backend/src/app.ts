import initApp from "./server";
const port = process.env.PORT;

console.log("Starting application...");
initApp().then((app) => {
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
});