import http from "./httpService";
import { apiUrl } from "../configs/config.json";

const apiEndpoint = apiUrl + "/lessons";

function saveQrCode(_class, lesson, qrCode, expiredTime) {
  return http.post(`${apiEndpoint}/${_class._id}/${lesson.order}`, {
    qrCode,
    expiredTime,
  });
}

function takeAttendance(_class, lesson, mail, status) {
  status = status === "Not Attendance" ? "Attended" : "Not Attendance";
  return http.put(`${apiEndpoint}/${_class._id}/${lesson.order}`, {
    mail,
    status,
  });
}

const LessonService = {
  saveQrCode,
  takeAttendance,
};

export default LessonService;
