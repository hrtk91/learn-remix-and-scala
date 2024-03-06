package models

import play.api.libs.json.Writes
import play.api.libs.json.Json

case class Classroom(
    id: Int,
    name: String,
    facilitatorId: Option[Int],
    facilitator: Option[Facilitator]
)

object Classroom {
  implicit val writes: Writes[Classroom] = Json.writes[Classroom]
}
