package models

import play.api.libs.json.Writes
import play.api.libs.json.Json

case class Facilitator(
    id: Int,
    name: String
)

object Facilitator {
  implicit val writes: Writes[Facilitator] = Json.writes[Facilitator]
}
