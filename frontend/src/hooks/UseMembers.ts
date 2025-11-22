import { useCallback, useEffect, useState } from "react";
import { getMemberById, type Member } from "../../api/member";

const BASIC_ID = "10762c5f-114a-442c-aadc-53aae291f407";
const PREMIUM_ID = "78c0d668-f986-439a-8132-0c816d466e7d";
const VIP_ID = "a914c4d2-7c2f-407e-a405-c60e2283b1b2";

export function useMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [basic, premium, vip] = await Promise.all([
        getMemberById(BASIC_ID),
        getMemberById(PREMIUM_ID),
        getMemberById(VIP_ID),
      ]);
      setMembers([basic, premium, vip]);
    } catch (err: any) {
      console.error(err);
      setError(err.message ?? "Failed to fetch members");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  return { members, loading, error, fetchMembers };
}
