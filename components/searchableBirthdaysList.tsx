import uFuzzy from "@leeoniya/ufuzzy";
import { User } from "../app/page";
import Birthday from "./birtday";
import { AnimatePresence, motion } from "framer-motion";
import fragenderHahn from "@/assets/fragender-hahn.jpg";
import Image from "next/image";

export default function SearchableBirthdaysList({ users, searchQuery }: {
  users: User[],
  searchQuery: string
}) {
  let search = new uFuzzy({
    intraMode: 1
  });

  let filteredIds = search.filter(users.map(user => `${user.properties.displayName}¦${user.properties.roomNumber}`), searchQuery)
  let filteredUsers = searchQuery ? filteredIds?.map(id => users[id]) ?? [] : users;

  return (
    <div>
      {filteredUsers.length === 0 && (
        <>
          <h4 className="font-bold text-lg mb-2">Leider konnten wir die gesuchte Bewohner*in nicht finden.</h4>
          <Image
            src={fragenderHahn}
            alt="Fragender schauender Hahn"
            width={800}
            height={800}
            className="mx-auto"
          />
          <p>
            Profile ohne Geburtsdatum werden nicht angezeigt.
          </p>
        </>
      )}
      <ul className="space-y-4">
        <AnimatePresence mode="popLayout" initial={false}>
          {filteredUsers.map((user) => (
            <motion.li
              key={user.id}
              initial= {{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              layout
            >
              <Birthday user={user} />
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}