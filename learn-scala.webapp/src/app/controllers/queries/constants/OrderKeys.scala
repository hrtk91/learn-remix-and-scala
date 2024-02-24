package controllers.queries.constants

/** オーダーキーEnum
  *
  * @param value
  *   asc | desc
  */
enum OrderKeys(val value: String):
  case asc extends OrderKeys("asc")
  case desc extends OrderKeys("desc")
