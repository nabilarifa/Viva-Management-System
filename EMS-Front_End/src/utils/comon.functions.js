export const formatTimeFromSeconds = (seconds) => {
  const hours = Math.floor(seconds/3600);
  seconds -= hours * 3600;
  let minutes = Math.floor(seconds/60);
  seconds -= minutes * 60;
  if (minutes < 10) minutes = '0' + minutes;
  if (seconds < 10) seconds = '0' + seconds;
  return `${minutes} : ${seconds}`
  
}