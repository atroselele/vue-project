import dayjs from "dayjs"

const TimeFormat = "YYYY-MM-DD HH:mm:ss";
/* 格式化时间 */
function mkfsTime(time) {
  return dayjs(time).format(TimeFormat)
}
export default mkfsTime

