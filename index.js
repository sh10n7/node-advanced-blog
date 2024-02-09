const express = require("express");
const app = express();
app.use(express.urlencoded( {extended: true} ))
app.use("/public", express.static("public"))
// mongooseの読み込み。
const mongoose = require("mongoose");
// ejsの読み込み
app.set("view engine", "ejs")


// mongoose.connect(データベースURL)で、MongoDBと接続をする。
mongoose.connect("mongodb+srv://shion_y:cvxvhAm5B8sCQl17@cluster0.tslmift.mongodb.net/?retryWrites=true&w=majority")
.then(() => {
  console.log("Success: Connected to MongoDB")
}).catch((error) => {
  console.log("Failure: Unconnected to MongoDB")
})

// スキーマとModelの作成
const Schema = mongoose.Schema;
const BlogSchema = new Schema({
  title: String,
  summary: String,
  image: String,
  textBody: String,
});

// モデルの作成。BlogSchemaの情報を元にBlogモデルを作成する。
const BlogModel = mongoose.model("Blog", BlogSchema);


// ---ブログ投稿に関する機能---

//新規投稿ページを表示させるためのリクエスト。res.sendFile()で指定したファイルをレスポンスとして戻す。
app.get("/blog/create", (req, res) => {
  res.render("blogCreate")
});

app.post("/blog/create", async (req, res) => {
  //モデル.create(書き込みたいデータ, (エラーの記述, データ書き込みが成功した際に発生する処理) =>{})
  try {
    const savedData = await BlogModel.create(req.body);
    console.log("データの書き込みが成功しました。")
    res.send("データの書き込みが成功しました。")
  } catch(error) {
    console.log("データの書き込みに失敗しました。")
    res.send("データの書き込みに失敗しました。")
  }
});

// ブログ記事を全取得する。ルートパス("/")へのリクエストがあった場合の処理。
app.get("/", async (req, res) => {
  // async ~ await構文を用いてデータの全取得が完了してから次の処理を実施するように指定
  const allBlogs = await BlogModel.find();
  res.render("index", {allBlogs})
});

// 特定のブログ記事のみ取得する。MongoDBに登録されているIDで識別をする。
app.get("/blog/:id", async (req, res) => {
  const singleBlog = await BlogModel.findById(req.params.id);
  res.render("blogRead", {singleBlog})
})

// ブログ記事の更新
// 編集ページの表示
app.get("/blog/update/:id", async(req, res) => {
  const singleBlog = await BlogModel.findById(req.params.id);
  res.render("blogUpdate", {singleBlog})
})

// 更新作業
app.post("/blog/update/:id", async(req, res) => {
  try {
    //updateOne(編集したい記事のid番号, 編集したデータ).exec((error) => {エラー発生時の処理});
    await BlogModel.updateOne( {_id: req.params.id}, req.body)
    res.send("ブログの編集が成功しました")
  } catch(error) {
    console.log("ブログの編集に失敗しました")
  }
})

// 削除機能
// 削除ページの表示
app.get("/blog/delete/:id", async(req, res) => {
  const singleBlog = await BlogModel.findById(req.params.id)
  console.log("singleBlogの中身", singleBlog);
  res.render("blogDelete", {singleBlog})
})

// 削除処理。async~await構文を使用しないと削除の前にresponseが返ってしまうので注意。
app.post("/blog/delete/:id", async(req, res) => {
  try {
    await BlogModel.deleteOne({_id: req.params.id})
    res.send("ブログの削除が成功しました")
  } catch(error) {
    res.send("ブログの削除に失敗しました");
  }
})

// ポートとの接続
app.listen(5000, () => {
  console.log("listening on localhost port 5000");
});