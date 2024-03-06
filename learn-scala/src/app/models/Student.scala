package models

import play.api.libs.json.Writes
import play.api.libs.json.Json

/** 生徒
  *
  * @param id
  *   生徒ID
  * @param name
  *   生徒名
  * @param loginId
  *   ログインID
  * @param classId
  *   クラスID
  * @param classroom
  *   クラス
  */
case class Student(
    id: Int,
    name: String,
    loginId: String,
    classroomId: Option[Int],
    classroom: Option[Classroom]
)

// JSONシリアライズ設定
object Student {
  implicit val writes: Writes[Student] = Json.writes[Student]
}
