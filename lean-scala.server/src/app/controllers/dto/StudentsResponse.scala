package dto

import play.api.libs.json.Writes
import play.api.libs.json.Json
import scala.annotation.targetName

/** 生徒一覧取得レスポンス
  *
  * @param students
  *   生徒一覧
  * @param totalCount
  *   全件数
  */
case class StudentsResponse(
    students: Seq[dto.Student],
    totalCount: Int
)

object StudentsResponse {
  implicit val writes: Writes[StudentsResponse] = Json.writes[StudentsResponse]

  def from(
      students: Seq[models.Student],
      totalCount: Int
  ): StudentsResponse = {
    StudentsResponse(students.map(x => dto.Student(x)), totalCount)
  }
}

/** 生徒
  *
  * @param id
  *   生徒ID
  * @param name
  *   生徒名
  * @param loginId
  *   クラスID
  * @param classroom
  *   クラス
  */
case class Student(
    id: Int,
    name: String,
    loginId: String,
    classroom: Option[dto.Classroom]
)

object Student {
  implicit val writes: Writes[dto.Student] = Json.writes[dto.Student]

  def apply(student: models.Student): dto.Student = {
    dto.Student(
      student.id,
      student.name,
      student.loginId,
      student.classroom.map(c => dto.Classroom(c.id, c.name))
    )
  }
}

/** クラス
  *
  * @param id
  *   クラスID
  * @param name
  *   クラス名
  */
case class Classroom(
    id: Int,
    name: String
)

object Classroom {
  implicit val writes: Writes[dto.Classroom] = Json.writes[dto.Classroom]

  def apply(classroom: models.Classroom): dto.Classroom = {
    dto.Classroom(classroom.id, classroom.name)
  }
}
