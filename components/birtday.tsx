import { differenceInCalendarDays, format, isToday, isTomorrow } from "date-fns";
import { User } from "../app/page";
import { de } from "date-fns/locale";

export default function Birthday({ user }: { user: User}) {

  return (
    <div className="rounded-md bg-[#F4D7D9] p-4">
      <div className="flex items-center justify-between space-y-3">
        <div className="font-medium text-[#030202]">
          {user.properties.displayName}
        </div>
        <div className="text-right text-sm text-[#382E2F]">
          {user.properties.roomNumber?.join(", ") ?? "Unbekanntes Zimmer"}
        </div>
      </div>
      <div className="text-sm text-[#382E2F]">
        {renderBirthday(user.properties.birthday)}
      </div>
    </div>
  )
}

function renderBirthday(birthday: Date): string {
  let now = new Date();

  if (isToday(birthday)) {
    return `Heute 🎉 (${format(birthday, "EEEE", { locale: de })})`;
  }

  if (isTomorrow(birthday)) {
    return `Morgen (${format(birthday, "EEEE", { locale: de })})`;
  }

  if (differenceInCalendarDays(birthday, now) < 7) {
    return `In ${differenceInCalendarDays(birthday, now)} Tagen (${format(birthday, "EEEE", { locale: de })})`;
  }

  return format(birthday, "eee, dd. MMMM", { locale: de });
}