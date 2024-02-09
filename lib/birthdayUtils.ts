import { endOfDay } from "date-fns";

export function normalizeBirthday(birthday: Date): Date {
  const now = new Date();
  const currentYear = now.getFullYear();

  const thisYearBirthday = endOfDay(new Date(birthday));
  thisYearBirthday.setFullYear(currentYear);

  // If the birthday has already occurred this year, set it to next year
  if (thisYearBirthday < now) {
    thisYearBirthday.setFullYear(currentYear + 1);
  }

  return thisYearBirthday;
}