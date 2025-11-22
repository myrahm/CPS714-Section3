export type Member = {
  member_id: string,
  first_name: string,
  last_name: string,
  member_status: string
};

export async function getMemberById(memberId: string): Promise<Member> {
  const res = await fetch(`http://localhost:8000/members/${memberId}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch member ${memberId}`);
  }
  const data = await res.json();
  if (!data.success) {
    throw new Error(data.message);
  }

  const memberData = data.member;
  return {
    member_id: memberData.member_id,
    first_name: memberData.first_name,
    last_name: memberData.last_name,
    member_status: memberData.member_status,
  };
}
