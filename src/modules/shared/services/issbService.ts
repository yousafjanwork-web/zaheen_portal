export const syncIssbSession = async (zaheenUser: {
  id: string; name: string; email: string; msisdn: string;
}) => {
  const res = await fetch("https://api.zaheen.com.pk/testprep/api/auth/zaheen-sync", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      zaheen_id: zaheenUser.id,
      name:      zaheenUser.name,
      email:     zaheenUser.email,
      phone:     zaheenUser.msisdn,
    }),
  });
  const json = await res.json();
  if (!json?.success) throw new Error("ISSB sync failed");

  const issbAuth = {
    issbUserId: String(json.data.issb_user_id),
    zaheenId:   zaheenUser.id,
    msisdn:     zaheenUser.msisdn,
    name:       json.data.name || zaheenUser.name,
  };
  localStorage.setItem("issb_auth",    JSON.stringify(issbAuth));
  localStorage.setItem("issb_user_id", String(json.data.issb_user_id));
};