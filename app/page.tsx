import { normalizeBirthday } from "@/lib/birthdayUtils";
import BirthdaysList from "../components/birthdaysList";
import { compareAsc } from "date-fns";

export const revalidate = 10;

export const metadata = {
  title: "ESG Geburtstage",
  description: "Liste der Geburtstage in der ESG Aachen",
}

export type User = {
  id: string;
  properties: {
    displayName: string;
    birthday: Date;
    roomNumber: string[];
  }
};

export default async function Home() {

  const response = await fetch(
      `${process.env.UCS_BASE_URL}/univention/udm/users/user/?filter=memberOf=cn=Bewohner,cn=Gruppen,cn=groups,dc=ac,dc=esg&properties=displayName&properties=roomNumber&properties=birthday`,
      {
        headers: {
          "Authorization": "Basic " + btoa(`${process.env.UCS_USERNAME}:${process.env.UCS_PASSWORD}`),
          "Accept": "application/json",
          // Accept-Language header is required, LDAP otherwise returns 406
          "Accept-Language": "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7"
        },
        credentials: "include",
      }
  );
  const usersResponse = await response.json();
  const rawUsers = usersResponse["_embedded"]["udm:object"];
  const rawUsersWithBirthday = rawUsers.filter((user: any) => user["properties"]["birthday"]); 

  const users: User[] = rawUsersWithBirthday.map((user: any) => ({
    id: user.id,
    properties: {
      displayName: user["properties"]["displayName"],
      birthday: normalizeBirthday(new Date(user["properties"]["birthday"])),
      roomNumber: user["properties"]["roomNumber"]
    }
  }));

  let sortedUsers = users.sort((a, b) => {
    if (!a.properties.birthday) return 1;
    if (!b.properties.birthday) return -1;
    return compareAsc(a.properties.birthday, b.properties.birthday);
  });

  return (
    <div className="flex flex-col items-center mt-4 sm:mt-8">
      <BirthdaysList users={sortedUsers} />
      <p className="w-full max-w-md text-sm mt-8 mb-4 text-stone-500">
        Fehlst Du? Du kannst Deine Daten <a href="https://account.intern.esg-aachen.de/univention/selfservice/#/selfservice/profile" className="font-semibold underline" target="_blank">hier</a> aktualisieren.
      </p>
    </div>
  );
}
