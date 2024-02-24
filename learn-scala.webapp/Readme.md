# Learn Scala Play Web アプリケーション

このプロジェクトは、Scala を使用して Play Framework で構築された Web アプリケーションです。生徒一覧を取得するエンドポイントを提供します。

## ホスティング

以下の指示に従えばローカルマシン上にプロジェクトのコピーを立ち上げて動かすことができます。

### 前提条件

[Docker](https://www.docker.com/products/docker-desktop)および[Docker Compose](https://docs.docker.com/compose/install/)がインストールされている。

### アプリケーションの実行

アプリケーションを起動するには、プロジェクトのルートから以下のコマンドを実行します：

```bash
docker-compose up --build
```

アプリケーションが起動したら、ブラウザで以下の URL にアクセスしてください：

```
http://localhost:5000
```

## API 仕様

### Path

GET /students

### Parameters

- `facilitator_id` (int): 先生の ID を指定します。必須項目です
- `page` (int): 表示するページ番号を指定します。指定しない場合は 1 です
- `limit` (int): 一ページに表示するデータ数を指定します。指定しない場合は 10 です
- `sort` (string): ソートキーを指定します（許可: name | ログイン ID: loginId）指定しない場合は name です
- `order` (string): 昇順/降順を指定します（昇順: asc | 降順: desc）指定しない場合は asc です
- `key_like` (string): 指定した属性による部分一致検索をします（名前 : name_like | ログイン ID: loginId_like）任意項目です

### Response（成功時）

```json
{
  "students": [
    {
      "id": 1,
      "name": "生徒1",
      "loginId": "student_1",
      "classroom": {
        "id": 1,
        "name": "算数クラス"
      }
    }
  ],
  "totalCount": 1
}
```
