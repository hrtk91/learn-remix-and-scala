package controllers

import controllers.queries._
import controllers.queries.constants._

import javax.inject._
import play.api._
import play.api.mvc._
import anorm._
import anorm.SqlParser.scalar
import scala.concurrent.Future
import play.api.db.Database
import models._
import play.api.libs.json.Json

/** クラスに関するリクエストを処理するコントローラ
  */
@Singleton
class ClassController @Inject() (
    val controllerComponents: ControllerComponents,
    db: Database,
    databaseExecutionContext: DatabaseExecutionContext
) extends BaseController {

  /** ロガー */
  val logger: Logger = Logger(this.getClass())

  /** SQL取得結果をStudentにするParser */
  val parser: RowParser[Student] = {
    for {
      id <- SqlParser.int("students.id")
      studentName <- SqlParser.str("students.name")
      loginId <- SqlParser.str("students.loginId")
      classroomId <- SqlParser.int("classrooms.id").?
      className <- SqlParser.str("classrooms.name").?
      facilitatorId <- SqlParser.int("facilitators.id").?
      facilitatorName <- SqlParser.str("facilitators.name").?
    } yield {
      val facilitator =
        facilitatorId.map(id => Facilitator(id, facilitatorName.get))
      val classroom =
        classroomId.map(id =>
          Classroom(id, className.get, facilitatorId, facilitator)
        )

      Student(id, studentName, loginId, classroomId, classroom)
    }
  }

  def students =
    Action.async { implicit request: Request[AnyContent] =>
      logger.info("students: START")
      implicitly[QueryStringBindable[StudentsRequest]]
        .bind("", request.queryString)
        .fold[Future[Result]](
          Future.successful(BadRequest("Invalid request"))
        ) {
          case Left(e) => Future.successful(BadRequest(e.toString))
          case Right(req) =>
            Future {

              logger.info(s"students: req = $req")

              db.withConnection { implicit conn =>

                // 総件数の取得
                val count: Long = SQL(
                  s"""
                    SELECT COUNT(*)
                    FROM students
                    INNER JOIN classrooms ON students.classroomId = classrooms.id
                    LEFT JOIN facilitators ON classrooms.facilitatorId = facilitators.id
                    WHERE
                      facilitators.id = {facilitatorId} AND
                      students.name LIKE {nameLike} AND
                      students.loginId LIKE {loginIdLike}
                    """
                )
                  .on(
                    "facilitatorId" -> req.facilitator_id,
                    "nameLike" -> s"%${req.name_like.getOrElse("")}%",
                    "loginIdLike" -> s"%${req.loginId_like.getOrElse("")}%"
                  )
                  .as(scalar[Long].single)

                val models = SQL(
                  s"""
                  SELECT
                    students.id,
                    students.name,
                    students.loginId,
                    classrooms.id,
                    classrooms.name,
                    facilitators.id,
                    facilitators.name
                  FROM students
                  INNER JOIN classrooms ON students.classroomId = classrooms.id
                  LEFT JOIN facilitators ON classrooms.facilitatorId = facilitators.id
                  WHERE
                    facilitators.id = {facilitatorId} AND
                    students.name LIKE {nameLike} AND
                    students.loginId LIKE {loginIdLike}
                  ORDER BY students.${req.sort
                      .getOrElse(SortKeys.name)
                      .value} ${req.order.getOrElse(OrderKeys.asc).value}
                  LIMIT {limit}
                  OFFSET {offset}
                """
                ).on(
                  "facilitatorId" -> req.facilitator_id,
                  "nameLike" -> s"%${req.name_like.getOrElse("")}%",
                  "loginIdLike" -> s"%${req.loginId_like.getOrElse("")}%",
                  "limit" -> req.limit,
                  "offset" -> (req.page - 1) * req.limit
                ).as(
                  parser.*
                )

                val results = Json.toJson(
                  dto.StudentsResponse.from(
                    models,
                    Math.min(count, Int.MaxValue).toInt
                  )
                )

                logger.info("students: END")

                Ok(results)
              }
            }(databaseExecutionContext).recover { case e: Exception =>
              logger.warn(s"students: error = $e")
              InternalServerError("500 Internal Server Error")
            }(databaseExecutionContext)
        }
    }
}
