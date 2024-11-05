//import { SERVER_URL } from "../constanst";

export function getResponseMsg(err) {
  if (err?.response?.status !== 400) {
    return;
  }
  return err?.response?.data?.message;
}

export function getMediaPath(file) {
  return file;
  //return file ? `${SERVER_URL}/${file}` : null; // for local multer storage
}

const denomD = 86400000; // 1000 * 60 * 60 * 24
export function calculateDays(start, end) {
  start = new Date(start);
  end = new Date(end);
  return Math.round((end - start) / denomD);
}

export function getDate(days) {
  const newDate = new Date();
  newDate.setDate(newDate.getDate() + days);
  return newDate;
}
