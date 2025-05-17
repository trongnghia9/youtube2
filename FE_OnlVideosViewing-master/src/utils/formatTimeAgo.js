// utils/formatTime.js
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import "dayjs/locale/vi";

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

// Ghi đè để hiện số thay vì chữ (1 thay vì "một")
dayjs.updateLocale("vi", {
  relativeTime: {
    future: "trong %s",
    past: "%s trước",
    s: "%d giây",
    m: "1 phút",
    mm: "%d phút",
    h: "1 giờ",
    hh: "%d giờ",
    d: "1 ngày",
    dd: "%d ngày",
    M: "1 tháng",
    MM: "%d tháng",
    y: "1 năm",
    yy: "%d năm",
  },
});

dayjs.locale("vi");

export const formatTimeAgo = (date) => {
  return dayjs(date).fromNow();
};