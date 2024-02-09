import { differenceInCalendarDays, format, isToday, isTomorrow } from "date-fns";
import { User } from "../app/page";
import { de } from "date-fns/locale";
import { useWindowSize } from "react-use";
import dynamic from "next/dynamic";

const Confetti = dynamic(() => import("react-confetti"), { ssr: false });

export default function Birthday({ user }: { user: User}) {
  const { width } = useWindowSize();

  return (
    <div className="rounded-md bg-[#F4D7D9] p-4">
      {isToday(user.properties.birthday) && (
          <Confetti 
            className="w-full"
            width={width}
            height={document.body.scrollHeight}
            numberOfPieces={50}
            tweenDuration={75000}
            opacity={0.4}
          />
      )}
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