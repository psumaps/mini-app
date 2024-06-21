const CLASS_DURATION_MINUTES: number = 95;

const classStatus = (classStartTime: string): boolean => {
  if (typeof classStartTime !== 'string') {
    throw new Error('Error');
  }
  const isoRegex: RegExp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/;
  if (!isoRegex.test(classStartTime)) {
    throw new Error('Error');
  }
  const classStartDate: Date = new Date(classStartTime);
  const classEndDate: Date = new Date(
    classStartDate.getTime() + CLASS_DURATION_MINUTES * 60 * 1000,
  );
  const currentDate: Date = new Date();
  return currentDate >= classStartDate && currentDate < classEndDate;
};

export default classStatus;
