const CLASS_DURATION_MINUTES = 95;

const classStatus = (classStartTime: string): boolean => {
  const classStartDate = new Date(classStartTime);
  const classEndDate = new Date(
    classStartDate.getTime() + CLASS_DURATION_MINUTES * 60 * 1000,
  );
  const currentDate = new Date();

  return currentDate >= classStartDate && currentDate < classEndDate;
};

export default classStatus;
