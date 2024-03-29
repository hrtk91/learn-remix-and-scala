package controllers.queries

import play.api.mvc._
import play.api.libs.json._
import controllers.queries.constants._

/** 生徒一覧取得リクエスト
  *
  * @param facilitator_id
  *   教師ID
  * @param page
  *   ページ数
  * @param limit
  *   一ページで取得する数
  * @param sort
  *   ソートキー
  * @param order
  *   オーダーキー
  * @param name_like
  *   名前の部分一致検索
  * @param loginId_like
  *   ログインIDの部分一致検索
  */
case class StudentsRequest(
    facilitator_id: Int = 0,
    page: Int = 1,
    limit: Int = 10,
    sort: Option[SortKeys] = Some(SortKeys.name),
    order: Option[OrderKeys] = Some(OrderKeys.asc),
    name_like: Option[String] = None,
    loginId_like: Option[String] = None
)

// JSONのためのフォーマット
implicit val sortKeysWrites: Writes[SortKeys] = Writes[SortKeys] {
  case SortKeys.name    => JsString("name")
  case SortKeys.loginId => JsString("loginId")
}
implicit val sortKeysReads: Reads[SortKeys] = Reads[SortKeys] {
  case JsString("name")    => JsSuccess(SortKeys.name)
  case JsString("loginId") => JsSuccess(SortKeys.loginId)
  case _                   => JsError("sort is invalid")
}
implicit val orderKeysWrites: Writes[OrderKeys] = Writes[OrderKeys] {
  case OrderKeys.asc  => JsString("asc")
  case OrderKeys.desc => JsString("desc")
}
implicit val orderKeysReads: Reads[OrderKeys] = Reads[OrderKeys] {
  case JsString("asc") => JsSuccess(OrderKeys.asc)
  case JsString("desc") =>
    JsSuccess(OrderKeys.desc)
  case _ => JsError("order is invalid")
}
implicit val studentsRequestFormat: OFormat[StudentsRequest] =
  Json.format[StudentsRequest]

import play.api.mvc.QueryStringBindable
import scala.util.control.NonFatal

// QueryStringBindableを実装
implicit def queryStringBindable(implicit
    intBinder: QueryStringBindable[Int],
    stringBinder: QueryStringBindable[String]
): QueryStringBindable[StudentsRequest] =
  new QueryStringBindable[StudentsRequest] {

    override def bind(
        key: String,
        params: Map[String, Seq[String]]
    ): Option[Either[String, StudentsRequest]] = {
      // facilitatorIdは必須
      val facilitatorId = intBinder.bind("facilitator_id", params) match {
        case Some(Right(id)) => id
        case Some(Left(e))   => return Some(Left("facilitator_id is invalid"))
        case None            => return Some(Left("facilitator_id is required"))
      }

      // pageは正の数のみ
      val page = intBinder.bind("page", params) match {
        case Some(Right(p)) =>
          p match {
            case p if p < 1 => return Some(Left("page must be greater than 0"))
            case _          => p
          }
        case Some(Left(e)) => return Some(Left("page is invalid"))
        case None          => 1
      }

      // limitは正の数のみ
      val limit = intBinder.bind("limit", params) match {
        case Some(Right(l)) =>
          l match {
            case l if l < 1 => return Some(Left("limit must be greater than 0"))
            case _          => l
          }
        case Some(Left(e)) => return Some(Left("limit is invalid"))
        case None          => 10
      }

      // sortはnameかloginIdのみ。指定がない場合はname
      val sort = stringBinder
        .bind("sort", params) match {
        case Some(Right(s)) =>
          s match {
            case "name"    => SortKeys.name
            case "loginId" => SortKeys.loginId
            case _         => return Some(Left("sort is invalid"))
          }
        case Some(Left(se)) => return Some(Left("sort is invalid"))
        case None           => SortKeys.name
      }

      // orderはascかdescのみ。指定がない場合はasc
      val order =
        stringBinder.bind("order", params) match {
          case Some(Right(o)) =>
            o match {
              case "asc"  => OrderKeys.asc
              case "desc" => OrderKeys.desc
              case _      => return Some(Left("order is invalid"))
            }
          case Some(Left(e)) => return Some(Left("order is invalid"))
          case None          => OrderKeys.asc
        }

      // nameLikeは255文字以内(英数字基準)
      val nameLike =
        stringBinder.bind("name_like", params) match {
          case Some(Right(n)) =>
            n match {
              case n if n.length > 255 =>
                return Some(Left("name_like must be less than 255 characters"))
              case _ => Some(n)
            }
          case Some(Left(e)) => return Some(Left("name_like is invalid"))
          case None          => None
        }

      // loginIdLikeは255文字以内(英数字基準)
      val loginIdLike =
        stringBinder
          .bind("loginId_like", params) match {
          case Some(Right(l)) =>
            l match {
              case l if l.length > 255 =>
                return Some(
                  Left("loginId_like must be less than 255 characters")
                )
              case _ => Some(l)
            }
          case Some(Left(e)) => return Some(Left("loginId_like is invalid"))
          case None          => None
        }

      // StudentsRequestのインスタンスを生成
      Some(
        Right(
          StudentsRequest(
            facilitatorId,
            page,
            limit,
            Some(sort),
            Some(order),
            nameLike,
            loginIdLike
          )
        )
      )
    }

    override def unbind(key: String, value: StudentsRequest): String = {
      val params = Seq(
        Some("facilitator_id" -> value.facilitator_id.toString),
        Some("page" -> value.page.toString),
        Some("limit" -> value.limit.toString),
        value.sort.map("sort" -> _.value),
        value.order.map("order" -> _.value),
        value.name_like.map("name_like" -> _),
        value.loginId_like.map("loginId_like" -> _)
      ).flatten // Optionを取り除く

      params.map { case (k, v) => s"$k=$v" }.mkString("&")
    }
  }
