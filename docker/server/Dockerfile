# 使用したいイメージのバージョン指定
FROM node:20.11.0

# コンテナ内でアプリケーションのディレクトリを作成
WORKDIR /app

# コンテナ内で使用するファイルを指定
COPY ./public ./public
COPY ./views ./views
COPY ./index.js .
COPY ./package*.json .

# npmをインストールし、package.jsonの情報をもとに必要な依存関係をインストールする。
RUN npm install

EXPOSE 5000

# コンテナが起動した時の起動コマンドを設定。
CMD ["node", "index.js"]