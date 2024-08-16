const CLASS_DURATION_MINUTES: number = 95;

const classStatus = (classStartTime: string): boolean => {
  try {
    const classStartDate: Date = new Date(classStartTime);

    if (Number.isNaN(classStartDate.getTime())) {
      return false;
    }

    const classEndDate: Date = new Date(
      classStartDate.getTime() + CLASS_DURATION_MINUTES * 60 * 1000,
    );
    const currentDate: Date = new Date();

    return currentDate >= classStartDate && currentDate < classEndDate;
  } catch (error) {
    return false;
  }
};

export default classStatus;
