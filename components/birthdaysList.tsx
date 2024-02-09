"use client";

import { Label } from "@/components/ui/label";
import { User } from "../app/page";
import { Input } from "@/components/ui/input";
import { useDeferredValue, useEffect, useState } from "react";
import SearchableBirthdaysList from "./searchableBirthdaysList";
import { differenceInMilliseconds, startOfTomorrow } from "date-fns";

export default function BirthdaysList({ users }: { users: User[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Refresh the page at midnight
  useEffect(() => {
    let now = new Date();
    let timeUntilMidnight = differenceInMilliseconds(now, startOfTomorrow());

    let timeout = setTimeout(() => {
      setLastRefresh(new Date());
    }, timeUntilMidnight);
    
    return () => {
      clearTimeout(timeout);
    }
  }, [lastRefresh])

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="grid w-full items-center gap-1.5 pb-4 sm:pb-6">
        <Label htmlFor="search">Suche</Label>
        <Input
          id="search"
          type="search"
          placeholder="Suche"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <SearchableBirthdaysList users={users} searchQuery={deferredSearchQuery} />
    </div>
  );
}