package controllers.queries.constants

/** ソートキーEnum
  *
  * @param value
  *   name | loginId
  */
enum SortKeys(val value: String):
  case name extends SortKeys("name")
  case loginId extends SortKeys("loginId")
