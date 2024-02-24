package controllers

import controllers.queries._
import javax.inject._
import play.api._
import play.api.mvc._

/** クラスに関するリクエストを処理するコントローラ
  */
@Singleton
class ClassController @Inject() (val controllerComponents: ControllerComponents)
    extends BaseController {

  def students =
    Action { implicit request: Request[AnyContent] =>
      val req = implicitly[QueryStringBindable[StudentsRequest]]
        .bind("", request.queryString)

      req match {
        case Some(Right(r)) => Ok(r.toString)
        case Some(Left(e)) =>
          BadRequest(e.toString)
        case None => BadRequest("Invalid request")
      }
      // Ok(views.html.index())
    }
}
