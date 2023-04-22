const calculateYearsFromDate = (date: Date) => {
  var diff_ms = Date.now() - date.getTime();
  var age_dt = new Date(diff_ms);

  /* console.log('diff_ms', diff_ms); */
  /* console.log('age_dt', age_dt); */
  
  
  console.log('final', Math.abs(age_dt.getUTCFullYear() - 1970));
  
  return Math.abs(age_dt.getUTCFullYear() - 1970);
};

export default calculateYearsFromDate;
